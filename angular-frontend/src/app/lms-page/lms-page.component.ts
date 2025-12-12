import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Resource,
  Skill,
  Note,
  Task,
  LibraryItem,
  LibraryCreateType
} from '../../models.interface';
import {
  mockSkillsLMS,
  mockNotes,
  mockResourcesData,
  mockRecentActivities
} from '../../services/test.data';
import { SkillService } from '../../services/skill.service';
import { NoteService } from '../../services/notes.service';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-lms-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lms-page.component.html',
  styleUrls: ['./lms-page.component.css']
})
export class LmsPageComponent implements OnInit, OnDestroy {
  // Library state
  libraryItems: LibraryItem[] = [];
  selectedLibraryItem: LibraryItem | null = null;
  currentFolderId: string | null = null;
  expandedFolders: Set<string> = new Set(['root']);

  // AI Chat state
  aiPrompt: string = '';
  aiConversation: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  isAiLoading: boolean = false;

  // Data
  skills: Skill[] = [];
  recentActivities: Task[] = [];
  notes: Note[] = [];

  // Stats (derived from actual data)
  activeCourses: number = 0;
  studyHours: number = 0;
  skillsMastered: number = 0;
  avgProgress: number = 0;
  totalNotes: number = 0;
  totalAttachments: number = 0;

  loading = false;

  // Context menu state
  contextMenuPosition = { x: 0, y: 0 };
  showContextMenu = false;
  contextMenuItem: LibraryItem | null = null;

  // Create/Edit modal state
  showCreateModal = false;
  createModalType: LibraryCreateType = 'folder';
  editingItem: LibraryItem | null = null;
  modalItemName: string = '';
  showCreateMenu = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private skillService: SkillService,
    private noteService: NoteService,
    private resourceService: ResourceService
  ) {}

  ngOnInit() {
    this.loadLMSData();
    this.initializeLibrary();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.showCreateMenu = false;
  }

  loadLMSData() {
    this.loading = true;

    // Load skills
    this.skillService.getAllSkills()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (skills) => {
          this.skills = skills;
        },
        error: (err) => console.error('Failed to load skills:', err)
      });

    // Load notes
    this.noteService.getAllNotes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notes) => {
          this.notes = notes;
          this.totalNotes = notes.length;
          this.totalAttachments = notes.reduce((total, note) => total + (note.attachments?.length || 0), 0);
        },
        error: (err) => console.error('Failed to load notes:', err)
      });

    // Load resources
    this.resourceService.getAllResources()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resources) => {
          this.calculateStats();
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load resources:', err);
          this.loading = false;
        }
      });
  }

  initializeLibrary() {
    this.libraryItems = [
      {
        id: 'root',
        name: 'My Library',
        type: 'folder',
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        children: this.buildLibraryTree()
      }
    ];
  }

  buildLibraryTree(): LibraryItem[] {
    const items: LibraryItem[] = [];

    mockResourcesData.forEach(resource => {
      const folderItem: LibraryItem = {
        id: resource.id,
        name: resource.name,
        type: 'folder',
        dateCreated: resource.dateCreated || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        icon: '📁',
        children: []
      };

      if (resource.children) {
        folderItem.children = resource.children.map(child => ({
          id: child.id,
          name: child.name,
          type: 'resource' as LibraryCreateType,
          parentId: resource.id,
          dateCreated: child.dateCreated || new Date().toISOString(),
          lastModified: new Date().toISOString(),
          icon: '📚'
        }));
      }

      items.push(folderItem);
    });

    mockNotes.forEach(note => {
      items.push({
        id: note.id,
        name: note.name,
        type: 'note',
        dateCreated: note.dateCreated || new Date().toISOString(),
        lastModified: note.lastModified || new Date().toISOString(),
        icon: '📝'
      });
    });

    return items;
  }

  calculateStats() {
    this.activeCourses = mockResourcesData.reduce(
      (count, resource) => count + (resource.children?.length || 0),
      0
    );

    this.studyHours = mockResourcesData.reduce((total, resource) => {
      const resourceHours = resource.children?.reduce(
        (sum, child) => sum + (child.totalHours || 0),
        0
      ) || 0;
      return total + resourceHours;
    }, 0);

    this.skillsMastered = this.skills.filter(skill => skill.level >= 75).length;

    const allCourses = mockResourcesData.flatMap(r => r.children || []);
    if (allCourses.length > 0) {
      this.avgProgress = Math.round(
        allCourses.reduce((sum, course) => sum + course.progress, 0) / allCourses.length
      );
    }
  }

  toggleFolder(item: any) {
    if (item.type !== 'folder') return;
    if (this.expandedFolders.has(item.id)) {
      this.expandedFolders.delete(item.id);
    } else {
      this.expandedFolders.add(item.id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedFolders.has(id);
  }

  selectItem(item: LibraryItem, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    this.selectedLibraryItem = item;

    if (item.type === 'folder') {
      this.toggleFolder(item);
      this.currentFolderId = item.id;
    } else if (item.type === 'resource') {
      this.navigateToResource(item.id);
    } else if (item.type === 'note') {
      this.navigateToNote(item.id);
    }
  }

  getItemIcon(type: string): string {
    const icons: { [key: string]: string } = {
      folder: '📁',
      note: '📝',
      resource: '📚',
      pdf: '📄',
      image: '🖼️',
      video: '🎥',
      audio: '🎵',
      ppt: '📊'
    };
    return icons[type] || '📄';
  }

  getItemPaddingLeft(level: number): string {
    return `${level * 20 + 8}px`;
  }

  showItemContextMenu(event: MouseEvent, item: LibraryItem) {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuItem = item;
    this.showContextMenu = true;
  }

  hideContextMenu() {
    this.showContextMenu = false;
    this.contextMenuItem = null;
  }

  openCreateModal(type: LibraryCreateType) {
    this.createModalType = type;
    this.modalItemName = '';
    this.editingItem = null;
    this.showCreateModal = true;
  }

  openEditModal(item: LibraryItem) {
    this.editingItem = item;
    this.modalItemName = item.name;
    this.createModalType = item.type === 'folder' ? 'folder' : 'note';
    this.showCreateModal = true;
    this.hideContextMenu();
  }

  closeModal() {
    this.showCreateModal = false;
    this.editingItem = null;
    this.modalItemName = '';
  }

  saveItem() {
    if (!this.modalItemName.trim()) return;

    if (this.editingItem) {
      this.editingItem.name = this.modalItemName;
      this.editingItem.lastModified = new Date().toISOString();
    } else {
      const newItem: LibraryItem = {
        id: `item-${Date.now()}`,
        name: this.modalItemName,
        type: this.createModalType,
        parentId: this.currentFolderId || 'root',
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      if (this.currentFolderId) {
        const parent = this.findItemById(this.currentFolderId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(newItem);
        }
      } else {
        const root = this.findItemById('root');
        if (root) {
          if (!root.children) root.children = [];
          root.children.push(newItem);
        }
      }

      if (this.createModalType === 'note') {
        this.navigateToNote(newItem.id);
      } else if (this.createModalType === 'resource') {
        this.navigateToResource(newItem.id);
      }
    }

    this.closeModal();
  }

  deleteItem(item: LibraryItem) {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    this.removeItemFromLibrary(item.id);
    this.hideContextMenu();
  }

  duplicateItem(item: LibraryItem) {
    const duplicate: LibraryItem = {
      ...item,
      id: `item-${Date.now()}`,
      name: `${item.name} (Copy)`,
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const parent = this.findParentItem(item.id);
    if (parent?.children) {
      parent.children.push(duplicate);
    }

    this.hideContextMenu();
  }

  findItemById(id: string, items: LibraryItem[] = this.libraryItems): LibraryItem | null {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = this.findItemById(id, item.children);
        if (found) return found;
      }
    }
    return null;
  }

  findParentItem(childId: string, items: LibraryItem[] = this.libraryItems): LibraryItem | null {
    for (const item of items) {
      if (item.children?.some(child => child.id === childId)) {
        return item;
      }
      if (item.children) {
        const found = this.findParentItem(childId, item.children);
        if (found) return found;
      }
    }
    return null;
  }

  removeItemFromLibrary(id: string, items: LibraryItem[] = this.libraryItems): boolean {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items.splice(i, 1);
        return true;
      }
      if (items[i].children) {
        if (this.removeItemFromLibrary(id, items[i].children!)) {
          return true;
        }
      }
    }
    return false;
  }

  async sendAIMessage() {
    if (!this.aiPrompt.trim() || this.isAiLoading) return;

    const userMessage = this.aiPrompt.trim();
    this.aiConversation.push({ role: 'user', content: userMessage });
    this.aiPrompt = '';
    this.isAiLoading = true;

    setTimeout(() => {
      this.aiConversation.push({
        role: 'assistant',
        content: `I received your message: "${userMessage}". This is a simulated response.`
      });
      this.isAiLoading = false;
    }, 1000);
  }

  clearAIConversation() {
    this.aiConversation = [];
  }

  navigateToResource(courseId: string) {
    this.router.navigate(['/resource', courseId]);
  }

  navigateToNote(noteId: string) {
    this.router.navigate(['/notes-details', noteId]);
  }

  navigateToNewNote() {
    this.router.navigate(['/notes/new']);
  }

  navigateToSkillProgress(skillId: string) {
    this.router.navigate(['/skill-progress', skillId]);
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  getProgressBarWidth(skill: Skill): string {
    return `${skill.level}%`;
  }

  getTargetPosition(skill: Skill): string {
    return `${skill.targetLevel}%`;
  }

  handleItemClick(item: any, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }

    this.selectedLibraryItem = item;

    if (item.type === 'folder') {
      this.toggleFolder(item);
      this.currentFolderId = item.id;
      return;
    }

    if (item.type === 'note') {
      this.navigateToNote(item.id);
      return;
    }

    if (item.type === 'resource') {
      this.navigateToResource(item.id);
      return;
    }

    console.warn('Unknown item type:', item);
  }

  openActivity(activity: any) {
    switch (activity.type) {
      case 'resource':
        this.navigateToResource(activity.id);
        break;
      case 'notes':
        this.navigateToNote(activity.id);
        break;
    }
  }

  toggleCreateMenu() {
    this.showCreateMenu = !this.showCreateMenu;
  }

  selectCreateOption(type: LibraryCreateType) {
    this.showCreateMenu = false;
    this.openCreateModal(type);
  }
}


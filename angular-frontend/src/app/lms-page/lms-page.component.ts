import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Course,
  StudyMaterial,
  Skill,
  LearningActivity,
  Note
} from '../../models.interface';
import { BaseService } from '../../services/base_service';
import { MockLMSService } from '../../services/lms_service';
import {
  mockCourses,
  mockStudyMaterials,
  mockSkills,
  mockLearningActivities,
  mockNotes,
  mockSkillsLMS
} from '../../services/test.data';

interface LibraryItem {
  id: string;
  name: string;
  type: 'folder' | 'note' | 'course' | 'pdf' | 'image' | 'video' | 'audio' | 'ppt';
  parentId?: string;
  children?: LibraryItem[];
  dateCreated: string;
  lastModified: string;
  size?: number;
  icon?: string;
}

@Component({
  selector: 'app-lms-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lms-page.component.html',
  styleUrls: ['./lms-page.component.css']
})
export class LmsPageComponent implements OnInit {
  // Library state
  libraryItems: LibraryItem[] = [];
  selectedLibraryItem: LibraryItem | null = null;
  currentFolderId: string | null = null;
  expandedFolders: Set<string> = new Set(['root']);

  // AI Chat state
  aiPrompt: string = '';
  aiConversation: Array<{role: 'user' | 'assistant', content: string}> = [];
  isAiLoading: boolean = false;

  // Data
  skills: Skill[] = [];
  recentActivities: LearningActivity[] = [];
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
  createModalType: 'folder' | 'note' = 'folder';
  editingItem: LibraryItem | null = null;
  modalItemName: string = '';

  constructor(
    private router: Router,
    @Inject('LMSServiceToken') private lmsService: BaseService<Course>
  ) {}

  ngOnInit() {
    this.loadLMSData();
    this.initializeLibrary();
  }

  async loadLMSData() {
    this.loading = true;

    try {
      // Initialize mock service with data if using mock
      if (this.lmsService instanceof MockLMSService) {
        (this.lmsService as MockLMSService).setCourses(mockCourses);
        (this.lmsService as MockLMSService).setStudyMaterials(mockStudyMaterials);
        (this.lmsService as MockLMSService).setSkills(mockSkills);
        (this.lmsService as MockLMSService).setActivities(mockLearningActivities);
      }

      // Load skills
      this.skills = mockSkillsLMS;



      // Load recent activities
      const activitiesResult = (this.lmsService as any).getRecentActivities();
      if (activitiesResult instanceof Promise) {
        this.recentActivities = await activitiesResult;
      } else {
        activitiesResult.subscribe((data: LearningActivity[]) => {
          this.recentActivities = data;
        });
      }

      // Load notes
      this.notes = mockNotes;

      // Calculate stats from actual data
      this.calculateStats();

    } catch (error) {
      console.error('Failed to load LMS data:', error);
    } finally {
      this.loading = false;
    }
  }

  initializeLibrary() {
    // Initialize library with courses and notes
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

    // Add courses from mock data
    mockCourses.forEach(course => {
      if (course.type === 'folder' && !course.parentId) {
        items.push({
          id: course.id,
          name: course.name,
          type: 'folder',
          dateCreated: course.dateCreated || new Date().toISOString(),
          lastModified: new Date().toISOString(),
          children: this.buildCourseChildren(course)
        });
      }
    });

    // Add notes from mock data
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

  buildCourseChildren(course: Course): LibraryItem[] {
    const children: LibraryItem[] = [];

    // Add child courses/folders
    if (course.children) {
      course.children.forEach(child => {
        children.push({
          id: child.id,
          name: child.name,
          type: child.type === 'folder' ? 'folder' : 'course',
          parentId: course.id,
          dateCreated: child.dateCreated || new Date().toISOString(),
          lastModified: new Date().toISOString(),
          icon: child.type === 'course' ? '📚' : '📁'
        });
      });
    }

    return children;
  }

  calculateStats() {
    // Active courses - courses with progress > 0 and < 100
    this.activeCourses = mockCourses.filter(c =>
      c.type === 'course' && c.progress > 0 && c.progress < 100
    ).length;

    // Total study hours from courses
    this.studyHours = mockCourses
      .filter(c => c.type === 'course')
      .reduce((sum, c) => sum + (c.totalHours || 0) * (c.progress / 100), 0);
    this.studyHours = Math.round(this.studyHours);

    // Skills mastered - skills at or above target level
    this.skillsMastered = this.skills.filter(s => s.level >= s.targetLevel).length;

    // Average progress across all courses
    const courses = mockCourses.filter(c => c.type === 'course');
    if (courses.length > 0) {
      this.avgProgress = Math.round(
        courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
      );
    }

    // Total notes and attachments
    this.totalNotes = mockNotes.length;
    this.totalAttachments = mockNotes.reduce((sum, note) =>
      sum + (note.attachments?.length || 0), 0
    );
  }

  // Library operations
  toggleFolder(folderId: string) {
    if (this.expandedFolders.has(folderId)) {
      this.expandedFolders.delete(folderId);
    } else {
      this.expandedFolders.add(folderId);
    }
  }

  isExpanded(folderId: string): boolean {
    return this.expandedFolders.has(folderId);
  }

  selectItem(item: LibraryItem) {
    this.selectedLibraryItem = item;

    if (item.type === 'folder') {
      this.toggleFolder(item.id);
      this.currentFolderId = item.id;
    } else if (item.type === 'course') {
      this.navigateToResource(item.id);
    } else if (item.type === 'note') {
      this.navigateToNote(item.id);
    }
  }

  getItemIcon(type: string): string {
    const icons: {[key: string]: string} = {
      'folder': '📁',
      'note': '📝',
      'course': '📚',
      'pdf': '📄',
      'image': '🖼️',
      'video': '🎥',
      'audio': '🎵',
      'ppt': '📊'
    };
    return icons[type] || '📄';
  }

  getItemPaddingLeft(level: number): string {
    return `${level * 20 + 8}px`;
  }

  // Context menu
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

  // CRUD operations
  openCreateModal(type: 'folder' | 'note') {
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
      // Edit existing item
      this.editingItem.name = this.modalItemName;
      this.editingItem.lastModified = new Date().toISOString();
    } else {
      // Create new item
      const newItem: LibraryItem = {
        id: `item-${Date.now()}`,
        name: this.modalItemName,
        type: this.createModalType,
        parentId: this.currentFolderId || 'root',
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      // Add to library
      if (this.currentFolderId) {
        const parent = this.findItemById(this.currentFolderId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(newItem);
        }
      } else {
        this.libraryItems[0].children?.push(newItem);
      }

      // Navigate to new note if it's a note
      if (this.createModalType === 'note') {
        this.navigateToNote(newItem.id);
      }
    }

    this.closeModal();
  }

  deleteItem(item: LibraryItem) {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    // Find and remove item from library
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

    // Add duplicate next to original
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

  // AI Chat
  async sendAIMessage() {
    if (!this.aiPrompt.trim() || this.isAiLoading) return;

    const userMessage = this.aiPrompt.trim();
    this.aiConversation.push({ role: 'user', content: userMessage });
    this.aiPrompt = '';
    this.isAiLoading = true;

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      this.aiConversation.push({
        role: 'assistant',
        content: `I received your message: "${userMessage}". This is a simulated response. In production, this would connect to an AI service.`
      });
      this.isAiLoading = false;
    }, 1000);
  }

  clearAIConversation() {
    this.aiConversation = [];
  }

  // Navigation
  navigateToResource(courseId: string) {
    this.router.navigate(['/resource', courseId]);
  }

  navigateToNote(noteId: string) {
    this.router.navigate(['/notes-details', noteId]);
  }

  navigateToNewNote() {
    this.router.navigate(['/lms/note/new']);
  }


  navigateToSkillProgress(skillId: string)
  {
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

  handleItemClick(item: any) {
    console.log("Handling item click")
  if (item.type === 'folder') {
    this.toggleFolder(item.id);
  } else if (item.type === 'note') {
    this.navigateToNote(item.id);
  } else if (item.type === 'resource') {
    this.navigateToResource(item.id);
  }

  this.selectItem(item);
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

}


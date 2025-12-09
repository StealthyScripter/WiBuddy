import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import { LearningContent, UUID, ContentType, Note, Attachment } from '../models.interface';

// ============= Store Class =============

class ContentStore {
  private contents: Map<UUID, LearningContent> = new Map();
  private contentsList: LearningContent[] = [];

  add(content: LearningContent): void {
    this.contents.set(content.id, content);
    this.contentsList.push(content);
  }

  update(id: UUID, content: Partial<LearningContent>): void {
    const existing = this.contents.get(id);
    if (existing) {
      const updated = { ...existing, ...content, lastModified: new Date().toISOString() };
      this.contents.set(id, updated);
      const index = this.contentsList.findIndex(c => c.id === id);
      if (index !== -1) {
        this.contentsList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.contents.delete(id);
    this.contentsList = this.contentsList.filter(c => c.id !== id);
  }

  get(id: UUID): LearningContent | undefined {
    return this.contents.get(id);
  }

  getByModuleId(moduleId: UUID): LearningContent[] {
    return this.contentsList.filter(c => c.moduleId === moduleId);
  }

  getAll(): LearningContent[] {
    return [...this.contentsList];
  }

  clear(): void {
    this.contents.clear();
    this.contentsList = [];
  }
}

// ============= Logger =============

interface ILogger {
  log(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
}

class ConsoleLogger implements ILogger {
  log(message: string, ...args: any[]): void {
    console.log(`[ContentManagementService] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[ContentManagementService] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[ContentManagementService] ${message}`, ...args);
  }
}

// ============= Date Provider =============

class DateProvider {
  now(): string {
    return new Date().toISOString();
  }
}

// ============= Content Filter Engine =============

interface ContentFilterOptions {
  type?: ContentType;
  isCompleted?: boolean;
  tags?: string[];
  searchQuery?: string;
  hasAISummary?: boolean;
  hasFlashcards?: boolean;
}

class ContentFilterEngine {
  filter(contents: LearningContent[], options: ContentFilterOptions): LearningContent[] {
    let filtered = [...contents];

    if (options.type) {
      filtered = filtered.filter(c => c.type === options.type);
    }

    if (options.isCompleted !== undefined) {
      filtered = filtered.filter(c => c.isCompleted === options.isCompleted);
    }

    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter(c =>
        c.tags?.some(tag => options.tags!.includes(tag))
      );
    }

    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
      );
    }

    if (options.hasAISummary !== undefined) {
      filtered = filtered.filter(c =>
        options.hasAISummary ? !!c.aiSummary : !c.aiSummary
      );
    }

    if (options.hasFlashcards !== undefined) {
      filtered = filtered.filter(c =>
        options.hasFlashcards ? c.flashcards && c.flashcards.length > 0 : !c.flashcards || c.flashcards.length === 0
      );
    }

    return filtered;
  }
}

// ============= Main Service =============

@Injectable({
  providedIn: 'root'
})
export class ContentManagementService {
  private contentStore = new ContentStore();
  private logger: ILogger = new ConsoleLogger();
  private dateProvider = new DateProvider();
  private filterEngine = new ContentFilterEngine();

  // Observables
  private contentsSubject = new BehaviorSubject<LearningContent[]>([]);
  public contents$ = this.contentsSubject.asObservable().pipe(distinctUntilChanged());

  // Error subject
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {
    this.logger.log('ContentManagementService initialized');
  }

  // ============= CRUD Operations =============

  createContent(contentData: Omit<LearningContent, 'id' | 'dateCreated' | 'lastModified'>): LearningContent {
    try {
      const content: LearningContent = {
        ...contentData,
        id: this.generateId(),
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now(),
        notes: contentData.notes || [],
        attachments: contentData.attachments || [],
        images: contentData.images || [],
        flashcards: contentData.flashcards || [],
        questions: contentData.questions || [],
        annotations: contentData.annotations || [],
        isCompleted: contentData.isCompleted || false,
        tags: contentData.tags || []
      };

      this.contentStore.add(content);
      this.contentsSubject.next(this.contentStore.getAll());
      this.logger.log('Content created:', content.name);

      return content;
    } catch (error) {
      this.handleError('Failed to create content', error);
      throw error;
    }
  }

  updateContent(id: UUID, updates: Partial<LearningContent>): void {
    try {
      this.contentStore.update(id, updates);
      this.contentsSubject.next(this.contentStore.getAll());
      this.logger.log('Content updated:', id);
    } catch (error) {
      this.handleError('Failed to update content', error);
      throw error;
    }
  }

  deleteContent(id: UUID): void {
    try {
      this.contentStore.delete(id);
      this.contentsSubject.next(this.contentStore.getAll());
      this.logger.log('Content deleted:', id);
    } catch (error) {
      this.handleError('Failed to delete content', error);
      throw error;
    }
  }

  getContentById(id: UUID): LearningContent | undefined {
    return this.contentStore.get(id);
  }

  getContentsByModule(moduleId: UUID): LearningContent[] {
    return this.contentStore.getByModuleId(moduleId).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  getAllContents(): LearningContent[] {
    return this.contentStore.getAll();
  }

  // ============= Content Material Management =============

  addNoteToContent(contentId: UUID, note: Note): void {
    const content = this.contentStore.get(contentId);
    if (!content) {
      throw new Error(`Content with id ${contentId} not found`);
    }

    const notes = content.notes || [];
    notes.push(note);
    this.updateContent(contentId, { notes });
    this.logger.log('Note added to content:', contentId);
  }

  removeNoteFromContent(contentId: UUID, noteId: UUID): void {
    const content = this.contentStore.get(contentId);
    if (!content) {
      throw new Error(`Content with id ${contentId} not found`);
    }

    const notes = (content.notes || []).filter(n => n.id !== noteId);
    this.updateContent(contentId, { notes });
    this.logger.log('Note removed from content:', contentId);
  }

  addAttachmentToContent(contentId: UUID, attachment: Attachment): void {
    const content = this.contentStore.get(contentId);
    if (!content) {
      throw new Error(`Content with id ${contentId} not found`);
    }

    const attachments = content.attachments || [];
    attachments.push(attachment);
    this.updateContent(contentId, { attachments });
    this.logger.log('Attachment added to content:', contentId);
  }

  removeAttachmentFromContent(contentId: UUID, attachmentId: UUID): void {
    const content = this.contentStore.get(contentId);
    if (!content) {
      throw new Error(`Content with id ${contentId} not found`);
    }

    const attachments = (content.attachments || []).filter(a => a.id !== attachmentId);
    this.updateContent(contentId, { attachments });
    this.logger.log('Attachment removed from content:', contentId);
  }

  addImageToContent(contentId: UUID, imageUrl: string): void {
    const content = this.contentStore.get(contentId);
    if (!content) {
      throw new Error(`Content with id ${contentId} not found`);
    }

    const images = content.images || [];
    images.push(imageUrl);
    this.updateContent(contentId, { images });
    this.logger.log('Image added to content:', contentId);
  }

  removeImageFromContent(contentId: UUID, imageUrl: string): void {
    const content = this.contentStore.get(contentId);
    if (!content) {
      throw new Error(`Content with id ${contentId} not found`);
    }

    const images = (content.images || []).filter(img => img !== imageUrl);
    this.updateContent(contentId, { images });
    this.logger.log('Image removed from content:', contentId);
  }

  // ============= Grouping & Organization =============

  groupContentsByType(moduleId: UUID): Record<ContentType, LearningContent[]> {
    const contents = this.getContentsByModule(moduleId);
    const grouped: Record<string, LearningContent[]> = {};

    contents.forEach(content => {
      if (!grouped[content.type]) {
        grouped[content.type] = [];
      }
      grouped[content.type].push(content);
    });

    return grouped as Record<ContentType, LearningContent[]>;
  }

  groupContentsByTag(moduleId: UUID): Record<string, LearningContent[]> {
    const contents = this.getContentsByModule(moduleId);
    const grouped: Record<string, LearningContent[]> = {};

    contents.forEach(content => {
      content.tags?.forEach(tag => {
        if (!grouped[tag]) {
          grouped[tag] = [];
        }
        grouped[tag].push(content);
      });
    });

    return grouped;
  }

  reorderContent(contentId: UUID, newOrder: number): void {
    this.updateContent(contentId, { order: newOrder });
  }

  bulkReorderContents(contentOrders: { contentId: UUID; order: number }[]): void {
    contentOrders.forEach(({ contentId, order }) => {
      this.updateContent(contentId, { order });
    });
  }

  // ============= Completion & Progress =============

  markContentComplete(contentId: UUID): void {
    this.updateContent(contentId, {
      isCompleted: true,
      lastAccessedDate: this.dateProvider.now()
    });
    this.logger.log('Content marked as complete:', contentId);
  }

  markContentIncomplete(contentId: UUID): void {
    this.updateContent(contentId, { isCompleted: false });
    this.logger.log('Content marked as incomplete:', contentId);
  }

  updateLastAccessed(contentId: UUID): void {
    this.updateContent(contentId, {
      lastAccessedDate: this.dateProvider.now()
    });
  }

  // ============= Search & Filter =============

  searchContents(query: string): LearningContent[] {
    const lowerQuery = query.toLowerCase();
    return this.contentStore.getAll().filter(content =>
      content.name.toLowerCase().includes(lowerQuery) ||
      content.description?.toLowerCase().includes(lowerQuery) ||
      content.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  filterContents(options: ContentFilterOptions): LearningContent[] {
    const allContents = this.contentStore.getAll();
    return this.filterEngine.filter(allContents, options);
  }

  filterContentsByModule(moduleId: UUID, options: ContentFilterOptions): LearningContent[] {
    const moduleContents = this.getContentsByModule(moduleId);
    return this.filterEngine.filter(moduleContents, options);
  }

  // ============= Statistics =============

  getContentStatistics(moduleId?: UUID) {
    const contents = moduleId
      ? this.getContentsByModule(moduleId)
      : this.contentStore.getAll();

    const totalContents = contents.length;
    const completedContents = contents.filter(c => c.isCompleted).length;
    const withAISummary = contents.filter(c => !!c.aiSummary).length;
    const withFlashcards = contents.filter(c => c.flashcards && c.flashcards.length > 0).length;
    const withQuestions = contents.filter(c => c.questions && c.questions.length > 0).length;
    const withAnnotations = contents.filter(c => c.annotations && c.annotations.length > 0).length;

    const contentsByType = contents.reduce((acc, content) => {
      acc[content.type] = (acc[content.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalNotes = contents.reduce((sum, c) => sum + (c.notes?.length || 0), 0);
    const totalAttachments = contents.reduce((sum, c) => sum + (c.attachments?.length || 0), 0);
    const totalImages = contents.reduce((sum, c) => sum + (c.images?.length || 0), 0);

    return {
      totalContents,
      completedContents,
      withAISummary,
      withFlashcards,
      withQuestions,
      withAnnotations,
      contentsByType,
      totalNotes,
      totalAttachments,
      totalImages,
      completionRate: totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0
    };
  }

  getRecentlyAccessedContents(limit: number = 10): LearningContent[] {
    return this.contentStore.getAll()
      .filter(c => c.lastAccessedDate)
      .sort((a, b) => {
        const dateA = new Date(a.lastAccessedDate!).getTime();
        const dateB = new Date(b.lastAccessedDate!).getTime();
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  getIncompleteContents(moduleId?: UUID): LearningContent[] {
    const contents = moduleId
      ? this.getContentsByModule(moduleId)
      : this.contentStore.getAll();

    return contents.filter(c => !c.isCompleted);
  }

  // ============= Tags Management =============

  getAllTags(): string[] {
    const tags = new Set<string>();
    this.contentStore.getAll().forEach(content => {
      content.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  addTagToContent(contentId: UUID, tag: string): void {
    const content = this.contentStore.get(contentId);
    if (!content) {
      throw new Error(`Content with id ${contentId} not found`);
    }

    const tags = content.tags || [];
    if (!tags.includes(tag)) {
      tags.push(tag);
      this.updateContent(contentId, { tags });
    }
  }

  removeTagFromContent(contentId: UUID, tag: string): void {
    const content = this.contentStore.get(contentId);
    if (!content) {
      throw new Error(`Content with id ${contentId} not found`);
    }

    const tags = (content.tags || []).filter(t => t !== tag);
    this.updateContent(contentId, { tags });
  }

  // ============= Utility Methods =============

  private generateId(): UUID {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleError(message: string, error: any): void {
    this.logger.error(message, error);
    this.errorSubject.next(message);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  // ============= Data Management =============

  setInitialData(contents: LearningContent[]): void {
    this.contentStore.clear();
    contents.forEach(content => this.contentStore.add(content));
    this.contentsSubject.next(this.contentStore.getAll());
    this.logger.log(`Initialized with ${contents.length} contents`);
  }

  clearAllData(): void {
    this.contentStore.clear();
    this.contentsSubject.next([]);
    this.logger.log('All data cleared');
  }
}

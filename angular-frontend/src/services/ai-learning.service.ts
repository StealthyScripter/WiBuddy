import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import {
  Flashcard,
  Question,
  CheatSheet,
  CheatSheetSection,
  UUID,
  Priority,
  LearningContent
} from '../models.interface';

// ============= Store Classes =============

class FlashcardStore {
  private flashcards: Map<UUID, Flashcard> = new Map();
  private flashcardsList: Flashcard[] = [];

  add(flashcard: Flashcard): void {
    this.flashcards.set(flashcard.id, flashcard);
    this.flashcardsList.push(flashcard);
  }

  update(id: UUID, flashcard: Partial<Flashcard>): void {
    const existing = this.flashcards.get(id);
    if (existing) {
      const updated = { ...existing, ...flashcard, lastModified: new Date().toISOString() };
      this.flashcards.set(id, updated);
      const index = this.flashcardsList.findIndex(f => f.id === id);
      if (index !== -1) {
        this.flashcardsList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.flashcards.delete(id);
    this.flashcardsList = this.flashcardsList.filter(f => f.id !== id);
  }

  get(id: UUID): Flashcard | undefined {
    return this.flashcards.get(id);
  }

  getByContentId(contentId: UUID): Flashcard[] {
    return this.flashcardsList.filter(f => f.contentId === contentId);
  }

  getAll(): Flashcard[] {
    return [...this.flashcardsList];
  }

  clear(): void {
    this.flashcards.clear();
    this.flashcardsList = [];
  }
}

class QuestionStore {
  private questions: Map<UUID, Question> = new Map();
  private questionsList: Question[] = [];

  add(question: Question): void {
    this.questions.set(question.id, question);
    this.questionsList.push(question);
  }

  update(id: UUID, question: Partial<Question>): void {
    const existing = this.questions.get(id);
    if (existing) {
      const updated = { ...existing, ...question, lastModified: new Date().toISOString() };
      this.questions.set(id, updated);
      const index = this.questionsList.findIndex(q => q.id === id);
      if (index !== -1) {
        this.questionsList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.questions.delete(id);
    this.questionsList = this.questionsList.filter(q => q.id !== id);
  }

  get(id: UUID): Question | undefined {
    return this.questions.get(id);
  }

  getByContentId(contentId: UUID): Question[] {
    return this.questionsList.filter(q => q.contentId === contentId);
  }

  getByModuleId(moduleId: UUID): Question[] {
    return this.questionsList.filter(q => q.moduleId === moduleId);
  }

  getAll(): Question[] {
    return [...this.questionsList];
  }

  clear(): void {
    this.questions.clear();
    this.questionsList = [];
  }
}

class CheatSheetStore {
  private cheatSheets: Map<UUID, CheatSheet> = new Map();
  private cheatSheetsList: CheatSheet[] = [];

  add(cheatSheet: CheatSheet): void {
    this.cheatSheets.set(cheatSheet.id, cheatSheet);
    this.cheatSheetsList.push(cheatSheet);
  }

  update(id: UUID, cheatSheet: Partial<CheatSheet>): void {
    const existing = this.cheatSheets.get(id);
    if (existing) {
      const updated = { ...existing, ...cheatSheet, lastUpdated: new Date().toISOString() };
      this.cheatSheets.set(id, updated);
      const index = this.cheatSheetsList.findIndex(cs => cs.id === id);
      if (index !== -1) {
        this.cheatSheetsList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.cheatSheets.delete(id);
    this.cheatSheetsList = this.cheatSheetsList.filter(cs => cs.id !== id);
  }

  get(id: UUID): CheatSheet | undefined {
    return this.cheatSheets.get(id);
  }

  getAll(): CheatSheet[] {
    return [...this.cheatSheetsList];
  }

  clear(): void {
    this.cheatSheets.clear();
    this.cheatSheetsList = [];
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
    console.log(`[AILearningService] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[AILearningService] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[AILearningService] ${message}`, ...args);
  }
}

// ============= Date Provider =============

class DateProvider {
  now(): string {
    return new Date().toISOString();
  }
}

// ============= Spaced Repetition Algorithm =============

class SpacedRepetitionEngine {
  calculateNextReviewDate(
    confidenceLevel: number,
    reviewCount: number,
    lastReviewDate?: string
  ): string {
    // Simple SM-2 inspired algorithm
    const baseDate = lastReviewDate ? new Date(lastReviewDate) : new Date();
    let intervalDays = 1;

    if (confidenceLevel >= 80) {
      intervalDays = Math.min(30, Math.pow(2, reviewCount));
    } else if (confidenceLevel >= 60) {
      intervalDays = Math.min(14, reviewCount + 1);
    } else if (confidenceLevel >= 40) {
      intervalDays = 1;
    } else {
      intervalDays = 0.5; // Review later today
    }

    const nextDate = new Date(baseDate);
    nextDate.setDate(nextDate.getDate() + intervalDays);
    return nextDate.toISOString();
  }

  getCardsForReview(flashcards: Flashcard[]): Flashcard[] {
    const now = new Date();
    return flashcards.filter(card => {
      if (!card.nextReviewDate) return true;
      return new Date(card.nextReviewDate) <= now;
    });
  }
}

// ============= Main Service =============

@Injectable({
  providedIn: 'root'
})
export class AILearningService {
  private flashcardStore = new FlashcardStore();
  private questionStore = new QuestionStore();
  private cheatSheetStore = new CheatSheetStore();
  private logger: ILogger = new ConsoleLogger();
  private dateProvider = new DateProvider();
  private spacedRepetition = new SpacedRepetitionEngine();

  // Observables
  private flashcardsSubject = new BehaviorSubject<Flashcard[]>([]);
  public flashcards$ = this.flashcardsSubject.asObservable().pipe(distinctUntilChanged());

  private questionsSubject = new BehaviorSubject<Question[]>([]);
  public questions$ = this.questionsSubject.asObservable().pipe(distinctUntilChanged());

  private cheatSheetsSubject = new BehaviorSubject<CheatSheet[]>([]);
  public cheatSheets$ = this.cheatSheetsSubject.asObservable().pipe(distinctUntilChanged());

  // Error subject
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {
    this.logger.log('AILearningService initialized');
  }

  // ============= AI Content Generation (Placeholder for API Integration) =============

  async generateSummary(content: LearningContent): Promise<string> {
    try {
      this.logger.log('Generating summary for content:', content.id);

      // TODO: Integrate with actual AI API (OpenAI, Claude, etc.)
      // This is a placeholder that would be replaced with actual API call
      const mockSummary = `AI-generated summary for "${content.name}". This content covers key concepts and important details that students need to master.`;

      return mockSummary;
    } catch (error) {
      this.handleError('Failed to generate summary', error);
      throw error;
    }
  }

  async generateFlashcards(content: LearningContent, count: number = 10): Promise<Flashcard[]> {
    try {
      this.logger.log('Generating flashcards for content:', content.id);

      // TODO: Integrate with actual AI API
      // This is a placeholder that would be replaced with actual API call
      const flashcards: Flashcard[] = [];

      for (let i = 0; i < count; i++) {
        const flashcard: Flashcard = {
          id: this.generateId(),
          contentId: content.id,
          front: `Question ${i + 1} about ${content.name}`,
          back: `Answer ${i + 1} with explanation`,
          difficulty: this.getRandomPriority(),
          tags: content.tags || [],
          reviewCount: 0,
          confidenceLevel: 50,
          dateCreated: this.dateProvider.now(),
          lastModified: this.dateProvider.now(),
          isStarred: false
        };

        this.flashcardStore.add(flashcard);
        flashcards.push(flashcard);
      }

      this.flashcardsSubject.next(this.flashcardStore.getAll());
      return flashcards;
    } catch (error) {
      this.handleError('Failed to generate flashcards', error);
      throw error;
    }
  }

  async generateQuestions(
    content: LearningContent,
    count: number = 10,
    types?: Question['type'][]
  ): Promise<Question[]> {
    try {
      this.logger.log('Generating questions for content:', content.id);

      // TODO: Integrate with actual AI API
      const questionTypes = types || ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'];
      const questions: Question[] = [];

      for (let i = 0; i < count; i++) {
        const type = questionTypes[i % questionTypes.length];
        const question: Question = {
          id: this.generateId(),
          contentId: content.id,
          question: `Question ${i + 1} about ${content.name}?`,
          type,
          difficulty: this.getRandomPriority(),
          tags: content.tags || [],
          points: 10,
          dateCreated: this.dateProvider.now(),
          lastModified: this.dateProvider.now()
        };

        if (type === 'MULTIPLE_CHOICE') {
          question.options = ['Option A', 'Option B', 'Option C', 'Option D'];
          question.correctAnswer = 'Option A';
        } else if (type === 'TRUE_FALSE') {
          question.options = ['True', 'False'];
          question.correctAnswer = 'True';
        }

        question.explanation = `Explanation for question ${i + 1}`;

        this.questionStore.add(question);
        questions.push(question);
      }

      this.questionsSubject.next(this.questionStore.getAll());
      return questions;
    } catch (error) {
      this.handleError('Failed to generate questions', error);
      throw error;
    }
  }

  async generateCheatSheet(
    content: LearningContent,
    moduleId?: UUID,
    courseId?: UUID
  ): Promise<CheatSheet> {
    try {
      this.logger.log('Generating cheat sheet for content:', content.id);

      // TODO: Integrate with actual AI API
      const sections: CheatSheetSection[] = [
        {
          id: this.generateId(),
          title: 'Key Concepts',
          content: 'Important concepts from the material',
          keyPoints: ['Point 1', 'Point 2', 'Point 3'],
          examples: ['Example 1', 'Example 2'],
          order: 1
        },
        {
          id: this.generateId(),
          title: 'Formulas & Definitions',
          content: 'Essential formulas and definitions',
          keyPoints: ['Formula 1', 'Formula 2'],
          order: 2
        }
      ];

      const cheatSheet: CheatSheet = {
        id: this.generateId(),
        contentId: content.id,
        moduleId,
        courseId,
        title: `Cheat Sheet: ${content.name}`,
        sections,
        tags: content.tags || [],
        isStarred: false,
        lastUpdated: this.dateProvider.now(),
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now()
      };

      this.cheatSheetStore.add(cheatSheet);
      this.cheatSheetsSubject.next(this.cheatSheetStore.getAll());

      return cheatSheet;
    } catch (error) {
      this.handleError('Failed to generate cheat sheet', error);
      throw error;
    }
  }

  // ============= Flashcard Management =============

  createFlashcard(flashcardData: Omit<Flashcard, 'id' | 'dateCreated' | 'lastModified'>): Flashcard {
    try {
      const flashcard: Flashcard = {
        ...flashcardData,
        id: this.generateId(),
        reviewCount: flashcardData.reviewCount || 0,
        confidenceLevel: flashcardData.confidenceLevel || 50,
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now()
      };

      this.flashcardStore.add(flashcard);
      this.flashcardsSubject.next(this.flashcardStore.getAll());
      this.logger.log('Flashcard created');

      return flashcard;
    } catch (error) {
      this.handleError('Failed to create flashcard', error);
      throw error;
    }
  }

  updateFlashcard(id: UUID, updates: Partial<Flashcard>): void {
    this.flashcardStore.update(id, updates);
    this.flashcardsSubject.next(this.flashcardStore.getAll());
  }

  deleteFlashcard(id: UUID): void {
    this.flashcardStore.delete(id);
    this.flashcardsSubject.next(this.flashcardStore.getAll());
  }

  reviewFlashcard(id: UUID, confidenceLevel: number): void {
    const flashcard = this.flashcardStore.get(id);
    if (!flashcard) return;

    const reviewCount = flashcard.reviewCount + 1;
    const nextReviewDate = this.spacedRepetition.calculateNextReviewDate(
      confidenceLevel,
      reviewCount,
      this.dateProvider.now()
    );

    this.flashcardStore.update(id, {
      reviewCount,
      confidenceLevel,
      lastReviewedDate: this.dateProvider.now(),
      nextReviewDate
    });

    this.flashcardsSubject.next(this.flashcardStore.getAll());
    this.logger.log('Flashcard reviewed:', id);
  }

  getFlashcardsForReview(contentId?: UUID): Flashcard[] {
    const flashcards = contentId
      ? this.flashcardStore.getByContentId(contentId)
      : this.flashcardStore.getAll();

    return this.spacedRepetition.getCardsForReview(flashcards);
  }

  getFlashcardsByContent(contentId: UUID): Flashcard[] {
    return this.flashcardStore.getByContentId(contentId);
  }

  // ============= Question Management =============

  createQuestion(questionData: Omit<Question, 'id' | 'dateCreated' | 'lastModified'>): Question {
    try {
      const question: Question = {
        ...questionData,
        id: this.generateId(),
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now()
      };

      this.questionStore.add(question);
      this.questionsSubject.next(this.questionStore.getAll());
      this.logger.log('Question created');

      return question;
    } catch (error) {
      this.handleError('Failed to create question', error);
      throw error;
    }
  }

  updateQuestion(id: UUID, updates: Partial<Question>): void {
    this.questionStore.update(id, updates);
    this.questionsSubject.next(this.questionStore.getAll());
  }

  deleteQuestion(id: UUID): void {
    this.questionStore.delete(id);
    this.questionsSubject.next(this.questionStore.getAll());
  }

  getQuestionsByContent(contentId: UUID): Question[] {
    return this.questionStore.getByContentId(contentId);
  }

  getQuestionsByModule(moduleId: UUID): Question[] {
    return this.questionStore.getByModuleId(moduleId);
  }

  checkAnswer(questionId: UUID, answer: string | string[]): boolean {
    const question = this.questionStore.get(questionId);
    if (!question || !question.correctAnswer) return false;

    if (Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
      return JSON.stringify(answer.sort()) === JSON.stringify(question.correctAnswer.sort());
    }

    return answer === question.correctAnswer;
  }

  // ============= Cheat Sheet Management =============

  createCheatSheet(cheatSheetData: Omit<CheatSheet, 'id' | 'dateCreated' | 'lastModified' | 'lastUpdated'>): CheatSheet {
    try {
      const cheatSheet: CheatSheet = {
        ...cheatSheetData,
        id: this.generateId(),
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now(),
        lastUpdated: this.dateProvider.now()
      };

      this.cheatSheetStore.add(cheatSheet);
      this.cheatSheetsSubject.next(this.cheatSheetStore.getAll());
      this.logger.log('Cheat sheet created');

      return cheatSheet;
    } catch (error) {
      this.handleError('Failed to create cheat sheet', error);
      throw error;
    }
  }

  updateCheatSheet(id: UUID, updates: Partial<CheatSheet>): void {
    this.cheatSheetStore.update(id, updates);
    this.cheatSheetsSubject.next(this.cheatSheetStore.getAll());
  }

  deleteCheatSheet(id: UUID): void {
    this.cheatSheetStore.delete(id);
    this.cheatSheetsSubject.next(this.cheatSheetStore.getAll());
  }

  addSectionToCheatSheet(cheatSheetId: UUID, section: Omit<CheatSheetSection, 'id'>): void {
    const cheatSheet = this.cheatSheetStore.get(cheatSheetId);
    if (!cheatSheet) return;

    const newSection: CheatSheetSection = {
      ...section,
      id: this.generateId()
    };

    cheatSheet.sections.push(newSection);
    this.updateCheatSheet(cheatSheetId, { sections: cheatSheet.sections });
  }

  updateCheatSheetSection(cheatSheetId: UUID, sectionId: UUID, updates: Partial<CheatSheetSection>): void {
    const cheatSheet = this.cheatSheetStore.get(cheatSheetId);
    if (!cheatSheet) return;

    const sectionIndex = cheatSheet.sections.findIndex(s => s.id === sectionId);
    if (sectionIndex !== -1) {
      cheatSheet.sections[sectionIndex] = {
        ...cheatSheet.sections[sectionIndex],
        ...updates
      };
      this.updateCheatSheet(cheatSheetId, { sections: cheatSheet.sections });
    }
  }

  deleteSectionFromCheatSheet(cheatSheetId: UUID, sectionId: UUID): void {
    const cheatSheet = this.cheatSheetStore.get(cheatSheetId);
    if (!cheatSheet) return;

    cheatSheet.sections = cheatSheet.sections.filter(s => s.id !== sectionId);
    this.updateCheatSheet(cheatSheetId, { sections: cheatSheet.sections });
  }

  // ============= Statistics =============

  getFlashcardStatistics(contentId?: UUID) {
    const flashcards = contentId
      ? this.flashcardStore.getByContentId(contentId)
      : this.flashcardStore.getAll();

    const totalFlashcards = flashcards.length;
    const masteredCards = flashcards.filter(f => (f.confidenceLevel || 0) >= 80).length;
    const cardsNeedingReview = this.getFlashcardsForReview(contentId).length;
    const averageConfidence = flashcards.length > 0
      ? Math.round(flashcards.reduce((sum, f) => sum + (f.confidenceLevel || 0), 0) / flashcards.length)
      : 0;

    return {
      totalFlashcards,
      masteredCards,
      cardsNeedingReview,
      averageConfidence
    };
  }

  // ============= Utility Methods =============

  private generateId(): UUID {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getRandomPriority(): Priority {
    const priorities: Priority[] = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];
    return priorities[Math.floor(Math.random() * priorities.length)];
  }

  private handleError(message: string, error: any): void {
    this.logger.error(message, error);
    this.errorSubject.next(message);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  // ============= Data Management =============

  setInitialData(flashcards: Flashcard[], questions: Question[], cheatSheets: CheatSheet[]): void {
    this.flashcardStore.clear();
    this.questionStore.clear();
    this.cheatSheetStore.clear();

    flashcards.forEach(f => this.flashcardStore.add(f));
    questions.forEach(q => this.questionStore.add(q));
    cheatSheets.forEach(cs => this.cheatSheetStore.add(cs));

    this.flashcardsSubject.next(this.flashcardStore.getAll());
    this.questionsSubject.next(this.questionStore.getAll());
    this.cheatSheetsSubject.next(this.cheatSheetStore.getAll());

    this.logger.log(`Initialized with ${flashcards.length} flashcards, ${questions.length} questions, ${cheatSheets.length} cheat sheets`);
  }

  clearAllData(): void {
    this.flashcardStore.clear();
    this.questionStore.clear();
    this.cheatSheetStore.clear();
    this.flashcardsSubject.next([]);
    this.questionsSubject.next([]);
    this.cheatSheetsSubject.next([]);
    this.logger.log('All data cleared');
  }
}

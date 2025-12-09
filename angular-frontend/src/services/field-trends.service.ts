import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import {
  FieldTrend,
  LearningPattern,
  LearningStep,
  StudyField,
  UUID,
  Priority
} from '../models.interface';

// ============= Store Classes =============

class FieldTrendStore {
  private trends: Map<UUID, FieldTrend> = new Map();
  private trendsList: FieldTrend[] = [];

  add(trend: FieldTrend): void {
    this.trends.set(trend.id, trend);
    this.trendsList.push(trend);
  }

  update(id: UUID, trend: Partial<FieldTrend>): void {
    const existing = this.trends.get(id);
    if (existing) {
      const updated = { ...existing, ...trend, lastModified: new Date().toISOString() };
      this.trends.set(id, updated);
      const index = this.trendsList.findIndex(t => t.id === id);
      if (index !== -1) {
        this.trendsList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.trends.delete(id);
    this.trendsList = this.trendsList.filter(t => t.id !== id);
  }

  get(id: UUID): FieldTrend | undefined {
    return this.trends.get(id);
  }

  getAll(): FieldTrend[] {
    return [...this.trendsList];
  }

  clear(): void {
    this.trends.clear();
    this.trendsList = [];
  }
}

class LearningPatternStore {
  private patterns: Map<UUID, LearningPattern> = new Map();
  private patternsList: LearningPattern[] = [];

  add(pattern: LearningPattern): void {
    this.patterns.set(pattern.id, pattern);
    this.patternsList.push(pattern);
  }

  update(id: UUID, pattern: Partial<LearningPattern>): void {
    const existing = this.patterns.get(id);
    if (existing) {
      const updated = { ...existing, ...pattern };
      this.patterns.set(id, updated);
      const index = this.patternsList.findIndex(p => p.id === id);
      if (index !== -1) {
        this.patternsList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.patterns.delete(id);
    this.patternsList = this.patternsList.filter(p => p.id !== id);
  }

  get(id: UUID): LearningPattern | undefined {
    return this.patterns.get(id);
  }

  getAll(): LearningPattern[] {
    return [...this.patternsList];
  }

  clear(): void {
    this.patterns.clear();
    this.patternsList = [];
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
    console.log(`[FieldTrendsService] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[FieldTrendsService] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[FieldTrendsService] ${message}`, ...args);
  }
}

// ============= Date Provider =============

class DateProvider {
  now(): string {
    return new Date().toISOString();
  }
}

// ============= Trend Filter Engine =============

interface TrendFilterOptions {
  field?: StudyField;
  trendType?: FieldTrend['trendType'];
  difficulty?: Priority;
  minRelevanceScore?: number;
  tags?: string[];
  isStarred?: boolean;
  includeExpired?: boolean;
}

class TrendFilterEngine {
  filter(trends: FieldTrend[], options: TrendFilterOptions): FieldTrend[] {
    let filtered = [...trends];

    if (options.field) {
      filtered = filtered.filter(t => t.field === options.field);
    }

    if (options.trendType) {
      filtered = filtered.filter(t => t.trendType === options.trendType);
    }

    if (options.difficulty) {
      filtered = filtered.filter(t => t.difficulty === options.difficulty);
    }

    if (options.minRelevanceScore !== undefined) {
      filtered = filtered.filter(t => t.relevanceScore >= options.minRelevanceScore!);
    }

    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter(t =>
        t.tags?.some(tag => options.tags!.includes(tag))
      );
    }

    if (options.isStarred !== undefined) {
      filtered = filtered.filter(t => t.isStarred === options.isStarred);
    }

    if (!options.includeExpired) {
      const now = new Date();
      filtered = filtered.filter(t =>
        !t.expiryDate || new Date(t.expiryDate) >= now
      );
    }

    return filtered;
  }
}

// ============= Main Service =============

@Injectable({
  providedIn: 'root'
})
export class FieldTrendsService {
  private trendStore = new FieldTrendStore();
  private patternStore = new LearningPatternStore();
  private logger: ILogger = new ConsoleLogger();
  private dateProvider = new DateProvider();
  private filterEngine = new TrendFilterEngine();

  // Observables
  private trendsSubject = new BehaviorSubject<FieldTrend[]>([]);
  public trends$ = this.trendsSubject.asObservable().pipe(distinctUntilChanged());

  private patternsSubject = new BehaviorSubject<LearningPattern[]>([]);
  public patterns$ = this.patternsSubject.asObservable().pipe(distinctUntilChanged());

  // Error subject
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {
    this.logger.log('FieldTrendsService initialized');
  }

  // ============= Field Trend Management =============

  createTrend(trendData: Omit<FieldTrend, 'id' | 'dateCreated' | 'lastModified'>): FieldTrend {
    try {
      const trend: FieldTrend = {
        ...trendData,
        id: this.generateId(),
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now()
      };

      this.trendStore.add(trend);
      this.trendsSubject.next(this.trendStore.getAll());
      this.logger.log('Trend created:', trend.title);

      return trend;
    } catch (error) {
      this.handleError('Failed to create trend', error);
      throw error;
    }
  }

  updateTrend(id: UUID, updates: Partial<FieldTrend>): void {
    this.trendStore.update(id, updates);
    this.trendsSubject.next(this.trendStore.getAll());
  }

  deleteTrend(id: UUID): void {
    this.trendStore.delete(id);
    this.trendsSubject.next(this.trendStore.getAll());
    this.logger.log('Trend deleted:', id);
  }

  getTrendById(id: UUID): FieldTrend | undefined {
    return this.trendStore.get(id);
  }

  getAllTrends(): FieldTrend[] {
    return this.trendStore.getAll();
  }

  getTrendsByField(field: StudyField): FieldTrend[] {
    return this.trendStore.getAll()
      .filter(t => t.field === field)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  getHotSkills(field?: StudyField, limit: number = 10): FieldTrend[] {
    let trends = this.trendStore.getAll()
      .filter(t => t.trendType === 'HOT_SKILL');

    if (field) {
      trends = trends.filter(t => t.field === field);
    }

    return trends
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  getLatestReleases(field?: StudyField, limit: number = 10): FieldTrend[] {
    let trends = this.trendStore.getAll()
      .filter(t => t.trendType === 'LATEST_RELEASE');

    if (field) {
      trends = trends.filter(t => t.field === field);
    }

    return trends
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      .slice(0, limit);
  }

  getResearchTrends(field?: StudyField, limit: number = 10): FieldTrend[] {
    let trends = this.trendStore.getAll()
      .filter(t => t.trendType === 'RESEARCH');

    if (field) {
      trends = trends.filter(t => t.field === field);
    }

    return trends
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      .slice(0, limit);
  }

  getBestPractices(field?: StudyField): FieldTrend[] {
    let trends = this.trendStore.getAll()
      .filter(t => t.trendType === 'BEST_PRACTICE');

    if (field) {
      trends = trends.filter(t => t.field === field);
    }

    return trends.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  getRecommendedTools(field?: StudyField): FieldTrend[] {
    let trends = this.trendStore.getAll()
      .filter(t => t.trendType === 'TOOL');

    if (field) {
      trends = trends.filter(t => t.field === field);
    }

    return trends.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  getCertifications(field?: StudyField): FieldTrend[] {
    let trends = this.trendStore.getAll()
      .filter(t => t.trendType === 'CERTIFICATION');

    if (field) {
      trends = trends.filter(t => t.field === field);
    }

    return trends.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  filterTrends(options: TrendFilterOptions): FieldTrend[] {
    return this.filterEngine.filter(this.trendStore.getAll(), options);
  }

  starTrend(id: UUID): void {
    this.updateTrend(id, { isStarred: true });
  }

  unstarTrend(id: UUID): void {
    this.updateTrend(id, { isStarred: false });
  }

  getStarredTrends(): FieldTrend[] {
    return this.trendStore.getAll().filter(t => t.isStarred);
  }

  // ============= Learning Pattern Management =============

  createLearningPattern(patternData: Omit<LearningPattern, 'id'>): LearningPattern {
    try {
      const pattern: LearningPattern = {
        ...patternData,
        id: this.generateId()
      };

      this.patternStore.add(pattern);
      this.patternsSubject.next(this.patternStore.getAll());
      this.logger.log('Learning pattern created:', pattern.name);

      return pattern;
    } catch (error) {
      this.handleError('Failed to create learning pattern', error);
      throw error;
    }
  }

  updateLearningPattern(id: UUID, updates: Partial<LearningPattern>): void {
    this.patternStore.update(id, updates);
    this.patternsSubject.next(this.patternStore.getAll());
  }

  deleteLearningPattern(id: UUID): void {
    this.patternStore.delete(id);
    this.patternsSubject.next(this.patternStore.getAll());
    this.logger.log('Learning pattern deleted:', id);
  }

  getLearningPatternById(id: UUID): LearningPattern | undefined {
    return this.patternStore.get(id);
  }

  getAllLearningPatterns(): LearningPattern[] {
    return this.patternStore.getAll();
  }

  getLearningPatternsByField(field: StudyField): LearningPattern[] {
    return this.patternStore.getAll()
      .filter(p => p.field === field)
      .sort((a, b) => (b.successRate || 0) - (a.successRate || 0));
  }

  getRecommendedPatterns(field?: StudyField): LearningPattern[] {
    let patterns = this.patternStore.getAll().filter(p => p.isRecommended);

    if (field) {
      patterns = patterns.filter(p => p.field === field);
    }

    return patterns.sort((a, b) => (b.successRate || 0) - (a.successRate || 0));
  }

  getLearningPatternsByDifficulty(difficulty: Priority, field?: StudyField): LearningPattern[] {
    let patterns = this.patternStore.getAll().filter(p => p.difficulty === difficulty);

    if (field) {
      patterns = patterns.filter(p => p.field === field);
    }

    return patterns;
  }

  addStepToPattern(patternId: UUID, step: Omit<LearningStep, 'id'>): void {
    const pattern = this.patternStore.get(patternId);
    if (!pattern) {
      throw new Error(`Learning pattern with id ${patternId} not found`);
    }

    const newStep: LearningStep = {
      ...step,
      id: this.generateId()
    };

    pattern.steps.push(newStep);
    this.updateLearningPattern(patternId, { steps: pattern.steps });
  }

  updateStepInPattern(patternId: UUID, stepId: UUID, updates: Partial<LearningStep>): void {
    const pattern = this.patternStore.get(patternId);
    if (!pattern) {
      throw new Error(`Learning pattern with id ${patternId} not found`);
    }

    const stepIndex = pattern.steps.findIndex(s => s.id === stepId);
    if (stepIndex !== -1) {
      pattern.steps[stepIndex] = { ...pattern.steps[stepIndex], ...updates };
      this.updateLearningPattern(patternId, { steps: pattern.steps });
    }
  }

  deleteStepFromPattern(patternId: UUID, stepId: UUID): void {
    const pattern = this.patternStore.get(patternId);
    if (!pattern) {
      throw new Error(`Learning pattern with id ${patternId} not found`);
    }

    pattern.steps = pattern.steps.filter(s => s.id !== stepId);
    this.updateLearningPattern(patternId, { steps: pattern.steps });
  }

  // ============= Search =============

  searchTrends(query: string): FieldTrend[] {
    const lowerQuery = query.toLowerCase();
    return this.trendStore.getAll().filter(trend =>
      trend.title.toLowerCase().includes(lowerQuery) ||
      trend.description.toLowerCase().includes(lowerQuery) ||
      trend.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      trend.relatedSkills?.some(skill => skill.toLowerCase().includes(lowerQuery))
    );
  }

  searchLearningPatterns(query: string): LearningPattern[] {
    const lowerQuery = query.toLowerCase();
    return this.patternStore.getAll().filter(pattern =>
      pattern.name.toLowerCase().includes(lowerQuery) ||
      pattern.description.toLowerCase().includes(lowerQuery) ||
      pattern.prerequisites?.some(prereq => prereq.toLowerCase().includes(lowerQuery)) ||
      pattern.outcomes?.some(outcome => outcome.toLowerCase().includes(lowerQuery))
    );
  }

  // ============= Statistics =============

  getTrendStatistics(field?: StudyField) {
    const trends = field
      ? this.getTrendsByField(field)
      : this.trendStore.getAll();

    const totalTrends = trends.length;
    const starredTrends = trends.filter(t => t.isStarred).length;

    const trendsByType = trends.reduce((acc, trend) => {
      acc[trend.trendType] = (acc[trend.trendType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const trendsByDifficulty = trends.reduce((acc, trend) => {
      if (trend.difficulty) {
        acc[trend.difficulty] = (acc[trend.difficulty] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const averageRelevanceScore = trends.length > 0
      ? Math.round(trends.reduce((sum, t) => sum + t.relevanceScore, 0) / trends.length)
      : 0;

    return {
      totalTrends,
      starredTrends,
      trendsByType,
      trendsByDifficulty,
      averageRelevanceScore
    };
  }

  getLearningPatternStatistics(field?: StudyField) {
    const patterns = field
      ? this.getLearningPatternsByField(field)
      : this.patternStore.getAll();

    const totalPatterns = patterns.length;
    const recommendedPatterns = patterns.filter(p => p.isRecommended).length;

    const patternsByDifficulty = patterns.reduce((acc, pattern) => {
      acc[pattern.difficulty] = (acc[pattern.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageSuccessRate = patterns.length > 0
      ? Math.round(patterns.reduce((sum, p) => sum + (p.successRate || 0), 0) / patterns.length)
      : 0;

    return {
      totalPatterns,
      recommendedPatterns,
      patternsByDifficulty,
      averageSuccessRate
    };
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

  setInitialData(trends: FieldTrend[], patterns: LearningPattern[]): void {
    this.trendStore.clear();
    this.patternStore.clear();

    trends.forEach(trend => this.trendStore.add(trend));
    patterns.forEach(pattern => this.patternStore.add(pattern));

    this.trendsSubject.next(this.trendStore.getAll());
    this.patternsSubject.next(this.patternStore.getAll());

    this.logger.log(`Initialized with ${trends.length} trends and ${patterns.length} patterns`);
  }

  clearAllData(): void {
    this.trendStore.clear();
    this.patternStore.clear();
    this.trendsSubject.next([]);
    this.patternsSubject.next([]);
    this.logger.log('All data cleared');
  }
}

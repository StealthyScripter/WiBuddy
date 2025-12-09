import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import {
  StudySession,
  Assessment,
  PerformanceMetrics,
  WeakPoint,
  PerformanceLevel,
  UUID,
  AssessmentScore,
  PerformanceTrend,
  LearningRecommendation
} from '../models.interface';

// ============= Store Classes =============

class StudySessionStore {
  private sessions: Map<UUID, StudySession> = new Map();
  private sessionsList: StudySession[] = [];

  add(session: StudySession): void {
    this.sessions.set(session.id, session);
    this.sessionsList.push(session);
  }

  update(id: UUID, session: Partial<StudySession>): void {
    const existing = this.sessions.get(id);
    if (existing) {
      const updated = { ...existing, ...session, lastModified: new Date().toISOString() };
      this.sessions.set(id, updated);
      const index = this.sessionsList.findIndex(s => s.id === id);
      if (index !== -1) {
        this.sessionsList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.sessions.delete(id);
    this.sessionsList = this.sessionsList.filter(s => s.id !== id);
  }

  get(id: UUID): StudySession | undefined {
    return this.sessions.get(id);
  }

  getAll(): StudySession[] {
    return [...this.sessionsList];
  }

  clear(): void {
    this.sessions.clear();
    this.sessionsList = [];
  }
}

class AssessmentStore {
  private assessments: Map<UUID, Assessment> = new Map();
  private assessmentsList: Assessment[] = [];

  add(assessment: Assessment): void {
    this.assessments.set(assessment.id, assessment);
    this.assessmentsList.push(assessment);
  }

  update(id: UUID, assessment: Partial<Assessment>): void {
    const existing = this.assessments.get(id);
    if (existing) {
      const updated = { ...existing, ...assessment, lastModified: new Date().toISOString() };
      this.assessments.set(id, updated);
      const index = this.assessmentsList.findIndex(a => a.id === id);
      if (index !== -1) {
        this.assessmentsList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.assessments.delete(id);
    this.assessmentsList = this.assessmentsList.filter(a => a.id !== id);
  }

  get(id: UUID): Assessment | undefined {
    return this.assessments.get(id);
  }

  getByCourseId(courseId: UUID): Assessment[] {
    return this.assessmentsList.filter(a => a.courseId === courseId);
  }

  getByModuleId(moduleId: UUID): Assessment[] {
    return this.assessmentsList.filter(a => a.moduleId === moduleId);
  }

  getAll(): Assessment[] {
    return [...this.assessmentsList];
  }

  clear(): void {
    this.assessments.clear();
    this.assessmentsList = [];
  }
}

class PerformanceMetricsStore {
  private metrics: Map<UUID, PerformanceMetrics> = new Map();
  private metricsList: PerformanceMetrics[] = [];

  add(metric: PerformanceMetrics): void {
    this.metrics.set(metric.id, metric);
    this.metricsList.push(metric);
  }

  update(id: UUID, metric: Partial<PerformanceMetrics>): void {
    const existing = this.metrics.get(id);
    if (existing) {
      const updated = { ...existing, ...metric, lastModified: new Date().toISOString() };
      this.metrics.set(id, updated);
      const index = this.metricsList.findIndex(m => m.id === id);
      if (index !== -1) {
        this.metricsList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.metrics.delete(id);
    this.metricsList = this.metricsList.filter(m => m.id !== id);
  }

  get(id: UUID): PerformanceMetrics | undefined {
    return this.metrics.get(id);
  }

  getByUserId(userId: UUID): PerformanceMetrics[] {
    return this.metricsList.filter(m => m.userId === userId);
  }

  getByCourseId(courseId: UUID): PerformanceMetrics | undefined {
    return this.metricsList.find(m => m.courseId === courseId);
  }

  getByModuleId(moduleId: UUID): PerformanceMetrics | undefined {
    return this.metricsList.find(m => m.moduleId === moduleId);
  }

  getAll(): PerformanceMetrics[] {
    return [...this.metricsList];
  }

  clear(): void {
    this.metrics.clear();
    this.metricsList = [];
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
    console.log(`[PerformanceTrackingService] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[PerformanceTrackingService] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[PerformanceTrackingService] ${message}`, ...args);
  }
}

// ============= Date Provider =============

class DateProvider {
  now(): string {
    return new Date().toISOString();
  }
}

// ============= Performance Analysis Engine =============

class PerformanceAnalysisEngine {
  calculateOverallScore(assessmentScores: AssessmentScore[]): number {
    if (assessmentScores.length === 0) return 0;

    const totalPercentage = assessmentScores.reduce((sum, score) => sum + score.percentage, 0);
    return Math.round(totalPercentage / assessmentScores.length);
  }

  determinePerformanceLevel(score: number): PerformanceLevel {
    if (score >= 90) return PerformanceLevel.EXCELLENT;
    if (score >= 80) return PerformanceLevel.GOOD;
    if (score >= 70) return PerformanceLevel.AVERAGE;
    if (score >= 60) return PerformanceLevel.NEEDS_IMPROVEMENT;
    return PerformanceLevel.POOR;
  }

  identifyWeakPoints(assessmentScores: AssessmentScore[]): string[] {
    // Identify concepts where performance is below 70%
    return assessmentScores
      .filter(score => score.percentage < 70)
      .map(score => score.type)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  identifyStrengths(assessmentScores: AssessmentScore[]): string[] {
    // Identify concepts where performance is above 85%
    return assessmentScores
      .filter(score => score.percentage >= 85)
      .map(score => score.type)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  calculateTrends(metrics: PerformanceMetrics[], daysBack: number = 30): PerformanceTrend[] {
    const now = new Date();
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const trends: PerformanceTrend[] = [];
    const dateMap = new Map<string, { totalScore: number; count: number; studyTime: number; assessments: number }>();

    metrics.forEach(metric => {
      if (metric.trends) {
        metric.trends.forEach(trend => {
          const trendDate = new Date(trend.date);
          if (trendDate >= startDate) {
            const dateKey = trendDate.toISOString().split('T')[0];
            const existing = dateMap.get(dateKey) || { totalScore: 0, count: 0, studyTime: 0, assessments: 0 };

            existing.totalScore += trend.score;
            existing.count += 1;
            existing.studyTime += trend.studyTime;
            existing.assessments += trend.assessmentsTaken;

            dateMap.set(dateKey, existing);
          }
        });
      }
    });

    dateMap.forEach((value, date) => {
      trends.push({
        date,
        score: Math.round(value.totalScore / value.count),
        studyTime: value.studyTime,
        assessmentsTaken: value.assessments
      });
    });

    return trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}

// ============= Main Service =============

@Injectable({
  providedIn: 'root'
})
export class PerformanceTrackingService {
  private studySessionStore = new StudySessionStore();
  private assessmentStore = new AssessmentStore();
  private metricsStore = new PerformanceMetricsStore();
  private logger: ILogger = new ConsoleLogger();
  private dateProvider = new DateProvider();
  private analysisEngine = new PerformanceAnalysisEngine();

  // Observables
  private studySessionsSubject = new BehaviorSubject<StudySession[]>([]);
  public studySessions$ = this.studySessionsSubject.asObservable().pipe(distinctUntilChanged());

  private assessmentsSubject = new BehaviorSubject<Assessment[]>([]);
  public assessments$ = this.assessmentsSubject.asObservable().pipe(distinctUntilChanged());

  private metricsSubject = new BehaviorSubject<PerformanceMetrics[]>([]);
  public metrics$ = this.metricsSubject.asObservable().pipe(distinctUntilChanged());

  // Error subject
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  // Active session tracking
  private activeSession: StudySession | null = null;

  constructor() {
    this.logger.log('PerformanceTrackingService initialized');
  }

  // ============= Study Session Management =============

  startStudySession(moduleId: UUID, courseId: UUID, contentIds: UUID[]): StudySession {
    try {
      const session: StudySession = {
        id: this.generateId(),
        moduleId,
        courseId,
        contentIds,
        startTime: this.dateProvider.now(),
        activitiesCompleted: [],
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now()
      };

      this.activeSession = session;
      this.studySessionStore.add(session);
      this.studySessionsSubject.next(this.studySessionStore.getAll());
      this.logger.log('Study session started:', session.id);

      return session;
    } catch (error) {
      this.handleError('Failed to start study session', error);
      throw error;
    }
  }

  endStudySession(sessionId: UUID, focusScore?: number): void {
    try {
      const session = this.studySessionStore.get(sessionId);
      if (!session) {
        throw new Error(`Study session with id ${sessionId} not found`);
      }

      const endTime = this.dateProvider.now();
      const duration = Math.round(
        (new Date(endTime).getTime() - new Date(session.startTime).getTime()) / 60000
      );

      this.studySessionStore.update(sessionId, {
        endTime,
        duration,
        focusScore
      });

      if (this.activeSession?.id === sessionId) {
        this.activeSession = null;
      }

      this.studySessionsSubject.next(this.studySessionStore.getAll());
      this.logger.log('Study session ended:', sessionId, `Duration: ${duration} minutes`);
    } catch (error) {
      this.handleError('Failed to end study session', error);
      throw error;
    }
  }

  updateStudySession(sessionId: UUID, updates: Partial<StudySession>): void {
    this.studySessionStore.update(sessionId, updates);
    this.studySessionsSubject.next(this.studySessionStore.getAll());
  }

  getActiveSession(): StudySession | null {
    return this.activeSession;
  }

  getStudySessionsByCourse(courseId: UUID): StudySession[] {
    return this.studySessionStore.getAll().filter(s => s.courseId === courseId);
  }

  getStudySessionsByModule(moduleId: UUID): StudySession[] {
    return this.studySessionStore.getAll().filter(s => s.moduleId === moduleId);
  }

  // ============= Assessment Management =============

  createAssessment(assessmentData: Omit<Assessment, 'id' | 'dateCreated' | 'lastModified'>): Assessment {
    try {
      const assessment: Assessment = {
        ...assessmentData,
        id: this.generateId(),
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now(),
        isGraded: assessmentData.isGraded || false
      };

      this.assessmentStore.add(assessment);
      this.assessmentsSubject.next(this.assessmentStore.getAll());
      this.logger.log('Assessment created:', assessment.name);

      return assessment;
    } catch (error) {
      this.handleError('Failed to create assessment', error);
      throw error;
    }
  }

  updateAssessment(id: UUID, updates: Partial<Assessment>): void {
    this.assessmentStore.update(id, updates);
    this.assessmentsSubject.next(this.assessmentStore.getAll());
  }

  gradeAssessment(id: UUID, score: number, feedback?: string): void {
    this.assessmentStore.update(id, {
      score,
      feedback,
      isGraded: true,
      submissionDate: this.dateProvider.now()
    });
    this.assessmentsSubject.next(this.assessmentStore.getAll());
    this.logger.log('Assessment graded:', id, `Score: ${score}`);

    // Recalculate performance metrics
    const assessment = this.assessmentStore.get(id);
    if (assessment) {
      this.recalculateMetrics(assessment.courseId, assessment.moduleId);
    }
  }

  getAssessmentsByCourse(courseId: UUID): Assessment[] {
    return this.assessmentStore.getByCourseId(courseId);
  }

  getAssessmentsByModule(moduleId: UUID): Assessment[] {
    return this.assessmentStore.getByModuleId(moduleId);
  }

  getUpcomingAssessments(): Assessment[] {
    const now = new Date();
    return this.assessmentStore.getAll()
      .filter(a => a.dueDate && new Date(a.dueDate) >= now && !a.isGraded)
      .sort((a, b) => {
        const dateA = new Date(a.dueDate!).getTime();
        const dateB = new Date(b.dueDate!).getTime();
        return dateA - dateB;
      });
  }

  // ============= Performance Metrics Calculation =============

  calculateMetrics(userId: UUID, courseId?: UUID, moduleId?: UUID): PerformanceMetrics {
    try {
      const assessments = courseId
        ? this.assessmentStore.getByCourseId(courseId)
        : moduleId
        ? this.assessmentStore.getByModuleId(moduleId)
        : this.assessmentStore.getAll();

      const gradedAssessments = assessments.filter(a => a.isGraded && a.score !== undefined);

      const assessmentScores: AssessmentScore[] = gradedAssessments.map(a => ({
        assessmentId: a.id,
        score: a.score!,
        maxScore: a.totalPoints,
        percentage: Math.round((a.score! / a.totalPoints) * 100),
        date: a.submissionDate || a.dateCreated!,
        type: a.type
      }));

      const overallScore = this.analysisEngine.calculateOverallScore(assessmentScores);
      const performanceLevel = this.analysisEngine.determinePerformanceLevel(overallScore);

      const weakPointConcepts = this.analysisEngine.identifyWeakPoints(assessmentScores);
      const strengths = this.analysisEngine.identifyStrengths(assessmentScores);

      const weakPoints: WeakPoint[] = weakPointConcepts.map(concept => ({
        id: this.generateId(),
        concept,
        moduleId,
        courseId,
        score: 0, // Will be calculated based on related questions
        occurrences: assessmentScores.filter(s => s.type === concept && s.percentage < 70).length,
        relatedQuestions: [],
        suggestedResources: [],
        lastIdentified: this.dateProvider.now(),
        isAddressed: false
      }));

      const studySessions = courseId
        ? this.getStudySessionsByCourse(courseId)
        : moduleId
        ? this.getStudySessionsByModule(moduleId)
        : this.studySessionStore.getAll();

      const studyTimeTotal = studySessions.reduce((sum, session) => sum + (session.duration || 0), 0);

      const flashcardPerformance = {
        totalReviewed: 0,
        averageConfidence: 0,
        cardsNeedingReview: 0,
        masteredCards: 0
      };

      const metrics: PerformanceMetrics = {
        id: this.generateId(),
        userId,
        courseId,
        moduleId,
        overallScore,
        performanceLevel,
        assessmentScores,
        flashcardPerformance,
        studyTimeTotal,
        weakPoints,
        strengths,
        lastCalculated: this.dateProvider.now(),
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now()
      };

      // Check if metrics already exist and update, otherwise add
      const existingMetrics = courseId
        ? this.metricsStore.getByCourseId(courseId)
        : moduleId
        ? this.metricsStore.getByModuleId(moduleId)
        : undefined;

      if (existingMetrics) {
        this.metricsStore.update(existingMetrics.id, metrics);
      } else {
        this.metricsStore.add(metrics);
      }

      this.metricsSubject.next(this.metricsStore.getAll());
      this.logger.log('Metrics calculated:', metrics.id);

      return metrics;
    } catch (error) {
      this.handleError('Failed to calculate metrics', error);
      throw error;
    }
  }

  recalculateMetrics(courseId: UUID, moduleId?: UUID): void {
    const existingMetrics = courseId
      ? this.metricsStore.getByCourseId(courseId)
      : moduleId
      ? this.metricsStore.getByModuleId(moduleId)
      : undefined;

    if (existingMetrics) {
      this.calculateMetrics(existingMetrics.userId, courseId, moduleId);
    }
  }

  getMetricsByCourse(courseId: UUID): PerformanceMetrics | undefined {
    return this.metricsStore.getByCourseId(courseId);
  }

  getMetricsByModule(moduleId: UUID): PerformanceMetrics | undefined {
    return this.metricsStore.getByModuleId(moduleId);
  }

  // ============= Weak Point Analysis =============

  getWeakPoints(courseId?: UUID, moduleId?: UUID): WeakPoint[] {
    const metrics = courseId
      ? this.metricsStore.getByCourseId(courseId)
      : moduleId
      ? this.metricsStore.getByModuleId(moduleId)
      : undefined;

    return metrics?.weakPoints || [];
  }

  markWeakPointAddressed(metricsId: UUID, weakPointId: UUID): void {
    const metrics = this.metricsStore.get(metricsId);
    if (!metrics) return;

    const weakPoints = metrics.weakPoints.map(wp =>
      wp.id === weakPointId ? { ...wp, isAddressed: true } : wp
    );

    this.metricsStore.update(metricsId, { weakPoints });
    this.metricsSubject.next(this.metricsStore.getAll());
  }

  addSuggestedResourceToWeakPoint(
    metricsId: UUID,
    weakPointId: UUID,
    resource: LearningRecommendation
  ): void {
    const metrics = this.metricsStore.get(metricsId);
    if (!metrics) return;

    const weakPoints = metrics.weakPoints.map(wp => {
      if (wp.id === weakPointId) {
        return {
          ...wp,
          suggestedResources: [...wp.suggestedResources, resource]
        };
      }
      return wp;
    });

    this.metricsStore.update(metricsId, { weakPoints });
    this.metricsSubject.next(this.metricsStore.getAll());
  }

  // ============= Statistics & Insights =============

  getPerformanceTrends(userId: UUID, daysBack: number = 30): PerformanceTrend[] {
    const userMetrics = this.metricsStore.getByUserId(userId);
    return this.analysisEngine.calculateTrends(userMetrics, daysBack);
  }

  getStudyTimeStatistics(userId: UUID) {
    const sessions = this.studySessionStore.getAll();
    const totalStudyTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const averageSessionTime = sessions.length > 0 ? Math.round(totalStudyTime / sessions.length) : 0;

    const last7Days = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    });

    const weeklyStudyTime = last7Days.reduce((sum, s) => sum + (s.duration || 0), 0);

    return {
      totalStudyTime,
      averageSessionTime,
      weeklyStudyTime,
      totalSessions: sessions.length,
      weekSessions: last7Days.length
    };
  }

  getAssessmentStatistics(courseId?: UUID) {
    const assessments = courseId
      ? this.assessmentStore.getByCourseId(courseId)
      : this.assessmentStore.getAll();

    const totalAssessments = assessments.length;
    const gradedAssessments = assessments.filter(a => a.isGraded);
    const pendingAssessments = assessments.filter(a => !a.isGraded);

    const averageScore = gradedAssessments.length > 0
      ? Math.round(
          gradedAssessments.reduce((sum, a) => sum + ((a.score || 0) / a.totalPoints) * 100, 0) /
            gradedAssessments.length
        )
      : 0;

    return {
      totalAssessments,
      gradedAssessments: gradedAssessments.length,
      pendingAssessments: pendingAssessments.length,
      averageScore
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

  setInitialData(
    sessions: StudySession[],
    assessments: Assessment[],
    metrics: PerformanceMetrics[]
  ): void {
    this.studySessionStore.clear();
    this.assessmentStore.clear();
    this.metricsStore.clear();

    sessions.forEach(s => this.studySessionStore.add(s));
    assessments.forEach(a => this.assessmentStore.add(a));
    metrics.forEach(m => this.metricsStore.add(m));

    this.studySessionsSubject.next(this.studySessionStore.getAll());
    this.assessmentsSubject.next(this.assessmentStore.getAll());
    this.metricsSubject.next(this.metricsStore.getAll());

    this.logger.log(
      `Initialized with ${sessions.length} sessions, ${assessments.length} assessments, ${metrics.length} metrics`
    );
  }

  clearAllData(): void {
    this.studySessionStore.clear();
    this.assessmentStore.clear();
    this.metricsStore.clear();
    this.studySessionsSubject.next([]);
    this.assessmentsSubject.next([]);
    this.metricsSubject.next([]);
    this.activeSession = null;
    this.logger.log('All data cleared');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import {
  TrendItem,
  TechTrend,
  StandoutSkill,
  LearningRecommendation,
  JobOpportunity,
  JobMarketInsight,
  CareerGoal,
  TrendFilterOptions
} from '../models.interface';
import { BaseHttpService, BaseMockService, BaseService } from './base_service';
import { UtilityService } from './utility_service';

/**
 * HTTP-based Trends Service for production use
 */
@Injectable({
  providedIn: 'root'
})
export class TrendsService extends BaseHttpService<TrendItem> {
  constructor(private httpClient: HttpClient) {
    super(`${environment.apiUrl}/trends/items`, httpClient);
  }

  /**
   * Get trend items with filtering
   */
  getTrendItems(options: TrendFilterOptions = {}): Observable<any> {
    let params = new HttpParams();

    if (options.sourceType && options.sourceType !== 'all') {
      params = params.set('source_type', options.sourceType);
    }
    if (options.category) {
      params = params.set('category', options.category);
    }
    if (options.minRelevanceScore !== undefined) {
      params = params.set('min_relevance', options.minRelevanceScore.toString());
    }
    if (options.tags && options.tags.length > 0) {
      params = params.set('tags', options.tags.join(','));
    }
    if (options.isRead !== undefined) {
      params = params.set('is_read', options.isRead.toString());
    }

    return this.http.get(this.apiUrl, { params })
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch trend items')));
  }

  /**
   * Refresh trends feed (trigger AI curation)
   */
  refreshFeed(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh`, {})
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to refresh feed')));
  }

  /**
   * Mark trend as read
   */
  markAsRead(trendId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${trendId}/read`, {})
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to mark as read')));
  }

  /**
   * Star/unstar trend
   */
  toggleStar(trendId: string, isStarred: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${trendId}/star`, { isStarred })
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to update star status')));
  }

  /**
   * Get tech trends
   */
  getTechTrends(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/trends/tech-trends`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch tech trends')));
  }

  /**
   * Get standout skills (AI-generated from job market data)
   */
  getStandoutSkills(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/trends/standout-skills`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch standout skills')));
  }

  /**
   * Update standout skills (periodic refresh)
   */
  refreshStandoutSkills(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/trends/standout-skills/refresh`, {})
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to refresh standout skills')));
  }

  /**
   * Get learning recommendations
   */
  getLearningRecommendations(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/trends/recommendations`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch recommendations')));
  }

  /**
   * Get job opportunities
   */
  getJobOpportunities(params?: { minMatch?: number, starred?: boolean }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.minMatch !== undefined) {
      httpParams = httpParams.set('min_match', params.minMatch.toString());
    }
    if (params?.starred !== undefined) {
      httpParams = httpParams.set('starred', params.starred.toString());
    }

    return this.http.get(`${environment.apiUrl}/trends/job-opportunities`, { params: httpParams })
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch job opportunities')));
  }

  /**
   * Get job market insights
   */
  getJobMarketInsight(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/trends/job-market-insight`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch job market insight')));
  }

  /**
   * Set career goal
   */
  setCareerGoal(goal: Partial<CareerGoal>): Observable<any> {
    return this.http.post(`${environment.apiUrl}/trends/career-goal`, goal)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to set career goal')));
  }

  /**
   * Get active career goal
   */
  getCareerGoal(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/trends/career-goal/active`)
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch career goal')));
  }
}

/**
 * Mock Trends Service for development use
 */
@Injectable({
  providedIn: 'root'
})
export class MockTrendsService extends BaseMockService<TrendItem> {
  private techTrends: TechTrend[] = [];
  private standoutSkills: StandoutSkill[] = [];
  private recommendations: LearningRecommendation[] = [];
  private jobOpportunities: JobOpportunity[] = [];
  private jobMarketInsight?: JobMarketInsight;
  private careerGoal?: CareerGoal;

  constructor() {
    super([]);
  }

  setTrendItems(items: TrendItem[]) {
    this.data = [...items];
  }

  setTechTrends(trends: TechTrend[]) {
    this.techTrends = [...trends];
  }

  setStandoutSkills(skills: StandoutSkill[]) {
    this.standoutSkills = [...skills];
  }

  setRecommendations(recs: LearningRecommendation[]) {
    this.recommendations = [...recs];
  }

  setJobOpportunities(jobs: JobOpportunity[]) {
    this.jobOpportunities = [...jobs];
  }

  setJobMarketInsight(insight: JobMarketInsight) {
    this.jobMarketInsight = insight;
  }

  async getTrendItems(options: TrendFilterOptions = {}): Promise<TrendItem[]> {
    await UtilityService.simulateDelay();
    let filtered = [...this.data];

    if (options.sourceType && options.sourceType !== 'all' && options.sourceType !== 'starred') {
      filtered = filtered.filter(item => item.sourceType === options.sourceType);
    }
    if (options.sourceType === 'starred') {
      filtered = filtered.filter(item => item.isStarred);
    }
    if (options.category) {
      filtered = filtered.filter(item => item.category === options.category);
    }
    if (options.minRelevanceScore !== undefined) {
      filtered = filtered.filter(item => item.relevanceScore >= options.minRelevanceScore!);
    }
    if (options.isRead !== undefined) {
      filtered = filtered.filter(item => item.isRead === options.isRead);
    }

    return filtered.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getTechTrends(): Promise<TechTrend[]> {
    await UtilityService.simulateDelay();
    return [...this.techTrends];
  }

  async getStandoutSkills(): Promise<StandoutSkill[]> {
    await UtilityService.simulateDelay();
    return [...this.standoutSkills];
  }

  async getLearningRecommendations(): Promise<LearningRecommendation[]> {
    await UtilityService.simulateDelay();
    return [...this.recommendations];
  }

  async getJobOpportunities(params?: { minMatch?: number, starred?: boolean }): Promise<JobOpportunity[]> {
    await UtilityService.simulateDelay();
    let filtered = [...this.jobOpportunities];

    if (params?.minMatch !== undefined) {
      filtered = filtered.filter(job => job.matchPercentage >= params.minMatch!);
    }
    if (params?.starred !== undefined) {
      filtered = filtered.filter(job => job.isStarred === params.starred);
    }

    return filtered;
  }

  async getJobMarketInsight(): Promise<JobMarketInsight | undefined> {
    await UtilityService.simulateDelay();
    return this.jobMarketInsight;
  }

  async toggleStar(id: string, isStarred: boolean): Promise<TrendItem | undefined> {
    return this.update(id, { isStarred });
  }

  async markAsRead(id: string): Promise<TrendItem | undefined> {
    return this.update(id, { isRead: true });
  }
}

/**
 * Trends Service Factory
 */
@Injectable({
  providedIn: 'root'
})
export class TrendsServiceFactory {
  static getService(http?: HttpClient): BaseService<TrendItem> {
    if (environment.production && http) {
      return new TrendsService(http);
    } else {
      return new MockTrendsService();
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  MarketInsight,
  TrendFilterOptions,
  UUID
} from '../models.interface';
import { SkillService } from './skill.service';
import { ConsoleLogger, ILogger } from './task.service';

export class InsightStore {
  private insights: Map<UUID, MarketInsight> = new Map();
  private insightsList: MarketInsight[] = [];

  add(insight: MarketInsight): void {
    this.insights.set(insight.id, insight);
    this.updateList();
  }

  getAll(): MarketInsight[] {
    return [...this.insightsList];
  }

  setAll(insights: MarketInsight[]): void {
    this.insights.clear();
    insights.forEach(i => this.insights.set(i.id, i));
    this.updateList();
  }

  private updateList(): void {
    this.insightsList = Array.from(this.insights.values());
  }
}

@Injectable({ providedIn: 'root' })
export class MarketService {
  private store = new InsightStore();

  private insightsSubject = new BehaviorSubject<MarketInsight[]>([]);
  public insights$ = this.insightsSubject.asObservable().pipe(distinctUntilChanged());

  constructor(
    private skillService: SkillService,
    private logger: ConsoleLogger
  ) {}

  calculateRelevanceScore(insight: MarketInsight): Observable<number> {
    try {
      return this.skillService.getAllSkills().pipe(
        map(skills => {
          const userSkillNames = skills.map(s => s.name.toLowerCase());
          const skillMatches = insight.topSkillsCombination?.filter(skill =>
            userSkillNames.some(us => us.includes(skill.toLowerCase()))
          ).length || 0;

          const skillCount = insight.topSkillsCombination?.length || 1;
          const skillWeight = (skillMatches / skillCount) * 0.4;
          const trendWeight = ((insight.growthRate || 0) / 50) * 0.3;
          const demandWeight = ((insight.marketLevel || 0) / 100) * 0.3;

          return Math.round((skillWeight + trendWeight + demandWeight) * 100);
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getInsightsByCategory(category: string): Observable<MarketInsight[]> {
    if (!category?.trim()) return throwError(() => new Error('Category required'));

    try {
      const insights = this.store.getAll().filter(i => i.category === category);
      return new Observable(s => { s.next(insights); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getHotSkills(): Observable<MarketInsight[]> {
    try {
      const hot = this.store.getAll()
        .filter(i => i.trend === 'upward' || i.trend === 'rising')
        .sort((a, b) => (b.growthRate || 0) - (a.growthRate || 0))
        .slice(0, 5);
      return new Observable(s => { s.next(hot); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getStarredInsights(): Observable<MarketInsight[]> {
    try {
      const starred = this.store.getAll().filter(i => i.isStarred);
      return new Observable(s => { s.next(starred); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  filterInsights(options: TrendFilterOptions): Observable<MarketInsight[]> {
    try {
      let filtered = [...this.store.getAll()];

      if (options.sourceType && options.sourceType !== 'all') {
        if (options.sourceType === 'starred') {
          filtered = filtered.filter(i => i.isStarred);
        } else {
          filtered = filtered.filter(i => i.sourceType === options.sourceType);
        }
      }

      if (options.category) {
        filtered = filtered.filter(i => i.category === options.category);
      }

      if (options.dateRange) {
        filtered = filtered.filter(i => {
          const lastUpdated = new Date(i.lastUpdated);
          return lastUpdated >= new Date(options.dateRange!.start) &&
                 lastUpdated <= new Date(options.dateRange!.end);
        });
      }

      return new Observable(s => { s.next(filtered); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getInsightsByTrend(trend: string): Observable<MarketInsight[]> {
    if (!trend?.trim()) return throwError(() => new Error('Trend required'));

    try {
      const insights = this.store.getAll().filter(i => i.trend === trend);
      return new Observable(s => { s.next(insights); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  setInitialData(insights: MarketInsight[]): Observable<void> {
    try {
      this.store.setAll(insights);
      this.updateInsightsSubject();
      this.logger.info('Insights initialized', { count: insights.length });
      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getMarketInsights(): Observable<MarketInsight[]> {
    return this.insights$.pipe(map(insights => [...insights]));
  }

  private updateInsightsSubject(): void {
    this.insightsSubject.next(this.store.getAll());
  }
}

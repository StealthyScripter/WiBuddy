import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  TrendItem,
  TechTrend,
  StandoutSkill,
  LearningRecommendation,
  JobOpportunity,
  JobMarketInsight,
  TrendFilterOptions
} from '../../models.interface';
import { BaseService } from '../../services/base_service';
import { MockTrendsService } from '../../services/trends_service';
import {
  mockTrendItems,
  mockTechTrends,
  mockStandoutSkills,
  mockLearningRecommendations,
  mockJobOpportunities,
  mockJobMarketInsight
} from '../../services/test.data';

export type TrendFilter =
  | 'all'
  | 'article'
  | 'bulletin'
  | 'rss'
  | 'email'
  | 'starred';

@Component({
  selector: 'app-trends-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trends-page.component.html',
  styleUrls: ['./trends-page.component.css']
})
export class TrendsPageComponent implements OnInit {
  selectedFilter: TrendFilter = 'all';
  selectedTrend: TrendItem | null = null;

  trendItems: TrendItem[] = [];
  techTrends: TechTrend[] = [];
  standoutSkills: StandoutSkill[] = [];
  learningRecommendations: LearningRecommendation[] = [];
  jobOpportunities: JobOpportunity[] = [];
  jobMarketInsight: JobMarketInsight | null = null;

  loading = false;

  filters: TrendFilter[] = [
    'all',
    'article',
    'bulletin',
    'rss',
    'email',
    'starred'
  ];

  constructor(
    private router: Router,
    @Inject('TrendsServiceToken') private trendsService: BaseService<TrendItem>
  ) {}

  ngOnInit() {
    this.loadTrendsData();
  }

  async loadTrendsData() {
    this.loading = true;

    try {
      // Initialize mock service with data if using mock
      if (this.trendsService instanceof MockTrendsService) {
        (this.trendsService as MockTrendsService).setTrendItems(mockTrendItems);
        (this.trendsService as MockTrendsService).setTechTrends(mockTechTrends);
        (this.trendsService as MockTrendsService).setStandoutSkills(mockStandoutSkills);
        (this.trendsService as MockTrendsService).setRecommendations(mockLearningRecommendations);
        (this.trendsService as MockTrendsService).setJobOpportunities(mockJobOpportunities);
        (this.trendsService as MockTrendsService).setJobMarketInsight(mockJobMarketInsight);
      }

      // Load trend items
      await this.loadTrendItems();

      // Load tech trends
      const techResult = (this.trendsService as any).getTechTrends();
      if (techResult instanceof Promise) {
        this.techTrends = await techResult;
      } else {
        techResult.subscribe((data: TechTrend[]) => {
          this.techTrends = data;
        });
      }

      // Load standout skills
      const skillsResult = (this.trendsService as any).getStandoutSkills();
      if (skillsResult instanceof Promise) {
        this.standoutSkills = await skillsResult;
      } else {
        skillsResult.subscribe((data: StandoutSkill[]) => {
          this.standoutSkills = data;
        });
      }

      // Load recommendations
      const recsResult = (this.trendsService as any).getLearningRecommendations();
      if (recsResult instanceof Promise) {
        this.learningRecommendations = await recsResult;
      } else {
        recsResult.subscribe((data: LearningRecommendation[]) => {
          this.learningRecommendations = data;
        });
      }

      // Load job opportunities
      const jobsResult = (this.trendsService as any).getJobOpportunities({ minMatch: 70 });
      if (jobsResult instanceof Promise) {
        this.jobOpportunities = await jobsResult;
      } else {
        jobsResult.subscribe((data: JobOpportunity[]) => {
          this.jobOpportunities = data;
        });
      }

      // Load job market insight
      const insightResult = (this.trendsService as any).getJobMarketInsight();
      if (insightResult instanceof Promise) {
        this.jobMarketInsight = await insightResult;
      } else {
        insightResult.subscribe((data: JobMarketInsight) => {
          this.jobMarketInsight = data;
        });
      }

    } catch (error) {
      console.error('Failed to load trends data:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadTrendItems() {
    const options: TrendFilterOptions = {};

    if (this.selectedFilter !== 'all') {
      options.sourceType = this.selectedFilter;
    }

    const result = (this.trendsService as any).getTrendItems(options);
    if (result instanceof Promise) {
      this.trendItems = await result;
    } else {
      result.subscribe((data: TrendItem[]) => {
        this.trendItems = data;
      });
    }
  }

  setFilter(filter: TrendFilter) {
    this.selectedFilter = filter;
    this.loadTrendItems();
  }

  async refreshFeed() {
    this.loading = true;
    try {
      const result = (this.trendsService as any).refreshFeed();
      if (result instanceof Promise) {
        await result;
      } else {
        await result.toPromise();
      }
      await this.loadTrendItems();
    } catch (error) {
      console.error('Failed to refresh feed:', error);
    } finally {
      this.loading = false;
    }
  }

  async toggleStar(trendId: string, currentState: boolean) {
    try {
      const result = (this.trendsService as any).toggleStar(trendId, !currentState);
      if (result instanceof Promise) {
        await result;
      } else {
        await result.toPromise();
      }
      await this.loadTrendItems();
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  }

  async markAsRead(trendId: string) {
    try {
      const result = (this.trendsService as any).markAsRead(trendId);
      if (result instanceof Promise) {
        await result;
      } else {
        await result.toPromise();
      }
      await this.loadTrendItems();
      this.navigateToTrendNotification(trendId);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }

  getRelevanceColor(score: number): string {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  }

  getSourceIcon(type: string): string {
    return type; // Will use this for icon mapping in template
  }

  getPriorityClass(priority: string): string {
    const classes: {[key: string]: string} = {
      'high': 'bg-red-100 text-red-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-blue-100 text-blue-700'
    };
    return classes[priority] || classes['low'];
  }

  getTrendIcon(trend: string): string {
    return trend; // Will use this in template
  }

  navigateToTrendNotification(trendId: string) {
    this.router.navigate(['/trend-notification', trendId])
  }

  navigateToSkillNotification(id: string) {
    this.router.navigate(['/skill-notification', id])
  }

  navigateToRecommendation(id: string){
    this.router.navigate(['/recommendation', id])
  }

  navigateToMarketInsight() {
    this.router.navigate(['/market-insight'])
  }

}







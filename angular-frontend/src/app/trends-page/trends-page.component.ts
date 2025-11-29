import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  LearningRecommendation,
  JobOpportunity,
  MarketInsight,
  TrendFilterOptions,
  Skill
} from '../../models.interface';
import { BaseService } from '../../services/base_service';
import {
  mockTechTrends,
  mockLearningRecommendations,
  mockJobOpportunities,
  mockTrendItems,
  mockStandoutSkills,
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
  selectedTrend: MarketInsight | null = null;

  trendItems: MarketInsight[] = mockTrendItems;
  techTrends: MarketInsight[] = mockTechTrends;
  standoutSkills: Skill[] = mockStandoutSkills;
  learningRecommendations: LearningRecommendation[] = mockLearningRecommendations;
  jobOpportunities: JobOpportunity[] = mockJobOpportunities;
  jobMarketInsight: MarketInsight | null = mockJobMarketInsight;

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
    @Optional() @Inject('TrendsServiceToken') private trendsService?: BaseService<MarketInsight>
  ) {}

  ngOnInit() {
    this.loadTrendsData();
  }

  async loadTrendsData() {
    this.loading = true;

    try {
      // Use mock data if service is not available
      if (!this.trendsService) {
        this.loadMockData();
        return;
      }

      // Load from service with fallback to mock data
      await this.loadFromService();

    } catch (error) {
      console.error('Failed to load trends data from service, using mock data:', error);
      this.loadMockData();
    } finally {
      this.loading = false;
    }
  }

  private loadMockData() {
    this.trendItems = mockTrendItems;
    this.techTrends = mockTechTrends;
    this.standoutSkills = mockStandoutSkills;
    this.learningRecommendations = mockLearningRecommendations;
    this.jobOpportunities = mockJobOpportunities;
    this.jobMarketInsight = mockJobMarketInsight;
  }

  private async loadFromService() {
    // Load trend items
    await this.loadTrendItems();

    // Load tech trends
    const techResult = (this.trendsService as any).getTechTrends();
    if (techResult instanceof Promise) {
      this.techTrends = await techResult;
    } else {
      this.techTrends = await techResult.toPromise();
    }

    // Load standout skills
    const skillsResult = (this.trendsService as any).getStandoutSkills();
    if (skillsResult instanceof Promise) {
      this.standoutSkills = await skillsResult;
    } else {
      this.standoutSkills = await skillsResult.toPromise();
    }

    // Load recommendations
    const recsResult = (this.trendsService as any).getLearningRecommendations();
    if (recsResult instanceof Promise) {
      this.learningRecommendations = await recsResult;
    } else {
      this.learningRecommendations = await recsResult.toPromise();
    }

    // Load job opportunities
    const jobsResult = (this.trendsService as any).getJobOpportunities({ minMatch: 70 });
    if (jobsResult instanceof Promise) {
      this.jobOpportunities = await jobsResult;
    } else {
      this.jobOpportunities = await jobsResult.toPromise();
    }

    // Load job market insight
    const insightResult = (this.trendsService as any).getJobMarketInsight();
    if (insightResult instanceof Promise) {
      this.jobMarketInsight = await insightResult;
    } else {
      this.jobMarketInsight = await insightResult.toPromise();
    }
  }

  async loadTrendItems() {
    const options: TrendFilterOptions = {};

    if (this.selectedFilter !== 'all') {
      options.sourceType = this.selectedFilter;
    }

    // If service is unavailable, filter mock data
    if (!this.trendsService) {
      if (this.selectedFilter === 'all') {
        this.trendItems = mockTrendItems;
      } else {
        this.trendItems = mockTrendItems.filter(
          item => item.trend === this.selectedFilter
        );
      }
      return;
    }

    const result = (this.trendsService as any).getTrendItems(options);
    if (result instanceof Promise) {
      this.trendItems = await result;
    } else {
      this.trendItems = await result.toPromise();
    }
  }

  setFilter(filter: TrendFilter) {
    this.selectedFilter = filter;
    this.loadTrendItems();
  }

  async refreshFeed() {
    this.loading = true;
    try {
      if (this.trendsService) {
        const result = (this.trendsService as any).refreshFeed();
        if (result instanceof Promise) {
          await result;
        } else {
          await result.toPromise();
        }
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
      if (this.trendsService) {
        const result = (this.trendsService as any).toggleStar(trendId, !currentState);
        if (result instanceof Promise) {
          await result;
        } else {
          await result.toPromise();
        }
      } else {
        // Update mock data directly
        const trend = this.trendItems.find(t => t.id === trendId);
        if (trend) {
          trend.isStarred = !currentState;
        }
      }
      await this.loadTrendItems();
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  }

  async handleTrendClick(trendId: string) {
    console.log('Navigating to trend notification for:', trendId);
    this.router.navigate(['/trend-notification', trendId]);
    try {
      if (this.trendsService) {
        const result = (this.trendsService as any).markAsRead(trendId);
        if (result instanceof Promise) {
          await result;
        } else {
          await result.toPromise();
        }
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

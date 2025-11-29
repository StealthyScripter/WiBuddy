import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MarketInsight, JobOpportunity } from '../../../models.interface';
import {
  mockTrendItems,
  mockJobOpportunities,
  mockJobMarketInsight
} from '../../../services/test.data';

interface MarketData {
  trends: MarketInsight[];
  jobsByIndustry: {[key: string]: JobOpportunity[]};
  topGrowingSkills: Array<{name: string; growth: number}>;
  salaryInsight: {[key: string]: string};
  demandTrend: 'rising' | 'stable' | 'declining';
}

@Component({
  selector: 'app-market-insight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market-insight.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f9fafb;
    }
  `]
})
export class MarketInsightComponent implements OnInit {
  marketData: MarketData | undefined;
  selectedCategory = 'all';
  loading = true;

  categories = ['all', 'frontend', 'backend', 'devops', 'data-science'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadMarketData();
  }

  loadMarketData() {
    const jobsByIndustry: {[key: string]: JobOpportunity[]} = {};

    mockJobOpportunities.forEach(job => {
      const category = this.categorizeJob(job.title);
      if (!jobsByIndustry[category]) {
        jobsByIndustry[category] = [];
      }
      jobsByIndustry[category].push(job);
    });

    this.marketData = {
      trends: mockTrendItems.slice(0, 10),
      jobsByIndustry,
      topGrowingSkills: this.getTopGrowingSkills(),
      salaryInsight: this.getSalaryInsight(),
      demandTrend: 'rising'
    };

    this.loading = false;
  }

  private categorizeJob(title: string): string {
    const lower = title.toLowerCase();
    if (lower.includes('frontend') || lower.includes('react') || lower.includes('angular')) return 'frontend';
    if (lower.includes('backend') || lower.includes('devops') || lower.includes('infra')) return 'backend';
    if (lower.includes('devops') || lower.includes('sre') || lower.includes('cloud')) return 'devops';
    if (lower.includes('data') || lower.includes('ml') || lower.includes('ai')) return 'data-science';
    return 'all';
  }

  private getTopGrowingSkills(): Array<{name: string; growth: number}> {
    return [
      { name: 'Kubernetes', growth: 45 },
      { name: 'TypeScript', growth: 38 },
      { name: 'Python', growth: 35 },
      { name: 'Cloud Architecture', growth: 32 },
      { name: 'AI/ML', growth: 62 }
    ];
  }

  private getSalaryInsight(): {[key: string]: string} {
    return {
      'Frontend Developer': '$85K - $130K',
      'Backend Engineer': '$95K - $150K',
      'DevOps Engineer': '$100K - $160K',
      'Data Scientist': '$110K - $180K',
      'ML Engineer': '$120K - $200K'
    };
  }

  getFilteredJobs(): JobOpportunity[] {
    if (this.selectedCategory === 'all') {
      return mockJobOpportunities;
    }
    return mockJobOpportunities.filter(job =>
      this.categorizeJob(job.title) === this.selectedCategory
    );
  }

  getJobsByCategory(category: string): JobOpportunity[] {
    return this.marketData?.jobsByIndustry[category] || [];
  }

  getTrendColor(growth: number | undefined): string {
    if (!growth) return 'text-gray-600';
    if (growth > 0) return 'text-green-600';
    return 'text-red-600';
  }

  get totalJobPostings(): number {
    return this.marketData?.trends?.reduce(
      (sum, t) => sum + (t.jobListingCount || 0),
      0
    ) || 0;
  }


  navigateToJob(jobLink: string) {
    window.open(jobLink, '_blank');
  }

  goBack() {
    this.router.navigate(['/trends']);
  }
}

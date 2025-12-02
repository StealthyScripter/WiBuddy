import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LearningRecommendation,
  Priority,
  UUID
} from '../models.interface';
import { SkillService } from './skill.service';
import { JobService } from './job.service';
import { MarketService } from './market.service';
import { ConsoleLogger, ILogger } from './task.service';

@Injectable({ providedIn: 'root' })
export class RecommendationService {
  constructor(
    private skillService: SkillService,
    private jobService: JobService,
    private marketService: MarketService,
    private logger: ConsoleLogger
  ) {}

  private calculateMatchScore(skillGap: number, marketDemand: number, jobFrequency: number): number {
    const gapWeight = Math.min(skillGap / 30, 1) * 0.3;
    const demandWeight = (marketDemand / 100) * 0.5;
    const jobWeight = Math.min(jobFrequency / 100, 1) * 0.2;
    return Math.round((gapWeight + demandWeight + jobWeight) * 100);
  }

  private getProviderForSkill(skillName: string): string {
    const providers: Record<string, string> = {
      'python': 'Coursera',
      'react': 'Udemy',
      'typescript': 'edX',
      'kubernetes': 'Coursera',
      'docker': 'Pluralsight',
      'graphql': 'Egghead'
    };
    return providers[skillName.toLowerCase()] || 'Coursera';
  }

  private estimateDuration(skillGap: number): string {
    if (skillGap <= 20) return '2-3 weeks';
    if (skillGap <= 40) return '4-6 weeks';
    if (skillGap <= 60) return '2-3 months';
    return '3-6 months';
  }

  generateRecommendations(): Observable<LearningRecommendation[]> {
    try {
      return new Observable(subscriber => {
        this.skillService.getAllSkills().subscribe(skills => {
          this.jobService.getJobOpportunities().subscribe(jobs => {
            const recommendations = skills
              .filter(s => s.targetLevel - s.level > 10)
              .map((skill, index) => {
                const skillGap = skill.targetLevel - skill.level;
                const jobFrequency = jobs.filter(j => j.requiredSkills.includes(skill.name)).length;
                const matchScore = this.calculateMatchScore(skillGap, skill.marketDemand || 70, jobFrequency);

                const reason = skill.marketDemand && skill.marketDemand > 80
                  ? `High market demand (${skill.marketDemand}%) + Skill gap of ${skillGap}%`
                  : 'Career goal alignment + Growing in your field';

                return {
                  id: `rec-${index}` as UUID,
                  title: `Master ${skill.name}`,
                  reason,
                  provider: this.getProviderForSkill(skill.name),
                  duration: this.estimateDuration(skillGap),
                  priority: matchScore > 80 ? Priority.HIGH : matchScore > 60 ? Priority.MEDIUM : Priority.LOW,
                  matchScore,
                  skillsAddressed: [skill.name],
                  cost: Math.floor(skillGap / 2) * 10,
                  dateCreated: new Date().toISOString(),
                  link: `https://learning.example.com/${skill.name.toLowerCase()}`
                };
              })
              .sort((a, b) => b.matchScore - a.matchScore)
              .slice(0, 3);

            subscriber.next(recommendations);
            subscriber.complete();
          });
        });
      });
    } catch (error) {
      return throwError(() => error);
    }
  }

  rankRecommendations(): Observable<LearningRecommendation[]> {
    return this.generateRecommendations();
  }
}

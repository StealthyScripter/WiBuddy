import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  JobOpportunity,
  UUID
} from '../models.interface';
import { SkillService } from './skill.service';
import { ConsoleLogger, ILogger } from './task.service';

export class JobStore {
  private jobs: Map<UUID, JobOpportunity> = new Map();
  private jobsList: JobOpportunity[] = [];

  add(job: JobOpportunity): void {
    this.jobs.set(job.id, job);
    this.updateList();
  }

  update(id: UUID, job: JobOpportunity): void {
    this.jobs.set(id, job);
    this.updateList();
  }

  getAll(): JobOpportunity[] {
    return [...this.jobsList];
  }

  setAll(jobs: JobOpportunity[]): void {
    this.jobs.clear();
    jobs.forEach(j => this.jobs.set(j.id, j));
    this.updateList();
  }

  private updateList(): void {
    this.jobsList = Array.from(this.jobs.values());
  }
}

@Injectable({ providedIn: 'root' })
export class JobService {
  private store = new JobStore();

  private jobsSubject = new BehaviorSubject<JobOpportunity[]>([]);
  public jobs$ = this.jobsSubject.asObservable().pipe(distinctUntilChanged());

  constructor(
    private skillService: SkillService,
    private logger: ConsoleLogger
  ) {}

  calculateMatchPercentage(job: JobOpportunity): Observable<number> {
    try {
      return this.skillService.getAllSkills().pipe(
        map(skills => {
          const skillNames = skills.map(s => s.name);
          const matched = job.requiredSkills.filter(required =>
            skillNames.some(user => user.toLowerCase().includes(required.toLowerCase()) ||
              required.toLowerCase().includes(user.toLowerCase()))
          ).length;
          return Math.round((matched / job.requiredSkills.length) * 100);
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getRelevantJobs(minMatch: number = 60): Observable<JobOpportunity[]> {
    try {
      return new Observable(subscriber => {
        const jobs = this.store.getAll();
        const relevantJobs: JobOpportunity[] = [];

        if (jobs.length === 0) {
          subscriber.next([]);
          subscriber.complete();
          return;
        }

        let processed = 0;
        const results: JobOpportunity[] = [];

        jobs.forEach((job, index) => {
          this.calculateMatchPercentage(job).subscribe(matchPercentage => {
            if (matchPercentage >= minMatch) {
              results.push({ ...job, matchPercentage });
            }
            processed++;

            if (processed === jobs.length) {
              results.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
              subscriber.next(results);
              subscriber.complete();
            }
          });
        });
      });
    } catch (error) {
      return throwError(() => error);
    }
  }

  starJob(jobId: UUID): Observable<void> {
    try {
      const job = this.store.getAll().find(j => j.id === jobId);
      if (job) {
        job.isStarred = !job.isStarred;
        this.updateJobsSubject();
      }
      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  updateApplicationStatus(jobId: UUID, status: string): Observable<void> {
    try {
      const job = this.store.getAll().find(j => j.id === jobId);
      if (job) {
        job.applicationStatus = status;
        this.updateJobsSubject();
      }
      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  setInitialData(jobs: JobOpportunity[]): Observable<void> {
    try {
      this.store.setAll(jobs);
      this.updateJobsSubject();
      this.logger.info('Jobs initialized', { count: jobs.length });
      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getJobOpportunities(): Observable<JobOpportunity[]> {
    return this.jobs$.pipe(map(jobs => [...jobs]));
  }

  private updateJobsSubject(): void {
    this.jobsSubject.next(this.store.getAll());
  }
}

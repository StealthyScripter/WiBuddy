import { APP_INITIALIZER } from '@angular/core';
import { TaskService, DateProvider, ConsoleLogger } from '../services/task.service';
import { ProjectService } from '../services/project.service';
import { SkillService } from '../services/skill.service';
import { NoteService } from '../services/notes.service';
import { CalendarService } from '../services/calendar.service';
import { StatisticsService } from '../services/statistics.service';
import { RecommendationService } from '../services/recommendation.service';
import { JobService } from '../services/job.service';
import { MarketService } from '../services/market.service';
import { ResourceService } from '../services/resource.service';

import {
  mockTasks,
  mockProjects,
  mockSkillsLMS,
  mockNotes,
  mockJobOpportunities,
  mockTrendItems,
  mockResourcesData
} from '../services/test.data';

/**
 * Initialize all services with test data
 * Called automatically when app starts via APP_INITIALIZER
 */
export function initializeServices(
  taskService: TaskService,
  projectService: ProjectService,
  skillService: SkillService,
  noteService: NoteService,
  jobService: JobService,
  marketService: MarketService,
  resourceService: ResourceService
): () => void {
  return () => {
    console.log('Initializing services with test data...');

    // Load all test data
    taskService.setInitialData(mockTasks).subscribe({
      next: () => console.log('✓ Tasks initialized'),
      error: (err: any) => console.error('✗ Failed to initialize tasks', err)
    });

    projectService.setInitialData(mockProjects).subscribe({
      next: () => console.log('✓ Projects initialized'),
      error: (err: any) => console.error('✗ Failed to initialize projects', err)
    });

    skillService.setInitialData(mockSkillsLMS).subscribe({
      next: () => console.log('✓ Skills initialized'),
      error: (err: any) => console.error('✗ Failed to initialize skills', err)
    });

    noteService.setInitialData(mockNotes).subscribe({
      next: () => console.log('✓ Notes initialized'),
      error: (err: any) => console.error('✗ Failed to initialize notes', err)
    });

    jobService.setInitialData(mockJobOpportunities).subscribe({
      next: () => console.log('✓ Jobs initialized'),
      error: (err: any) => console.error('✗ Failed to initialize jobs', err)
    });

    marketService.setInitialData(mockTrendItems).subscribe({
      next: () => console.log('✓ Market insights initialized'),
      error: (err: any) => console.error('✗ Failed to initialize market insights', err)
    });

    resourceService.setInitialData(mockResourcesData).subscribe({
      next: () => console.log('✓ Resources initialized'),
      error: (err: any) => console.error('✗ Failed to initialize resources', err)
    });
  };
}

/**
 * Application-wide providers
 * All services are singletons provided at root level
 */
export const appProviders = [
  // Core utilities
  DateProvider,
  ConsoleLogger,

  // Core services (in dependency order)
  TaskService,
  ProjectService,
  SkillService,
  NoteService,
  CalendarService,
  StatisticsService,
  JobService,
  MarketService,
  RecommendationService,
  ResourceService,

  // App initializer - runs on startup
  {
    provide: APP_INITIALIZER,
    useFactory: initializeServices,
    deps: [
      TaskService,
      ProjectService,
      SkillService,
      NoteService,
      JobService,
      MarketService,
      ResourceService
    ],
    multi: true
  }
];

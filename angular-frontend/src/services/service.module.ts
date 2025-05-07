// src/services/service.module.ts
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TaskService, MockTaskService, TaskServiceFactory } from './task_service';
import { ProjectService, MockProjectService, ProjectServiceFactory } from './project_service';
import { NoteService, MockNoteService, NoteServiceFactory } from './notes_service';
import { AuthService, MockAuthService, AuthServiceFactory } from './auth_service';
import { AuthInterceptor } from './auth.interceptor';
import { CalendarService, MockCalendarService, CalendarServiceFactory } from './calendar_service';
import { environment } from '../environments/environment';
import { mockTasks, mockProjects, mockNotes, mockCalendarEvents } from './test.data';
import { BaseService } from './base_service';
import { Task, Project, Note, CalendarEvent } from '../models.interface';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    // Modern HTTP Client provider (recommended instead of HttpClientModule)
    provideHttpClient(withInterceptorsFromDi()),

    // HTTP Interceptor for authentication
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // Base HTTP Services
    TaskService,
    ProjectService,
    NoteService,
    AuthService,
    CalendarService,

    // Auth Service Provider
    {
      provide: 'AuthServiceToken',
      useFactory: (http: HttpClient) => {
        return AuthServiceFactory.getService(environment.production ? http : undefined);
      },
      deps: [HttpClient]
    },

    // Task Service Provider
    {
      provide: 'TaskServiceToken',
      useFactory: (http: HttpClient) => {
        const service = TaskServiceFactory.getService(environment.production ? http : undefined);
        if (service instanceof MockTaskService && 'setTasks' in service) {
          (service as any).setTasks(mockTasks);
        }
        return service;
      },
      deps: [HttpClient]
    },

    // Project Service Provider
    {
      provide: 'ProjectServiceToken',
      useFactory: (http: HttpClient) => {
        const service = ProjectServiceFactory.getService(environment.production ? http : undefined);
        if (service instanceof MockProjectService && 'setProjects' in service) {
          (service as any).setProjects(mockProjects);
        }
        return service;
      },
      deps: [HttpClient]
    },

    // Note Service Provider
    {
      provide: 'NoteServiceToken',
      useFactory: (http: HttpClient) => {
        const service = NoteServiceFactory.getService(environment.production ? http : undefined);
        if (service instanceof MockNoteService && 'setNotes' in service) {
          (service as any).setNotes(mockNotes);
        }
        return service;
      },
      deps: [HttpClient]
    },

    // Calendar Service Provider
    {
      provide: 'CalendarServiceToken',
      useFactory: (http: HttpClient) => {
        const service = CalendarServiceFactory.getService(environment.production ? http : undefined);
        if (service instanceof MockCalendarService && 'setEvents' in service) {
          (service as any).setEvents(mockCalendarEvents);
        }
        return service;
      },
      deps: [HttpClient]
    }
  ],
  exports: [
    HttpClientModule
  ]
})
export class ServiceModule { }

/**
 * Type definitions for service tokens
 */
export interface ServiceTokens {
  'TaskServiceToken': BaseService<Task>;
  'ProjectServiceToken': BaseService<Project>;
  'NoteServiceToken': BaseService<Note>;
  'CalendarServiceToken': BaseService<CalendarEvent>;
  'AuthServiceToken': AuthService | MockAuthService;
}

/**
 * Usage examples in component:
 *
 * // Using specific service
 * constructor(@Inject('TaskServiceToken') private taskService: BaseService<Task>) {}
 *
 * ngOnInit() {
 *   // For both mock and HTTP services - unified API
 *   if (this.taskService.getAll() instanceof Promise) {
 *     // Mock service - Promise-based
 *     this.taskService.getAll().then(tasks => {
 *       this.tasks = tasks;
 *     });
 *   } else {
 *     // HTTP service - Observable-based
 *     this.taskService.getAll().subscribe(response => {
 *       this.tasks = response.tasks || [];
 *     });
 *   }
 * }
 *
 * // Note: You can also inject the specific service implementation if needed
 * constructor(private taskService: TaskService) {}
 */

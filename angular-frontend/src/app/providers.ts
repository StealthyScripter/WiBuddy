import { importProvidersFrom } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskServiceFactory, MockTaskService } from '../services/task_service';
import { ProjectServiceFactory, MockProjectService } from '../services/project_service';
import { mockTasks, mockProjects } from '../services/test.data';
import { BaseService } from '../services/base_service';
import { Task, Project } from '../models.interface';
import { AuthService } from '../services/auth_service';

export const appProviders = [
  AuthService,
  {
    provide: 'TaskServiceToken',
    useFactory: (http: HttpClient) => {
      const service = TaskServiceFactory.getService(http);
      if (service instanceof MockTaskService) {
        (service as MockTaskService).setTasks(mockTasks);
      }
      return service;
    },
    deps: [HttpClient]
  },
  {
    provide: 'ProjectServiceToken',
    useFactory: (http: HttpClient) => {
      const service = ProjectServiceFactory.getService(http);
      if (service instanceof MockProjectService) {
        (service as MockProjectService).setProjects(mockProjects);
      }
      return service;
    },
    deps: [HttpClient]
  },
  {
    provide: 'AuthServiceToken',
    useValue: {} // Mock object for now
  }
];

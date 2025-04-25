// src/services/project_service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Project, Task, TaskStatus } from '../models.interface';
import { BaseHttpService, BaseMockService, BaseService } from './base_service';
import { UtilityService } from './utility_service';
import { MockTaskService } from './task_service';

/**
 * HTTP-based Project Service for production use
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseHttpService<Project> {
  constructor(private httpClient: HttpClient) {
    super(`${environment.apiUrl}/projects`, httpClient);
  }

  /**
   * Get projects with optional filtering
   */
  getProjects(options: {
    page?: number,
    perPage?: number,
    isCompleted?: boolean,
    status?: TaskStatus
  } = {}): Observable<any> {
    let params = new HttpParams()
      .set('page', options.page?.toString() || '1')
      .set('per_page', options.perPage?.toString() || '20');

    if (options.isCompleted !== undefined) {
      params = params.set('is_completed', options.isCompleted.toString());
    }

    if (options.status !== undefined) {
      params = params.set('status', options.status);
    }

    return this.http.get(this.apiUrl, { params })
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch projects')));
  }

  /**
   * Get project with all associated tasks
   */
  getProjectWithTasks(id: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${id}/with-tasks`
    ).pipe(
      catchError(error => UtilityService.handleError(error, 'Failed to fetch project with tasks'))
    );
  }

  /**
   * Get recently updated projects
   */
  getRecentProjects(limit: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('sort_by', 'last_modified')
      .set('sort_direction', 'desc')
      .set('limit', limit.toString());

    return this.http.get(`${this.apiUrl}/recent`, { params })
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch recent projects')));
  }

  /**
   * Update project progress
   */
  updateProgress(id: string, progress: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${id}/progress`,
      { progress }
    ).pipe(
      catchError(error => UtilityService.handleError(error, 'Failed to update project progress'))
    );
  }
}

/**
 * Mock Project Service for development use
 */
@Injectable({
  providedIn: 'root'
})
export class MockProjectService extends BaseMockService<Project> {
  private taskService?: MockTaskService;

  constructor() {
    super([]);
    // Normally we'd set this.data = mockProjects
  }

  setProjects(mockProjects: Project[]) {
    this.data = [...mockProjects];
  }

  setTaskService(taskService: MockTaskService) {
    this.taskService = taskService;
  }

  /**
   * Get project with all related tasks
   */
  async getProjectWithTasks(id: string): Promise<{ project: Project; tasks: Task[] } | undefined> {
    const project = await this.getById(id);
    if (!project) return undefined;

    let tasks: Task[] = [];
    if (this.taskService) {
      tasks = await this.taskService.getByProjectId(id);
    }

    return { project, tasks };
  }

  /**
   * Get recently updated projects
   */
  async getRecentProjects(limit: number = 5): Promise<Project[]> {
    await UtilityService.simulateDelay();
    return [...this.data]
      .sort((a, b) => {
        const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
        const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  /**
   * Get projects by completion status
   */
  async getByCompletionStatus(completionStatus: TaskStatus | null): Promise<Project[]> {
    await UtilityService.simulateDelay();
    return this.data.filter(project =>
      completionStatus === null || project.completionStatus === completionStatus
    );
  }

  /**
   * Update project progress
   */
  async updateProgress(id: string, progress: number): Promise<Project | undefined> {
    return this.update(id, { progress });
  }
}

/**
 * Project Service Factory - returns appropriate service based on environment
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectServiceFactory {
  static getService(http?: HttpClient): BaseService<Project> {
    if (environment.production && http) {
      return new ProjectService(http);
    } else {
      return new MockProjectService();
    }
  }
}

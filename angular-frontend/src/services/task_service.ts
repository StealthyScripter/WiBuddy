import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Task, Priority, TaskStatus } from '../models.interface';
import { BaseHttpService, BaseMockService, BaseService } from './base_service';
import { UtilityService } from './utility_service';

/**
 * HTTP-based Task Service for production use
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseHttpService<Task> {
  constructor(private httpClient: HttpClient) {
    super(`${environment.apiUrl}/tasks`, httpClient);
  }

  /**
   * Get tasks with optional filtering
   */
  getTasks(options: {
    page?: number,
    perPage?: number,
    projectId?: string,
    isCompleted?: boolean,
    status?: TaskStatus,
    priority?: Priority,
    technologyId?: string,
    isMilestone?: boolean,
    dueDate?: string,
    hierarchy?: string
  } = {}): Observable<any> {
    let params = new HttpParams()
      .set('page', options.page?.toString() || '1')
      .set('per_page', options.perPage?.toString() || '20');

    if (options.projectId !== undefined) {
      params = params.set('project_id', options.projectId);
    }

    if (options.isCompleted !== undefined) {
      params = params.set('is_completed', options.isCompleted.toString());
    }

    if (options.status !== undefined) {
      params = params.set('status', options.status);
    }

    if (options.priority !== undefined) {
      params = params.set('priority', options.priority);
    }

    if (options.technologyId !== undefined) {
      params = params.set('technology_id', options.technologyId);
    }

    if (options.isMilestone !== undefined) {
      params = params.set('is_milestone', options.isMilestone.toString());
    }

    if (options.dueDate !== undefined) {
      params = params.set('due_date', options.dueDate);
    }

    if (options.hierarchy !== undefined) {
      params = params.set('hierarchy', options.hierarchy);
    }

    return this.http.get(this.apiUrl, { params })
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch tasks')));
  }

  /**
   * Get tasks by project ID
   */
  getTasksByProjectId(projectId: string): Observable<any> | Task {
    return this.getTasks({ projectId });
  }

  /**
   * Toggle task completion status
   */
  toggleCompletion(id: string, isCompleted: boolean): Observable<any> {
    return this.update(id, { isCompleted });
  }

  /**
   * Get task metrics (completed vs total)
   */
  getTaskMetrics(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/metrics`
    ).pipe(
      catchError(error => UtilityService.handleError(error, 'Failed to fetch task metrics'))
    );
  }

  /**
   * Create a new task
   */
  createTask(task: {
    name: string,
    description?: string,
    due_date?: string,
    estimated_duration?: number,
    project_id?: string,
    technology_id?: string,
    is_milestone?: boolean,
    hierarchy?: string
  }): Observable<any> {
    return this.create(task);
  }

  /**
   * Update a task
   */
  updateTask(id: string, updates: {
    name?: string,
    description?: string,
    due_date?: string,
    estimated_duration?: number,
    project_id?: string,
    technology_id?: string,
    is_milestone?: boolean,
    hierarchy?: string
  }): Observable<any> {
    return this.update(id, updates);
  }

  /**
   * Mark task as complete
   */
  markTaskComplete(id: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}/complete`,
      {}
    ).pipe(
      catchError(error => UtilityService.handleError(error, 'Failed to mark task as complete'))
    );
  }

  /**
   * Mark task as incomplete
   */
  markTaskIncomplete(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}/complete`
    ).pipe(
      catchError(error => UtilityService.handleError(error, 'Failed to mark task as incomplete'))
    );
  }
}

/**
 * Mock Task Service for development use
 */
@Injectable({
  providedIn: 'root'
})
export class MockTaskService extends BaseMockService<Task> {
  constructor() {
    super([]);
    // Normally we'd set this.data = mockTasks
  }

  setTasks(mockTasks: Task[]): void {
    this.data = [...mockTasks];
  }

  /**
   * Get tasks by project ID
   */
  async getByProjectId(projectId: string): Promise<Task[]> {
    await UtilityService.simulateDelay();
    return this.data.filter(task => task.projectId === projectId);
  }

  /**
   * Get tasks by completion status
   */
  async getByCompletionStatus(completed: boolean): Promise<Task[]> {
    await UtilityService.simulateDelay();
    return this.data.filter(task => task.isCompleted === completed);
  }

  /**
   * Get tasks by due date range
   */
  async getByDueDateRange(startDate: Date, endDate: Date): Promise<Task[]> {
    await UtilityService.simulateDelay();
    return this.data.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= startDate && dueDate <= endDate;
    });
  }

  /**
   * Get tasks by priority
   */
  async getByPriority(priority: Priority): Promise<Task[]> {
    await UtilityService.simulateDelay();
    return this.data.filter(task => task.priority === priority);
  }

  /**
   * Get tasks by milestone status
   */
  async getByMilestoneStatus(isMilestone: boolean): Promise<Task[]> {
    await UtilityService.simulateDelay();
    return this.data.filter(task => task.isMilestone === isMilestone);
  }

  /**
   * Get tasks by tag
   */
  async getByTag(tag: string): Promise<Task[]> {
    await UtilityService.simulateDelay();
    return this.data.filter(task => task.tags?.includes(tag));
  }

  /**
   * Mark task as complete
   */
  async markTaskComplete(id: string): Promise<Task | undefined> {
    await UtilityService.simulateDelay();
    return this.update(id, { isCompleted: true });
  }

  /**
   * Mark task as incomplete
   */
  async markTaskIncomplete(id: string): Promise<Task | undefined> {
    await UtilityService.simulateDelay();
    return this.update(id, { isCompleted: false });
  }

  /**
   * Get task metrics (completed vs total)
   */
  async getTaskMetrics(): Promise<{ completed: number, total: number }> {
    await UtilityService.simulateDelay();
    const completed = this.data.filter(task => task.isCompleted).length;
    const total = this.data.length;
    return { completed, total };
  }
}

/**
 * Task Service Factory - returns appropriate service based on environment
 */
@Injectable({
  providedIn: 'root'
})
export class TaskServiceFactory {
  static getService(http?: HttpClient): BaseService<Task> {
    if (environment.production && http) {
      return new TaskService(http);
    } else {
      return new MockTaskService();
    }
  }
}


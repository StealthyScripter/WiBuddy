import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  Task,
  TaskStatus,
  UUID,
  FilterOptions,
  Priority
} from '../models.interface';

export interface IDateProvider {
  now(): string;
}

export interface ILogger {
  info(message: string, data?: any): void;
  error(message: string, error?: any): void;
  warn(message: string, data?: any): void;
}

@Injectable({ providedIn: 'root' })
export class DateProvider implements IDateProvider {
  now(): string {
    return new Date().toISOString();
  }
}

@Injectable({ providedIn: 'root' })
export class ConsoleLogger implements ILogger {
  info(message: string, data?: any): void {
    console.log(`[INFO] ${message}`, data);
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error);
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data);
  }
}

export class TaskStore {
  private tasks: Map<UUID, Task> = new Map();
  private tasksList: Task[] = [];

  add(task: Task): void {
    this.tasks.set(task.id, task);
    this.updateList();
  }

  update(id: UUID, task: Task): void {
    if (!this.tasks.has(id)) throw new Error(`Task ${id} not found`);
    this.tasks.set(id, task);
    this.updateList();
  }

  delete(id: UUID): void {
    this.tasks.delete(id);
    this.updateList();
  }

  get(id: UUID): Task | undefined {
    return this.tasks.get(id);
  }

  getAll(): Task[] {
    return [...this.tasksList];
  }

  setAll(tasks: Task[]): void {
    this.tasks.clear();
    tasks.forEach(t => this.tasks.set(t.id, t));
    this.updateList();
  }

  private updateList(): void {
    this.tasksList = Array.from(this.tasks.values());
  }
}

export class TaskValidator {
  validate(task: Partial<Task>): string[] {
    const errors: string[] = [];
    if (!task.name?.trim()) errors.push('Task name is required');
    if (task.name && task.name.length > 255) errors.push('Task name must be 255 characters or less');
    if (task.priority && !Object.values(Priority).includes(task.priority)) errors.push('Invalid priority');
    if (task.dueDate && isNaN(new Date(task.dueDate).getTime())) errors.push('Invalid date format');
    if (task.estimatedDuration !== undefined && task.estimatedDuration < 0) errors.push('Duration cannot be negative');
    return errors;
  }
}

export class TaskFilterEngine {
  apply(tasks: Task[], filters: FilterOptions): Task[] {
    return Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null)
      .reduce((acc, [key, value]) => this.applyFilter(acc, key, value), tasks);
  }

  private applyFilter(tasks: Task[], key: string, value: any): Task[] {
    switch (key) {
      case 'completionStatus':
        return tasks.filter(t => t.completionStatus === value);
      case 'priority':
        return tasks.filter(t => t.priority === value);
      case 'category':
        return tasks.filter(t => t.category === value);
      case 'searchQuery':
        const query = value.toLowerCase();
        return tasks.filter(t =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      default:
        return tasks;
    }
  }
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private store = new TaskStore();
  private filterEngine = new TaskFilterEngine();
  private validator = new TaskValidator();
  private caches = new Map<string, { data: any; timestamp: number }>();

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable().pipe(distinctUntilChanged());
  private errorSubject = new Subject<{ message: string; error: any }>();
  public error$ = this.errorSubject.asObservable();

  constructor(
    private dateProvider: DateProvider,
    private logger: ConsoleLogger
  ) {}

  private getCache<T>(key: string): T | null {
    const cached = this.caches.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > 5000) {
      this.caches.delete(key);
      return null;
    }
    return cached.data as T;
  }

  private setCache<T>(key: string, data: T): void {
    this.caches.set(key, { data, timestamp: Date.now() });
  }

  private invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.caches.clear();
    } else {
      Array.from(this.caches.keys())
        .filter(key => key.includes(pattern))
        .forEach(key => this.caches.delete(key));
    }
  }

  createTask(taskInput: Partial<Task>): Observable<Task> {
    const errors = this.validator.validate(taskInput);
    if (errors.length > 0) {
      const message = `Validation failed: ${errors.join('; ')}`;
      this.logger.error(message);
      return throwError(() => new Error(message));
    }

    try {
      const task: Task = {
        ...(taskInput as Task),
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as UUID,
        dateCreated: taskInput.dateCreated || this.dateProvider.now(),
        lastModified: this.dateProvider.now(),
        isCompleted: taskInput.isCompleted ?? false,
        completionStatus: taskInput.completionStatus || TaskStatus.NOT_STARTED
      };

      this.store.add(task);
      this.invalidateCache();
      this.updateTasksSubject();
      this.logger.info('Task created', { id: task.id, name: task.name });

      return new Observable(subscriber => {
        subscriber.next(task);
        subscriber.complete();
      });
    } catch (error) {
      this.logger.error('Failed to create task', error);
      this.errorSubject.next({ message: 'Failed to create task', error });
      return throwError(() => error);
    }
  }

  updateTask(id: UUID, updates: Partial<Task>): Observable<Task> {
    if (!id?.trim()) return throwError(() => new Error('Task ID is required'));

    const errors = this.validator.validate(updates);
    if (errors.length > 0) return throwError(() => new Error(`Validation failed: ${errors.join('; ')}`));

    try {
      const existing = this.store.get(id);
      if (!existing) return throwError(() => new Error(`Task ${id} not found`));

      const updated: Task = {
        ...existing,
        ...updates,
        id: existing.id,
        dateCreated: existing.dateCreated,
        lastModified: this.dateProvider.now()
      };

      this.store.update(id, updated);
      this.invalidateCache();
      this.updateTasksSubject();
      this.logger.info('Task updated', { id });

      return new Observable(subscriber => {
        subscriber.next(updated);
        subscriber.complete();
      });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to update task', error });
      return throwError(() => error);
    }
  }

  deleteTask(id: UUID): Observable<void> {
    if (!id?.trim()) return throwError(() => new Error('Task ID is required'));

    try {
      if (!this.store.get(id)) return throwError(() => new Error(`Task ${id} not found`));
      this.store.delete(id);
      this.invalidateCache();
      this.updateTasksSubject();
      this.logger.info('Task deleted', { id });

      return new Observable(subscriber => {
        subscriber.next();
        subscriber.complete();
      });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to delete task', error });
      return throwError(() => error);
    }
  }

  getTaskById(id: UUID): Observable<Task | undefined> {
    const cached = this.getCache<Task>(`task_${id}`);
    if (cached) return new Observable(s => { s.next(cached); s.complete(); });

    try {
      const task = this.store.get(id);
      if (task) this.setCache(`task_${id}`, task);
      return new Observable(s => { s.next(task); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getTasksByProject(projectId: UUID): Observable<Task[]> {
    const cached = this.getCache<Task[]>(`project_${projectId}`);
    if (cached) return new Observable(s => { s.next(cached); s.complete(); });

    try {
      const tasks = this.store.getAll().filter(t => t.projectId === projectId);
      this.setCache(`project_${projectId}`, tasks);
      return new Observable(s => { s.next(tasks); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    const cached = this.getCache<Task[]>(`status_${status}`);
    if (cached) return new Observable(s => { s.next(cached); s.complete(); });

    try {
      const tasks = this.store.getAll().filter(t => t.completionStatus === status);
      this.setCache(`status_${status}`, tasks);
      return new Observable(s => { s.next(tasks); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getOverdueTasks(userId?: UUID): Observable<Task[]> {
    try {
      const today = new Date();
      let tasks = this.store.getAll().filter(t => t.dueDate && new Date(t.dueDate) < today && !t.isCompleted);
      if (userId) tasks = tasks.filter(t => t.assigneeId === userId);
      return new Observable(s => { s.next(tasks); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getRecentActivities(userId: UUID, limit: number = 5): Observable<Task[]> {
    if (!userId?.trim()) return throwError(() => new Error('User ID required'));

    try {
      const tasks = this.store.getAll()
        .filter(t => t.assigneeId === userId)
        .sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime())
        .slice(0, limit);
      return new Observable(s => { s.next(tasks); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  markTaskComplete(id: UUID): Observable<Task> {
    return this.updateTask(id, {
      isCompleted: true,
      completionStatus: TaskStatus.COMPLETED,
      completionDate: this.dateProvider.now()
    });
  }

  filterTasks(filters: FilterOptions): Observable<Task[]> {
    try {
      const tasks = this.filterEngine.apply(this.store.getAll(), filters);
      return new Observable(s => { s.next(tasks); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  setInitialData(tasks: Task[]): Observable<void> {
    try {
      this.store.setAll(tasks);
      this.updateTasksSubject();
      this.logger.info('Tasks initialized', { count: tasks.length });
      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getAllTasks(): Observable<Task[]> {
    return this.tasks$.pipe(map(tasks => [...tasks]));
  }

  private updateTasksSubject(): void {
    this.tasksSubject.next(this.store.getAll());
  }
}


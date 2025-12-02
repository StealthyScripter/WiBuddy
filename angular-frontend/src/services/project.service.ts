import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  Project,
  TaskStatus,
  UUID
} from '../models.interface';
import { TaskService } from './task.service';
import { DateProvider, ILogger, ConsoleLogger } from './task.service';

export class ProjectStore {
  private projects: Map<UUID, Project> = new Map();
  private projectsList: Project[] = [];

  add(project: Project): void {
    this.projects.set(project.id, project);
    this.updateList();
  }

  update(id: UUID, project: Project): void {
    if (!this.projects.has(id)) throw new Error(`Project ${id} not found`);
    this.projects.set(id, project);
    this.updateList();
  }

  delete(id: UUID): void {
    this.projects.delete(id);
    this.updateList();
  }

  get(id: UUID): Project | undefined {
    return this.projects.get(id);
  }

  getAll(): Project[] {
    return [...this.projectsList];
  }

  setAll(projects: Project[]): void {
    this.projects.clear();
    projects.forEach(p => this.projects.set(p.id, p));
    this.updateList();
  }

  private updateList(): void {
    this.projectsList = Array.from(this.projects.values());
  }
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private store = new ProjectStore();
  private caches = new Map<string, { data: any; timestamp: number }>();

  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable().pipe(distinctUntilChanged());
  private errorSubject = new Subject<{ message: string; error: any }>();
  public error$ = this.errorSubject.asObservable();

  constructor(
    private taskService: TaskService,
    private dateProvider: DateProvider,
    private logger: ConsoleLogger
  ) {}

  private getCache<T>(key: string): T | null {
    const cached = this.caches.get(key);
    if (!cached || Date.now() - cached.timestamp > 5000) {
      this.caches.delete(key);
      return null;
    }
    return cached.data as T;
  }

  private setCache<T>(key: string, data: T): void {
    this.caches.set(key, { data, timestamp: Date.now() });
  }

  private invalidateCache(): void {
    this.caches.clear();
  }

  createProject(projectInput: Partial<Project>): Observable<Project> {
    if (!projectInput.name?.trim()) {
      return throwError(() => new Error('Project name is required'));
    }

    try {
      const project: Project = {
        ...(projectInput as Project),
        id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as UUID,
        dateCreated: projectInput.dateCreated || this.dateProvider.now(),
        lastModified: this.dateProvider.now(),
        progress: projectInput.progress || 0,
        isCompleted: projectInput.isCompleted ?? false,
        completionStatus: projectInput.completionStatus || TaskStatus.NOT_STARTED
      };

      this.store.add(project);
      this.invalidateCache();
      this.updateProjectsSubject();
      this.logger.info('Project created', { id: project.id, name: project.name });

      return new Observable(s => { s.next(project); s.complete(); });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to create project', error });
      return throwError(() => error);
    }
  }

  updateProject(id: UUID, updates: Partial<Project>): Observable<Project> {
    if (!id?.trim()) return throwError(() => new Error('Project ID is required'));

    try {
      const existing = this.store.get(id);
      if (!existing) return throwError(() => new Error(`Project ${id} not found`));

      const updated: Project = {
        ...existing,
        ...updates,
        id: existing.id,
        dateCreated: existing.dateCreated,
        lastModified: this.dateProvider.now()
      };

      this.store.update(id, updated);
      this.invalidateCache();
      this.updateProjectsSubject();

      return new Observable(s => { s.next(updated); s.complete(); });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to update project', error });
      return throwError(() => error);
    }
  }

  deleteProject(id: UUID): Observable<void> {
    if (!id?.trim()) return throwError(() => new Error('Project ID is required'));

    try {
      if (!this.store.get(id)) return throwError(() => new Error(`Project ${id} not found`));
      this.store.delete(id);
      this.invalidateCache();
      this.updateProjectsSubject();

      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to delete project', error });
      return throwError(() => error);
    }
  }

  getProjectById(id: UUID): Observable<Project | undefined> {
    const cached = this.getCache<Project>(`project_${id}`);
    if (cached) return new Observable(s => { s.next(cached); s.complete(); });

    try {
      const project = this.store.get(id);
      if (project) this.setCache(`project_${id}`, project);
      return new Observable(s => { s.next(project); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getProjectsByUserId(userId: UUID): Observable<Project[]> {
    if (!userId?.trim()) return throwError(() => new Error('User ID required'));

    try {
      const projects = this.store.getAll().filter(p => p.ownerId === userId);
      return new Observable(s => { s.next(projects); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getProjectsByDepartment(department: string): Observable<Project[]> {
    if (!department?.trim()) return throwError(() => new Error('Department required'));

    try {
      const projects = this.store.getAll().filter(p => p.department === department);
      return new Observable(s => { s.next(projects); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getActiveProjects(userId?: UUID): Observable<Project[]> {
    try {
      let projects = this.store.getAll().filter(p => p.completionStatus !== TaskStatus.COMPLETED && !p.isCompleted);
      if (userId) projects = projects.filter(p => p.ownerId === userId);
      return new Observable(s => { s.next(projects); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  calculateProjectProgress(id: UUID): Observable<number> {
    if (!id?.trim()) return throwError(() => new Error('Project ID required'));

    try {
      return this.taskService.getTasksByProject(id).pipe(
        map(tasks => {
          if (tasks.length === 0) return 0;
          const completed = tasks.filter(t => t.isCompleted).length;
          return Math.round((completed / tasks.length) * 100);
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  setInitialData(projects: Project[]): Observable<void> {
    try {
      this.store.setAll(projects);
      this.updateProjectsSubject();
      this.logger.info('Projects initialized', { count: projects.length });
      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getAllProjects(): Observable<Project[]> {
    return this.projects$.pipe(map(projects => [...projects]));
  }

  private updateProjectsSubject(): void {
    this.projectsSubject.next(this.store.getAll());
  }
}

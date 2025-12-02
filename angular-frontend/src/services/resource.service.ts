import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  Resource,
  UUID
} from '../models.interface';
import { DateProvider, ConsoleLogger } from './task.service';

export class ResourceStore {
  private resources: Map<UUID, Resource> = new Map();
  private resourcesList: Resource[] = [];

  add(resource: Resource): void {
    this.resources.set(resource.id, resource);
    this.updateList();
  }

  update(id: UUID, resource: Resource): void {
    if (!this.resources.has(id)) throw new Error(`Resource ${id} not found`);
    this.resources.set(id, resource);
    this.updateList();
  }

  delete(id: UUID): void {
    this.resources.delete(id);
    this.updateList();
  }

  get(id: UUID): Resource | undefined {
    return this.resources.get(id);
  }

  getAll(): Resource[] {
    return [...this.resourcesList];
  }

  setAll(resources: Resource[]): void {
    this.resources.clear();
    resources.forEach(r => this.resources.set(r.id, r));
    this.updateList();
  }

  private updateList(): void {
    this.resourcesList = Array.from(this.resources.values());
  }
}

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private store = new ResourceStore();

  private resourcesSubject = new BehaviorSubject<Resource[]>([]);
  public resources$ = this.resourcesSubject.asObservable().pipe(distinctUntilChanged());
  private errorSubject = new Subject<{ message: string; error: any }>();
  public error$ = this.errorSubject.asObservable();

  constructor(
    private dateProvider: DateProvider,
    private logger: ConsoleLogger
  ) {}

  createResource(resourceInput: Partial<Resource>): Observable<Resource> {
    if (!resourceInput.name?.trim()) {
      return throwError(() => new Error('Resource name is required'));
    }

    try {
      const resource: Resource = {
        ...(resourceInput as Resource),
        id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as UUID,
        dateCreated: resourceInput.dateCreated || this.dateProvider.now(),
        progress: resourceInput.progress || 0,
        modules: resourceInput.modules || 0,
        completedModules: resourceInput.completedModules || 0,
        content: resourceInput.content || [],
        type: resourceInput.type || 'resource'
      };

      this.store.add(resource);
      this.updateResourcesSubject();
      this.logger.info('Resource created', { id: resource.id });

      return new Observable(s => { s.next(resource); s.complete(); });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to create resource', error });
      return throwError(() => error);
    }
  }

  updateResource(id: UUID, updates: Partial<Resource>): Observable<Resource> {
    if (!id?.trim()) return throwError(() => new Error('Resource ID required'));

    try {
      const existing = this.store.get(id);
      if (!existing) return throwError(() => new Error(`Resource ${id} not found`));

      const updated: Resource = {
        ...existing,
        ...updates,
        id: existing.id,
        dateCreated: existing.dateCreated
      };

      this.store.update(id, updated);
      this.updateResourcesSubject();

      return new Observable(s => { s.next(updated); s.complete(); });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to update resource', error });
      return throwError(() => error);
    }
  }

  deleteResource(id: UUID): Observable<void> {
    if (!id?.trim()) return throwError(() => new Error('Resource ID required'));

    try {
      if (!this.store.get(id)) return throwError(() => new Error(`Resource ${id} not found`));
      this.store.delete(id);
      this.updateResourcesSubject();

      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to delete resource', error });
      return throwError(() => error);
    }
  }

  getResourceById(id: UUID): Observable<Resource | undefined> {
    try {
      const resource = this.store.get(id);
      return new Observable(s => { s.next(resource); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getResourcesByCategory(category: string): Observable<Resource[]> {
    if (!category?.trim()) return throwError(() => new Error('Category required'));

    try {
      const resources = this.store.getAll().filter(r => r.category === category);
      return new Observable(s => { s.next(resources); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getResourceTree(parentId?: UUID): Observable<Resource[]> {
    try {
      const resources = this.store.getAll().filter(r => r.parentId === parentId);
      return new Observable(s => { s.next(resources); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  updateResourceProgress(id: UUID, progress: number): Observable<Resource> {
    if (progress < 0 || progress > 100) {
      return throwError(() => new Error('Progress must be 0-100'));
    }

    return this.updateResource(id, { progress } as Partial<Resource>);
  }

  setInitialData(resources: Resource[]): Observable<void> {
    try {
      this.store.setAll(resources);
      this.updateResourcesSubject();
      this.logger.info('Resources initialized', { count: resources.length });
      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getAllResources(): Observable<Resource[]> {
    return this.resources$.pipe(map(resources => [...resources]));
  }

  private updateResourcesSubject(): void {
    this.resourcesSubject.next(this.store.getAll());
  }
}

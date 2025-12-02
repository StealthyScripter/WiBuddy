import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  Skill,
  UUID
} from '../models.interface';
import { DateProvider, ConsoleLogger } from './task.service';

export class SkillStore {
  private skills: Map<UUID, Skill> = new Map();
  private skillsList: Skill[] = [];

  add(skill: Skill): void {
    this.skills.set(skill.id, skill);
    this.updateList();
  }

  update(id: UUID, skill: Skill): void {
    if (!this.skills.has(id)) throw new Error(`Skill ${id} not found`);
    this.skills.set(id, skill);
    this.updateList();
  }

  delete(id: UUID): void {
    this.skills.delete(id);
    this.updateList();
  }

  get(id: UUID): Skill | undefined {
    return this.skills.get(id);
  }

  getAll(): Skill[] {
    return [...this.skillsList];
  }

  setAll(skills: Skill[]): void {
    this.skills.clear();
    skills.forEach(s => this.skills.set(s.id, s));
    this.updateList();
  }

  private updateList(): void {
    this.skillsList = Array.from(this.skills.values());
  }
}

@Injectable({ providedIn: 'root' })
export class SkillService {
  private store = new SkillStore();

  private skillsSubject = new BehaviorSubject<Skill[]>([]);
  public skills$ = this.skillsSubject.asObservable().pipe(distinctUntilChanged());
  private errorSubject = new Subject<{ message: string; error: any }>();
  public error$ = this.errorSubject.asObservable();

  constructor(
    private dateProvider: DateProvider,
    private logger: ConsoleLogger
  ) {}

  createSkill(skillInput: Partial<Skill>): Observable<Skill> {
    if (!skillInput.name?.trim()) {
      return throwError(() => new Error('Skill name is required'));
    }

    if ((skillInput.level ?? 0) < 0 || (skillInput.level ?? 0) > 100) {
      return throwError(() => new Error('Skill level must be 0-100'));
    }

    try {
      const skill: Skill = {
        ...(skillInput as Skill),
        id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as UUID,
        dateCreated: skillInput.dateCreated || this.dateProvider.now(),
        lastUpdated: this.dateProvider.now(),
        level: skillInput.level || 0,
        targetLevel: skillInput.targetLevel || 0
      };

      this.store.add(skill);
      this.updateSkillsSubject();
      this.logger.info('Skill created', { id: skill.id, name: skill.name });

      return new Observable(s => { s.next(skill); s.complete(); });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to create skill', error });
      return throwError(() => error);
    }
  }

  updateSkill(id: UUID, updates: Partial<Skill>): Observable<Skill> {
    if (!id?.trim()) return throwError(() => new Error('Skill ID is required'));

    try {
      const existing = this.store.get(id);
      if (!existing) return throwError(() => new Error(`Skill ${id} not found`));

      const updated: Skill = {
        ...existing,
        ...updates,
        id: existing.id,
        dateCreated: existing.dateCreated,
        lastUpdated: this.dateProvider.now()
      };

      this.store.update(id, updated);
      this.updateSkillsSubject();

      return new Observable(s => { s.next(updated); s.complete(); });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to update skill', error });
      return throwError(() => error);
    }
  }

  deleteSkill(id: UUID): Observable<void> {
    if (!id?.trim()) return throwError(() => new Error('Skill ID is required'));

    try {
      if (!this.store.get(id)) return throwError(() => new Error(`Skill ${id} not found`));
      this.store.delete(id);
      this.updateSkillsSubject();

      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to delete skill', error });
      return throwError(() => error);
    }
  }

  getSkillById(id: UUID): Observable<Skill | undefined> {
    try {
      const skill = this.store.get(id);
      return new Observable(s => { s.next(skill); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getSkillsByCategory(category: string): Observable<Skill[]> {
    if (!category?.trim()) return throwError(() => new Error('Category required'));

    try {
      const skills = this.store.getAll().filter(s => s.category === category);
      return new Observable(s => { s.next(skills); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  updateSkillLevel(id: UUID, level: number): Observable<Skill> {
    if (level < 0 || level > 100) {
      return throwError(() => new Error('Level must be 0-100'));
    }

    return this.updateSkill(id, { level } as Partial<Skill>);
  }

  getSkillGaps(): Observable<Skill[]> {
    try {
      const gaps = this.store.getAll()
        .filter(s => s.targetLevel - s.level > 0)
        .sort((a, b) => (b.targetLevel - b.level) - (a.targetLevel - a.level));
      return new Observable(s => { s.next(gaps); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getSortedByMarketDemand(): Observable<Skill[]> {
    try {
      const sorted = [...this.store.getAll()].sort((a, b) =>
        (b.marketDemand || 0) - (a.marketDemand || 0)
      );
      return new Observable(s => { s.next(sorted); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getSortedByGap(): Observable<Skill[]> {
    try {
      const sorted = [...this.store.getAll()].sort((a, b) =>
        (b.targetLevel - b.level) - (a.targetLevel - a.level)
      );
      return new Observable(s => { s.next(sorted); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  setInitialData(skills: Skill[]): Observable<void> {
    try {
      this.store.setAll(skills);
      this.updateSkillsSubject();
      this.logger.info('Skills initialized', { count: skills.length });
      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getAllSkills(): Observable<Skill[]> {
    return this.skills$.pipe(map(skills => [...skills]));
  }

  private updateSkillsSubject(): void {
    this.skillsSubject.next(this.store.getAll());
  }
}

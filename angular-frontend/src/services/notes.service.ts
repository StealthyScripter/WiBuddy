import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  Note,
  UUID
} from '../models.interface';
import { DateProvider, ConsoleLogger } from './task.service';

export class NoteStore {
  private notes: Map<UUID, Note> = new Map();
  private notesList: Note[] = [];

  add(note: Note): void {
    this.notes.set(note.id, note);
    this.updateList();
  }

  update(id: UUID, note: Note): void {
    if (!this.notes.has(id)) throw new Error(`Note ${id} not found`);
    this.notes.set(id, note);
    this.updateList();
  }

  delete(id: UUID): void {
    this.notes.delete(id);
    this.updateList();
  }

  get(id: UUID): Note | undefined {
    return this.notes.get(id);
  }

  getAll(): Note[] {
    return [...this.notesList];
  }

  setAll(notes: Note[]): void {
    this.notes.clear();
    notes.forEach(n => this.notes.set(n.id, n));
    this.updateList();
  }

  private updateList(): void {
    this.notesList = Array.from(this.notes.values());
  }
}

@Injectable({ providedIn: 'root' })
export class NoteService {
  private store = new NoteStore();

  private notesSubject = new BehaviorSubject<Note[]>([]);
  public notes$ = this.notesSubject.asObservable().pipe(distinctUntilChanged());
  private errorSubject = new Subject<{ message: string; error: any }>();
  public error$ = this.errorSubject.asObservable();

  constructor(
    private dateProvider: DateProvider,
    private logger: ConsoleLogger
  ) {}

  createNote(noteInput: Partial<Note>): Observable<Note> {
    if (!noteInput.name?.trim()) {
      return throwError(() => new Error('Note name is required'));
    }

    try {
      const note: Note = {
        ...(noteInput as Note),
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as UUID,
        dateCreated: noteInput.dateCreated || this.dateProvider.now(),
        lastModified: this.dateProvider.now(),
        content: noteInput.content || []
      };

      this.store.add(note);
      this.updateNotesSubject();
      this.logger.info('Note created', { id: note.id });

      return new Observable(s => { s.next(note); s.complete(); });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to create note', error });
      return throwError(() => error);
    }
  }

  updateNote(id: UUID, updates: Partial<Note>): Observable<Note> {
    if (!id?.trim()) return throwError(() => new Error('Note ID is required'));

    try {
      const existing = this.store.get(id);
      if (!existing) return throwError(() => new Error(`Note ${id} not found`));

      const updated: Note = {
        ...existing,
        ...updates,
        id: existing.id,
        dateCreated: existing.dateCreated,
        lastModified: this.dateProvider.now()
      };

      this.store.update(id, updated);
      this.updateNotesSubject();

      return new Observable(s => { s.next(updated); s.complete(); });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to update note', error });
      return throwError(() => error);
    }
  }

  deleteNote(id: UUID): Observable<void> {
    if (!id?.trim()) return throwError(() => new Error('Note ID is required'));

    try {
      if (!this.store.get(id)) return throwError(() => new Error(`Note ${id} not found`));
      this.store.delete(id);
      this.updateNotesSubject();

      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      this.errorSubject.next({ message: 'Failed to delete note', error });
      return throwError(() => error);
    }
  }

  getNoteById(id: UUID): Observable<Note | undefined> {
    try {
      const note = this.store.get(id);
      return new Observable(s => { s.next(note); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getRecentNotes(limit: number = 5): Observable<Note[]> {
    try {
      const notes = [...this.store.getAll()]
        .sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime())
        .slice(0, limit);
      return new Observable(s => { s.next(notes); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  searchNotes(query: string): Observable<Note[]> {
    if (!query?.trim()) return throwError(() => new Error('Query required'));

    try {
      const lowerQuery = query.toLowerCase();
      const notes = this.store.getAll().filter(n =>
        n.name.toLowerCase().includes(lowerQuery) ||
        n.content?.some(c => c.toLowerCase().includes(lowerQuery)) ||
        n.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
      return new Observable(s => { s.next(notes); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getNotesByTag(tag: string): Observable<Note[]> {
    if (!tag?.trim()) return throwError(() => new Error('Tag required'));

    try {
      const notes = this.store.getAll().filter(n => n.tags?.includes(tag));
      return new Observable(s => { s.next(notes); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  setInitialData(notes: Note[]): Observable<void> {
    try {
      this.store.setAll(notes);
      this.updateNotesSubject();
      this.logger.info('Notes initialized', { count: notes.length });
      return new Observable(s => { s.next(); s.complete(); });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getAllNotes(): Observable<Note[]> {
    return this.notes$.pipe(map(notes => [...notes]));
  }

  private updateNotesSubject(): void {
    this.notesSubject.next(this.store.getAll());
  }
}

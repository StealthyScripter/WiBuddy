// src/services/note_service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Note } from '../models.interface';
import { BaseHttpService, BaseMockService, BaseService } from './base_service';
import { UtilityService } from './utility_service';

/**
 * HTTP-based Note Service for production use
 */
@Injectable({
  providedIn: 'root'
})
export class NoteService extends BaseHttpService<Note> {
  constructor(private httpClient: HttpClient) {
    super(`${environment.apiUrl}/notes`, httpClient);
  }

  /**
   * Get notes with optional filtering
   */
  getNotes(options: {
    page?: number,
    perPage?: number,
    taskId?: string,
    search?: string,
    tags?: string[]
  } = {}): Observable<any> {
    let params = new HttpParams()
      .set('page', options.page?.toString() || '1')
      .set('per_page', options.perPage?.toString() || '20');

    if (options.taskId) {
      params = params.set('task_id', options.taskId);
    }

    if (options.search) {
      params = params.set('search', options.search);
    }

    if (options.tags && options.tags.length > 0) {
      params = params.set('tags', options.tags.join(','));
    }

    return this.http.get(this.apiUrl, { params })
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch notes')));
  }

  /**
   * Get notes by task ID
   */
  getNotesByTaskId(taskId: string): Observable<any> {
    return this.getNotes({ taskId });
  }

  /**
   * Get recent notes
   */
  getRecentNotes(limit: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('sort_by', 'date_created')
      .set('sort_direction', 'desc')
      .set('limit', limit.toString());

    return this.http.get(`${this.apiUrl}/recent`, { params })
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch recent notes')));
  }

  /**
   * Generate AI summary for a note
   */
  generateAISummary(id: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${id}/generate-summary`,
      {}
    ).pipe(
      catchError(error => UtilityService.handleError(error, 'Failed to generate AI summary'))
    );
  }
}

/**
 * Mock Note Service for development use
 */
@Injectable({
  providedIn: 'root'
})
export class MockNoteService extends BaseMockService<Note> {
  constructor() {
    super([]);
    // Normally we'd set this.data = mockNotes
  }

  setNotes(mockNotes: Note[]) {
    this.data = [...mockNotes];
  }

  /**
   * Get notes by task ID
   */
  async getByTaskId(taskId: string): Promise<Note[]> {
    await UtilityService.simulateDelay();
    return this.data.filter(note => note.id === taskId);
  }

  /**
   * Search notes by content
   */
  async searchNotes(query: string): Promise<Note[]> {
    await UtilityService.simulateDelay();
    if (!query.trim()) return this.data;

    const lowerCaseQuery = query.toLowerCase();

    return this.data.filter(note => {
      // Check if name includes the query
      const nameMatch = note.name.toLowerCase().includes(lowerCaseQuery);

      // Check if any content includes the query
      const contentMatch = note.content.some(contentItem =>
        contentItem.toLowerCase().includes(lowerCaseQuery)
      );

      return nameMatch || contentMatch;
    });
  }

  /**
   * Get recent notes
   */
  async getRecentNotes(limit: number = 5): Promise<Note[]> {
    await UtilityService.simulateDelay();
    return [...this.data]
      .sort((a, b) => {
        const dateA = a.dateCreated ? new Date(a.dateCreated).getTime() : 0;
        const dateB = b.dateCreated ? new Date(b.dateCreated).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  /**
   * Get notes by tags
   */
  async getByTags(tags: string[]): Promise<Note[]> {
    await UtilityService.simulateDelay();
    return this.data.filter(note =>
      note.tags && tags.some(tag => note.tags?.includes(tag))
    );
  }

  /**
   * Generate AI summary for a note
   */
  async generateAISummary(id: string): Promise<Note | undefined> {
    await UtilityService.simulateDelay(1000); // Longer delay to simulate AI processing

    const note = await this.getById(id);
    if (!note) return undefined;

    // Simple summary generation for mock purposes
    const content = note.content.join(' ');
    const summaryLength = Math.min(content.length, 150);
    const summary = content.substring(0, summaryLength) + '...';

    return this.update(id, { aiSummary: summary });
  }
}

/**
 * Note Service Factory - returns appropriate service based on environment
 */
@Injectable({
  providedIn: 'root'
})
export class NoteServiceFactory {
  static getService(http?: HttpClient): BaseService<Note> {
    if (environment.production && http) {
      return new NoteService(http);
    } else {
      return new MockNoteService();
    }
  }
}

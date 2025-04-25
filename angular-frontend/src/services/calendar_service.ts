// src/services/calendar_service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { CalendarEvent } from '../models.interface';
import { BaseHttpService, BaseMockService, BaseService } from './base_service';
import { UtilityService } from './utility_service';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameDay,
  isSameMonth,
  differenceInMinutes,
  addMonths,
  addWeeks,
  addDays
} from 'date-fns';

/**
 * HTTP-based Calendar Service for production use
 */
@Injectable({
  providedIn: 'root'
})
export class CalendarService extends BaseHttpService<CalendarEvent> {
  constructor(private httpClient: HttpClient) {
    super(`${environment.apiUrl}/calendar-events`, httpClient);
  }

  /**
   * Get events with optional filtering by date range
   */
  getEvents(options: {
    startDate?: Date,
    endDate?: Date,
    type?: string,
    projectId?: number
  } = {}): Observable<any> {
    let params = new HttpParams();

    if (options.startDate) {
      params = params.set('start_date', options.startDate.toISOString());
    }

    if (options.endDate) {
      params = params.set('end_date', options.endDate.toISOString());
    }

    if (options.type) {
      params = params.set('type', options.type);
    }

    if (options.projectId) {
      params = params.set('project_id', options.projectId.toString());
    }

    return this.http.get(this.apiUrl, { params })
      .pipe(catchError(error => UtilityService.handleError(error, 'Failed to fetch calendar events')));
  }

  /**
   * Get events for a specific week
   */
  getWeekEvents(date: Date): Observable<any> {
    const weekStart = startOfWeek(date);
    const weekEnd = endOfWeek(date);

    return this.getEvents({
      startDate: weekStart,
      endDate: weekEnd
    });
  }

  /**
   * Get events for a specific month
   */
  getMonthEvents(date: Date): Observable<any> {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    return this.getEvents({
      startDate: monthStart,
      endDate: monthEnd
    });
  }
}

/**
 * Mock Calendar Service for development use
 */
@Injectable({
  providedIn: 'root'
})
export class MockCalendarService extends BaseMockService<CalendarEvent> {
  constructor() {
    super([]);
    // Normally we'd set this.data = mockEvents
  }

  setEvents(mockEvents: CalendarEvent[]) {
    this.data = [...mockEvents];
  }

  /**
   * Get events for a specific date
   */
  async getEventsForDate(date: Date): Promise<CalendarEvent[]> {
    await UtilityService.simulateDelay();
    return this.data.filter(event => isSameDay(event.date, date));
  }

  /**
   * Get events for a specific week
   */
  async getWeekEvents(date: Date): Promise<CalendarEvent[]> {
    await UtilityService.simulateDelay();
    const weekStart = startOfWeek(date);
    const weekEnd = endOfWeek(date);

    return this.data.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });
  }

  /**
   * Get events for a specific month
   */
  async getMonthEvents(date: Date): Promise<CalendarEvent[]> {
    await UtilityService.simulateDelay();
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    return this.data.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });
  }

  /**
   * Utility functions for calendar calculations
   */
  calculateEventTop(event: CalendarEvent): number {
    // Calculate position based on time (minutes since midnight)
    const minutes = event.date.getHours() * 60 + event.date.getMinutes();
    return (minutes / 60) * 50; // 50px per hour
  }

  calculateEventHeight(event: CalendarEvent): number {
    // Calculate height based on duration
    if (!event.endDate) return 25; // Default height for events without end time

    const durationMinutes = differenceInMinutes(event.endDate, event.date);
    return (durationMinutes / 60) * 50; // 50px per hour
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return isSameDay(date1, date2);
  }

  isSameMonth(date1: Date, date2: Date): boolean {
    return isSameMonth(date1, date2);
  }

  generateMonthDates(start: Date): Date[] {
    const daysInWeek = 7;
    const weeksToShow = 6;
    return Array.from({ length: daysInWeek * weeksToShow }, (_, i) =>
      addDays(start, i - start.getDay())
    );
  }

  generateWeekDates(start: Date): Date[] {
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }
}

/**
 * Calendar Service Factory - returns appropriate service based on environment
 */
@Injectable({
  providedIn: 'root'
})
export class CalendarServiceFactory {
  static getService(http?: HttpClient): BaseService<CalendarEvent> {
    if (environment.production && http) {
      return new CalendarService(http) as unknown as BaseService<CalendarEvent>;
    } else {
      return new MockCalendarService();
    }
  }
}

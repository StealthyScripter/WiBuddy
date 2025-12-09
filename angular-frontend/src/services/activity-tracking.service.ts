import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged } from 'rxjs';
import { ImportedCalendar, RecentActivity, CalendarEvent, UUID } from '../models.interface';

// ============= Store Classes =============

class ImportedCalendarStore {
  private calendars: Map<UUID, ImportedCalendar> = new Map();
  private calendarsList: ImportedCalendar[] = [];

  add(calendar: ImportedCalendar): void {
    this.calendars.set(calendar.id, calendar);
    this.calendarsList.push(calendar);
  }

  update(id: UUID, calendar: Partial<ImportedCalendar>): void {
    const existing = this.calendars.get(id);
    if (existing) {
      const updated = { ...existing, ...calendar, lastModified: new Date().toISOString() };
      this.calendars.set(id, updated);
      const index = this.calendarsList.findIndex(c => c.id === id);
      if (index !== -1) {
        this.calendarsList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.calendars.delete(id);
    this.calendarsList = this.calendarsList.filter(c => c.id !== id);
  }

  get(id: UUID): ImportedCalendar | undefined {
    return this.calendars.get(id);
  }

  getAll(): ImportedCalendar[] {
    return [...this.calendarsList];
  }

  clear(): void {
    this.calendars.clear();
    this.calendarsList = [];
  }
}

class RecentActivityStore {
  private activities: Map<UUID, RecentActivity> = new Map();
  private activitiesList: RecentActivity[] = [];

  add(activity: RecentActivity): void {
    this.activities.set(activity.id, activity);
    this.activitiesList.push(activity);
  }

  update(id: UUID, activity: Partial<RecentActivity>): void {
    const existing = this.activities.get(id);
    if (existing) {
      const updated = { ...existing, ...activity, lastModified: new Date().toISOString() };
      this.activities.set(id, updated);
      const index = this.activitiesList.findIndex(a => a.id === id);
      if (index !== -1) {
        this.activitiesList[index] = updated;
      }
    }
  }

  delete(id: UUID): void {
    this.activities.delete(id);
    this.activitiesList = this.activitiesList.filter(a => a.id !== id);
  }

  get(id: UUID): RecentActivity | undefined {
    return this.activities.get(id);
  }

  getAll(): RecentActivity[] {
    return [...this.activitiesList];
  }

  clear(): void {
    this.activities.clear();
    this.activitiesList = [];
  }
}

// ============= Logger =============

interface ILogger {
  log(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
}

class ConsoleLogger implements ILogger {
  log(message: string, ...args: any[]): void {
    console.log(`[ActivityTrackingService] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[ActivityTrackingService] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[ActivityTrackingService] ${message}`, ...args);
  }
}

// ============= Date Provider =============

class DateProvider {
  now(): string {
    return new Date().toISOString();
  }
}

// ============= Calendar Sync Engine =============

class CalendarSyncEngine {
  async syncCalendar(calendar: ImportedCalendar): Promise<CalendarEvent[]> {
    // TODO: Integrate with actual calendar APIs (Google Calendar, Outlook, iCal)
    console.log('Syncing calendar:', calendar.name, calendar.source);

    // Simulate API call delay
    await this.delay(2000);

    // Mock calendar events
    const events: CalendarEvent[] = [
      {
        id: this.generateId(),
        name: 'Imported Event 1',
        date: new Date(),
        type: 'meeting',
        color: calendar.color || '#3b82f6',
        description: 'Event from ' + calendar.name
      },
      {
        id: this.generateId(),
        name: 'Imported Event 2',
        date: new Date(Date.now() + 86400000), // Tomorrow
        type: 'meeting',
        color: calendar.color || '#3b82f6',
        description: 'Event from ' + calendar.name
      }
    ];

    return events;
  }

  async importFromGoogle(accessToken: string): Promise<CalendarEvent[]> {
    // TODO: Implement Google Calendar API integration
    console.log('Importing from Google Calendar');
    await this.delay(1500);
    return [];
  }

  async importFromOutlook(accessToken: string): Promise<CalendarEvent[]> {
    // TODO: Implement Outlook Calendar API integration
    console.log('Importing from Outlook Calendar');
    await this.delay(1500);
    return [];
  }

  async importFromICS(url: string): Promise<CalendarEvent[]> {
    // TODO: Implement iCal (.ics) parsing
    console.log('Importing from iCal URL:', url);
    await this.delay(1500);
    return [];
  }

  private generateId(): UUID {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============= Main Service =============

@Injectable({
  providedIn: 'root'
})
export class ActivityTrackingService {
  private calendarStore = new ImportedCalendarStore();
  private activityStore = new RecentActivityStore();
  private logger: ILogger = new ConsoleLogger();
  private dateProvider = new DateProvider();
  private syncEngine = new CalendarSyncEngine();

  // Observables
  private calendarsSubject = new BehaviorSubject<ImportedCalendar[]>([]);
  public calendars$ = this.calendarsSubject.asObservable().pipe(distinctUntilChanged());

  private activitiesSubject = new BehaviorSubject<RecentActivity[]>([]);
  public activities$ = this.activitiesSubject.asObservable().pipe(distinctUntilChanged());

  // Error subject
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  // Sync intervals
  private syncIntervals: Map<UUID, any> = new Map();

  constructor() {
    this.logger.log('ActivityTrackingService initialized');
  }

  // ============= Imported Calendar Management =============

  async addImportedCalendar(
    calendarData: Omit<ImportedCalendar, 'id' | 'dateCreated' | 'lastModified'>
  ): Promise<ImportedCalendar> {
    try {
      const calendar: ImportedCalendar = {
        ...calendarData,
        id: this.generateId(),
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now(),
        isActive: calendarData.isActive !== false,
        events: []
      };

      this.calendarStore.add(calendar);
      this.calendarsSubject.next(this.calendarStore.getAll());
      this.logger.log('Imported calendar added:', calendar.name);

      // Perform initial sync
      await this.syncCalendar(calendar.id);

      // Set up auto-sync if enabled and frequency is specified
      if (calendar.isActive && calendar.syncFrequency) {
        this.setupAutoSync(calendar.id, calendar.syncFrequency);
      }

      return calendar;
    } catch (error) {
      this.handleError('Failed to add imported calendar', error);
      throw error;
    }
  }

  async syncCalendar(calendarId: UUID): Promise<void> {
    try {
      const calendar = this.calendarStore.get(calendarId);
      if (!calendar) {
        throw new Error(`Calendar with id ${calendarId} not found`);
      }

      this.logger.log('Syncing calendar:', calendar.name);

      let events: CalendarEvent[] = [];

      switch (calendar.source) {
        case 'GOOGLE':
          events = calendar.accessToken
            ? await this.syncEngine.importFromGoogle(calendar.accessToken)
            : [];
          break;
        case 'OUTLOOK':
          events = calendar.accessToken
            ? await this.syncEngine.importFromOutlook(calendar.accessToken)
            : [];
          break;
        case 'ICAL':
          events = calendar.url
            ? await this.syncEngine.importFromICS(calendar.url)
            : [];
          break;
        case 'MANUAL':
        default:
          events = await this.syncEngine.syncCalendar(calendar);
          break;
      }

      this.calendarStore.update(calendarId, {
        events,
        lastSynced: this.dateProvider.now()
      });

      this.calendarsSubject.next(this.calendarStore.getAll());
      this.logger.log('Calendar synced:', calendar.name, `${events.length} events`);
    } catch (error) {
      this.handleError('Failed to sync calendar', error);
      throw error;
    }
  }

  async syncAllCalendars(): Promise<void> {
    const calendars = this.calendarStore.getAll().filter(c => c.isActive);
    for (const calendar of calendars) {
      try {
        await this.syncCalendar(calendar.id);
      } catch (error) {
        this.logger.error('Failed to sync calendar:', calendar.name, error);
      }
    }
  }

  private setupAutoSync(calendarId: UUID, frequencyMinutes: number): void {
    // Clear existing interval if any
    this.clearAutoSync(calendarId);

    // Set up new interval
    const interval = setInterval(async () => {
      try {
        await this.syncCalendar(calendarId);
      } catch (error) {
        this.logger.error('Auto-sync failed for calendar:', calendarId, error);
      }
    }, frequencyMinutes * 60 * 1000);

    this.syncIntervals.set(calendarId, interval);
    this.logger.log('Auto-sync enabled for calendar:', calendarId, `Every ${frequencyMinutes} minutes`);
  }

  private clearAutoSync(calendarId: UUID): void {
    const interval = this.syncIntervals.get(calendarId);
    if (interval) {
      clearInterval(interval);
      this.syncIntervals.delete(calendarId);
    }
  }

  updateImportedCalendar(id: UUID, updates: Partial<ImportedCalendar>): void {
    const calendar = this.calendarStore.get(id);
    if (!calendar) return;

    this.calendarStore.update(id, updates);

    // Update auto-sync if frequency or active status changed
    if (updates.syncFrequency !== undefined || updates.isActive !== undefined) {
      const updatedCalendar = this.calendarStore.get(id);
      if (updatedCalendar?.isActive && updatedCalendar.syncFrequency) {
        this.setupAutoSync(id, updatedCalendar.syncFrequency);
      } else {
        this.clearAutoSync(id);
      }
    }

    this.calendarsSubject.next(this.calendarStore.getAll());
  }

  deleteImportedCalendar(id: UUID): void {
    this.clearAutoSync(id);
    this.calendarStore.delete(id);
    this.calendarsSubject.next(this.calendarStore.getAll());
    this.logger.log('Imported calendar deleted:', id);
  }

  getImportedCalendarById(id: UUID): ImportedCalendar | undefined {
    return this.calendarStore.get(id);
  }

  getAllImportedCalendars(): ImportedCalendar[] {
    return this.calendarStore.getAll();
  }

  getActiveCalendars(): ImportedCalendar[] {
    return this.calendarStore.getAll().filter(c => c.isActive);
  }

  getAllImportedEvents(): CalendarEvent[] {
    const allEvents: CalendarEvent[] = [];
    this.calendarStore.getAll().forEach(calendar => {
      if (calendar.isActive && calendar.events) {
        allEvents.push(...calendar.events);
      }
    });
    return allEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // ============= Recent Activity Tracking =============

  recordActivity(
    type: RecentActivity['type'],
    entityId: UUID,
    entityName: string,
    action: RecentActivity['action'],
    description?: string,
    metadata?: Record<string, any>
  ): RecentActivity {
    try {
      const activity: RecentActivity = {
        id: this.generateId(),
        type,
        entityId,
        entityName,
        action,
        description,
        timestamp: this.dateProvider.now(),
        metadata,
        dateCreated: this.dateProvider.now(),
        lastModified: this.dateProvider.now()
      };

      this.activityStore.add(activity);

      // Keep only the last 1000 activities to prevent memory issues
      const allActivities = this.activityStore.getAll();
      if (allActivities.length > 1000) {
        const sortedActivities = allActivities.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        const toDelete = sortedActivities.slice(1000);
        toDelete.forEach(a => this.activityStore.delete(a.id));
      }

      this.activitiesSubject.next(this.activityStore.getAll());
      return activity;
    } catch (error) {
      this.handleError('Failed to record activity', error);
      throw error;
    }
  }

  deleteActivity(id: UUID): void {
    this.activityStore.delete(id);
    this.activitiesSubject.next(this.activityStore.getAll());
  }

  getRecentActivities(limit: number = 50): RecentActivity[] {
    return this.activityStore.getAll()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  getActivitiesByType(type: RecentActivity['type'], limit?: number): RecentActivity[] {
    const activities = this.activityStore.getAll()
      .filter(a => a.type === type)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return limit ? activities.slice(0, limit) : activities;
  }

  getActivitiesByAction(action: RecentActivity['action'], limit?: number): RecentActivity[] {
    const activities = this.activityStore.getAll()
      .filter(a => a.action === action)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return limit ? activities.slice(0, limit) : activities;
  }

  getActivitiesForEntity(entityId: UUID): RecentActivity[] {
    return this.activityStore.getAll()
      .filter(a => a.entityId === entityId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getActivitiesInDateRange(startDate: string, endDate: string): RecentActivity[] {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return this.activityStore.getAll()
      .filter(a => {
        const activityDate = new Date(a.timestamp);
        return activityDate >= start && activityDate <= end;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getRecentlyCompleted(limit: number = 10): RecentActivity[] {
    return this.activityStore.getAll()
      .filter(a => a.action === 'COMPLETED')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  getRecentlyViewed(limit: number = 10): RecentActivity[] {
    return this.activityStore.getAll()
      .filter(a => a.action === 'VIEWED')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  clearOldActivities(daysOld: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const allActivities = this.activityStore.getAll();
    const toDelete = allActivities.filter(a => new Date(a.timestamp) < cutoffDate);

    toDelete.forEach(a => this.activityStore.delete(a.id));
    this.activitiesSubject.next(this.activityStore.getAll());

    this.logger.log(`Cleared ${toDelete.length} old activities older than ${daysOld} days`);
  }

  // ============= Statistics =============

  getActivityStatistics() {
    const activities = this.activityStore.getAll();

    const totalActivities = activities.length;

    const activitiesByType = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const activitiesByAction = activities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const last24Hours = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return activityDate >= oneDayAgo;
    }).length;

    const lastWeek = activities.filter(a => {
      const activityDate = new Date(a.timestamp);
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return activityDate >= oneWeekAgo;
    }).length;

    return {
      totalActivities,
      activitiesByType,
      activitiesByAction,
      last24Hours,
      lastWeek
    };
  }

  getCalendarStatistics() {
    const calendars = this.calendarStore.getAll();

    const totalCalendars = calendars.length;
    const activeCalendars = calendars.filter(c => c.isActive).length;
    const totalImportedEvents = this.getAllImportedEvents().length;

    const calendarsBySource = calendars.reduce((acc, calendar) => {
      acc[calendar.source] = (acc[calendar.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCalendars,
      activeCalendars,
      totalImportedEvents,
      calendarsBySource
    };
  }

  // ============= Utility Methods =============

  private generateId(): UUID {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleError(message: string, error: any): void {
    this.logger.error(message, error);
    this.errorSubject.next(message);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  // ============= Data Management =============

  setInitialData(calendars: ImportedCalendar[], activities: RecentActivity[]): void {
    this.calendarStore.clear();
    this.activityStore.clear();

    calendars.forEach(calendar => this.calendarStore.add(calendar));
    activities.forEach(activity => this.activityStore.add(activity));

    this.calendarsSubject.next(this.calendarStore.getAll());
    this.activitiesSubject.next(this.activityStore.getAll());

    // Set up auto-sync for active calendars
    calendars.forEach(calendar => {
      if (calendar.isActive && calendar.syncFrequency) {
        this.setupAutoSync(calendar.id, calendar.syncFrequency);
      }
    });

    this.logger.log(`Initialized with ${calendars.length} calendars and ${activities.length} activities`);
  }

  clearAllData(): void {
    // Clear all sync intervals
    this.syncIntervals.forEach((interval, calendarId) => {
      this.clearAutoSync(calendarId);
    });

    this.calendarStore.clear();
    this.activityStore.clear();
    this.calendarsSubject.next([]);
    this.activitiesSubject.next([]);
    this.logger.log('All data cleared');
  }

  ngOnDestroy(): void {
    // Clean up all sync intervals
    this.syncIntervals.forEach((interval, calendarId) => {
      this.clearAutoSync(calendarId);
    });
  }
}

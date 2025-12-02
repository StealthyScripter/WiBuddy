import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CalendarEvent,
  CalendarDay,
  TaskStatus,
  Priority
} from '../models.interface';
import { ConsoleLogger, TaskService } from './task.service';
import { ProjectService } from './project.service';
import { ILogger } from './task.service';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private logger: ConsoleLogger
  ) {}

  private getPriorityColor(priority?: Priority): string {
    const colors: Record<Priority, string> = {
      [Priority.LOW]: '#10b981',
      [Priority.MEDIUM]: '#f59e0b',
      [Priority.HIGH]: '#ef4444',
      [Priority.CRITICAL]: '#7c3aed'
    };
    return colors[priority || Priority.MEDIUM];
  }

  private getStatusColor(status?: TaskStatus): string {
    const colors: Record<TaskStatus, string> = {
      [TaskStatus.COMPLETED]: '#10b981',
      [TaskStatus.IN_PROGRESS]: '#3b82f6',
      [TaskStatus.NOT_STARTED]: '#9ca3af',
      [TaskStatus.OVERDUE]: '#ef4444',
      [TaskStatus.CANCELLED]: '#6b7280'
    };
    return colors[status || TaskStatus.NOT_STARTED];
  }

  getCalendarEvents(month?: Date): Observable<CalendarEvent[]> {
    try {
      return new Observable(subscriber => {
        this.taskService.getAllTasks().subscribe(tasks => {
          this.projectService.getAllProjects().subscribe(projects => {
            const taskEvents = tasks
              .filter(t => t.dueDate)
              .map(t => ({
                id: t.id,
                name: t.name,
                date: new Date(t.dueDate!),
                type: 'task' as const,
                color: this.getPriorityColor(t.priority),
                description: t.description
              }));

            const projectEvents = projects
              .filter(p => p.dueDate)
              .map(p => ({
                id: p.id,
                name: p.name,
                date: new Date(p.dueDate!),
                type: 'deadline' as const,
                color: this.getStatusColor(p.completionStatus),
                description: p.description
              }));

            const events = [...taskEvents, ...projectEvents].sort((a, b) =>
              a.date.getTime() - b.date.getTime()
            );

            subscriber.next(events);
            subscriber.complete();
          });
        });
      });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getCalendarDays(month: Date): Observable<CalendarDay[]> {
    try {
      return this.getCalendarEvents(month).pipe(
        map(events => {
          const year = month.getFullYear();
          const monthIndex = month.getMonth();
          const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
          const days: CalendarDay[] = [];

          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, monthIndex, day);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();

            const dayEvents = events
              .filter(e => e.date.toDateString() === date.toDateString())
              .map(e => ({
                id: e.id,
                name: e.name,
                type: e.type as 'task' | 'project',
                priority: Priority.MEDIUM
              }));

            days.push({ date, dayName, isToday, items: dayEvents });
          }

          return days;
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getEventsByDateRange(start: Date, end: Date): Observable<CalendarEvent[]> {
    try {
      return this.getCalendarEvents().pipe(
        map(events => events.filter(e => e.date >= start && e.date <= end))
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getUpcomingDeadlines(days: number = 7): Observable<CalendarEvent[]> {
    try {
      return this.getCalendarEvents().pipe(
        map(events => {
          const today = new Date();
          const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
          return events.filter(e => e.date >= today && e.date <= futureDate);
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }
}

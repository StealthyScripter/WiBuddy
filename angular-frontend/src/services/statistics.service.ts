import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TaskStatus,
  UUID
} from '../models.interface';
import { ConsoleLogger, TaskService } from './task.service';
import { ProjectService } from './project.service';
import { NoteService } from './notes.service';
import { ILogger } from './task.service';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private noteService: NoteService,
    private logger: ConsoleLogger
  ) {}

  private getDateRange(period: 'week' | 'month' = 'month'): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();
    if (period === 'week') {
      start.setDate(start.getDate() - 7);
    } else {
      start.setMonth(start.getMonth() - 1);
    }
    return { start, end };
  }

  getStatistics(userId?: UUID, period: 'week' | 'month' = 'month'): Observable<any> {
    try {
      return new Observable(subscriber => {
        this.taskService.getAllTasks().subscribe(tasks => {
          this.projectService.getAllProjects().subscribe(projects => {
            this.noteService.getAllNotes().subscribe(notes => {
              const { start, end } = this.getDateRange(period);

              const tasksCompleted = tasks.filter(t =>
                t.isCompleted && t.completionDate &&
                new Date(t.completionDate) >= start && new Date(t.completionDate) <= end &&
                (!userId || t.assigneeId === userId)
              ).length;

              const activeProjects = projects.filter(p =>
                p.completionStatus !== TaskStatus.COMPLETED && !p.isCompleted &&
                (!userId || p.ownerId === userId)
              ).length;

              const notesCreated = notes.filter(n =>
                n.dateCreated && new Date(n.dateCreated) >= start && new Date(n.dateCreated) <= end
              ).length;

              const totalTasks = tasks.filter(t => !userId || t.assigneeId === userId).length;
              const completionRate = totalTasks === 0 ? 0 : Math.round((tasks.filter(t => t.isCompleted).length / totalTasks) * 100);

              const overdueTasks = tasks.filter(t =>
                t.dueDate && new Date(t.dueDate) < new Date() && !t.isCompleted &&
                (!userId || t.assigneeId === userId)
              ).length;

              subscriber.next({
                tasksCompleted,
                activeProjects,
                notesCreated,
                completionRate,
                overdueTasksCount: overdueTasks
              });
              subscriber.complete();
            });
          });
        });
      });
    } catch (error) {
      return throwError(() => error);
    }
  }

  getTasksCompleted(userId?: UUID, period: 'week' | 'month' = 'month'): Observable<number> {
    try {
      return this.taskService.getAllTasks().pipe(
        map(tasks => {
          const { start, end } = this.getDateRange(period);
          return tasks.filter(t =>
            t.isCompleted && t.completionDate &&
            new Date(t.completionDate) >= start && new Date(t.completionDate) <= end &&
            (!userId || t.assigneeId === userId)
          ).length;
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getActiveProjectsCount(userId?: UUID): Observable<number> {
    try {
      return this.projectService.getActiveProjects(userId).pipe(
        map(projects => projects.length)
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getCompletionRate(userId?: UUID): Observable<number> {
    try {
      return this.taskService.getAllTasks().pipe(
        map(tasks => {
          let filtered = tasks;
          if (userId) {
            filtered = filtered.filter(t => t.assigneeId === userId);
          }

          if (filtered.length === 0) return 0;
          const completed = filtered.filter(t => t.isCompleted).length;
          return Math.round((completed / filtered.length) * 100);
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getOverdueTasksCount(userId?: UUID): Observable<number> {
    try {
      return this.taskService.getOverdueTasks(userId).pipe(
        map(tasks => tasks.length)
      );
    } catch (error) {
      return throwError(() => error);
    }
  }

  getNotesCreated(period: 'week' | 'month' = 'month'): Observable<number> {
    try {
      return this.noteService.getAllNotes().pipe(
        map(notes => {
          const { start, end } = this.getDateRange(period);
          return notes.filter(n =>
            n.dateCreated && new Date(n.dateCreated) >= start && new Date(n.dateCreated) <= end
          ).length;
        })
      );
    } catch (error) {
      return throwError(() => error);
    }
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task, TaskStatus, Priority } from '../../models.interface';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.css'
})
export class TasksPageComponent implements OnInit, OnDestroy {
  searchQuery = '';
  sortCriteria: 'priority' | 'date' | 'completionStatus' = 'priority';
  TaskStatus = TaskStatus;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  error = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTasks() {
    this.loading = true;
    this.error = '';

    this.taskService.getAllTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.filteredTasks = [...tasks];
          this.sortTasks();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Failed to load tasks:', err);
          this.error = 'Failed to load tasks';
          this.loading = false;
        }
      });
  }

  filterTasks() {
    this.filteredTasks = this.tasks.filter(task =>
      task.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(this.searchQuery.toLowerCase()) ?? false)
    );
    this.sortTasks();
  }

  sortTasks() {
    switch (this.sortCriteria) {
      case 'priority':
        this.filteredTasks.sort((a, b) => {
          const priorityOrder: Record<Priority, number> = {
            [Priority.CRITICAL]: 0,
            [Priority.HIGH]: 1,
            [Priority.MEDIUM]: 2,
            [Priority.LOW]: 3
          };
          const aPriority = a.priority || Priority.LOW;
          const bPriority = b.priority || Priority.LOW;
          return priorityOrder[aPriority] - priorityOrder[bPriority];
        });
        break;
      case 'date':
        this.filteredTasks.sort((a, b) => {
          const aCompleted = a.completionStatus === TaskStatus.COMPLETED || a.completionStatus === TaskStatus.CANCELLED;
          const bCompleted = b.completionStatus === TaskStatus.COMPLETED || b.completionStatus === TaskStatus.CANCELLED;

          if (aCompleted && !bCompleted) return 1;
          if (!aCompleted && bCompleted) return -1;

          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

          const aOverdue = a.completionStatus === TaskStatus.OVERDUE;
          const bOverdue = b.completionStatus === TaskStatus.OVERDUE;

          if (aOverdue && !bOverdue) return -1;
          if (!aOverdue && bOverdue) return 1;

          return dateA - dateB;
        });
        break;
      case 'completionStatus':
        this.filteredTasks.sort((a, b) => {
          const statusOrder: Record<string, number> = {
            'OVERDUE': 0,
            'IN_PROGRESS': 1,
            'NOT_STARTED': 2,
            'COMPLETED': 3,
            'CANCELLED': 4
          };

          const aStatus = a.completionStatus || TaskStatus.NOT_STARTED;
          const bStatus = b.completionStatus || TaskStatus.NOT_STARTED;

          const aValue = statusOrder[aStatus] !== undefined ? statusOrder[aStatus] : statusOrder['NOT_STARTED'];
          const bValue = statusOrder[bStatus] !== undefined ? statusOrder[bStatus] : statusOrder['NOT_STARTED'];

          return aValue - bValue;
        });
        break;
    }
  }

  addTask() {
    this.router.navigate(['/tasks/new']);
  }

  navigateToTask(taskId: string) {
    this.router.navigate(['/task-details', taskId]);
  }

  getStatusClass(completionStatus: string): string {
    if (!completionStatus) return '';
    return completionStatus.toLowerCase().replace(/[_\s]+/g, '-');
  }

  getStatusDisplay(status: TaskStatus): string {
    return status.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.isCompleted) return false;
    return new Date(task.dueDate) < new Date();
  }

  toggleTaskComplete(task: Task) {
    this.taskService.markTaskComplete(task.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadTasks(),
        error: (err: any) => console.error('Failed to update task:', err)
      });
  }
}

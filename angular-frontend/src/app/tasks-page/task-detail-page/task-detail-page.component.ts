import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task, UUID } from '../../../models.interface';
import { TaskService } from '../../../services/task.service';
import { mockProjects } from '../../../services/test.data';

@Component({
  selector: 'app-task-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-detail-page.component.html',
  styleUrls: ['./task-detail-page.component.css']
})
export class TaskDetailPageComponent implements OnInit, OnDestroy {
  taskId: string | null = '';
  selectedTask: Task | undefined;
  loading = false;
  error = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.taskId = params.get('taskId');
        if (this.taskId) this.loadTask();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBack() {
    this.router.navigate(['/tasks']);
  }

  onEdit() {
    if (!this.selectedTask) return;
    this.router.navigate(['/tasks/new'], {
      state: { task: this.selectedTask },
      queryParams: { edit: this.selectedTask.id }
    });
  }

  async onDelete() {
    if (!this.selectedTask) return;

    const confirmed = confirm(`Are you sure you want to delete task "${this.selectedTask.name}"?`);
    if (!confirmed) return;

    this.taskService.deleteTask(this.selectedTask.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Task deleted successfully');
          this.router.navigate(['/tasks']);
        },
        error: (err: any) => {
          console.error('Failed to delete task:', err);
          alert('Failed to delete task');
        }
      });
  }

  loadTask() {
    this.loading = true;
    if (!this.taskId) {
      this.error = 'Task ID is missing';
      this.loading = false;
      return;
    }

    this.taskService.getTaskById(this.taskId as UUID)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (task) => {
          this.selectedTask = task;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Failed to load task:', err);
          this.error = 'Failed to load task';
          this.loading = false;
        }
      });
  }

  getProjectName(projectId: UUID) {
    if (!projectId) return 'Not assigned';
    const project = mockProjects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  }
}

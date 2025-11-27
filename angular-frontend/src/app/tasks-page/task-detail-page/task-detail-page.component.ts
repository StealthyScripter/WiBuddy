import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Task, UUID } from '../../../models.interface';
import { BaseService } from '../../../services/base_service';
import { TaskService } from '../../../services/task_service';
import { mockProjects } from '../../../services/test.data';

@Component({
  selector: 'app-task-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-detail-page.component.html',
  styleUrls: ['./task-detail-page.component.css']
})
export class TaskDetailPageComponent implements OnInit {
  taskId: string | null = '';
  selectedTask: Task | undefined;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject('TaskServiceToken') private taskServiceBase: BaseService<Task>,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('taskId');
      if (this.taskId) this.loadTask();
    });
  }

  // ----------------------------
  // Navigate back to task list
  // ----------------------------
  onBack() {
    this.router.navigate(['/tasks']);
  }

  // ----------------------------
  // Edit the task by navigating to "new task" page with pre-filled data
  // ----------------------------
  onEdit() {
    if (!this.selectedTask) return;

    this.router.navigate(['/tasks/new'], {
      state: { task: this.selectedTask },
      queryParams: {edit: this.selectedTask.id}
    });
  }

  // ----------------------------
  // Delete the selected task
  // ----------------------------
  async onDelete() {
    if (!this.selectedTask) return;

    const confirmed = confirm(`Are you sure you want to delete task "${this.selectedTask.name}"?`);
    if (!confirmed) return;

    try {
      const result = this.taskServiceBase.delete(this.selectedTask.id);

      if (result instanceof Promise) {
        await result;
      } else {
        await result.toPromise();
      }

      alert('Task deleted successfully');
      this.router.navigate(['/tasks']);
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    }
  }

  // ----------------------------
  // Load Task Data
  // ----------------------------
  loadTask() {
    this.loading = true;
    if (!this.taskId) {
      this.error = 'Task ID is missing';
      this.loading = false;
      return;
    }

    const result = this.taskServiceBase.getById(this.taskId);

    if (result instanceof Promise) {
      result
        .then(task => {
          this.selectedTask = task;
          this.loading = false;
        })
        .catch(() => {
          this.error = 'Failed to load task';
          this.loading = false;
        });
    } else {
      result.subscribe({
        next: (response: any) => {
          this.selectedTask = response.task || response;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load task';
          this.loading = false;
        }
      });
    }
  }

  // ----------------------------
  // Utility: Get project name from ID
  // ----------------------------
  getProjectName(projectId: UUID) {
    if (!projectId) return 'Not assigned';
    const project = mockProjects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  }
}

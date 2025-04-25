import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Task, TaskStatus, Priority, TaskCategory } from '../../models.interface';
import { BaseService } from '../../services/base_service';
import { TaskService } from '../../services/task_service';
import { mockTasks } from '../../test-data/task.data';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.css'
})
export class TasksPageComponent implements OnInit {
  searchQuery = '';
  sortCriteria: 'priority' | 'date' | 'completionStatus' = 'priority';
  TaskStatus = TaskStatus; // Make enum available in template

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  error = '';

  constructor(
    private router: Router,
    @Inject('TaskServiceToken') private taskServiceBase: BaseService<Task>,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.filterTasks();
  }

  loadTasks() {
    this.loading = true;

    const result = this.taskServiceBase.getAll();

    if (result instanceof Promise) {
      // Mock service
      result.then(tasks => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
        this.filterTasks();
        this.loading = false;
      }).catch(error => {
        this.error = 'Failed to load tasks';
        this.loading = false;
      });
    } else {
      // HTTP service
      result.subscribe({
        next: (response: any) => {
          this.tasks = response.tasks || response;
          this.filteredTasks = this.tasks;
          this.filterTasks();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load tasks';
          this.loading = false;
        }
      });
    }
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
          // Handle undefined priorities
          const aPriority = a.priority || Priority.LOW;
          const bPriority = b.priority || Priority.LOW;
          return priorityOrder[aPriority] - priorityOrder[bPriority];
        });
        break;
      case 'date':
        // Your existing date sorting logic
        break;
      case 'completionStatus':
        this.filteredTasks.sort((a, b) => {
          // Type-safe version of the status order
          const statusOrder: Record<string, number> = {
            'OVERDUE': 0,
            'IN_PROGRESS': 1,
            'NOT_STARTED': 2,
            'BLOCKED': 3,
            'COMPLETED': 4,
            'CANCELLED': 5
          };

          // Default to a safe value if completionStatus is undefined
          const aStatus = a.completionStatus || 'NOT_STARTED';
          const bStatus = b.completionStatus || 'NOT_STARTED';

          // Check if the status is a valid key
          const aValue = statusOrder[aStatus] !== undefined ? statusOrder[aStatus] : statusOrder['NOT_STARTED'];
          const bValue = statusOrder[bStatus] !== undefined ? statusOrder[bStatus] : statusOrder['NOT_STARTED'];

          return aValue - bValue;
        });
        break;
    }
  }

  addTask() {
    this.router.navigate(['/add-task'])
  }

  navigateToTask(taskId: string) {
    this.router.navigate(['/task-details', taskId]);
  }

  getStatusClass(completionStatus: string): string {
    if (!completionStatus) return '';
    return completionStatus.toLowerCase().replace(/[_\s]+/g, '-');
  }
}

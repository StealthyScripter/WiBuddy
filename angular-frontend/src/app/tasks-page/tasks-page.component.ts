import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Task, TaskStatus, Priority, TaskCategory } from '../../models.interface';
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

  tasks: Task[] = mockTasks; // Use mockTasks directly
  filteredTasks: Task[] = [];
  loading = false;
  error = '';

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.filteredTasks = [...this.tasks]; // Initialize with all tasks
    this.filterTasks();
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
        const today = new Date();
        this.filteredTasks.sort((a, b) => {
          // Check if tasks are completed or cancelled
          const aCompleted = a.completionStatus === 'COMPLETED' || a.completionStatus === 'CANCELLED';
          const bCompleted = b.completionStatus === 'COMPLETED' || b.completionStatus === 'CANCELLED';

          // Put completed/cancelled tasks at the bottom
          if (aCompleted && !bCompleted) return 1;
          if (!aCompleted && bCompleted) return -1;

          // If both completed or both not completed, sort by due date
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

          // For tasks with overdue date, put them at the top
          const aOverdue = a.completionStatus === 'OVERDUE';
          const bOverdue = b.completionStatus === 'OVERDUE';

          if (aOverdue && !bOverdue) return -1;
          if (!aOverdue && bOverdue) return 1;

          return dateA - dateB;
        });
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

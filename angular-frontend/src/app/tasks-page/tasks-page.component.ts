// tasks-page.component.ts
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

  tasks: Task[] = mockTasks;

  filteredTasks: Task[] = this.tasks;

  constructor(private router: Router) {}

  ngOnInit() {
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
          const priorityOrder = {
            [Priority.CRITICAL]: 0,
            [Priority.HIGH]: 1,
            [Priority.MEDIUM]: 2,
            [Priority.LOW]: 3
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        break;
      case 'date':
        this.filteredTasks.sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return dateA - dateB;
        });
        break;
      case 'completionStatus':
        this.filteredTasks.sort((a, b) => a.completionStatus.localeCompare(b.completionStatus));
        break;
    }
  }

  addTask() {
    this.router.navigate(['/add-task'])
  }

  navigateToTask(taskId: string) {
    this.router.navigate(['/task-details', taskId]);
  }

  getStatusClass(status: string): string {
    if (!status) return '';
    return status.toLowerCase().replace(/[_\s]+/g, '-');
  }
}

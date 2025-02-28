// tasks-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Task, TaskStatus, Priority, TaskCategory } from '../../models.interface';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.css'
})
export class TasksPageComponent implements OnInit {
  searchQuery = '';
  sortCriteria: 'priority' | 'date' | 'status' = 'priority';
  TaskStatus = TaskStatus; // Make enum available in template
  
  tasks: Task[] = [
    {
      id: 'task-1',
      name: 'Update User Interface',
      description: 'Implement new design system across the platform',
      status: TaskStatus.IN_PROGRESS,
      dueDate: '2025-03-15',
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      hierarchy: 1,
      isMilestone: false,
      priority: Priority.HIGH,
      category: TaskCategory.DESIGN,
      prerequisites: [],
      dependentTasks: []
    },
    {
      id: 'task-2',
      name: 'API Integration',
      description: 'Connect backend services with frontend',
      status: TaskStatus.COMPLETED,
      dueDate: '2025-03-20',
      isCompleted: true,
      dateCreated: new Date().toISOString(),
      hierarchy: 1,
      isMilestone: false,
      priority: Priority.MEDIUM,
      category: TaskCategory.DEVELOPMENT,
      prerequisites: [],
      dependentTasks: []
    },
    {
      id: 'task-3',
      name: 'Security Audit',
      description: 'Perform security assessment and fix vulnerabilities',
      status: TaskStatus.BLOCKED,
      dueDate: '2025-03-25',
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      hierarchy: 1,
      isMilestone: false,
      priority: Priority.CRITICAL,
      category: TaskCategory.TESTING,
      prerequisites: [],
      dependentTasks: []
    }
  ];

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
      case 'status':
        this.filteredTasks.sort((a, b) => a.status.localeCompare(b.status));
        break;
    }
  }

  addTask() {
    this.router.navigate(['/add-task'])
  }

  navigateToTask(taskId: string) {
    this.router.navigate(['/task-details', taskId]);
  }
}
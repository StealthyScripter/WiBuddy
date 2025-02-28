import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Task, TaskStatus, Priority, TaskCategory } from '../../../models.interface';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
  }>;
}

@Component({
  selector: 'app-task-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-detail-page.component.html',
  styleUrl: './task-detail-page.component.css'
})
export class TaskDetailPageComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  taskId: string | null = '';
  selectedTask: Task | undefined;


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


  comments: Comment[] = [
    {
      id: 'comment-1',
      author: 'John Doe',
      content: 'Let\'s make sure we follow the API documentation carefully.',
      timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    }
  ];


  newComment = '';

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('taskId');
      console.log('Task Id:', this.taskId);
      if (this.taskId) {
        this.selectedTask = this.tasks.find(task => 
          task.id === this.taskId);
      }
    });
  }

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      // TODO: Fetch task details using a service
      console.log('Loading task:', taskId);
    }
  }

  addComment() {
    if (this.newComment.trim()) {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        author: 'Current User', // TODO: Get from auth service
        content: this.newComment,
        timestamp: new Date().toISOString()
      };
      
      this.comments.push(newComment);
      this.newComment = '';
    }
  }
}
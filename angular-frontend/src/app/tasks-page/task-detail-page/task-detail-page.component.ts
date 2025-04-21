import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Task, TaskStatus, Priority, TaskCategory, Comment } from '../../../models.interface';
import { mockCompletedTasks, mockTasks, mockProjects } from '../../../test-data/task.data';



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
  tasks: Task[] = mockTasks;
  newComment = '';

  // Sample prerequisites
  prerequisites: string[] = [
    'Database Schema Design',
    'Authentication System Setup'
  ];

  comments: Comment[] = [
    {
      id: 'comment-1',
      author: 'John Doe',
      content: 'Let\'s make sure we follow the API documentation carefully.',
      timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    }
  ];

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('taskId');
      if (this.taskId) {
        this.selectedTask = this.tasks.find(task =>
          task.id === this.taskId);

          this.loadTaskDetails();
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

  loadTaskDetails() {
    // This would fetch additional details like comments, prerequisites, etc.
    // For now we're using mock data

    if (this.selectedTask && !this.selectedTask.tags) {
      this.selectedTask.tags = ['Frontend', 'Priority', 'Q2'];
    }

    if (this.selectedTask && !this.selectedTask.attachments) {
      this.selectedTask.attachments = [
        {
          id: '1',
          type: 'document',
          name: 'Requirements.docx',
          url: '#'
        },
        {
          id: '2',
          type: 'image',
          name: 'Mockup.png',
          url: '#'
        }
      ];
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

      this.comments.unshift(newComment);
      this.newComment = '';
    }
  }

  getProjectName(projectId: string | undefined): string {
    if (!projectId) return 'Not assigned';

    const project = mockProjects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  }

  getAssigneeName(assigneeId: string | undefined): string {
    if (!assigneeId) return 'Unassigned';

    // This would normally fetch from user data
    // Mock assignee names for demo purposes
    const assignees: {[key: string]: string} = {
      'user-1': 'John Smith',
      'user-2': 'Emily Johnson',
      'user-3': 'Michael Chen'
    };

    return assignees[assigneeId] || 'Unknown User';
  }

  getPriorityClass(priority: Priority | undefined): string {
    if (!priority) return '';
    return priority.toLowerCase();
  }

  getStatusClass(status: TaskStatus | undefined): string {
    if (!status) return '';
    return status.toLowerCase().replace(/_/g, '-');
  }
}

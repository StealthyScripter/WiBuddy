import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  Project,
  TaskStatus,
  Priority,
  Task,
  Technology,
  Comment
} from '../../../models.interface';
import { mockProjects, mockTasks, mockTechStack } from '../../../services/test.data';

@Component({
  selector: 'app-project-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './project-details-page.component.html',
  styleUrl: './project-details-page.component.css'
})
export class ProjectDetailsPageComponent implements OnInit, OnDestroy {
  // Injected services
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Data sources
  private readonly projects = mockProjects;
  private readonly allTasks = mockTasks;
  private readonly allTechnologies = mockTechStack;

  // State management
  selectedProject: Project | null = null;
  projectTasks: Task[] = [];
  technologies: Technology[] = [];
  comments: Comment[] = [];

  // UI state
  isLoading = false;
  errorMessage: string | null = null;
  isAddingComment = false;
  newCommentContent = '';

  // Cleanup
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeProjectDetails();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize project details by subscribing to route params
   */
  private initializeProjectDetails(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const projectId = params.get('projectId');
        if (projectId) {
          this.loadProjectData(projectId);
        } else {
          this.handleProjectNotFound();
        }
      });
  }

  /**
   * Load project and related data from mock data
   */
  private loadProjectData(projectId: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    try {
      // Find project by ID
      const project = this.projects.find(p => p.id === projectId);

      if (project) {
        this.selectedProject = project;
        this.loadRelatedData(projectId);
      } else {
        this.handleProjectNotFound();
      }
    } catch (error) {
      this.handleError('Failed to load project', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load tasks, technologies, and comments for the project
   */
  private loadRelatedData(projectId: string): void {
    try {
      // Load tasks associated with this project
      this.projectTasks = this.allTasks.filter(task => task.projectId === projectId);

      // Load technologies (first 3 for display)
      this.technologies = this.allTechnologies.slice(0, 3);

      // Load comments from project (if available)
      this.comments = this.selectedProject?.comments || [];
    } catch (error) {
      console.error('Failed to load related data', error);
    }
  }

  /**
   * Navigation methods
   */
  onBack(): void {
    this.router.navigate(['/projects']);
  }

  onEdit(): void {
    if (!this.selectedProject) return;

    this.router.navigate(['/projects/new'], {
      state: { project: this.selectedProject },
      queryParams: { edit: this.selectedProject.id }
    });
  }

  async onDelete(): Promise<void> {
    if (!this.selectedProject) return;

    const confirmed = confirm(
      `Are you sure you want to delete project "${this.selectedProject.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // In a real app, this would call a service to delete
      // For now, just navigate back with a success message
      this.router.navigate(['/projects'], {
        queryParams: { deleted: this.selectedProject.id }
      });
    } catch (error) {
      this.handleError('Failed to delete project', error);
    }
  }

  addComment(): void {
    if (!this.selectedProject) return;

    this.isAddingComment = true;
    this.newCommentContent = '';
  }

  cancelComment(): void {
    this.isAddingComment = false;
    this.newCommentContent = '';
  }

  saveComment(): void {
    if (!this.selectedProject || !this.newCommentContent.trim()) return;

    const newComment: Comment = {
      authorId: 'current-user-id', // In production, get from auth service
      name: 'Current User', // In production, get from auth service
      content: this.newCommentContent.trim(),
      dateCreated: new Date().toISOString(),
      projectId: this.selectedProject.id
    };

    // Add comment to the list
    this.comments = [...this.comments, newComment];

    // Update the project's comments array
    if (this.selectedProject.comments) {
      this.selectedProject.comments.push(newComment);
    } else {
      this.selectedProject.comments = [newComment];
    }

    // Reset form
    this.isAddingComment = false;
    this.newCommentContent = '';
  }

  onCommentInputChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.newCommentContent = target.value;
  }

  addNewTask(): void {
    if (!this.selectedProject) return;

    this.router.navigate(['/tasks/new'], {
      queryParams: { projectId: this.selectedProject.id }
    });
  }

  navigateToProjects(): void {
    this.router.navigate(['/projects']);
  }

  /**
   * Utility methods for date formatting
   */
  formatDate(dateString: string | undefined | null): string {
    if (!dateString) return 'Not set';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  }

  /**
   * CSS class generators
   */
  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    return status.toLowerCase().replace(/[_\s]+/g, '-');
  }

  getPriorityClass(priority: Priority | undefined): string {
    if (!priority) return '';
    return priority.toLowerCase();
  }

  /**
   * Task statistics
   */
  getCompletedTaskCount(): number {
    return this.projectTasks.filter(task => task.isCompleted).length;
  }

  getTotalTaskCount(): number {
    return this.projectTasks.length;
  }

  getCompletionPercentage(): number {
    const total = this.getTotalTaskCount();
    if (total === 0) return 0;

    return Math.round((this.getCompletedTaskCount() / total) * 100);
  }

  /**
   * Progress bar color based on completion percentage
   */
  getProgressBarColor(): string {
    const progress = this.selectedProject?.progress || 0;

    if (progress < 30) return 'var(--status-overdue-text)';
    if (progress < 70) return 'var(--warning)';
    return 'var(--success)';
  }

  /**
   * Get icon class for technology
   */
  getTechnologyIcon(techName: string): string {
    const iconMap: Record<string, string> = {
      'React': 'fab fa-react',
      'Angular': 'fab fa-angular',
      'Vue': 'fab fa-vuejs',
      'Node.js': 'fab fa-node-js',
      'TypeScript': 'fas fa-code',
      'JavaScript': 'fab fa-js',
      'Python': 'fab fa-python',
      'Java': 'fab fa-java'
    };

    return iconMap[techName] || 'fas fa-code';
  }

  /**
   * Error handling
   */
  private handleError(message: string, error: unknown): void {
    console.error(message, error);
    this.errorMessage = message;
    this.isLoading = false;
  }

  private handleProjectNotFound(): void {
    this.errorMessage = 'Project not found';
    this.selectedProject = null;
    this.isLoading = false;
  }

  /**
   * Track by functions for ngFor optimization
   */
  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  trackByTechId(index: number, tech: Technology): string {
    return tech.id;
  }

  trackByCommentId(index: number, comment: Comment): string {
    return comment.authorId || index.toString();
  }

  /**
   * Check if project has specific status
   */
  isProjectCompleted(): boolean {
    return this.selectedProject?.completionStatus === TaskStatus.COMPLETED;
  }

  isProjectOverdue(): boolean {
    if (!this.selectedProject?.dueDate) return false;

    const dueDate = new Date(this.selectedProject.dueDate);
    const today = new Date();

    return dueDate < today && !this.isProjectCompleted();
  }

  /**
   * Get days until due date
   */
  getDaysUntilDue(): number | null {
    if (!this.selectedProject?.dueDate) return null;

    const dueDate = new Date(this.selectedProject.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  viewTechnologyDetails(techId: string): void {
    console.log('Viewing technology details for:', techId);
    this.router.navigate(['/techstack', techId]);
  }

  viewTaskDetails(taskId: string): void {
    this.router.navigate(['/task-details', taskId]);
  }

}


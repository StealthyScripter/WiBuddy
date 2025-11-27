import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Project, TaskStatus, Priority, Task, Note, Technology } from '../../../models.interface';
import { mockProjects, mockTasks, mockNotes, mockTechStack } from '../../../services/test.data';

@Component({
  selector: 'app-project-details-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-details-page.component.html',
  styleUrl: './project-details-page.component.css'
})
export class ProjectDetailsPageComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  projectId: string | null = '';
  selectedProject: Project | undefined;
  projectTasks: Task[] = [];
  projectNotes: Note[] = [];
  technologies: Technology[] = mockTechStack;

  projects: Project[] = mockProjects;
  allTasks: Task[] = mockTasks;
  allNotes: Note[] = mockNotes;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
      if (this.projectId) {
        this.loadProjectData(this.projectId);
      }
    });
  }

  loadProjectData(projectId: string): void {
    this.selectedProject = this.projects.find(project => project.id === projectId);

    // Load associated tasks
    if (this.selectedProject) {
      this.projectTasks = this.allTasks.filter(task => task.projectId === projectId);
      // For demo purposes, get some notes
      this.projectNotes = this.allNotes.slice(0, 1);
    }
  }

  navigateBack(): void {
    this.router.navigate(['/projects']);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    return status.toLowerCase().replace(/[_\s]+/g, '-');
  }

  getCompletedTaskCount(): number {
    return this.projectTasks.filter(task => task.isCompleted).length;
  }

  getTotalTaskCount(): number {
    return this.projectTasks.length;
  }

  getProgressBarColor(): string {
    const progress = this.selectedProject?.progress || 0;

    if (progress < 30) return 'var(--status-overdue-text)';
    if (progress < 70) return 'var(--warning)';
    return 'var(--success)';
  }

  addNewTask() {
    this.router.navigate(['/tasks/new'])
  }
}

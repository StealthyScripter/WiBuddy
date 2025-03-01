import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Project, TaskStatus, Priority } from '../../../models.interface';
import { mockProjects } from '../../../test-data/task.data';

@Component({
  selector: 'app-project-details-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './project-details-page.component.html',
  styleUrl: './project-details-page.component.css'
})
export class ProjectDetailsPageComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  projectId: string | null = '';
  selectedProject: Project | undefined;

  projects: Project[] = mockProjects;

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('projectId');
      console.log('Project Id:', this.projectId);
      if (this.projectId) {
        this.selectedProject = this.projects.find(project => project.id === this.projectId);
        console.log('selected project:', this.selectedProject)
      }
  
    });
  }

}
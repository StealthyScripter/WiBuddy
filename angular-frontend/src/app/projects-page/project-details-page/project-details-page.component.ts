import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Project, TaskStatus, Priority } from '../../../models.interface';

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

  projects: Project[] = [
    {
      id: 'uuid-1',
      name: 'Website Redesign',
      department: 'Marketing',
      description: 'Complete overhaul of company website with modern UI/UX principles',
      status: TaskStatus.ACTIVE,
      priority: Priority.HIGH,
      progress: 75,
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      ownerId: 'owner-1',
      teamMembers: ['member-1', 'member-2', 'member-3'],
      tasks: []
    },
    {
      id: 'uuid-2',
      name: 'Mobile App Development',
      department: 'Technology',
      description: 'Native mobile application for iOS and Android platforms',
      status: TaskStatus.UPCOMING,
      priority: Priority.CRITICAL,
      progress: 0,
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      ownerId: 'owner-2',
      teamMembers: ['member-4', 'member-5'],
      tasks: []
    },
    {
      id: 'uuid-3',
      name: 'Brand Identity',
      department: 'Design',
      description: 'Complete brand redesign including logo and guidelines',
      status: TaskStatus.COMPLETED,
      priority: Priority.MEDIUM,
      progress: 100,
      isCompleted: true,
      dateCreated: new Date().toISOString(),
      ownerId: 'owner-1',
      teamMembers: ['member-1', 'member-6'],
      tasks: []
    }
  ];

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
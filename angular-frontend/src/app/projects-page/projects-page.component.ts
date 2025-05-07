import { Component, OnInit, inject } from '@angular/core';
import { Project, TaskStatus, Priority, Task } from '../../models.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProjectStats, FilterOptions } from '../../models.interface';
import { mockProjects } from '../../services/test.data';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports:[CommonModule, FormsModule, RouterModule],
  templateUrl: 'projects-page.component.html',
  styleUrl:'projects-page.component.css'
})
export class ProjectsPageComponent implements OnInit {
  tabs = [
    { label: 'All Projects', completionStatus: null},
    { label: 'In Progress', completionStatus: TaskStatus.IN_PROGRESS },
    { label: 'Completed', completionStatus: TaskStatus.COMPLETED },
    { label: 'Not Started', completionStatus: TaskStatus.NOT_STARTED }
  ];

  activeTab: TaskStatus | null = null;
  filterOptions: FilterOptions = {};

  projects: Project[] = mockProjects;

  filteredProjects: Project[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.filterProjects();
  }

  setActiveTab(completionStatus: TaskStatus | null) {
    this.activeTab = completionStatus;
    this.filterProjects();
  }

  getMilestoneCount(project: Project): number {
    // return project.tasks.filter(task => task.isMilestone).length;
    return 10;
  }

  navigateToProject(projectId: string) {
    this.router.navigate(['/project-details', projectId])
  }

  filterProjects() {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = !this.filterOptions.searchQuery ||
        project.name.toLowerCase().includes(this.filterOptions.searchQuery.toLowerCase());

        const matchesStatus = this.activeTab === null || project.completionStatus === this.activeTab;

        const matchesPriority = !this.filterOptions.priority || project.priority === this.filterOptions.priority;

        return matchesSearch && matchesStatus && matchesPriority;

    });
  }

  addProject(){
    this.router.navigate(['/add-project'])
  }
}

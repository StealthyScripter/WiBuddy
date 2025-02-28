import { Component, OnInit, inject } from '@angular/core';
import { Project, TaskStatus, Priority, Task } from '../../models.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';


interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  teamMembers: number;
  milestones: Task[];
}

interface FilterOptions {
  status?: TaskStatus;
  priority?: Priority;
  category?: string;
  searchQuery?: string;
}

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports:[CommonModule, FormsModule, RouterModule],
  templateUrl: 'projects-page.component.html',
  styleUrl:'projects-page.component.css'
})
export class ProjectsPageComponent implements OnInit {
  tabs = [
    { label: 'All Projects', status: null},
    { label: 'In Progress', status: TaskStatus.IN_PROGRESS },
    { label: 'Completed', status: TaskStatus.COMPLETED },
    { label: 'Not Started', status: TaskStatus.NOT_STARTED }
  ];
  
  activeTab: TaskStatus | null = null;
  filterOptions: FilterOptions = {};
  
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

  filteredProjects: Project[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.filterProjects();
  }

  setActiveTab(status: TaskStatus | null) {
    this.activeTab = status;
    this.filterProjects();
  }

  getMilestoneCount(project: Project): number {
    return project.tasks.filter(task => task.isMilestone).length;
  }

  navigateToProject(projectId: string) {
    this.router.navigate(['/project-details', projectId])
  }

  filterProjects() {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = !this.filterOptions.searchQuery || 
        project.name.toLowerCase().includes(this.filterOptions.searchQuery.toLowerCase());
      
        const matchesStatus = this.activeTab === null || project.status === this.activeTab;

        const matchesPriority = !this.filterOptions.priority || project.priority === this.filterOptions.priority;
    
        return matchesSearch && matchesStatus && matchesPriority;

    });
  }

  addProject(){
    this.router.navigate(['/add-project'])
  }
}
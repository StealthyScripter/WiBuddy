import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TechStack, Task, Project } from '../../models.interface';
import {
  mockUpcomingTasks,
  mockCompletedTasks,
  mockTechStack,
  mockTasks,
  mockProjects
} from '../../test-data/task.data';

interface KeyTakeaway {
  title: string;
  description: string;
}

@Component({
  selector: 'app-progress-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-summary.component.html',
  styleUrl: './progress-summary.component.css'
})
export class ProgressSummaryComponent implements OnInit{
  // Tasks data
  upcomingTasks: Task[] = [];
  completedTasks: Task[] = [];
  allTasks: Task[] = [];
  completedTasksCount: number = 0;
  totalTasksCount: number = 0;
  completionPercentage: number = 0;

  // Projects data
  projects: Project[] = [];
  activeProjectsCount: number = 0;
  dueThisWeekCount: number = 0;

  // Technology data
  technologies: TechStack[] = [];
  technologiesCount: number = 0;
  newTechnologiesCount: number = 0;

  // Key takeaways
  keyTakeaways: KeyTakeaway[] = [
    {
      title: 'Improved Performance',
      description: 'Reduced loading time by 60% through code optimization'
    },
    {
      title: 'Scalability Achievement',
      description: 'Successfully handled 2x increase in user base'
    }
  ];

  constructor(private router: Router) {
    this.allTasks = [...mockTasks];
    this.projects = [...mockProjects];
  }

  ngOnInit(): void {
    this.loadTaskData();
    this.loadProjectData();
    this.loadTechnologyData();
  }

  loadTaskData(): void {
    this.upcomingTasks = mockUpcomingTasks;
    this.completedTasks = mockCompletedTasks;

    // Calculate task metrics
    this.totalTasksCount = this.allTasks.length;
    this.completedTasksCount = this.allTasks.filter(task => task.isCompleted).length;
    this.completionPercentage = this.totalTasksCount > 0
      ? (this.completedTasksCount / this.totalTasksCount) * 100
      : 0;
  }

  loadProjectData(): void {
    // Get active projects count
    this.activeProjectsCount = this.projects.filter(project =>
      !project.isCompleted && project.progress > 0
    ).length;

    // Calculate projects due this week
    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);

    this.dueThisWeekCount = this.projects.filter(project => {
      if (!project.dueDate) return false;
      const dueDate = new Date(project.dueDate);
      return dueDate >= today && dueDate <= oneWeekLater;
    }).length;
  }

  loadTechnologyData(): void {
    this.technologies = mockTechStack;
    this.technologiesCount = this.technologies.length;

    // For demo purposes, set a fixed number of new technologies
    this.newTechnologiesCount = 4;
  }

  getTechIcon(techName: string): string {
    // Map technology names to Font Awesome icons
    const iconMap: {[key: string]: string} = {
      'React': 'fab fa-react',
      'Node.js': 'fab fa-node-js',
      'Python': 'fab fa-python',
      'MongoDB': 'fas fa-database',
      // Add more mappings as needed
    };

    return iconMap[techName] || 'fas fa-code'; // Default to code icon
  }
  
  navigateToTask(taskId: string) {
    this.router.navigate(['/task-details', taskId]);
  }

}

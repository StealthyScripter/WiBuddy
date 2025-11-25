import { Component, NgModule, OnInit, Inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Task, Project, DailyAffirmation, TaskStatus, Priority, TaskCategory, Note } from '../../models.interface';
import { DueDateComponent } from './due-date/due-date.component';
import { HomePageCalendarComponent } from './home-page-calendar/home-page-calendar.component';
import { RelativeTimePipe } from '../pipes/relative-time.pipe';
import { mockTasks, mockProjects, mockNotes, mockDailyAffirmation } from '../../services/test.data';
import { AuthService } from '../../services/auth_service';
import { BaseService } from '../../services/base_service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DueDateComponent, NgFor, NgIf, HomePageCalendarComponent, RelativeTimePipe],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  currentWeekStart: Date = new Date();
  weekDays: { day: string, date: Date }[] = [];
  weekDateRange: string = "";
  username: string | null = null;
  newTaskText = '';
  priorityEnum = Priority;
  dailyAffirmation: DailyAffirmation = mockDailyAffirmation;

  tasks: Task[] = mockTasks;
  projects: Project[] = mockProjects;
  todaysTasks: Task[] = [];
  ongoingProjects: Project[] = [];
  upcomingProjects: Project[] = [];
  notes: Note[] = mockNotes;
  loading = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject('TaskServiceToken') private taskService: BaseService<Task>,
    @Inject('ProjectServiceToken') private projectService: BaseService<Project>
    ) {}

  ngOnInit(){
    this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      // Load tasks
      const taskResult = this.taskService.getAll();
      const projectResult = this.projectService.getAll();

      if (taskResult instanceof Promise) {
        this.tasks = await taskResult;
        this.projects = await projectResult as Project[];
      } else {
        taskResult.subscribe(response => {
          this.tasks = response.tasks || response;
        });
        (projectResult as Observable<any>).subscribe(response => {
          this.projects = response.projects || response;
        });
      }
      this.todaysTasks = this.getTasksForDay();
      this.ongoingProjects = this.getOngoingProjects();
      this.upcomingProjects = this.getUpcomingProjects();

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        this.loading = false;
      }
    }

    // Key dashboard metrics
    tasksInProgress(): Task[] {
      return this.tasks.filter(task =>
        !task.isCompleted && task.completionStatus !== TaskStatus.CANCELLED
      );
    }

    get overdueTasksCount(): number {
      const today = new Date();
      return this.tasks.filter(task =>
        !task.isCompleted &&
        task.dueDate &&
        new Date(task.dueDate) < today
      ).length;
    }

    get completionRate(): number {
      if (this.tasks.length === 0) return 0;
      const completed = this.tasks.filter(task => task.isCompleted).length;
      return Math.round((completed / this.tasks.length) * 100);
    }


  getNotesPreview(notes: string[]): string {
    if (!notes || notes.length === 0) return '';

    // Get the first content item and split
    const content = notes[0];
    const words = content.split(' ');
    const baseWordCount = 10;

    if (words.length > baseWordCount) {
      return words.slice(0, baseWordCount).join(' ') + '...';
    }

    return content;
  }

  getTasksForDay() {
    return this.tasks.filter(task => {
      return !task.isCompleted;
    });
  }

  getUpcomingProjects(){
    return this.projects.filter(project => {
      return project.progress === 0;
    });
  };

  getOngoingProjects(){
    return this.projects.filter(project => {
      return project.progress > 0;
    });
  };

  getPriorityColor(priority: Priority): string {
    const colors = {
      [Priority.CRITICAL]: '#ef4444',
      [Priority.HIGH]: '#f97316',
      [Priority.MEDIUM]: '#facc15',
      [Priority.LOW]: '#22c55e'
    };
    return colors[priority] || '#64748b';
  }

  getProgressClass(progress: number): string {
    if (progress < 30) return 'progress-low';
    if (progress < 70) return 'progress-medium';
    return 'progress-high';
  }

  parseFloat(value: string): number {
    return parseFloat(value);
  }

  navigateToTasks(){
    this.router.navigate(['/tasks']);
  }

  navigateToProjects() {
    this.router.navigate(['/projects']);
  }

  navigateToTask(taskId: string) {
    this.router.navigate(['/task-details', taskId]);
  }

  navigateToProject(projectId: string){
    this.router.navigate(['/project-details', projectId]);
  }

  navigateToNote(noteId: string){
    this.router.navigate(['notes-details',noteId]);
  }

  navigateToNewNote() {
    this.router.navigate(['add-notes']);
  }

}

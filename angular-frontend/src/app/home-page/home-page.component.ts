import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Task, Project, Affirmation, TaskStatus, Priority, Note } from '../../models.interface';
import { DueDateComponent } from './due-date/due-date.component';
import { RelativeTimePipe } from '../pipes/relative-time.pipe';
import { mockTasks, mockProjects, mockNotes, mockDailyAffirmation } from '../../services/test.data';
import { Observable } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DueDateComponent,
    NgFor,
    NgIf,
    RelativeTimePipe
  ],
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
  Affirmation: Affirmation = mockDailyAffirmation;

  tasks: Task[] = mockTasks;
  projects: Project[] = mockProjects;
  todaysTasks: Task[] = [];
  ongoingProjects: Project[] = [];
  upcomingProjects: Project[] = [];
  notes: Note[] = mockNotes;
  loading = true;
  upcomingDeadlines = '';

  constructor(
    private router: Router,
    private taskService: TaskService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      const taskResult = this.taskService.getAllTasks();
      const projectResult = this.projectService.getAllProjects();

      if (taskResult instanceof Promise) {
        this.tasks = await taskResult;
        this.projects = projectResult as unknown as Project[];
      } else {
        taskResult.subscribe((response: any) => {
          this.tasks = response.tasks || response;
        });

        (projectResult as Observable<any>).subscribe((response: any) => {
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

  // ---- Dashboard Metrics ----

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

  // ---- Helpers ----

  getNotesPreview(notes: string[]): string {
    if (!notes?.length) return '';
    const words = notes[0].split(' ');
    return words.length > 10
      ? words.slice(0, 10).join(' ') + '...'
      : notes[0];
  }

  getTasksForDay() {
    return this.tasks.filter(task => !task.isCompleted);
  }

  getUpcomingProjects() {
    return this.projects.filter(project => project.progress === 0);
  }

  getOngoingProjects() {
    return this.projects.filter(project => project.progress > 0);
  }

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

  // ---- Navigation ----

  navigateToTasks() {
    this.router.navigate(['/tasks']);
  }

  navigateToProjects() {
    this.router.navigate(['/projects']);
  }

  navigateToTask(taskId: string) {
    this.router.navigate(['/task-details', taskId]);
  }

  navigateToProject(projectId: string) {
    this.router.navigate(['/project-details', projectId]);
  }

  navigateToNote(noteId: string) {
    this.router.navigate(['notes-details', noteId]);
  }

  navigateToNewNote() {
    this.router.navigate(['/notes/new']);
  }

  navigateToAffirmations(affirmationsId: string) {
    this.router.navigate(['affirmations', affirmationsId]);
  }
}

import { Component, NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Task, Project, DailyAffirmation, TaskStatus, Priority, TaskCategory, Note } from '../../models.interface';
import { DueDateComponent } from './due-date/due-date.component';
import { HomePageCalendarComponent } from './home-page-calendar/home-page-calendar.component';
import { RelativeTimePipe } from '../pipes/relative-time.pipe';
import { mockTasks, mockProjects, mockNotes } from '../../test-data/task.data';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DueDateComponent, NgFor, NgIf, HomePageCalendarComponent, RelativeTimePipe],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  currentWeekStart: Date = new Date();
  weekDays: { day: string, date: Date }[] = [];
  weekDateRange: string = "";
  username = 'Brian';
  newTaskText = '';
  priorityEnum = Priority;

  dailyAffirmation: DailyAffirmation = {
    quote: "Engineering problems are under-defined; there are many solutions, good, bad, and indifferent. The art is to arrive at a good solution.",
    author: "Richard James"
  };

  Tasks: Task[] = mockTasks;
  Projects: Project[] = mockProjects;
  todaysTasks: Task[] = this.getTasksForDay();
  ongoingProjects: Project[] = this.getOngoingProjects();
  upcomingProjects: Project[] = this.getUpcomingProjects();
  notes: Note[] = mockNotes;

  constructor(private router: Router) {}

  getNotesPreview(notes: string[]): string {
    if (!notes || notes.length === 0) return '';

    // Get the first content item and split
    const content = notes[0] || '';
    const words = content.split(' ');
    const baseWordCount = 10;

    if (words.length > baseWordCount) {
      return words.slice(0, baseWordCount).join(' ') + '...';
    }

    return content;
  }

  tasksInProgress(): Task[] {
    return this.todaysTasks.filter(task => task.completionStatus !== TaskStatus.CANCELLED);
  }

  getTasksForDay() {
    return this.Tasks.filter(task => {
      return !task.isCompleted;
    });
  }

  getUpcomingProjects(){
    return this.Projects.filter(project => {
      return project.progress === 0;
    });
  };

  getOngoingProjects(){
    return this.Projects.filter(project => {
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

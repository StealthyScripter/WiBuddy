import { Component, NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
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
  imports: [CommonModule, RouterModule, FormsModule, DueDateComponent, NgFor, HomePageCalendarComponent, RelativeTimePipe],
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

  todaysTasks: Task[] = this.getTasksForDay()


  ongoingProjects: Project[] = this.getOngoingProjects();

  upcomingProjects: Project[] = this.getUpcomingProjects();

  notes: Note[] = mockNotes;

  constructor(private router: Router) {
   console.log('Upcoming: ', this.getUpcomingProjects());
   console.log('ongoing projects: ', this.getOngoingProjects());
  }

  getNotesPreview(notes: string[]): string {
    if (!notes || notes.length === 0) return '';

    // Get the first content item
    const content = notes[0] || '';

    // Split into words
    const words = content.split(' ');

    // Default number of words (adjust based on testing)
    const baseWordCount = 10;

    // Return truncated text with ellipsis if needed
    if (words.length > baseWordCount) {
      return words.slice(0, baseWordCount).join(' ') + '...';
    }

    return content;
  }

  addNewTask() {
    if (this.newTaskText.trim()) {
      this.newTaskText = '';
    }
  }

  tasksInProgress(): Task[] {
    return this.todaysTasks.filter(task => task.completionStatus !== TaskStatus.BLOCKED);
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

import { Component, NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Task, Project, DailyAffirmation, TaskStatus, Priority, TaskCategory, Note } from '../../models.interface';
import { DueDateComponent } from '../main-page/due-date/due-date.component';
import { mockTasks, mockProjects, mockNotes } from '../../test-data/task.data';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DueDateComponent, NgFor],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  currentWeekStart: Date = new Date();
  weekDays: { day: string, date: Date }[] = [];
  weekDateRange: string = "";
  username = 'Brian';
  newTaskText = '';
  expanded = false;
  priorityEnum = Priority;

  dailyAffirmation: DailyAffirmation = {
    quote: "Engineering problems are under-defined; there are many solutions, good, bad, and indifferent. The art is to arrive at a good solution.",
    author: "Richard James"
  };

  todaysTasks: Task[] = mockTasks.slice(3,6);

  ongoingProjects: Project[] = mockProjects;

  upcomingProjects: Project[] = mockProjects;

  notes: Note[] = mockNotes;

  togglePreview(index: number) {
    this.expanded = !this.expanded;
    const note: Note = this.notes[index]; // Assuming this.notes is Note[]

    if (note && note.hasOwnProperty('content')) { // Check if note exists and has a content property
      if (this.expanded) {
        // When expanded, join the array of strings into a single string
        if (Array.isArray(note.content)) {
          note.content = note.content;
        }
      } else {
        // When collapsed, truncate the content to the first 20 characters
        if (Array.isArray(note.content)) {
          note.content =note.content
        } else if (typeof note.content === 'string') {
          note.content = note.content
        }
      }
    }
  }


  constructor(private router: Router) {
    this.generateWeekCalendar();
  }

  addNewTask() {
    if (this.newTaskText.trim()) {
      this.newTaskText = '';
    }
  }

  filteredTasks(): Task[] {
    return this.todaysTasks.filter(task => task.status !== TaskStatus.COMPLETED);
  }

  generateWeekCalendar() {
    // Set the current week start to Sunday
    const today = new Date();
    this.currentWeekStart = new Date(today);
    this.currentWeekStart.setDate(today.getDate() - today.getDay()); // Set to Sunday of current week

    // Generate the week days
    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
      date.setDate(this.currentWeekStart.getDate() + i);

      const dayName = date.toLocaleString('en-US', { weekday: 'short' });
      const dayNum = date.getDate();

      this.weekDays.push({
        day: `${dayName} ${dayNum}`,
        date: date
      });
    }

    // Set the week date range
    const weekEnd = new Date(this.currentWeekStart);
    weekEnd.setDate(this.currentWeekStart.getDate() + 6);

    this.weekDateRange = `${this.formatDateShort(this.currentWeekStart)} - ${this.formatDateShort(weekEnd)}`;
  }

  previousWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.generateWeekCalendar();
  }

  nextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateWeekCalendar();
  }

  formatDateShort(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getTasksForDay(day: Date): Task[] {
    return this.todaysTasks.filter(task => {
      // Check if the task has a date
      if (!task.dueDate) return false;

      // Parse the task due date
      const taskDate = new Date(task.dueDate);

      // Check if the date matches the current day
      return taskDate.getDate() === day.getDate() &&
             taskDate.getMonth() === day.getMonth() &&
             taskDate.getFullYear() === day.getFullYear();
    });
  }

  parseFloat(value: string): number {
    return parseFloat(value);
  }

  isToday(date: Date) {

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

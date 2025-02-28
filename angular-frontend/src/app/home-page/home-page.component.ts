import { Component, NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Task, Project, DailyAffirmation, TaskStatus, Priority, TaskCategory, Note } from '../../models.interface';
import { DueDateComponent } from '../main-page/due-date/due-date.component';

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

  todaysTasks: Task[] = [
    {
      id: 'task-1',
      name: 'Create a program dashboard',
      description: '',
      status: TaskStatus.NOT_STARTED,
      dueDate: '2025-02-28T14:30:00',
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      hierarchy: 1,
      isMilestone: false,
      priority: Priority.MEDIUM,
      category: TaskCategory.DEVELOPMENT,
      prerequisites: [],
      dependentTasks: []
    },
    {
      id: 'task-2',
      name: 'Start Documentation',
      description: '',
      status: TaskStatus.NOT_STARTED,
      dueDate: '2025-02-01T14:30:00',
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      hierarchy: 1,
      isMilestone: false,
      priority: Priority.MEDIUM,
      category: TaskCategory.DOCUMENTATION,
      prerequisites: [],
      dependentTasks: []
    },
    {
      id: 'task-3',
      name: 'Make the machine learning model',
      description: '',
      status: TaskStatus.NOT_STARTED,
      dueDate: '2025-02-09T14:30:00',
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      hierarchy: 1,
      isMilestone: false,
      priority: Priority.MEDIUM,
      category: TaskCategory.DEVELOPMENT,
      prerequisites: [],
      dependentTasks: []
    }
  ];

  ongoingProjects: Project[] = [
    {
      id: 'proj-1',
      name: 'Website redesign',
      description: '',
      status: TaskStatus.ACTIVE,
      priority: Priority.HIGH,
      progress: 90,
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      ownerId: 'user-1',
      teamMembers: [],
      tasks: []
    },
    {
      id: 'proj-2',
      name: 'Machine Learning',
      description: '',
      status: TaskStatus.ACTIVE,
      priority: Priority.MEDIUM,
      progress: 40,
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      ownerId: 'user-1',
      teamMembers: [],
      tasks: []
    },
    {
      id: 'proj-3',
      name: 'Senior project',
      description: '',
      status: TaskStatus.ACTIVE,
      priority: Priority.HIGH,
      progress: 20,
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      ownerId: 'user-1',
      teamMembers: [],
      tasks: []
    },
    {
      id: 'proj-4',
      name: 'Motor board',
      description: '',
      status: TaskStatus.ACTIVE,
      priority: Priority.MEDIUM,
      progress: 80,
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      ownerId: 'user-1',
      teamMembers: [],
      tasks: []
    },
    {
      id: 'proj-5',
      name: 'Heart rate monitor',
      description: '',
      status: TaskStatus.ACTIVE,
      priority: Priority.HIGH,
      progress: 90,
      isCompleted: false,
      dateCreated: new Date().toISOString(),
      ownerId: 'user-1',
      teamMembers: [],
      tasks: []
    }
  ];

  upcomingProjects = [
    { name: 'KiSA first general meeting', date: '2025-02-09' },
    { name: 'Doctors appointment', date: '2025-02-09' },
    { name: 'project proposal', date: '2025-02-09' }
  ];

  
  notes= [
    { id: '1', title: 'Make measurements of the model', date: '02/02/2025', content: ['Calipers will be provided by the dean'], dateCreated: '', lastModified: '' },
    { id: '2', title: 'Note 2', date: '02/03/2025', content: ['This is a preview text that should be truncated if it is too long. Otherwise, it will be displayed fully'], dateCreated:'', lastModified:''},
  ];

  timeSlots = [
    { label: '12:00 AM - 4:00 AM', start: 0, end: 3 },
    { label: '4:00 AM - 8:00 AM', start: 4, end: 7 },
    { label: '8:00 AM - 12:00 PM', start: 8, end: 11 },
    { label: '12:00 PM - 4:00 PM', start: 12, end: 15 },
    { label: '4:00 PM - 8:00 PM', start: 16, end: 19 },
    { label: '8:00 PM - 12:00 AM', start: 20, end: 23 }
  ];

  togglePreview(index: number) {
    this.expanded = !this.expanded;
    const note: Note = this.notes[index]; // Assuming this.notes is Note[]
  
    if (note && note.hasOwnProperty('content')) { //check if note exists, and if it has a content property.
      if (this.expanded) {
        if (Array.isArray(note.content)) {
          note.content = note.content.join(' ');
        }
        // If note.content is already a string, no action is needed
      } else {
        if (Array.isArray(note.content)) {
          const joined = note.content.join(' ');
          note.content = joined.slice(0, 20) + (joined.length > 20 ? '...' : '');
        } else if (typeof note.content === 'string') {
            note.content = note.content.slice(0,20) + (note.content.length > 20 ? "..." : "");
        }
      }
    }
  }

  constructor() {
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
  
}
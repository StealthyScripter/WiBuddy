import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CalendarEvent, Project } from '../../models.interface';
import { mockProjects, mockTasks, mockCalendarEvents } from '../../services/test.data';
import { Task } from '../../models.interface';
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  format,
  startOfWeek,
  startOfMonth,
  startOfYear,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  differenceInMinutes,
  setHours,
  setMinutes
} from 'date-fns';

@Component({
  selector: 'app-calendars-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendars-page.component.html',
  styleUrls: ['./calendars-page.component.css']
})
export class CalendarsPageComponent implements OnInit {
  viewOptions = ['Year', 'Month', 'Week'];
  currentView = 'Month';
  currentViewDate = new Date();
  currentDate = new Date();
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours = Array.from({ length: 24 }, (_, i) => i);

  Tasks: Task[] = mockTasks;

  yearDates: Date[][] = [];
  monthDates: Date[] = [];
  weekDates: Date[] = [];

  events: CalendarEvent[] = mockCalendarEvents;

  projects: Project[] = mockProjects;

  constructor(private router: Router){}

  ngOnInit() {
    this.generateDates();
  }

  generateDates() {
    if (this.currentView === 'Year') {
      this.yearDates = Array.from({ length: 12 }, (_, i) => {
        const monthStart = startOfMonth(addMonths(startOfYear(this.currentViewDate), i));
        return this.generateMonthDates(monthStart);
      });
    } else if (this.currentView === 'Month') {
      this.monthDates = this.generateMonthDates(startOfMonth(this.currentViewDate));
    } else {
      this.weekDates = this.generateWeekDates(startOfWeek(this.currentViewDate));
    }
  }

  generateMonthDates(start: Date): Date[] {
    const daysInWeek = 7;
    const weeksToShow = 6;
    return Array.from({ length: daysInWeek * weeksToShow }, (_, i) =>
      addDays(start, i - start.getDay())
    );
  }

  generateWeekDates(start: Date): Date[] {
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  changeView(view: string) {
    this.currentView = view;
    this.generateDates();
  }

  previousPeriod() {
    if (this.currentView === 'Year') {
      this.currentViewDate = addMonths(this.currentViewDate, -12);
    } else if (this.currentView === 'Month') {
      this.currentViewDate = addMonths(this.currentViewDate, -1);
    } else {
      this.currentViewDate = addWeeks(this.currentViewDate, -1);
    }
    this.generateDates();
  }

  nextPeriod() {
    if (this.currentView === 'Year') {
      this.currentViewDate = addMonths(this.currentViewDate, 12);
    } else if (this.currentView === 'Month') {
      this.currentViewDate = addMonths(this.currentViewDate, 1);
    } else {
      this.currentViewDate = addWeeks(this.currentViewDate, 1);
    }
    this.generateDates();
  }

  hasEvents(date: Date): boolean {
    return this.events.some(event => isSameDay(event.date, date));
  }

  getEventsForDate(date: Date): CalendarEvent[] {
    return this.events
      .filter(event => isSameDay(event.date, date))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  calculateEventTop(event: CalendarEvent): number {
    // Calculate position based on time (minutes since midnight)
    const minutes = event.date.getHours() * 60 + event.date.getMinutes();
    return (minutes / 60) * 50; // 50px per hour
  }

  calculateEventHeight(event: CalendarEvent): number {
    // Calculate height based on duration
    if (!event.endDate) return 25; // Default height for events without end time

    const durationMinutes = differenceInMinutes(event.endDate, event.date);
    return (durationMinutes / 60) * 50; // 50px per hour
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return isSameDay(date1, date2);
  }

  isSameMonth(date1: Date, date2: Date): boolean {
    return isSameMonth(date1, date2);
  }

  get upcomingTasks() {
    return this.Tasks.filter(task => {
      return !task.isCompleted;
    });
  }


  get sortedProjects() {
    return [...this.projects].sort((a, b) => {
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return aTime - bTime;
    });
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

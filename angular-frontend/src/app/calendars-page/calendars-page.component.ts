import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent, Project } from '../../models.interface';
import { mockProjects } from '../../test-data/task.data';
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
  currentDate = new Date(); // Today's date
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  hours = Array.from({ length: 24 }, (_, i) => i); // 0-23 hours
  
  yearDates: Date[][] = [];
  monthDates: Date[] = [];
  weekDates: Date[] = [];

  events: CalendarEvent[] = [
    {
      id: 1,
      name: 'Team Meeting',
      date: new Date(2025, 1, 18, 10, 0),
      endDate: new Date(2025, 1, 18, 11, 0),
      type: 'meeting',
      color: '#4f46e5',
      description: 'Weekly team sync to discuss project progress'
    },
    {
      id: 2,
      name: 'Project Deadline',
      date: new Date(2025, 1, 25),
      type: 'deadline',
      projectId: 1,
      color: '#ef4444',
      description: 'Website redesign project due'
    },
    {
      id: 3,
      name: 'Client Call',
      date: new Date(2025, 1, 20, 14, 0),
      endDate: new Date(2025, 1, 20, 15, 0),
      type: 'meeting',
      color: '#0ea5e9',
      description: 'Review app requirements with client'
    },
    {
      id: 4,
      name: 'Design Review',
      date: new Date(2025, 1, 18, 13, 0),
      endDate: new Date(2025, 1, 18, 14, 30),
      type: 'meeting',
      projectId: 1,
      color: '#8b5cf6',
      description: 'Review mockups for website redesign'
    }
  ];

  projects: Project[] = mockProjects;

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
    const now = new Date();
    return this.events
      .filter(event => event.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }

  get sortedProjects() {
    // return [...this.projects].sort((a, b) => 
    //   a.dueDate.getTime() - b.dueDate.getTime()
    // );
    return this.projects
  }
}
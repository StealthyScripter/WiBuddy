import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Task, Project, TaskStatus, Priority } from '../../../models.interface';
import { mockTasks, mockProjects } from '../../../services/task.data';
import {
  addDays,
  format,
  startOfWeek,
  addWeeks,
  subWeeks,
  isSameDay
} from 'date-fns';

interface CalendarDay {
  date: Date;
  dayName: string;
  isToday: boolean;
  items: Array<{
    id: string;
    name: string;
    type: 'task' | 'project';
    priority: Priority;
    projectId?: string;
    projectColor?: string;
  }>;
}
@Component({
  selector: 'app-home-page-calendar',
  standalone:true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-page-calendar.component.html',
  styleUrl: './home-page-calendar.component.css'
})
export class HomePageCalendarComponent implements OnInit {
  currentWeekStart: Date = startOfWeek(new Date());
  days: CalendarDay[] = [];
  weekDateRange: string = "";

  tasks: Task[] = mockTasks;
  projects: Project[] = mockProjects;

  // Map project IDs to consistent colors for grouping
  projectColors: Map<string, string> = new Map();
  colorPalette: string[] = [
    '#e0f2fe', '#dbeafe', '#e0e7ff', '#ede9fe', '#fae8ff',
    '#fee2e2', '#ffedd5', '#fef3c7', '#ecfccb', '#d1fae5'
  ];

  priorityColors = {
    [Priority.CRITICAL]: '#ef4444', // red
    [Priority.HIGH]: '#f97316',     // orange
    [Priority.MEDIUM]: '#facc15',   // yellow
    [Priority.LOW]: '#22c55e'       // green
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.assignProjectColors();
    this.generateWeekCalendar();
  }

  assignProjectColors() {
    this.projects.forEach((project, index) => {
      this.projectColors.set(
        project.id,
        this.colorPalette[index % this.colorPalette.length]
      );
    });
  }

  generateWeekCalendar() {
    // Generate days
    this.days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(this.currentWeekStart, i);
      const today = new Date();

      this.days.push({
        date,
        dayName: format(date, 'EEE'),
        isToday: isSameDay(date, today),
        items: []
      });
    }

    // Set week date range for display
    const weekEnd = addDays(this.currentWeekStart, 6);
    this.weekDateRange = `${format(this.currentWeekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

    // Populate calendar with tasks and projects
    this.populateCalendarItems();
  }

  populateCalendarItems() {
    // Reset items in each day
    this.days.forEach(day => day.items = []);

    // Add tasks to calendar
    this.tasks.forEach(task => {
      if (!task.dueDate) return;

      const dueDate = new Date(task.dueDate);
      const dayIndex = this.days.findIndex(day => isSameDay(day.date, dueDate));

      if (dayIndex !== -1) {
        this.days[dayIndex].items.push({
          id: task.id,
          name: task.name,
          type: 'task',
          priority: task.priority || Priority.MEDIUM,
          projectId: task.projectId,
          projectColor: task.projectId ? this.projectColors.get(task.projectId) : undefined
        });
      }
    });

    // Add projects to calendar
    this.projects.forEach(project => {
      if (!project.dueDate) return;

      const dueDate = new Date(project.dueDate);
      const dayIndex = this.days.findIndex(day => isSameDay(day.date, dueDate));

      if (dayIndex !== -1) {
        this.days[dayIndex].items.push({
          id: project.id,
          name: project.name,
          type: 'project',
          priority: project.priority || Priority.MEDIUM,
          projectColor: this.projectColors.get(project.id)
        });
      }
    });
  }

  previousWeek() {
    this.currentWeekStart = subWeeks(this.currentWeekStart, 1);
    this.generateWeekCalendar();
  }

  nextWeek() {
    this.currentWeekStart = addWeeks(this.currentWeekStart, 1);
    this.generateWeekCalendar();
  }

  navigateToTask(taskId: string) {
    this.router.navigate(['/task-details', taskId]);
  }

  navigateToProject(projectId: string) {
    this.router.navigate(['/project-details', projectId]);
  }

  getPriorityColor(priority: Priority): string {
    return this.priorityColors[priority] || '#64748b'; // Default gray
  }

  isToday(date: Date): boolean {
    return isSameDay(date, new Date());
  }
}

export default HomePageCalendarComponent;

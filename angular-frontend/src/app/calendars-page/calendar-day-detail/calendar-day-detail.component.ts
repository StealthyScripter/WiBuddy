import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, CalendarEvent } from '../../../models.interface';
import { mockTasks, mockCalendarEvents } from '../../../services/test.data';

@Component({
  selector: 'app-calendar-day-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-day-detail.component.html',
  styleUrl: './calendar-day-detail.component.css'
})
export class CalendarDayDetailComponent implements OnInit {
  selectedDate: Date | null = null;
  tasks: Task[] = [];
  events: CalendarEvent[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const dateParam = this.route.snapshot.paramMap.get('date');
    if (dateParam) {
      this.selectedDate = new Date(dateParam);
      this.loadDayData();
    }
  }

  loadDayData() {
    if (!this.selectedDate) return;

    // Filter tasks for this day
    this.tasks = mockTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return this.isSameDay(taskDate, this.selectedDate!);
    });

    // Filter events for this day
    this.events = mockCalendarEvents.filter(event =>
      this.isSameDay(event.date, this.selectedDate!)
    );
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  goBack() {
    this.router.navigate(['/calendar']);
  }

  navigateToTask(taskId: string) {
    this.router.navigate(['/task-details', taskId]);
  }
}

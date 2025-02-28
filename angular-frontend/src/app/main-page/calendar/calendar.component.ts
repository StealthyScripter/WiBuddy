import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  weeks: any[] = [];
  monthName: string = "";
  
  tasks: { date: string, task: string }[] = [
    { date: "2025-02-01", task: "Start documentation" },
    { date: "2025-02-02", task: "Make the machine learning model" }
  ];

  constructor() {
    this.generateCalendar();
  }

  generateCalendar() {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    this.monthName = firstDayOfMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    let dayCounter = 1 - firstDayOfMonth.getDay();
    this.weeks = [];

    while (dayCounter <= lastDayOfMonth.getDate()) {
      let week = [];
      for (let i = 0; i < 7; i++) {
        if (dayCounter > 0 && dayCounter <= lastDayOfMonth.getDate()) {
          let dateStr = `${this.currentYear}-${(this.currentMonth + 1).toString().padStart(2, '0')}-${dayCounter.toString().padStart(2, '0')}`;
          let task = this.tasks.find(t => t.date === dateStr);
          week.push({ day: dayCounter, task: task ? task.task : "" });
        } else {
          week.push(null); // Empty cells for previous/next months
        }
        dayCounter++;
      }
      this.weeks.push(week);
    }
  }

  previousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }
}

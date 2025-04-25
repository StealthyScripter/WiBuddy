import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-due-date',
  templateUrl: './due-date.component.html',
  styleUrls: ['./due-date.component.css']
})
export class DueDateComponent {
  @Input() dueDate: string | Date | null | undefined;

  getFormattedDate() {
    if (!this.dueDate) {
      // Return a default value when dueDate is null or undefined
      return { month: '--', day: '--' };
    }

    const dateObj = new Date(this.dueDate);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return { month: '--', day: '--' };
    }

    const month = dateObj.toLocaleString('en-US', { month: 'short' }); // Three-letter month (e.g., Jan)
    const day = dateObj.getDate(); // Day of the month (e.g., 31)
    return { month, day };
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-due-date',
  templateUrl: './due-date.component.html',
  styleUrls: ['./due-date.component.css']
})
export class DueDateComponent {
  @Input() dueDate: string='';

  getFormattedDate() {
    const dateObj = new Date(this.dueDate);
    const month = dateObj.toLocaleString('en-US', { month: 'short' }); // Three-letter month (e.g., Jan)
    const day = dateObj.getDate(); // Day of the month (e.g., 31)
    return { month, day };
  }
}

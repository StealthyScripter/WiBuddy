import { Component } from '@angular/core';
import { DueDateComponent } from '../due-date/due-date.component';

@Component({
  selector: 'app-upcoming-tasks',
  imports: [DueDateComponent],
  templateUrl: './upcoming-tasks.component.html',
  styleUrl: './upcoming-tasks.component.css'
})
export class UpcomingTasksComponent {

}

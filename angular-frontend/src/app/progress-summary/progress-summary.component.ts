import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechStack, Task } from '../../models.interface';
import { mockUpcomingTasks, mockTechStack, mockCompletedTasks} from '../../test-data/task.data';


@Component({
  selector: 'app-progress-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-summary.component.html',
  styleUrl: './progress-summary.component.css'
})
export class ProgressSummaryComponent {
  upcomingTasks: Task[] = mockUpcomingTasks;
   technologies: TechStack[] = mockTechStack;
   completedTasks: Task[] = mockCompletedTasks;
}

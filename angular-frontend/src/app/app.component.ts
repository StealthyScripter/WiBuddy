import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProjectsSectionComponent } from './home/projects-section/projects-section.component';
import { TasksSectionComponent } from './home/tasks-section/tasks-section.component';
import { AffirmationsSectionComponent } from './home/affirmations-section/affirmations-section.component';
import { CalendarSectionComponent } from './home/calendar-section/calendar-section.component';
import { ProgressSectionComponent } from './home/progress-section/progress-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ProjectsSectionComponent, 
    TasksSectionComponent,
    CalendarSectionComponent,
    ProgressSectionComponent,
    AffirmationsSectionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-frontend';
}

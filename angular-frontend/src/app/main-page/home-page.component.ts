import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { IntroductionComponent } from './introduction/introduction.component';
import { TasksComponent } from './tasks/tasks.component';
import { OngoingProjectsComponent } from './ongoing-projects/ongoing-projects.component';
import { UpcomingTasksComponent } from './upcoming-tasks/upcoming-tasks.component';
import { NotesComponent } from './notes/notes.component';
import { CalendarComponent } from './calendar/calendar.component';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    IntroductionComponent, 
    TasksComponent, 
    OngoingProjectsComponent, 
    UpcomingTasksComponent, 
    NotesComponent, 
    CalendarComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class MainPageComponent {
  title = 'angular-frontend';
}

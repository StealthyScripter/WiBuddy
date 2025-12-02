import { Routes } from '@angular/router';
import { TasksPageComponent } from './tasks-page/tasks-page.component';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { TaskDetailPageComponent } from './tasks-page/task-detail-page/task-detail-page.component';
import { ProjectDetailsPageComponent } from './projects-page/project-details-page/project-details-page.component';
import { CalendarsPageComponent } from './calendars-page/calendars-page.component';
import { NewTaskPageComponent } from './tasks-page/new-task-page/new-task-page.component';
import { NewProjectPageComponent } from './projects-page/new-project-page/new-project-page.component';
import { NotesPageComponent } from './lms-page/notes-page/notes-page.component';
import { NewNotePageComponent } from './lms-page/notes-page/new-note-page/new-note-page.component';

import { NotesDetailPageComponent } from './lms-page/notes-page/notes-detail-page/notes-detail-page.component';

import { LmsPageComponent } from './lms-page/lms-page.component';

import { TrendsPageComponent } from './trends-page/trends-page.component';


import { HomePageComponent } from './home-page/home-page.component';
import { AffirmationsDetailsPageComponent } from './home-page/affirmations-details-page/affirmations-details-page.component';
import { NewEventComponent } from './calendars-page/new-event/new-event.component';
import { CalendarDayDetailComponent } from './calendars-page/calendar-day-detail/calendar-day-detail.component';
import { EditProfileComponent } from './profile-page/edit-profile/edit-profile.component';
import { TechStackPageComponent } from './profile-page/tech-stack-page/tech-stack-page.component';
import { MarketInsightComponent } from './trends-page/market-insight/market-insight.component';
import { RecommendationComponent } from './trends-page/recommendation/recommendation.component';
import { SkillNotificationComponent } from './trends-page/skill-notification/skill-notification.component';
import { TrendNotificationComponent } from './trends-page/trend-notification/trend-notification.component';
import { ResourceComponent } from './lms-page/resource/resource.component';
import { SkillProgressComponent } from './lms-page/skill-progress/skill-progress.component';


const routeConfig: Routes = [
    //  { path: 'login', component: LoginComponent },

    //  { path: 'register', component: RegisterComponent },

    //  {path: '', component: HomePageComponent, canActivate: [AuthGuard]},
    {path: '', component: HomePageComponent },

     {path: 'tasks', component: TasksPageComponent},

     {path: 'task-details/:taskId', component: TaskDetailPageComponent},

     {path: 'tasks/new', component: NewTaskPageComponent},

     {path: 'projects', component: ProjectsPageComponent},

     {path: 'project-details/:projectId', component: ProjectDetailsPageComponent},

     {path: 'projects/new', component: NewProjectPageComponent},

     {path: 'profile', component: ProfilePageComponent},

     {path: 'calendar', component: CalendarsPageComponent},

     {path: 'notes', component:NotesPageComponent},

     {path: 'notes-details/:noteId', component: NotesDetailPageComponent},

     {path: 'notes/new', component: NewNotePageComponent},

     { path: 'lms', component: LmsPageComponent },

     { path: 'trends', component: TrendsPageComponent },

     {path: 'affirmations/:id', component: AffirmationsDetailsPageComponent},

     {path: 'new-event', component: NewEventComponent},

     {path: 'day/:date', component: CalendarDayDetailComponent},

     {path: 'edit-profile', component: EditProfileComponent},

     {path: 'techstack/:techId', component: TechStackPageComponent},

     {path: 'market-insight', component: MarketInsightComponent},

     {path: 'recommendation/:id', component: RecommendationComponent},

     {path: 'skill-notification/:id', component: SkillNotificationComponent},

     {path: 'trend-notification/:id', component: TrendNotificationComponent},

     {path: 'resource/:id', component: ResourceComponent},

     {path: 'skill-progress/:id', component: SkillProgressComponent}

];


export default routeConfig;

import { Routes } from '@angular/router';
import { TasksPageComponent } from './tasks-page/tasks-page.component';
import { ProjectsPageComponent } from './projects-page/projects-page.component';
import { ProgressSummaryComponent } from './progress-summary/progress-summary.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { TaskDetailPageComponent } from './tasks-page/task-detail-page/task-detail-page.component';
import { ProjectDetailsPageComponent } from './projects-page/project-details-page/project-details-page.component';
import { CalendarsPageComponent } from './calendars-page/calendars-page.component';
import { NewTaskPageComponent } from './tasks-page/new-task-page/new-task-page.component';
import { NewProjectPageComponent } from './projects-page/new-project-page/new-project-page.component';
import { NotesPageComponent } from './notes-page/notes-page.component';
import { NewNotePageComponent } from './notes-page/new-note-page/new-note-page.component';

import { NotesDetailPageComponent } from './notes-page/notes-detail-page/notes-detail-page.component';

import { LmsPageComponent } from './lms-page/lms-page.component';

import { TrendsPageComponent } from './trends-page/trends-page.component';


import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuard } from './guards/auth.guard';
import { AffirmationsDetailsPageComponent } from './home-page/affirmations-details-page/affirmations-details-page.component';


const routeConfig: Routes = [
    //  { path: 'login', component: LoginComponent },

    //  { path: 'register', component: RegisterComponent },

    //  {path: '', component: HomePageComponent, canActivate: [AuthGuard]},
    {path: '', component: HomePageComponent },

     {path: 'tasks', component: TasksPageComponent},

     {path: 'task-details/:taskId', component: TaskDetailPageComponent},

     {path: 'add-task', component: NewTaskPageComponent},

     {path: 'projects', component: ProjectsPageComponent},

     {path: 'project-details/:projectId', component: ProjectDetailsPageComponent},

     {path: 'add-project', component: NewProjectPageComponent},

     {path: 'progress', component: ProgressSummaryComponent},

     {path: 'profile', component: ProfilePageComponent},

     {path: 'calendar', component: CalendarsPageComponent},

     {path: 'notes', component:NotesPageComponent},

     {path: 'notes-details/:noteId', component: NotesDetailPageComponent},

     {path: 'add-notes', component: NewNotePageComponent},

     { path: 'lms', component: LmsPageComponent },

     { path: 'trends', component: TrendsPageComponent },

     {path: 'affirmations/:id', component: AffirmationsDetailsPageComponent}

];


export default routeConfig;

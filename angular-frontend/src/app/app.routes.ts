import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/home-page.component';
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


import { HomePageComponent } from './home-page/home-page.component';


const routeConfig: Routes = [
     {path: '', component: HomePageComponent},

     {path:'home', component: MainPageComponent},
     
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

     // {path: 'note-details/:noteId', component: NoteDetailComponent},
    
     // {path: 'add-note', component: AddNoteComponent},

];


export default routeConfig;
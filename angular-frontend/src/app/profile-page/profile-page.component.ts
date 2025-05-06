import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TaskStatus, Task, Project, Note, Technology } from '../../models.interface';
import { mockTasks, mockProjects, mockNotes, mockTech } from '../../services/task.data';

interface TimelineActivity {
  type: 'task' | 'project' | 'note';
  title: string;
  description: string;
  time: string;
}

interface RecentNote {
  id:string;
  name: string;
  preview: string;
  date: string;
}

interface Deadline {
  day: string;
  month: string;
  title: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
   // User information
   username: string = 'Sarah Anderson';
   userRole: string = 'Senior Software Developer';
   userSkills: string[] = ['React', 'Angular', 'TypeScript', 'Node.js'];

   // Stats
   tasksCompleted: number = 0;
   activeProjects: number = 0;
   notesCreated: number = 0;

   // Growth stats (percentage change from previous month)
  tasksGrowth: number = 12;
  projectsGrowth: number = -5;
  notesGrowth: number = 8;

   // Math reference for template
   Math = Math;

   // Settings
   darkMode: boolean = false;
   notificationsEnabled: boolean = true;
   showSettingsMenu: boolean = false;

   // Technologies/Skills
   technologies = mockTech;

   // Recent Activities
   recentActivities: TimelineActivity[] = [
     {
       type: 'task',
       title: 'Completed Frontend Design',
       description: 'Finalized the UI components for the dashboard',
       time: '2 hours ago'
     },
     {
       type: 'project',
       title: 'Created New Project',
       description: 'Started Mobile App Development project',
       time: 'Yesterday'
     },
     {
       type: 'note',
       title: 'Added Meeting Notes',
       description: 'Documented requirements from client meeting',
       time: '3 days ago'
     }
   ];

   // Recent Notes
   recentNotes: RecentNote[] = [
     {
       name: 'API Integration Plan',
       preview: 'Steps for connecting the frontend to backend services...',
       date: 'Apr 15',
       id:'5'
     },
     {
       name: 'Client Feedback',
       preview: 'Notes from the latest client review session...',
       date: 'Apr 10',
       id:'6'
     },
     {
       name: 'Design System',
       preview: 'Component standards and color palette...',
       date: 'Apr 5',
       id:'7'
     }
   ];

   // Upcoming Deadlines
   upcomingDeadlines: Deadline[] = [
     {
       day: '25',
       month: 'Apr',
       title: 'Backend Integration',
       project: 'Website Redesign',
       priority: 'high'
     },
     {
       day: '30',
       month: 'Apr',
       title: 'User Testing',
       project: 'Mobile App',
       priority: 'medium'
     },
     {
       day: '5',
       month: 'May',
       title: 'Final Presentation',
       project: 'Client Project',
       priority: 'low'
     }
   ];

   constructor(private router:Router){}

   ngOnInit() {
     this.calculateStats();
   }

   private calculateStats() {
     // Calculate completed tasks
     this.tasksCompleted = mockTasks.filter(task => task.isCompleted).length;

     // Calculate active projects
     this.activeProjects = mockProjects.filter(project =>
       project.completionStatus === TaskStatus.IN_PROGRESS).length;

     // Count notes
     this.notesCreated = mockNotes.length;
   }

   toggleSettingsMenu() {
     this.showSettingsMenu = !this.showSettingsMenu;
   }

   toggleDarkMode() {
     this.darkMode = !this.darkMode;
     // In a real app, you'd update the theme in a theme service
   }

   editProfile() {
     // Navigate to edit profile page or show modal
     console.log('Edit profile clicked');
     this.toggleSettingsMenu();
   }

   logout() {
     // Handle logout logic
     console.log('Logout clicked');
   }

   navigateToNote(noteId: string){
    this.router.navigate(['notes-details',noteId]);
  }

}

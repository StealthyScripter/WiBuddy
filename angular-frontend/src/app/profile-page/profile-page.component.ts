import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TaskStatus, Task, Project, Note, Technology } from '../../models.interface';
import { mockTasks, mockProjects, mockNotes, mockTechStack } from '../../services/test.data';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
   technologies = mockTechStack;

   darkmodeEnabled: boolean = true;


   // Recent Notes
   recentNotes: Note[] = [
     {
       name: 'API Integration Plan',
       content: ['API Integration Plan'],
       dateCreated: 'Jan 26',
       preview: 'Steps for connecting the frontend to backend services...',
       lastModified: 'Apr 15',
       id:'5'
     },
     {
       name: 'Client Feedback',
       content: [],
       dateCreated: 'March 10',
       preview: 'Notes from the latest client review session...',
       lastModified: 'Apr 10',
       id:'6'
     },
     {
       name: 'Design System',
       content: [],
       dateCreated: 'Apr 1',
       preview: 'Component standards and color palette...',
       lastModified: 'Apr 5',
       id:'7'
     }
   ];

   constructor(
    private router:Router,
    private themeService:ThemeService
  ){
    this.darkmodeEnabled = this.themeService.getCurrentTheme() === 'dark';
  }

   ngOnInit() {
     this.calculateStats();
   }

   toggleDarkMode(): void {
    this.themeService.toggleTheme();
    this.darkmodeEnabled = this.themeService.getCurrentTheme() === 'dark';
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

   getTechIcon(techName: string): string {
      // Map technology names to Font Awesome icons
      const iconMap: {[key: string]: string} = {
        'React': 'fab fa-react',
        'Node.js': 'fab fa-node-js',
        'Python': 'fab fa-python',
        'MongoDB': 'fas fa-database',
        // Add more mappings as needed
      };

      return iconMap[techName] || 'fas fa-code'; // Default to code icon
    }

   navigateToNote(noteId: string){
    this.router.navigate(['/notes-details',noteId]);
  }

  navigateToTechstack(techId: string) {
    this.router.navigate(['/techstack', techId])
  }

  navigateToEditProfile(){
    this.router.navigate(['edit-profile']);
  }

  logout() {
     //TODO: Handle logout logic
     console.log('Logout clicked');
   }

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface Technology {
  name: string;
  proficiency: number;
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  darkMode = false;
  emailNotifications = true;

  technologies: Technology[] = [
    { name: 'React', proficiency: 85 },
    { name: 'Node.js', proficiency: 70 },
    { name: 'TypeScript', proficiency: 65 }
  ];

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    // Implement dark mode logic here
  }

}

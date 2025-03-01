import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { mockTech } from '../../test-data/task.data';
import { Technology } from '../../models.interface';


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

  technologies: Technology[] = mockTech;

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    // Implement dark mode logic here
  }

}

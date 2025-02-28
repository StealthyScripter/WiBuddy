import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Task {
  title: string;
  dueDate:string;
}

interface TechStack {
  name: string;
  icon: string;
  count: string;

}

@Component({
  selector: 'app-progress-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-summary.component.html',
  styleUrl: './progress-summary.component.css'
})
export class ProgressSummaryComponent {
  upcomingTasks: Task[] = [
    { title: 'API Integration', dueDate: 'Jan 15, 2025' },
    { title: 'Database Migration', dueDate: 'Jan 20, 2025' }
  ];

  completedTasks: Task[] = [
    { title: 'User Authentication', dueDate: 'Jan 5, 2025' },
    { title: 'Frontend Redesign', dueDate: 'Jan 2, 2025' }
  ];

  techStack: TechStack[] = [
    { name: 'React', count: '15 components', icon: '⚛️' },
    { name: 'Node.js', count: '8 services', icon: '🟢' },
    { name: 'Python', count: '5 scripts', icon: '🐍' },
    { name: 'MongoDB', count: '3 databases', icon: '🍃' }
  ];
}

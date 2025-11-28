import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resource',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resource.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f9fafb;
    }
  `]
})
export class ResourceComponent implements OnInit {
  resourceTitle = 'Introduction to Web Development';
  resourceCategory = 'Programming';
  progress = 45;
  completedModules = 3;
  totalModules = 8;
  timeSpent = 12;
  lastActivity = '2 days ago';
  notes = '';

  modules = [
    { title: 'HTML Fundamentals', duration: '2 hours', completed: true },
    { title: 'CSS Basics', duration: '3 hours', completed: true },
    { title: 'JavaScript Introduction', duration: '4 hours', completed: true },
    { title: 'DOM Manipulation', duration: '3 hours', completed: false },
    { title: 'ES6+ Features', duration: '3 hours', completed: false },
    { title: 'Async Programming', duration: '4 hours', completed: false },
    { title: 'APIs and Fetch', duration: '3 hours', completed: false },
    { title: 'Final Project', duration: '6 hours', completed: false }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // Load resource data based on ID
  }

  goBack() {
    this.router.navigate(['/lms']);
  }
}

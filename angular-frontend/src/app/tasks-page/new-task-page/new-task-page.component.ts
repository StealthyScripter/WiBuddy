import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface Project {
  id: number;
  name: string;
}

interface Technology {
  id: number;
  name: string;
}

@Component({
  selector: 'app-new-task-page',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl:'new-task-page.component.html',
  styleUrl: 'new-task-page.component.css'
})
export class NewTaskPageComponent {
  taskForm: FormGroup;
  
  projects: Project[] = [
    { id: 1, name: 'Website Redesign' },
    { id: 2, name: 'Mobile App Development' },
    { id: 3, name: 'API Integration' },
    { id: 4, name: 'Database Migration' }
  ];

  technologies: Technology[] = [
    { id: 1, name: 'Angular' },
    { id: 2, name: 'React' },
    { id: 3, name: 'Node.js' },
    { id: 4, name: 'Python' },
    { id: 5, name: 'Java' }
  ];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(0)]],
      project: [null],
      technology: [null],
      isMilestone: [false]
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      console.log(this.taskForm.value);
      // Handle form submission
    }
  }

  onCancel() {
    this.taskForm.reset();
    // Add navigation logic here
  }
}
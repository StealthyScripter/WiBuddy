import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { mockProjects, mockTechStack } from '../../../services/test.data';
import { Project, Technology } from '../../../models.interface';

@Component({
  selector: 'app-new-task-page',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl:'new-task-page.component.html',
  styleUrl: 'new-task-page.component.css'
})
export class NewTaskPageComponent {
  taskForm: FormGroup;

  projects: Project[] = mockProjects;

  technologies: Technology[] = mockTechStack;

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

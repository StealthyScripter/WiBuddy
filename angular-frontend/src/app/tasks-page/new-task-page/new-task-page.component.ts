import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { mockProjects, mockTechStack } from '../../../services/test.data';
import { TaskService } from '../../../services/task_service';
import { Project, Technology } from '../../../models.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-task-page',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl:'new-task-page.component.html',
  styleUrls: ['new-task-page.component.css']
})
export class NewTaskPageComponent {
  taskForm: FormGroup;

  projects: Project[] = mockProjects;

  technologies: Technology[] = mockTechStack;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private taskService: TaskService
  ) {
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

  async onSubmit() {
      if (this.taskForm.valid) {
      const taskData = this.taskForm.value;

      try{
        const result = this.taskService.create(taskData);

        if (result instanceof Promise) {
          result.then(() => {
            this.router.navigate(['/tasks']);
          });
        } else {
          result.subscribe(() => {
            this.router.navigate(['/tasks']);
          });
        }

      } catch (err) {
        console.error('Task creation failed', err);
      }

    }
  }

  onCancel() {
    this.taskForm.reset();
    // Add navigation logic here
  }
}

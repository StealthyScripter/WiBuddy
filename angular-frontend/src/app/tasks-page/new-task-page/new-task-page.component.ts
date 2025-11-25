import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Project, Technology } from '../../../models.interface';
import { mockProjects, mockTechStack } from '../../../services/test.data';
import { TaskService } from '../../../services/task_service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-task-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: 'new-task-page.component.html',
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
    // Initialize the reactive form
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(0)]],
      project: [null, Validators.required],
      technology: [null, Validators.required],
      isMilestone: [false]
    });
  }

  // Submit handler
  onSubmit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskData = this.taskForm.value;

    const payload = {
      name: taskData.taskName,
      description: taskData.description,
      due_date: taskData.dueDate,
      estimated_duration: Number(taskData.duration),
      project_id: taskData.project,
      technology_id: taskData.technology,
      is_milestone: taskData.isMilestone
    };

    const result: Observable<any> = this.taskService.createTask(payload);

    result.subscribe({
      next: () => {
        console.log('Task created successfully:', payload);
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        console.error('Task creation failed:', err);
      }
    });
  }

  // Cancel handler
  onCancel() {
    this.taskForm.reset();
    this.router.navigate(['/tasks']);
  }
}

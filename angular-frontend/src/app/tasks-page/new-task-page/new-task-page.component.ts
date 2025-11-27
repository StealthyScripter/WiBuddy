import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Project, Technology, Task } from '../../../models.interface';
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
export class NewTaskPageComponent implements OnInit{
  taskForm: FormGroup;
  taskToEdit: Task | undefined;

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

  ngOnInit(): void {
    const state = history.state;
    if (state && state.task){
      this.taskToEdit = state.task as Task;

      this.taskForm.patchValue({
      taskName: this.taskToEdit.name,
      description: this.taskToEdit.description,
      dueDate: this.taskToEdit.dueDate || '',
      duration: this.taskToEdit.estimatedDuration || 0,
      project: this.taskToEdit.projectId || null,
      technology: this.taskToEdit.technologyId || null,
      isMilestone: this.taskToEdit.isMilestone || false
    });
    }
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

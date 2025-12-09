import { Component, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Project } from '../../../models.interface';

@Component({
  selector: 'app-new-project-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule
],
  templateUrl: './new-project-page.component.html',
  styleUrls: ['./new-project-page.component.css']
})
export class NewProjectPageComponent implements OnInit{
  projectForm: FormGroup;
  projectToEdit: Project | undefined;
  taskCategories: string[] = [
    'Development', 'Design', 'Marketing', 'Research',
    'Testing', 'Documentation', 'Planning', 'Operations'
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      category: ['', Validators.required],
      completionStatus: ['ongoing', Validators.required]
    });
  }

  ngOnInit(): void {
    const state = history.state;
    if (state && state.project) {
      this.projectToEdit = state.project as Project;

      // pre-fill form
    this.projectForm.patchValue({
      name: this.projectToEdit.name,
      description: this.projectToEdit.description,
      startDate: this.projectToEdit.startDate,
      dueDate: this.projectToEdit.dueDate,
      completionStatus: this.projectToEdit.completionStatus
    });

    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      console.log(this.projectForm.value);
      this.router.navigate(['/projects']); // redirect
    }
  }

  onCancel() {
    this.projectForm.reset();
    this.router.navigate(['/projects']); // redirect
  }
}

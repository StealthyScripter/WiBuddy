import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // needed for navigation

@Component({
  selector: 'app-new-project-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // <-- required for [formGroup]
    RouterModule         // <-- required for this.router.navigate()
  ],
  templateUrl: './new-project-page.component.html',
  styleUrls: ['./new-project-page.component.css']
})
export class NewProjectPageComponent {
  projectForm: FormGroup;
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

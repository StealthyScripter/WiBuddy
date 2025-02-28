import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-project-page',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './new-project-page.component.html',
  styleUrl: './new-project-page.component.css'
})

  export class NewProjectPageComponent {
    projectForm: FormGroup;
    taskCategories: string[] = [
      'Development',
      'Design',
      'Marketing',
      'Research',
      'Testing',
      'Documentation',
      'Planning',
      'Operations'
    ];
  
    constructor(private fb: FormBuilder) {
      this.projectForm = this.fb.group({
        name: ['', [Validators.required]],
        description: ['', [Validators.required]],
        startDate: ['', [Validators.required]],
        dueDate: ['', [Validators.required]],
        category: ['', [Validators.required]],
        status: ['ongoing', [Validators.required]]
      });
    }
  
    onSubmit() {
      if (this.projectForm.valid) {
        console.log(this.projectForm.value);
        // Handle form submission
      }
    }
  
    onCancel() {
      this.projectForm.reset();
      // Handle navigation or cancel action
    }
  }

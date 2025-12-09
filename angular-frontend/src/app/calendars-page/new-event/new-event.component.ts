import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.css'
})
export class NewEventComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: [''],
      type: ['meeting', Validators.required],
      color: ['#4f46e5', Validators.required]
    });
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const formData = this.eventForm.value;
    console.log('Creating event:', formData);

    // In production, call service to create event
    this.router.navigate(['/calendar']);
  }

  onCancel() {
    this.router.navigate(['/calendar']);
  }
}

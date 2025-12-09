import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      fullName: ['Sarah Anderson', Validators.required],
      email: ['sarah.anderson@company.com', [Validators.required, Validators.email]],
      role: ['Senior Software Developer'],
      bio: ['Passionate about creating elegant solutions to complex problems.'],
      location: ['San Francisco, CA'],
      website: ['https://sarahanderson.dev']
    });
  }

  ngOnInit() {
    // Load current user data
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formData = this.profileForm.value;
    console.log('Updating profile:', formData);

    // In production, call service to update profile
    this.router.navigate(['/profile']);
  }

  onCancel() {
    this.router.navigate(['/profile']);
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Input } from '../../../shared/components/input/input';
import { Button } from '../../../shared/components/button/button';
import { Checkbox } from '../../../shared/components/checkbox/checkbox';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule,
    ReactiveFormsModule, Input,Button,Checkbox],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  loginForm: FormGroup;
  showPassword = false;
private router = inject(Router);
logoPath = '/assets/images/logincps.svg';
truckImagePath = '/assets/images/loginTruck.svg';

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  // Helper method to sync custom input value changes to the Reactive Form Control
  onControlChange(controlName: string, val: string): void {
    this.loginForm.get(controlName)?.setValue(val);
    this.loginForm.get(controlName)?.markAsTouched();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
      this.router.navigate(['/marketing-dashboard']);
    if (this.loginForm.valid) {
      console.log('Form Submitted:', this.loginForm.value);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onRememberMeChange(checked: boolean): void {
  this.loginForm
    .get('rememberMe')
    ?.setValue(checked);
}
}

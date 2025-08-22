import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../core/auth/services/auth.service';
import { logger } from '../core/utils/helper';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrl: './signup.component.css',
  template: `
  <form
  class="flex gap-3"
  [formGroup]="signupForm" (ngSubmit)="onSubmit()">
    <input
    class="border border-amber-400 rounded-lg"
    [ngClass]="{
      'border-red-500': signupForm.get('username')?.invalid && signupForm.get('username')?.touched,
      'border-green-500': signupForm.get('username')?.valid
    }"
    placeholder="e.g.: joe@doe.com"
    required
    type="email" formControlName="username" id="username"
    >
    <!-- @if (signupForm.get("username") && !signupForm.get("username")?.valid) {
      Username needs to email.
    } -->
    <input
  [ngClass]="{
      'border-red-500': signupForm.get('password')?.invalid && signupForm.get('password')?.touched,
      'border-green-500': signupForm.get('password')?.valid
    }"
    placeholder="e.g.: P4ssW0rd123"
    required
    class="border border-amber-400 rounded-lg"
    type="password" formControlName="password" id="password">
    <button
    class="border border-blue-400 rounded-lg p-3"
    type="submit" [disabled]="!signupForm.valid" >Submit</button>
  </form>
  `,
})
export class SignupComponent {

  signupForm = new FormGroup({
    username: new FormControl("", [Validators.email, Validators.required]),
    password: new FormControl("", [
      // Validators.pattern('(?=.*[A-Z])'), // At least one uppercase
      // Validators.pattern('(?=.*[a-z])'), // At least one lowercase
      // Validators.pattern('(?=.*[0-9])'), // At least one number
      // Validators.pattern('(?=.*[!@#$%^&*()_+{}|:"<>?~`\-=[\]\\])'), // At least one special character
      Validators.minLength(8),
       Validators.required]),
  })

  authService = inject(AuthService);
  message?: String;

  constructor() {
  }

  onSubmit() {
    const { username, password } = this.signupForm.value;
    if( username && password) {
     this.authService.signup(username, password)
     .subscribe( {
      next: resp =>  {
          this.message = resp.message || undefined ;
          console.log(resp.data?.username);
      },
      error: (err) => {
        this.message = err;
        logger.error(err, "Signup submit error");
      }
     })
    }
  }
}

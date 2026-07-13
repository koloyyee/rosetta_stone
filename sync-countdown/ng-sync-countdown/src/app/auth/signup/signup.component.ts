import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/auth/services/auth.service';
import { logger } from '../../core/utils/helper';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, MatInputModule, MatButtonModule],
  styleUrl: './signup.component.css',
  template: `
    <div
      class="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100"
    >
      <form
        class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6"
        [formGroup]="signupForm"
        (ngSubmit)="onSubmit()"
      >
        <h2 class="text-3xl font-bold text-amber-700 mb-2 text-center">
          Sign Up
        </h2>

        <mat-form-field >
          <mat-label>Email</mat-label>
          <input
            matInput
            type="email"
            formControlName="username"
            autocomplete="username"
            class="rounded-lg"
            [ngClass]="{
              'border-red-500':
                signupForm.get('username')?.invalid &&
                signupForm.get('username')?.touched
            }"
          />
          @if (signupForm.get('username')?.hasError('required') &&
          signupForm.get('username')?.touched) {
          <mat-error>Email is required</mat-error>
          } @if (signupForm.get('username')?.hasError('email') &&
          signupForm.get('username')?.touched) {
          <mat-error>Please enter a valid email address</mat-error>
          }
        </mat-form-field>

        <mat-form-field >
          <mat-label>Password</mat-label>
          <input
            matInput
            type="password"
            formControlName="password"
            autocomplete="new-password"
            class="rounded-lg"
            [ngClass]="{
              'border-red-500':
                signupForm.get('password')?.invalid &&
                signupForm.get('password')?.touched
            }"
          />
          @if (signupForm.get('password')?.hasError('required') &&
          signupForm.get('password')?.touched) {
          <mat-error>Password is required</mat-error>
          } @if (signupForm.get('password')?.hasError('minlength') &&
          signupForm.get('password')?.touched) {
          <mat-error>Password must be at least 8 characters long</mat-error>
          }
        </mat-form-field>

        <button
          mat-raised-button
          color="primary"
          class="w-full py-2 text-lg font-semibold bg-amber-500 hover:bg-amber-600 transition"
          [disabled]="signupForm.invalid"
        >
          Sign Up
        </button>

        @if (message) {
        <div class="text-green-700 text-center font-medium">
          {{ message }}
        </div>
        }

        <a href="/login" class="self-center hover:text-orange-700"
          >Got An Account? Come Login!</a
        >
      </form>

        <a href="/" class="self-center hover:text-orange-500"
          >Home</a
        >
    </div>
  `,
})
export class SignupComponent {
  signupForm = new FormGroup({
    username: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      // Validators.pattern('(?=.*[A-Z])'), // At least one uppercase
      // Validators.pattern('(?=.*[a-z])'), // At least one lowercase
      // Validators.pattern('(?=.*[0-9])'), // At least one number
      // Validators.pattern('(?=.*[!@#$%^&*()_+{}|:"<>?~`\-=[\]\\])'), // At least one special character
      Validators.minLength(8),
      Validators.required,
    ]),
  });

  authService = inject(AuthService);
  message?: String;

  constructor() {}

  onSubmit() {
    const { username, password } = this.signupForm.value;
    if (username && password) {
      this.authService.signup(username, password).subscribe({
        next: (resp) => {
          this.message = resp.message || undefined;
          console.log(resp.data?.username);
        },
        error: (err) => {
          this.message = err;
          logger.error(err, 'Signup submit error');
        },
      });
    }
  }
}

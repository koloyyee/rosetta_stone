import { CurrentUser } from '@/app/core/models/current-user';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { logger } from '../../core/utils/helper';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  standalone: true,
  template: `
    <div
      class="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100"
    >
      <form
        class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6"
        [formGroup]="loginForm"
        (ngSubmit)="onSubmit()"
      >
        <h2 class="text-3xl font-bold text-amber-700 mb-2 text-center">
          Sign In
        </h2>
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input
            matInput
            type="email"
            formControlName="username"
            autocomplete="username"
            class="rounded-lg"
          />
          @if (loginForm.get('username')?.hasError('required') &&
          loginForm.get('username')?.touched) {
          <mat-error>Email is required</mat-error>
          } @if (loginForm.get('username')?.hasError('email') &&
          loginForm.get('username')?.touched) {
          <mat-error>Please enter a valid email address</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Password</mat-label>
          <input
            matInput
            type="password"
            formControlName="password"
            autocomplete="current-password"
            class="rounded-lg"
          />
          @if (loginForm.get('password')?.hasError('required') &&
          loginForm.get('password')?.touched) {
          <mat-error>Password is <strong>required</strong></mat-error>
          }
        </mat-form-field>

        <button
          mat-raised-button
          color="primary"
          class="w-full py-2 text-lg font-semibold bg-amber-500 hover:bg-amber-600 transition"
          [disabled]="loginForm.invalid"
        >
          Login
        </button>
        <button
          mat-stroked-button
          color="warn"
          type="reset"
          class="w-full"
          (click)="loginForm.reset()"
        >
          Clear
        </button>
        @if (loginResult) {
        <div class="text-green-700 text-center font-medium">
          Welcome back! {{ loginResult.username }}
        </div>

        } @if (errorMessage) {
        <div class="text-red-600 text-center font-medium">
          {{ errorMessage }}
        </div>

        }

        <a href="/signup" class="self-center hover:text-orange-700"
          >No Account? Come Sign Up!</a
        >
      </form>

      <a href="/" class="self-center hover:text-orange-500">Home</a>
    </div>
  `,
})
export class LoginComponent {
  loginResult!: CurrentUser;
  errorMessage!: string | null;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  private authService = inject(AuthService);
  private isAuthenticated$ = this.authService.isAuthenticated$;
  private router = inject(Router);

  constructor() {
    this.isAuthenticated$.subscribe((value) => {
      console.log(value);
      if (value) {
        this.router.navigate(['/rooms']);
      } else {
        logger.info('not authed');
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username!, password!).subscribe({
        next: (data) => {
          this.loginResult = data;
          this.errorMessage = null;
          logger.info(data);
        },
        error: (error) => {
          this.errorMessage = error ?? '';
          logger.error(error);
        },
      });
    }
  }
}

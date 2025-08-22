import { CurrentUser } from '@/app/core/models/current-user';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/services/auth.service';
import { logger } from '../core/utils/helper';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  standalone: true,
  template: `
    <form
    class="flex space-x-2 gap-5"
    [formGroup]="loginForm"
    (ngSubmit)="onSubmit()"
    >
    <mat-form-field>
      <mat-label>Email</mat-label>
      <input
      matInput
      class="border border-amber-600 rounded-lg"
      type="email" formControlName="username">
    </mat-form-field>

    <mat-form-field>
      <mat-label>Password</mat-label>
      <input matInput
      class="border border-amber-600 rounded-lg"
      type="password" formControlName="password"
      >
    </mat-form-field>

      <button mat-raised-button class="border border-blue-400 rounded-lg px-3 py-1 hover:cursor-pointer"> Login </button>
      <button mat-flat-button ="reset" class="border border-pink-400 rounded-lg px-3 py-1 hover:cursor-pointer"> Clear </button>
    @if(loginResult) {
      Welcome back! {{ loginResult.username }}
    }
    @if(errorMessage) {
      {{ errorMessage }}
    }
    </form>
  `,
})
export class LoginComponent {

  loginResult!: CurrentUser;
  errorMessage!: string | null;

  loginForm = new FormGroup({
    username: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required),
  })

  private isAuthenticated$ = inject(AuthService).isAuthenticated$;
  private router = inject(Router);

  constructor(private readonly authService: AuthService) {
    this.isAuthenticated$.subscribe( value => {
      if(value) {
        this.router.navigate(["/"]);
      }
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username!, password!)
        .subscribe({
          next: data => {
            this.loginResult = data
            this.errorMessage = null;
            logger.info(data)
          },
          error: error => {
            this.errorMessage = error ?? "";
            logger.error(error)
          }
        })
    }
  }

}

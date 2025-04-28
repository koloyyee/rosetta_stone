import { CurrentUser } from '@/shared/models/current-user';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe],
  standalone: true,
  template: `
    <form
    class="flex space-x-2 gap-5"
    [formGroup]="loginForm"
    (ngSubmit)="onSubmit()"
    >
      <input
      class="border border-amber-600 rounded-lg"
      type="email" formControlName="username">
      <input
      class="border border-amber-600 rounded-lg"
      type="password" formControlName="password"
      >
      <button class="border border-blue-400 rounded-lg px-3 py-1 hover:cursor-pointer"> Login </button>
      <button type="reset" class="border border-pink-400 rounded-lg px-3 py-1 hover:cursor-pointer"> Clear </button>
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

  // loginResult$!: Observable<CurrentUser>;
  loginResult!: CurrentUser;
  errorMessage!: string | null;

  loginForm = new FormGroup({
    username: new FormControl("", [Validators.required, Validators.maxLength(10)]),
    password: new FormControl("", Validators.required),
  })

  constructor(private readonly authService: AuthService) {

  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login(username!, password!)
        .subscribe({
          next: data => {
            this.loginResult = data
            this.errorMessage = null;
          },
          error: error => {
            this.errorMessage = error ?? "";
          }
        })
    }
  }

}
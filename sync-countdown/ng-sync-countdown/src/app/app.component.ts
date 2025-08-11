import { CurrentUser } from '@/shared/models/current-user';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './core/auth/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, MatButtonModule, AsyncPipe, MatToolbarModule, MatButtonModule, MatIconModule ],

  // templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `
  <main>
    <mat-toolbar class="flex m-10">
      <section class="logo">

      <section class="nav-main mx-auto">
        <a [routerLink]="['/']">
          <button mat-raised-button>
          Home
          </button>
        </a>
      </section>
      </section>

      <section class="nav-main mx-auto">
        <a [routerLink]="['/rooms']">
          <button mat-raised-button>
            Rooms
          </button>
        </a>
      </section>

      <section class="nav-auth ml-auto flex gap-5">
        @if(isAuthenticated$ | async) {
          <button mat-stroked-button (click)="logout()"> Logout </button>
        } @else {
            <a [routerLink]="['/login']">
              <button mat-raised-button>
                Login
              </button>
            </a>

          <a mat-raised-button [routerLink]="['/signup']">
            Sign Up
          </a>
        }
      </section>
    </mat-toolbar>
      <router-outlet></router-outlet>
  </main>
  `,
})
export class AppComponent {
  title = 'ng-sync-countdown'

  authService: AuthService = inject(AuthService);
  // NOTE: using reactive programming to update this current user.
  currentUser$!: Observable<CurrentUser | undefined | null>;
  // isAuthenticated: boolean = inject(AuthService).isAuthenticated;
  isAuthenticated$ = inject(AuthService).isAuthenticated$ ;

  constructor() {
  }

  logout() {
    this.authService.logout();
  }

}

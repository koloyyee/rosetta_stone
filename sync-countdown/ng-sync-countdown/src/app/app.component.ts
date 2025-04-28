import { CurrentUser } from '@/shared/models/current-user';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './core/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, AsyncPipe],
  // templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `
  <main>
    <nav class="flex m-10">
      <section class="logo">
        <a [routerLink]="['/']">Home </a>
      </section>

      <section class="nav-main mx-auto">
        <a [routerLink]="['/rooms']"> Rooms </a>
      </section>

      <section class="nav-auth ml-auto flex gap-5">
        @if(currentUser$ | async ) {
          <button (click)="logout()"> Logout </button>
        } @else {
          <a [routerLink]="['/login']">Login</a>
          <a [routerLink]="['/signup']">Sign Up</a>
        }
      </section>

    </nav>

      <router-outlet></router-outlet>
  </main>
  `,
})
export class AppComponent {
  title = 'ng-sync-countdown'

  authService: AuthService = inject(AuthService);
  // NOTE: using reactive programming to update this current user.
  currentUser$!: Observable<CurrentUser | null>;

  constructor() {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
  }

}

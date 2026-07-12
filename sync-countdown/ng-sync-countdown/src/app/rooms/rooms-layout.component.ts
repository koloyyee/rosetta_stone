import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import type { Observable } from 'rxjs';
import { AuthService } from '../core/auth/services/auth.service';
import type { CurrentUser } from '../core/models/current-user';
import { logger } from '../core/utils/helper';

@Component({
  selector: 'app-rooms-page',
    imports: [
    RouterModule,
    CommonModule,
    AsyncPipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <main>
      <mat-toolbar class="flex m-10">
        <section class="logo">
          <section class="nav-main mx-auto">
            <a [routerLink]="['/']">
              <button mat-raised-button>Home</button>
            </a>
          </section>
        </section>

        <section class="nav-main mx-auto">
          <a [routerLink]="['/rooms']">
            <button mat-raised-button>Rooms</button>
          </a>
        </section>

        <section class="nav-auth ml-auto flex gap-5">
          @if(isAuthenticated$ | async) {
          <button mat-stroked-button (click)="logout()">Logout</button>
          } @else {
          <a [routerLink]="['/login']">
            <button mat-raised-button>Login</button>
          </a>

          <a mat-raised-button [routerLink]="['/signup']"> Sign Up </a>
          }
        </section>
      </mat-toolbar>
      <router-outlet></router-outlet>
    </main>
  `
})
export class RoomsLayoutComponent {

  // NOTE: using reactive programming to update this current user.
  currentUser$!: Observable<CurrentUser | undefined | null>;
  // isAuthenticated: boolean = inject(AuthService).isAuthenticated;
  private authService = inject(AuthService);
  isAuthenticated$ = this.authService.isAuthenticated$;
  private router = inject(Router);

  constructor() {
    this.isAuthenticated$.subscribe((value) => {
      if (value) {
        this.router.navigate(['/rooms']);
      } else {
        logger.info('not authed');
      }
    });
  }
    logout() {
    this.authService.logout();
  }
}

import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [
    MatButtonModule,
    RouterModule,
    CommonModule,
    MatButtonModule,
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

        <section class="nav-auth ml-auto flex gap-5">
          <a [routerLink]="['/login']">
            <button mat-raised-button>Login</button>
          </a>
        </section>
      </mat-toolbar>

      <div
        class="max-w-xl  mx-auto mt-16 p-8 bg-yellow-50 rounded-xl shadow-lg text-center"
      >
        <h1 class="text-4xl font-bold mb-4 text-amber-700">
          Welcome to Sync Countdown!
        </h1>
        <p class="mb-6 text-lg text-amber-900">
          Create or join a <strong>virtual room</strong> and synchronize your
          countdown timer with friends, colleagues, or teammates.
        </p>
        <div class="features mb-8">
          <h2 class="text-2xl font-semibold mb-2 text-amber-800">Features</h2>
          <ul class="space-y-2 text-amber-900">
            <li>🕒 Real-time synchronized countdowns</li>
            <li>🔗 Share room links for easy collaboration</li>
            <li>🔒 Private and secure virtual rooms</li>
            <li>🎉 Perfect for online events, study sessions, and more!</li>
          </ul>
        </div>
        <div class="flex justify-center gap-4">
          <a
            mat-raised-button
            color="primary"
            routerLink="/signup"
            class="!bg-amber-500 !text-white hover:!bg-amber-600 transition"
          >
            Get Started
          </a>
          <a
            mat-stroked-button
            color="primary"
            routerLink="/rooms"
            class="!border-amber-500 !text-amber-700 hover:!bg-amber-100 transition"
          >
            Browse Rooms
          </a>
        </div>
      </div>
    </main>
  `,
})
export class HomepageComponent {}

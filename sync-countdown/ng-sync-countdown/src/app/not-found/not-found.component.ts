import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [MatButtonModule, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
      <h1 class="text-8xl font-bold text-amber-700 mb-4">404</h1>
      <p class="text-xl text-amber-900 mb-8">Page not found</p>
      <p class="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <a mat-raised-button color="primary" routerLink="/">Go Home</a>
    </div>
  `,
})
export class NotFoundComponent {}

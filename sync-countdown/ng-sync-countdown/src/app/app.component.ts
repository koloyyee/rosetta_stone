import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-root',
  imports: [ CommonModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ng-sync-countdown'

  authService: AuthService = inject(AuthService);

  constructor(){
    this.authService.login();
  }
}

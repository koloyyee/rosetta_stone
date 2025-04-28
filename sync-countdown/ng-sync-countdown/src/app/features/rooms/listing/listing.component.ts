import { AuthService } from '@/app/core/auth/services/auth.service';
import { CurrentUser } from '@/shared/models/current-user';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-listing',
  imports: [],
  // templateUrl: './listing.component.html',
  styleUrl: './listing.component.css',
  template: `
  @if(currentUser) {
    {{ currentUser }}
  }
  `,
})
export class ListingComponent implements OnInit {

  private authService = inject(AuthService);
  currentUser!: CurrentUser;

  constructor() {
  }

  ngOnInit(): void {
    this.authService.currentUser$
      .subscribe(user => {
        console.log(user)
        if (user) {
          this.currentUser = user;
        }
      })
  }


}

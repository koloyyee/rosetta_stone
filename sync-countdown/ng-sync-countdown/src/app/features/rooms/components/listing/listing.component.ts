import { AuthService } from '@/app/core/auth/services/auth.service';
import { CurrentUser } from '@/shared/models/current-user';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../../models/room';
import { RoomsService } from '../../services/rooms.service';
import { RoomPreviewComponent } from '../room-preview/room-preview.component';

@Component({
  selector: 'app-listing',
  imports: [CommonModule, RoomPreviewComponent],
  // templateUrl: './listing.component.html',
  styleUrl: './listing.component.css',
  template: `

  @for( room of rooms; track room.id) {
    <app-room-preview [room]="room" ></app-room-preview>
  }
  `,
})
export class ListingComponent implements OnInit {

  roomsService = inject(RoomsService);
  currentUser$: Observable<CurrentUser | null> = inject(AuthService).currentUser$;
  rooms:Room[] = [];

  constructor() {
    this.currentUser$.subscribe( user => console.log(user));
  }

  ngOnInit(): void {
    this.roomsService.findAll()
    .subscribe( {
      next: (resp => {
        console.log(resp);
        this.rooms = resp;
      }),
      error: (err) => console.log(err)
    })
  }

  createNewRoom() {
    // this.roomsService.save(room);
  }
}


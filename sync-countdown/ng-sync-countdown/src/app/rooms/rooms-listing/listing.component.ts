import { AuthService } from '@/app/core/auth/services/auth.service';
import { NewRoomDialogComponent } from '@/app/rooms/new-room-dialog/new-room-dialog.component';
import { RoomPreviewComponent } from '@/app/rooms/room-preview/room-preview.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import type { Room } from '../models/room';
import { RoomsService } from '../services/rooms.service';

@Component({
  selector: 'app-listing',
  imports: [CommonModule, AsyncPipe, RoomPreviewComponent, MatListModule, MatButtonModule, MatIconModule, MatDialogModule],
  // styleUrl: './listing.component.css',
  styles: `
  `,
  template: `
  <div class=" flex flex-col m-20">
     @if(isAdmin$ | async) {
     <button mat-fab (click)="openDialog()" class="mt-auto ml-auto">
         <mat-icon>add</mat-icon>
     </button>
     }
  <h1 class="text-xl border-b-blue-200 border-b-8 w-1/3"> Find your Room! </h1>
  <mat-list role="list">
     @for( room of rooms; track room.id) {
       <mat-list-item role="list-item" class="border-b-2 border-slate-400 my-5 hover:shadow-md ">
         <app-room-preview [room]="room" ></app-room-preview>
       </mat-list-item>
     }
  </mat-list>
  </div>
  `,
})
export class ListingComponent implements OnInit {

  roomsService = inject(RoomsService);
  isAdmin$ = inject(AuthService).isAdmin$;

  rooms: Room[] = [];
  readonly dialog = inject(MatDialog)

  constructor() {
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewRoomDialogComponent);
    dialogRef.afterClosed().subscribe((newRoom: Room | undefined) => {
      if (newRoom) {
        this.rooms.push(newRoom);
      }
    });
  }

  ngOnInit(): void {
    this.roomsService.findAll()
      .subscribe({
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


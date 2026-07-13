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
  template: `
  <div class="flex flex-col p-8 max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-amber-800">Browse Rooms</h1>
      @if(isAdmin$ | async) {
        <button mat-fab color="primary" (click)="openDialog()"
                class="!bg-amber-500 hover:!bg-amber-600"
                aria-label="Create new room">
          <mat-icon>add</mat-icon>
        </button>
      }
    </div>

    @if(rooms.length === 0) {
      <div class="text-center py-16 text-gray-500">
        <mat-icon class="text-6xl !w-16 !h-16 mb-4">meeting_room</mat-icon>
        <p class="text-xl">No rooms yet</p>
        <p class="mt-2">Create the first room to get started</p>
      </div>
    }

    <mat-list role="list">
      @for(room of rooms; track room.id) {
        <mat-list-item role="listitem"
          class="mb-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow
                 !bg-white overflow-hidden !h-auto !min-h-0 !p-0">
          <app-room-preview [room]="room" />
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

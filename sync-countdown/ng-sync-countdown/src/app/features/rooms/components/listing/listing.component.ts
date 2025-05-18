import { AuthService } from '@/app/core/auth/services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Room } from '../../models/room';
import { RoomsService } from '../../services/rooms.service';
import { RoomPreviewComponent } from '../room-preview/room-preview.component';
import { NewRoomDialogComponent } from './new-room-dialog/new-room-dialog.component';

@Component({
  selector: 'app-listing',
  imports: [CommonModule, AsyncPipe,  RoomPreviewComponent, MatListModule, MatButtonModule, MatIconModule, MatDialogModule],
  styleUrl: './listing.component.css',
  template: `
  @if(isAdmin$ | async) {
  <button mat-fab (click)="openDialog()">
      <mat-icon>add</mat-icon>
  </button>
  }
  <mat-list role="list">
  @for( room of rooms; track room.id) {
    <mat-list-item role="list-item">
      <app-room-preview [room]="room" ></app-room-preview>
    </mat-list-item>
  }
  </mat-list>
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

    console.log("isAdmin: " , this.isAdmin$)

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


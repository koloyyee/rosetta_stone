import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Room } from '../room/room';

@Component({
  selector: 'app-room-preview',
  imports: [RouterModule, MatListModule],
  // templateUrl: './room-preview.component.html',
  template: `
  <div>
    <a [routerLink] ="[ '/rooms', room.id]" >
    <span matListItemTitle>{{ room.name }}</span>
    <span matListItemLine>{{ room.startTime ? "occupied" : "empty"}}</span>
  </a>
  </div>
  `,
  styleUrl: './room-preview.component.css'
})
export class RoomPreviewComponent {
  @Input() room!: Room;

}

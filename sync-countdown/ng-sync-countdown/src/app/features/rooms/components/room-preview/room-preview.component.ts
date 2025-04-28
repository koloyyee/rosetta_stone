import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Room } from '../../models/room';

@Component({
  selector: 'app-room-preview',
  imports: [RouterModule],
  // templateUrl: './room-preview.component.html',
  template: `

  <div class="border border-slate-400 shadow rounded-2xl">
    <a [routerLink] ="[ '/rooms', room.name ]" >
   {{ room.name }}
   {{ room.startTime ? "occupied" : "empty"}}
</a>
  </div>
  `,
  styleUrl: './room-preview.component.css'
})
export class RoomPreviewComponent {
  @Input() room!: Room;

}

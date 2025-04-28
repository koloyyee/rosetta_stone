import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Room } from '../../models/room';
import { RoomsService } from '../../services/rooms.service';

@Component({
  selector: 'app-room',
  imports: [CommonModule, RouterModule, JsonPipe],
  // templateUrl: './room.component.html',
  styleUrl: './room.component.css',
  template: `
  <pre> {{ room | json  }} </pre>
  `,
})
export class RoomComponent implements OnInit{

  room!: Room;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly roomService: RoomsService,
    private readonly router: Router,
  ) {

  }

  ngOnInit(): void {
    const roomName = this.route.snapshot.params["name"];
    this.roomService.findByName(roomName)
    .subscribe( {
      next: (room) => {
        if(room) {
          this.room = room;
        }
      },
      error: (err) => {
        if(err) {
          this.router.navigate(["/"]);
        }
      }
    })
  }


}

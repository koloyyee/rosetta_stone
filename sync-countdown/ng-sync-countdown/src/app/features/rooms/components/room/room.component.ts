import { CommonModule, JsonPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RxStomp } from "@stomp/rx-stomp";
import { Subscription } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Room } from '../../models/room';
import { RoomsService } from '../../services/rooms.service';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-room',
  imports: [CommonModule, RouterModule, JsonPipe],
  // templateUrl: './room.component.html',
  styleUrl: './room.component.css',
  template: `
  <button (click)="start()"> START</button>
  <pre> {{ room | json  }} </pre>
  `,
})
export class RoomComponent implements OnInit, OnDestroy {

  room!: Room;
  webSocketSubject$!: WebSocketSubject<unknown>;
  rxStomp = new RxStomp();
  subscription!: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly roomService: RoomsService,
    private readonly webSocketService: WebSocketService,
    private readonly router: Router,
  ) {
  }

  connect() {
    const WS_CONN = "ws://localhost:8080/timer"
    console.log("connecting to " + WS_CONN)
    this.rxStomp.configure({
      brokerURL: WS_CONN,
    })
    this.rxStomp.activate();
    this.subscription = this.rxStomp
      .watch({ destination: "/topic/timer" })
      .subscribe(msg => console.log(msg.body))

  }

  start() {
    this.rxStomp.publish({
      destination: "/app/timer/start",
      body: JSON.stringify({ action: "start" })
    })
  }

  async end() {
    this.subscription.unsubscribe();
    await this.rxStomp.deactivate();
  }

  ngOnInit(): void {
    const roomId = this.route.snapshot.params["id"];
    this.roomService.findById(roomId)
      .subscribe({
        next: (room) => {
          if (room) {
            this.room = room;
            this.connect();
            // const subject = this.webSocketService.connectToRoom(room.id!)
            // if (subject) {
            // this.webSocketSubject$ = subject;
            // this.webSocketSubject$.next({ action: "join", roomId: room.id });

            // }
          }
        },
        error: (err) => {
          if (err) {
            this.router.navigate(["/"]);
          }
        }
      })
  }

  ngOnDestroy(): void {
    const roomId = this.route.snapshot.params["id"];
    this.webSocketService.disconnectFromRoom(roomId);
    (async () => {
      console.log("disconnecting.");
      await this.end()
    })();
  }

}

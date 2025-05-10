import { AuthService } from '@/app/core/auth/services/auth.service';
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
  // styleUrl: './room.component.css',
  styles: [`button { border: 2px block solid; padding: 3rem; }`],
  template: `
  <h1> Remaining Time {{ formattedTime }} </h1>
  <button (click)="start()"> START</button>
  <button (click)="resume()"> RESUME </button>
  <button (click)="pause()"> PAUSE </button>
  <button (click)="requestRemaining()"> requestRemaining </button>
  <pre> {{ room | json  }} </pre>
  `,
})
export class RoomComponent implements OnInit, OnDestroy {

  room!: Room;
  webSocketSubject$!: WebSocketSubject<unknown>;
  rxStomp = new RxStomp();
  subscription!: Subscription;
  token: string | null;
  remainingTime: number;
  formattedTime: string = "00:00:00";

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly roomService: RoomsService,
    private readonly webSocketService: WebSocketService,
    private readonly router: Router,
  ) {
    this.token = authService.getAuthToken();
    this.remainingTime = 0;
  }

  connect() {
    const WS_CONN = "ws://localhost:8080/timer"
    if (this.token) {
      this.rxStomp.configure({
        brokerURL: WS_CONN,
        connectHeaders: {
          login: "guest",
          passcode: "guest",
          host: "host",
          Authorization: `${this.token}`
        },
      })
      this.rxStomp.activate();
      console.log('Subscribing to topic: /topic/timer/remaining/' + this.room.id);

      this.subscription = this.rxStomp
        .watch({ destination: "/topic/timer/status/" + this.room.id })
        .subscribe({
          next: msg => {
            console.log(msg)
            const payload = JSON.parse(msg.body);
            const room = payload.body;
            this.room = room;
            this.requestRemaining();
          },
          error: err => console.error('WebSocket error:', err),
          complete: () => console.log('WebSocket connection closed')
        });

      // Subscribe to Remaining Time
      this.subscription = this.rxStomp
        .watch({ destination: "/topic/timer/remaining/" + this.room.id })
        .subscribe({
          next: msg => {
            const payload = JSON.parse(msg.body);
            console.log('Received message:', payload);
            console.log({ payload })
            this.room.state = payload.state;
            this.remainingTime = payload.remaining;
            this.updateTimerDisplay();
          },
          error: err => console.error('WebSocket error:', err),
          complete: () => console.log('WebSocket connection closed')
        });
      console.log('Subscription complete');
    }
    this.requestRemaining();
    this.startLocalTimer();

  }

  start() {
    this.rxStomp.publish({
      destination: `/app/timer.startTimer/${this.room.id}`,
      body: JSON.stringify({
        roomId: this.room.id,
        action: "start",
        duration: 120,
      })
    })

  }

  resume() {

    this.rxStomp.publish({
      destination: `/app/timer.resumeTimer/${this.room.id}`,
      body: JSON.stringify({
        roomId: this.room.id,
        action: "resume",
      })
    })
  }

  pause() {
    this.rxStomp.publish({
      destination: `/app/timer.pauseTimer/${this.room.id}`,
      body: JSON.stringify({
        roomId: this.room.id,
        action: "pause",
      })
    })

  }

  requestRemaining() {
    this.rxStomp.publish({
      destination: `/app/timer.remainingTime/${this.room.id}`,
    })
  }

updateTimerDisplay() {
  // Calculate hours, minutes, seconds
  const hours = Math.floor(this.remainingTime / 3600);
  const minutes = Math.floor((this.remainingTime % 3600) / 60);
  const seconds = this.remainingTime % 60;

  // Format with leading zeros
  this.formattedTime =
    (hours > 0 ? `${hours}:` : '') +
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0').substring(0,2)}`;
}

  localTimerInterval: any;

  startLocalTimer() {
    this.stopLocalTimer();

    this.localTimerInterval = setInterval(() => {
      if (this.room.state === "RUNNING" && this.remainingTime > 0) {
        console.log(this.remainingTime)
        this.remainingTime -= 0.1;
        this.updateTimerDisplay();
      }
    }, 100)
  }

  stopLocalTimer() {
    if (this.localTimerInterval) {
      clearInterval(this.localTimerInterval);
    }
  }

  async end() {
    this.subscription.unsubscribe();
    this.stopLocalTimer();
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

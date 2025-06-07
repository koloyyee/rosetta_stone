import { AuthService } from '@/app/core/auth/services/auth.service';
import { HasRoleDirective } from '@/app/core/auth/services/has-role.directive';
import { logger } from '@/shared/utils/helper';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RxStomp } from '@stomp/rx-stomp';
import { Subscription } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Room } from './room';
import { RoomsService } from '../../services/rooms.service';
import { WebSocketService } from '../../services/websocket.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    HasRoleDirective,
    AsyncPipe,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
  // templateUrl: './room.component.html',
  // styleUrl: './room.component.css',
  // styles: [`button { border: 2px block solid; padding: 3rem; }`],
  template: `
    <h1>Remaining Time {{ formattedTime }}</h1>
    <!-- @if(isAdmin$ | async) { -->
    <div *hasRole="'ROLE_ADMIN'">
      <mat-form-field class="example-form-field">
        <mat-label>Set Minutes </mat-label>
        <input
          matInput
          type="number"
          [(ngModel)]="minutesInput"
          (input)="convertDuration($event)"
          [disabled]="room.state !== 'STOPPED' || !room.state"
        />
        @if (minutesInput) {
        <button
          matSuffix
          matIconButton
          aria-label="Clear"
          (click)="minutesInput = 0"
          [disabled]="room.state !== 'STOPPED' || !room.state"
        >
          <mat-icon>close</mat-icon>
        </button>
        }
      </mat-form-field>

      @if(room) { @if(room.state === "STOPPED" || !room.state) {
      <button mat-flat-button class="bg-red-500" (click)="start()" [disabled]="duration == 0">
        START
      </button>
      } @else if (room.state === "PAUSED") {
      <button mat-flat-button (click)="resume()">RESUME</button>
      } @else if (room.state === "RUNNING") {
      <button mat-flat-button (click)="pause()">PAUSE</button>
      <button mat-flat-button (click)="stop()">STOP</button>
      } }

      <!-- Modal to set duration. -->
    </div>

    <!-- } -->
    <!-- <pre> {{ room | json  }} </pre> -->
  `,
})
export class RoomComponent implements OnInit, OnDestroy {
  room!: Room;
  isAdmin$ = inject(AuthService).isAdmin$;

  webSocketSubject$!: WebSocketSubject<unknown>;
  rxStomp = new RxStomp();
  subscription!: Subscription;
  token: string | null;
  remainingTime: number;
  formattedTime: string = '00:00';

  minutesInput: number = 0;
  duration: number = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly roomService: RoomsService,
    private readonly webSocketService: WebSocketService,
    private readonly router: Router
  ) {
    this.token = authService.getAuthToken();
    this.remainingTime = 0;
  }

  connect() {
    const WS_CONN = 'ws://localhost:8080/timer';
    if (this.token) {
      this.rxStomp.configure({
        brokerURL: WS_CONN,
        connectHeaders: {
          login: 'guest',
          passcode: 'guest',
          host: 'host',
          Authorization: `${this.token}`,
        },
      });
      this.rxStomp.activate();

      this.subscription = this.rxStomp
        .watch({ destination: '/topic/timer/status/' + this.room.id })
        .subscribe({
          next: (msg) => {
            const payload = JSON.parse(msg.body);
            logger(payload.body, { level: 'info' });
            const room = payload.body;
            this.room = room;
            this.requestRemaining();

            logger('Connection complete');
          },
          error: (err) => logger('WebSocket error:' + err, { level: 'error' }),
          complete: () => logger('WebSocket connection closed'),
        });

      // Subscribe to Remaining Time
      this.subscription = this.rxStomp
        .watch({ destination: '/topic/timer/remaining/' + this.room.id })
        .subscribe({
          next: (msg) => {
            const payload = JSON.parse(msg.body);
            this.room.state = payload.state;
            this.remainingTime = payload.remaining;
            this.updateTimerDisplay();
          },
          error: (err) => logger('WebSocket error:' + err, { level: 'error' }),
          complete: () => logger('WebSocket connection closed'),
        });
      logger('Subscription complete');
    }
  }

  start() {
    this.rxStomp.publish({
      destination: `/app/timer.startTimer/${this.room.id}`,
      body: JSON.stringify({
        roomId: this.room.id,
        action: 'start',
        duration: this.duration,
      }),
    });
  }

  resume() {
    this.rxStomp.publish({
      destination: `/app/timer.resumeTimer/${this.room.id}`,
      body: JSON.stringify({
        roomId: this.room.id,
        action: 'resume',
      }),
    });
  }

  pause() {
    this.rxStomp.publish({
      destination: `/app/timer.pauseTimer/${this.room.id}`,
      body: JSON.stringify({
        roomId: this.room.id,
        action: 'pause',
      }),
    });
  }

  stop() {
    this.rxStomp.publish({
      destination: `/app/timer.stopTimer/${this.room.id}`,
      body: JSON.stringify({
        roomId: this.room.id,
        action: 'stop',
        duration: this.duration,
      }),
    });
    this.formattedTime = '00:00';
  }

  requestRemaining() {
    this.rxStomp.publish({
      destination: `/app/timer.remainingTime/${this.room.id}`,
    });
  }

  updateTimerDisplay() {
    // Calculate hours, minutes, seconds
    const hours = Math.floor(this.remainingTime / 3600);
    const minutes = Math.floor((this.remainingTime % 3600) / 60);
    const seconds = this.remainingTime % 60;

    // Format with leading zeros
    this.formattedTime =
      (hours > 0 ? `${hours}:` : '') +
      `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')
        .substring(0, 5)}`;
  }

  localTimerInterval: any;

  startLocalTimer() {
    this.stopLocalTimer();

    this.localTimerInterval = setInterval(() => {
      if (this.room.state === 'RUNNING' && this.remainingTime > 0) {
        this.remainingTime -= 0.1;
        this.updateTimerDisplay();
      }
    }, 100);
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

  convertDuration(event: Event) {
    const minutes = parseInt((event.target as HTMLInputElement)?.value);
    if (!isNaN(minutes)) {
      const seconds = minutes * 60
      console.log({ seconds });
      this.duration = seconds;
    } else {
      this.duration = 0;
    }
  }

  ngOnInit(): void {
    const roomId = this.route.snapshot.params['id'];
    this.roomService.findById(roomId).subscribe({
      next: (room) => {
        if (room) {
          this.room = room;
          this.connect();
          this.requestRemaining();
          this.startLocalTimer();
        }
      },
    });
  }

  ngOnDestroy(): void {
    const roomId = this.route.snapshot.params['id'];
    this.webSocketService.disconnectFromRoom(roomId);
    (async () => {
      logger('disconnecting.');
      await this.end();
    })();
  }
}

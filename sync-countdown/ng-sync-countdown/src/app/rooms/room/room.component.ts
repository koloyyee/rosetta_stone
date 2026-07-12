import { AuthService } from '@/app/core/auth/services/auth.service';
import { HasRoleDirective } from '@/app/core/auth/services/has-role.directive';
import { logger } from '@/app/core/utils/helper';
import { RoomsService } from '@/app/rooms/services/rooms.service';
import { WebSocketService } from '@/app/rooms/services/websocket.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RxStomp } from '@stomp/rx-stomp';
import { Subscription } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import type { Room } from '../models/room';

@Component({
  selector: 'app-room',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    HasRoleDirective,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-8">
      <div class="max-w-lg mx-auto">
        <div class="flex items-center mb-6">
          <button mat-icon-button routerLink="/rooms" class="mr-2">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1 class="text-2xl font-bold text-amber-800">{{ room?.name }}</h1>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8 text-center mb-6">
          <!-- Timer Display -->
          <div class="text-7xl font-mono font-bold text-amber-700 mb-4 tracking-wider">
            {{ formattedTime }}
          </div>

          @if(room?.state === 'RUNNING') {
            <div class="flex justify-center gap-1 mb-4">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span class="text-sm text-green-600 font-medium">Running</span>
            </div>
          } @else if(room?.state === 'PAUSED') {
            <div class="text-sm text-amber-600 font-medium mb-4">Paused</div>
          } @else {
            <div class="text-sm text-gray-500 mb-4">Stopped</div>
          }

          <!-- Admin Controls -->
          <div *hasRole="'ROLE_ADMIN'" class="mt-6 border-t pt-6">
            <div class="flex items-center justify-center gap-2 mb-4">
              <mat-form-field class="!w-32" subscriptSizing="dynamic">
                <mat-label>Minutes</mat-label>
                <input matInput type="number" [(ngModel)]="minutesInput"
                       (input)="convertDuration($event)" min="0"
                       [disabled]="room.state && room.state !== 'STOPPED' && room.state !== 'PAUSED'" />
              </mat-form-field>

              @if(room.state === 'STOPPED' || !room.state) {
                <button mat-fab color="primary" (click)="start()" [disabled]="duration === 0"
                        class="!bg-green-500 hover:!bg-green-600">
                  <mat-icon>play_arrow</mat-icon>
                </button>
              } @else if(room.state === 'PAUSED') {
                <button mat-fab color="primary" (click)="resume()"
                        class="!bg-green-500 hover:!bg-green-600">
                  <mat-icon>play_arrow</mat-icon>
                </button>
              } @else if(room.state === 'RUNNING') {
                <button mat-fab color="warn" (click)="pause()"
                        class="!bg-amber-500 hover:!bg-amber-600">
                  <mat-icon>pause</mat-icon>
                </button>
                <button mat-fab (click)="stop()" class="!bg-red-500 hover:!bg-red-600 !ml-2">
                  <mat-icon>stop</mat-icon>
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
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
      logger.info('disconnecting.');
      await this.end();
    })();
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
            logger.info(payload.body);
            const room = payload.body;
            this.room = room;
            this.requestRemaining();

            logger.info('Connection complete');
          },
          error: (err) => logger.error(err, 'WebSocket error:'),
          complete: () => logger.info('WebSocket connection closed'),
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
          error: (err) => logger.error(err, 'WebSocket error:'),
          complete: () => logger.info('WebSocket connection closed'),
        });
      logger.info('Subscription complete');
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
    const safeTime = Math.max(0, this.remainingTime);
    // Calculate hours, minutes, seconds
    const hours = Math.floor(safeTime / 3600);
    const minutes = Math.floor((safeTime % 3600) / 60);
    const seconds = safeTime % 60;

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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.stopLocalTimer();
    await this.rxStomp.deactivate();
  }

  convertDuration(event: Event) {
    const minutes = parseInt((event.target as HTMLInputElement)?.value);
    if (!isNaN(minutes)) {
      const seconds = minutes * 60;
      console.log({ seconds });
      this.duration = seconds + 2; // + 2 to offset
    } else {
      this.duration = 0;
    }
  }
}

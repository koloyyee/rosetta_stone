import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import type { Room } from '../models/room';

@Component({
  selector: 'app-room-preview',
  imports: [RouterModule, CommonModule, MatIconModule],
  template: `
  <div class="p-4 flex items-center justify-between" [routerLink]="['/rooms', room.id]">
    <div class="flex flex-col">
      <span class="text-lg font-semibold text-gray-800">{{ room.name }}</span>
      <span class="text-sm text-gray-500">
        @if(room.startTime) {
          {{ room.state === 'RUNNING' ? 'In Progress' : room.state === 'PAUSED' ? 'Paused' : 'Stopped' }}
        } @else {
          Empty / Not Started
        }
      </span>
    </div>
    <div class="flex items-center gap-2">
      @if(room.state === 'RUNNING') {
        <span class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
      }
      <mat-icon class="text-gray-400">chevron_right</mat-icon>
    </div>
  </div>
  `,
  styles: `
    :host { display: block; cursor: pointer; }
  `,
})
export class RoomPreviewComponent {
  @Input() room!: Room;
}

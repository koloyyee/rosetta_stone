import { RoomsService } from '@/app/core/rooms-listing/services/rooms.service';
import { logger } from '@/shared/utils/helper';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-room-dialog',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  styleUrl: './new-room-dialog.component.scss',
  template: `

    <h2 mat-dialog-title>Create new room</h2>
      <mat-dialog-content>Create a new room countdown timer</mat-dialog-content>
      <form class="p-5 flex flex-col" [formGroup]="newRoomForm" (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label> Room Name:</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>
        <section class="btn-section flex justify-around" >
          <button mat-raised-button type="reset" class="reset-btn"> reset </button>
          <button mat-flat-button > create </button>
        </section>
      </form>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Close</button>
      </mat-dialog-actions>
  `,
})
export class NewRoomDialogComponent {


  private roomService: RoomsService = inject(RoomsService);
  readonly dialogRef = inject(MatDialogRef<NewRoomDialogComponent>);

  newRoomForm = new FormGroup({
    name: new FormControl("", [Validators.required])
  })

  onSubmit() {
    console.log(this.newRoomForm.value);
    if (this.newRoomForm.value.name) {
      this.roomService.saveRoom(this.newRoomForm.value.name)
      .subscribe({
        next: (data) => {
          this.dialogRef.close(data)
        },
        error: (error) => {
          logger(error,{ level: "error"})
        }
      })
    }
  }
}

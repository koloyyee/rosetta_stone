
import { logger } from '@/shared/utils/helper';
import { Component, EventEmitter, inject, output, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-set-duration-dialog',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  styleUrl: './set-duration-dialog.component.scss',
  template:`
     <h2 mat-dialog-title>Create new room</h2>
      <mat-dialog-content>Create a new room countdown timer</mat-dialog-content>
      <form class="p-5 flex flex-col" [formGroup]="durationForm" (ngSubmit)="onSubmit()">
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
export class SetDurationDialogComponent {

  duration = output<number>();
  readonly dialogRef = inject(MatDialogRef<SetDurationDialogComponent>);

  durationForm = new FormGroup({
    duration: new FormControl(0, [Validators.required, Validators.min(1)])
  })

  onSubmit() {
    if( this.durationForm.value.duration) {
        this.duration.emit(this.durationForm.value.duration);
    }
  }
}

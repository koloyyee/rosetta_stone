import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewRoomDialogComponent } from './new-room-dialog.component';
import { RoomsService } from '../services/rooms.service';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

describe('NewRoomDialogComponent', () => {
  let component: NewRoomDialogComponent;
  let fixture: ComponentFixture<NewRoomDialogComponent>;
  let roomsServiceSpy: jasmine.SpyObj<RoomsService>;

  beforeEach(async () => {
    roomsServiceSpy = jasmine.createSpyObj('RoomsService', ['saveRoom']);

    await TestBed.configureTestingModule({
      imports: [NewRoomDialogComponent],
      providers: [
        { provide: RoomsService, useValue: roomsServiceSpy },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid when name is empty', () => {
    expect(component.newRoomForm.valid).toBeFalse();
  });

  it('form is valid with a name', () => {
    component.newRoomForm.controls.name.setValue('My Room');
    expect(component.newRoomForm.valid).toBeTrue();
  });
});

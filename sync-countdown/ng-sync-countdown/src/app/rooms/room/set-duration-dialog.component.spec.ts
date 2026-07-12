import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetDurationDialogComponent } from './set-duration-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('SetDurationDialogComponent', () => {
  let component: SetDurationDialogComponent;
  let fixture: ComponentFixture<SetDurationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetDurationDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj('MatDialogRef', ['close']) },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetDurationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

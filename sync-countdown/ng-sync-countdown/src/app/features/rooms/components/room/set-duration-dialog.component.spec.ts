import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetDurationDialogComponent } from '../set-duration-dialog.component';

describe('SetDurationDialogComponent', () => {
  let component: SetDurationDialogComponent;
  let fixture: ComponentFixture<SetDurationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetDurationDialogComponent]
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

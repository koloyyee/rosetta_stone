import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomPreviewComponent } from './room-preview.component';
import { provideRouter } from '@angular/router';

describe('RoomPreviewComponent', () => {
  let component: RoomPreviewComponent;
  let fixture: ComponentFixture<RoomPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomPreviewComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomPreviewComponent);
    component = fixture.componentInstance;
    component.room = { id: '1', name: 'Test Room', isTimerRunning: false, state: 'STOPPED' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders room name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Room');
  });
});

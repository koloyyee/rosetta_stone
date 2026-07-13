import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomComponent } from './room.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '@/app/core/auth/services/auth.service';
import { RoomsService } from '../services/rooms.service';
import { WebSocketService } from '../services/websocket.service';
import { JwtService } from '@/app/core/auth/services/jwt.service';

describe('RoomComponent', () => {
  let component: RoomComponent;
  let fixture: ComponentFixture<RoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: 'test-room-id' } } }
        },
        { provide: AuthService, useValue: { isAdmin$: of(false), getAuthToken: () => null, currentUser$: of(null) } },
        { provide: RoomsService, useValue: { findById: () => of(null) } },
        { provide: WebSocketService, useValue: { disconnectFromRoom: () => {} } },
        { provide: JwtService, useValue: { get: () => null, hasExpired: () => true, user: () => null } },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

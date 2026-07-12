import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomsLayoutComponent } from './rooms-layout.component';
import { provideRouter } from '@angular/router';
import { AuthService } from '../core/auth/services/auth.service';
import { of } from 'rxjs';

describe('RoomsLayoutComponent', () => {
  let component: RoomsLayoutComponent;
  let fixture: ComponentFixture<RoomsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsLayoutComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            isAuthenticated$: of(false),
            logout: jasmine.createSpy('logout'),
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

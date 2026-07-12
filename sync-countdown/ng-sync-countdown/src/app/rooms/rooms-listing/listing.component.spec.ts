import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListingComponent } from './listing.component';
import { RoomsService } from '../services/rooms.service';
import { AuthService } from '@/app/core/auth/services/auth.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('ListingComponent', () => {
  let component: ListingComponent;
  let fixture: ComponentFixture<ListingComponent>;
  let roomsServiceSpy: jasmine.SpyObj<RoomsService>;

  beforeEach(async () => {
    roomsServiceSpy = jasmine.createSpyObj('RoomsService', ['findAll']);

    await TestBed.configureTestingModule({
      imports: [ListingComponent],
      providers: [
        provideHttpClient(),
        { provide: RoomsService, useValue: roomsServiceSpy },
        { provide: AuthService, useValue: { isAdmin$: of(false) } },
      ]
    })
    .compileComponents();

    roomsServiceSpy.findAll.and.returnValue(of([]));
    fixture = TestBed.createComponent(ListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

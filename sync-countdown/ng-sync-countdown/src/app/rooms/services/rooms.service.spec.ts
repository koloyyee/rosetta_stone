import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { RoomsService } from './rooms.service';

describe('RoomsService', () => {
  let service: RoomsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RoomsService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(RoomsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('findAll() returns rooms', () => {
    const mockRooms = [
      { id: '1', name: 'Room 1', isTimerRunning: false, state: 'STOPPED' },
      { id: '2', name: 'Room 2', isTimerRunning: true, state: 'RUNNING' },
    ];

    service.findAll().subscribe(rooms => {
      expect(rooms.length).toBe(2);
      expect(rooms[0].name).toBe('Room 1');
    });

    const req = httpMock.expectOne('/rooms');
    expect(req.request.method).toBe('GET');
    req.flush(mockRooms);
  });

  it('findById() returns a room', () => {
    const mockRoom = { id: '1', name: 'Test Room', isTimerRunning: false, state: 'STOPPED' };

    service.findById('1').subscribe(room => {
      expect(room?.name).toBe('Test Room');
    });

    const req = httpMock.expectOne('/rooms/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockRoom);
  });

  it('saveRoom() POSTs the room name', () => {
    const mockResponse = { id: '2', name: 'New Room', isTimerRunning: false, state: 'STOPPED' };

    service.saveRoom('New Room').subscribe(room => {
      expect(room.name).toBe('New Room');
    });

    const req = httpMock.expectOne('/rooms');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe('New Room');
    req.flush(mockResponse);
  });
});

import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';
import { JwtService } from '@/app/core/auth/services/jwt.service';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let jwtSpy: jasmine.SpyObj<JwtService>;

  beforeEach(() => {
    jwtSpy = jasmine.createSpyObj('JwtService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        WebSocketService,
        { provide: JwtService, useValue: jwtSpy },
      ]
    });
    service = TestBed.inject(WebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

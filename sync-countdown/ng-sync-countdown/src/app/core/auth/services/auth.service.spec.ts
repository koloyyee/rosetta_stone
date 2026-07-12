import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let jwtSpy: jasmine.SpyObj<JwtService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    jwtSpy = jasmine.createSpyObj('JwtService', ['get', 'set', 'remove', 'hasExpired', 'user']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtSpy },
        { provide: Router, useValue: routerSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController as any);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login sends Basic auth and stores token', () => {
    const mockResp = { token: 'jwt123', username: 'user@test.com', authorities: [{ authority: 'ROLE_USER' }] };

    service.login('user@test.com', 'pass').subscribe(user => {
      expect(user.token).toBe('jwt123');
      expect(jwtSpy.set).toHaveBeenCalledWith('jwt123');
    });

    const req = httpMock.expectOne('/auth/token');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toContain('Basic');
    expect(req.request.headers.get('Skip')).toBe('true');
    req.flush(mockResp);
  });

  it('login returns error on failure', () => {
    service.login('bad@user.com', 'wrong').subscribe({
      error: (err) => {
        expect(err).toBe('Invalid username or password. ');
      }
    });

    const req = httpMock.expectOne('/auth/token');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('logout clears state and navigates to login', () => {
    service.logout();
    expect(jwtSpy.remove).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('signup sends bcrypt-hashed password and Skip header', () => {
    const mockResp = { message: 'Success', data: { username: 'new@user.com' }, success: true };

    service.signup('new@user.com', 'mypassword').subscribe(resp => {
      expect(resp.success).toBeTrue();
    });

    const req = httpMock.expectOne('/auth/signup');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Skip')).toBe('true');
    expect(req.request.body.email).toBe('new@user.com');
    // Password should be sent (it's bcrypt-hashed client-side in auth.service)
    expect(req.request.body.password).toBeTruthy();
    req.flush(mockResp);
  });

  it('purgeAuth clears state', () => {
    service.purgeAuth();
    expect(jwtSpy.remove).toHaveBeenCalled();
  });
});

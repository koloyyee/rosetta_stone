import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard.service';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtSpy: jasmine.SpyObj<JwtService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    jwtSpy = jasmine.createSpyObj('JwtService', ['get']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: jwtSpy },
        { provide: Router, useValue: routerSpy },
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('allows activation when token exists', () => {
    jwtSpy.get.and.returnValue('valid-token');
    expect(guard.canActivate({} as any, {} as any)).toBeTrue();
  });

  it('redirects to home when no token', () => {
    jwtSpy.get.and.returnValue(null);
    expect(guard.canActivate({} as any, {} as any)).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});

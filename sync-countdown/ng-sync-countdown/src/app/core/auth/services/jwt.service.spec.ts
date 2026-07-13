import { TestBed } from '@angular/core/testing';

import { JwtService } from './jwt.service';

describe('JwtService', () => {
  let service: JwtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sets and gets token', () => {
    service.set('test-token');
    expect(service.get()).toBe('test-token');
  });

  it('removes token', () => {
    service.set('test-token');
    service.remove();
    expect(service.get()).toBeNull();
  });

  it('hasExpired returns true when no token', () => {
    expect(service.hasExpired()).toBeTrue();
  });

  it('hasExpired returns true for expired token', () => {
    // Create a token with an expired epoch timestamp (year 2000)
    const header = btoa(JSON.stringify({ alg: 'RS256' }));
    const payload = btoa(JSON.stringify({ sub: 'test', exp: 946684800 }));
    const expiredToken = `${header}.${payload}.sig`;
    expect(service.hasExpired(expiredToken)).toBeTrue();
  });

  it('hasExpired returns false for valid token', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const header = btoa(JSON.stringify({ alg: 'RS256' }));
    const payload = btoa(JSON.stringify({ sub: 'test@user.com', exp: futureExp, scope: 'ROLE_USER' }));
    const validToken = `${header}.${payload}.sig`;
    expect(service.hasExpired(validToken)).toBeFalse();
  });

  it('decode returns payload object', () => {
    const header = btoa(JSON.stringify({ alg: 'RS256' }));
    const payload = btoa(JSON.stringify({ sub: 'user@test.com', exp: 9999999999 }));
    const token = `${header}.${payload}.sig`;
    const decoded = service.decode(token);
    expect(decoded.sub).toBe('user@test.com');
    expect(decoded.exp).toBe(9999999999);
  });

  it('user returns CurrentUser from token', () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const header = btoa(JSON.stringify({ alg: 'RS256' }));
    const payload = btoa(JSON.stringify({ sub: 'admin@test.com', exp: futureExp, scope: 'ROLE_USER ROLE_ADMIN' }));
    const token = `${header}.${payload}.sig`;
    service.set(token);
    const user = service.user();
    expect(user?.username).toBe('admin@test.com');
    expect(user?.authorities.length).toBe(2);
  });
});

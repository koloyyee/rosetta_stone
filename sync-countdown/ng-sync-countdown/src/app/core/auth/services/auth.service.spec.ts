import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';


describe('AuthService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService, 
        provideHttpClient(),
        provideHttpClient(),
      ]
    });
    service = TestBed.inject(AuthService);

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    const jwtServiceSpy = jasmine.createSpyObj('JwtService', ['user']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    service = new AuthService(httpClientSpy, jwtServiceSpy, routerSpy);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should get user with password', () => {
    const resp = service.login("user", "password");
    console.log(resp);
  })
});

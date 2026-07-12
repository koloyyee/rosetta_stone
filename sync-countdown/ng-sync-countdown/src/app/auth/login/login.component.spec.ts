import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'logout'], {
      isAuthenticated$: of(false),
    });

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form is invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('form is valid with email and password', () => {
    component.loginForm.controls.username.setValue('test@user.com');
    component.loginForm.controls.password.setValue('password123');
    expect(component.loginForm.valid).toBeTrue();
  });

  it('shows error message on login failure', () => {
    authServiceSpy.login.and.returnValue(throwError(() => 'Invalid credentials'));

    component.loginForm.controls.username.setValue('test@user.com');
    component.loginForm.controls.password.setValue('badpass');
    component.onSubmit();

    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('calls auth service on form submit', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'test', username: 'test@user.com', authorities: [{ authority: 'ROLE_USER' }] }));

    component.loginForm.controls.username.setValue('test@user.com');
    component.loginForm.controls.password.setValue('password');
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@user.com', 'password');
  });
});

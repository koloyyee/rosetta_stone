import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HasRoleDirective } from './has-role.directive';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

@Component({
  template: `<div *hasRole="'ROLE_ADMIN'">Admin Content</div>`,
  imports: [HasRoleDirective],
})
class TestHostComponent {}

describe('HasRoleDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', [], {
            currentUser$: of({ token: 'test', username: 'admin', authorities: [{ authority: 'ROLE_ADMIN' }] }),
          }),
        },
      ],
    }).compileComponents();
  });

  it('should create host component with directive', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});

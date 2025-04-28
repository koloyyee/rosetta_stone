import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { JwtService } from './jwt.service';

/**
 * CanActivate is a route guard, 
 * we need to place it in the app.routes.ts with canActivate.
 * 
 * There could be a chain of related classes to determine a user
 * is allowed to access to certain page.
 * 
 * reference: https://angular.dev/api/router/CanActivate 
 */
@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private readonly jwtService: JwtService, private readonly router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    const token = this.jwtService.get();

    if(token) {
      return true;
    } else {
      this.router.navigate(["/"]);
      return false;
    }
  }
}

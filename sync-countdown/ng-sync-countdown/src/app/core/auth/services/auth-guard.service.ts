import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { JwtService } from './jwt.service';

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

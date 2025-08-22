import { CurrentUser } from '@/app/core/models/current-user';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  set(token: string): void {
    window.localStorage.setItem("jwt-token", token);
  }

  get(): string | null {
    return window.localStorage.getItem("jwt-token");
  }

  remove(): void {
    window.localStorage.removeItem("jwt-token");
  }

  private expiry(): Date | null {
    const token = this.get();
    if (!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp) {
      return new Date(payload.exp * 1000)
    }
    return null;
  }

  hasExpired(): boolean {
    const expiryDate = this.expiry();
    return expiryDate ? expiryDate < new Date() : true;
  }


  decode(token: string | null ){
    if (token) {
      return JSON.parse(atob(token.split(".")[1]))
    }
    return null;
  }

  user(): CurrentUser | null {
      const token = this.get();
      if (!token) return null;
      const payload = this.decode(token);
      const user: CurrentUser = {
        token,
        username: payload.sub,
        authorities: payload.scope.split(" ").map( ( a: string) => ({ authority : a }))
      }
      return user;
  }

  userRoles() : {authority: string}[] {

    const token = this.get();
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]))

      const auths = payload.scope.split(" ").map( (authority: string) => ({authority}));
      console.log({auths})
      return auths;
    }
    return [];
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService{

  constructor() { }

  set(token: string) {
    window.localStorage.setItem("jwt-token", token);
  }

  get() {
    return window.localStorage.getItem("jwt-token");
  }

  remove() {
    window.localStorage.removeItem("jwt-token");
  }

  private expiry() {
    const token = this.get();
    if(!token) {
      return null;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    if(payload.exp) {
      return new Date(payload.exp * 1000 )
    }
    return null;
  }

  hasExpired() {
    const expiryDate = this.expiry();
    return expiryDate ? expiryDate < new Date() : true;
  }
}

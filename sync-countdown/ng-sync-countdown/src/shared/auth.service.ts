import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly http: HttpClient) { }

  login() {
    const b64Cred = btoa("user:password");
    const headers = new HttpHeaders({
      'Authorization' : "Basic " + b64Cred,
    })

    this.http.post("http://localhost:8080/auth/token", {}, {
      headers
    }).subscribe( resp => console.log(resp))
  }
}

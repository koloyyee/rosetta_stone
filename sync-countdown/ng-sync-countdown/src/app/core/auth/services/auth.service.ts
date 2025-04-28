import { ResultResponse } from '@/shared/models/result-response';
import { logger } from '@/shared/utils/helper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUser } from '@shared/models/current-user';
import bcrypt from 'bcryptjs';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, throwError } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<CurrentUser| null>(null);
  public currentUser$ = this.currentUserSubject
  .asObservable()
  .pipe(distinctUntilChanged());

  public isAuthenticated = this.currentUser$.pipe(map(user  => !!user ));

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService,
    private readonly router: Router,
  ) { }

  signup(email: string, password: string): Observable<ResultResponse<{username: string} | null >> {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const headers = new HttpHeaders( {
      "Skip" : "true"
    })
    return this.http.post<ResultResponse<{username: string}>>("/auth/signup", {
      email: email.toLowerCase(), // normalize email.
      password: hashedPassword,
    },{ headers})
    .pipe(
      map( resp => resp),
      catchError( (err ) => {
        logger(err, { level: "error"});
        return throwError(() => err);
      })
    )

  }

  login(username: string, password: string): Observable<CurrentUser> {

    const b64Cred = btoa(`${username.toLowerCase()}:${password}`);
    const headers = new HttpHeaders({
      'Authorization' : "Basic " + b64Cred,
      'Skip': 'true'
    })
    return this.http.post<CurrentUser>("/auth/token", {}, {headers})
    .pipe(
      map(resp => {
        this.setAuth(resp);
        return resp;
      }),
      catchError( error => {
      console.log("Error", error);
      return throwError(() => "Invalid username or password. ");
    }));
  }


  logout() : void{
    this.purgeAuth();
    void this.router.navigate(["/"]);
  }

  setAuth(user: CurrentUser) : void {
    this.jwtService.set(user.token);
    this.currentUserSubject.next(user);
  }

  getAuthToken() : string | null {
    return this.jwtService.get();
  }

  purgeAuth() {
    this.jwtService.remove();
    this.currentUserSubject.next(null);
  }
}

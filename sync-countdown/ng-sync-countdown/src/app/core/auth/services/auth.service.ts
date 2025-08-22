import { CurrentUser } from '@/app/core/models/current-user';
import { ResultResponse } from '@/app/core/models/result-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import bcrypt from 'bcryptjs';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable, throwError } from 'rxjs';
import { logger } from '../../utils/helper';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // replaced by Signal
  private currentUserSubject = new BehaviorSubject<CurrentUser| null>(null);
  public currentUser$ = this.currentUserSubject
  .asObservable()
  .pipe(distinctUntilChanged());

  // currentUser$ = signal<CurrentUser | null | undefined>(undefined);
  // public isAuthenticated = this.currentUserSig();
  // public isAdmin = this.currentUserSig()?.authorities.some(a => a.authority === "ROLE_ADMIN");

  public isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));
  public isAdmin$ = this.currentUser$.pipe(
    map(user => !!user?.authorities.some(a => a.authority === "ROLE_ADMIN"))
  );

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService,
    private readonly router: Router,
  ) {
    const user = this.jwtService.user();
    if(user) {
      this.currentUserSubject.next(user);
    }

  }

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
        logger.error(err)
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
    console.log({user})
    // this.currentUserSig.set(user);
  }

  getAuthToken() : string | null {
    return this.jwtService.get();
  }

  purgeAuth() {
    this.jwtService.remove();
    this.currentUserSubject.next(null);
    // this.currentUserSig.set(undefined);
  }
}

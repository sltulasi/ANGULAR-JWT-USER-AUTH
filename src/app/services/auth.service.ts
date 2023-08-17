import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
// JWT service is having get, save and destro token methods used here
export class AuthService {
  // A BehaviorSubject is a type of Observable that stores the "current" value and emits it to subscribers when they subscribe to it.
  // keep track of the current user object or null if there is no authenticated user yet
  private currentUserSubj = new BehaviorSubject<User | null>(null);
  // convert currentUserSubj BehaviorSubject into an Observable using the asObservable() method
  // distinctUntilChanged() operator, ensures that only unique values are emitted to subscribers
  public currentUser = this.currentUserSubj
    .asObservable()
    .pipe(distinctUntilChanged());

  // map operator transforms the emitted user object (or null) into a boolean value
  // check whether the user is authenticated (true) or not (false)
  public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router
  ) {}

  // save the JWT token
  setAuth(user: User) {
    this.jwtService.saveToken(user.token);
    this.currentUserSubj.next(user);
  }
  //user login post API call
  // tap is used to make the pure observable
  login(credentials: {
    email: string;
    password: string;
  }): Observable<{ user: User }> {
    return (
      this.http
        .post<{ user: User }>('/users/login', {
          user: credentials,
        })
        // Tap: to perform side effects on the emitted values without modifying the user
        // takes the response object "user" from the HTTP request
        // and it calls the setAuth method
        .pipe(tap(({ user }) => this.setAuth(user)))
    );
  }

  //user register post API call

  register(credentials: {
    email: string;
    password: string;
    username: string;
  }): Observable<{ user: User }> {
    return this.http
      .post<{ user: User }>('/users', {
        user: credentials,
      })
      .pipe(tap(({ user }) => this.setAuth(user)));
  }


}

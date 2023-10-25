import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { AuthStatus, LoginResponse } from '../interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //################################################################################

  private readonly baseUrl: string = "http://localhost:8080";

  private http = inject(HttpClient);

  private router = inject(Router);

  private _currentUser = signal<User | null>(null);

  private _authStatus = signal<AuthStatus>(AuthStatus.notAuthenticated);

  public currentUser = computed(() => this._currentUser());

  public authStatus = computed(() => this._authStatus());

  //########################################################################

  register(user: User) {
    const url = `${this.baseUrl}/register`;
    return this.http.post(url, user);
  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/login`;
    const body = { email, password };

    return new Observable(observer => {
      this.http.post(url, body).subscribe(
        (response: any) => {
          this.setAuthentication(response, response.token);
          observer.next(response);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  private setAuthentication(user: User, token: string): boolean {

    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  logout() {

    //build the header of the request to containt the token stored in the localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http.post(`${this.baseUrl}/logout`, null, { headers }).subscribe();

    localStorage.removeItem("token");
    this._authStatus.set(AuthStatus.notAuthenticated);
    this._currentUser.set(null);
    //redirecionar para o login
    this.router.navigateByUrl("/");
  }

  updateCurrentUser(user: User) {
    this._currentUser.set(user);
  }

}
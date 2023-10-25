import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl: string = "http://localhost:8080";
  
  private http = inject(HttpClient);

  private authService = inject(AuthService);

  getCurrUser() {
    const url = `${this.baseUrl}/myApp/user`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    return new Observable(observer => {
      this.http.get<User>(url, { headers }).subscribe(
        (response: User) => {

          observer.next(response);
          observer.complete();
        },
        (error) => {
          if (error.status === 403) {
            this.authService.logout();
          }
          observer.error(error);
        }
      );
    });
  }

  editUser(user: User) {
    const url = `${this.baseUrl}/myApp/user/edit`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    return new Observable(observer => {
      this.http.post(url, user, { headers }).subscribe(
        (response: any) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          if (error.status === 403) {
            this.authService.logout();
          }
          observer.error(error);
        }
      );
    });
  }

  changePassword(oldPassword: string, newPassword: string) {
    const url = `${this.baseUrl}/myApp/user/change-password`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    return new Observable(observer => {
      this.http.post(url, { oldPassword, newPassword }, { headers }).subscribe(
        (response: any) => {
          observer.next(response);
          observer.complete();
        },
        (error) => {
          if (error.status === 403) {
            this.authService.logout();
          }
          observer.error(error);
        }
      );
    });
  }

}

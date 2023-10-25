import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OperationTypeService {

  private readonly baseUrl: string = "http://localhost:8080";

  private http = inject(HttpClient);

  private authService = inject(AuthService);

  public operationTypeLabels: string[] = [];

  ngOnInit(): void {
    this.getOperationTypeLabels();
  }

  getOperationTypeLabels(): Observable<string[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    return new Observable((observer) => {
      this.http
        .get<string[]>(`${this.baseUrl}/myApp/operation-type`, { headers })
        .subscribe(
          (data: string[]) => {
            this.operationTypeLabels = data;
            observer.next(data);
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
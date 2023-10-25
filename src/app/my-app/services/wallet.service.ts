import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WalletEntry } from '../interfaces/wallet-entries-response.interface';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private readonly baseUrl: string = "http://localhost:8080";

  private http = inject(HttpClient);

  private authService = inject(AuthService);

  public userWalletEntries: WalletEntry[] = [];

  constructor() { }

  getUserWalletEntries(): Observable<WalletEntry[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    return new Observable((observer) => {
      this.http
        .get<WalletEntry[]>(`${this.baseUrl}/myApp/wallet-entries`, { headers })
        .subscribe(
          (data: WalletEntry[]) => {
            this.userWalletEntries = data;
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

  depositMoney(sourceIban: string, depositValue: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    const requestBody = {
      sourceIban: sourceIban,
      depositValue: depositValue
    };

    return this.http.post<void>(`${this.baseUrl}/myApp/deposit`, requestBody, { headers: headers })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            this.authService.logout();
          }
          return throwError(error);
        })
      );
  }

  takeMoney(destinationIban: string, takeValue: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    const requestBody = {
      destinationIban: destinationIban,
      takeValue: takeValue
    };

    return this.http.post<void>(`${this.baseUrl}/myApp/take`, requestBody, { headers: headers })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            this.authService.logout();
          }
          return throwError(error);
        })
      );
  }

  buyCoin(coinName: string, amount: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    const requestBody = {
      coinName: coinName,
      amount: amount
    };

    return this.http.post<void>(`${this.baseUrl}/myApp/buy`, requestBody, { headers: headers })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            this.authService.logout();
          }
          return throwError(error);
        })
      );
  }

  sellCoin(coinName: string, amount: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    const requestBody = {
      coinName: coinName,
      amount: amount
    };

    return this.http.post<void>(`${this.baseUrl}/myApp/sell`, requestBody, { headers: headers })
      .pipe(
        catchError((error) => {
          if (error.status === 403) {
            this.authService.logout();
          }
          return throwError(error);
        })
      );
  }
  
  getUserWalletEntryByCoinId( coinId: number): Observable<WalletEntry> {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    const url = `${this.baseUrl}/myApp/wallet-entry/${coinId}`;

    return this.http.get<WalletEntry>(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
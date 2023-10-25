import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Coin } from '../interfaces/wallet-entries-response.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CoinService implements OnInit {

  private readonly baseUrl: string = "http://localhost:8080";

  private http = inject(HttpClient);

  private authService = inject(AuthService);

  public coins: Coin[] = [];

  public coinForDetails?: Coin;

  ngOnInit(): void {
    this.getCoins();
  }

  getCoins(): Observable<Coin[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    return new Observable((observer) => {
      this.http
        .get<Coin[]>(`${this.baseUrl}/myApp/coin`, { headers })
        .subscribe(
          (data: Coin[]) => {

            this.coins = data;
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

  getCoinById(coinId: number) {
    return this.http.get<Coin>(`${this.baseUrl}/myApp/check-coin-exists/${coinId}`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}

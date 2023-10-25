import { Injectable, OnInit, inject } from '@angular/core';
import { Transaction } from '../interfaces/transaction.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService implements OnInit {

  private readonly baseUrl: string = "http://localhost:8080";

  private http = inject(HttpClient);

  private authService = inject(AuthService);

  private transactions: Transaction[] = [];

  get userTransactions(): Transaction[] {
    return this.transactions;
  }

  getUserTransactions(sourceCoinName: string, destinationCoinName: string,
    startSearchDate: string, endSearchDate: string, operationType: string
  ): Observable<Transaction[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    let url: string = `${this.baseUrl}/myApp/transactions?`;

    //build the request url based on the filter fields that are not null or empty strings
    if (sourceCoinName !== "" && sourceCoinName) {
      url = url + `sourceCoinName=${sourceCoinName}&`;
    }
    if (destinationCoinName !== "" && destinationCoinName) {
      url = url.concat(`destinationCoinName=${destinationCoinName}&`);
    }
    if (startSearchDate !== "" && startSearchDate) {
      url = url + `startSearchDate=${startSearchDate}&`;
    }
    if (endSearchDate !== "" && endSearchDate) {
      url = url.concat(`endSearchDate=${endSearchDate}&`);
    }
    if (operationType !== "" && operationType) {
      url = url.concat(`operationTypeName=${operationType}&`);
    }

    return new Observable((observer) => {
      this.http
        .get<Transaction[]>(url, { headers })
        .subscribe(
          (data: Transaction[]) => {
            this.transactions = data;
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



  ngOnInit(): void {
    //get all transactions with no filters
    this.getUserTransactions("", "", "", "", "");
  }

}

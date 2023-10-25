import { Component, OnInit, inject } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../interfaces/transaction.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coin } from '../../interfaces/wallet-entries-response.interface';
import { CoinService } from '../../services/coin.service';
import { OperationTypeService } from '../../services/operation-type.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './transactions-page.component.html',
  styleUrls: ['./transactions-page.component.css']
})
export class MovementsPageComponent implements OnInit {

  //##########################################################################################################~

  private transactionService = inject(TransactionService);

  public transactions: Transaction[] = [];

  private fb = inject(FormBuilder);

  private coinService = inject(CoinService);

  private operationTypeService = inject(OperationTypeService);

  private router = inject(Router);

  public operationTypeLabels: string[] = [];

  public coins: Coin[] = [];

  public showInvalidStartSearchDate: boolean = false;

  //##########################################################################################################~
  //filter form

  public filterForm: FormGroup = this.fb.group({
    sourceCoinName: ['', []],
    destinationCoinName: ['', []],
    startSearchDate: ['', []],
    endSearchDate: ['', []],
    operationType: ['', []]
  });

  ngOnInit(): void {

    if (!localStorage.getItem("token")) {
      this.router.navigateByUrl("/");
    }

    this.transactionService.getUserTransactions("", "", "", "", "").subscribe(
      (transactions) => {
        this.transactions = transactions;
      }
    );

    this.coinService.getCoins().subscribe(
      (coins) => {
        this.coins = coins;
      }
    );

    this.operationTypeService.getOperationTypeLabels().subscribe(
      (operationTypeLabels) => {
        this.operationTypeLabels = operationTypeLabels;
      }
    );
  }

  filter() {

    const sourceCoinToReq: string = this.filterForm.controls['sourceCoinName'].value;
    const destinationCoinToReq: string = this.filterForm.controls['destinationCoinName'].value;
    const startSearchDateToReq: string = this.filterForm.controls['startSearchDate'].value;
    const endSearchDateToReq: string = this.filterForm.controls['endSearchDate'].value;
    const operationTypeToReq: string = this.filterForm.controls['operationType'].value;

    const startSearchDateToCompare: Date = new Date(startSearchDateToReq);
    const endSearchDateToCompare: Date = new Date(endSearchDateToReq);

    if (startSearchDateToCompare > endSearchDateToCompare) {
      this.showInvalidStartSearchDate = true;
      return
    }

    this.showInvalidStartSearchDate = false;


    this.transactionService.getUserTransactions(sourceCoinToReq, destinationCoinToReq, startSearchDateToReq, endSearchDateToReq, operationTypeToReq).subscribe(
      (transactions) => {
        this.transactions = transactions;
      }
    );
  }

  clearFilter() {
    this.showInvalidStartSearchDate = false;
    this.filterForm.reset();
    this.transactionService.getUserTransactions("", "", "", "", "").subscribe(
      (transactions) => {
        this.transactions = transactions;
      }
    );
  }
}

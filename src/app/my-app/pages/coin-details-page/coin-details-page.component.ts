import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoinService } from '../../services/coin.service';
import { Coin, WalletEntry } from '../../interfaces/wallet-entries-response.interface';
import { WalletService } from '../../services/wallet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ValidatorsService } from 'src/app/auth/services/validators.service';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../interfaces/transaction.interface';

@Component({
  selector: "coind-details-page",
  templateUrl: './coin-details-page.component.html',
  styleUrls: ['./coin-details-page.component.css'],
  providers: [MessageService]
})
export class CoinDetailsPageComponent implements OnInit {

  //##########################################################################################################

  private router = inject(Router);

  private coinId: number = 0;

  private route = inject(ActivatedRoute);

  private coinService = inject(CoinService);

  private walletService = inject(WalletService);

  public coinForDetails: Coin = { id: 0, name: '', quoteForEuro: 0 };

  public currWalletEntry: WalletEntry = { coin: this.coinForDetails, quantity: 0 };

  private fb = inject(FormBuilder);

  public showBuyModal: boolean = false;

  public showSellModal: boolean = false;

  private messageService = inject(MessageService);

  private validatorsService = inject(ValidatorsService);

  private transactionService = inject(TransactionService);

  public data: any;

  public valuesOfPurchases: string[] = [];

  public labels: string[] = [];

  public options: any;

  public purchaseTransactions: Transaction[] = [];

  //##########################################################################################################
  //form to buy modal

  public buyForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(0)]],
  });

  //##########################################################################################################
  //form to sell modal

  public sellForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(0)]],
  });

  //##########################################################################################################

  ngOnInit(): void {
    if (!localStorage.getItem("token")) {
      this.router.navigateByUrl("/");
    }

    //get the coin id that is in the url
    this.route.params.subscribe(params => {
      this.coinId = params['id'];
    });

    //check if a coin with that id exists
    this.coinService.getCoinById(this.coinId!).subscribe(
      (coin: Coin) => {
        //coin with given id exists

        this.coinForDetails = coin;
        this.loadWalletEntryOfCurrCoin(this.coinForDetails.id);
        this.getBuyTransactionsByCoin();

        this.initializeChart();
      },
      (error) => {
        //coin doesnt exists, redirect to dashboard
        this.router.navigateByUrl("/myApp/dashboard");
      }
    );
  }

  loadWalletEntryOfCurrCoin(coinId: number) {
    this.walletService.getUserWalletEntryByCoinId(coinId)
      .subscribe(
        (walletEntry: WalletEntry) => {
          this.currWalletEntry = walletEntry;

        },
        (error) => {
          if (error.status === 404) {
            //this.router.navigateByUrl("/myApp/dashboard");
          }
        }
      );
  }

  //##########################################################################################################
  //open and close modals

  openBuyModal() {

    this.showBuyModal = true;
  }

  closeBuyModal() {
    this.buyForm.reset();
    this.showBuyModal = false;
  }

  openSellModal() {
    this.showSellModal = true;
  }

  closeSellModal() {
    this.sellForm.reset();
    this.showSellModal = false;
  }

  //##########################################################################################################
  //methods for submits in forms

  submitBuy() {

    if (!this.buyForm.valid) {
      this.buyForm.markAllAsTouched();
      return;
    }

    const { amount } = this.buyForm.value;

    this.walletService.buyCoin(this.coinForDetails.name, amount)
      .subscribe(
        () => {

          this.ngOnInit();
          this.closeBuyModal();
          this.buyForm.reset();
          this.showSucessToast("", "Purchase successfully done.");
        },
        (error) => {


          if (error.error.status === 400 && error.error.message === 'Not enought money.') {

            this.buyForm.controls['amount'].setErrors({ notEnoughtMoney: true });
          }
        }
      );
  }

  submitSell() {
    if (!this.sellForm.valid) {
      this.sellForm.markAllAsTouched();
      return;
    }

    const { amount } = this.sellForm.value;

    this.walletService.sellCoin(this.coinForDetails.name, amount)
      .subscribe(
        () => {
          this.ngOnInit();
          this.closeSellModal();
          this.sellForm.reset();
          this.showSucessToast("", "Sale successfully done.");

        },
        (error) => {
          if (error.error.status === 400 && error.error.message === 'Not enought amount to sell.') {
            this.sellForm.controls['amount'].setErrors({ notEnoughtCoinAmount: true });
          }
        }
      );
  }

  //##########################################################################################################
  //methods for control of errors

  isValidField(field: string, form: FormGroup) {
    const valid = this.validatorsService.isValidField(form, field);
    return valid;
  }



  getFieldError(field: string, form: FormGroup): string | null {

    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {

      if (key === 'required') {
        return 'Required Field.';
      } else if (key === 'min') {
        return 'Cannot be negative.';
      } else if (key === "notEnoughtMoney" && field === 'amount') {
        return 'Not enought euros to buy the inserted amount.';
      } else if (key === "notEnoughtCoinAmount") {
        return "Not enought amount of the coin."
      }
    }
    return null;
  }

  //##########################################################################################################
  //section with methods to calculate the value in euros of the sell and buy quantity of the curr coin

  getValueOfAmountToSell(): number {
    return this.sellForm.controls['amount'].value * this.currWalletEntry.coin.quoteForEuro;
  }

  getValueOfAmountToBuy(): number {
    return this.buyForm.controls['amount'].value * this.currWalletEntry.coin.quoteForEuro;
  }

  //##########################################################################################################

  //initialize the chart
  initializeChart() {

    this.getDataforChart();

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: this.labels,
      datasets: [
        {
          label: 'Value of purchases',
          data: this.valuesOfPurchases,
          fill: false,
          borderColor: documentStyle.getPropertyValue('--orange-500'),
          tension: 0.5
        }
      ]
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: true
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: true
          }
        }
      }
    };

  }

  getBuyTransactionsByCoin() {

    this.transactionService.getUserTransactions("", this.coinForDetails.name, "", "", "Buy").subscribe(
      (transactions) => {
        //clear the labels and values of the chart since they will be loaded again
        this.labels = [];
        this.valuesOfPurchases = [];
        this.purchaseTransactions = transactions;
        this.initializeChart();
      },
      (error) => {

      }
    );
  }

  getDataforChart() {
    //set the data and label array to display in chart

    /*  this.labels = [];
     this.valuesOfPurchases = []; */
    for (const transaction of this.purchaseTransactions) {
      this.labels.push(transaction.date.toString());
      this.valuesOfPurchases.push(transaction.amountInEuros.toString());
    }
  }

  //##########################################################################################################

  showSucessToast(label: string, msg: string) {
    this.messageService.add({ severity: 'success', summary: `${label}`, detail: `${msg}` });
  }
}
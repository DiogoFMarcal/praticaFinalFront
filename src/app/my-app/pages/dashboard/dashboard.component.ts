import { ChangeDetectorRef, Component, OnInit, computed, inject } from '@angular/core';
import { User } from 'src/app/auth/interfaces';
import { AuthService } from 'src/app/auth/services/auth.service';
import { WalletService } from '../../services/wallet.service';
import { WalletEntry } from '../../interfaces/wallet-entries-response.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/auth/services/validators.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: "dashboard",
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService]
})
export class DashboardComponent implements OnInit {

  //##########################################################################################################

  public authService = inject(AuthService);

  public walletService = inject(WalletService);

  public currUser?: User | null = this.authService.currentUser();

  public userWalletEntries: WalletEntry[] = [];

  public showDepositModal: boolean = false;

  public showTakeModal: boolean = false;

  public showBuyModal: boolean = false;

  public showSellModal: boolean = false;

  private fb = inject(FormBuilder);

  public selectedCoinNametoBuy: string = "";

  public selectedCoinNametoSell: string = "";

  private validatorsService = inject(ValidatorsService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  //##########################################################################################################
  //form for deposit modal

  public depositForm: FormGroup = this.fb.group({
    sourceIban: ['', [Validators.required, Validators.pattern(this.validatorsService.ibanPattern)]],
    depositValue: ['', [Validators.required, Validators.min(0)]],
  });

  //##########################################################################################################
  //form for take modal

  public takeForm: FormGroup = this.fb.group({
    destinationIban: ['', [Validators.required, Validators.pattern(this.validatorsService.ibanPattern)]],
    takeValue: ['', [Validators.required, Validators.min(0)]],
  });

  //##########################################################################################################
  //form for buy modal

  public buyForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(0)]],
  });

  //##########################################################################################################
  //form for sell modal

  public sellForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(0)]],
  });

  //##########################################################################################################
  //handling errors coming from the forms

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
      } else if (key === 'pattern' && (field === 'sourceIban' || field === 'destinationIban')) {
        return 'IBAN must start with 2 letters and end with 22 numbers.';
      } else if (key === 'min') {
        return 'Cannot be negative.';
      } else if (key === "notEnoughtValueInSourceIban") {
        return 'Not enought money in the source Iban.';
      } else if (key === "ibanNotFound") {
        return 'Iban not found.';
      } else if (key === "sourceIbanEqualsDestinationIban" && field === 'sourceIban') {
        return 'The source Iban cannot be your own Iban.';
      } else if (key === "sourceIbanEqualsDestinationIban" && field === 'destinationIban') {
        return 'The destination Iban cannot be your own Iban.';
      } else if (key === "notEnoughtMoney" && field === 'amount') {
        return 'Not enought euros to buy the inserted amount.';
      } else if (key === "notEnoughtCoinAmount") {
        return "Not enought amount of the coin."
      }
    }
    return null;
  }

  //##########################################################################################################

  calculateTotal(): number {
    let total = 0;
    for (const entry of this.userWalletEntries) {
      total += entry.quantity * entry.coin.quoteForEuro;
    }
    return total;
  }

  //##########################################################################################################

  ngOnInit(): void {

    if (!localStorage.getItem("token")) {
      this.router.navigateByUrl("/");
    }

    this.currUser = this.authService.currentUser();
    this.intializeWalletEntries();
  }

  intializeWalletEntries() {
    this.walletService.getUserWalletEntries().subscribe(
      (walletEntries: WalletEntry[]) => {
        this.userWalletEntries = walletEntries;
      },
      (error) => {
      }
    );
  }

  //##########################################################################################################
  //methods to open and close modals

  openDepositModal() {
    this.showDepositModal = true;
  }

  closeDepositModal() {
    this.depositForm.reset();
    this.showDepositModal = false;
  }

  openTakeModal() {
    this.showTakeModal = true;
  }

  closeTakeModal() {
    this.takeForm.reset();
    this.showTakeModal = false;
  }

  openBuyModal(coinName: string) {
    this.selectedCoinNametoBuy = coinName;
    this.showBuyModal = true;
  }

  closeBuyModal() {
    this.selectedCoinNametoBuy = "";
    this.buyForm.reset();
    this.showBuyModal = false;
  }

  openSellModal(coinName: string) {
    this.selectedCoinNametoSell = coinName;
    this.showSellModal = true;
  }

  closeSellModal() {
    this.selectedCoinNametoSell = "";
    this.sellForm.reset();
    this.showSellModal = false;
  }

  //##########################################################################################################
  //submit methods for each modal

  submitDeposit() {

    if (!this.depositForm.valid) {
      this.depositForm.markAllAsTouched();
      return;
    }

    const { sourceIban, depositValue } = this.depositForm.value;

    this.walletService.depositMoney(sourceIban, depositValue)
      .subscribe(
        () => {
          this.intializeWalletEntries();
          this.closeDepositModal();
          this.depositForm.reset();
          this.showSucessToast("", "Deposit successfully done.");
        },
        (error) => {

          if (error.error.status === 400 && error.error.message === 'Invalid deposit value.') {
            this.depositForm.controls['depositValue'].setErrors({ notEnoughtValueInSourceIban: true });
          } else if (error.error.status === 404) {
            this.depositForm.controls['sourceIban'].setErrors({ ibanNotFound: true });
          } else if (error.error.status === 400 && error.error.message === 'The source Iban cannot be the destination Iban.') {
            this.depositForm.controls['sourceIban'].setErrors({ sourceIbanEqualsDestinationIban: true });
          } else if (error.error.status === 400 && error.error.message === 'The source Iban cannot be the destination Iban.') {
            this.depositForm.controls['sourceIban'].setErrors({ sourceIbanEqualsDestinationIban: true });
          }
        }
      );
  }

  submitTake() {

    if (!this.takeForm.valid) {
      this.takeForm.markAllAsTouched();
      return;
    }

    const { destinationIban, takeValue } = this.takeForm.value;

    this.walletService.takeMoney(destinationIban, takeValue)
      .subscribe(
        () => {
          this.intializeWalletEntries();
          this.closeTakeModal();
          this.takeForm.reset();
          this.showSucessToast("", "Take successfully done.");
        },
        (error) => {

          if (error.error.status === 400 && error.error.message === 'Invalid take value.') {
            this.takeForm.controls['takeValue'].setErrors({ notEnoughtValueInSourceIban: true });
          } else if (error.error.status === 404) {
            this.takeForm.controls['destinationIban'].setErrors({ ibanNotFound: true });
          } else if (error.error.status === 400 && error.error.message === 'The source Iban cannot be the destination Iban.') {
            this.takeForm.controls['destinationIban'].setErrors({ sourceIbanEqualsDestinationIban: true });
          }
        }
      );
  }

  submitBuy() {

    if (!this.buyForm.valid) {
      this.buyForm.markAllAsTouched();
      return;
    }

    const { amount } = this.buyForm.value;

    this.walletService.buyCoin(this.selectedCoinNametoBuy, amount)
      .subscribe(
        () => {
          this.intializeWalletEntries();
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

    this.walletService.sellCoin(this.selectedCoinNametoSell, amount)
      .subscribe(
        () => {
          this.intializeWalletEntries();
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

  getValueOfAmountToBuy(coinName: string): number {

    for (const walletEntry of this.userWalletEntries) {

      if (walletEntry.coin.name === coinName) {
        return this.buyForm.controls['amount'].value * walletEntry.coin.quoteForEuro;
      }
    }
    return 0;
  }

  getValueOfAmountToSell(coinName: string): number {

    for (const walletEntry of this.userWalletEntries) {

      if (walletEntry.coin.name === coinName) {
        return this.sellForm.controls['amount'].value * walletEntry.coin.quoteForEuro;
      }
    }
    return 0;
  }

  showSucessToast(label: string, msg: string) {
    this.messageService.add({ severity: 'success', summary: `${label}`, detail: `${msg}` });
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/auth/interfaces';
import { Country } from 'src/app/auth/interfaces/country.interface';
import { CountriesService } from 'src/app/auth/services/countries.service';
import { ValidatorsService } from 'src/app/auth/services/validators.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  providers: [MessageService]

})
export class ProfilePageComponent implements OnInit {

  //##########################################################################################################

  private fb = inject(FormBuilder);

  private validatorsService = inject(ValidatorsService);

  private countriesService = inject(CountriesService);

  public countries: Country[] = [];

  private userService = inject(UserService);

  constructor(private messageService: MessageService) { }

  public currUser: User | null | undefined;

  public router = inject(Router);

  public showChangePasswordModal: boolean = false;

  //##########################################################################################################
  // form to edit profile

  public editUserForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    surnames: ['', [Validators.required]],
    country: ['', [Validators.required, Validators.pattern(this.validatorsService.countryPattern)]],
    city: ['', [Validators.required]],
    address: ['', [Validators.required]],
    iban: ['', [Validators.required, Validators.pattern(this.validatorsService.ibanPattern)]],
    email: ['', [Validators.required, Validators.email]]
  }
  );

  public changePasswordForm: FormGroup = this.fb.group({
    oldPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(this.validatorsService.passwordPattern)]],
    newPassword: ['', [Validators.required, Validators.minLength(6), Validators.pattern(this.validatorsService.passwordPattern)]]
  }
  );

  //#####################################################################################################################
  // methods to handle errors from the form

  isValidField(field: string, form: FormGroup) {
    return this.validatorsService.isValidField(form, field);
  }

  getFieldError(field: string, form: FormGroup): string | null {

    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      if (key === 'required') {
        return 'Required Field';
      } else if (key === 'email') {
        return `Invalid email.`;
      } else if (key === 'pattern' && field === 'iban') {
        return 'IBAN must start with 2 letters and end with 22 numbers.';
      } else if (key === 'pattern') {
        return 'Password must at least 6 characters and at least 1 upper case letter and 1 special character.';
      } else if (key === 'pattern' && field === 'country') {
        return 'Required Field';
      } else if (key === 'minlength') {
        return `Minimum of  ${errors['minlength'].requiredLength} characters.`;
      } else if (key === 'takenIban' && field === 'iban') {
        return 'Iban already in use.';
      } else if (key === 'wrongOldPassword' && field === 'oldPassword') {
        return 'Wrong password.';
      } else if (key === 'takenEmail' && field === 'email') {
        return 'Email already in use.';
      }
    }
    return null;
  }

  ngOnInit() {

    if (!localStorage.getItem("token")) {
      this.router.navigateByUrl("/");
    }

    this.setUserDataInForm();

    //get all the countries for the select input
    this.countriesService.getCountries().subscribe(
      (data: Country[]) => {
        this.countries = data;
        this.countries.sort((a, b) => (a.countryName < b.countryName ? -1 : 1));
      },
      (error) => {
      }
    );
  }

  setUserDataInForm() {
    this.userService.getCurrUser().subscribe(
      (user: any) => {

        this.editUserForm.controls['name'].setValue(user.name);
        this.editUserForm.controls['surnames'].setValue(user.surnames);
        this.editUserForm.controls['country'].setValue(user.country);
        this.editUserForm.controls['city'].setValue(user.city);
        this.editUserForm.controls['address'].setValue(user.address);
        this.editUserForm.controls['iban'].setValue(user.iban);
        this.editUserForm.controls['email'].setValue(user.email);
      },
      (error) => {
      }
    );
  }

  editUser() {

    if (!this.editUserForm.valid) {
      this.editUserForm.markAllAsTouched();
      return
    }

    this.userService.editUser(this.editUserForm.value)
      .subscribe(
        (response) => {
          this.setUserDataInForm();
          this.showSucessToast("", "Profile successfully edited.")
          // this.router.navigateByUrl('/');
        },
        (error) => {

          const msg = error.error.message;

          if (error.status === 409) {
            if (msg.includes("Iban")) {
              this.editUserForm.controls['iban'].setErrors({ takenIban: true });
            }

            if (msg.includes("Email")) {
              this.editUserForm.controls['email'].setErrors({ takenEmail: true });
            }
          }
        }
      );
  }

  //##########################################################################################################
  //methods to change password functionality

  openChangePasswordModal() {
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal() {
    this.changePasswordForm.reset();
    this.showChangePasswordModal = false;
  }

  changePassword() {

    if (!this.changePasswordForm.valid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.userService.changePassword(this.changePasswordForm.controls['oldPassword'].value, this.changePasswordForm.controls['newPassword'].value,)
      .subscribe(
        (response) => {
          this.closeChangePasswordModal();
          this.showSucessToast("", "Password successfully updated.")
        },
        (error) => {

          const msg = error.error.message;

          if (error.status === 400) {
            this.changePasswordForm.controls['oldPassword'].setErrors({ wrongOldPassword: true });
          }
        }
      );
  }

  //##########################################################################################################~

  showSucessToast(label: string, msg: string) {
    this.messageService.add({ severity: 'success', summary: `${label}`, detail: `${msg}` });
  }
}
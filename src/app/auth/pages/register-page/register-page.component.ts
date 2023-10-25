import { Component, OnInit, inject } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country.interface';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ValidatorsService } from '../../services/validators.service';
import { User } from '../../interfaces';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  private validatorsService = inject(ValidatorsService);

  private countriesService = inject(CountriesService);

  public countries: Country[] = [];

  //#####################################################################################################################

  public registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    surnames: ['', [Validators.required]],
    country: ['', [Validators.required, Validators.pattern(this.validatorsService.countryPattern)]],
    city: ['', [Validators.required]],
    address: ['', [Validators.required]],
    iban: ['', [Validators.required, Validators.pattern(this.validatorsService.ibanPattern)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(this.validatorsService.passwordPattern)]],
  }
  );

  //#####################################################################################################################

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.registerForm, field);
  }

  getFieldError(field: string): string | null {

    if (!this.registerForm.controls[field]) return null;

    const errors = this.registerForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      if (key === 'required') {
        return 'Required Field';
      } else if (key === 'minlength') {
        return `Minimum of  ${errors['minlength'].requiredLength} characters.`;
      } else if (key === 'email') {
        return 'Invalid email.';
      } else if (key === 'pattern' && field === 'iban') {
        return 'IBAN must start with 2 letters and end with 22 numbers.';
      } else if (key === 'pattern' && field === 'password') {
        return 'Password must contain at least 1 upper case letter and 1 special character.';
      } else if (key === 'pattern' && field === 'country') {
        return 'Required Field.';
      } else if (key === 'takenEmail' && field === 'email') {
        return 'Email already in use.';
      } else if (key === 'takenIban' && field === 'iban') {
        return 'Iban already in use.';
      }      
    }
    return null;
  }

  register() {

    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const user: User = this.registerForm.value;

    this.authService.register(user).subscribe(
      (response) => {
        this.router.navigateByUrl('/');
      },
      (error) => {
        
        const msg = error.error.message;
        if (error.status === 409) {
        
          if (msg.includes("email")) {
            this.registerForm.controls['email'].setErrors({takenEmail: true});
          }
        } else if(error.status === 400 && msg.includes("Iban")){
          this.registerForm.controls['iban'].setErrors({takenIban: true});
        }  else {
          alert("An error occurred, please try again later.");
        }
        } 
      
    );
  }

  ngOnInit() {
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
}

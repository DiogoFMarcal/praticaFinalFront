import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ValidatorsService } from '../../services/validators.service';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  //################################################################################

  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private router = inject(Router);

  private validatorsService = inject(ValidatorsService);

  public showInvalidCredentialsText: boolean = false;

  //################################################################################
  //login form declaration

  public loginForm: FormGroup = this.fb.group({
    email: ['joao@email.com', [Validators.required, Validators.email]],
    password: ['oioioiO#', [Validators.required, Validators.minLength(6)]],
  });

  //################################################################################
  //input user errors handling

  isValidField(field: string) {
    return this.validatorsService.isValidField(this.loginForm, field);
  }

  getFieldError(field: string): string | null {
    if (!this.loginForm.controls[field]) return null;

    const errors = this.loginForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Required Field';
          break
        case 'email':
          return `Invalid email.`;
          break;
      }
    }
    return null;
  }

  //################################################################################

  login() {

    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe(
      (response) => {

        this.router.navigateByUrl("/myApp/dashboard");
      },
      (error) => {
        const msg = error.error.message;
        if (error.status === 401) {

          if (msg.includes("credentials")) {
            this.showInvalidCredentialsText = true;
          }
        } else {
          alert("An error occurred, please try again later.");
        }
      }

    );
  }
}
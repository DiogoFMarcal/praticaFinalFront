import { Injectable, inject } from '@angular/core';
import { FormControl, ValidationErrors, FormGroup, AbstractControl } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {

    //################################################################################

    public ibanPattern: string = "^[a-zA-Z]{2}[0-9]{22}$";

    public passwordPattern: string = "^(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.{6,})[\\w\\d@#$%^&+=!]+$";

    public countryPattern: string = "^(?!(?:-|\\s)*$).+";

    //################################################################################
    //methods for validation of form fields

    public isValidField(form: FormGroup, field: string) {
        return form.controls[field].errors && form.controls[field].touched;
    }

    public isFieldOneEqualFieldTwo(field1: string, field2: string) {

        return (formGroup: AbstractControl): ValidationErrors | null => {

            const fieldValue1 = formGroup.get(field1)?.value;
            const fieldValue2 = formGroup.get(field2)?.value;

            if (fieldValue1 !== fieldValue2) {
                formGroup.get(field2)?.setErrors({ notEqual: true });
                return { notEqual: true }
            }

            formGroup.get(field2)?.setErrors(null);
            return null;
        }
    }
}
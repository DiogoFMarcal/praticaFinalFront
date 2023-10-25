import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);

  if (!localStorage.getItem('token')) {
    //if someone tries to acess a private page wich is protected with this guard, we close the session in back if exists 
    //and redirect to login
    authService.logout();
    return false;
  }
  return true;
};
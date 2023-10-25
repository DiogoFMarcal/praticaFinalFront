import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (localStorage.getItem('token')) {
    router.navigateByUrl('/myApp/dashboard');
    return false;
  }
  return true;
};


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isNotAuthenticatedGuard, isAuthenticatedGuard } from './auth/guards';

const routes: Routes = [
  {
    path: '',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'myApp',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./my-app/my-app.module').then(m => m.MyAppModule),
  },
  {
    path: '**',
    redirectTo: "auth"
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

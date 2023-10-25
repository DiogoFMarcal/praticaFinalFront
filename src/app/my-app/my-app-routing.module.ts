import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAppLayoutComponent } from './layouts/my-app-layout/my-app-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CoinDetailsPageComponent } from './pages/coin-details-page/coin-details-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { MovementsPageComponent } from './pages/transactions-page/transactions-page.component';

const routes: Routes = [
  {
    path: '',
    component: MyAppLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'coinDetails/:id', component: CoinDetailsPageComponent },
      { path: 'editProfile', component: ProfilePageComponent },
      { path: 'transactions', component: MovementsPageComponent },
      { path: '**', redirectTo: 'dashboard' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAppRoutingModule { }

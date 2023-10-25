import { CoinDetailsPageComponent } from './pages/coin-details-page/coin-details-page.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MenuComponent } from './components/menu/menu.component';
import { MovementsPageComponent } from './pages/transactions-page/transactions-page.component';
import { MyAppLayoutComponent } from './layouts/my-app-layout/my-app-layout.component';
import { MyAppRoutingModule } from './my-app-routing.module';
import { NgModule } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToCurrencyPipe } from './pipes/to-currency.pipe';


@NgModule({
  declarations: [
    MyAppLayoutComponent,
    DashboardComponent,
    CoinDetailsPageComponent,
    ProfilePageComponent,
    MenuComponent,
    MovementsPageComponent,
    ToCurrencyPipe
  ],
  imports: [
    CommonModule,
    MyAppRoutingModule,
    PrimeNgModule,
    ReactiveFormsModule
  ],

})
export class MyAppModule { }

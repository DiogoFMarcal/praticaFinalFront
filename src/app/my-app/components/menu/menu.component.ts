import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'myApp-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  public menuItems: MenuItem[] = [];

  ngOnInit() {
    //set the items of the top shared menu of the app
    this.menuItems = [
      {
        label: 'Dashboard',
        routerLink: '/myApp/dashboard',
      },
      {
        label: 'Transactions',
        routerLink: "/myApp/transactions"
      },
      {
        label: 'Profile',
        routerLink: "/myApp/editProfile"
      },
    ];
  }

  logout() {
    this.authService.logout();
  }
}

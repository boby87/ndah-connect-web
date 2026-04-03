import { Component } from '@angular/core';
import {Haeder} from "../haeder/haeder";
import {Navbar} from "../navbar/navbar";
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-admin-access',
  imports: [
    Haeder,
    Navbar,
    RouterLink
  ],
  templateUrl: './admin-access.html',
  styleUrl: './admin-access.css',
})
export class AdminAccess {
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  showPassword1:boolean = false;
  togglePassword1() {
    this.showPassword1 = !this.showPassword1;
  }
}

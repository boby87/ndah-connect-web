import { Routes } from '@angular/router';
import {Component} from '@angular/core';
import {Login} from './pages/login/login';
import {Dashboard} from './pages/dashboard/dashboard';
import {NewTontine} from './pages/new-tontine/new-tontine';
import {AdminAccess} from './pages/admin-access/admin-access';

export const routes: Routes = [
  {path: '', component: Login},
  {path:'home',component: Dashboard},
  {path:'newTontine',component: NewTontine},
  {path : 'adminAccess',component: AdminAccess},
];

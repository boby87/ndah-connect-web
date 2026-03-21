import { Routes } from '@angular/router';
import {Component} from '@angular/core';
import {Login} from './pages/login/login';
import {Dashboard} from './pages/dashboard/dashboard';

export const routes: Routes = [
  {path: '', component: Login},
  {path:'home',component: Dashboard},
];

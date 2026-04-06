import { Routes } from '@angular/router';
import {Component} from '@angular/core';
import {Login} from './pages/login/login';
import {Dashboard} from './pages/dashboard/dashboard';
import {NewTontine} from './pages/new-tontine/new-tontine';
import {AdminAccess} from './pages/admin-access/admin-access';
import {JoinTontine} from './pages/join-tontine/join-tontine';
import {InvitationTontine} from './pages/invitation-tontine/invitation-tontine';

export const routes: Routes = [
  {path:'',component: Login},
  {path: 'tontines', component: Dashboard},
  {path:'home',component: Login},
  {path:'newTontine',component: NewTontine},
  {path : 'newTontine/adminAccess',component: AdminAccess},
  {path : 'joinTontine',component: JoinTontine},
  {path:'newTontine/invitationTontine',component: InvitationTontine},
  {path:'joinTontine/invitationTontine',component: InvitationTontine},
];

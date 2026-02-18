import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MembersComponent } from './features/members/members.component';
import { MemberProfileComponent } from './features/members/member-profile.component';
import { FundsComponent } from './features/funds/funds.component';
import { EventsComponent } from './features/events/events.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'members', component: MembersComponent },
      { path: 'members/:id', component: MemberProfileComponent },
      { path: 'funds', component: FundsComponent },
      { path: 'events', component: EventsComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];


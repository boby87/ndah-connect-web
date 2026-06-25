import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginPageComponent),
    title: 'Connexion · TontineConnect',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterPageComponent),
    title: 'Inscription · TontineConnect',
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./pages/verify-otp/verify-otp.component').then((m) => m.VerifyOtpPageComponent),
    title: 'Vérification · TontineConnect',
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordPageComponent,
      ),
    title: 'Mot de passe oublié · TontineConnect',
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordPageComponent,
      ),
    title: 'Réinitialisation · TontineConnect',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomePageComponent),
    title: 'Accueil · TontineConnect',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then((m) => m.ContactPageComponent),
    title: 'Contact · TontineConnect',
  },
  {
    path: 'invitations/:token/accept',
    loadComponent: () =>
      import('./pages/invitation-accept/invitation-accept.component').then(
        (m) => m.InvitationAcceptPageComponent,
      ),
    title: "Accepter l'invitation · TontineConnect",
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

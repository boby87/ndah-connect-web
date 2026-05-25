# 📋 INSTRUCTION CLAUDE - PROJET TONTINE ANGULAR 21

## 📚 Sources de Vérité (Contexte Projet)

Toutes tes propositions de composants et de services doivent respecter les flows décrits dans :

- `Cahier_des_Charges.md` : Design système et vision UX globale.
- `Flows_President.md` : Interfaces de validation et de prise de décision.
- `Flows_Secretaire.md` : Saisie des PV, gestion de l'ordre du jour et pointage.
- `Flows_Censeur.md` : Dashboard de discipline et modules de sanctions.
- `Flows_CommissaireAuxComptes.md` : Visualisations d'audit et alertes financières.
- `Flows_Membre.md` : Espace personnel, planning des tours et simulateurs de prêt.

## ⚡ Architecture Angular 21 (Elite Standards)

- **Zoneless :** Développement strict sans `zone.js`. Utilisation du changement de détection basé sur les signaux.
- **State Management :** Utilisation exclusive de l'API Signals (`Signal`, `computed`, `effect`, `LinkedSignal`, `Resource`).
- **Formulaires :** Utilisation des **Signal-based Forms** pour une réactivité optimale et un typage strict.
- **Architecture :** Pattern Smart/Dumb (Container/Presentational). Logique de navigation gérée par des guards basés sur les rôles.

## 🎨 UI & Design (Tailwind CSS)

- **Design Système :** Utilisation de Tailwind pour le layout/spacing et Bootstrap 5 pour les composants complexes (modales, tables).
- **Responsive :** L'application doit être "Mobile-First" pour les membres et "Desktop-Optimized" pour le bureau (Président, Secrétaire).
- **Thématisation :** Support du mode clair/sombre et respect de la charte graphique définie.

## 🧠 Workflows & Rôles

Adapte dynamiquement l'interface selon les documents de référence :

- **Dashboard Bureau :** Vue consolidée des indicateurs de la séance en cours (taux de présence, montant collecté).
- **Workflow de Signature :** Interface de validation séquentielle (Secrétaire -> Commissaire -> Président).
- **Visualisation Financière :** Graphiques de progression de l'épargne et tableaux d'amortissement pour les prêts (XAF).

## 🛠️ Standards de Développement

- **Typage Strict :** Les interfaces TypeScript doivent refléter exactement les modèles du domaine Backend.
- **Performance :** Optimisation du rendu via `defer` blocks et `track` dans les boucles `@for`.
- **Tests :** Fournis systématiquement des tests unitaires pour les `Signals` et les `Services` (Jasmine/Jest).
- **Internationalisation :** Gestion des labels métier en français (Session, Cotisation, Amende).

## 🚫 Contraintes Critiques

- Interdiction d'utiliser des `Observables` (RxJS) là où les `Signals` sont plus appropriés.
- Pas de logique métier complexe dans les templates HTML.
- Respect strict de la sécurité : ne jamais afficher d'actions interdites pour un rôle donné (ex: bouton de validation caché pour le Secrétaire).

## 🎯 Directives de Réponse

1. Précise le composant ou le service concerné par rapport au flux métier (ex: "Composant de gestion des sanctions pour le Censeur").
2. Propose la structure HTML (Tailwind) et la logique TypeScript (Signals).
3. Ajoute systématiquement les tests unitaires correspondants.

---

## 📦 INTER-ACTION

- Pose moi toujours des question si tu as des doutes
- tu pourras modifier la structure du projet si tu le pense car la struture qui est decrite au bas est juste a titre d'example.

## 📦 INSTRUCTION À COPIER

```text
Génère un projet Angular 21 complet pour une application de gestion de tontine au Cameroun avec les spécifications suivantes :

## CONFIGURATION GÉNÉRALE
- Angular 21 avec tous les composants en STANDALONE (pas de NgModule)
- TailwindCSS pour le styling
- Angular Signals pour le state management (pas de NgRx)
- Lazy loading pour toutes les features
- Architecture modulaire avec barrel exports (index.ts)
- Typage strict TypeScript
- Nouvelle syntaxe de control flow (@if, @for, @switch)

## STRUCTURE DU PROJET

src/app/
├── core/
│   ├── api/
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── auth-api.service.ts
│   │   │   ├── tontine-api.service.ts
│   │   │   ├── member-api.service.ts
│   │   │   ├── contribution-api.service.ts
│   │   │   ├── loan-api.service.ts
│   │   │   ├── session-api.service.ts
│   │   │   ├── sanction-api.service.ts
│   │   │   ├── document-api.service.ts
│   │   │   ├── notification-api.service.ts
│   │   │   └── index.ts
│   │   └── models/
│   │       ├── api-response.model.ts
│   │       ├── pagination.model.ts
│   │       ├── error.model.ts
│   │       └── index.ts
│   ├── auth/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   ├── no-auth.guard.ts
│   │   │   ├── role.guard.ts
│   │   │   └── index.ts
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   ├── error.interceptor.ts
│   │   │   ├── loading.interceptor.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── token.service.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── storage.service.ts
│   │   ├── notification.service.ts
│   │   ├── loading.service.ts
│   │   ├── dialog.service.ts
│   │   ├── theme.service.ts
│   │   ├── language.service.ts
│   │   └── index.ts
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── api.config.ts
│   │   └── index.ts
│   ├── constants/
│   │   ├── app.constants.ts
│   │   ├── storage-keys.constants.ts
│   │   ├── regex.constants.ts
│   │   └── index.ts
│   ├── enums/
│   │   ├── user-role.enum.ts
│   │   ├── member-status.enum.ts
│   │   ├── tontine-status.enum.ts
│   │   ├── session-status.enum.ts
│   │   ├── loan-status.enum.ts
│   │   ├── contribution-status.enum.ts
│   │   ├── sanction-type.enum.ts
│   │   ├── payment-method.enum.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── date.utils.ts
│   │   ├── currency.utils.ts
│   │   ├── validation.utils.ts
│   │   └── index.ts
│   └── index.ts
├── shared/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button/
│   │   │   │   ├── button.component.ts
│   │   │   │   ├── button.component.html
│   │   │   │   └── button.component.scss
│   │   │   ├── input/
│   │   │   │   ├── input.component.ts
│   │   │   │   ├── input.component.html
│   │   │   │   └── input.component.scss
│   │   │   ├── select/
│   │   │   ├── checkbox/
│   │   │   ├── textarea/
│   │   │   ├── card/
│   │   │   ├── modal/
│   │   │   ├── drawer/
│   │   │   ├── dropdown/
│   │   │   ├── tabs/
│   │   │   ├── accordion/
│   │   │   ├── tooltip/
│   │   │   ├── badge/
│   │   │   ├── chip/
│   │   │   ├── avatar/
│   │   │   ├── spinner/
│   │   │   ├── skeleton/
│   │   │   ├── alert/
│   │   │   ├── toast/
│   │   │   ├── progress-bar/
│   │   │   ├── pagination/
│   │   │   └── index.ts
│   │   ├── forms/
│   │   │   ├── form-field/
│   │   │   ├── form-error/
│   │   │   ├── phone-input/
│   │   │   ├── otp-input/
│   │   │   ├── password-input/
│   │   │   ├── amount-input/
│   │   │   ├── search-input/
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── page-header/
│   │   │   ├── page-content/
│   │   │   ├── section/
│   │   │   ├── empty-state/
│   │   │   ├── error-state/
│   │   │   ├── loading-state/
│   │   │   └── index.ts
│   │   ├── data-display/
│   │   │   ├── data-table/
│   │   │   ├── list/
│   │   │   ├── stat-card/
│   │   │   ├── timeline/
│   │   │   ├── chart/
│   │   │   ├── calendar/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── directives/
│   │   ├── click-outside.directive.ts
│   │   ├── debounce-click.directive.ts
│   │   ├── autofocus.directive.ts
│   │   ├── permission.directive.ts
│   │   ├── role.directive.ts
│   │   ├── number-only.directive.ts
│   │   ├── phone-mask.directive.ts
│   │   ├── currency-mask.directive.ts
���   │   ├── infinite-scroll.directive.ts
│   │   └── index.ts
│   ├── pipes/
│   │   ├── currency-xaf.pipe.ts
│   │   ├── date-format.pipe.ts
│   │   ├── relative-time.pipe.ts
│   │   ├── phone-format.pipe.ts
│   │   ├── truncate.pipe.ts
│   │   ├── initials.pipe.ts
│   │   ├── file-size.pipe.ts
│   │   ├── status-label.pipe.ts
│   │   ├── role-label.pipe.ts
│   │   ├── highlight.pipe.ts
│   │   └── index.ts
│   ├── validators/
│   │   ├── phone.validator.ts
│   │   ├── amount.validator.ts
│   │   ├── password-match.validator.ts
│   │   └── index.ts
│   ├── models/
│   │   ├── entities/
│   │   │   ├── user.model.ts
│   │   │   ├── tontine.model.ts
│   │   │   ├── member.model.ts
│   │   │   ├── cycle.model.ts
│   │   │   ├── session.model.ts
│   │   │   ├── attendance.model.ts
│   │   │   ├── contribution.model.ts
│   │   │   ├── distribution.model.ts
│   │   │   ├── loan.model.ts
│   │   │   ├── loan-repayment.model.ts
│   │   │   ├── sanction.model.ts
│   │   │   ├── cash-box.model.ts
│   │   │   ├── transaction.model.ts
│   │   │   ├── document.model.ts
│   │   │   ├── vote.model.ts
│   │   │   ├── notification.model.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── animations/
│   │   ├── fade.animation.ts
│   │   ├── slide.animation.ts
│   │   ├── scale.animation.ts
│   │   ├── list.animation.ts
│   │   └── index.ts
│   └── index.ts
├── store/
│   ├── auth/
│   │   ├── auth.store.ts
│   │   └── index.ts
│   ├── ui/
│   │   ├── ui.store.ts
│   │   └── index.ts
│   ├── tontine/
│   │   ├── tontine.store.ts
│   │   └── index.ts
│   ├── notification/
│   │   ├── notification.store.ts
│   │   └── index.ts
│   └── index.ts
├── layouts/
│   ├── main-layout/
│   │   ├── main-layout.component.ts
│   │   ├── main-layout.component.html
│   │   ├── main-layout.component.scss
│   │   ├── components/
│   │   │   ├── header/
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── header.component.html
│   │   │   │   └── header.component.scss
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.component.ts
│   │   │   │   ├── sidebar.component.html
│   │   │   │   ├── sidebar.component.scss
│   │   │   │   └── sidebar-menu.config.ts
│   │   │   ├── footer/
│   │   │   ├── user-menu/
│   │   │   ├── tontine-selector/
│   │   │   ├── mobile-nav/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── auth-layout/
│   │   ├── auth-layout.component.ts
│   │   ├── auth-layout.component.html
│   │   ├── auth-layout.component.scss
│   │   └── index.ts
│   └── index.ts
├── features/
│   ├── auth/
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   │   ├── login.component.ts
│   │   │   │   ├── login.component.html
│   │   │   │   └── login.component.scss
│   │   │   ├── register/
│   │   │   │   ├── register.component.ts
│   │   │   │   ├── register.component.html
│   │   │   │   └── register.component.scss
│   │   │   ├── forgot-password/
│   │   │   │   ├── forgot-password.component.ts
│   │   │   │   ├── forgot-password.component.html
│   │   │   │   └── forgot-password.component.scss
│   │   │   ├── reset-password/
│   │   │   │   ├── reset-password.component.ts
│   │   │   │   ├── reset-password.component.html
│   │   │   │   └── reset-password.component.scss
│   │   │   ├── verify-otp/
│   │   │   │   ├── verify-otp.component.ts
│   │   │   │   ├── verify-otp.component.html
│   │   │   │   └── verify-otp.component.scss
│   │   │   └── index.ts
│   │   ├── auth.routes.ts
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── pages/
│   │   │   ├── dashboard-home/
│   │   │   │   ├── dashboard-home.component.ts
│   │   │   │   ├── dashboard-home.component.html
│   │   │   │   └── dashboard-home.component.scss
│   │   │   ├── dashboard-president/
│   │   │   ├── dashboard-treasurer/
│   │   │   ├── dashboard-secretary/
│   │   │   ├── dashboard-censor/
│   │   │   ├── dashboard-auditor/
│   │   │   ├── dashboard-member/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── stats-cards/
│   │   │   │   ├── stats-cards.component.ts
│   │   │   │   ├── stats-cards.component.html
│   │   │   │   └── stats-cards.component.scss
│   │   │   ├── quick-actions/
│   │   │   ├── recent-activities/
│   │   │   ├── upcoming-sessions/
│   │   │   ├── pending-validations/
│   │   │   ├── financial-summary/
│   │   │   ├── alerts-panel/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── dashboard.service.ts
│   │   ├── dashboard.routes.ts
│   │   └── index.ts
│   ├── tontines/
│   │   ├── pages/
│   │   │   ├── tontine-list/
│   │   │   ├── tontine-detail/
│   │   │   ├── tontine-create/
│   │   │   ├── tontine-edit/
│   │   │   ├── tontine-settings/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── tontine-card/
│   │   │   ├── tontine-form/
│   │   │   ├── tontine-header/
│   │   │   ├── tontine-stats/
│   │   │   ├── cycle-selector/
│   │   │   ├── tour-planning/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── tontine.service.ts
│   │   ├── tontines.routes.ts
│   │   └── index.ts
│   ├── members/
│   │   ├── pages/
│   │   │   ├── member-list/
│   │   │   ├── member-detail/
│   │   │   ├── member-profile/
│   │   │   ├── adhesion-requests/
│   │   │   ├── resignation-requests/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── member-card/
│   │   │   ├── member-form/
│   │   │   ├── member-status-badge/
│   │   │   ├── role-badge/
│   │   │   ├── adhesion-form/
│   │   │   ├── member-financial-summary/
│   │   │   ├── member-attendance-history/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── member.service.ts
│   │   ├── members.routes.ts
│   │   └── index.ts
│   ├── sessions/
│   │   ├── pages/
│   │   │   ├── session-list/
│   │   │   ├── session-detail/
│   │   │   ├── session-create/
│   │   │   ├── session-live/
│   │   │   ├── session-minutes/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── session-card/
│   │   │   ├── session-form/
│   │   │   ├── agenda-editor/
│   │   │   ├── attendance-list/
│   │   │   ├── attendance-form/
│   │   │   ├── quorum-indicator/
│   │   │   ├── session-timer/
│   │   │   ├── agenda-progress/
│   │   │   ├── minutes-editor/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── session.service.ts
│   │   │   └── attendance.service.ts
│   │   ├── sessions.routes.ts
│   │   └── index.ts
│   ├── contributions/
│   │   ├── pages/
│   │   │   ├── contribution-list/
│   │   │   ├── contribution-collect/
│   │   │   ├── my-contributions/
│   │   │   ├── arrears-list/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── contribution-form/
│   │   │   ├── contribution-card/
│   │   │   ├── payment-method-selector/
│   │   │   ├── contribution-receipt/
│   │   │   ├── contribution-history/
│   │   │   ├── arrears-summary/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── contribution.service.ts
│   │   ├── contributions.routes.ts
│   │   └── index.ts
│   ├── distributions/
│   │   ├── pages/
│   │   │   ├── distribution-list/
│   │   │   ├── distribution-detail/
│   │   │   ├── distribution-process/
│   │   │   ├── my-distributions/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── distribution-form/
│   │   │   ├── distribution-calculator/
│   │   │   ├── deductions-breakdown/
│   │   │   ├── signature-pad/
│   │   │   ├── distribution-receipt/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── distribution.service.ts
│   │   ├── distributions.routes.ts
│   │   └── index.ts
│   ├── loans/
│   │   ├── pages/
│   │   │   ├── loan-list/
│   │   │   ├── loan-detail/
│   │   │   ├── loan-request/
│   │   │   ├── loan-approval/
│   │   │   ├── my-loans/
│   │   │   ├── guarantor-requests/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── loan-form/
│   │   │   ├── loan-card/
│   │   │   ├── loan-calculator/
│   │   │   ├── guarantor-selector/
│   │   │   ├── repayment-schedule/
│   │   │   ├── repayment-form/
│   │   │   ├── loan-status-stepper/
│   │   │   ├── loan-approval-form/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── loan.service.ts
│   │   ├── loans.routes.ts
│   │   └── index.ts
│   ├── treasury/
│   │   ├── pages/
│   │   │   ├── treasury-overview/
│   │   │   ├── cash-boxes/
│   │   │   ├── transactions/
│   │   │   ├── transfer-funds/
│   │   │   ├── financial-reports/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── cash-box-card/
│   │   │   ├── transaction-list/
│   │   │   ├── transfer-form/
│   │   │   ├── balance-chart/
│   │   │   ├── expense-form/
│   │   │   ├── financial-summary/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── treasury.service.ts
│   │   │   └── transaction.service.ts
│   │   ├── treasury.routes.ts
│   │   └── index.ts
│   ├── sanctions/
│   │   ├── pages/
│   │   │   ├── sanction-list/
│   │   │   ├── sanction-detail/
│   │   │   ├── my-sanctions/
│   │   │   ├── contestations/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── sanction-card/
│   │   │   ├── sanction-form/
│   │   │   ├── contestation-form/
│   │   │   ├── sanction-payment/
│   │   │   ├── sanction-history/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── sanction.service.ts
│   │   ├── sanctions.routes.ts
│   │   └── index.ts
│   ├── votes/
│   │   ├── pages/
│   │   │   ├── vote-list/
│   │   │   ├── vote-detail/
│   │   │   ├── vote-create/
│   │   │   ├── vote-results/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── vote-card/
│   │   │   ├── vote-form/
│   │   │   ├── voting-booth/
│   │   │   ├── vote-options/
│   │   │   ├── results-chart/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── vote.service.ts
│   │   ├── votes.routes.ts
│   │   └── index.ts
│   ├── documents/
│   │   ├── pages/
│   │   │   ├── document-list/
│   │   │   ├── document-viewer/
│   │   │   ├── document-upload/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── document-card/
│   │   │   ├── document-uploader/
│   │   │   ├── pdf-viewer/
│   │   │   ├── signature-capture/
│   │   │   ├── document-filter/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── document.service.ts
│   │   ├── documents.routes.ts
│   │   └── index.ts
│   ├── notifications/
│   │   ├── pages/
│   │   │   ├── notification-list/
│   │   │   ├── notification-settings/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── notification-item/
│   │   │   ├── notification-bell/
│   │   │   ├── notification-panel/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── notification.service.ts
│   │   ├── notifications.routes.ts
│   │   └── index.ts
│   ├── audit/
│   │   ├── pages/
│   │   │   ├── audit-dashboard/
│   │   │   ├── audit-report/
│   │   │   ├── periodic-control/
│   │   │   ├── certification/
│   │   │   ├── recommendations/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── audit-checklist/
│   │   │   ├── validation-form/
│   │   │   ├── recommendation-form/
│   │   │   ├── certification-form/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── audit.service.ts
│   │   ├── audit.routes.ts
│   │   └── index.ts
│   ├── social-aid/
│   │   ├── pages/
│   │   │   ├── aid-request/
│   │   │   ├── aid-list/
│   │   │   ├── extraordinary-contribution/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── aid-request-form/
│   │   │   ├── contribution-progress/
│   │   │   ├── event-declaration-form/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── social-aid.service.ts
│   │   ├── social-aid.routes.ts
│   │   └── index.ts
│   ├── settings/
│   │   ├── pages/
│   │   │   ├── profile-settings/
│   │   │   ├── security-settings/
│   │   │   ├── notification-preferences/
│   │   │   ├── tontine-settings/
│   │   │   ├── appearance-settings/
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── profile-form/
│   │   │   ├── password-change-form/
│   │   │   ├── avatar-upload/
│   │   │   ├── settings-section/
│   │   │   └── index.ts
│   │   ├── settings.routes.ts
│   │   └── index.ts
│   ├── admin/
│   │   ├── pages/
│   │   │   ├── admin-dashboard/
│   │   │   ├── user-management/
│   │   │   ├── tontine-management/
│   │   │   ├── system-logs/
│   │   │   ├── system-settings/
│   │   │   └── index.ts
│   │   ├── components/
│   │   ├── services/
│   │   │   └── admin.service.ts
│   │   ├── admin.routes.ts
│   │   └── index.ts
│   └── index.ts
├── app.component.ts
├── app.component.html
├── app.component.scss
├── app.config.ts
└── app.routes.ts

## FICHIERS RACINE

src/
��── index.html
├── main.ts
├── styles.scss
├── assets/
│   ├── fonts/
│   ├── icons/
│   ├── images/
│   │   ├── logos/
│   │   │   ├── logo.svg
│   │   │   └── logo-icon.svg
│   │   └── illustrations/
│   │       ├── auth-bg.svg
│   │       └── empty-state.svg
│   ├── i18n/
│   │   ├── fr.json
│   │   └── en.json
│   └── styles/
│       ├── abstracts/
│       │   ├── _variables.scss
│       │   ├── _mixins.scss
│       │   └── _breakpoints.scss
│       ├── base/
│       │   ├── _reset.scss
│       │   ├── _typography.scss
│       │   └── _global.scss
│       ├── utilities/
│       │   └── _helpers.scss
│       └── main.scss
└── environments/
    ├── environment.ts
    ├── environment.development.ts
    └── environment.production.ts


---

## 📝 NOTES

- Vous pouvez l'utiliser en plusieurs étapes pour générer le projet progressivement
- Adaptez les spécifications selon vos besoins
- La structure suit les meilleures pratiques Angular 21 avec standalone components

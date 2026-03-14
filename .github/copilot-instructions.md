# 📋 INSTRUCTION GITHUB COPILOT - PROJET TONTINE ANGULAR 21

## 🎯 Comment utiliser cette instruction

1. Ouvrez **GitHub Copilot Chat** dans VS Code
2. Copiez l'instruction complète ci-dessous (section "INSTRUCTION À COPIER")
3. Collez dans le chat Copilot et envoyez
4. Copilot générera les fichiers du projet

---

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

## FICHIERS DE CONFIGURATION RACINE

tontine-app/
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.json
├── .prettierrc
├── .gitignore
└── README.md

## ENUMS

### user-role.enum.ts
export enum UserRole {
  PRESIDENT = 'president',
  VICE_PRESIDENT = 'vice_president',
  SECRETARY = 'secretary',
  TREASURER = 'treasurer',
  CENSOR = 'censor',
  AUDITOR = 'auditor',
  MEMBER = 'member'
}

### member-status.enum.ts
export enum MemberStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  RESIGNED = 'resigned',
  BANNED = 'banned'
}

### tontine-status.enum.ts
export enum TontineStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CLOSED = 'closed'
}

### session-status.enum.ts
export enum SessionStatus {
  SCHEDULED = 'scheduled',
  OPENED = 'opened',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

### loan-status.enum.ts
export enum LoanStatus {
  REQUESTED = 'requested',
  GUARANTORS_PENDING = 'guarantors_pending',
  AUDITOR_REVIEW = 'auditor_review',
  PRESIDENT_REVIEW = 'president_review',
  APPROVED = 'approved',
  DISBURSED = 'disbursed',
  REPAYING = 'repaying',
  COMPLETED = 'completed',
  DEFAULTED = 'defaulted'
}

### contribution-status.enum.ts
export enum ContributionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

### sanction-type.enum.ts
export enum SanctionType {
  ABSENCE = 'absence',
  LATE = 'late',
  CONTRIBUTION_LATE = 'contribution_late',
  OTHER = 'other'
}

### payment-method.enum.ts
export enum PaymentMethod {
  CASH = 'cash',
  MTN_MOMO = 'mtn_momo',
  ORANGE_MONEY = 'orange_money',
  BANK_TRANSFER = 'bank_transfer'
}

## MODÈLES PRINCIPAUX

### user.model.ts
export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  address?: string;
  profession?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

### tontine.model.ts
export interface Tontine {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  status: TontineStatus;
  contributionAmount: number;
  currency: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  cycleDurationSessions: number;
  lateToleranceMinutes: number;
  absencePenaltyAmount: number;
  latePenaltyAmount: number;
  loanInterestRate: number;
  potDeductionRate: number;
  minMembers: number;
  maxMembers?: number;
  rulesDocumentUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

### member.model.ts
export interface Member {
  id: string;
  userId: string;
  user: User;
  tontineId: string;
  role: UserRole;
  status: MemberStatus;
  joinedAt: string;
  sponsorId?: string;
  sponsor?: Member;
  tourNumber?: number;
  canRequestLoan: boolean;
  createdAt: string;
  updatedAt: string;
}

### session.model.ts
export interface Session {
  id: string;
  cycleId: string;
  tontineId: string;
  number: number;
  sessionType: 'ordinary' | 'extraordinary';
  scheduledDate: string;
  scheduledTime: string;
  location?: string;
  locationCoordinates?: { lat: number; lng: number };
  beneficiaryId?: string;
  beneficiary?: Member;
  status: SessionStatus;
  agendaValidated: boolean;
  agendaDocumentId?: string;
  minutesDocumentId?: string;
  openedAt?: string;
  closedAt?: string;
  openedBy?: string;
  quorumReached?: boolean;
  createdAt: string;
}

### contribution.model.ts
export interface Contribution {
  id: string;
  memberId: string;
  member: Member;
  sessionId: string;
  tontineId: string;
  amount: number;
  contributionType: 'regular' | 'arrears' | 'extraordinary';
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  status: ContributionStatus;
  paidAt?: string;
  confirmedBy?: string;
  createdAt: string;
}

### loan.model.ts
export interface Loan {
  id: string;
  memberId: string;
  member: Member;
  tontineId: string;
  amount: number;
  interestRate: number;
  durationMonths: number;
  totalToRepay: number;
  monthlyPayment: number;
  status: LoanStatus;
  requestReason?: string;
  guarantors: LoanGuarantor[];
  auditorApproved?: boolean;
  auditorComment?: string;
  auditorApprovedAt?: string;
  presidentApproved?: boolean;
  presidentComment?: string;
  presidentApprovedAt?: string;
  disbursementMethod?: PaymentMethod;
  disbursementReference?: string;
  disbursedAt?: string;
  nextPaymentDate?: string;
  remainingAmount: number;
  createdAt: string;
}

export interface LoanGuarantor {
  id: string;
  loanId: string;
  guarantorId: string;
  guarantor: Member;
  status: 'pending' | 'accepted' | 'refused';
  respondedAt?: string;
}

### sanction.model.ts
export interface Sanction {
  id: string;
  memberId: string;
  member: Member;
  tontineId: string;
  sessionId?: string;
  type: SanctionType;
  reason: string;
  amount: number;
  status: 'pending' | 'paid' | 'contested' | 'cancelled';
  appliedBy: string;
  appliedAt: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  paidAt?: string;
  contested: boolean;
  contestReason?: string;
  contestResult?: 'accepted' | 'rejected';
  cancelledBy?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

### distribution.model.ts
export interface Distribution {
  id: string;
  sessionId: string;
  beneficiaryId: string;
  beneficiary: Member;
  tontineId: string;
  grossAmount: number;
  emergencyFundDeduction: number;
  operationalFundDeduction: number;
  otherDeductions: number;
  netAmount: number;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  status: 'pending' | 'signed' | 'distributed';
  treasurerSignature: boolean;
  presidentSignature: boolean;
  beneficiarySignature: boolean;
  distributedAt?: string;
  createdAt: string;
}

### cash-box.model.ts
export interface CashBox {
  id: string;
  tontineId: string;
  type: 'main' | 'emergency' | 'operational';
  name: string;
  balance: number;
  createdAt: string;
}

### notification.model.ts
export interface Notification {
  id: string;
  userId: string;
  tontineId?: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

## API SERVICES À IMPLÉMENTER

### ApiService (base)
- get<T>(endpoint, params?)
- post<T>(endpoint, body)
- put<T>(endpoint, body)
- patch<T>(endpoint, body)
- delete<T>(endpoint)
- upload<T>(endpoint, formData)

### AuthApiService
- login(credentials): POST /auth/login
- register(data): POST /auth/register
- verifyOtp(data): POST /auth/verify-otp
- resendOtp(phoneNumber): POST /auth/resend-otp
- forgotPassword(data): POST /auth/forgot-password
- resetPassword(data): POST /auth/reset-password
- refreshToken(token): POST /auth/refresh-token
- logout(): POST /auth/logout
- getCurrentUser(): GET /auth/me

### TontineApiService
- getAll(params): GET /tontines
- getById(id): GET /tontines/:id
- create(data): POST /tontines
- update(id, data): PUT /tontines/:id
- delete(id): DELETE /tontines/:id
- getMembers(tontineId, params): GET /tontines/:id/members
- getSessions(tontineId, params): GET /tontines/:id/sessions
- getCashBoxes(tontineId): GET /tontines/:id/cash-boxes

### MemberApiService
- getById(id): GET /members/:id
- update(id, data): PUT /members/:id
- requestAdhesion(tontineId, data): POST /tontines/:id/adhesion
- getAdhesionRequests(tontineId): GET /tontines/:id/adhesion-requests
- approveAdhesion(requestId): POST /adhesion-requests/:id/approve
- rejectAdhesion(requestId, reason): POST /adhesion-requests/:id/reject
- resign(memberId, reason): POST /members/:id/resign
- suspend(memberId, reason): POST /members/:id/suspend
- activate(memberId): POST /members/:id/activate

### SessionApiService
- getById(id): GET /sessions/:id
- create(data): POST /sessions
- update(id, data): PUT /sessions/:id
- open(id): POST /sessions/:id/open
- close(id): POST /sessions/:id/close
- getAttendance(sessionId): GET /sessions/:id/attendance
- markAttendance(sessionId, data): POST /sessions/:id/attendance

### ContributionApiService
- getBySession(sessionId): GET /sessions/:id/contributions
- getByMember(memberId): GET /members/:id/contributions
- create(data): POST /contributions
- confirm(id): POST /contributions/:id/confirm
- getArrears(tontineId): GET /tontines/:id/arrears

### LoanApiService
- getAll(tontineId, params): GET /tontines/:id/loans
- getById(id): GET /loans/:id
- request(data): POST /loans
- respondAsGuarantor(loanId, accept): POST /loans/:id/guarantor-response
- approveAsAuditor(loanId, data): POST /loans/:id/auditor-approval
- approveAsPresident(loanId, data): POST /loans/:id/president-approval
- disburse(loanId, data): POST /loans/:id/disburse
- repay(loanId, data): POST /loans/:id/repay

### SanctionApiService
- getAll(tontineId, params): GET /tontines/:id/sanctions
- getByMember(memberId): GET /members/:id/sanctions
- create(data): POST /sanctions
- pay(id, data): POST /sanctions/:id/pay
- contest(id, reason): POST /sanctions/:id/contest
- resolveContest(id, accept, reason): POST /sanctions/:id/resolve-contest
- cancel(id, reason): POST /sanctions/:id/cancel

## STORES (SIGNALS)

### AuthStore
- _user: signal<User | null>(null)
- _isLoading: signal<boolean>(false)
- user: computed
- isAuthenticated: computed
- userFullName: computed
- setUser(user), logout(), updateProfile(data)

### UiStore
- _sidebarOpen: signal<boolean>(true)
- _theme: signal<'light' | 'dark'>('light')
- _isMobile: signal<boolean>(false)
- _currentRoute: signal<string>('')
- sidebarOpen, theme, isMobile, currentRoute: computed
- toggleSidebar(), setSidebarOpen(open), setTheme(theme), setCurrentRoute(route)

### TontineStore
- _tontines: signal<Tontine[]>([])
- _currentTontine: signal<Tontine | null>(null)
- _currentMember: signal<Member | null>(null)
- _members: signal<Member[]>([])
- _isLoading: signal<boolean>(false)
- tontines, currentTontine, currentMember, members, currentMemberRole: computed
- setTontines(tontines), setCurrentTontine(tontine), setCurrentMember(member), setMembers(members), loadTontines(), loadMembers(tontineId)

### NotificationStore
- _notifications: signal<Notification[]>([])
- _unreadCount: signal<number>(0)
- notifications, unreadCount: computed
- addNotification(notification), markAsRead(id), markAllAsRead(), removeNotification(id)

## GUARDS

### authGuard
- Vérifie si l'utilisateur est authentifié
- Redirige vers /auth/login si non authentifié
- Passe le returnUrl en queryParam

### noAuthGuard
- Vérifie si l'utilisateur n'est PAS authentifié
- Redirige vers /dashboard si déjà connecté

### roleGuard
- Vérifie si l'utilisateur a le rôle requis (route.data['roles'])
- Redirige vers /error/403 si non autorisé

## INTERCEPTORS

### authInterceptor
- Ajoute le header Authorization: Bearer {token}
- Utilise TokenService pour récupérer le token

### errorInterceptor
- Gère les erreurs HTTP (400, 401, 403, 404, 422, 500)
- Affiche les notifications d'erreur
- Déconnecte l'utilisateur si 401
- Redirige vers les pages d'erreur appropriées

### loadingInterceptor
- Affiche/masque le loader global
- Ignore les requêtes avec header X-Skip-Loading

## SERVICES CORE

### StorageService
- get(key), set(key, value), remove(key), clear()
- getObject<T>(key), setObject<T>(key, value)

### TokenService
- getAccessToken(), getRefreshToken()
- setTokens(accessToken, refreshToken)
- clearTokens()
- isTokenExpired()
- getTokenPayload()

### NotificationService (Toast)
- toasts: signal<Toast[]>([])
- success(message, duration?), error(message, duration?), warning(message, duration?), info(message, duration?)
- remove(id), clear()

### LoadingService
- isLoading: computed
- show(), hide(), reset()

### DialogService
- state: signal<DialogState>
- confirm(config): Promise<boolean>
- close(result)

### ThemeService
- theme: signal<'light' | 'dark' | 'system'>
- setTheme(theme), toggleTheme()

### LanguageService
- currentLang: signal<string>
- setLanguage(lang), translate(key)

## PIPES

### currencyXaf
- Formate un nombre en XAF: 50000 -> "50 000 XAF"

### dateFormat
- Formate une date selon le format spécifié

### relativeTime
- Affiche le temps relatif: "il y a 2 heures"

### phoneFormat
- Formate un numéro de téléphone: 677123456 -> "677 12 34 56"

### initials
- Extrait les initiales: "Jean Dupont" -> "JD"

### truncate
- Tronque le texte: "Lorem ipsum dolor..." (avec ellipsis)

### statusLabel
- Convertit un statut en label lisible

### roleLabel
- Convertit un rôle en label lisible

## VALIDATORS

### phoneValidator
- Valide un numéro de téléphone camerounais (+237)
- Format: 6XXXXXXXX (9 chiffres commençant par 6)

### passwordMatchValidator
- Valide que password et passwordConfirmation sont identiques

### amountValidator
- Valide un montant (nombre positif)

## DIRECTIVES

### clickOutside
- Émet un événement quand on clique en dehors de l'élément

### autofocus
- Focus automatique sur l'élément au chargement

### numberOnly
- N'accepte que les chiffres dans l'input

### phoneMask
- Applique un masque de téléphone (XXX XX XX XX)

### currencyMask
- Applique un masque de monnaie avec séparateurs

## COMPOSANTS UI

### ButtonComponent
- Inputs: variant ('primary'|'secondary'|'outline'|'ghost'|'danger'|'success'), size ('sm'|'md'|'lg'), disabled, loading, icon, iconOnly, fullWidth, type
- Output: clicked

### InputComponent
- Inputs: type, placeholder, label, hint, error, disabled, readonly, icon, iconPosition
- ControlValueAccessor

### CardComponent
- Slots: header, content (default), footer
- Inputs: variant, padding, shadow

### ModalComponent
- Inputs: isOpen, title, size, closeOnBackdrop, showClose
- Outputs: closed
- Slots: header, content (default), footer

### AlertComponent
- Inputs: type ('success'|'error'|'warning'|'info'), message, closable
- Output: closed

### SpinnerComponent
- Inputs: size ('sm'|'md'|'lg'), overlay

### BadgeComponent
- Inputs: variant, size, dot

### AvatarComponent
- Inputs: src, name (pour initiales), size

### StatCardComponent
- Inputs: title, value, icon, trend, trendValue, trendDirection

### PageHeaderComponent
- Inputs: title, subtitle, backLink
- Slot: actions

### EmptyStateComponent
- Inputs: icon, title, description, actionLabel
- Output: action

### LoadingStateComponent
- Inputs: message

## COMPOSANTS FORMS

### FormFieldComponent
- Inputs: label, hint, error, required
- Slot: input

### PhoneInputComponent
- ControlValueAccessor
- Préfixe +237
- Masque XXX XX XX XX

### OtpInputComponent
- Inputs: length (default 6), autoSubmit
- Output: completed
- Auto-focus sur le champ suivant

### PasswordInputComponent
- ControlValueAccessor
- Toggle visibilité
- Indicateur de force (optionnel)

## PAGES AUTH

### LoginComponent
- Formulaire: phoneNumber, password
- Liens: register, forgot-password
- Validation réactive
- Appel AuthService.login()

### RegisterComponent
- Formulaire: phoneNumber, firstName, lastName, email?, password, passwordConfirmation
- Validation avec validators customs
- Appel AuthService.register()
- Redirection vers verify-otp

### VerifyOtpComponent
- Input OTP 6 chiffres
- Timer 60s pour resend
- Appel AuthService.verifyOtp()
- Bouton resend OTP

### ForgotPasswordComponent
- Input phoneNumber
- Appel AuthService.forgotPassword()
- Redirection vers reset-password

### ResetPasswordComponent
- Inputs: code, password, passwordConfirmation
- Validation force mot de passe
- Appel AuthService.resetPassword()
- Redirection vers login

## PAGES DASHBOARD

### DashboardHomeComponent
- Charge les stats selon le rôle de l'utilisateur
- Affiche les composants appropriés selon le rôle
- StatsCards, QuickActions, RecentActivities, UpcomingSessions

### StatsCardsComponent
- Affiche 4 cartes de statistiques
- Données: membres actifs, solde caisses, prochaine séance, cotisations

### QuickActionsComponent
- Boutons d'actions rapides selon le rôle
- Exemples: Nouvelle cotisation, Demander prêt, Voir les sanctions

### RecentActivitiesComponent
- Timeline des dernières activités
- Icônes et couleurs selon le type

### UpcomingSessionsComponent
- Liste des prochaines séances
- Date, lieu, bénéficiaire

## LAYOUTS

### MainLayoutComponent
- Structure: header, sidebar, content, footer
- Gestion responsive (sidebar en drawer sur mobile)
- Tontine selector dans le header

### AuthLayoutComponent
- Layout centré pour les pages d'auth
- Logo en haut
- Illustration/background

### HeaderComponent
- Logo, Tontine selector, Notifications bell, User menu
- Menu hamburger sur mobile

### SidebarComponent
- Menu de navigation
- Items selon le rôle de l'utilisateur
- Collapsible

### UserMenuComponent
- Avatar + nom
- Dropdown: Profil, Paramètres, Déconnexion

## ROUTES

### app.routes.ts
- '' -> redirect to 'dashboard'
- 'auth' -> AuthLayout + AUTH_ROUTES (noAuthGuard)
- '' -> MainLayout + children (authGuard)
  - 'dashboard' -> DASHBOARD_ROUTES
  - 'tontines' -> TONTINE_ROUTES
  - 'members' -> MEMBER_ROUTES
  - 'sessions' -> SESSION_ROUTES
  - 'contributions' -> CONTRIBUTION_ROUTES
  - 'distributions' -> DISTRIBUTION_ROUTES
  - 'loans' -> LOAN_ROUTES
  - 'treasury' -> TREASURY_ROUTES (roleGuard: treasurer, president, auditor)
  - 'sanctions' -> SANCTION_ROUTES
  - 'votes' -> VOTE_ROUTES
  - 'documents' -> DOCUMENT_ROUTES
  - 'notifications' -> NOTIFICATION_ROUTES
  - 'audit' -> AUDIT_ROUTES (roleGuard: auditor, president)
  - 'social-aid' -> SOCIAL_AID_ROUTES
  - 'settings' -> SETTINGS_ROUTES
- 'admin' -> ADMIN_ROUTES (roleGuard: super_admin)
- 'error/403', 'error/404', 'error/500'
- '**' -> redirect to 'error/404'

### auth.routes.ts
- 'login' -> LoginComponent
- 'register' -> RegisterComponent
- 'forgot-password' -> ForgotPasswordComponent
- 'reset-password' -> ResetPasswordComponent
- 'verify-otp' -> VerifyOtpComponent

### dashboard.routes.ts
- '' -> DashboardHomeComponent

## TAILWIND CONFIG

Colors:
- primary: blue (50-950)
- secondary: slate (50-950)
- success: green (50, 500, 600, 700)
- warning: amber (50, 500, 600, 700)
- danger: red (50, 500, 600, 700)

Font: Inter

## CONVENTIONS ANGULAR 21

- Tous les composants sont STANDALONE
- Utiliser input() au lieu de @Input()
- Utiliser output() au lieu de @Output()
- Utiliser inject() au lieu du constructor pour DI
- Utiliser signal(), computed() pour l'état
- Utiliser @if, @for, @switch au lieu de *ngIf, *ngFor, [ngSwitch]
- ChangeDetection OnPush par défaut
- Functional guards et interceptors

## STYLES

- TailwindCSS pour tout le styling
- Variables CSS pour le theming (--color-primary, etc.)
- Responsive mobile-first
- Dark mode support avec classe 'dark' sur html

Génère tous les fichiers TypeScript, HTML et SCSS nécessaires pour ce projet Angular 21 complet.
```

---

## 🔄 COMMANDES DE SUIVI

Après avoir généré la structure de base, utilisez ces commandes pour générer des fichiers spécifiques :

```text
Génère le fichier src/app/core/api/services/api.service.ts pour le projet Tontine Angular 21
```

```text
Génère le fichier src/app/core/auth/services/auth.service.ts avec TokenService et AuthApiService
```

```text
Génère le fichier src/app/store/auth/auth.store.ts avec Angular Signals
```

```text
Génère le composant src/app/features/auth/pages/login/login.component.ts avec son template HTML et styles SCSS
```

```text
Génère le fichier src/app/app.routes.ts avec lazy loading pour toutes les features
```

```text
Génère le layout principal src/app/layouts/main-layout/ avec header, sidebar et footer
```

```text
Génère les composants UI de base: button, input, card, modal, alert, spinner dans src/app/shared/components/ui/
```

```text
Génère le dashboard avec stats-cards, quick-actions et recent-activities
```

```text
Génère les fichiers de configuration: package.json, angular.json, tsconfig.json, tailwind.config.js
```

```text
Génère tous les enums dans src/app/core/enums/
```

```text
Génère tous les modèles d'entités dans src/app/shared/models/entities/
```

---

## 📁 TÉLÉCHARGEMENT

Pour télécharger ce fichier :
1. Cliquez sur le bouton "Raw" en haut à droite
2. Faites Ctrl+S (ou Cmd+S sur Mac) pour sauvegarder
3. Nommez le fichier `COPILOT_INSTRUCTION_TONTINE_ANGULAR21.md`

---

## 📝 NOTES

- Cette instruction est optimisée pour GitHub Copilot dans VS Code
- Vous pouvez l'utiliser en plusieurs étapes pour générer le projet progressivement
- Adaptez les spécifications selon vos besoins
- La structure suit les meilleures pratiques Angular 21 avec standalone components
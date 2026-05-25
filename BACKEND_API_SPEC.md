# 📡 Spécification Backend – TontineConnect

> Document technique généré à partir des **services Angular**, des **modèles** et des **enums** du frontend `ndah-connect-web`. Il décrit l'ensemble des **endpoints REST**, **contrats DTO**, **statuts métier** et **règles fonctionnelles** que doit implémenter l'API backend.

- **Base URL** : `${API_BASE_URL}` (variable d'environnement `apiUrl`)
- **Format** : JSON UTF-8 (`Content-Type: application/json`)
- **Authentification** : JWT Bearer (`Authorization: Bearer <accessToken>`) sauf endpoints `/auth/*` publics
- **Locale par défaut** : `fr-CM` · **Devise** : `XAF` · **Pays** : `+237`
- **Pagination** : `?page=1&pageSize=20&sortBy=...&sortDir=asc|desc&search=...`
- **Multi-tenant** : chaque ressource non-globale est rattachée à une **tontine active** (header `X-Tontine-Id` ou inférée du token / `activeTontineId`)

---

## 0. Conventions transverses

### 0.1 Enveloppe de réponse standard

Toutes les réponses succès suivent ce contrat :

```ts
// Single resource
interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string; // ISO-8601
}

// Collection paginée
interface ApiListResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  timestamp: string;
}
```

### 0.2 Enveloppe d'erreur

```ts
interface ApiError {
  code: string;                              // "AUTH_INVALID_CREDENTIALS"
  message: string;                           // "Identifiant ou mot de passe incorrect"
  details?: Record<string, string[]>;        // Erreurs par champ
  timestamp: string;
  path?: string;
  status: number;                            // HTTP status code
}
```

**Codes HTTP** : `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`.

### 0.3 Sécurité & rôles (`UserRole`)

| Rôle        | Code         | Label                  |
| ----------- | ------------ | ---------------------- |
| Président   | `PRESIDENT`  | Président              |
| Secrétaire  | `SECRETARY`  | Secrétaire             |
| Trésorier   | `TREASURER`  | Trésorier              |
| Censeur     | `CENSOR`     | Censeur                |
| Commissaire | `AUDITOR`    | Commissaire aux Comptes|
| Membre      | `MEMBER`     | Membre                 |

> Tous les endpoints sous `/{role}/...` exigent que l'utilisateur ait **ce rôle exact** dans la tontine active. Les rôles peuvent être combinés (un user peut être MEMBER + TREASURER).

---

## 1. Authentification — `/auth`

| Méthode | Endpoint                  | Description                          | Auth |
| ------- | ------------------------- | ------------------------------------ | ---- |
| POST    | `/auth/register`          | Inscription                          | ❌    |
| POST    | `/auth/verify-otp`        | Vérification OTP (téléphone/email)   | ❌    |
| POST    | `/auth/login`             | Connexion                            | ❌    |
| POST    | `/auth/forgot-password`   | Demande de reset                     | ❌    |
| POST    | `/auth/reset-password`    | Reset via OTP                        | ❌    |
| POST    | `/auth/refresh`           | Refresh token                        | 🟡 Refresh |
| POST    | `/auth/logout`            | Déconnexion                          | ✅    |
| GET     | `/auth/me`                | Profil courant                       | ✅    |

### 1.1 DTOs

```ts
interface RegisterPayload {
  firstName: string;
  lastName: string;
  phone: string;     // E.164 (+237...)
  email: string;
  password: string;  // min 8 caractères
}
// Réponse: { identifier: string }  → utilisé pour verify-otp

interface OtpPayload {
  identifier: string;   // phone ou email
  code: string;         // 6 chiffres
}
// Réponse: AuthSession

interface LoginPayload {
  identifier: string;   // phone ou email
  password: string;
  rememberMe?: boolean;
}
// Réponse: AuthSession

interface ResetPasswordPayload {
  identifier: string;
  code: string;
  newPassword: string;
}

interface AuthSession {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;    // secondes
  };
  activeTontineId?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  roles: UserRole[];
  isActive: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 1.2 Codes d'erreur

| Code                          | Description                       |
| ----------------------------- | --------------------------------- |
| `AUTH_INVALID_CREDENTIALS`    | login KO                          |
| `AUTH_OTP_INVALID`            | OTP erroné/expiré                 |
| `AUTH_USER_EXISTS`            | Téléphone ou email déjà utilisé   |
| `AUTH_PHONE_NOT_VERIFIED`     | Compte non vérifié                |
| `AUTH_TOKEN_EXPIRED`          | Token expiré                      |

---

## 2. Tontines — `/tontines`

| Méthode | Endpoint           | Description                              | Auth         |
| ------- | ------------------ | ---------------------------------------- | ------------ |
| GET     | `/tontines`        | Liste publique (admin only)              | ADMIN        |
| GET     | `/tontines/mine`   | Mes tontines (membre ou bureau)          | ✅           |
| POST    | `/tontines`        | Créer une tontine (assistant fondateur)  | ✅ (créateur)|
| GET     | `/tontines/:id`    | Détail tontine                           | ✅           |
| PATCH   | `/tontines/:id`    | Mise à jour (président)                  | PRESIDENT    |
| GET     | `/tontines/:id/cycles` | Liste cycles                         | ✅           |

### 2.1 DTOs

```ts
interface Tontine {
  id: string;
  name: string;
  description?: string;
  status: TontineStatus;            // DRAFT | ACTIVE | PAUSED | COMPLETED | CLOSED
  contributionAmount: number;       // XAF
  frequency: ContributionFrequency; // WEEKLY | BIWEEKLY | MONTHLY
  startDate: string;
  endDate?: string;
  memberCount: number;
  maxMembers: number;
  currentCycleId?: string;
  totalSaved: number;
  createdAt: string;
  updatedAt: string;
  createdByUserId?: string;
  rules?: TontineRules;
  founders?: FounderInvite[];
}

interface TontineRules {
  latePenaltyAmount: number;
  absencePenaltyAmount: number;
  contributionLatePenaltyAmount: number;
  loanMaxAmount: number;
  loanInterestRatePercent: number;        // ex: 5
  loanMaxDurationMonths: number;
  expenseCapWithoutValidation: number;    // XAF
  emergencyDeductionPercent: number;      // 0..100
  operationsDeductionPercent: number;     // 0..100
}

interface FounderInvite {
  fullName: string;
  phone: string;
  email?: string;
  role: 'PRESIDENT'|'SECRETARY'|'TREASURER'|'CENSOR'|'AUDITOR'|'MEMBER';
}

interface CreateTontinePayload {
  name: string;
  description?: string;
  startDate: string;
  contributionAmount: number;
  frequency: ContributionFrequency;
  maxMembers: number;
  rules: TontineRules;
  founders: FounderInvite[];
}

interface Cycle {
  id: string;
  tontineId: string;
  number: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  totalSessions: number;
  completedSessions: number;
  totalCollected: number;
}
```

---

## 3. Espace Membre — `/members/me`

Endpoints accessibles à **tout utilisateur authentifié** ayant au moins un membership actif.

| Méthode | Endpoint                       | Description                  |
| ------- | ------------------------------ | ---------------------------- |
| GET     | `/members/me/summary`          | Synthèse personnelle         |
| GET     | `/members/me/contributions`    | Mes cotisations              |
| GET     | `/members/me/loans`            | Mes prêts                    |
| GET     | `/members/me/planning`         | Mes prochaines séances       |

### 3.1 DTOs

```ts
interface MemberSummary {
  member: Member;
  tontine?: Tontine;
  totalContributed: number;
  totalArrears: number;
  activeLoans: number;
  nextSession?: Session;
  tourPosition?: number;
}

interface Member {
  id: string;
  userId: string;
  tontineId: string;
  matricule: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  status: MemberStatus;          // PENDING | ACTIVE | SUSPENDED | RESIGNED | EXCLUDED
  roles: UserRole[];
  joinedAt: string;
  tourOrder?: number;
  hasReceivedTour: boolean;
  totalContributed: number;
  totalArrears: number;
}
```

### 3.2 Simulateur de prêt (côté backend recommandé)

> Le simulateur tourne aussi côté front (`simulateLoan`) — formule du **prêt à mensualité fixe** : `M = P × i / (1 - (1 + i)^-n)` où `i = annualRate / 12`.

Optionnel : `POST /loans/simulate` → renvoie `LoanSimulation`.

---

## 4. Président — `/president`

### 4.1 Dashboard

| Méthode | Endpoint               | Description     |
| ------- | ---------------------- | --------------- |
| GET     | `/president/dashboard` | KPI + alertes   |

```ts
interface PresidentDashboard {
  kpi: PresidentKpi;
  alerts: { id: string; level: 'CRITICAL'|'WARNING'|'INFO'; message: string; link?: string }[];
  pendingValidations: { id: string; title: string; category: string; priority: Priority; amount?: number }[];
  performance: PresidentPerformanceTrend[];
  recentDecisions: PresidentDecisionLogEntry[];
  agenda: PresidentAgendaItem[];
}

interface PresidentKpi {
  totalCashBalance: number;
  activeMembersCount: number;
  activeLoansCount: number;
  activeLoansAmount: number;
  pendingSanctionsCount: number;
  pendingSanctionsAmount: number;
  nextSessionInDays?: number;
  nextSessionNumber?: number;
  contributionRate: number;        // 0..100
  pendingValidationsCount: number;
  cycleProgressPercent: number;
  cycleCompletedSessions: number;
  cycleTotalSessions: number;
}
```

### 4.2 Validations

| Méthode | Endpoint                                     | Description                            |
| ------- | -------------------------------------------- | -------------------------------------- |
| GET     | `/president/validations?category=...`        | Liste filtrée par `ValidationCategory` |
| GET     | `/president/validations/:id`                 | Détail polymorphe                      |
| POST    | `/president/validations/:id/decide`          | Décision (Approve / Reject / Blocked)  |

```ts
type ValidationCategory = 'FINANCIAL_OPERATION'|'DOCUMENT'|'ADHESION'|'RESIGNATION';
type DecisionType = 'APPROVED'|'REJECTED'|'BLOCKED';
type Priority = 'CRITICAL'|'HIGH'|'NORMAL'|'LOW';

interface DecisionPayload {
  decision: DecisionType;
  comment?: string;
}

// Discriminated union (champ `category`)
type PendingValidation = FinancialOperationValidation | DocumentValidation | AdhesionValidation;

interface PendingValidationBase {
  id: string;
  tontineId: string;
  category: ValidationCategory;
  title: string;
  description: string;
  amount?: number;
  priority: Priority;
  submittedByUserId: string;
  submittedByFullName: string;
  submittedAt: string;
  auditorOpinion?: {
    status: 'FAVORABLE'|'RESERVED'|'UNFAVORABLE';
    comment?: string;
    userId: string;
    userFullName: string;
    emittedAt: string;
  };
}

interface FinancialOperationValidation extends PendingValidationBase {
  category: 'FINANCIAL_OPERATION';
  operationType: 'LOAN_DISBURSEMENT'|'FUND_TRANSFER'|'EXPENSE_ABOVE_CAP';
  reference: string;
  borrowerProfile?: BorrowerProfile;
  guarantors?: { memberId: string; fullName: string; approved: boolean }[];
  cashBox?: { name: string; balanceBefore: number; balanceAfter: number; isSufficient: boolean };
  durationMonths?: number;
  interestRate?: number;
  totalDue?: number;
}

interface DocumentValidation extends PendingValidationBase {
  category: 'DOCUMENT';
  documentKind: 'AGENDA'|'MINUTES'|'ADHESION_FILE';
  sessionNumber?: number;
  sessionDate?: string;
  location?: string;
  beneficiary?: string;
  agendaPoints?: { order: number; title: string }[];
  signedBySecretary?: boolean;
  signedBySecretaryAt?: string;
  attachments?: { id: string; name: string }[];
  previewSnippet?: string;
}

interface AdhesionValidation extends PendingValidationBase {
  category: 'ADHESION';
  candidateFullName: string;
  candidatePhone: string;
  candidateEmail: string;
  sponsorFullName?: string;
  votedByAssembly: boolean;
  voteResult?: 'APPROVED'|'REJECTED';
}
```

### 4.3 Sanctions (vue président)

| Méthode | Endpoint                                  | Description           |
| ------- | ----------------------------------------- | --------------------- |
| GET     | `/president/sanctions`                    | Sanctions à examiner  |
| POST    | `/president/sanctions/:id/waive`          | Lever sanction        |
| POST    | `/president/sanctions/:id/confirm`        | Confirmer             |

```ts
// Body waive
{ "reason": "string" }
```

### 4.4 Annonces

| Méthode | Endpoint                       | Description     |
| ------- | ------------------------------ | --------------- |
| GET     | `/president/announcements`     | Liste           |
| POST    | `/president/announcements`     | Publier         |

```ts
interface Announcement {
  id: string;
  tontineId: string;
  authorUserId: string;
  authorFullName: string;
  title: string;
  body: string;
  audience: 'ALL'|'BUREAU'|'MEMBERS';
  channels: ('IN_APP'|'SMS'|'EMAIL')[];
  publishedAt: string;
}
```

### 4.5 Séances live (présider)

| Méthode | Endpoint                                                    | Description              |
| ------- | ----------------------------------------------------------- | ------------------------ |
| GET     | `/president/sessions`                                       | Liste                    |
| GET     | `/president/sessions/:id`                                   | Live session             |
| POST    | `/president/sessions/:id/open`                              | Ouvrir séance            |
| POST    | `/president/sessions/:id/agenda/:agendaId/advance`          | Avancer ordre du jour    |
| POST    | `/president/sessions/:id/sign-cagnotte`                     | Signer la cagnotte       |
| POST    | `/president/sessions/:id/close`                             | Clôturer (body: `{ nextSessionDate? }`) |

```ts
interface SessionLive {
  id: string;
  tontineId: string;
  cycleId: string;
  number: number;
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  location?: string;
  status: SessionStatus; // SCHEDULED|IN_PROGRESS|COMPLETED|CANCELLED|PENDING_VALIDATION|VALIDATED
  agenda: AgendaItem[];
  attendance: SessionAttendanceEntry[];
  totalCollected: number;
  totalDistributed: number;
  quorumThreshold: number;     // % requis
  beneficiaryMemberId?: string;
  beneficiaryFullName?: string;
  cagnotteAmount?: number;
  cagnotteSignedByPresident: boolean;
}

interface AgendaItem {
  id: string;
  order: number;
  title: string;
  description?: string;
  status: 'PENDING'|'IN_PROGRESS'|'DONE'|'SKIPPED';
}

interface SessionAttendanceEntry {
  memberId: string;
  fullName: string;
  status: 'PRESENT'|'ABSENT'|'LATE'|'EXCUSED';
  checkInAt?: string;
}
```

### 4.6 Dossiers d'adhésion / démission

| Méthode | Endpoint                                      | Description                    |
| ------- | --------------------------------------------- | ------------------------------ |
| GET     | `/president/membership?kind=ADHESION`         | `MembershipFileKind`           |
| GET     | `/president/membership/:id`                   | Détail                         |
| POST    | `/president/membership/:id/decide`            | `{ decision: 'APPROVE'\|'REJECT', comment? }` |

```ts
type MembershipFileKind = 'ADHESION'|'RESIGNATION'|'EXCLUSION';
type MembershipFileStatus = 'SUBMITTED'|'BUREAU_REVIEW'|'ASSEMBLY_VOTE_PENDING'
  |'ASSEMBLY_APPROVED'|'ASSEMBLY_REJECTED'|'PRESIDENT_REVIEW'|'APPROVED'|'REJECTED';

interface MembershipFile {
  id: string;
  tontineId: string;
  kind: MembershipFileKind;
  candidateFullName: string;
  candidatePhone?: string;
  candidateEmail?: string;
  memberId?: string;
  sponsorFullName?: string;
  motivation: string;
  status: MembershipFileStatus;
  submittedAt: string;
  bureauReviewedAt?: string;
  assemblyVotedAt?: string;
  assemblyVoteYes?: number;
  assemblyVoteNo?: number;
  assemblyVoteAbstain?: number;
  presidentDecidedAt?: string;
  presidentDecisionComment?: string;
  attachments?: { id: string; name: string }[];
  history: { at: string; actor: string; action: string; note?: string }[];
}
```

### 4.7 Cotisations extraordinaires

| Méthode | Endpoint                                                              | Description |
| ------- | --------------------------------------------------------------------- | ----------- |
| GET     | `/president/extraordinary-contributions`                              | Liste       |
| POST    | `/president/extraordinary-contributions`                              | Créer       |
| POST    | `/president/extraordinary-contributions/:id/close`                    | Clore       |
| POST    | `/president/extraordinary-contributions/:id/distribute`               | Distribuer  |

```ts
interface CreateExtraordinaryContributionPayload {
  motive: string;
  beneficiaryMemberId?: string;
  amountPerMember: number;
  dueDate: string;
  exemptBeneficiary: boolean;
}

interface ExtraordinaryContribution {
  id: string;
  tontineId: string;
  motive: string;
  beneficiaryMemberId?: string;
  beneficiaryFullName?: string;
  amountPerMember: number;
  dueDate: string;
  status: 'DRAFT'|'COLLECTING'|'CLOSED'|'DISTRIBUTED'|'CANCELLED';
  exemptBeneficiary: boolean;
  totalExpected: number;
  totalCollected: number;
  members: {
    memberId: string;
    fullName: string;
    expected: number;
    paid: number;
    exempted: boolean;
    paidAt?: string;
  }[];
  votedByAssemblyAt: string;
  createdAt: string;
  closedAt?: string;
  distributedAt?: string;
}
```

### 4.8 Conflits

| Méthode | Endpoint                                                       | Description            |
| ------- | -------------------------------------------------------------- | ---------------------- |
| GET     | `/president/conflicts`                                         | Liste                  |
| GET     | `/president/conflicts/:id`                                     | Détail                 |
| POST    | `/president/conflicts/:id/schedule-mediation`                  | `{ scheduledAt, note? }` |
| POST    | `/president/conflicts/:id/decide`                              | `{ outcome, comment }`   |

```ts
type ConflictStatus = 'OPEN'|'MEDIATION_SCHEDULED'|'MEDIATED'|'DECIDED_BY_PRESIDENT'|'ESCALATED_TO_ASSEMBLY'|'CLOSED';
type ConflictDecisionOutcome = 'MEDIATION'|'SANCTION'|'WARNING'|'EXCLUSION_PROPOSED'|'CASE_CLOSED';

interface Conflict {
  id: string;
  tontineId: string;
  subject: string;
  description: string;
  parties: { memberId: string; fullName: string; role?: 'INITIATOR'|'RESPONDENT'|'WITNESS' }[];
  status: ConflictStatus;
  escalatedByUserId: string;
  escalatedByFullName: string;
  escalatedAt: string;
  severity: 'LOW'|'MEDIUM'|'HIGH';
  history: { at: string; actor: string; action: string; note?: string }[];
  decisionOutcome?: ConflictDecisionOutcome;
  decisionComment?: string;
  decidedAt?: string;
  mediationScheduledAt?: string;
}
```

### 4.9 Clôture de cycle

| Méthode | Endpoint                                | Description                                                 |
| ------- | --------------------------------------- | ----------------------------------------------------------- |
| GET     | `/president/cycle-close`                | État de la clôture                                          |
| POST    | `/president/cycle-close/check/:key`     | Marquer une checklist comme faite                           |
| POST    | `/president/cycle-close/sign`           | `{ nextCycleStartDate, drawMode: 'RANDOM'\|'SENIORITY'\|'ASSEMBLY_VOTE' }` |

```ts
interface CycleClose {
  id: string;
  tontineId: string;
  cycleId: string;
  cycleNumber: number;
  status: 'NOT_STARTED'|'IN_PROGRESS'|'AUDITOR_VALIDATED'|'PRESIDENT_SIGNED'|'CLOSED';
  checklist: { key: string; label: string; status: 'PENDING'|'DONE'|'BLOCKED'; blockingReason?: string }[];
  summary: {
    totalCollected: number;
    totalDistributed: number;
    totalLoansOutstanding: number;
    totalSanctionsCollected: number;
    netResult: number;
    membersRetained: number;
    newMembersNextCycle: number;
  };
  auditorValidatedAt?: string;
  presidentSignedAt?: string;
  closedAt?: string;
  nextCycleStartDate?: string;
  nextCycleDrawMode?: 'RANDOM'|'SENIORITY'|'ASSEMBLY_VOTE';
}
```

### 4.10 Votes

| Méthode | Endpoint                          | Description |
| ------- | --------------------------------- | ----------- |
| GET     | `/president/votes`                | Liste       |
| GET     | `/president/votes/:id`            | Détail      |
| POST    | `/president/votes`                | Créer       |
| POST    | `/president/votes/:id/close`      | Clôturer    |

```ts
interface CreateVotePayload {
  question: string;
  description?: string;
  options: string[];          // 2..N labels
  isAnonymous: boolean;
  hideResultsUntilClose: boolean;
  scope: 'STANDARD'|'ASSEMBLY';
  audience: 'ALL'|'BUREAU'|'MEMBERS_ACTIVE';
  opensAt: string;
  closesAt: string;
  quorumPercent: number;       // 0..100
}

interface Vote {
  id: string;
  tontineId: string;
  question: string;
  description?: string;
  options: { id: string; label: string; count: number }[];
  isAnonymous: boolean;
  hideResultsUntilClose: boolean;
  scope: 'STANDARD'|'ASSEMBLY';
  audience: 'ALL'|'BUREAU'|'MEMBERS_ACTIVE';
  status: 'DRAFT'|'OPEN'|'CLOSED'|'CANCELLED';
  opensAt: string;
  closesAt: string;
  createdByUserId: string;
  createdByFullName: string;
  createdAt: string;
  totalVoters: number;
  totalVoted: number;
  quorumPercent: number;
  passed?: boolean;
}
```

### 4.11 Délégations de pouvoir

| Méthode | Endpoint                                    | Description                       |
| ------- | ------------------------------------------- | --------------------------------- |
| GET     | `/president/delegations`                    | Liste                             |
| POST    | `/president/delegations`                    | Créer                             |
| POST    | `/president/delegations/:id/revoke`         | `{ reason }`                      |

```ts
type DelegationPower =
  | 'VALIDATE_DOCUMENTS'
  | 'VALIDATE_FINANCIAL_OPS'
  | 'PRESIDE_SESSION'
  | 'WAIVE_SANCTIONS'
  | 'PUBLISH_ANNOUNCEMENTS'
  | 'LAUNCH_VOTE';

interface CreateDelegationPayload {
  delegateeUserId: string;
  powers: DelegationPower[];
  reason: string;
  startsAt: string;
  endsAt: string;
}

interface Delegation {
  id: string;
  tontineId: string;
  delegateeUserId: string;
  delegateeFullName: string;
  delegateeRole: UserRole;
  powers: DelegationPower[];
  reason: string;
  startsAt: string;
  endsAt: string;
  status: 'ACTIVE'|'REVOKED'|'EXPIRED';
  createdAt: string;
  revokedAt?: string;
  revokedReason?: string;
}
```

### 4.12 Blocages d'urgence

| Méthode | Endpoint                                            | Description |
| ------- | --------------------------------------------------- | ----------- |
| GET     | `/president/emergency-blocks`                       | Liste       |
| POST    | `/president/emergency-blocks`                       | Activer     |
| POST    | `/president/emergency-blocks/:id/lift`              | `{ reason }`|

```ts
type EmergencyBlockTarget = 'CASH_BOX'|'LOAN_DISBURSEMENT'|'TRANSFER'|'MEMBER_ACCOUNT'|'WHOLE_TONTINE';

interface CreateEmergencyBlockPayload {
  target: EmergencyBlockTarget;
  targetRef?: string;       // id de la cible (cashBoxId, memberId, etc.)
  reason: string;
}

interface EmergencyBlock {
  id: string;
  tontineId: string;
  target: EmergencyBlockTarget;
  targetRef?: string;
  reason: string;
  status: 'ACTIVE'|'LIFTED';
  activatedByUserId: string;
  activatedByFullName: string;
  activatedAt: string;
  liftedByUserId?: string;
  liftedAt?: string;
  liftReason?: string;
}
```

### 4.13 Rapports

| Méthode | Endpoint                                | Description                   |
| ------- | --------------------------------------- | ----------------------------- |
| GET     | `/president/reports?category=...`       | Filtre `ReportCategory`       |
| GET     | `/president/reports/:id`                | Détail                        |

```ts
type ReportCategory = 'TREASURY'|'AUDIT'|'CENSOR'|'PERIODIC'|'CYCLE';

interface ReportEntry {
  id: string;
  tontineId: string;
  category: ReportCategory;
  title: string;
  description?: string;
  periodLabel: string;
  authorFullName: string;
  generatedAt: string;
  metricsJson?: Record<string, number | string>;
  downloadUrlPdf?: string;
  downloadUrlExcel?: string;
}
```

---

## 5. Secrétaire — `/secretary`

### 5.1 Dashboard

| Méthode | Endpoint               | Description |
| ------- | ---------------------- | ----------- |
| GET     | `/secretary/dashboard` | Synthèse    |

```ts
interface SecretaryDashboard {
  nextSession: {
    id: string;
    number: number;
    scheduledAt: string;
    location?: string;
    daysUntil: number;
  } | null;
  rsvpSummary: SessionRsvpSummary | null;
  kpi: {
    minutesPending: number;
    agendaPending: number;
    pendingAdhesions: number;
    pendingResignations: number;
    totalMembers: number;
    archivesCount: number;
  };
  recentActivity: { id: string; label: string; status: string; updatedAt: string }[];
}
```

### 5.2 Ordres du jour (`agendas`)

| Méthode | Endpoint                              | Description                    |
| ------- | ------------------------------------- | ------------------------------ |
| GET     | `/secretary/agendas`                  | Liste                          |
| GET     | `/secretary/agendas/:id`              | Détail                         |
| POST    | `/secretary/agendas`                  | Créer brouillon                |
| POST    | `/secretary/agendas/:id/submit`       | Envoyer au président           |

```ts
interface CreateAgendaDraftPayload {
  sessionId: string;
  sessionNumber: number;
  scheduledAt: string;
  location?: string;
  beneficiaryMemberId?: string;
  items: {
    title: string;
    description?: string;
    isStandard: boolean;
    estimatedDurationMin?: number;
  }[];
}

interface AgendaDraft {
  id: string;
  tontineId: string;
  sessionId?: string;
  sessionNumber: number;
  scheduledAt: string;
  location?: string;
  beneficiaryMemberId?: string;
  beneficiaryFullName?: string;
  items: {
    id: string;
    order: number;
    title: string;
    description?: string;
    isStandard: boolean;
    estimatedDurationMin?: number;
    proposedBy?: string;
  }[];
  status: 'DRAFT'|'SUBMITTED_TO_PRESIDENT'|'CHANGES_REQUESTED'|'APPROVED'|'PUBLISHED';
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  publishedAt?: string;
  presidentComment?: string;
}
```

### 5.3 Convocations

| Méthode | Endpoint                       | Description |
| ------- | ------------------------------ | ----------- |
| GET     | `/secretary/convocations`      | Liste       |
| POST    | `/secretary/convocations`      | Envoyer     |

```ts
type ConvocationChannel = 'IN_APP'|'SMS'|'EMAIL'|'WHATSAPP';

interface CreateConvocationPayload {
  sessionId: string;
  channels: ConvocationChannel[];
  audienceMemberIds: string[];
  includeCandidates?: boolean;
  message: string;
  reminders?: { offsetHoursBefore: number }[];
  scheduledAt?: string;
}

interface Convocation {
  id: string;
  tontineId: string;
  sessionId: string;
  sessionNumber: number;
  scheduledFor: string;
  channels: ConvocationChannel[];
  audienceMemberIds: string[];
  includeCandidates: boolean;
  reminders: { offsetHoursBefore: number }[];
  message: string;
  status: 'DRAFT'|'SCHEDULED'|'SENT';
  sentAt?: string;
  scheduledAt?: string;
  totalRecipients: number;
  totalDelivered: number;
  totalFailed: number;
}
```

### 5.4 RSVP

| Méthode | Endpoint                                                       | Description                |
| ------- | -------------------------------------------------------------- | -------------------------- |
| GET     | `/secretary/sessions/:sessionId/rsvps`                         | Résumé RSVP                |
| POST    | `/secretary/sessions/:sessionId/rsvps/:memberId`               | `{ status, reason? }`      |
| POST    | `/secretary/sessions/:sessionId/rsvps/remind`                  | Relancer les non-répondus  |

```ts
type RsvpStatus = 'PENDING'|'CONFIRMED'|'DECLINED'|'TENTATIVE';

interface SessionRsvpSummary {
  sessionId: string;
  sessionNumber: number;
  scheduledAt: string;
  totalMembers: number;
  confirmed: number;
  declined: number;
  tentative: number;
  pending: number;
  quorumPercent: number;
  quorumReached: boolean;
  rsvps: {
    sessionId: string;
    memberId: string;
    memberFullName: string;
    status: RsvpStatus;
    reason?: string;
    respondedAt?: string;
  }[];
}
```

### 5.5 Présence

| Méthode | Endpoint                                                          | Description                |
| ------- | ----------------------------------------------------------------- | -------------------------- |
| POST    | `/secretary/sessions/:sessionId/attendance/:memberId`             | `{ status }` (PRESENT...)  |
| POST    | `/secretary/sessions/:sessionId/attendance/finalize`              | Clôture présence           |

### 5.6 Procès-verbaux (`minutes`)

| Méthode | Endpoint                              | Description              |
| ------- | ------------------------------------- | ------------------------ |
| GET     | `/secretary/minutes`                  | Liste                    |
| GET     | `/secretary/minutes/:id`              | Détail                   |
| PUT     | `/secretary/minutes/:id`              | `{ sections }`           |
| POST    | `/secretary/minutes/:id/sign`         | Signer (secrétaire)      |

```ts
interface MinutesSection {
  key: string;
  title: string;
  content: string;
  required: boolean;
}

interface MinutesDraft {
  id: string;
  tontineId: string;
  sessionId: string;
  sessionNumber: number;
  sessionDate: string;
  attendanceSummary: {
    present: number;
    late: number;
    absent: number;
    excused: number;
    total: number;
    quorumReached: boolean;
  };
  financialSummary: {
    totalCollected: number;
    totalDistributed: number;
    beneficiaryFullName?: string;
  };
  sections: MinutesSection[];
  attachments: { id: string; name: string }[];
  status: 'DRAFT'|'SECRETARY_SIGNED'|'PRESIDENT_SIGNED'|'PUBLISHED'|'CHANGES_REQUESTED';
  secretarySignedAt?: string;
  presidentSignedAt?: string;
  publishedAt?: string;
  presidentComment?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 5.7 Membership (Secrétaire)

| Méthode | Endpoint                                          | Description                           |
| ------- | ------------------------------------------------- | ------------------------------------- |
| GET     | `/secretary/membership?kind=...`                  | Liste                                 |
| POST    | `/secretary/membership/:id/review`                | `{ decision: 'FORWARD'\|'REJECT', comment? }` |

### 5.8 Registre des membres

| Méthode | Endpoint                       | Description                              |
| ------- | ------------------------------ | ---------------------------------------- |
| GET     | `/secretary/members`           | Liste                                    |
| PATCH   | `/secretary/members/:id`       | Update partiel `phone`, `email`, `matricule` |

### 5.9 Archives

| Méthode | Endpoint                                  | Description                       |
| ------- | ----------------------------------------- | --------------------------------- |
| GET     | `/secretary/archives?type=...&cycle=...`  | Liste                             |
| POST    | `/secretary/archives`                     | Créer (multipart à prévoir)       |

```ts
type ArchiveDocumentType =
  | 'MINUTES'|'AGENDA'|'FINANCIAL_REPORT'|'AUDIT_REPORT'
  | 'CONVOCATION'|'ATTENDANCE_SHEET'|'ADHESION_FILE'|'BYLAW'|'OTHER';

interface CreateArchivePayload {
  type: ArchiveDocumentType;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  visibility: 'ALL_MEMBERS'|'BUREAU'|'RESTRICTED';
  cycleNumber?: number;
  sessionNumber?: number;
  tags?: string[];
}
```

### 5.10 Annonces & Rapports (secrétaire)

| Méthode | Endpoint                              | Description                       |
| ------- | ------------------------------------- | --------------------------------- |
| GET     | `/secretary/announcements`            | Liste                             |
| POST    | `/secretary/announcements`            | Publier                           |
| GET     | `/secretary/reports`                  | Liste                             |
| POST    | `/secretary/reports/generate`         | `{ category, periodLabel }`       |

```ts
interface GenerateSecretaryReportPayload {
  category: 'PERIODIC'|'CYCLE'|'ATTENDANCE'|'MEMBERSHIP';
  periodLabel: string;
}
```

---

## 6. Trésorier — `/treasurer`

### 6.1 Dashboard

```ts
interface TreasurerDashboard {
  totalBalance: number;
  cashBoxes: CashBox[];
  pendingMobileMoney: number;
  pendingTransfers: number;
  pendingExpenses: number;
  pendingDistributions: number;
  sanctionsToCollect: number;
  upcomingRepayments: number;
  recentMovements: CashMovement[];
}
```

### 6.2 Cotisations

| Méthode | Endpoint                                      | Description                |
| ------- | --------------------------------------------- | -------------------------- |
| GET     | `/treasurer/contributions?sessionId=...`      | Liste                      |
| POST    | `/treasurer/contributions/:id/pay`            | Encaisser                  |
| POST    | `/treasurer/contributions/advance`            | Cotisation par anticipation |

```ts
type PaymentMethod = 'CASH'|'MOBILE_MONEY'|'ORANGE_MONEY'|'BANK_TRANSFER'|'CHECK';
type ContributionStatus = 'PENDING'|'PARTIAL'|'PAID'|'LATE'|'EXEMPTED';

interface PayContributionPayload {
  amount: number;
  paymentMethod: PaymentMethod;
  reference?: string;
  note?: string;
}

interface AdvancePaymentPayload {
  memberId: string;
  sessionIds: string[];
  amount: number;
  paymentMethod: PaymentMethod;
}

interface Contribution {
  id: string;
  tontineId: string;
  sessionId: string;
  memberId: string;
  expectedAmount: number;
  paidAmount: number;
  status: ContributionStatus;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  reference?: string;
  collectedByUserId?: string;
  note?: string;
}
```

### 6.3 Mobile Money

| Méthode | Endpoint                                            | Description                  |
| ------- | --------------------------------------------------- | ---------------------------- |
| GET     | `/treasurer/mobile-money`                           | Transactions entrantes       |
| POST    | `/treasurer/mobile-money/:id/approve`               | `{ contributionId? }`        |
| POST    | `/treasurer/mobile-money/:id/reject`                | `{ reason }`                 |
| POST    | `/treasurer/mobile-money/send`                      | Envoi sortant (PIN requis)   |
| GET     | `/treasurer/mobile-money/reconciliation`            | Rapprochement                |

```ts
type MobileMoneyProvider = 'MTN_MOMO'|'ORANGE_MONEY';
type MobileMoneyStatus = 'PENDING_APPROVAL'|'APPROVED'|'REJECTED'|'COMPLETED'|'FAILED'|'REFUNDED';

interface MobileMoneySendPayload {
  provider: MobileMoneyProvider;
  toPhone: string;
  amount: number;
  purpose: string;
  pin: string;                  // OTP/PIN trésorier
}

interface MobileMoneyTransaction {
  id: string;
  tontineId: string;
  provider: MobileMoneyProvider;
  direction: 'IN'|'OUT';
  amount: number;
  fromPhone?: string;
  toPhone?: string;
  externalReference: string;
  matchedMemberId?: string;
  matchedMemberFullName?: string;
  contributionId?: string;
  status: MobileMoneyStatus;
  receivedAt: string;
  reviewedAt?: string;
  reviewedByFullName?: string;
  rejectionReason?: string;
}
```

### 6.4 Caisses & mouvements

| Méthode | Endpoint                                                | Description           |
| ------- | ------------------------------------------------------- | --------------------- |
| GET     | `/treasurer/cashboxes`                                  | Liste des caisses     |
| GET     | `/treasurer/cashboxes/:id/movements`                    | Historique            |
| GET     | `/treasurer/transfers`                                  | Transferts            |
| POST    | `/treasurer/transfers`                                  | Demande de transfert  |

```ts
interface CashBox {
  id: string;
  tontineId: string;
  name: string;
  type: 'PRINCIPAL'|'EMERGENCY'|'OPERATIONS'|'OTHER';
  balance: number;
  isLocked: boolean;
  thresholdMin?: number;
  createdAt: string;
}

interface CashMovement {
  id: string;
  tontineId: string;
  cashBoxId: string;
  cashBoxName: string;
  kind:
    | 'CONTRIBUTION_IN'|'EXTRA_CONTRIBUTION_IN'|'SANCTION_IN'
    | 'LOAN_REPAYMENT_IN'|'MOBILE_MONEY_IN'
    | 'CAGNOTTE_OUT'|'LOAN_DISBURSEMENT_OUT'|'EXPENSE_OUT'|'SANCTION_REFUND_OUT'
    | 'TRANSFER_IN'|'TRANSFER_OUT';
  amount: number;
  direction: 'IN'|'OUT';
  reference?: string;
  description: string;
  balanceAfter: number;
  recordedByFullName: string;
  recordedAt: string;
}

interface CreateTransferPayload {
  fromCashBoxId: string;
  toCashBoxId: string;
  amount: number;
  justification: string;
}

interface CashBoxTransfer {
  id: string;
  tontineId: string;
  fromCashBoxId: string;
  fromCashBoxName: string;
  toCashBoxId: string;
  toCashBoxName: string;
  amount: number;
  justification: string;
  status: 'DRAFT'|'PENDING_PRESIDENT'|'PENDING_AUDITOR'|'APPROVED'|'REJECTED'|'COMPLETED';
  presidentApprovedAt?: string;
  auditorApprovedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  requestedByFullName: string;
  requestedAt: string;
}
```

### 6.5 Dépenses

| Méthode | Endpoint                       | Description |
| ------- | ------------------------------ | ----------- |
| GET     | `/treasurer/expenses`          | Liste       |
| POST    | `/treasurer/expenses`          | Créer       |

```ts
type ExpenseCategory = 'VENUE'|'SUPPLIES'|'TRANSPORT'|'COMMUNICATION'|'ADMIN_FEES'|'EVENT'|'OTHER';

interface CreateExpensePayload {
  category: ExpenseCategory;
  amount: number;
  description: string;
  vendor?: string;
  receiptFileName?: string;
  cashBoxId: string;
}

interface Expense {
  id: string;
  tontineId: string;
  cashBoxId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  vendor?: string;
  receiptFileName?: string;
  status: 'DRAFT'|'PENDING_VALIDATION'|'APPROVED'|'PAID'|'REJECTED';
  needsValidation: boolean;       // amount > expenseCapWithoutValidation
  cap: number;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  createdByFullName: string;
  createdAt: string;
}
```

### 6.6 Distributions (Cagnotte)

| Méthode | Endpoint                          | Description |
| ------- | --------------------------------- | ----------- |
| GET     | `/treasurer/distributions`        | Liste       |
| POST    | `/treasurer/distributions`        | Verser cagnotte (OTP requis) |

```ts
interface CreateDistributionPayload {
  sessionId: string;
  paymentMethod: PaymentMethod;
  otp: string;                  // OTP bénéficiaire ou trésorier
}

interface CagnotteDistribution {
  id: string;
  sessionId: string;
  sessionNumber: number;
  tontineId: string;
  beneficiaryMemberId: string;
  beneficiaryFullName: string;
  beneficiaryPhone: string;
  grossAmount: number;
  deductionEmergency: number;
  deductionOperations: number;
  netAmount: number;
  paymentMethod?: PaymentMethod;
  beneficiaryConfirmed: boolean;
  beneficiaryConfirmedAt?: string;
  treasurerPaidAt?: string;
}
```

### 6.7 Prêts (vue trésorier)

| Méthode | Endpoint                                | Description |
| ------- | --------------------------------------- | ----------- |
| GET     | `/treasurer/loans`                      | Liste       |
| POST    | `/treasurer/loans/:id/disburse`         | `{ paymentMethod? }` |
| POST    | `/treasurer/loans/:id/repay`            | `{ amount, paymentMethod }` |

```ts
type LoanStatus =
  | 'REQUESTED'|'GUARANTOR_PENDING'|'GUARANTOR_APPROVED'|'COMMITTEE_REVIEW'
  | 'APPROVED'|'REJECTED'|'DISBURSED'|'REPAYING'|'REPAID'|'DEFAULTED';

interface Loan {
  id: string;
  tontineId: string;
  memberId: string;
  principal: number;
  interestRate: number;
  durationMonths: number;
  monthlyPayment: number;
  totalDue: number;
  totalRepaid: number;
  status: LoanStatus;
  purpose: string;
  guarantorIds: string[];
  requestedAt: string;
  approvedAt?: string;
  disbursedAt?: string;
  dueDate?: string;
}
```

### 6.8 Sanctions (vue trésorier)

| Méthode | Endpoint                                | Description |
| ------- | --------------------------------------- | ----------- |
| GET     | `/treasurer/sanctions`                  | Liste       |
| POST    | `/treasurer/sanctions/:id/collect`      | `{ paymentMethod }` |
| POST    | `/treasurer/sanctions/:id/refund`       | Rembourser (sanction annulée) |

### 6.9 Sessions & Bilan financier

| Méthode | Endpoint                                | Description                        |
| ------- | --------------------------------------- | ---------------------------------- |
| GET     | `/treasurer/sessions`                   | Liste live                         |
| GET     | `/treasurer/sessions/:id/bilan`         | `SessionFinancialReport`           |

```ts
interface SessionFinancialReport {
  sessionId: string;
  sessionNumber: number;
  sessionDate: string;
  totalContributions: number;
  totalExtraContributions: number;
  totalSanctions: number;
  totalRepayments: number;
  totalIncome: number;
  totalDistribution: number;
  totalExpenses: number;
  totalDisbursements: number;
  totalOutflows: number;
  netResult: number;
  cashBoxBalances: { name: string; balance: number }[];
  signedByTreasurer: boolean;
  signedByPresident: boolean;
  treasurerSignedAt?: string;
  presidentSignedAt?: string;
}
```

### 6.10 Cotisations extraordinaires (trésorier)

| Méthode | Endpoint                                                       | Description                                     |
| ------- | -------------------------------------------------------------- | ----------------------------------------------- |
| GET     | `/treasurer/extra-contributions`                               | Liste                                           |
| POST    | `/treasurer/extra-contributions/:id/collect`                   | `{ memberId, amount, paymentMethod }`           |

### 6.11 Rapports trésorier

| Méthode | Endpoint                                | Description                                  |
| ------- | --------------------------------------- | -------------------------------------------- |
| GET     | `/treasurer/reports`                    | Liste                                        |
| POST    | `/treasurer/reports/generate`           | `{ periodLabel, type: 'SUMMARY'\|'DETAILED' }` |

---

## 7. Censeur — `/censor`

### 7.1 Dashboard

```ts
interface CensorDashboard {
  alerts: {
    pendingAttendance: number;
    pendingJustifications: number;
    pendingContestations: number;
    unpaidCount: number;
    unpaidAmount: number;
  };
  sanctionsThisPeriod: {
    count: number;
    amount: number;
    collected: number;
    breakdown: { type: string; count: number; amount: number }[];
  };
  topSanctioned: { memberId: string; name: string; count: number; amount: number }[];
  session: { id: string; number: number; status: string; scheduledAt: string } | null;
}
```

### 7.2 Membres (vue censeur)

| Méthode | Endpoint              | Description |
| ------- | --------------------- | ----------- |
| GET     | `/censor/members`     | Liste membres actifs |

### 7.3 Sanctions

| Méthode | Endpoint                                      | Description                              |
| ------- | --------------------------------------------- | ---------------------------------------- |
| GET     | `/censor/sanctions?status=...&sessionId=...`  | Liste                                    |
| POST    | `/censor/sanctions`                           | Appliquer une sanction                   |
| POST    | `/censor/sanctions/batch`                     | Plusieurs sanctions au même membre       |
| GET     | `/censor/sanctions/auto-detected`             | Auto-détectées (absences/retards)        |
| POST    | `/censor/sanctions/confirm-batch`             | `{ sanctionIds: string[] }`              |
| POST    | `/censor/sanctions/:id/cancel`                | `{ reason }`                             |

```ts
type SanctionType = 'ABSENCE'|'LATENESS'|'CONTRIBUTION_LATE'|'LOAN_DEFAULT'|'DISCIPLINE'|'OTHER';
type SanctionStatus = 'PENDING'|'CONTESTED'|'CONFIRMED'|'PAID'|'WAIVED'|'CANCELLED';
type SanctionSeverity = 'LOW'|'MEDIUM'|'HIGH';

interface ApplySanctionPayload {
  memberId: string;
  type: SanctionType;
  amount?: number;            // si null → barème règles tontine
  reason: string;
  severity?: SanctionSeverity;
  customLabel?: string;
  isFinancial?: boolean;
}

interface ApplyMultipleSanctionsPayload {
  memberId: string;
  sanctions: Omit<ApplySanctionPayload, 'memberId'>[];
}

interface Sanction {
  id: string;
  tontineId: string;
  memberId: string;
  memberFullName?: string;
  sessionId?: string;
  sessionNumber?: number;
  type: SanctionType;
  customLabel?: string;
  amount: number;
  isFinancial?: boolean;
  severity?: SanctionSeverity;
  reason: string;
  status: SanctionStatus;
  autoDetected?: boolean;
  issuedByUserId: string;
  issuedByFullName?: string;
  issuedAt: string;
  paidAt?: string;
  contestedAt?: string;
  contestReason?: string;
  contestAttachmentName?: string;
  resolvedByUserId?: string;
  cancelledAt?: string;
  cancelledByUserId?: string;
  cancelledByFullName?: string;
  cancelReason?: string;
  cancelledByRole?: 'CENSOR'|'PRESIDENT'|'ASSEMBLY';
  refundInitiated?: boolean;
}
```

### 7.4 Contestations

| Méthode | Endpoint                                              | Description                                              |
| ------- | ----------------------------------------------------- | -------------------------------------------------------- |
| GET     | `/censor/contestations`                               | Sanctions contestées                                     |
| POST    | `/censor/contestations/:id/decide`                    | `{ decision: 'ACCEPT'\|'REJECT'\|'TRANSFER_PRESIDENT', comment? }` |

### 7.5 Modifications de présence

| Méthode | Endpoint                                                | Description                                                 |
| ------- | ------------------------------------------------------- | ----------------------------------------------------------- |
| GET     | `/censor/attendance-modifications`                      | Liste                                                       |
| POST    | `/censor/attendance-modifications/:id/decide`           | `{ decision: 'APPROVE'\|'REJECT'\|'REQUEST_INFO', comment?, infoRequest? }` |

```ts
interface AttendanceModificationRequest {
  id: string;
  tontineId: string;
  sessionId: string;
  sessionNumber: number;
  memberId: string;
  memberFullName: string;
  fromStatus: 'PRESENT'|'ABSENT'|'LATE'|'EXCUSED';
  toStatus: 'PRESENT'|'ABSENT'|'LATE'|'EXCUSED';
  reason: string;
  requestedByUserId: string;
  requestedByFullName: string;
  requestedAt: string;
  status: 'PENDING'|'APPROVED'|'REJECTED'|'INFO_REQUESTED';
  decisionComment?: string;
  decidedAt?: string;
  linkedSanctionId?: string;
  infoRequest?: string;
  infoResponse?: string;
}
```

### 7.6 Justifications d'absence

| Méthode | Endpoint                                              | Description                                                |
| ------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| GET     | `/censor/justifications`                              | Liste                                                      |
| POST    | `/censor/justifications/:id/decide`                   | `{ decision: 'VALIDATE'\|'REJECT'\|'REQUEST_INFO', comment? }` |
| POST    | `/censor/justifications/:id/president-approve`        | Simuler décision président                                 |

```ts
interface AbsenceJustification {
  id: string;
  tontineId: string;
  sessionId: string;
  sessionNumber: number;
  memberId: string;
  memberFullName: string;
  documentName: string;
  documentType: string;
  documentSizeKb?: number;
  reason: string;
  submittedAt: string;
  status:
    | 'PENDING_CENSOR'|'PENDING_PRESIDENT'|'APPROVED'
    | 'REJECTED_CENSOR'|'REJECTED_PRESIDENT'|'INFO_REQUESTED';
  censorComment?: string;
  censorDecidedAt?: string;
  presidentComment?: string;
  presidentDecidedAt?: string;
  linkedSanctionId?: string;
}
```

### 7.7 Impayés / Communications / Rapports

| Méthode | Endpoint                                            | Description                              |
| ------- | --------------------------------------------------- | ---------------------------------------- |
| GET     | `/censor/unpaid-sanctions`                          | Sanctions impayées (avec `daysOpen`)     |
| GET     | `/censor/communications`                            | Historique                               |
| POST    | `/censor/communications`                            | Envoyer un avertissement / rappel        |
| GET     | `/censor/reports`                                   | Liste                                    |
| POST    | `/censor/reports/generate`                          | `{ scope, periodLabel?, observations? }` |
| POST    | `/censor/reports/:id/observations`                  | `{ observations }`                       |

```ts
interface CommunicationPayload {
  kind: 'WARNING'|'PAYMENT_REMINDER'|'INFORMATION'|'CALL_TO_ORDER';
  subject: string;
  body: string;
  channels: ('SMS'|'EMAIL'|'PUSH'|'WHATSAPP')[];
  recipientMemberIds: string[];
  relatedSanctionIds?: string[];
}

interface CensorReport {
  id: string;
  tontineId: string;
  sessionId?: string;
  sessionNumber?: number;
  periodLabel: string;
  scope: 'LAST_SESSION'|'CUSTOM_RANGE'|'CYCLE';
  generatedAt: string;
  authorFullName: string;
  totalSanctions: number;
  totalAmount: number;
  breakdown: { type: string; count: number; amount: number }[];
  unpaidCount: number;
  unpaidAmount: number;
  observations?: string;
}
```

---

## 8. Commissaire aux Comptes — `/auditor`

### 8.1 Dashboard & Données financières

| Méthode | Endpoint                       | Description                |
| ------- | ------------------------------ | -------------------------- |
| GET     | `/auditor/dashboard`           | KPI                        |
| GET     | `/auditor/financial-data`      | Snapshot pour audit        |
| GET     | `/auditor/sessions`            | Sessions à examiner        |

```ts
interface AuditorDashboard {
  cashBoxes: CashBox[];
  totalBalance: number;
  validations: { financialPending: number; opinionPending: number };
  anomalies: { open: number; severityHigh: number };
  controls: { planned: number; nextDue?: string };
  recommendations: { active: number; implementedRate: number };
  loans: { active: number; overdue: number; totalOutstanding: number };
  recentMovements: CashMovement[];
}

interface FinancialDataSnapshot {
  cashBoxes: CashBox[];
  movements: CashMovement[];
  contributions: Contribution[];
  loans: Loan[];
  expenses: Expense[];
  distributions: CagnotteDistribution[];
  sanctions: Sanction[];
  totals: {
    totalBalance: number;
    contributions: number;
    expenses: number;
    distributions: number;
  };
}
```

### 8.2 Avis sur validations

| Méthode | Endpoint                                  | Description                  |
| ------- | ----------------------------------------- | ---------------------------- |
| GET     | `/auditor/validations`                    | Validations en attente d'avis |
| POST    | `/auditor/validations/:id/opinion`        | Émettre un avis              |

```ts
interface OpinionPayload {
  status: 'FAVORABLE'|'RESERVED'|'UNFAVORABLE';
  comment?: string;
}
```

### 8.3 Revues de balance par session

| Méthode | Endpoint                              | Description                                 |
| ------- | ------------------------------------- | ------------------------------------------- |
| GET     | `/auditor/balance-reviews`            | Liste                                       |
| POST    | `/auditor/balance-reviews`            | `{ sessionId, decision, observations?, reserves? }` |

```ts
type SessionBalanceReviewDecision = 'CONFORM'|'WITH_RESERVES'|'REJECTED';
```

### 8.4 Contrôles

| Méthode | Endpoint                                | Description                                |
| ------- | --------------------------------------- | ------------------------------------------ |
| GET     | `/auditor/controls`                     | Liste                                      |
| POST    | `/auditor/controls`                     | `{ kind, periodFrom, periodTo }`           |
| POST    | `/auditor/controls/:id/complete`        | `{ checkpoints[], observations? }`         |

```ts
type ControlKind = 'WEEKLY'|'MONTHLY'|'QUARTERLY'|'AD_HOC';

interface ControlCheckpoint {
  id: string;
  label: string;
  category: 'CASH'|'RECEIPT'|'CONTRIBUTION'|'LOAN'|'DISTRIBUTION'|'OTHER';
  expectedValue?: number;
  observedValue?: number;
  variance?: number;
  conform?: boolean;
  note?: string;
}
```

### 8.5 Audits

| Méthode | Endpoint                  | Description                                                     |
| ------- | ------------------------- | --------------------------------------------------------------- |
| GET     | `/auditor/audits`         | Liste                                                           |
| POST    | `/auditor/audits`         | Créer & finaliser (scope, période, findings, overallFinding)    |

```ts
type AuditScope = 'FINANCIAL'|'COMPLIANCE'|'OPERATIONAL'|'COMPLETE';
type AuditFinding = 'CONFORM'|'WITH_RESERVES'|'NON_CONFORM';

interface CreateAuditPayload {
  scope: AuditScope;
  periodFrom: string;
  periodTo: string;
  findings: { area: string; finding: AuditFinding; description: string }[];
  overallFinding: AuditFinding;
  observations?: string;
}
```

### 8.6 Anomalies

| Méthode | Endpoint                            | Description                       |
| ------- | ----------------------------------- | --------------------------------- |
| GET     | `/auditor/anomalies`                | Liste                             |
| POST    | `/auditor/anomalies`                | Créer                             |
| POST    | `/auditor/anomalies/:id/close`      | `{ resolutionComment? }`          |
| POST    | `/auditor/anomalies/:id/reopen`     | Réouverture                       |

```ts
type AnomalyCategory =
  | 'CASH_DISCREPANCY'|'MISSING_RECEIPT'|'UNAUTHORIZED_OPERATION'
  | 'PROCEDURE_BREACH'|'CALCULATION_ERROR'|'OTHER';
type AnomalySeverity = 'LOW'|'MEDIUM'|'HIGH';
type AnomalyAudience = 'PRESIDENT'|'BUREAU'|'ASSEMBLY';
type AnomalyStatus = 'OPEN'|'IN_RESPONSE'|'RESOLVED'|'CLOSED';

interface CreateAnomalyPayload {
  category: AnomalyCategory;
  severity: AnomalySeverity;
  title: string;
  description: string;
  audience: AnomalyAudience;
  requestsResponse?: boolean;
  copyToTreasurer?: boolean;
}
```

### 8.7 Clarifications

| Méthode | Endpoint                                              | Description                                         |
| ------- | ----------------------------------------------------- | --------------------------------------------------- |
| GET     | `/auditor/clarifications`                             | Liste                                               |
| POST    | `/auditor/clarifications`                             | `{ subject, question, targetRole, dueWithinHours }` |
| POST    | `/auditor/clarifications/:id/simulate-response`       | (Mock pour test) `{ response? }`                    |
| POST    | `/auditor/clarifications/:id/evaluate`                | `{ evaluation: 'SATISFACTORY'\|'PARTIAL'\|'UNSATISFACTORY' }` |

### 8.8 Recommandations

| Méthode | Endpoint                                          | Description                          |
| ------- | ------------------------------------------------- | ------------------------------------ |
| GET     | `/auditor/recommendations`                        | Liste                                |
| POST    | `/auditor/recommendations`                        | Créer                                |
| POST    | `/auditor/recommendations/:id/status`             | `{ status, progress?, closeNote? }`  |

```ts
type RecommendationOrigin = 'PERIODIC_CONTROL'|'AUDIT'|'ANOMALY'|'GENERAL';
type RecommendationPriority = 'LOW'|'MEDIUM'|'HIGH';
type RecommendationStatus = 'PENDING'|'IN_PROGRESS'|'IMPLEMENTED'|'CLOSED'|'OVERDUE';

interface CreateRecommendationPayload {
  origin: RecommendationOrigin;
  originId?: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  recipient: 'BUREAU'|'PRESIDENT'|'TREASURER';
  dueDate?: string;
}
```

### 8.9 Certifications

| Méthode | Endpoint                          | Description                                     |
| ------- | --------------------------------- | ----------------------------------------------- |
| GET     | `/auditor/certifications`         | Liste                                           |
| POST    | `/auditor/certifications`         | `{ scope, periodLabel, decision, reserves?, otp }` |

```ts
type CertificationScope = 'MONTH'|'CYCLE'|'YEAR';
type CertificationDecision = 'CERTIFIED'|'CERTIFIED_WITH_RESERVES'|'REFUSED';
```

### 8.10 Rapports & Export

| Méthode | Endpoint                                | Description                                       |
| ------- | --------------------------------------- | ------------------------------------------------- |
| GET     | `/auditor/reports`                      | Liste                                             |
| POST    | `/auditor/reports/generate`             | `{ scope, periodLabel, observations? }`           |
| GET     | `/auditor/export?dataset=...`           | Export Excel/CSV/PDF des données                  |

```ts
// Response export
interface AuditorExportResponse {
  dataset: string;
  generatedAt: string;
  downloadUrlExcel: string;
  downloadUrlCsv: string;
  downloadUrlPdf: string;
  recordCount: number;
}
```

---

## 9. Notifications — `/notifications`

| Méthode | Endpoint                              | Description           |
| ------- | ------------------------------------- | --------------------- |
| GET     | `/notifications`                      | Liste paginée         |
| POST    | `/notifications/:id/read`             | Marquer lue           |
| POST    | `/notifications/read-all`             | Tout marquer lu       |
| DELETE  | `/notifications/:id`                  | Supprimer             |

```ts
type NotificationKind = 'info'|'success'|'warning'|'error';
type NotificationCategory = 'CONTRIBUTION'|'LOAN'|'SESSION'|'SANCTION'|'VOTE'|'GENERAL';

interface AppNotification {
  id: string;
  userId: string;
  tontineId?: string;
  kind: NotificationKind;
  category: NotificationCategory;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
```

---

## 10. Règles métier transverses

### 10.1 Quorum & Présence
- **Quorum** = % minimal de membres confirmés / présents requis pour valider une séance (`session.quorumThreshold`).
- Statuts de présence : `PRESENT`, `ABSENT`, `LATE`, `EXCUSED`.
- Présence finalisée → déclenche **auto-détection** sanctions ABSENCE / LATENESS (status `PENDING` côté Censeur).

### 10.2 Workflow de signature
1. **Secrétaire** rédige PV / Agenda → `SECRETARY_SIGNED` / `SUBMITTED_TO_PRESIDENT`.
2. **Commissaire** émet un avis (FAVORABLE / RESERVED / UNFAVORABLE).
3. **Président** valide → `PUBLISHED` / `APPROVED`.
4. Blocage possible via `EmergencyBlock`.

### 10.3 Cagnotte (cotisation principale)
- À chaque session : `cagnotteAmount = totalContributions - deductionEmergency - deductionOperations`.
- `deductionEmergency = totalContributions × rules.emergencyDeductionPercent / 100`.
- Distribution requiert OTP (côté bénéficiaire ou trésorier) ET signature président (`cagnotteSignedByPresident: true`).

### 10.4 Prêts
- Formule amortissement : mensualité fixe `M = P·i / (1 - (1 + i)^-n)` où `i = annualRate/12`.
- Statuts : `REQUESTED → GUARANTOR_PENDING → GUARANTOR_APPROVED → COMMITTEE_REVIEW → APPROVED|REJECTED → DISBURSED → REPAYING → REPAID|DEFAULTED`.
- Décaissement bloqué si EmergencyBlock `LOAN_DISBURSEMENT` actif.

### 10.5 Sanctions
- Barème par défaut tiré de `TontineRules` (`latePenaltyAmount`, `absencePenaltyAmount`, `contributionLatePenaltyAmount`).
- Cycle de vie : `PENDING → CONFIRMED → PAID | CONTESTED → (CENSOR decide) → CONFIRMED/WAIVED/CANCELLED`.
- Contestation peut être **escaladée au président** via `TRANSFER_PRESIDENT`.
- Annulation → `refundInitiated: true` (remboursement par le trésorier).

### 10.6 Dépenses > plafond
- Si `amount > rules.expenseCapWithoutValidation` → `needsValidation: true` → route automatique vers validation Président (`ValidationCategory.FINANCIAL_OPERATION`, `operationType: EXPENSE_ABOVE_CAP`).

### 10.7 Transferts entre caisses
- Workflow : `DRAFT → PENDING_PRESIDENT → PENDING_AUDITOR → APPROVED → COMPLETED` (ou `REJECTED` à toute étape).
- Verrouillage caisse possible via `cashBox.isLocked` (déclenché par EmergencyBlock).

### 10.8 Multi-tenant
- Toute écriture vérifie l'appartenance `tontineId` du user à la tontine cible.
- Header `X-Tontine-Id` ou claim JWT `activeTontineId`.

### 10.9 Audit Trail
- Toutes les actions sensibles (décisions, signatures, sanctions, transferts) doivent être horodatées et tracées (table `audit_log` recommandée : `actor`, `action`, `target`, `payload`, `at`).

---

## 11. WebSockets / Temps réel (recommandé)

Canaux suggérés pour les flux live (session en cours, dashboards, notifications) :

| Channel                                | Événements                                                      |
| -------------------------------------- | --------------------------------------------------------------- |
| `tontine.{id}.session.{sessionId}`     | `attendance.updated`, `agenda.advanced`, `cagnotte.signed`, `closed` |
| `tontine.{id}.notifications`           | `notification.created`                                          |
| `tontine.{id}.dashboard.president`     | `kpi.updated`, `validation.created`                             |
| `tontine.{id}.dashboard.treasurer`     | `cashbox.updated`, `mobile_money.received`                      |
| `tontine.{id}.votes.{voteId}`          | `vote.updated`, `vote.closed`                                   |

---

## 12. Fichiers & uploads

- **Upload** : `POST /uploads` (multipart) → renvoie `{ id, fileName, fileSize, mimeType, url }`
- **Référencement** : les payloads (archives, justifications, PV, dépenses) référencent les fichiers par `id` ou `fileName`.
- **Stockage** recommandé : S3 / MinIO avec URLs signées pour téléchargement.

---

## 13. Énumérations complètes (récapitulatif)

```ts
// User
enum UserRole { PRESIDENT, SECRETARY, TREASURER, CENSOR, AUDITOR, MEMBER }

// Member
enum MemberStatus { PENDING, ACTIVE, SUSPENDED, RESIGNED, EXCLUDED }

// Tontine
enum TontineStatus { DRAFT, ACTIVE, PAUSED, COMPLETED, CLOSED }
type ContributionFrequency = 'WEEKLY'|'BIWEEKLY'|'MONTHLY';

// Session
enum SessionStatus { SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, PENDING_VALIDATION, VALIDATED }

// Contribution
enum ContributionStatus { PENDING, PARTIAL, PAID, LATE, EXEMPTED }

// Loan
enum LoanStatus { REQUESTED, GUARANTOR_PENDING, GUARANTOR_APPROVED, COMMITTEE_REVIEW,
  APPROVED, REJECTED, DISBURSED, REPAYING, REPAID, DEFAULTED }

// Payment
enum PaymentMethod { CASH, MOBILE_MONEY, ORANGE_MONEY, BANK_TRANSFER, CHECK }

// Sanction
enum SanctionType { ABSENCE, LATENESS, CONTRIBUTION_LATE, LOAN_DEFAULT, DISCIPLINE, OTHER }
enum SanctionStatus { PENDING, CONTESTED, CONFIRMED, PAID, WAIVED, CANCELLED }

// Validation
enum ValidationCategory { FINANCIAL_OPERATION, DOCUMENT, ADHESION, RESIGNATION }
enum FinancialOperationType { LOAN_DISBURSEMENT, FUND_TRANSFER, EXPENSE_ABOVE_CAP }
enum DocumentKind { AGENDA, MINUTES, ADHESION_FILE }
enum DecisionType { APPROVED, REJECTED, BLOCKED }
type Priority = 'CRITICAL'|'HIGH'|'NORMAL'|'LOW';
```

---

## 14. Checklist de mise en œuvre backend

- [ ] **Auth + JWT** (`/auth/*`, refresh, OTP, reset)
- [ ] **Tontines** (création, mes tontines, rules, cycles)
- [ ] **Espace Membre** (`/members/me/*`)
- [ ] **Président** (14 sous-domaines : dashboard, validations, sanctions, annonces, sessions live, membership, extra-contrib, conflits, cycle-close, votes, délégations, blocages, rapports)
- [ ] **Secrétaire** (10 sous-domaines : dashboard, agendas, convocations, RSVP, présence, PV, membership, registre, archives, annonces, rapports)
- [ ] **Trésorier** (11 sous-domaines : dashboard, cotisations, mobile money, caisses, transferts, dépenses, distributions, prêts, sanctions, bilans, extra-contrib, rapports)
- [ ] **Censeur** (9 sous-domaines : dashboard, membres, sanctions, contestations, modifications de présence, justifications, impayés, communications, rapports)
- [ ] **Commissaire** (12 sous-domaines : dashboard, financial-data, validations, balance-reviews, contrôles, audits, anomalies, clarifications, recommandations, certifications, rapports, export)
- [ ] **Notifications** in-app + canaux SMS / EMAIL / WhatsApp / PUSH
- [ ] **Audit log** transverse
- [ ] **Multi-tenant guard** (vérif tontineId sur chaque écriture)
- [ ] **WebSocket** pour séances live et dashboards
- [ ] **Intégration Mobile Money** (MTN MOMO, Orange Money) — webhook entrant + envoi sortant
- [ ] **Stockage fichiers** (S3/MinIO + URLs signées)
- [ ] **Tâches planifiées** (rappels RSVP, auto-détection sanctions, génération de rapports périodiques, expiration délégations)

---

> **Source de vérité** : ce document est généré à partir de `src/app/core/`, `src/app/shared/models/` et `src/app/features/*/services/`. Toute évolution du frontend doit être synchronisée ici (et inversement).

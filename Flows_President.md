# 🔴 FLOWS COMPLETS DU PRÉSIDENT
## Application de Gestion de Tontine - Cameroun

---

# 1. VUE D'ENSEMBLE DU RÔLE

## 1.1 Responsabilités du Président

Le Président est le **garant du bon fonctionnement** de la tontine. Il est responsable de :

- **Direction générale** : Présider les séances, diriger les débats
- **Validations** : Approuver les documents et opérations financières majeures
- **Décisions** : Trancher seul (sauf pour ce qui nécessite l'Assemblée)
- **Médiation** : Gérer les conflits entre membres (en dernier recours après le Censeur)
- **Représentation** : Représenter la tontine et communiquer avec les membres

## 1.2 Pouvoirs et Limites

| Action | Pouvoir du Président |
|--------|---------------------|
| Décisions courantes | ✅ Seul |
| Valider ODJ, PV, documents | ✅ Seul |
| Valider opérations financières | ✅ Seul (avec avis Commissaire) |
| Annuler une sanction | ✅ Seul |
| Bloquer une opération | ✅ Seul |
| Lancer séance extraordinaire | ✅ Seul ou avec Bureau |
| Lancer vote/sondage | ✅ Seul ou avec Bureau |
| Cotisation extraordinaire | ❌ Après vote Assemblée |
| Suspension/Radiation membre | ❌ Après vote Assemblée |
| Modification règlement | ❌ Après vote Assemblée |

## 1.3 Accès et Permissions

| Fonction | Accès |
|----------|-------|
| Données financières complètes | ✅ Lecture complète |
| Toutes les opérations | ✅ Consultation |
| Validation documents | ✅ Valider/Refuser |
| Validation opérations financières | ✅ Valider/Refuser/Bloquer |
| Gestion des séances | ✅ Ouvrir/Diriger/Clôturer |
| Communication | ✅ Annonces directes |
| Délégation | ✅ À tout membre du Bureau |

## 1.4 Notifications Reçues

| Type | Priorité |
|------|----------|
| Demandes de prêt | Haute |
| Sanctions appliquées | Normale |
| Adhésions/Démissions | Haute |
| Alertes trésorerie (solde bas) | Critique |
| Signalements Commissaire aux Comptes | Critique |
| Contestations de membres | Haute |
| Documents à valider | Haute |
| Opérations financières à valider | Critique |

---

# 2. FLOW 1 : TABLEAU DE BORD DU PRÉSIDENT

## 2.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: TABLEAU DE BORD DU PRÉSIDENT                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Président se     │                                                       │
│  │ connecte à       │                                                       │
│  │ l'application    │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    TABLEAU DE BORD - PRÉSIDENT                   │      │
│  │                                                                  │      │
│  │  Bonjour Jean FOTSO 👋                       [🔔 12] [👤 Profil] │      │
│  │  Président de la Tontine [Nom]                                   │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 🚨 ALERTES URGENTES                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ ❗ 2 opérations financières en attente de validation   │    │      │
│  │  │ ❗ 1 signalement du Commissaire aux Comptes            │    │      │
│  │  │ ⚠️ Solde caisse de secours bas (< seuil)               │    │      │
│  │  │                                                         │    │      │
│  │  │ [Traiter les urgences]                                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 📊 VUE CONSOLIDÉE                                       │    │      │
│  │  │                                                         │    │      │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │      │
│  │  │  │ 🏦       │ │ 👥       │ │ 💳       │ │ ⚖️       │   │    │      │
│  │  │  │ Caisses  │ │ Membres  │ │ Prêts    │ │ Sanctions│   │    │      │
│  │  │  │          │ │          │ │ actifs   │ │ en cours │   │    │      │
│  │  │  │ 2.97M    │ │   46     │ │    8     │ │    5     │   │    │      │
│  │  │  │ XAF      │ │ actifs   │ │1.2M XAF  │ │ 4,500XAF │   │    │      │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │      │
│  │  │                                                         │    │      │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │      │
│  │  │  │ 📅       │ │ ✅       │ │ ⏳       │ │ 📈       │   │    │      │
│  │  │  │ Prochaine│ │ Taux     │ │ Validat. │ │ Cycle    │   │    │      │
│  │  │  │ séance   │ │ cotis.   │ │ en att.  │ │ progress.│   │    │      │
│  │  │  │ J-5      │ │   92%    │ │    5     │ │  67%     │   │    │      │
│  │  │  │ #10      │ │ ce cycle │ │          │ │ (8/12)   │   │    │      │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ⏳ VALIDATIONS EN ATTENTE (5)                           │    │      │
│  │  │                                                         │    │      │
│  │  │ 🔴 Critique:                                           │    │      │
│  │  │ • Décaissement prêt 200,000 XAF (Jean KAMGA)    [→]    │    │      │
│  │  │ • Transfert caisse 150,000 XAF                  [→]    │    │      │
│  │  │                                                         │    │      │
│  │  │ 🟡 Normal:                                             │    │      │
│  │  │ • Ordre du jour Séance #10                      [→]    │    │      │
│  │  │ • PV Séance #9 (signé par Secrétaire)           [→]    │    │      │
│  │  │ • Dossier adhésion (Paul ESSONO)                [→]    │    │      │
��  │  │                                                         │    │      │
│  │  │ [Voir toutes les validations]                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ⚡ ACTIONS RAPIDES                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ [📋 Valider documents]  [💰 Valider opérations]        │    │      │
│  │  │ [📅 Gérer séance]       [📢 Publier annonce]           │    │      │
│  │  │ [🗳️ Lancer un vote]     [👥 Gérer membres]             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 📊 INDICATEURS DE PERFORMANCE                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Comparaison Cycle #2 vs Cycle #1:                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Taux de recouvrement:  92% (+3%) ↗️                    │    │      │
│  │  │ Prêts en retard:       2 (-1)    ↗️                    │    │      │
│  │  │ Taux de présence:      85% (+5%) ↗️                    │    │      │
│  │  │ Sanctions:             15 (-8)   ↗️                    │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir rapport complet]                                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 📜 HISTORIQUE DE MES DÉCISIONS (récentes)               │    │      │
│  │  │                                                         │    │      │
│  │  │ • 28/03 - ✅ Validé: PV Séance #8                      │    │      │
│  │  │ • 27/03 - ✅ Validé: Décaissement prêt M. TCHANA       │    │      │
│  │  │ • 25/03 - ❌ Refusé: Dépense 80,000 XAF (justif. manq)│    │      │
│  │  │ • 24/03 - ✅ Validé: Adhésion Paul ESSONO              │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir tout l'historique]                               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 📅 AGENDA                                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Aujourd'hui:                                           │    │      │
│  │  │ • 5 validations en attente                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Cette semaine:                                         │    │      │
│  │  │ • Samedi 29/03 - Séance #10 à présider (15h00)         │    │      │
│  │  │                                                         │    │      │
│  │  │ À venir:                                               │    │      │
│  │  │ • Fin de cycle #2 (30/04) - Clôture à valider          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Éléments du Tableau de Bord

| Élément | Description | Mise à jour |
|---------|-------------|-------------|
| Alertes urgentes | Opérations critiques en attente | Temps réel |
| Vue consolidée | Indicateurs clés de la tontine | Temps réel |
| Validations en attente | Documents et opérations à valider | Temps réel |
| Indicateurs de performance | Comparaison avec cycle précédent | Quotidien |
| Historique décisions | Dernières décisions prises | À chaque décision |
| Agenda | Prochaines échéances | Temps réel |

---

# 3. FLOW 2 : VALIDATION DES OPÉRATIONS FINANCIÈRES

## 3.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: VALIDATION DES OPÉRATIONS FINANCIÈRES              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────���┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Opération       │                                                       │
│  │  financière à    │                                                       │
│  │  valider"        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    OPÉRATIONS EN ATTENTE                         │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ OPÉRATIONS À VALIDER (5)                                │    │      │
│  │  │                                                         │    │      │
│  │  │ 🔴 DÉCAISSEMENTS DE PRÊTS (2)                          │    │      │
│  │  │ ├─ Jean KAMGA - 200,000 XAF          [Examiner]        │    │      │
│  │  │ │   Soumis: 26/03 | Avis Commissaire: ✅               │    │      │
│  │  │ └─ Marie NGUEMO - 150,000 XAF        [Examiner]        │    │      │
│  │  │     Soumis: 27/03 | Avis Commissaire: ✅               │    │      │
│  │  │                                                         │    │      │
│  │  │ 🟠 TRANSFERTS ENTRE CAISSES (1)                        │    │      │
│  │  │ └─ Principal → Secours: 150,000 XAF  [Examiner]        │    │      │
│  │  │     Soumis: 27/03 | Avis Commissaire: ✅               │    │      │
│  │  │                                                         │    │      │
│  │  │ 🟡 DÉPENSES > PLAFOND (2)                              │    │      │
│  │  │ ├─ Location salle AG: 120,000 XAF    [Examiner]        │    │      │
│  │  │ │   Soumis: 25/03 | Avis Commissaire: ✅               │    │      │
│  │  │ └─ Équipement bureau: 85,000 XAF     [Examiner]        │    │      │
│  │  │     Soumis: 26/03 | Avis Commissaire: ⚠️ Réserves     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Examiner]                         │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉTAIL DE L'OPÉRATION                         │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉCAISSEMENT DE PRÊT                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ Référence: PRET-2026-012                               │    │      │
│  │  │ Emprunteur: Jean KAMGA                                 │    │      │
│  │  │ Montant: 200,000 XAF                                   │    │      │
│  │  │ Taux d'intérêt: 5%                                     │    │      │
│  │  │ Durée: 3 mois                                          │    │      │
│  │  │ Total à rembourser: 210,000 XAF                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Garants:                                               │    │      │
│  │  │ • Pierre MBALLA ✅ (accepté)                           │    │      │
│  │  │ • Anne NGUEMO ✅ (accepté)                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Soumis par: Trésorier (26/03/2026)                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SITUATION DE L'EMPRUNTEUR                               │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Jean KAMGA - Membre depuis Jan 2024                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Cotisations: ✅ À jour                                 │    │      │
│  │  │ Prêts précédents: 1 (remboursé à temps)                │    │      │
│  │  │ Sanctions: 0 impayées                                  │    │      │
│  │  │ Taux de présence: 92%                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Évaluation: ✅ Bon profil                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ AVIS DU COMMISSAIRE AUX COMPTES                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Avis: ✅ FAVORABLE                                     │    │      │
│  │  │ Date: 27/03/2026                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire:                                           │    │      │
│  │  │ "Dossier conforme. L'emprunteur présente un bon       │    │      │
│  │  │  historique. Les garants sont solvables. La caisse    │    │      │
│  │  │  dispose des fonds nécessaires."                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ÉTAT DE LA CAISSE                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Caisse principale: 2,450,000 XAF                       │    │      │
│  │  │ Après décaissement: 2,250,000 XAF                      │    │      │
│  │  │ Marge disponible: ✅ Suffisante                        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE DÉCISION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Approuver le décaissement                         │    │      │
│  │  │ ○ ❌ Refuser le décaissement                           │    │      │
│  │  │ ○ 🚫 Bloquer (demander informations complémentaires)   │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire (obligatoire si refus/blocage):            │    │      │
│  │  │ ┌────────────────────────────���────────────────────┐    │    │      │
│  │  │ │ _______________________________________________│    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Valider ma décision]                               │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│           ┌───────────────────┼───────────────────┐                         │
│           ▼                   ▼                   ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │ ✅ APPROUVÉ     │ │ ❌ REFUSÉ       │ │ 🚫 BLOQUÉ       │               │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘               │
│           │                   │                   │                         │
│           ▼                   ▼                   ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │ • Décaissement  │ │ • Notification  │ │ • Opération en  │               │
│  │   autorisé      │ │   au Trésorier  │ │   attente       │               │
│  │ • Notification  │ │ • Notification  │ │ • Demande       │               │
│  │   Trésorier     │ │   à l'emprunt.  │ │   d'infos       │               │
│  │ • Notification  │ │ • Motif         │ │   envoyée       │               │
│  │   emprunteur    │ │   communiqué    │ │ • Vous serez    │               │
│  │ • Historique    │ │ • Historique    │ │   re-notifié    │               │
│  │   mis à jour    │ │   mis à jour    │ │                 │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Types d'Opérations Financières

| Type | Nécessite validation Président | Avis Commissaire |
|------|-------------------------------|------------------|
| Décaissement prêt | ✅ Oui | ✅ Requis |
| Transfert entre caisses | ✅ Oui | ✅ Requis |
| Dépense > plafond | ✅ Oui | ✅ Requis |
| Distribution cagnotte | ❌ Non (automatique) | 👁️ Consultatif |
| Encaissement cotisation | ❌ Non | ❌ Non |

## 3.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-OP01 | Le Président peut approuver, refuser ou bloquer toute opération |
| RM-OP02 | L'avis du Commissaire est affiché mais non bloquant |
| RM-OP03 | Un commentaire est obligatoire en cas de refus ou blocage |
| RM-OP04 | Toutes les décisions sont historisées |
| RM-OP05 | Le Trésorier et les concernés sont notifiés automatiquement |

---

# 4. FLOW 3 : VALIDATION DES DOCUMENTS

## 4.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: VALIDATION DES DOCUMENTS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Président clique │                                                       │
│  │ "Valider         │                                                       │
│  │  documents"      │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DOCUMENTS EN ATTENTE                          │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DOCUMENTS À VALIDER (3)                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ 📋 ORDRES DU JOUR (1)                                  │    │      │
│  │  │ └─ Séance #10 - 29/03/2026              [Examiner]     │    │      │
│  │  │     Soumis par: Secrétaire (25/03)                     │    │      │
│  │  │                                                         │    │      │
│  │  │ 📝 PROCÈS-VERBAUX (1)                                  │    │      │
│  │  │ └─ PV Séance #9 - 22/03/2026            [Examiner]     │    │      │
│  │  │     Signé par: Secrétaire ✅                           │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 DOSSIERS D'ADHÉSION (1)                             │    │      │
│  │  │ └─ Paul ESSONO                          [Examiner]     │    │      │
│  │  │     Validé par: Secrétaire ✅ | Vote: ✅ Approuvé      │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.2 Sous-Flow : Validation Ordre du Jour

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: VALIDATION ORDRE DU JOUR                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ORDRE DU JOUR - SÉANCE #10                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Séance: #10 (Ordinaire)                                │    │      │
│  │  │ Date: 29 Mars 2026 à 15h00                             │    │      │
│  │  │ Lieu: Salle des fêtes FOUDA, Yaoundé                   │    │      │
│  │  │ Bénéficiaire cagnotte: Robert TCHANA                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Soumis par: Secrétaire (Marie NGUEMO)                  │    │      │
│  │  │ Date soumission: 25/03/2026                            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CONTENU DE L'ORDRE DU JOUR                              │    │      │
│  │  │                                                         │    │      │
│  │  │ 1. Ouverture de la séance                              │    │      │
│  │  │ 2. Appel des membres                                   │    │      │
│  │  │ 3. Lecture et adoption du PV #9                        │    │      │
│  │  │ 4. Rapport du Trésorier                                │    │      │
│  │  │ 5. Rapport du Censeur                                  │    │      │
│  │  │ 6. Rapport du Commissaire aux Comptes                  │    │      │
│  │  │ 7. Collecte des cotisations                            │    │      │
│  │  │ 8. Distribution de la cagnotte à Robert TCHANA         │    │      │
│  │  │ 9. Présentation candidats adhésion (2)                 │    │      │
│  │  │ 10. Vote: Cotisation extraordinaire décès M. BIYA     │    │      │
│  │  │ 11. Questions diverses                                 │    │      │
│  │  │ 12. Clôture de la séance                               │    │      │
│  │  │                                                         │    │      │
│  │  │ [📄 Voir le document complet]                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE DÉCISION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Valider et publier                                │    │      │
│  │  │ ○ ✏️ Demander des modifications                        │    │      │
│  │  │ ○ ❌ Rejeter                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Points à ajouter/modifier (optionnel):                 │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ _______________________________________________│    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Valider ma décision]                               │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ ORDRE DU JOUR VALIDÉ                       │      │
│  │                                                                  │      │
│  │  L'ordre du jour de la séance #10 a été validé et publié.       │      │
│  │                                                                  │      │
│  │  • Tous les membres ont été notifiés                            │      │
│  │  • Document accessible dans l'espace Documents                  │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.3 Sous-Flow : Signature du Procès-Verbal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: SIGNATURE DU PV                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PV SÉANCE #9 - À SIGNER                       │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Séance: #9 - 22 Mars 2026                              │    │      │
│  │  │ Rédigé par: Secrétaire (Marie NGUEMO)                  │    │      │
│  │  │ Signé par Secrétaire: ✅ 23/03/2026                    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ APERÇU DU PV                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │      PROCÈS-VERBAL DE LA SÉANCE #9             │    │    │      │
│  │  │ │              22 Mars 2026                       │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Présents: 38/46 (83%)                          │    │    │      │
│  │  │ │ Quorum: Atteint                                │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ 1. Ouverture à 15h05 par le Président         │    │    │      │
│  │  │ │ 2. Appel des membres effectué                 │    │    │      │
│  │  │ │ 3. PV #8 adopté à l'unanimité                 │    │    │      │
│  │  │ │ ...                                            │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ [Page 1/4]                                     │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ [📄 Voir le document complet]  [📥 Télécharger]        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌────────────────────���────────────────────────────────────┐    │      │
│  │  │ PIÈCES JOINTES                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ 📎 Feuille de présence                    [👁️]         │    │      │
│  │  │ 📎 Bilan financier Trésorier              [👁️]         │    │      │
│  │  │ 📎 Rapport Censeur                        [👁️]         │    │      │
│  │  │ 📎 Rapport Commissaire aux Comptes        [👁️]         │    │      │
│  │  │ 📎 Reçu distribution cagnotte             [👁️]         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE DÉCISION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Signer et publier le PV                           │    │      │
│  │  │ ○ ✏️ Demander des corrections                          │    │      │
│  │  │ ○ ❌ Rejeter                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Corrections demandées (si applicable):                 │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ _______________________________________________│    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Signer]                                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Si "Signer et publier"                      │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SIGNATURE ÉLECTRONIQUE                        │      │
│  │                                                                  │      │
��  │  Code OTP envoyé au +237 677 XXX XXX: [______]                  │      │
│  │                                                                  │      │
│  │  Signature:                                                     │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │                                                         │    │      │
│  │  │         [Zone de dessin tactile]                       │    │      │
│  │  │              Jean FOTSO                                 │    │      │
│  │  │              Président                                  │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Effacer]  [Confirmer la signature]                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ PV SIGNÉ ET PUBLIÉ                         │      │
│  │                                                                  │      │
│  │  Le PV de la séance #9 a été signé et publié.                   │      │
│  │                                                                  │      │
│  │  • Signatures: Secrétaire ✅ + Président ✅                     │      │
│  │  • Tous les membres ont été notifiés                            │      │
│  │  • Document archivé                                             │      │
│  │                                                                  │      │
│  │  [📥 Télécharger le PV signé]                                   │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.4 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-VD01 | Le Président valide l'ordre du jour avant publication |
| RM-VD02 | Le PV nécessite signature Secrétaire puis Président |
| RM-VD03 | Le Président peut demander des modifications |
| RM-VD04 | La signature est authentifiée par OTP + signature manuscrite |

---

# 5. FLOW 4 : GESTION DES SÉANCES

## 5.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GESTION DES SÉANCES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  │(Jour de  │                                                               │
│  │ séance)  │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Président clique │                                                       │
│  │ "Gérer séance"   │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    GESTION DE SÉANCE #10                         │      │
│  │                    29 Mars 2026                                  │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ STATUT DE LA SÉANCE                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ État actuel: ⚪ Non démarrée                           │    │      │
│  │  │ Heure prévue: 15h00                                    │    │      │
│  │  │ Heure actuelle: 14h55                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Présences confirmées: 38/46 (83%)                      │    │      │
│  │  │ Quorum (67%): ✅ Sera atteint                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ACTIONS DISPONIBLES                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ [🟢 OUVRIR LA SÉANCE]                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Déléguer la présidence au Vice-Président             │    │      │
│  │  │   [Déléguer à M. MBALLA]                               │    │      │
│  │  └───────────────────────────────���─────────────────────────┘    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [OUVRIR LA SÉANCE]                 │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    OUVERTURE DE LA SÉANCE                        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATION DU QUORUM                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Membres présents (pointés): 35                         │    │      │
│  │  │ Total membres: 46                                      │    │      │
│  │  │ Quorum requis: 31 (67%)                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Statut: ✅ QUORUM ATTEINT (76%)                        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ⚠️ En ouvrant la séance, vous confirmez que le quorum          │      │
│  │     est atteint et que les délibérations seront valides.        │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer l'ouverture]                             │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    🟢 SÉANCE EN COURS                            │      │
│  │                                                                  │      │
│  │  Séance #10 ouverte à 15:05                                     │      │
│  │  Président de séance: Jean FOTSO                                │      │
│  │                                                                  │      │
│  │  ┌───────────────────────────────���─────────────────────────┐    │      │
│  │  │ ORDRE DU JOUR - SUIVI                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ 1. Ouverture de la séance                           │    │      │
│  │  │ 🔵 2. Appel des membres (EN COURS)                     │    │      │
│  │  │ ⚪ 3. Lecture et adoption du PV #9                     │    │      │
│  │  │ ⚪ 4. Rapport du Trésorier                             │    │      │
│  │  │ ⚪ 5. Rapport du Censeur                               │    │      │
│  │  │ ⚪ 6. Rapport du Commissaire                           │    │      │
│  │  │ ⚪ 7. Collecte des cotisations                         │    │      │
│  │  │ ⚪ 8. Distribution cagnotte                            │    │      │
│  │  │ ⚪ 9. Présentation candidats                           │    │      │
│  │  │ ⚪ 10. Vote cotisation extraordinaire                  │    │      │
│  │  │ ⚪ 11. Questions diverses                              │    │      │
│  │  │ ⚪ 12. Clôture                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ [Marquer point suivant]  [Ajouter point imprévu]       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ACTIONS PENDANT LA SÉANCE                               │    │      │
│  │  │                                                         │    │      │
│  │  │ [🗳️ Lancer un vote]                                    │    │      │
│  │  │ [✍️ Signer distribution cagnotte]                      │    │      │
│  │  │ [📝 Ajouter une note au PV]                            │    │      │
│  │  │ [🔴 Suspendre la séance]                               │    │      │
│  │  │ [⏹️ Clôturer la séance]                                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```
# 🔴 FLOWS COMPLETS DU PRÉSIDENT (SUITE)
## Application de Gestion de Tontine - Cameroun

---

# 5. FLOW 4 : GESTION DES SÉANCES (Suite)

## 5.2 Sous-Flow : Lancer un Vote (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: LANCER UN VOTE (Suite)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    RÉSULTAT DU VOTE                              │      │
│  │                                                                  │      │
│  │  Question: Cotisation extraordinaire pour M. BIYA               │      │
│  │                                                                  │      │
│  │  Membres présents: 35                                           │      │
│  │  Majorité requise: 18 (50% + 1)                                 │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SAISIE DES RÉSULTATS                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Pour:        [32]                                   │    │      │
│  │  │ ❌ Contre:      [2]                                    │    │      │
│  │  │ ⚪ Abstentions: [1]                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ Total: 35 ✅                                           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Résultat: ✅ ADOPTÉ (32 > 18)                                  │      │
│  │                                                                  │      │
│  │  [Corriger]  [Valider le résultat]                              │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ VOTE ENREGISTRÉ                            │      │
│  │                                                                  │      │
│  │  Question: Cotisation extraordinaire pour M. BIYA               │      │
│  │  Résultat: ADOPTÉ                                               │      │
│  │                                                                  │      │
│  │  32 pour | 2 contre | 1 abstention                              │      │
│  │                                                                  │      │
│  │  • Décision enregistrée                                         │      │
│  │  • Sera intégrée au PV                                          │      │
│  │  • Action déclenchée: Lancement cotisation extraordinaire       │      │
│  │                                                                  │      │
│  │  [Continuer la séance]                                          │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5.3 Sous-Flow : Signature Distribution Cagnotte

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: SIGNATURE DISTRIBUTION CAGNOTTE               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DISTRIBUTION DE CAGNOTTE                      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ BÉNÉFICIAIRE                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Robert TCHANA                                        │    │      │
│  │  │ Tour: #10                                              │    │      │
│  │  │ Statut cotisations: ✅ À jour                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MONTANT DE LA CAGNOTTE                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Cotisations collectées: 1,850,000 XAF                  │    │      │
│  │  │ Prélèvement caisse secours (5%): -92,500 XAF           │    │      │
│  │  │ Prélèvement fonctionnement: -50,000 XAF                │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ MONTANT NET: 1,707,500 XAF                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SIGNATURES REQUISES                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Trésorier (a préparé la distribution)               │    │      │
│  │  │ ✅ Bénéficiaire (a confirmé réception - OTP)           │    │      │
│  │  │ ⏳ Président (votre signature)                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE SIGNATURE                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ En signant, vous attestez que la distribution          │    │      │
│  │  │ a été effectuée conformément aux règles.               │    │      │
│  │  │                                                         │    │      │
│  │  │ Code OTP: [______]                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Signature:                                             │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │         [Zone de dessin tactile]               │    │    │      │
│  │  │ │              Jean FOTSO - Président             │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Signer]                                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌────────────────────���─────────────────────────────────────────────┐      │
│  │                    ✅ DISTRIBUTION VALIDÉE                       │      │
│  │                                                                  │      │
│  │  La distribution de 1,707,500 XAF à Robert TCHANA               │      │
│  │  a été validée.                                                 │      │
│  │                                                                  │      │
│  │  Signatures: Trésorier ✅ | Bénéficiaire ✅ | Président ✅      │      │
│  │                                                                  │      │
│  │  Reçu généré: DIST-2026-010                                     │      │
│  │                                                                  │      │
│  │  [📥 Télécharger le reçu]  [Continuer la séance]                │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5.4 Sous-Flow : Clôturer la Séance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: CLÔTURER LA SÉANCE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CLÔTURE DE LA SÉANCE #10                      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉCAPITULATIF DE LA SÉANCE                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Durée: 3h10 (15:05 - 18:15)                            │    │      │
│  │  │ Présents: 35/46 (76%)                                  │    │      │
│  │  │ Quorum: ✅ Atteint                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Points traités: 12/12                                  │    │      │
│  │  │ Votes effectués: 3                                     │    │      │
│  │  │ Décisions prises: 4                                    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉSUMÉ FINANCIER                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Cotisations collectées: 1,850,000 XAF                  │    │      │
│  │  │ Distribution effectuée: 1,707,500 XAF                  │    │      │
│  │  │ Prêts décaissés: 200,000 XAF                           │    │      │
│  │  │ Sanctions encaissées: 2,500 XAF                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Bilan Trésorier: ✅ Validé                             │    │      │
│  │  │ Rapport Commissaire: ✅ Conforme                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉCISIONS PRISES                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ 1. ✅ PV #9 adopté (unanimité)                         │    │      │
│  │  │ 2. ✅ Admission Paul ESSONO (33-2-1)                   │    │      │
│  │  │ 3. ✅ Admission Marie TALLA (unanimité)                │    │      │
│  │  │ 4. ✅ Cotisation extraordinaire M. BIYA (32-2-1)       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PROCHAINE SÉANCE                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Séance #11: [12/04/2026] à [15:00]                     │    │      │
│  │  │ Lieu: [Salle des fêtes FOUDA, Yaoundé___________]      │    │      │
│  │  │ Bénéficiaire: Claire ESSOMBA (Tour #11)                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ⚠️ En clôturant, vous confirmez que tous les points           │      │
│  │     ont été traités et que le Secrétaire peut rédiger le PV.   │      │
│  │                                                                  │      │
│  │  [Annuler]  [Clôturer la séance]                                │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
��  │                    ✅ SÉANCE CLÔTURÉE                            │      │
│  │                                                                  │      │
│  │  La séance #10 a été clôturée à 18:15.                          │      │
│  │                                                                  │      │
│  │  • Tous les membres ont été notifiés                            │      │
│  │  • Secrétaire notifié pour rédaction du PV                      │      │
│  │  • Prochaine séance programmée: 12/04/2026                      │      │
│  │                                                                  │      │
│  │  Cotisation extraordinaire lancée automatiquement:              │      │
│  │  • 5,000 XAF par membre                                         │      │
│  │  • Bénéficiaire: M. BIYA                                        │      │
│  │  • Date limite: 10/04/2026                                      │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5.5 Sous-Flow : Délégation au Vice-Président

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: DÉLÉGATION AU VICE-PRÉSIDENT                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉLÉGUER LA PRÉSIDENCE                        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉLÉGATION                                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Séance: #10 - 29 Mars 2026                             │    │      │
���  │  │                                                         │    │      │
│  │  │ Déléguer à:                                            │    │      │
│  │  │ ● Vice-Président: Pierre MBALLA                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Motif de délégation:                                   │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Empêchement professionnel - Déplacement        │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Pouvoirs délégués:                                     │    │      │
│  │  │ ☑ Ouvrir et clôturer la séance                         │    │      │
│  │  │ ☑ Diriger les débats                                   │    │      │
│  │  │ ☑ Lancer les votes                                     │    │      │
│  │  │ ☑ Signer la distribution de cagnotte                   │    │      │
│  │  │ ☐ Valider les opérations financières (urgent seulement)│    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ⚠️ Le Vice-Président sera notifié et recevra les              │      │
│  │     accès nécessaires pour cette séance.                        │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer la délégation]                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ DÉLÉGATION CONFIRMÉE                       │      │
│  │                                                                  │      │
│  │  Pierre MBALLA présidera la séance #10 en votre nom.           │      │
│  │                                                                  │      │
│  │  • Notification envoyée au Vice-Président                       │      │
│  │  • Tous les membres seront informés                             │      │
│  │  • Vous recevrez un compte-rendu après la séance                │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5.6 Règles Métier - Gestion des Séances

| Règle | Description |
|-------|-------------|
| RM-GS01 | Le Président ouvre la séance après vérification du quorum |
| RM-GS02 | Il peut déléguer au Vice-Président uniquement |
| RM-GS03 | Il dirige les débats et lance les votes |
| RM-GS04 | Il signe la distribution de cagnotte |
| RM-GS05 | Il clôture la séance et définit la prochaine date |
| RM-GS06 | Les décisions de vote sont automatiquement exécutées |

---

# 6. FLOW 5 : GESTION DES ADHÉSIONS/DÉMISSIONS/RADIATIONS

## 6.1 Diagramme de Flux Principal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GESTION DES MEMBRES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Président clique │                                                       │
│  │ "Gérer membres"  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────────────────────────────────────────────────────��┐      │
│  │                    GESTION DES MEMBRES                           │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DEMANDES EN ATTENTE                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 ADHÉSIONS (2)                                       │    │      │
│  │  │ ├─ Paul ESSONO - Vote: ✅ Approuvé      [Finaliser]    │    │      │
│  │  │ │   Validé Secrétaire ✅ | Vote 33-2-1                 │    │      │
│  │  │ └─ Marie TALLA - Vote: ✅ Approuvé      [Finaliser]    │    │      │
│  │  │     Validé Secrétaire ✅ | Vote unanimité              │    │      │
│  │  │                                                         │    │      │
│  │  │ 🚪 DÉMISSIONS (1)                                      │    │      │
│  │  │ └─ Jean KAMGA - Bureau: ✅              [Examiner]     │    │      │
│  │  │     Prêts soldés ✅ | Sanctions payées ✅              │    │      │
│  │  │                                                         │    │      │
│  │  │ ⛔ RADIATIONS (0)                                      │    │      │
│  │  │    Aucune demande en cours                             │    │      │
│  │  │                                                         │    │      │
│  │  │ ⏸️ SUSPENSIONS (1)                                     │    │      │
│  │  │ └─ Pierre NGUEMO - En attente vote     [Voir]          │    │      │
│  │  │     Motif: 6 mois de cotisations impayées              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [📋 Liste complète des membres]  [📊 Statistiques]            │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Sous-Flow : Finaliser une Adhésion

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: FINALISER UNE ADHÉSION                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FINALISATION ADHÉSION                         │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CANDIDAT                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Paul ESSONO                                          │    │      │
│  │  │ Parrain: Jean KAMGA                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ Processus d'admission:                                 │    │      │
│  │  │ ✅ Dossier validé par Secrétaire (20/03)              │    │      │
│  │  │ ✅ Frais d'adhésion payés (10,000 XAF)                 │    │      │
│  │  │ ✅ Présenté à l'Assemblée (Séance #10)                 │    │      │
│  │  │ ✅ Vote d'admission: 33 pour, 2 contre, 1 abstention   │    │      │
│  │  │ ⏳ Validation finale du Président                      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PARAMÈTRES D'ADHÉSION                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Position dans le planning: #47 (dernier)               │    │      │
│  │  │ Premier tour prévu: Cycle #4                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Cotisation de rattrapage: ❌ Non applicable            │    │      │
│  │  │ (Adhésion en début de cycle)                           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE DÉCISION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Confirmer l'admission                             │    │      │
│  │  │ ○ ❌ Annuler l'admission (motif exceptionnel)          │    │      │
│  │  │                                                         │    │      │
│  │  │ Message de bienvenue personnalisé (optionnel):         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Bienvenue dans notre tontine ! Nous sommes     │    │    │      │
│  │  │ │ heureux de vous compter parmi nous.            │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer]                                         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ ADHÉSION FINALISÉE                         │      │
│  │                                                                  │      │
│  │  Paul ESSONO est officiellement membre de la tontine !          │      │
│  │                                                                  │      │
│  │  • Compte créé                                                  │      │
│  │  • Identifiants envoyés par SMS et Email                        │      │
│  │  • Position: #47 dans le planning                               │      │
│  │  • Message de bienvenue envoyé                                  │      │
│  │  • Parrain (Jean KAMGA) notifié                                 │      │
│  │  • Tous les membres notifiés                                    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6.3 Sous-Flow : Valider une Démission

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: VALIDER UNE DÉMISSION                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    VALIDATION DÉMISSION                          │      │
│  │                                                                  │      │
│  │  ┌───────────────────────────────────────────��─────────────┐    │      │
│  │  │ MEMBRE DÉMISSIONNAIRE                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Jean KAMGA                                           │    │      │
│  │  │ Membre depuis: Janvier 2024 (2 ans)                    │    │      │
│  │  │ Position tour: #15                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Demande reçue: 28/03/2026                              │    │      │
│  │  │ Motif: Déménagement à l'étranger                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATIONS                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Prêts: Aucun en cours                               │    │      │
│  │  │ ✅ Sanctions: Toutes payées                            │    │      │
│  │  │ ✅ Bureau: Validé par Vice-Président                   │    │      │
│  │  │ ✅ Secrétaire: Dossier traité                          │    │      │
│  │  │                                                         │    │      │
│  │  │ Situation financière:                                  │    │      │
│  │  │ • Cotisations versées ce cycle: 400,000 XAF (non remb.)│    │      │
│  │  │ • Cagnotte reçue: Oui (Cycle #1)                       │    │      │
│  │  │ • Parrainages actifs: 2 (seront réaffectés)            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE DÉCISION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Accepter la démission                             │    │      │
│  │  │ ○ ❌ Refuser (conditions non remplies)                 │    │      │
│  │  │ ○ ⏸️ Reporter (demander informations)                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire:                                           │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Démission acceptée. Nous regrettons son départ.│    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Valider ma décision]                               │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ DÉMISSION ACCEPTÉE                         │      │
│  │                                                                  │      │
│  │  Jean KAMGA n'est plus membre de la tontine.                    │      │
│  │                                                                  │      │
│  │  • Compte désactivé                                             │      │
│  │  • Attestation de démission générée                             │      │
│  │  • Planning des tours mis à jour                                │      │
│  │  • Parrainages réaffectés au Bureau                             │      │
│  │  • Membre notifié                                               │      │
│  │  • Tous les membres notifiés                                    │      │
│  │                                                                  │      │
│  │  [📥 Télécharger l'attestation]                                 │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6.4 Sous-Flow : Proposer une Suspension/Radiation

```
┌─────────────────────────────────────────────────────────────────────��───────┐
│                    SOUS-FLOW: PROPOSER SUSPENSION/RADIATION                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PROPOSITION DE SANCTION MEMBRE                │      │
│  │                                                                  │      │
│  │  ⚠️ Cette action nécessite un vote de l'Assemblée.              │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MEMBRE CONCERNÉ                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Pierre NGUEMO                                        │    │      │
│  │  │ Membre depuis: Mars 2023 (3 ans)                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPE DE SANCTION PROPOSÉE                               │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ⏸️ Suspension temporaire                             │    │      │
│  │  │      Durée: [3] mois                                   │    │      │
│  │  │      (Le membre ne cotise pas et perd son tour)        │    │      │
│  │  │                                                         │    │      │
│  │  │ ● ⛔ Radiation définitive                               │    │      │
│  │  │      (Le membre est exclu de la tontine)               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MOTIFS (signalés par le Censeur)                        │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Cotisations impayées depuis 6 mois (300,000 XAF)     │    │      │
│  │  │ ☑ Absences répétées non justifiées (5 séances)         │    │      │
│  │  │ ☐ Comportement inapproprié                             │    │      │
│  │  │ ☐ Violation du règlement                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Rapport du Censeur: [📄 Voir le rapport]               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ JUSTIFICATION DE LA PROPOSITION                         │    │      │
│  │  │                                                         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Malgré plusieurs rappels et avertissements,    │    │    │      │
│  │  │ │ le membre n'a pas régularisé sa situation.     │    │    │      │
│  │  │ │ La radiation est proposée pour préserver       │    │    │      │
│  │  │ │ l'équité envers les autres membres.            │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTE REQUIS                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ La radiation nécessite un vote de l'Assemblée:         │    │      │
│  │  │ • Majorité requise: 2/3 des membres présents           │    │      │
│  │  │ • Sera soumis à la prochaine séance (#11)              │    │      │
│  │  │                                                         │    │      │
│  │  │ Le membre sera convoqué pour se défendre.              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Soumettre à l'Assemblée]                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    📤 PROPOSITION SOUMISE                        │      │
│  │                                                                  │      │
│  │  La proposition de radiation de Pierre NGUEMO sera              │      │
│  │  soumise au vote lors de la séance #11.                         │      │
│  │                                                                  │      │
│  │  • Membre convoqué pour se défendre                             │      │
│  │  • Point ajouté à l'ordre du jour                               │      │
│  │  • Secrétaire notifié                                           │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────���───────────────────────────────────────────────┘
```

## 6.5 Règles Métier - Gestion des Membres

| Règle | Description |
|-------|-------------|
| RM-GM01 | Adhésion: Vote Assemblée → Validation Président |
| RM-GM02 | Démission: Validation Bureau → Validation Président |
| RM-GM03 | Suspension/Radiation: Vote Assemblée (2/3) requis |
| RM-GM04 | Le membre concerné peut se défendre avant le vote |
| RM-GM05 | Les attestations sont générées automatiquement |

---

# 7. FLOW 6 : LANCEMENT COTISATION EXTRAORDINAIRE

## 7.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: LANCEMENT COTISATION EXTRAORDINAIRE                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  │(Après    │                                                               │
│  │ vote AG) │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Cotisation      │                                                       │
│  │  extraordinaire  │                                                       │
│  │  votée - Lancer" │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    LANCEMENT COTISATION EXTRAORDINAIRE           │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉCISION DE L'ASSEMBLÉE                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Vote effectué: Séance #10 - 29/03/2026                 │    │      │
│  │  │ Résultat: ✅ Adopté (32 pour, 2 contre, 1 abstention)  │    │      │
│  │  │                                                         │    │      │
│  │  │ Motif: Décès du père de M. BIYA                        │    │      │
│  │  │ Bénéficiaire: Paul BIYA                                │    │      │
│  │  │ Montant par membre: 5,000 XAF                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PARAMÈTRES DE LA COLLECTE                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Date limite de collecte: [10/04/2026]                  │    │      │
│  │  │ (10 jours après le vote)                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Rappels automatiques:                                  │    │      │
│  │  │ ☑ J-5 avant date limite                                │    │      │
│  │  │ ☑ J-2 avant date limite                                │    │      │
│  │  │ ☑ Jour de la date limite                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Montants:                                              │    │      │
│  │  │ • Montant par membre: 5,000 XAF                        │    │      │
│  │  │ • Nombre de membres: 47                                │    │      │
│  │  │ • Total attendu: 235,000 XAF                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Le bénéficiaire est exempté de cotisation            │    │      │
│  │  │   Total réel: 230,000 XAF (46 membres)                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MESSAGE AUX MEMBRES                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Chers membres,                                  │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Suite au vote de la séance #10, une cotisation │    │    │      │
│  │  │ │ extraordinaire de 5,000 XAF est lancée pour    │    │    │      │
│  │  │ │ soutenir notre frère Paul BIYA suite au décès  │    │    │      │
│  │  │ │ de son père.                                   │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Date limite: 10 Avril 2026                     │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Merci pour votre solidarité.                   │    │    │      │
│  │  │ │ Le Bureau                                      │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Lancer la cotisation]                              │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ COTISATION EXTRAORDINAIRE LANCÉE           │      │
│  │                                                                  │      │
│  │  Référence: COTEX-2026-003                                      │      │
│  │  Montant: 5,000 XAF par membre                                  │      │
│  │  Date limite: 10/04/2026                                        │      │
│  │                                                                  │      │
│  │  • Tous les membres notifiés (SMS + Push + Email)               │      │
│  │  • Collecte ouverte dans l'application                          │      │
│  │  • Rappels programmés                                           │      │
│  │  • Trésorier notifié                                            │      │
│  │                                                                  │      │
│  │  [Suivre la collecte]                                           │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7.2 Sous-Flow : Suivi et Clôture de la Collecte

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: CLÔTURE COTISATION EXTRAORDINAIRE             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CLÔTURE DE LA COLLECTE                        │      │
│  │                                                                  │      │
│  │  Cotisation: Décès père M. BIYA (COTEX-2026-003)                │      │
│  │  Date limite atteinte: 10/04/2026                               │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ÉTAT DE LA COLLECTE                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Progression: ████████████████████ 100%                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Collecté: 225,000 / 230,000 XAF                        │    │      │
│  │  │ Membres ayant payé: 45 / 46                            │    │      │
│  │  │ Membres n'ayant pas payé: 1                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Non payé:                                              │    │      │
│  │  │ • Pierre NGUEMO - 5,000 XAF (suspendu)                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE DÉCISION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Clôturer et distribuer le montant collecté           │    │      │
│  │  │   (225,000 XAF)                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Prolonger la collecte de [__] jours                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Traitement des impayés:                                │    │      │
│  │  │ ● Signaler au Censeur pour sanction                    │    │      │
│  │  │ ○ Ignorer (membre suspendu)                            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Clôturer et distribuer]                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ COLLECTE CLÔTURÉE                          │      │
│  │                                                                  │      │
│  │  • Montant collecté: 225,000 XAF                                │      │
│  │  • Trésorier notifié pour distribution à M. BIYA                │      │
│  │  • Tous les membres notifiés du résultat                        │      │
│  │  • Impayé signalé au Censeur                                    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7.3 Règles Métier - Cotisation Extraordinaire

| Règle | Description |
|-------|-------------|
| RM-CE01 | La cotisation extraordinaire nécessite un vote de l'Assemblée |
| RM-CE02 | Le Président lance la collecte après le vote |
| RM-CE03 | Le bénéficiaire peut être exempté de cotisation |
| RM-CE04 | Le Président clôture la collecte et ordonne la distribution |
| RM-CE05 | Les impayés sont signalés au Censeur |

---

# 8. FLOW 7 : GESTION DES CONFLITS (MÉDIATION)
# 🔴 FLOWS COMPLETS DU PRÉSIDENT (SUITE 2)
## Application de Gestion de Tontine - Cameroun

---

# 8. FLOW 7 : GESTION DES CONFLITS (Suite)

## 8.1 Diagramme de Flux (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GESTION DES CONFLITS (Suite)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOS ACTIONS                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ [📅 Convoquer les parties]                             │    │      │
│  │  │ [📝 Rendre une décision]                               │    │      │
│  │  │ [🔄 Renvoyer au Censeur avec instructions]             │    │      │
│  │  │ [⚖️ Soumettre à l'Assemblée]                           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.2 Sous-Flow : Convoquer les Parties

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: CONVOQUER LES PARTIES                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONVOCATION MÉDIATION                         │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PARTIES À CONVOQUER                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Jean KAMGA (plaignant)                               │    │      │
│  │  │ ☑ Pierre NGUEMO (mis en cause)                         │    │      │
│  │  │ ☐ Censeur (témoin)                                     │    │      │
│  │  │ ☐ Autre membre: [_______________]                      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DATE ET LIEU                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Date: [30/03/2026]                                     │    │      │
│  │  │ Heure: [10:00]                                         │    │      │
│  │  │ Lieu: [Bureau du Président / En ligne ▼]               │    │      │
│  │  │                                                         │    │      │
│  │  │ Mode:                                                  │    │      │
│  │  │ ● En présentiel                                        │    │      │
│  │  │ ○ Visioconférence                                      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MESSAGE DE CONVOCATION                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Chers membres,                                  │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Vous êtes convoqués à une réunion de médiation │    │    │      │
│  │  │ │ concernant le litige CONF-2026-005.            │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Votre présence est obligatoire.                │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Le Président                                   │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Envoyer les convocations]                          │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ CONVOCATIONS ENVOYÉES                      │      │
│  │                                                                  │      │
│  │  Les parties ont été convoquées:                                │      │
│  │  • Jean KAMGA - Convocation envoyée ✅                          │      │
│  │  • Pierre NGUEMO - Convocation envoyée ✅                       │      │
│  │                                                                  │      │
│  │  Rendez-vous: 30/03/2026 à 10:00                                │      │
│  │                                                                  │      │
│  │  Vous recevrez un rappel la veille.                             │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.3 Sous-Flow : Rendre une Décision

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: RENDRE UNE DÉCISION                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉCISION DU PRÉSIDENT                         │      │
│  │                                                                  │      │
│  │  Conflit: CONF-2026-005                                         │      │
│  │  Parties: Jean KAMGA vs Pierre NGUEMO                           │      │
│  │  Objet: Litige financier (prêt personnel)                       │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ COMPTE-RENDU DE LA MÉDIATION                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Date de la médiation: 30/03/2026                       │    │      │
│  │  │ Présents: Jean KAMGA, Pierre NGUEMO, Président         │    │      │
│  │  │                                                         │    │      │
│  │  │ Résumé des échanges:                                   │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Les deux parties ont exposé leurs positions.   │    │    │      │
│  │  │ │ Après discussion, Pierre NGUEMO reconnaît      │    │    │      │
│  │  │ │ devoir 45,000 XAF (et non 50,000 XAF).         │    │    │      │
│  │  │ │ Il s'engage à rembourser en 2 fois.            │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPE DE DÉCISION                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ ● Accord trouvé entre les parties                      │    │      │
│  │  │ ○ Décision tranchée par le Président                   │    │      │
│  │  │ ○ Renvoi à l'Assemblée (cas grave)                     │    │      │
│  │  │ ○ Classement sans suite                                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TERMES DE L'ACCORD / DÉCISION                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Pierre NGUEMO s'engage à rembourser 45,000 XAF │    │    │      │
│  │  │ │ à Jean KAMGA selon l'échéancier suivant:       │    │    │      │
│  │  │ │ - 25,000 XAF avant le 15/04/2026               │    │    │      │
│  │  │ │ - 20,000 XAF avant le 30/04/2026               │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ En cas de non-respect, le Censeur sera saisi   │    │    │      │
│  │  │ │ pour application d'une sanction.               │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SUIVI                                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Programmer des rappels pour les échéances            │    │      │
│  │  │ ☑ Notifier le Censeur pour suivi                       │    │      │
│  │  │ ☐ Signaler à l'Assemblée (pour information)            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer et notifier]                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ DÉCISION ENREGISTRÉE                       │      │
│  │                                                                  │      │
│  │  Le conflit CONF-2026-005 a été résolu.                         │      │
│  │                                                                  │      │
│  │  • Décision enregistrée et archivée                             │      │
│  │  • Jean KAMGA notifié                                           │      │
│  │  • Pierre NGUEMO notifié                                        │      │
│  │  • Censeur notifié pour suivi des échéances                     │      │
│  │  • Rappels programmés: 15/04 et 30/04                           │      │
│  │                                                                  │      │
│  │  [📥 Télécharger le PV de médiation]                            │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.4 Règles Métier - Gestion des Conflits

| Règle | Description |
|-------|-------------|
| RM-GC01 | Le Président intervient en dernier recours après le Censeur |
| RM-GC02 | Il peut convoquer les parties pour médiation |
| RM-GC03 | Il peut rendre une décision qui s'impose aux parties |
| RM-GC04 | Les cas graves peuvent être renvoyés à l'Assemblée |
| RM-GC05 | Toutes les décisions sont archivées |

---

# 9. FLOW 8 : CLÔTURE DE CYCLE

## 9.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CLÔTURE DE CYCLE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  │(Fin de   │                                                               │
│  │ cycle)   │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Fin de cycle #2 │                                                       │
│  │  - Clôture à     │                                                       │
│  │  initier"        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CLÔTURE DU CYCLE #2                           │      │
│  │                    Janvier - Avril 2026                          │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATIONS PRÉ-CLÔTURE                               │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Toutes les séances effectuées (12/12)               │    │      │
│  │  │ ✅ Toutes les cagnottes distribuées (12/12)            │    │      │
│  │  │ ✅ Audit de cycle effectué par Commissaire             │    │      │
│  │  │ ✅ Comptes certifiés par Commissaire                   │    │      │
│  │  │ ⚠️ 2 prêts en cours (à reporter au cycle suivant)      │    │      │
│  │  │ ⚠️ 3 cotisations en retard (à traiter)                 │    │      │
│  │  │ ✅ Aucune anomalie non résolue                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ BILAN FINANCIER DU CYCLE                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Cotisations collectées:         27,000,000 XAF         │    │      │
│  │  │ Distributions effectuées:       25,830,000 XAF         │    │      │
│  │  │ Prélèvements caisse secours:     1,350,000 XAF         │    │      │
│  │  │ Prélèvements fonctionnement:       600,000 XAF         │    │      │
│  │  │                                                         │    │      │
│  │  │ Prêts accordés:                  3,500,000 XAF         │    │      │
│  │  │ Remboursements reçus:            3,200,000 XAF         │    │      │
│  │  │ Intérêts encaissés:                175,000 XAF         │    │      │
│  │  │                                                         │    │      │
│  │  │ Dépenses de fonctionnement:        480,000 XAF         │    │      │
│  │  │ Aides sociales versées:            250,000 XAF         │    │      │
│  │  │                                                         │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ SOLDES FIN DE CYCLE:                                   │    │      │
│  │  │ Caisse principale:              2,520,000 XAF          │    │      │
│  │  │ Caisse de secours:              1,100,000 XAF          │    │      │
│  │  │ Caisse fonctionnement:            120,000 XAF          │    │      │
│  │  │ Prêts en cours:                   300,000 XAF          │    │      │
��  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ TOTAL ACTIF:                    4,040,000 XAF          │    │      │
│  │  └─��───────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ÉLÉMENTS À REPORTER AU CYCLE #3                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 💳 Prêts en cours:                                     │    │      │
│  │  │ • Jean KAMGA: 140,000 XAF (2 échéances restantes)      │    │      │
│  │  │ • Marie NGUEMO: 160,000 XAF (3 échéances restantes)    │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ Cotisations en retard:                              │    │      │
│  │  │ • Pierre NGUEMO: 150,000 XAF (3 séances)               │    │      │
│  │  │   → Traitement: Suspension proposée                    │    │      │
│  │  │                                                         │    │      │
│  │  │ 🏦 Soldes des caisses: Reportés intégralement          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VALIDATION COMMISSAIRE AUX COMPTES                      │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Validation reçue le 28/04/2026                      │    │      │
│  │  │ Avis: Certification avec réserves                      │    │      │
│  │  │ Réserve: "Cotisations en retard à régulariser"         │    │      │
│  │  │                                                         │    │      │
│  │  │ [📄 Voir le rapport de certification]                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PARAMÈTRES DU CYCLE #3                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Date de début: [01/05/2026]                            │    │      │
│  │  │ Durée prévue: [12] séances                             │    │      │
│  │  │ Montant cotisation: [50,000] XAF (inchangé)            │    │      │
│  │  │                                                         │    │      │
│  │  │ Ordre des tours:                                       │    │      │
│  │  │ ○ Conserver l'ordre actuel                             │    │      │
│  │  │ ● Nouveau tirage au sort                               │    │      │
│  │  │ ○ Ordre inversé                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Nouveaux membres: 2 (ajoutés en fin de liste)          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Prévisualiser]  [Clôturer le cycle]                │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIRMATION DE CLÔTURE                       │      │
│  │                                                                  │      │
│  │  ⚠️ Vous êtes sur le point de clôturer le cycle #2.             │      │
│  │                                                                  │      │
│  │  Cette action va:                                               │      │
│  │  • Archiver toutes les données du cycle                         │      │
│  │  • Créer le cycle #3 avec les paramètres définis                │      │
│  │  • Effectuer le tirage au sort des tours                        │      │
│  │  • Reporter les éléments en cours                               │      │
│  │  • Notifier tous les membres                                    │      │
│  │                                                                  │      │
│  │  Signature requise:                                             │      │
│  │                                                                  │      │
│  │  Code OTP: [______]                                             │      │
│  │                                                                  │      │
│  │  Signature:                                                     │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │         [Zone de dessin tactile]                       │    │      │
│  │  │              Jean FOTSO - Président                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer la clôture]                              │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ CYCLE #2 CLÔTURÉ                           │      │
│  │                                                                  │      │
│  │  Le cycle #2 a été clôturé avec succès.                         │      │
│  │                                                                  │      │
│  │  • Cycle #2 archivé                                             │      │
│  │  • Cycle #3 créé et initialisé                                  │      │
│  │  • Tirage au sort effectué                                      │      │
│  │  • Tous les membres notifiés                                    │      │
│  │  • Nouveau planning publié                                      │      │
│  │                                                                  │      │
│  │  Prochaine séance: #1 du Cycle #3 - 03/05/2026                  │      │
│  │  Bénéficiaire: Anne MBARGA (Tour #1)                            │      │
│  │                                                                  │      │
│  │  [📥 Télécharger le rapport de clôture]                         │      │
│  │  [📅 Voir le nouveau planning]                                  │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 9.2 Règles Métier - Clôture de Cycle

| Règle | Description |
|-------|-------------|
| RM-CC01 | La clôture nécessite validation du Commissaire aux Comptes |
| RM-CC02 | Toutes les cagnottes doivent avoir été distribuées |
| RM-CC03 | Les prêts en cours sont reportés au cycle suivant |
| RM-CC04 | Le Président décide du mode de tirage au sort |
| RM-CC05 | La clôture est signée électroniquement |
| RM-CC06 | Tous les membres sont notifiés du nouveau planning |

---

# 10. FLOW 9 : COMMUNICATION AUX MEMBRES

## 10.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: COMMUNICATION AUX MEMBRES                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Président clique │                                                       │
│  │ "Publier         │                                                       │
│  │  annonce"        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    NOUVELLE ANNONCE                              │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPE D'ANNONCE                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ 📢 Information générale                              │    │      │
│  │  │ ● ⚠️ Alerte importante                                 │    │      │
│  │  │ ○ 🎉 Félicitations / Célébration                       │    │      │
│  │  │ ○ 💔 Condoléances                                      │    │      │
│  │  │ ○ 📋 Décision du Bureau                                │    │      │
│  │  │ ○ 📅 Rappel d'événement                                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CONTENU                                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Titre:                                                 │    │      │
│  │  │ [Rappel: Régularisation des cotisations en retard_____]│    │      │
│  │  │                                                         │    │      │
│  │  │ Message:                                               │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Chers membres,                                  │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Je vous rappelle que la fin du cycle #2        │    │    │      │
│  │  │ │ approche (30 avril). Tous les membres ayant    │    │    │      │
│  │  │ │ des cotisations en retard sont priés de les    │    │    │      │
│  │  │ │ régulariser avant cette date.                  │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Les situations non régularisées seront         │    │    │      │
│  │  │ │ traitées selon le règlement.                   │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Cordialement,                                  │    │    │      │
│  │  │ │ Le Président                                   │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Pièce jointe: [📎 Ajouter un fichier]                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DESTINATAIRES                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ● Tous les membres (47)                                │    │      │
│  │  │ ○ Bureau uniquement (7)                                │    │      │
│  │  │ ○ Membres en retard uniquement (3)                     │    │      │
│  │  │ ○ Sélection personnalisée                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CANAUX DE DIFFUSION                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Notification push                                    │    │      │
│  │  │ ☑ SMS                                                  │    │      │
│  │  │ ☑ Email                                                │    │      │
│  │  │ ☐ WhatsApp (si configuré)                              │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Publier dans l'espace Annonces                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PROGRAMMATION                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ● Envoyer immédiatement                                │    │      │
│  │  │ ○ Programmer: [__/__/____] à [__:__]                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Prévisualiser]  [Envoyer]                          │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ ANNONCE ENVOYÉE                            │      │
│  │                                                                  │      │
│  │  Votre annonce a été envoyée avec succès.                       │      │
│  │                                                                  │      │
│  │  • 47 notifications push                                        │      │
│  │  • 47 SMS                                                       │      │
│  │  • 45 emails (2 adresses invalides)                             │      │
│  │  • Publiée dans l'espace Annonces                               │      │
│  │                                                                  │      │
│  │  [Voir l'annonce]  [Nouvelle annonce]                           │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 10.2 Règles Métier - Communication

| Règle | Description |
|-------|-------------|
| RM-CM01 | Le Président peut envoyer des annonces directement |
| RM-CM02 | Plusieurs canaux peuvent être utilisés simultanément |
| RM-CM03 | Les annonces peuvent être ciblées (tous, Bureau, sélection) |
| RM-CM04 | Les annonces peuvent être programmées |
| RM-CM05 | Les annonces sont archivées dans l'espace Documents |

---

# 11. FLOW 10 : LANCEMENT DE VOTE EN LIGNE

## 11.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: LANCEMENT DE VOTE EN LIGNE                         │
├──────────────────────────────────────��──────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Président clique │                                                       │
│  │ "Lancer un vote" │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    NOUVEAU VOTE EN LIGNE                         │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPE DE VOTE                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ 🗳️ Vote décisionnel (décision engageante)            │    │      │
│  │  │ ● 📊 Sondage / Consultation (avis consultatif)         │    │      │
│  │  │ ○ 📅 Choix de date                                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ QUESTION                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Titre:                                                 │    │      │
│  │  │ [Préférence pour le lieu de la fête de fin d'année____]│    │      │
│  │  │                                                         │    │      │
│  │  │ Description:                                           │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Nous souhaitons recueillir vos préférences pour│    │    │      │
│  │  │ │ le lieu de la fête de fin d'année du cycle #2. │    │    │      │
│  │  │ │ Merci de voter avant le 20 avril.              │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ OPTIONS DE RÉPONSE                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Type de réponse:                                       │    │      │
│  │  │ ● Choix unique                                         │    │      │
│  │  │ ○ Choix multiple                                       │    │      │
│  │  │ ○ Oui / Non / Abstention                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Options:                                               │    │      │
│  │  │ 1. [Restaurant Le Diplomate - Bastos____________]      │    │      │
│  │  │ 2. [Hôtel Hilton - Centre-ville_________________]      │    │      │
│  │  │ 3. [Salle des fêtes FOUDA (gratuit)_____________]      │    │      │
│  │  │ [+ Ajouter une option]                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Permettre l'abstention                               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PARAMÈTRES DU VOTE                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Date de clôture: [20/04/2026]                          │    │      │
│  │  │ Heure de clôture: [23:59]                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Vote anonyme: ● Oui  ○ Non                             │    │      │
│  │  │ Résultats visibles avant clôture: ○ Oui  ● Non         │    │      │
│  │  │                                                         │    │      │
│  │  │ Rappels automatiques:                                  │    │      │
│  │  │ ☑ J-3 avant clôture                                    │    │      │
│  │  │ ☑ Jour de clôture (matin)                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PARTICIPANTS                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ ● Tous les membres (47)                                │    │      │
│  │  │ ○ Bureau uniquement (7)                                │    │      │
│  │  │ ○ Sélection personnalisée                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Quorum requis: ○ Oui [___]%  ● Non                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Prévisualiser]  [Lancer le vote]                   │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ VOTE LANCÉ                                 │      │
│  │                                                                  ��      │
│  │  Le sondage a été lancé avec succès.                            │      │
│  │                                                                  │      │
│  │  Référence: VOTE-2026-008                                       │      │
│  │  Question: Préférence pour le lieu de la fête                   │      │
│  │  Clôture: 20/04/2026 à 23:59                                    │      │
│  │                                                                  │      │
│  │  • 47 membres peuvent voter                                     │      │
│  │  • Notifications envoyées                                       │      │
│  │  • Rappels programmés                                           │      │
│  │                                                                  │      │
│  │  [Suivre le vote]  [Nouveau vote]                               │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 11.2 Sous-Flow : Suivi et Clôture du Vote

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: CLÔTURE DU VOTE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    RÉSULTATS DU VOTE                             │      │
│  │                                                                  │      │
│  │  Sondage: Préférence pour le lieu de la fête (VOTE-2026-008)    │      │
│  │  Clôturé le: 20/04/2026 à 23:59                                 │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PARTICIPATION                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Votants: 42/47 (89%)                                   │    │      │
│  │  │ Non votants: 5                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉSULTATS                                               │    │      │
│  │  │                                                         │    │      │
│  │  │ 1. Restaurant Le Diplomate     ████████████████ 45%    │    │      │
│  │  │    19 votes                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ 2. Hôtel Hilton                ██████████░░░░░░ 31%    │    │      │
│  │  │    13 votes                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ 3. Salle des fêtes FOUDA       █████░░░░░░░░░░░ 19%    │    │      │
│  │  │    8 votes                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Abstentions                    ██░░░░░░░░░░░░░░  5%    │    │      │
│  │  │    2 votes                                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉCISION                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Option gagnante: Restaurant Le Diplomate (45%)         │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Publier les résultats aux membres                    │    │      │
│  │  │ ☑ Prendre en compte pour l'organisation                │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire du Président:                              │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ La fête aura lieu au Restaurant Le Diplomate,  │    │    │      │
│  │  │ │ conformément au souhait de la majorité.        │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Publier les résultats]                                        │      │
│  │                                                                  │      │
│  └────────���─────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 11.3 Règles Métier - Vote en Ligne

| Règle | Description |
|-------|-------------|
| RM-VT01 | Le Président peut lancer des votes/sondages seul ou avec le Bureau |
| RM-VT02 | Le vote peut être anonyme ou nominatif |
| RM-VT03 | Les résultats peuvent être cachés jusqu'à la clôture |
| RM-VT04 | Des rappels automatiques sont envoyés |
| RM-VT05 | Les résultats sont publiés à tous les membres |

---

# 12. FLOW 11 : ANNULATION DE SANCTION

## 12.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ANNULATION DE SANCTION                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └─��──┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Contestation de │                                                       │
│  │  sanction -      │                                                       │
│  │  Décision requise│                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONTESTATION DE SANCTION                      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SANCTION CONTESTÉE                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Référence: SANC-2026-045                               │    │      │
│  │  │ Membre: Jean KAMGA                                     │    │      │
│  │  │ Type: Absence non justifiée                            │    │      │
│  │  │ Séance: #9 - 22/03/2026                                │    │      │
│  │  │ Montant: 1,000 XAF                                     │    │      │
│  │  │ Appliquée par: Censeur (M. NKOULOU)                    │    │      │
│  │  │ Statut paiement: ✅ Payée (23/03/2026)                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MOTIF DE LA CONTESTATION                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Soumise par: Jean KAMGA (24/03/2026)                   │    │      │
│  │  │                                                         │    │      │
│  │  │ "J'avais signalé mon absence à l'avance et soumis     │    │      │
│  │  │  un certificat médical. Le justificatif a été         │    │      │
│  │  │  validé après que la sanction ait été appliquée.      │    │      │
│  │  │  Je demande l'annulation et le remboursement."         │    │      │
│  │  │                                                         │    │      │
│  │  │ Pièces jointes:                                        │    │      │
│  │  │ 📎 Certificat médical (JUST-2026-018)    [👁️]          │    │      │
│  │  │ 📎 Capture signalement absence           [👁️]          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ AVIS DU CENSEUR                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Avis: ⚠️ FAVORABLE À L'ANNULATION                      │    │      │
│  │  │                                                         │    │      │
│  │  │ "Après vérification, le justificatif du membre est     │    │      │
│  │  │  valide. La sanction a été appliquée par erreur avant  │    │      │
│  │  │  la validation du justificatif. Je recommande          │    │      │
│  │  │  l'annulation."                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Date: 25/03/2026                                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE DÉCISION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Annuler la sanction                               │    │      │
│  │  │      → Remboursement de 1,000 XAF au membre            │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ❌ Maintenir la sanction                             │    │      │
│  │  │      → Pas de remboursement                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire:                                           │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Le justificatif est valide. La sanction est    │    │    │      │
│  │  │ │ annulée et le remboursement sera effectué.     │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Valider ma décision]                               │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ SANCTION ANNULÉE                           │      │
│  │                                                                  │      │
│  │  La sanction SANC-2026-045 a été annulée.                       │      │
│  │                                                                  │      │
│  │  • Sanction marquée comme annulée                               │      │
│  │  • Remboursement de 1,000 XAF ordonné                           │      │
│  │  • Trésorier notifié pour effectuer le remboursement            │      │
│  │  • Membre notifié de la décision                                │      │
│  │  • Censeur notifié                                              │      │
│  │  • Historique mis à jour                                        │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 12.2 Règles Métier - Annulation de Sanction

| Règle | Description |
|-------|-------------|
| RM-AS01 | Le Président peut annuler toute sanction seul |
| RM-AS02 | L'avis du Censeur est consultatif |
| RM-AS03 | Si la sanction était payée, un remboursement est ordonné |
| RM-AS04 | Le Trésorier effectue le remboursement |
| RM-AS05 | Toutes les parties sont notifiées |

-# 🔴 FLOWS COMPLETS DU PRÉSIDENT (FIN)
## Application de Gestion de Tontine - Cameroun

---

# 13. FLOW 12 : DÉLÉGATION DE POUVOIRS (Suite)

## 13.1 Diagramme de Flux (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: DÉLÉGATION DE POUVOIRS (Suite)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉLÉGATION DE POUVOIRS                        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉLÉGATIONS ACTIVES                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Aucune délégation active actuellement                  │    │      │
│  │  │                                                         │    │      │
│  │  │ [+ Nouvelle délégation]                                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ HISTORIQUE DES DÉLÉGATIONS                              │    │      │
│  │  │                                                         │    │      │
│  │  │ • 29/03/2026 - Séance #10                              │    │      │
│  │  │   Délégué: Vice-Président (Pierre MBALLA)              │    │      │
│  │  │   Motif: Déplacement professionnel                     │    │      │
│  │  │   Statut: ✅ Terminée                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir l'historique complet]                            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │ Clic sur [+ Nouvelle délégation]            │
│                               ▼                                             │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    NOUVELLE DÉLÉGATION                           │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPE DE DÉLÉGATION                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Délégation pour une séance                           │    │      │
│  │  │   (Présider une séance en votre absence)               │    │      │
│  │  │                                                         │    │      │
│  │  │ ● Délégation temporaire                                │    │      │
│  │  │   (Pouvoirs délégués pour une période définie)         │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Délégation spécifique                                │    │      │
│  │  │   (Pour une action précise uniquement)                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉLÉGATAIRE                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Déléguer à:                                            │    │      │
│  │  │ ● Vice-Président: Pierre MBALLA                        │    │      │
│  │  │ ○ Secrétaire: Marie NGUEMO                             │    │      │
│  │  │ ○ Trésorier: Robert TCHANA                             │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ Seuls les membres du Bureau peuvent recevoir       │    │      │
│  │  │    une délégation de pouvoirs.                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PÉRIODE DE DÉLÉGATION                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Du: [01/04/2026]                                       │    │      │
│  │  │ Au: [15/04/2026]                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Durée: 15 jours                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Motif:                                                 │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Voyage à l'étranger pour raisons familiales    │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ POUVOIRS DÉLÉGUÉS                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Valider les opérations financières                   │    │      │
│  │  │ ☑ Valider les documents (ODJ, PV)                      │    │      │
│  │  │ ☑ Présider les séances                                 │    │      │
│  │  │ ☑ Signer les distributions de cagnotte                 │    │      │
│  │  │ ☐ Finaliser les adhésions                              │    │      │
│  │  │ ☐ Annuler des sanctions                                │    │      │
│  │  │ ☐ Publier des annonces au nom du Président             │    │      │
│  │  │                                                         │    │      │
│  │  │ [Tout sélectionner]  [Tout désélectionner]             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ NOTIFICATIONS                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ M'informer de chaque action effectuée               │    │      │
│  │  │ ☑ Notifier tous les membres de la délégation          │    │      │
│  │  │ ☑ Résumé quotidien des actions                        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Activer la délégation]                             │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIRMATION                                  │      │
│  │                                                                  │      │
│  │  ⚠️ Vous êtes sur le point de déléguer des pouvoirs à           │      │
│  │     Pierre MBALLA (Vice-Président) pour la période              │      │
│  │     du 01/04/2026 au 15/04/2026.                                │      │
│  │                                                                  │      │
│  │  Pouvoirs délégués:                                             │      │
│  │  • Valider les opérations financières                           │      │
│  │  • Valider les documents                                        │      │
│  │  • Présider les séances                                         │      │
│  │  • Signer les distributions                                     │      │
│  │                                                                  │      │
│  │  Le délégataire aura accès aux fonctionnalités                  │      │
│  │  correspondantes dans son espace.                               │      │
│  │                                                                  │      │
│  │  Code OTP pour confirmer: [______]                              │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer la délégation]                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ DÉLÉGATION ACTIVÉE                         │      │
│  │                                                                  │      │
│  │  La délégation de pouvoirs est maintenant active.               │      │
│  │                                                                  │      │
│  │  • Délégataire: Pierre MBALLA (Vice-Président)                  │      │
│  │  • Période: 01/04/2026 - 15/04/2026                             │      │
│  │  • Pouvoirs: Validations, Présidence, Signatures                │      │
│  │                                                                  │      │
│  │  Actions effectuées:                                            │      │
│  │  • Pierre MBALLA notifié et accès activés                       │      │
│  │  • Tous les membres du Bureau notifiés                          │      │
│  │  • Annonce publiée pour tous les membres                        │      │
│  │                                                                  │      │
│  │  Vous pouvez révoquer cette délégation à tout moment.           │      │
│  │                                                                  │      │
│  │  [Voir la délégation]  [Révoquer]                               │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 13.2 Sous-Flow : Révocation de Délégation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: RÉVOCATION DE DÉLÉGATION                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    RÉVOQUER LA DÉLÉGATION                        │      │
│  │                                                                  │      │
│  │  Délégation active:                                             │      │
│  │  • Délégataire: Pierre MBALLA                                   │      │
│  │  • Période: 01/04/2026 - 15/04/2026                             │      │
│  │  • Actions effectuées: 3                                        │      │
│  │                                                                  │      │
│  │  ⚠️ En révoquant cette délégation:                              │      │
│  │  • Pierre MBALLA perdra immédiatement ses accès délégués        │      │
│  │  • Les actions déjà effectuées restent valides                  │      │
│  │  • Vous reprendrez tous vos pouvoirs                            │      │
│  │                                                                  │      │
│  │  Motif de révocation (optionnel):                               │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ Retour anticipé de voyage                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer la révocation]                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ DÉLÉGATION RÉVOQUÉE                        │      │
│  │                                                                  │      │
│  │  La délégation a été révoquée avec effet immédiat.              │      │
│  │                                                                  │      │
│  │  • Pierre MBALLA notifié                                        │      │
│  │  • Accès délégués désactivés                                    │      │
│  │  • Tous les membres du Bureau notifiés                          │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 13.3 Règles Métier - Délégation de Pouvoirs

| Règle | Description |
|-------|-------------|
| RM-DP01 | Seuls les membres du Bureau peuvent recevoir une délégation |
| RM-DP02 | Le Vice-Président est le délégataire naturel |
| RM-DP03 | Les pouvoirs délégués sont sélectionnables |
| RM-DP04 | Le Président reste informé des actions effectuées |
| RM-DP05 | La délégation peut être révoquée à tout moment |
| RM-DP06 | Toutes les délégations sont historisées |

---

# 14. FLOW 13 : BLOCAGE D'URGENCE

## 14.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: BLOCAGE D'URGENCE                                  │
├──���──────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🚨 Situation     │                                                       │
│  │ d'urgence        │                                                       │
│  │ détectée         │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    BLOCAGE D'URGENCE                             │      │
│  │                                                                  │      │
│  │  ⚠️ Cette fonctionnalité permet de bloquer immédiatement        │      │
│  │     toutes les opérations financières de la tontine.            │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPE DE BLOCAGE                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Blocage total                                        │    │      │
│  │  │   Toutes les opérations financières sont bloquées      │    │      │
│  │  │                                                         │    │      │
│  │  │ ● Blocage partiel                                      │    │      │
│  │  │   Sélectionner les opérations à bloquer                │    │      │
│  │  │                                                         │    │      │
│  │  │ Si blocage partiel:                                    │    │      │
│  │  │ ☑ Décaissements de prêts                               │    │      │
│  │  │ ☑ Transferts entre caisses                             │    │      │
│  │  │ ☐ Paiements Mobile Money sortants                      │    │      │
│  │  │ ☐ Distributions de cagnottes                           │    │      │
│  │  │ ☐ Dépenses                                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MOTIF DU BLOCAGE (obligatoire)                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Suspicion de fraude                                  │    │      │
│  │  │ ● Anomalie détectée par le Commissaire                 │    │      │
│  │  │ ○ Erreur technique                                     │    │      │
│  │  │ ○ Litige en cours                                      │    │      │
│  │  │ ○ Autre                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Description:                                           │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Écart significatif détecté sur la caisse       │    │    │      │
│  │  │ │ principale. Blocage des décaissements en       │    │    │      │
│  │  │ │ attendant vérification complète.               │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ NOTIFICATIONS                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Notifier le Bureau                                   │    │      │
│  │  │ ☑ Notifier le Commissaire aux Comptes                  │    │      │
│  │  │ ☐ Notifier tous les membres                            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ⚠️ Le blocage prend effet immédiatement et reste actif        │      │
│  │     jusqu'à levée manuelle par le Président.                    │      │
│  │                                                                  │      │
│  │  [Annuler]  [🚨 Activer le blocage]                             │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIRMATION BLOCAGE                          │      │
│  │                                                                  │      │
│  │  🚨 ATTENTION - ACTION CRITIQUE                                 │      │
│  │                                                                  │      │
│  │  Vous êtes sur le point de bloquer les opérations suivantes:    │      │
│  │  • Décaissements de prêts                                       │      │
│  │  • Transferts entre caisses                                     │      │
│  │                                                                  │      │
│  │  Opérations en attente qui seront bloquées:                     │      │
│  │  • 1 décaissement de prêt (200,000 XAF)                         │      │
│  │  • 0 transfert                                                  │      │
│  │                                                                  │      │
│  │  Code OTP pour confirmer: [______]                              │      │
│  │                                                                  │      │
│  │  Tapez "BLOQUER" pour confirmer: [__________]                   │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer le blocage]                              │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    🚨 BLOCAGE ACTIVÉ                             │      │
│  │                                                                  │      │
│  │  Le blocage d'urgence est maintenant actif.                     │      │
│  │                                                                  │      │
│  │  Référence: BLOC-2026-001                                       │      │
│  │  Activé le: 05/04/2026 à 14:30                                  │      │
│  │  Activé par: Président (Jean FOTSO)                             │      │
│  │                                                                  │      │
│  │  Opérations bloquées:                                           │      │
│  │  • Décaissements de prêts                                       │      │
│  │  • Transferts entre caisses                                     │      │
│  │                                                                  │      │
│  │  Notifications envoyées:                                        │      │
│  │  • Bureau ✅                                                    │      │
│  │  • Commissaire aux Comptes ✅                                   │      │
│  │                                                                  │      │
│  │  Le Trésorier ne pourra plus effectuer ces opérations          │      │
│  │  jusqu'à la levée du blocage.                                   │      │
│  │                                                                  │      │
│  │  [Voir le blocage]  [Lever le blocage]                          │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 14.2 Sous-Flow : Lever le Blocage

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: LEVER LE BLOCAGE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    LEVER LE BLOCAGE D'URGENCE                    │      │
│  │                                                                  │      │
│  │  Blocage actif: BLOC-2026-001                                   │      │
│  │  Activé le: 05/04/2026 à 14:30                                  │      │
│  │  Durée: 2 jours                                                 │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ JUSTIFICATION DE LA LEVÉE                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Résolution de l'anomalie:                              │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Après vérification avec le Trésorier et le     │    │    │      │
│  │  │ │ Commissaire aux Comptes, l'écart était dû à    │    │    │      │
│  │  │ │ un retard d'enregistrement. Situation          │    │    │      │
│  │  │ │ régularisée.                                   │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Actions correctives effectuées:                        │    │      │
│  │  │ ☑ Vérification complète des caisses                   │    │      │
│  │  │ ☑ Réconciliation effectuée                            │    │      │
│  │  │ ☑ Rapport du Commissaire reçu                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ☑ Notifier tous les concernés de la levée                     │      │
│  │                                                                  │      │
│  │  Code OTP pour confirmer: [______]                              │      │
│  │                                                                  │      │
│  │  [Annuler]  [Lever le blocage]                                  │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ BLOCAGE LEVÉ                               │      │
│  │                                                                  │      │
│  │  Le blocage d'urgence BLOC-2026-001 a été levé.                 │      │
│  │                                                                  │      │
│  │  • Opérations financières rétablies                             │      │
│  │  • Bureau notifié                                               │      │
│  │  • Commissaire aux Comptes notifié                              │      │
│  │  • Trésorier notifié                                            │      │
│  │  • Historique de l'incident archivé                             │      │
│  │                                                                  │      │
│  │  Opérations en attente débloquées:                              │      │
│  │  • 1 décaissement de prêt peut être traité                      │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 14.3 Règles Métier - Blocage d'Urgence

| Règle | Description |
|-------|-------------|
| RM-BU01 | Seul le Président peut activer/lever un blocage |
| RM-BU02 | Le blocage prend effet immédiatement |
| RM-BU03 | Un motif est obligatoire |
| RM-BU04 | Le Bureau et le Commissaire sont notifiés |
| RM-BU05 | Toutes les actions sont historisées |

---

# 15. FLOW 14 : CONSULTATION DES RAPPORTS

## 15.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CONSULTATION DES RAPPORTS                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Président clique │                                                       │
│  │ "Rapports"       │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    RAPPORTS ET STATISTIQUES                      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RAPPORTS DISPONIBLES                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ 📊 RAPPORTS FINANCIERS                                 │    │      │
│  │  │ • État des caisses (temps réel)           [Voir]       │    │      │
│  │  │ • Bilan mensuel (Mars 2026)               [Voir]       │    │      │
│  │  │ • Bilan de cycle (#2)                     [Voir]       │    │      │
│  │  │ • Évolution des cotisations               [Voir]       │    │      │
│  │  │                                                         │    │      │
│  │  │ 👥 RAPPORTS MEMBRES                                    │    │      │
│  │  │ • Situation par membre                    [Voir]       │    │      │
│  │  │ • Taux de présence                        [Voir]       │    │      │
│  │  │ • Cotisations en retard                   [Voir]       │    │      │
│  │  │ • Historique adhésions/démissions         [Voir]       │    │      │
│  │  │                                                         │    │      │
│  │  │ 💳 RAPPORTS PRÊTS                                      │    │      │
│  │  │ • Prêts en cours                          [Voir]       │    │      │
│  │  │ • Prêts en retard                         [Voir]       │    │      │
│  │  │ • Historique des prêts                    [Voir]       │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚖️ RAPPORTS SANCTIONS                                  │    │      │
│  │  │ • Sanctions du cycle                      [Voir]       │    │      │
│  │  │ • Sanctions par membre                    [Voir]       │    │      │
│  │  │                                                         │    │      │
│  │  │ 📋 RAPPORTS D'AUDIT                                    │    │      │
│  │  │ • Dernier rapport Commissaire             [Voir]       │    │      │
│  │  │ • Historique des audits                   [Voir]       │    │      │
│  │  │ • Recommandations en cours                [Voir]       │    │      │
│  │  │                                                         │    │      │
│  │  │ 📈 TABLEAUX DE BORD                                    │    │      │
│  │  │ • Performance globale                     [Voir]       │    │      │
│  │  │ • Comparaison cycles                      [Voir]       │    │      │
│  │  └──────────────────────────────────────���──────────────────┘    │      │
│  │                                                                  │      │
│  │  [📥 Exporter tous les rapports]  [📅 Programmer un rapport]    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 15.2 Sous-Flow : Visualisation d'un Rapport

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: RAPPORT ÉTAT DES CAISSES                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ÉTAT DES CAISSES                              │      │
│  │                    07 Avril 2026 - 15:30                         │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SOLDES ACTUELS                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ 🏦 Caisse principale                                   │    │      │
│  │  │    Solde: 2,520,000 XAF                                │    │      │
│  │  │    Évolution 30j: +320,000 XAF (+14.5%)                │    │      │
│  │  │    ████████████████████░░░░░░░░░░ 63%                  │    │      │
│  │  │                                                         │    │      │
│  │  │ 🛡️ Caisse de secours                                   │    │      │
│  │  │    Solde: 1,100,000 XAF                                │    │      │
│  │  │    Évolution 30j: +150,000 XAF (+15.8%)                │    │      │
│  │  │    ████████████░░░░░░░░░░░░░░░░░░ 28%                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚙️ Caisse de fonctionnement                            │    │      │
│  │  │    Solde: 120,000 XAF                                  │    │      │
│  │  │    Évolution 30j: -30,000 XAF (-20.0%)                 │    │      │
│  │  │    ███░░░░░░░░░░░░░░░░░░░░░░░░░░░ 3%                   │    │      │
│  │  │    ⚠️ Solde bas - Prévoir alimentation                 │    │      │
│  │  │                                                         │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ 💰 TOTAL: 3,740,000 XAF                                │    │      │
│  │  │    Évolution 30j: +440,000 XAF (+13.3%)                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MOUVEMENTS RÉCENTS (7 derniers jours)                   │    │      │
│  ��  │                                                         │    │      │
│  │  │ 📈 Entrées: +850,000 XAF                               │    │      │
│  │  │ • Cotisations: 750,000 XAF                             │    │      │
│  │  │ • Remboursements prêts: 70,000 XAF                     │    │      │
│  │  │ • Sanctions: 30,000 XAF                                │    │      │
│  │  │                                                         │    │      │
│  │  │ 📉 Sorties: -520,000 XAF                               │    │      │
│  │  │ • Distributions: 450,000 XAF                           │    │      │
│  │  │ • Dépenses: 70,000 XAF                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Solde net: +330,000 XAF                                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ GRAPHIQUE D'ÉVOLUTION                                   │    │      │
│  │  │                                                         │    │      │
│  │  │     ^                                                  │    │      │
│  │  │ 4M  │                              ▄▄▄▄                │    │      │
│  │  │     │                         ▄▄▄▄▀                    │    │      │
│  │  │ 3M  │                    ▄▄▄▄▀                         │    │      │
│  │  │     │               ▄▄▄▄▀                              │    │      │
│  │  │ 2M  │          ▄▄▄▄▀                                   │    │      │
│  │  │     │     ▄▄▄▄▀                                        │    │      │
│  │  │ 1M  │▄▄▄▄▀                                             │    │      │
│  │  │     └──────────────────────────────────────────────>   │    │      │
│  │  │       Jan   Fév   Mar   Avr                            │    │      │
│  │  │                                                         │    │      │
│  │  │   ── Total  ── Principale  ── Secours                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [📥 Exporter PDF]  [📊 Exporter Excel]  [🔄 Actualiser]        │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 15.3 Règles Métier - Consultation Rapports

| Règle | Description |
|-------|-------------|
| RM-CR01 | Le Président a accès à tous les rapports |
| RM-CR02 | Les rapports sont exportables en PDF et Excel |
| RM-CR03 | Les rapports peuvent être programmés |
| RM-CR04 | Les données sont en temps réel |

---

# 16. RÉCAPITULATIF DES ÉCRANS DU PRÉSIDENT

## 16.1 Liste des Écrans

| # | Écran | Description | Accès |
|---|-------|-------------|-------|
| E-PR01 | Tableau de bord | Vue d'ensemble et alertes | Menu principal |
| E-PR02 | Validations opérations | Approuver opérations financières | Notifications |
| E-PR03 | Validations documents | Approuver ODJ, PV, adhésions | Notifications |
| E-PR04 | Gestion séance | Ouvrir, diriger, clôturer | Menu principal |
| E-PR05 | Lancer vote en séance | Votes pendant la séance | Pendant séance |
| E-PR06 | Signature distribution | Signer la cagnotte | Pendant séance |
| E-PR07 | Gestion membres | Adhésions, démissions, radiations | Menu principal |
| E-PR08 | Cotisation extraordinaire | Lancer et suivre | Menu principal |
| E-PR09 | Médiation conflits | Gérer les conflits escaladés | Notifications |
| E-PR10 | Clôture de cycle | Clôturer et initialiser | Fin de cycle |
| E-PR11 | Communication | Publier annonces | Menu principal |
| E-PR12 | Vote en ligne | Lancer votes/sondages | Menu principal |
| E-PR13 | Annulation sanction | Traiter contestations | Notifications |
| E-PR14 | Délégation pouvoirs | Déléguer au Bureau | Menu principal |
| E-PR15 | Blocage urgence | Bloquer opérations | Menu principal |
| E-PR16 | Rapports | Consulter tous les rapports | Menu principal |

## 16.2 Navigation du Président

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NAVIGATION - PRÉSIDENT                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         MENU PRINCIPAL                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│       ┌────────────┬───────────────┼───────────────┬────────────┐          │
│       │            │               │               │            │          │
│       ▼            ▼               ▼               ▼            ▼          │
│  ┌─────────┐  ┌─────────┐    ┌─────────┐    ┌─────────┐   ┌─────────┐     │
│  │Tableau  │  │Validat- │    │Séances  │    │Membres  │   │Communic.│     │
│  │de bord  │  │ions     │    │         │    │         │   │         │     │
│  └────┬────┘  └────┬────┘    └────┬────┘    └────┬────┘   └────┬────┘     │
│       │            │              │              │             │           │
│       │       ┌────┴────┐    ┌────┴────┐    ┌────┴────┐   ┌────┴────┐     │
│       │       ▼         ▼    ▼         ▼    ▼         ▼   ▼         ▼     │
│       │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│       │   │Opérat│ │Docum.│ │Gérer │ │Clôtur│ │Adhés.│ │Annonc│ │Votes │ │
│       │   │ions  │ │      │ │séance│ │cycle │ │Démis.│ │es    │ │      │ │
│       │   └──────┘ └──────┘ └──────┘ └──────┘ └───��──┘ └──────┘ └──────┘ │
│       │                                                                    │
│       ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                    ACTIONS SUPPLÉMENTAIRES                          │  │
│  ├─────────────────────────────────────────────────────────────────────┤  │
│  │                                                                     │  │
│  │  [📊 Rapports]  [🔧 Délégation]  [🚨 Blocage]  [⚖️ Médiation]      │  │
│  │                                                                     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 17. RÈGLES MÉTIER - RÉCAPITULATIF PRÉSIDENT

## 17.1 Pouvoirs du Président

| Domaine | Pouvoir | Seul | Avec Bureau | Avec AG |
|---------|---------|------|-------------|---------|
| Opérations financières | Valider/Refuser/Bloquer | ✅ | | |
| Documents | Valider ODJ, PV | ✅ | | |
| Séances | Ouvrir/Diriger/Clôturer | ✅ | | |
| Adhésions | Finaliser après vote | ✅ | | ✅ |
| Démissions | Valider | ✅ | | |
| Suspensions/Radiations | Proposer | | ✅ | ✅ |
| Cotisation extraordinaire | Lancer après vote | ✅ | | ✅ |
| Sanctions | Annuler | ✅ | | |
| Conflits | Médiation/Décision | ✅ | | |
| Communication | Annonces directes | ✅ | | |
| Votes en ligne | Lancer | ✅ | ✅ | |
| Délégation | Au Bureau uniquement | ✅ | | |
| Blocage urgence | Activer/Lever | ✅ | | |
| Clôture cycle | Avec Commissaire | ✅ | | |

## 17.2 Interactions avec Autres Rôles

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERACTIONS PRÉSIDENT ↔ AUTRES RÔLES                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PRÉSIDENT                              VICE-PRÉSIDENT                      │
│  ─────────                              ──────────────                      │
│  Délègue pouvoirs ─────────────────────► Reçoit délégation                 │
│  Supervise ◄────────────────────────────  Remplace si absent               │
│                                                                             │
│  PRÉSIDENT                              SECRÉTAIRE                          │
│  ─────────                              ──────────                          │
│  Valide ODJ ◄───────────────────────────  Prépare ODJ                      │
│  Signe PV ◄─────────────────────────────  Rédige et signe PV               │
│  Valide adhésions ◄─────────────────────  Traite dossiers                  │
│                                                                             │
│  PRÉSIDENT                              TRÉSORIER                           │
│  ─────────                              ─────────                           │
│  Valide opérations ◄────────────────────  Soumet opérations                │
│  Signe distributions ◄──────────────────  Prépare distributions            │
│  Peut bloquer ──────────────────────────► Subit le blocage                 │
│  Reçoit alertes ◄───────────────────────  Signale anomalies                │
│                                                                             │
│  PRÉSIDENT                              CENSEUR                             │
│  ─────────                              ───────                             │
│  Valide justificatifs ◄─────────────────  Examine justificatifs            │
│  Annule sanctions ◄─────────────────────  Applique sanctions               │
│  Médiation conflits ◄──────────────────  Escalade conflits                 │
│                                                                             │
│  PRÉSIDENT                              COMMISSAIRE AUX COMPTES             │
│  ─────────                              ────────────────────────            │
│  Valide opérations (en parallèle) ◄────► Valide opérations                 │
│  Reçoit signalements ◄──────────────────  Signale anomalies                │
│  Reçoit recommandations ◄───────────────  Émet recommandations             │
│  Valide clôture cycle ◄─────────────────  Certifie les comptes             │
│                                                                             │
│  PRÉSIDENT                              MEMBRES                             │
│  ─────────                              ───────                             │
│  Publie annonces ───────────────────────► Reçoivent annonces               │
│  Lance votes ───────────────────────────► Participent aux votes            │
│  Finalise adhésions ────────────────────► Deviennent membres               │
│  Traite contestations ◄─────────────────  Contestent sanctions             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 18. CONCLUSION

Ce document présente l'ensemble des **flows du Président** pour l'application de gestion de tontine au Cameroun. Le Président dispose de pouvoirs étendus pour :

1. **Valider** les opérations financières et documents
2. **Diriger** les séances et gérer les votes
3. **Décider** seul sur de nombreux sujets
4. **Communiquer** directement avec les membres
5. **Déléguer** au Bureau en cas d'absence
6. **Bloquer** en cas d'urgence

Le système garantit une **traçabilité complète** de toutes les décisions du Président, avec des notifications automatiques vers les parties concernées.
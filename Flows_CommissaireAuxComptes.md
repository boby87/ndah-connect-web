# 🟣 FLOWS COMPLETS DU COMMISSAIRE AUX COMPTES
## Application de Gestion de Tontine - Cameroun
### Version 1.0 | Mars 2026

---

# TABLE DES MATIÈRES

1. [Vue d'Ensemble](#1-vue-densemble)
2. [Tableau de Bord du Commissaire](#2-tableau-de-bord-du-commissaire)
3. [Flow 1 : Consultation des Données Financières](#3-flow-1--consultation-des-données-financières)
4. [Flow 2 : Validation d'un Transfert entre Caisses](#4-flow-2--validation-dun-transfert-entre-caisses)
5. [Flow 3 : Validation d'une Dépense](#5-flow-3--validation-dune-dépense)
6. [Flow 4 : Validation d'un Décaissement de Prêt](#6-flow-4--validation-dun-décaissement-de-prêt)
7. [Flow 5 : Vérification du Bilan de Séance](#7-flow-5--vérification-du-bilan-de-séance)
8. [Flow 6 : Contrôle Périodique](#8-flow-6--contrôle-périodique)
9. [Flow 7 : Réalisation d'un Audit](#9-flow-7--réalisation-dun-audit)
10. [Flow 8 : Signalement d'Anomalie](#10-flow-8--signalement-danomalie)
11. [Flow 9 : Certification des Comptes](#11-flow-9--certification-des-comptes)
12. [Flow 10 : Demande d'Éclaircissements](#12-flow-10--demande-déclaircissements)
13. [Flow 11 : Émission de Recommandations](#13-flow-11--émission-de-recommandations)
14. [Flow 12 : Suivi des Recommandations](#14-flow-12--suivi-des-recommandations)
15. [Flow 13 : Génération du Rapport de Séance](#15-flow-13--génération-du-rapport-de-séance)
16. [Flow 14 : Validation de Clôture de Cycle](#16-flow-14--validation-de-clôture-de-cycle)
17. [Flow 15 : Consultation des Justificatifs](#17-flow-15--consultation-des-justificatifs)
18. [Flow 16 : Export des Données pour Audit](#18-flow-16--export-des-données-pour-audit)
19. [Récapitulatif des Écrans](#19-récapitulatif-des-écrans)
20. [Règles Métier et Intégrations](#20-règles-métier-et-intégrations)

---

# 1. VUE D'ENSEMBLE

## 1.1 Rôle du Commissaire aux Comptes

Le Commissaire aux Comptes est le **gardien de la transparence financière** de la tontine. Membre élu, il contrôle les opérations financières, valide certaines transactions sensibles, réalise des audits et certifie les comptes. Il reste également un **membre actif** pouvant cotiser et bénéficier de la cagnotte.

## 1.2 Caractéristiques du Rôle

| Caractéristique | Description |
|-----------------|-------------|
| Statut | Membre élu de la tontine |
| Adjoint | Oui, un suppléant |
| Membre actif | Oui (cotise et reçoit la cagnotte) |
| Accès données | Temps réel, toutes données financières |
| Historique | Accès aux cycles précédents |
| Indépendance | Peut valider ses propres opérations (pas d'exclusion) |

## 1.3 Résumé des Pouvoirs

| Domaine | Pouvoir | Condition |
|---------|---------|-----------|
| Consultation | Voir toutes les données financières | Temps réel |
| Consultation | Voir les justificatifs originaux | Aucune |
| Consultation | Voir l'historique (tous cycles) | Aucune |
| Validation | Valider transferts entre caisses | Avec Président |
| Validation | Valider dépenses > plafond | Avec Président |
| Validation | Valider décaissements de prêts | Avec Président |
| Validation | Valider clôture de cycle | Avec Président |
| Contrôle | Vérifier bilans de séance | Obligatoire |
| Contrôle | Effectuer contrôles périodiques | Selon configuration |
| Audit | Réaliser audits formels | Selon configuration |
| Audit | Générer rapports d'audit | Automatique |
| Certification | Certifier les comptes | Avant assemblée |
| Signalement | Signaler anomalies | Au Président/Bureau/Assemblée |
| Recommandations | Émettre des recommandations | Au Bureau |
| Rapport | Présenter rapport à chaque séance | Intégré au PV |
| Délégation | Déléguer à son adjoint | Aucune restriction |

## 1.4 Liste des Flows

| # | Flow | Description |
|---|------|-------------|
| 1 | Consultation Données Financières | Accéder aux caisses, mouvements, historique |
| 2 | Validation Transfert | Approuver/refuser un transfert entre caisses |
| 3 | Validation Dépense | Approuver/refuser une dépense > plafond |
| 4 | Validation Décaissement Prêt | Approuver/refuser un décaissement |
| 5 | Vérification Bilan Séance | Contrôler le bilan du trésorier |
| 6 | Contrôle Périodique | Effectuer un contrôle planifié |
| 7 | Réalisation Audit | Mener un audit formel |
| 8 | Signalement Anomalie | Signaler une irrégularité |
| 9 | Certification Comptes | Certifier les états financiers |
| 10 | Demande Éclaircissements | Questionner le trésorier |
| 11 | Émission Recommandations | Proposer des améliorations |
| 12 | Suivi Recommandations | Vérifier la mise en œuvre |
| 13 | Rapport de Séance | Présenter son rapport |
| 14 | Validation Clôture Cycle | Valider la fin d'un cycle |
| 15 | Consultation Justificatifs | Examiner les pièces originales |
| 16 | Export Données Audit | Extraire les données pour analyse |

---

# 2. TABLEAU DE BORD DU COMMISSAIRE AUX COMPTES

## 2.1 Vue Générale

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TABLEAU DE BORD - COMMISSAIRE AUX COMPTES                │
│                    Tontine: [Nom de la Tontine]                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      🔔 ALERTES ET TÂCHES URGENTES                  │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ • 2 transferts entre caisses en attente de validation              │   │
│  │ • 1 dépense > plafond en attente de validation                     │   │
│  │ • 1 décaissement de prêt en attente de validation                  │   │
│  │ • Bilan de séance #8 à vérifier                                    │   │
│  │ • Contrôle mensuel à effectuer (échéance: 20 Mars 2026)            │   │
│  │ • ⚠️ 1 anomalie détectée par le système (écart de caisse)         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      💰 ÉTAT DES CAISSES (Temps Réel)               │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ 💵 PRINCIPALE│  │ 🏥 SECOURS   │  │ ⚙️ FONCT.    │              │   │
│  │  │              │  │              │  │              │              │   │
│  │  │ 2,450,000    │  │   350,000    │  │   125,000    │              │   │
│  │  │     XAF      │  │     XAF      │  │     XAF      │              │   │
│  │  │              │  │              │  │              │              │   │
│  │  │ [Détails]    │  │ [Détails]    │  │ [Détails]    │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                     │   │
│  │  TOTAL GÉNÉRAL: 2,925,000 XAF                                      │   │
│  │  Dernière mise à jour: 15/03/2026 16:45                            │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  ✅ VALIDATIONS EN ATTENTE       │  │  📊 DERNIERS MOUVEMENTS      │    │
│  ├──────────────────────────────────┤  ├──────────────────────────────┤    │
│  │                                  │  │                              │    │
│  │ Transferts: 2                    │  │ 15/03 16:30 - Cotisation     │    │
│  │ Dépenses: 1                      │  │ +150,000 XAF (KAMGA)         │    │
│  │ Décaissements prêts: 1           │  │                              │    │
│  │                                  │  │ 15/03 16:00 - Distribution   │    │
│  │ Total: 4 validations             │  │ -1,802,500 XAF (NGOUFACK)    │    │
│  │                                  │  │                              │    │
│  │ [Traiter les validations]        │  │ 15/03 15:45 - Sanction       │    │
│  │                                  │  │ +10,000 XAF (KAMGA)          │    │
│  │                                  │  │                              │    │
│  │                                  │  │ [Voir tous les mouvements]   │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  ⚠️ ANOMALIES DÉTECTÉES          │  │  📅 CONTRÔLES À EFFECTUER    │    │
│  ├──────────────────────────────────┤  ├──────────────────────────────┤    │
│  │                                  │  │                              │    │
│  │ ⚠️ Écart de caisse détecté      │  │ Contrôle mensuel Mars:       │    │
│  │    Caisse fonctionnement         │  │ Échéance: 20/03/2026         │    │
│  │    Attendu: 130,000 XAF          │  │ Statut: ⏳ À faire           │    │
│  │    Réel: 125,000 XAF             │  │                              │    │
│  │    Écart: -5,000 XAF             │  │ Audit trimestriel Q1:        │    │
│  │    [Examiner]                    │  │ Échéance: 31/03/2026         │    │
│  │                                  │  │ Statut: ⏳ À faire           │    │
│  │                                  │  │                              │    │
│  │                                  │  │ [Voir calendrier]            │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  📋 RAPPORTS À PRODUIRE          │  │  💳 PRÊTS EN COURS           │    │
│  ├──────────────────────────────────┤  ├──────────────────────────────┤    │
│  │                                  │  │                              │    │
│  │ • Rapport séance #8              │  │ Nombre: 8 prêts actifs       │    │
│  │   Statut: ⏳ À générer           │  │ Montant total: 1,200,000 XAF │    │
│  │                                  │  │                              │    │
│  │ • Certification mensuelle Mars   │  │ En retard: 2 prêts           │    │
│  │   Statut: ⏳ En attente bilan    │  │ Montant: 180,000 XAF         │    │
│  │                                  │  │                              │    │
│  │ [Générer rapports]               │  │ [Voir détails prêts]         │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  📈 DÉPENSES DU MOIS             │  │  📜 HISTORIQUE AUDITS        │    │
│  ├──────────────────────────────────┤  ├──────────────────────────────┤    │
│  │                                  │  │                              │    │
│  │ Total: 85,000 XAF               │  │ Dernier audit: 28/02/2026    │    │
│  │                                  │  │ Résultat: ✅ Conforme        │    │
│  │ • Location salle: 50,000         │  │                              │    │
│  │ • Fournitures: 25,000            │  │ Recommandations émises: 2    │    │
│  │ • Divers: 10,000                 │  │ Mises en œuvre: 1/2          │    │
│  │                                  │  │                              │    │
│  │ Justificatifs: 3/3 ✅            │  │ [Voir historique complet]    │    │
│  │                                  │  │                              │    │
│  │ [Voir détails]                   │  │                              │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      ⚡ ACTIONS RAPIDES                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  [✅ Validations]  [🔍 Contrôle]  [📊 Audit]  [⚠️ Signaler]        │   │
│  │                                                                     │   │
│  │  [📋 Rapports]  [📜 Certifier]  [💡 Recommandations]  [📥 Export]  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Indicateurs du Tableau de Bord

| Indicateur | Description | Mise à jour |
|------------|-------------|-------------|
| État des caisses | Solde de chaque caisse | Temps réel |
| Validations en attente | Transferts, dépenses, prêts à valider | Temps réel |
| Derniers mouvements | Historique des transactions récentes | Temps réel |
| Anomalies détectées | Écarts et irrégularités identifiés | Temps réel |
| Contrôles à effectuer | Calendrier des contrôles planifiés | Quotidien |
| Rapports à produire | Liste des rapports en attente | Temps réel |
| Dépenses du mois | Total et détail des dépenses | Temps réel |
| Prêts en cours | Situation des prêts actifs | Temps réel |
| Historique audits | Résumé des derniers audits | Après chaque audit |
| Alertes système | Notifications importantes | Temps réel |

---

# 3. FLOW 1 : CONSULTATION DES DONNÉES FINANCIÈRES

## 3.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CONSULTATION DES DONNÉES FINANCIÈRES               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Commissaire      │                                                       │
│  │ accède aux       │                                                       │
│  │ "Données         │                                                       │
│  │  financières"    │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    MENU CONSULTATION                             │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DONNÉES DISPONIBLES                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ 🏦 État des caisses                                     │    │      │
│  │  │    Soldes actuels et historique                        │    │      │
│  │  │    [Consulter]                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 📊 Mouvements de caisse                                 │    │      │
│  │  │    Toutes les transactions (entrées/sorties)           │    │      │
│  │  │    [Consulter]                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 💵 Cotisations                                          │    │      │
│  │  │    Paiements par membre, arriérés, avances             │    │      │
│  │  │    [Consulter]                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 💳 Prêts                                                │    │      │
│  │  │    Prêts actifs, remboursements, retards               │    │      │
│  │  │    [Consulter]                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 📝 Dépenses                                             │    │      │
│  │  │    Dépenses enregistrées avec justificatifs            │    │      │
│  │  │    [Consulter]                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 🎁 Distributions                                        │    │      │
│  │  │    Cagnottes distribuées par séance                    │    │      │
│  │  │    [Consulter]                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚖️ Sanctions                                            │    │      │
│  │  │    Sanctions appliquées et encaissées                  │    │      │
│  │  │    [Consulter]                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 📜 Historique (cycles précédents)                       │    │      │
│  │  │    Données des cycles terminés                         │    │      │
│  │  │    [Consulter]                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Sous-Flow : Consultation État des Caisses

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: ÉTAT DES CAISSES                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ÉTAT DES CAISSES - DÉTAILLÉ                   │      │
│  │                                                                  │      │
│  │  Période: [Cycle actuel ▼]  Date: [15/03/2026]                  │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CAISSE PRINCIPALE                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Solde actuel: 2,450,000 XAF                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Évolution du mois:                                     │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ 📈 [Graphique d'évolution du solde]            │    │    │      │
│  │  │ │     2.5M ─────────────────────●                │    │    │      │
│  │  │ │     2.0M ────────●────────────                 │    │    │      │
│  │  │ │     1.5M ●───────                              │    │    │      │
│  │  │ │          01/03  08/03  15/03                   │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Entrées ce mois: +3,600,000 XAF                        │    │      │
│  │  │ Sorties ce mois: -3,150,000 XAF                        │    │      │
│  │  │ Variation: +450,000 XAF                                │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir mouvements détaillés]                            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CAISSE DE SECOURS                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Solde actuel: 350,000 XAF                              │    │      │
│  │  │ Entrées ce mois: +97,500 XAF (prélèvements 5%)         │    │      │
│  │  │ Sorties ce mois: -0 XAF                                │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir mouvements détaillés]                            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CAISSE DE FONCTIONNEMENT                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Solde actuel: 125,000 XAF                              │    │      │
│  │  │ Entrées ce mois: +100,000 XAF                          │    │      │
│  │  │ Sorties ce mois: -85,000 XAF (dépenses)                │    │      │
│  │  │                                                         │    │      │
│  ��  │ ⚠️ Note: Écart de -5,000 XAF détecté                   │    │      │
│  │  │    (Attendu: 130,000 XAF)                              │    │      │
│  │  │    [Examiner l'écart]                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir mouvements détaillés]                            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  TOTAL GÉNÉRAL: 2,925,000 XAF                                   │      │
│  │                                                                  │      │
│  │  [📥 Exporter PDF]  [📊 Exporter Excel]                         │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└───────────────��─────────────────────────────────────────────────────────────┘
```

## 3.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-CD01 | Le commissaire a accès à toutes les données financières en temps réel |
| RM-CD02 | Il peut consulter l'historique de tous les cycles |
| RM-CD03 | Les données sont en lecture seule (pas de modification) |
| RM-CD04 | Il peut exporter les données en PDF et Excel |

---

# 4. FLOW 2 : VALIDATION D'UN TRANSFERT ENTRE CAISSES

## 4.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: VALIDATION D'UN TRANSFERT ENTRE CAISSES            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────���┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Transfert entre │                                                       │
│  │  caisses à       │                                                       │
│  │  valider"        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    LISTE DES TRANSFERTS EN ATTENTE               │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TRANSFERTS À VALIDER (2)                                │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 🔄 Transfert #TR-2026-015                               │    │      │
│  │  │    De: Caisse principale → Caisse de secours           │    ���      │
│  │  │    Montant: 100,000 XAF                                │    │      │
│  │  │    Demandé par: Trésorier (15/03/2026)                 │    │      │
│  │  │    Validation Président: ✅ Approuvé                   │    │      │
│  │  │    Validation Commissaire: ⏳ En attente               │    │      │
│  │  │    [Examiner]                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ 🔄 Transfert #TR-2026-016                               │    │      │
│  │  │    De: Caisse fonctionnement → Caisse principale       │    │      │
│  │  │    Montant: 50,000 XAF                                 │    │      │
│  │  │    Demandé par: Trésorier (14/03/2026)                 │    │      │
│  │  │    Validation Président: ⏳ En attente                 │    │      │
│  │  │    Validation Commissaire: ⏳ En attente               │    │      │
│  │  │    [Examiner]                                          │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Examiner]                         │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉTAIL DU TRANSFERT                           │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS DU TRANSFERT                               │    │      │
│  │  │                                                         │    │      │
│  │  │ 📋 Référence: TR-2026-015                               │    │      │
│  │  │ 📅 Date demande: 15 Mars 2026 à 14:30                  │    │      │
│  │  │ 👤 Demandé par: M. TCHANA (Trésorier)                  │    │      │
│  │  │                                                         │    │      │
│  │  │ 🏦 Caisse source: Caisse principale                    │    │      │
│  │  │    Solde actuel: 2,450,000 XAF                         │    │      │
│  │  │    Solde après: 2,350,000 XAF                          │    │      │
│  │  │                                                         │    │      │
│  │  │ 🏦 Caisse destination: Caisse de secours               │    │      │
│  │  │    Solde actuel: 350,000 XAF                           │    │      │
│  │  │    Solde après: 450,000 XAF                            │    │      │
│  │  │                                                         │    │      │
│  │  │ 💰 Montant: 100,000 XAF                                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ JUSTIFICATION                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Motif invoqué par le trésorier:                        │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  ���  │ │ Renforcement de la caisse de secours suite à   │    │    │      │
│  │  │ │ plusieurs demandes d'aide attendues ce mois.   │    │    │      │
│  │  │ │ Deux membres ont signalé des difficultés.      │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ STATUT DES VALIDATIONS                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Président: Approuvé (15/03/2026 15:00)              │    │      │
│  │  │    Commentaire: "Justifié, j'approuve"                 │    │      │
│  │  │                                                         │    │      │
│  │  │ ⏳ Commissaire aux Comptes: En attente (VOUS)          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE DÉCISION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Approuver le transfert                            │    │      │
│  │  │ ○ ❌ Refuser le transfert                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire: (obligatoire si refus)                    │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Transfert conforme aux besoins identifiés.     │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Valider ma décision]                               │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ APPROUVER               REFUSER │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ TRANSFERT VALIDÉ  │          │ ❌ TRANSFERT REFUSÉ  │                │
│  │                      │          │                      │                │
│  │ Toutes les           │          │ • Notification au    │                │
│  │ validations OK       │          │   Trésorier          │                │
│  │                      │          │                      │                │
│  │ • Transfert exécuté  │          │ • Motif du refus     │                │
│  │ • Caisses mises      │          │   communiqué         │                │
│  │   à jour             │          │                      │                │
│  │ • Notification au    │          │ • Transfert annulé   │                │
│  │   Trésorier          │          │                      │                │
│  │ • Historique mis     │          │                      │                │
│  │   à jour             │          │                      │                │
│  └──────────────────────┘          └──────────────────────┘                │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-VT01 | Le transfert nécessite validation du Président ET du Commissaire |
| RM-VT02 | Le Commissaire voit la décision du Président avant de se prononcer |
| RM-VT03 | Le refus nécessite un commentaire explicatif |
| RM-VT04 | Le transfert n'est exécuté qu'après les deux validations |
| RM-VT05 | L'historique des validations est conservé |

---

# 5. FLOW 3 : VALIDATION D'UNE DÉPENSE

## 5.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: VALIDATION D'UNE DÉPENSE (> PLAFOND)               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Dépense à       │                                                       │
│  │  valider"        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉTAIL DE LA DÉPENSE                          │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS DE LA DÉPENSE                              │    │      │
│  │  │                                                         │    │      │
│  │  │ 📋 Référence: DEP-2026-042                              │    │      │
│  │  │ 📅 Date: 15 Mars 2026                                   │    │      │
│  │  │ 👤 Enregistrée par: Trésorier (M. TCHANA)              │    │      │
│  │  │                                                         │    │      │
│  │  │ 📁 Catégorie: Location de salle                        │    │      │
│  │  │ 📝 Intitulé: Location salle conférence Mars            │    │      │
│  │  │ 💰 Montant: 75,000 XAF                                 │    │      │
│  │  │ 🏪 Fournisseur: Salle des fêtes FOUDA                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ Plafond sans validation: 50,000 XAF                 │    │      │
│  │  │    Cette dépense dépasse le plafond de 25,000 XAF      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ JUSTIFICATIF                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Type: Facture                                          │    │      │
│  │  │ Fichier: facture_location_mars.pdf                     │    │      │
│  │  │                                                         │    │      │
│  │  │ [📥 Télécharger]  [👁️ Visualiser]                      │    │      │
│  │  │                                                         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │         [APERÇU DU JUSTIFICATIF]               │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │    FACTURE N° 2026-0315                        │    │    │      │
│  │  │ │    Salle des fêtes FOUDA                       │    │    │      │
│  │  │ │    Location salle: 75,000 XAF                  │    │    │      │
│  │  │ │    Date: 15/03/2026                            │    │    │      │
│  │  │ │    Cachet: ✓                                   │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATIONS                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Justificatif présent                                  │    │      │
│  │  │ ☑ Montant correspond au justificatif                   │    │      │
│  │  │ ☑ Catégorie appropriée                                 │    │      │
│  │  │ ☑ Dépense cohérente avec les activités                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ STATUT DES VALIDATIONS                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Président: Approuvé (15/03/2026 16:00)              │    │      │
│  │  │ ⏳ Commissaire aux Comptes: En attente (VOUS)          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE DÉCISION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Approuver la dépense                              │    │      │
│  │  │ ○ ❌ Refuser la dépense                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire:                                           │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Dépense justifiée et conforme.                 │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Valider ma décision]                               │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-VD01 | Seules les dépenses > plafond nécessitent validation |
| RM-VD02 | Le Commissaire peut visualiser le justificatif original |
| RM-VD03 | Il vérifie la cohérence montant/justificatif |
| RM-VD04 | La dépense n'est comptabilisée qu'après validation complète |

---

# 6. FLOW 4 : VALIDATION D'UN DÉCAISSEMENT DE PRÊT

## 6.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: VALIDATION D'UN DÉCAISSEMENT DE PRÊT               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Décaissement    │                                                       │
│  │  de prêt à       ���                                                       │
│  │  valider"        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉTAIL DU PRÊT À DÉCAISSER                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS DU PRÊT                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ 📋 Référence: PRET-2026-008                             │    │      │
│  │  │ 👤 Emprunteur: Jean KAMGA                               │    │      │
│  │  │ 💰 Montant: 200,000 XAF                                 │    │      │
│  │  │ 📈 Taux d'intérêt: 5%                                   │    │      │
│  │  │ 💵 Intérêts: 10,000 XAF                                 │    │      │
│  │  │ 💰 Total à rembourser: 210,000 XAF                      │    │      │
│  │  │ 📅 Durée: 3 mois                                        │    │      │
│  │  │ 📆 Échéances: 70,000 XAF / mois                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PROFIL DE L'EMPRUNTEUR                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Jean KAMGA                                           │    │      │
│  │  │ 📅 Membre depuis: Janvier 2024                         │    │      │
│  │  │ 💵 Cotisations: ✅ À jour                              │    │      │
│  │  │ 💳 Prêts précédents: 2 (tous remboursés)               │    │      │
│  │  │ ⚖️ Sanctions: 1 (payée)                                ��    │      │
│  │  │ 📊 Score de confiance: Bon                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ GARANTS                                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Pierre FOTSO                                         │    │      │
│  │  │    Statut cotisations: ✅ À jour                       │    │      │
│  │  │    Acceptation: ✅ Validé                              │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Anne MBARGA                                          │    │      │
│  │  │    Statut cotisations: ✅ À jour                       │    │      │
│  │  │    Acceptation: ✅ Validé                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATIONS FINANCIÈRES                               │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Caisse principale suffisante (2,450,000 XAF)         │    │      │
│  │  │ ☑ Plafond de prêt respecté                             │    │      │
│  │  │ ☑ Pas de prêt en cours pour ce membre                  │    │      │
│  │  │ ☑ Garants éligibles et à jour                          │    │      │
│  │  │ ☑ Échéancier cohérent avec la capacité                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ STATUT DES VALIDATIONS                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Bureau: Approuvé (14/03/2026)                       │    │      │
│  │  │ ✅ Président: Approuvé (15/03/2026)                    │    │      │
│  │  │ ⏳ Commissaire aux Comptes: En attente (VOUS)          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE DÉCISION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Approuver le décaissement                         │    │      │
│  │  │ ○ ❌ Refuser le décaissement                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire:                                           │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Dossier complet, garanties suffisantes.        │    │    │      │
│  │  │ │ Capacité de remboursement vérifiée.            │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Valider ma décision]                               │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-VP01 | Le décaissement nécessite validation Bureau + Président + Commissaire |
| RM-VP02 | Le Commissaire vérifie la solidité financière du dossier |
| RM-VP03 | Il a accès au profil complet de l'emprunteur |
| RM-VP04 | Le décaissement n'est effectué qu'après toutes les validations |

---
# 🟣 FLOWS COMPLETS DU COMMISSAIRE AUX COMPTES (SUITE)
## Application de Gestion de Tontine - Cameroun

---

# 7. FLOW 5 : VÉRIFICATION DU BILAN DE SÉANCE (Suite)

## 7.1 Diagramme de Flux (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: VÉRIFICATION DU BILAN DE SÉANCE (Suite)            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    BILAN DE SÉANCE À VÉRIFIER                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ BILAN FINANCIER (Suite)                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ 💸 SORTIES                                              │    │      │
│  │  │ Distribution cagnotte:         1,802,500 XAF           │    │      │
│  │  │ Prélèvement caisse secours:       97,500 XAF           │    │      │
│  │  │ Prélèvement fonctionnement:       50,000 XAF           │    │      │
│  │  │ Décaissement prêt:               200,000 XAF           │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ TOTAL SORTIES:                 2,150,000 XAF           │    │      │
│  │  │                                                         │    │      │
│  │  │ 📊 SOLDE DE LA SÉANCE: -117,500 XAF                    │    │      │
│  │  │                                                         │    │      │
│  │  │ 🏦 ÉTAT DES CAISSES APRÈS SÉANCE                        │    │      │
│  │  │ Caisse principale:             2,332,500 XAF           │    │      │
│  │  │ Caisse de secours:               447,500 XAF           │    │      │
│  │  │ Caisse de fonctionnement:        187,500 XAF           │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ TOTAL GÉNÉRAL:                 2,967,500 XAF           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATIONS DU COMMISSAIRE                            │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Cohérence des totaux (entrées/sorties)               │    │      │
│  │  │ ☑ Correspondance avec les pièces justificatives        │    │      │
│  │  │ ☑ Distribution conforme au planning                    │    │      │
│  │  │ ☑ Prélèvements automatiques corrects                   │    │      │
│  │  │ ☑ Soldes de caisses cohérents                          │    │      │
│  │  │ ☐ Vérification physique de la caisse (si applicable)   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ OBSERVATIONS                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Bilan conforme. Les calculs sont exacts et les │    │    │      │
│  │  │ │ justificatifs correspondent aux opérations.    │    │    │      │
│  │  │ │ RAS.                                            │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE DÉCISION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Valider le bilan (conforme)                       │    │      │
│  │  │ ○ ⚠️ Valider avec réserves                             │    │      │
│  │  │ ○ ❌ Rejeter le bilan (anomalies)                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Si réserves ou rejet, préciser:                        │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ _______________________________________________ │    │    │      │
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
│  │ ✅ CONFORME     │ │ ⚠️ AVEC RÉSERVES│ │ ❌ REJETÉ       │               │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘               │
│           │                   │                   │                         │
│           ▼                   ▼                   ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │ • Bilan validé  │ │ • Bilan validé  │ │ • Bilan non     │               │
│  │ • Intégré au PV │ │   avec réserves │ │   validé        │               │
│  │ • Archivé       │ │ • Réserves      │ │ • Notification  │               │
│  │                 │ │   mentionnées   │ │   au Trésorier  │               │
│  │                 │ │   au PV         │ │   et Président  │               │
│  │                 │ │ • Suivi requis  │ │ • Doit être     │               │
│  │                 │ │                 │ │   corrigé       │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-VB01 | Le Commissaire doit vérifier chaque bilan de séance |
| RM-VB02 | Il peut valider, valider avec réserves ou rejeter |
| RM-VB03 | Les réserves et rejets doivent être justifiés |
| RM-VB04 | Le bilan validé est intégré au PV de la séance |
| RM-VB05 | Un bilan rejeté doit être corrigé par le Trésorier |

---

# 8. FLOW 6 : CONTRÔLE PÉRIODIQUE

## 8.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CONTRÔLE PÉRIODIQUE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Rappel ou     │                                                       │
│  │ Commissaire      │                                                       │
│  │ initie contrôle  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SÉLECTION DU TYPE DE CONTRÔLE                 │      │
│  │                                                                  │      │
│  │  Type de contrôle:                                              │      │
│  │  ○ Contrôle hebdomadaire (rapide)                               │      │
│  │  ● Contrôle mensuel (standard)                                  │      │
│  │  ○ Contrôle trimestriel (approfondi)                            │      │
│  │  ○ Contrôle ponctuel (sur demande)                              │      │
│  │                                                                  │      │
│  │  Période couverte: [01/03/2026] au [15/03/2026]                 │      │
│  │                                                                  │      │
│  │  [Démarrer le contrôle]                                         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CHECKLIST DE CONTRÔLE                         │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 1. VÉRIFICATION DES CAISSES                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Caisse principale:                                     │    │      │
│  │  │ • Solde système: 2,450,000 XAF                         │    │      │
│  │  │ • Solde vérifié: [2,450,000] XAF                       │    │      │
│  │  │ • Écart: 0 XAF ✅                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Caisse de secours:                                     │    │      │
│  │  │ • Solde système: 350,000 XAF                           │    │      │
│  │  │ • Solde vérifié: [350,000] XAF                         │    │      │
│  │  │ • Écart: 0 XAF ✅                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Caisse de fonctionnement:                              │    │      │
│  │  │ • Solde système: 125,000 XAF                           │    │      │
│  │  │ • Solde vérifié: [120,000] XAF                         │    │      │
│  │  │ • Écart: -5,000 XAF ⚠️                                 │    │      │
│  │  │   [Signaler l'écart]                                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 2. VÉRIFICATION DES JUSTIFICATIFS                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Dépenses de la période: 3                              │    │      │
│  │  │ Justificatifs présents: 3/3 ✅                         │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir les justificatifs]                               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 3. VÉRIFICATION DES COTISATIONS                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Cotisations attendues: 2,250,000 XAF                   │    │      │
│  │  │ Cotisations reçues: 1,890,000 XAF                      ���    │      │
│  │  │ Taux de recouvrement: 84%                              │    │      │
│  │  │ Membres en retard: 7                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir détails par membre]                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 4. VÉRIFICATION DES PRÊTS                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Prêts actifs: 8                                        │    │      │
│  │  │ Montant total: 1,200,000 XAF                           │    │      │
│  │  │ Prêts en retard: 2 ⚠️                                  │    │      │
│  │  │ Montant en retard: 180,000 XAF                         │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir détails des prêts]                               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 5. VÉRIFICATION DES DISTRIBUTIONS                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Distributions de la période: 2                         │    │      │
│  │  │ Conformes au planning: ✅ Oui                          │    │      │
│  │  │ Signatures bénéficiaires: 2/2 ✅                       │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir détails distributions]                           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉSUMÉ DU CONTRÔLE                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Points vérifiés: 5                                     │    │      │
│  │  │ Points conformes: 4                                    │    │      │
│  │  │ Points avec anomalies: 1                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Anomalies détectées:                                   │    │      │
│  │  │ • Écart caisse fonctionnement: -5,000 XAF             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ OBSERVATIONS GÉNÉRALES                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Contrôle satisfaisant dans l'ensemble.         │    │    │      │
│  │  │ │ Un écart de 5,000 XAF constaté sur la caisse   │    │    │      │
│  │  │ │ de fonctionnement. Demande d'éclaircissement   │    │    │      │
│  │  │ │ adressée au trésorier.                         │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Générer le rapport de contrôle]                    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ RAPPORT DE CONTRÔLE GÉNÉRÉ                 │      │
│  │                                                                  │      │
│  │  Rapport: CTRL-2026-03-001                                      │      │
│  │  Type: Contrôle mensuel                                         │      │
│  │  Période: 01/03/2026 - 15/03/2026                               │      │
│  │  Résultat: Conforme avec réserves                               │      │
│  │                                                                  │      │
│  │  • Rapport archivé                                              │      │
│  │  • Accessible pour la prochaine séance                          │      │
│  │  • Anomalie signalée au Trésorier                               │      │
│  │                                                                  │      │
│  │  [📥 Télécharger PDF]  [📤 Envoyer au Bureau]                   │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-CP01 | Les contrôles périodiques sont configurables (hebdo, mensuel, trimestriel) |
| RM-CP02 | Le Commissaire suit une checklist standardisée |
| RM-CP03 | Les écarts détectés peuvent être signalés immédiatement |
| RM-CP04 | Un rapport de contrôle est généré automatiquement |
| RM-CP05 | Le rapport est archivé et présenté à la séance |

---

# 9. FLOW 7 : RÉALISATION D'UN AUDIT

## 9.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: RÉALISATION D'UN AUDIT                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Commissaire      │                                                       │
│  │ clique "Nouvel   │                                                       │
│  │ audit"           │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIGURATION DE L'AUDIT                      │      │
│  │                                                                  │      │
│  │  Type d'audit:                                                  │      │
│  │  ○ Audit trimestriel                                            │      │
│  │  ● Audit de cycle                                               │      │
│  │  ○ Audit spécial (sur demande)                                  │      │
│  │                                                                  │      │
│  │  Période couverte:                                              │      │
│  │  Du: [01/01/2026] au [31/03/2026] (Cycle #2)                    │      │
│  │                                                                  │      │
│  │  Périmètre:                                                     │      │
│  │  ☑ Gestion des caisses                                          │      │
│  │  ☑ Cotisations et recouvrements                                 │      │
│  │  ☑ Prêts et remboursements                                      │      │
│  │  ☑ Dépenses et justificatifs                                    │      │
│  │  ☑ Distributions                                                │      │
│  │  ☑ Sanctions                                                    │      │
│  │  ☑ Respect des procédures                                       │      │
│  │                                                                  │      │
│  │  [Démarrer l'audit]                                             │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    COLLECTE DES DONNÉES                          │      │
│  │                                                                  │      │
│  │  ⏳ Extraction des données en cours...                          │      │
│  │                                                                  │      │
│  │  ✅ Mouvements de caisse: 156 opérations                        │      │
│  │  ✅ Cotisations: 540 paiements                                  │      │
│  │  ✅ Prêts: 12 prêts traités                                     │      │
│  │  ✅ Dépenses: 18 dépenses                                       │      │
│  │  ✅ Distributions: 12 cagnottes                                 │      │
│  │  ✅ Sanctions: 35 sanctions                                     │      │
│  │                                                                  │      │
│  │  [Continuer]                                                    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ANALYSE AUTOMATIQUE                           │      │
│  │                                                                  │      │
│  │  Le système effectue des vérifications automatiques...          │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉSULTATS DE L'ANALYSE                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Cohérence des soldes de caisses                      │    │      │
│  │  │ ✅ Traçabilité des opérations                           │    │      │
│  │  │ ✅ Justificatifs de dépenses (18/18)                    │    │      │
│  │  │ ✅ Signatures des distributions (12/12)                 │    │      │
│  │  │ ✅ Calcul des intérêts de prêts                         │    │      │
│  │  │ ⚠️ 2 prêts en retard de remboursement                   │    │      │
│  │  │ ⚠️ Écart caisse fonctionnement: -5,000 XAF             │    │      │
│  │  │ ✅ Prélèvements automatiques corrects                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Points d'attention détectés: 2                                 │      │
│  │                                                                  │      │
│  │  [Examiner les détails]  [Continuer]                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    RÉDACTION DU RAPPORT D'AUDIT                  │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RAPPORT D'AUDIT - CYCLE #2                              │    │      │
│  │  │ Période: 01/01/2026 - 31/03/2026                        │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 1. SYNTHÈSE                                             │    │      │
│  │  │ (Générée automatiquement, modifiable)                  │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ L'audit du cycle #2 a porté sur l'ensemble     │    │    │      │
│  │  │ │ des opérations financières de la période.      │    │    │      │
│  │  │ │ La gestion est globalement satisfaisante avec  │    │    │      │
│  │  │ │ quelques points d'attention.                   │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 2. CONSTATS                                             │    │      │
│  │  │ ✅ Points positifs:                                    │    │      │
│  │  │ • Bonne tenue des justificatifs                        │    │      │
│  │  │ • Traçabilité complète des opérations                  │    │      │
│  │  │ • Distributions conformes au planning                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ Points d'attention:                                 │    │      │
│  │  │ • 2 prêts en retard de remboursement                   │    │      │
│  │  │ • Écart inexpliqué de 5,000 XAF                        │    │      │
│  │  │                                                         │    │      │
│  │  │ 3. AVIS DU COMMISSAIRE                                  │    │      │
│  │  │ ○ ✅ Certification sans réserve                        │    │      │
│  │  │ ● ⚠️ Certification avec réserves                       │    │      │
│  │  │ ○ ❌ Refus de certification                            │    │      │
│  │  │                                                         │    │      │
│  │  │ 4. RECOMMANDATIONS                                      │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ 1. Renforcer le suivi des remboursements de    │    │    │      │
│  │  │ │    prêts avec rappels anticipés.               │    │    │      │
│  │  │ │ 2. Clarifier l'écart de caisse avant la       │    │    │      │
│  │  │ │    prochaine séance.                           │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  └──────────────────────────────────────────���──────────────┘    │      │
│  │                                                                  │      │
│  │  [Prévisualiser]  [Enregistrer brouillon]  [Finaliser]          │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SIGNATURE DU RAPPORT                          │      │
│  │                                                                  │      │
│  │  Signature électronique du Commissaire aux Comptes:             │      │
│  │                                                                  │      │
│  │  Code OTP envoyé au +237 677 XXX XXX: [______]                  │      │
│  │                                                                  │      │
│  │  Signature:                                                     │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │         [Zone de dessin tactile]                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Signer et finaliser le rapport]                               │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ RAPPORT D'AUDIT FINALISÉ                   │      │
│  │                                                                  │      │
│  │  Référence: AUDIT-2026-Q1-001                                   │      │
│  │  Statut: Finalisé et signé                                      │      │
│  │  Avis: Certification avec réserves                              │      │
│  │                                                                  │      │
│  │  • Rapport archivé                                              │      │
│  │  • Notification envoyée au Président et au Bureau               │      │
│  │  • Sera présenté à la prochaine Assemblée                       │      │
│  │  • Recommandations enregistrées pour suivi                      │      │
│  │                                                                  │      │
│  │  [📥 Télécharger PDF]  [📤 Envoyer]                             │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 9.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-AU01 | La fréquence des audits est configurable |
| RM-AU02 | Le système collecte automatiquement les données |
| RM-AU03 | Une analyse automatique détecte les anomalies |
| RM-AU04 | Le Commissaire peut certifier, certifier avec réserves ou refuser |
| RM-AU05 | Le rapport doit être signé électroniquement |
| RM-AU06 | Le rapport est présenté à l'Assemblée |

---

# 10. FLOW 8 : SIGNALEMENT D'ANOMALIE

## 10.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: SIGNALEMENT D'ANOMALIE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Commissaire      │                                                       │
│  │ clique "Signaler │                                                       │
│  │ une anomalie"    │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE DE SIGNALEMENT                     │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ NATURE DE L'ANOMALIE                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ Catégorie:                                             │    │      │
│  │  │ ○ Écart de caisse                                      │    │      │
│  │  │ ○ Justificatif manquant ou non conforme                │    │      │
│  │  │ ○ Opération non autorisée                              │    │      │
│  │  │ ○ Non-respect des procédures                           │    │      │
│  │  │ ○ Erreur de calcul                                     │    │      │
│  │  │ ● Autre (à préciser)                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Gravité:                                               │    │      │
│  │  │ ○ 🟢 Faible (observation)                              │    │      │
│  │  │ ● 🟡 Moyenne (à corriger)                              │    │      │
│  │  │ ○ 🔴 Élevée (urgente)                                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DESCRIPTION DE L'ANOMALIE                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Titre: [Écart de caisse fonctionnement_______________] │    │      │
│  │  │                                                         │    │      │
│  │  │ Description détaillée:                                 │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Lors du contrôle du 15/03/2026, un écart de    │    │    │      │
│  │  │ │ 5,000 XAF a été constaté sur la caisse de      │    │    │      │
│  │  │ │ fonctionnement.                                 │    │    │      │
│  │  │ │ Solde attendu: 130,000 XAF                     │    │    │      │
│  │  │ │ Solde constaté: 125,000 XAF                    │    │    │      │
│  │  │ │ Aucune opération ne justifie cet écart.        │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Date de constatation: [15/03/2026]                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Pièces jointes: (optionnel)                            │    │      │
│  │  │ [📎 Ajouter un fichier]                                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DESTINATAIRE DU SIGNALEMENT                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Signaler à:                                            │    │      │
│  │  │ ● Président uniquement                                  │    │      │
│  │  │ ○ Bureau (Président + Vice-Président + Secrétaire)     │    │      │
│  │  │ ○ Assemblée (tous les membres)                         │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Demander une réponse/explication                     │    │      │
│  │  │ ☑ Copie au Trésorier                                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Envoyer le signalement]                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ SIGNALEMENT ENVOYÉ                         │      │
│  │                                                                  │      │
│  │  Référence: SIG-2026-003                                        │      │
│  │  Statut: 📤 Envoyé                                              │      │
│  │                                                                  │      │
│  │  Notifications envoyées à:                                      │      │
│  │  • Président (M. FOTSO)                                         │      │
│  │  • Trésorier (M. TCHANA) - en copie                             │      │
│  │                                                                  │      │
│  │  Une réponse est attendue.                                      │      │
│  │  Vous serez notifié dès réception.                              │      │
│  │                                                                  │      │
│  │  [Voir le signalement]                                          │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 10.2 Sous-Flow : Suivi du Signalement

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: SUIVI DU SIGNALEMENT                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    HISTORIQUE DU SIGNALEMENT                     │      │
│  │                                                                  │      │
│  │  Référence: SIG-2026-003                                        │      │
│  │  Anomalie: Écart de caisse fonctionnement                       │      │
│  │  Gravité: 🟡 Moyenne                                            │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CHRONOLOGIE                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ 15/03 16:00 - Signalement créé par Commissaire         │    │      │
│  │  │ 15/03 16:00 - Notification envoyée au Président        │    │      │
│  │  │ 15/03 16:00 - Copie envoyée au Trésorier               │    │      │
│  │  │ 15/03 18:30 - Réponse du Trésorier:                    │    │      │
│  │  │               "L'écart correspond à des frais de       │    │      │
│  │  │               transport non encore comptabilisés.      │    │      │
│  │  │               Justificatif joint."                     │    │      │
│  │  │ 16/03 09:00 - Validation Président: "Explication       │    │      │
│  │  │               acceptée. Régularisation en cours."      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Statut actuel: ✅ Résolu                                       │      │
│  │                                                                  │      │
│  │  [Clôturer le signalement]  [Rouvrir]                           │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 10.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-SA01 | Le Commissaire peut signaler à différents niveaux (Président, Bureau, Assemblée) |
| RM-SA02 | Les signalements sont tracés avec un historique complet |
| RM-SA03 | Le Commissaire peut demander une réponse |
| RM-SA04 | Le signalement peut être clôturé ou rouvert |
| RM-SA05 | Le Commissaire ne peut pas bloquer une opération directement |

---

# 11. FLOW 9 : CERTIFICATION DES COMPTES

## 11.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CERTIFICATION DES COMPTES                          │
├─────────────────────────────────��───────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Commissaire      │                                                       │
│  │ clique "Certifier│                                                       │
│  │ les comptes"     │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SÉLECTION DE LA PÉRIODE                       │      │
│  │                                                                  │      │
│  │  Certifier les comptes pour:                                    │      │
│  │  ○ Mois de Mars 2026                                            │      │
│  │  ● Cycle #2 (Janvier - Mars 2026)                               │      │
│  │  ○ Année 2026                                                   │      │
│  │                                                                  │      │
│  │  [Continuer]                                                    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ÉTATS FINANCIERS À CERTIFIER                  │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ BILAN DE LA PÉRIODE                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ ACTIF (Emplois)                                        │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Caisse principale:             2,450,000 XAF           │    │      │
│  │  │ Caisse de secours:               350,000 XAF           │    │      │
│  │  │ Caisse de fonctionnement:        125,000 XAF           │    │      │
│  │  │ Prêts en cours:                1,200,000 XAF           │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ TOTAL ACTIF:                   4,125,000 XAF           │    │      │
│  │  │                                                         │    │      │
│  │  │ PASSIF (Ressources)                                    │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Cotisations collectées:        5,400,000 XAF           │    │      │
│  │  │ Distributions effectuées:     -3,605,000 XAF           │    │      │
│  │  │ Dépenses:                       -255,000 XAF           │    │      │
│  │  │ Intérêts de prêts:              +120,000 XAF           │    │      │
│  │  │ Sanctions:                       +65,000 XAF           │    │      │
│  │  │ Report cycle précédent:       +2,400,000 XAF           │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ TOTAL PASSIF:                  4,125,000 XAF           │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Équilibre vérifié: ACTIF = PASSIF                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATIONS PRÉALABLES                                │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Tous les bilans de séance validés                   │    │      │
│  │  │ ✅ Audit de la période effectué                        │    │      │
│  │  │ ✅ Anomalies signalées traitées                        │    │      │
│  │  │ ⚠️ 1 recommandation en cours de mise en œuvre         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉCISION DE CERTIFICATION                               │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Certifier sans réserve                            │    │      │
│  │  │      Les comptes sont réguliers et sincères.           │    │      │
│  │  │                                                         │    │      │
│  │  │ ● ⚠️ Certifier avec réserves                           │    │      │
│  │  │      Les comptes sont globalement corrects mais        │    │      │
│  │  │      certains points nécessitent attention.            │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ❌ Refuser la certification                          │    │      │
│  │  │      Anomalies majeures empêchant la certification.    │    │      │
│  │  │                                                         │    │      │
│  │  │ Réserves/Observations:                                 │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Les comptes sont certifiés sous réserve de la  │    │    │      │
│  │  │ │ mise en œuvre de la recommandation concernant  │    │    │      │
│  │  │ │ le suivi des remboursements de prêts.          │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Signer et certifier]                               │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SIGNATURE DE CERTIFICATION                    │      │
│  │                                                                  │      │
│  │  Code OTP: [______]                                             │      │
│  │                                                                  │      │
│  │  Signature:                                                     │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │         [Zone de dessin tactile]                       │    │      │
│  │  │            Commissaire aux Comptes                      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Signer]                                                       │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ COMPTES CERTIFIÉS                          │      │
│  │                                                                  │      │
│  │  Certificat: CERT-2026-C2-001                                   │      │
│  │  Période: Cycle #2 (Janvier - Mars 2026)                        │      │
│  │  Décision: Certification avec réserves                          │      │
│  │                                                                  │      │
│  │  • Certificat archivé                                           │      │
│  │  • Notification envoyée au Bureau                               │      │
│  │  • Sera présenté à l'Assemblée Générale                         │      │
│  │                                                                  │      │
│  │  [📥 Télécharger le certificat]                                 │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 11.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-CC01 | La certification intervient avant la présentation à l'Assemblée |
| RM-CC02 | Le Commissaire peut certifier, certifier avec réserves ou refuser |
| RM-CC03 | La certification est signée électroniquement |
| RM-CC04 | Le certificat est archivé et présenté à l'Assemblée |

---
# 🟣 FLOWS COMPLETS DU COMMISSAIRE AUX COMPTES (FIN)
## Application de Gestion de Tontine - Cameroun

---

# 12. FLOW 10 : DEMANDE D'ÉCLAIRCISSEMENTS (Suite)

## 12.1 Diagramme de Flux (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: DEMANDE D'ÉCLAIRCISSEMENTS (Suite)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE DE DEMANDE                         │      │
│  │                                                                  │      │
│  │  Demande d'éclaircissements au Trésorier                        │      │
│  │                                                                  │      │
│  │  Objet: Dépense DEP-2026-038 du 10/03/2026                      │      │
│  │                                                                  │      │
│  │  Question(s):                                                   │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ Pourriez-vous préciser la nature exacte des            │    │      │
│  │  │ fournitures achetées pour 35,000 XAF ?                 │    │      │
│  │  │ Le justificatif joint ne détaille pas les articles.   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Délai de réponse souhaité: [48 heures ▼]                       │      │
│  │                                                                  │      │
│  │  [Annuler]  [Envoyer la demande]                                │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────��───────────────────────────────────────────────────────────┐      │
│  │                    ✅ DEMANDE ENVOYÉE                            │      │
│  │                                                                  │      │
│  │  Référence: ECL-2026-012                                        │      │
│  │  Destinataire: Trésorier (M. TCHANA)                            │      │
│  │  Délai de réponse: 48 heures (avant le 17/03/2026)              │      │
│  │                                                                  │      │
│  │  Vous serez notifié dès réception de la réponse.                │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 12.2 Sous-Flow : Réception de la Réponse

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: RÉCEPTION DE LA RÉPONSE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Réponse reçue   │                                                       │
│  │  du Trésorier"   │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉTAIL DE LA RÉPONSE                          │      │
│  │                                                                  │      │
│  │  Demande: ECL-2026-012                                          │      │
│  │  Objet: Dépense DEP-2026-038                                    ���      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE QUESTION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ Pourriez-vous préciser la nature exacte des            │    │      │
│  │  │ fournitures achetées pour 35,000 XAF ?                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉPONSE DU TRÉSORIER (16/03/2026 14:30)                │    │      │
│  │  │                                                         │    │      │
│  │  │ Il s'agit de:                                          │    │      │
│  │  │ - 5 ramettes de papier A4: 15,000 XAF                  │    │      │
│  │  │ - 1 carton de stylos: 10,000 XAF                       │    │      │
│  │  │ - Classeurs et chemises: 10,000 XAF                    │    │      │
│  │  │                                                         │    │      │
│  │  │ Pièce jointe: detail_fournitures.pdf                   │    │      │
│  │  │ [📥 Télécharger]                                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE ÉVALUATION                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ La réponse est-elle satisfaisante ?                    │    │      │
│  │  │ ● ✅ Oui, question clôturée                            │    │      │
│  │  │ ○ ⚠️ Partiellement, demande complémentaire             │    │      │
│  │  │ ○ ❌ Non, escalade au Président                        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Clôturer]                                                     │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 12.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-DE01 | Le Commissaire peut demander des éclaircissements sur toute opération |
| RM-DE02 | Un délai de réponse est fixé |
| RM-DE03 | Le Trésorier est notifié et doit répondre |
| RM-DE04 | Le Commissaire évalue la réponse |
| RM-DE05 | Si insatisfait, il peut escalader au Président |

---

# 13. FLOW 11 : ÉMISSION DE RECOMMANDATIONS

## 13.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ÉMISSION DE RECOMMANDATIONS                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Commissaire      │                                                       │
│  │ clique "Nouvelle │                                                       │
│  │ recommandation"  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE DE RECOMMANDATION                  │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CONTEXTE                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Origine:                                               │    │      │
│  │  │ ○ Suite à un contrôle périodique                       │    │      │
│  │  │ ● Suite à un audit                                     │    │      │
│  │  │ ○ Suite à un signalement                               │    │      │
│  │  │ ○ Observation générale                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Référence liée: [AUDIT-2026-Q1-001 ▼]                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RECOMMANDATION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ Titre:                                                 │    │      │
│  │  │ [Renforcer le suivi des remboursements de prêts______] │    │      │
│  │  │                                                         │    │      │
│  │  │ Description détaillée:                                 │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Il est recommandé de mettre en place un       │    │    │      │
│  │  │ │ système de rappels automatiques J-7 et J-3    │    │    │      │
│  │  │ │ avant chaque échéance de prêt, ainsi qu'un    │    │    │      │
│  │  │ │ suivi hebdomadaire des prêts en retard par    │    │    │      │
│  │  │ │ le Trésorier avec rapport au Bureau.          │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Priorité:                                              │    │      │
│  │  │ ○ 🟢 Faible                                            │    │      │
│  │  │ ● 🟡 Moyenne                                            │    │      │
│  │  │ ○ 🔴 Élevée                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Échéance suggérée: [30/04/2026]                        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DESTINATAIRES                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Adresser au:                                           │    │      │
│  │  │ ☑ Bureau                                                │    │      │
│  │  │ ☑ Trésorier (pour action)                               │    │      │
│  │  │ ☐ Président uniquement                                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer]  [Enregistrer et envoyer]             │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ RECOMMANDATION ÉMISE                       │      │
│  │                                                                  │      │
│  │  Référence: REC-2026-005                                        │      │
│  │  Titre: Renforcer le suivi des remboursements de prêts          │      │
│  │  Priorité: 🟡 Moyenne                                           │      │
│  │  Échéance: 30/04/2026                                           │      │
│  │  Statut: 📤 Envoyée                                             │      │
│  │                                                                  │      │
│  │  • Notification envoyée au Bureau et au Trésorier               │      │
│  │  • Enregistrée pour suivi                                       │      │
│  │  • Sera présentée à la prochaine séance                         │      │
│  │                                                                  │      │
│  └────────────────────────────────────────────────────��─────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 13.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-RE01 | Les recommandations sont liées à un contexte (audit, contrôle, etc.) |
| RM-RE02 | Elles ont une priorité et une échéance |
| RM-RE03 | Elles sont adressées au Bureau et/ou responsables concernés |
| RM-RE04 | Elles sont tracées dans le système pour suivi |

---

# 14. FLOW 12 : SUIVI DES RECOMMANDATIONS

## 14.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: SUIVI DES RECOMMANDATIONS                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Commissaire      │                                                       │
│  │ accède "Suivi    │                                                       │
│  │ recommandations" │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    TABLEAU DE SUIVI                              │      │
│  │                                                                  │      │
│  │  Filtres: [Toutes ▼] [En cours ▼] [2026 ▼]                      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RECOMMANDATIONS (6)                                     │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ REC-2026-005 🟡                                         │    │      │
│  │  │ Renforcer le suivi des remboursements de prêts         │    │      │
│  │  │ Émise: 15/03/2026 | Échéance: 30/04/2026               │    │      │
│  │  │ Statut: ⏳ En cours                                     │    │      │
│  │  │ Responsable: Trésorier                                 │    │      │
│  │  │ [Voir détails]                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ REC-2026-004 🟢                                         │    │      │
│  │  │ Archiver les justificatifs numériquement               │    │      │
│  │  │ Émise: 01/03/2026 | Échéance: 31/03/2026               │    │      │
│  │  │ Statut: ✅ Mise en œuvre                               │    │      │
│  │  │ Responsable: Secrétaire                                │    │      │
│  │  │ [Voir détails]  [Valider la clôture]                   │    │      │
│  │  │                                                         │    │      │
│  │  │ REC-2026-003 🔴                                         │    │      │
│  │  │ Régulariser l'écart de caisse                          │    │      │
│  │  │ Émise: 15/02/2026 | Échéance: 28/02/2026               │    │      │
│  │  │ Statut: ⚠️ En retard                                   │    │      │
│  │  │ Responsable: Trésorier                                 │    │      │
│  │  │ [Voir détails]  [Relancer]                             │    │      │
│  │  │                                                         │    │      │
│  │  │ ...                                                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Statistiques:                                                  │      │
│  │  • Total: 6 recommandations                                     │      │
│  │  • Clôturées: 2                                                 │      │
│  │  • En cours: 3                                                  │      │
│  │  • En retard: 1                                                 │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 14.2 Sous-Flow : Validation de Mise en Œuvre

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: VALIDATION DE MISE EN ŒUVRE                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉTAIL DE LA RECOMMANDATION                   │      │
│  │                                                                  │      │
│  │  Référence: REC-2026-004                                        │      │
│  │  Titre: Archiver les justificatifs numériquement                │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ HISTORIQUE                                              │    │      │
│  │  │                                                         │    │      │
│  │  │ 01/03 - Recommandation émise                           │    │      │
│  │  │ 05/03 - Prise en compte par Secrétaire                 │    │      │
│  │  │ 15/03 - Secrétaire: "Mise en œuvre terminée.           │    │      │
│  │  │         Tous les justificatifs des 3 derniers mois     │    │      │
│  │  │         ont été numérisés et archivés."                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATION PAR LE COMMISSAIRE                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Avez-vous vérifié la mise en œuvre ?                   │    │      │
│  │  │ ☑ Oui, j'ai vérifié                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ La mise en œuvre est-elle satisfaisante ?              │    │      │
│  │  │ ● ✅ Oui, recommandation clôturée                      │    │      │
│  │  │ ○ ⚠️ Partiellement, prolongation                       │    │      │
│  │  │ ○ ❌ Non, réouverture                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire de clôture:                                │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Vérification effectuée. Les justificatifs sont │    │    │      │
│  │  │ │ bien archivés et accessibles. Recommandation   │    │    │      │
│  │  │ │ clôturée avec satisfaction.                    │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Valider]                                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ RECOMMANDATION CLÔTURÉE                    │      │
│  │                                                                  │      │
│  │  REC-2026-004 est maintenant clôturée.                          │      │
│  │  Durée de mise en œuvre: 14 jours                               │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 14.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-SR01 | Le Commissaire suit toutes ses recommandations |
| RM-SR02 | Il peut relancer les recommandations en retard |
| RM-SR03 | Il valide la mise en œuvre après vérification |
| RM-SR04 | L'historique complet est conservé |

---

# 15. FLOW 13 : GÉNÉRATION DU RAPPORT DE SÉANCE

## 15.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GÉNÉRATION DU RAPPORT DE SÉANCE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  │(Pendant  │                                                               │
│  │ séance)  │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Commissaire      │                                                       │
│  │ clique "Rapport  │                                                       │
│  │ de séance"       │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    RAPPORT GÉNÉRÉ AUTOMATIQUEMENT                │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RAPPORT DU COMMISSAIRE AUX COMPTES                      │    │      │
│  │  │ Séance #8 - 15 Mars 2026                                │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 1. ÉTAT DES CAISSES                                     │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Caisse principale: 2,450,000 XAF ✅                    │    │      │
│  │  │ Caisse de secours: 350,000 XAF ✅                      │    │      │
│  │  │ Caisse fonctionnement: 125,000 XAF ⚠️                  │    │      │
│  │  │ (Écart de 5,000 XAF en cours de régularisation)        │    │      │
│  │  │                                                         │    │      │
│  │  │ Total: 2,925,000 XAF                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ 2. VALIDATION DU BILAN DE SÉANCE                        │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Bilan du Trésorier: ✅ Validé                          │    │      │
│  │  │ Observations: RAS                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ 3. VALIDATIONS EFFECTUÉES                               │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ • Transfert TR-2026-015: ✅ Approuvé                   │    │      │
│  │  │ • Dépense DEP-2026-042: ✅ Approuvé                    │    │      │
│  │  │ • Décaissement PRET-2026-008: ✅ Approuvé              │    │      │
│  │  │                                                         │    │      │
│  │  │ 4. CONTRÔLES EFFECTUÉS                                  │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Contrôle mensuel Mars: ✅ Effectué                     │    │      │
│  │  │ Résultat: Conforme avec réserves                       │    │      │
│  │  │                                                         │    │      │
│  │  │ 5. ANOMALIES SIGNALÉES                                  │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ • SIG-2026-003: Écart caisse - ✅ Résolu               │    │      │
│  │  │                                                         │    │      │
│  │  │ 6. RECOMMANDATIONS EN COURS                             │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ • REC-2026-005: Suivi prêts - ⏳ En cours              │    │      │
│  │  │ • REC-2026-003: Écart caisse - ⚠️ En retard            │    │      │
│  │  │                                                         │    │      │
│  │  │ 7. AVIS GÉNÉRAL                                         │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ La gestion financière est globalement          │    │    │      │
│  │  │ │ satisfaisante. Je recommande de veiller à la   │    │    │      │
│  │  │ │ mise en œuvre rapide des recommandations en    │    │    │      │
│  │  │ │ cours, notamment celle concernant le suivi     │    │    │      │
│  │  │ │ des remboursements de prêts.                   │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Fait le 15 Mars 2026                                   │    │      │
│  │  │ Le Commissaire aux Comptes: [Signature]                │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Modifier l'avis]  [Signer et finaliser]                       │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ RAPPORT FINALISÉ                           │      │
│  │                                                                  │      │
│  │  • Rapport signé et archivé                                     │      │
│  │  • Intégré au PV de la séance                                   │      │
│  │  • Copie envoyée au Secrétaire                                  │      │
│  │                                                                  │      │
│  │  [📥 Télécharger PDF]                                           │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 15.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-RS01 | Le Commissaire présente un rapport à chaque séance |
| RM-RS02 | Le rapport est généré automatiquement |
| RM-RS03 | Il peut modifier l'avis général |
| RM-RS04 | Le rapport est intégré au PV |

---

# 16. FLOW 14 : VALIDATION DE CLÔTURE DE CYCLE

## 16.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: VALIDATION DE CLÔTURE DE CYCLE                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Clôture de      │                                                       │
│  │  cycle à         │                                                       │
│  │  valider"        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    BILAN DE CLÔTURE DE CYCLE                     │      │
│  │                                                                  │      │
│  │  Cycle #2: Janvier - Mars 2026                                  │      │
│  │  Demande de clôture par: Président (31/03/2026)                 │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ BILAN FINANCIER DU CYCLE                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Cotisations collectées: 5,400,000 XAF                  │    │      │
│  │  │ Distributions effectuées: 5,400,000 XAF                │    │      │
│  │  │ Tous les membres ont reçu leur cagnotte: ✅            │    │      │
│  │  │                                                         │    │      │
│  │  │ Prêts accordés: 1,500,000 XAF                          │    │      │
│  │  │ Remboursements reçus: 1,200,000 XAF                    │    │      │
│  │  │ Prêts en cours: 300,000 XAF (reportés cycle suivant)   │    │      │
│  │  │                                                         │    │      │
│  │  │ Solde caisses fin de cycle: 2,967,500 XAF              │    │      │
│  │  │ (Reporté au cycle suivant)                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATIONS PRÉALABLES                                │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Audit de cycle effectué (AUDIT-2026-Q1-001)         │    │      │
│  │  │ ✅ Comptes certifiés (CERT-2026-C2-001)                │    │      │
│  │  │ ✅ Tous les bilans de séance validés                   │    │      │
│  │  │ ⚠️ 1 prêt en cours (reporté)                           │    │      │
│  │  │ ✅ Aucune anomalie non résolue                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE DÉCISION                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Valider la clôture du cycle                       │    │      │
│  │  │ ○ ❌ Refuser la clôture (anomalies à traiter)          │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire:                                           │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Cycle clôturé conformément aux procédures.     │    │    │      │
│  │  │ │ Le prêt en cours sera reporté au cycle #3.     │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Valider]                                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ CLÔTURE VALIDÉE                            │      │
│  │                                                                  │      │
│  │  Cycle #2 clôturé avec succès.                                  │      │
│  │                                                                  │      │
│  │  • Validation Président: ✅                                     │      │
│  │  • Validation Commissaire: ✅                                   │      │
│  │  • Cycle archivé                                                │      │
│  │  • Nouveau cycle #3 initialisé                                  │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 16.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-VC01 | La clôture de cycle nécessite validation Président + Commissaire |
| RM-VC02 | Le Commissaire vérifie que l'audit et la certification ont été faits |
| RM-VC03 | Les éléments en cours (prêts) sont reportés au cycle suivant |
| RM-VC04 | La clôture archive le cycle et initialise le suivant |

---

# 17. FLOW 15 : CONSULTATION DES JUSTIFICATIFS

## 17.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CONSULTATION DES JUSTIFICATIFS                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Commissaire      │                                                       │
│  │ accède           │                                                       │
│  │ "Justificatifs"  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    LISTE DES JUSTIFICATIFS                       │      │
│  │                                                                  │      │
│  │  Filtres: [Toutes dépenses ▼] [Mars 2026 ▼] [Toutes catég. ▼]   │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ JUSTIFICATIFS (18)                                      │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 📄 DEP-2026-042 - Location salle                       │    │      │
│  │  │    Montant: 75,000 XAF | Date: 15/03/2026              │    │      │
│  │  │    Type: Facture | Format: PDF                         │    │      │
│  │  │    [👁️ Voir]  [📥 Télécharger]                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 📄 DEP-2026-041 - Fournitures bureau                   │    │      │
│  │  │    Montant: 35,000 XAF | Date: 10/03/2026              │    │      │
│  │  │    Type: Reçu | Format: JPG                            │    │      │
│  │  │    [👁️ Voir]  [📥 Télécharger]                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 📄 DEP-2026-040 - Transport                            │    │      │
│  │  │    Montant: 15,000 XAF | Date: 08/03/2026              │    │      │
│  │  │    Type: Ticket | Format: PDF                          │    │      │
│  │  │    [👁️ Voir]  [📥 Télécharger]                         │    │      │
│  │  │                                                         │    │      │
│  │  │ ...                                                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [📥 Télécharger tous (ZIP)]  [📊 Rapport des dépenses]         │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 17.2 Sous-Flow : Visualisation d'un Justificatif

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: VISUALISATION JUSTIFICATIF                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    VISUALISEUR DE JUSTIFICATIF                   │      │
│  │                                                                  │      │
│  │  Dépense: DEP-2026-042                                          │      │
│  │  Catégorie: Location de salle                                   │      │
│  │  Montant: 75,000 XAF                                            │      │
│  │  Enregistrée par: Trésorier                                     │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │                                                         │    │      │
│  │  │           [APERÇU DU DOCUMENT PDF]                     │    │      │
│  │  │                                                         │    │      │
│  │  │   ┌─────────────────────────────────────────────┐      │    │      │
│  │  │   │                                             │      │    │      │
│  │  │   │         FACTURE N° 2026-0315               │      │    │      │
│  │  │   │                                             │      │    │      │
│  │  │   │   Salle des fêtes FOUDA                    │      │    │      │
│  │  │   │   Yaoundé, Cameroun                        │      │    │      │
│  │  │   │                                             │      │    │      │
│  │  │   │   Location salle de conférence             │      │    │      │
│  │  │   │   Date: 15 Mars 2026                       │      │    │      │
│  │  │   │   Durée: 4 heures                          │      │    │      │
│  │  │   │                                             │      │    │      │
│  │  │   │   Montant: 75,000 XAF                      │      │    │      │
│  │  │   │                                             │      │    │      │
│  │  │   │   [Cachet et signature]                    │      │    │      │
│  │  │   │                                             │      │    │      │
│  │  │   └─────────────────────────────────────────────┘      │    │      │
│  │  │                                                         │    │      │
│  │  │  [◀️ Page préc.]  Page 1/1  [Page suiv. ▶️]            │    │      │
│  │  │  [🔍 Zoom +]  [🔍 Zoom -]  [↺ Rotation]                │    │      │
│  │  │                                                         │    │      │
│  │  └─────────���───────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [📥 Télécharger]  [🖨️ Imprimer]  [❓ Demander éclaircissement] │      │
│  │                                                                  │      │
│  │  [Fermer]                                                       │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 17.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-CJ01 | Le Commissaire peut consulter tous les justificatifs |
| RM-CJ02 | Il peut visualiser, télécharger et imprimer |
| RM-CJ03 | Il peut demander des éclaircissements directement |
| RM-CJ04 | Il peut télécharger tous les justificatifs d'une période |

---

# 18. FLOW 16 : EXPORT DES DONNÉES POUR AUDIT

## 18.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: EXPORT DES DONNÉES POUR AUDIT                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Commissaire      │                                                       │
│  │ clique "Export   │                                                       │
│  │ données"         │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIGURATION DE L'EXPORT                     │      │
│  │                                                                  │      │
│  │  Période: Du [01/01/2026] au [31/03/2026]                       │      │
│  │                                                                  │      │
│  │  Données à exporter:                                            │      │
│  │  ☑ Mouvements de caisse                                         │      │
│  │  ☑ Cotisations                                                  │      │
│  │  ☑ Prêts et remboursements                                      │      │
│  │  ☑ Dépenses                                                     │      │
│  │  ☑ Distributions                                                │      │
│  │  ☑ Sanctions                                                    │      │
│  │  ☑ Justificatifs (fichiers)                                     │      │
│  │  ☑ Bilans de séance                                             │      │
│  │  ☑ Rapports d'audit                                             │      │
│  │                                                                  │      │
│  │  Format:                                                        │      │
│  │  ● Excel (.xlsx)                                                │      │
│  │  ○ CSV                                                          │      │
│  │  ○ PDF (rapport consolidé)                                      │      │
│  │  ○ Package complet (ZIP avec tous les fichiers)                 │      │
│  │                                                                  │      │
│  │  [Annuler]  [Générer l'export]                                  │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    GÉNÉRATION EN COURS                           │      │
│  │                                                                  │      │
│  │  ⏳ Extraction des données...                                   │      │
│  │  ✅ Mouvements de caisse (156 lignes)                           │      │
│  │  ✅ Cotisations (540 lignes)                                    │      │
│  │  ✅ Prêts (12 lignes)                                           │      │
│  │  ⏳ Dépenses...                                                 │      │
│  │                                                                  │      │
│  │  Progression: ████████████░░░░░░░░ 60%                          │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ EXPORT PRÊT                                │      │
│  │                                                                  │      │
│  │  Fichier: Export_Audit_Q1_2026.xlsx                             │      │
│  │  Taille: 2.5 Mo                                                 │      │
│  │  Contenu:                                                       │      │
│  │  • 6 onglets de données                                         │      │
│  │  • 756 lignes au total                                          │      │
│  │  • 18 justificatifs joints                                      │      │
│  │                                                                  │      │
│  │  [📥 Télécharger]                                               │      │
│  │                                                                  │      │
│  │  ⚠️ Ce fichier contient des données sensibles.                 │      │
│  │     Veuillez le manipuler avec précaution.                      │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 18.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-ED01 | Le Commissaire peut exporter toutes les données financières |
| RM-ED02 | L'export est configurable (période, types de données, format) |
| RM-ED03 | Les justificatifs peuvent être inclus |
| RM-ED04 | L'export est tracé dans les logs |

---

# 19. RÉCAPITULATIF DES ÉCRANS

## 19.1 Liste des Écrans du Commissaire aux Comptes

| # | Écran | Description | Accès |
|---|-------|-------------|-------|
| E-CC01 | Tableau de bord | Vue d'ensemble du contrôle | Menu principal |
| E-CC02 | Consultation données | Accès aux données financières | Menu principal |
| E-CC03 | Validation transfert | Approuver/refuser transfert | Notifications |
| E-CC04 | Validation dépense | Approuver/refuser dépense | Notifications |
| E-CC05 | Validation prêt | Approuver/refuser décaissement | Notifications |
| E-CC06 | Vérification bilan | Contrôler bilan de séance | Notifications |
| E-CC07 | Contrôle périodique | Checklist de contrôle | Menu principal |
| E-CC08 | Audit | Réalisation d'audit formel | Menu principal |
| E-CC09 | Signalement | Formulaire d'anomalie | Actions |
| E-CC10 | Certification | Certifier les comptes | Menu principal |
| E-CC11 | Éclaircissements | Demander des explications | Contextuel |
| E-CC12 | Recommandations | Émettre des recommandations | Menu principal |
| E-CC13 | Suivi recommandations | Tableau de suivi | Menu principal |
| E-CC14 | Rapport de séance | Rapport automatique | Pendant séance |
| E-CC15 | Clôture de cycle | Valider clôture | Notifications |
| E-CC16 | Justificatifs | Visualiser les pièces | Menu principal |
| E-CC17 | Export données | Exporter pour audit | Menu principal |
| E-CC18 | Cycles / Séances | Consultation lecture seule des cycles et séances | Sidebar › Séances |
| E-CC19 | Détail séance | Ordre du jour, présences, cotisations (lecture seule) | Liste séances |

## 19.1b Accès Consultation des Séances

Le Commissaire aux Comptes dispose d'un accès **lecture seule** à la vue cycles/séances (identique à la vue Membre). Cet accès lui permet de croiser les présences et les cotisations collectées avec les bilans de séance qu'il contrôle, sans avoir besoin de demander ces informations au Trésorier.

| Élément | Détail |
|---------|--------|
| Entrée | Sidebar › Audit › **Séances** |
| Vue | Liste cycles (accordéon) → liste séances → détail séance |
| Onglets disponibles | Ordre du jour · Présences · Cotisations |
| Droit | Lecture seule — aucune saisie possible depuis cette vue |

> Voir **Flow 24 (Flows_Membre.md)** pour la description complète de la navigation.

---

# 20. RÈGLES MÉTIER ET INTÉGRATIONS

## 20.1 Règles Métier - Récapitulatif

| Code | Règle |
|------|-------|
| RM-CD | Accès temps réel à toutes les données financières |
| RM-VT | Validation des transferts avec Président |
| RM-VD | Validation des dépenses > plafond avec Président |
| RM-VP | Validation des décaissements de prêts |
| RM-VB | Vérification obligatoire des bilans de séance |
| RM-CP | Contrôles périodiques selon configuration |
| RM-AU | Audits formels avec rapport signé |
| RM-SA | Signalements à différents niveaux |
| RM-CC | Certification des comptes avant Assemblée |
| RM-DE | Demandes d'éclaircissements au Trésorier |
| RM-RE | Recommandations tracées et suivies |
| RM-RS | Rapport de séance intégré au PV |
| RM-VC | Validation de clôture de cycle |
# 🟣 FLOWS COMPLETS DU COMMISSAIRE AUX COMPTES (FINAL)
## Application de Gestion de Tontine - Cameroun

---

# 20. RÈGLES MÉTIER ET INTÉGRATIONS (Suite)

## 20.2 Intégrations avec Autres Rôles (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERACTIONS COMMISSAIRE ↔ AUTRES RÔLES                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  COMMISSAIRE                             PRÉSIDENT                          │
│  ───────────                             ─────────                          │
│  Valide transferts ◄────────────────────► Valide en parallèle              │
│  Valide dépenses ◄──────────────────────► Valide en parallèle              │
│  Valide prêts ◄─────────────────────────► Valide en parallèle              │
│  Valide clôture cycle ◄─────────────────► Demande clôture                  │
│  Signale anomalies ─────────────────────► Reçoit signalements              │
│  Émet recommandations ──────────────────► Reçoit recommandations           │
│                                                                             │
│  COMMISSAIRE                             TRÉSORIER                          │
│  ───────────                             ─────────                          │
│  Consulte données ◄─────────────────────  Gère les données                 │
│  Vérifie bilan séance ◄─────────────────  Produit le bilan                 │
│  Demande éclaircissements ──────────────► Répond                           │
│  Consulte justificatifs ◄───────────────  Archive justificatifs            │
│  Émet recommandations ──────────────────► Reçoit pour action               │
│                                                                             │
│  COMMISSAIRE                             SECRÉTAIRE                         │
│  ───────────                             ──────────                         │
│  Rapport de séance ─────────────────────► Intègre au PV                    │
│  Rapport d'audit ───────────────────────► Archive dans documents           │
│  Certificat comptes ────────────────────► Archive dans documents           │
│                                                                             │
│  COMMISSAIRE                             CENSEUR                            │
│  ───────────                             ───────                            │
│  Consulte sanctions ◄───────────────────  Gère les sanctions               │
│  (Lecture seule)                                                           │
│                                                                             │
│  COMMISSAIRE                             BUREAU                             │
│  ───────────                             ──────                             │
│  Présente rapport audit ────────────────► Examine et discute               │
│  Émet recommandations ──────────────────► Décide des actions               │
│  Signale anomalies ─────────────────────► Traite les signalements          │
│                                                                             │
│  COMMISSAIRE                             ASSEMBLÉE                          │
│  ───────────                             ─────────                          │
│  Présente certification ────────────────► Approuve les comptes             │
│  Présente rapport audit ────────────────► Prend connaissance               │
│  Signale (si grave) ──────────��─────────► Décide mesures                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 21. NOTIFICATIONS DU COMMISSAIRE AUX COMPTES

## 21.1 Notifications Reçues

| Événement | Source | Priorité |
|-----------|--------|----------|
| Transfert entre caisses à valider | Trésorier | Haute |
| Dépense > plafond à valider | Trésorier | Haute |
| Décaissement de prêt à valider | Bureau | Haute |
| Bilan de séance à vérifier | Trésorier | Haute |
| Clôture de cycle à valider | Président | Haute |
| Réponse à éclaircissement | Trésorier | Normale |
| Mise en œuvre recommandation | Responsable | Normale |
| Rappel contrôle périodique | Système | Normale |
| Rappel audit planifié | Système | Normale |
| Anomalie détectée automatiquement | Système | Haute |
| Échéance recommandation proche | Système | Normale |

## 21.2 Notifications Envoyées

| Événement | Destinataire | Canaux |
|-----------|--------------|--------|
| Transfert validé/refusé | Trésorier, Président | Push, Email |
| Dépense validée/refusée | Trésorier, Président | Push, Email |
| Décaissement validé/refusé | Trésorier, Bureau | Push, Email |
| Bilan validé/rejeté | Trésorier, Président | Push, Email |
| Clôture cycle validée/refusée | Président | Push, Email |
| Anomalie signalée | Président/Bureau/Assemblée | Push, Email |
| Recommandation émise | Bureau, Responsable | Push, Email |
| Demande d'éclaircissement | Trésorier | Push, Email |
| Rapport de contrôle généré | Bureau | Push, Email |
| Rapport d'audit finalisé | Président, Bureau | Push, Email |
| Certificat de comptes | Président, Bureau | Push, Email |
| Relance recommandation | Responsable | Push, Email |

---

# 22. DÉLÉGATION À L'ADJOINT

## 22.1 Règles de Délégation

| Règle | Description |
|-------|-------------|
| RM-AD01 | Le Commissaire adjoint a les mêmes pouvoirs de contrôle |
| RM-AD02 | Les validations de l'adjoint ont la même valeur |
| RM-AD03 | Les opérations de l'adjoint sont tracées sous son nom |
| RM-AD04 | Le Commissaire principal peut voir les actions de son adjoint |
| RM-AD05 | La délégation est totale (pas de restrictions) |

## 22.2 Pouvoirs du Commissaire Adjoint

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POUVOIRS DU COMMISSAIRE ADJOINT                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ✅ AUTORISÉ (mêmes pouvoirs que le titulaire):                            │
│  • Consulter toutes les données financières                                │
│  • Valider les transferts entre caisses                                    │
│  • Valider les dépenses > plafond                                          │
│  • Valider les décaissements de prêts                                      │
│  • Vérifier les bilans de séance                                           │
│  • Effectuer des contrôles périodiques                                     │
│  • Réaliser des audits                                                     │
│  • Signaler des anomalies                                                  │
│  • Certifier les comptes                                                   │
│  • Demander des éclaircissements                                           │
│  • Émettre des recommandations                                             │
│  • Valider la clôture de cycle                                             │
│  • Consulter les justificatifs                                             │
│  • Exporter les données                                                    │
│  • Générer le rapport de séance                                            │
│                                                                             │
│  📝 TRAÇABILITÉ:                                                           │
│  • Toutes les actions sont enregistrées sous le nom de l'adjoint          │
│  • Le titulaire peut consulter les actions de son adjoint                  │
│  • Les rapports mentionnent l'auteur (titulaire ou adjoint)                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 23. CAS D'ERREUR ET EXCEPTIONS

## 23.1 Cas d'Erreur Possibles

| Cas | Message | Action |
|-----|---------|--------|
| Validation sans Président | "Le Président n'a pas encore validé cette opération." | Information (peut valider avant ou après) |
| Bilan non signé par Trésorier | "Le bilan n'a pas encore été signé par le Trésorier." | Attendre signature |
| Audit sans données | "Aucune donnée disponible pour la période sélectionnée." | Modifier la période |
| Export trop volumineux | "L'export dépasse la limite de taille. Veuillez réduire la période." | Réduire période |
| Certification sans audit | "Aucun audit n'a été effectué pour cette période." | Effectuer audit d'abord |
| Recommandation sans référence | "Veuillez lier cette recommandation à un contexte." | Ajouter contexte |

## 23.2 Gestion des Conflits

| Conflit | Résolution |
|---------|------------|
| Commissaire refuse, Président approuve | L'opération est REFUSÉE (les deux validations sont requises) |
| Commissaire approuve, Président refuse | L'opération est REFUSÉE |
| Bilan rejeté mais séance clôturée | Le Trésorier doit corriger et resoumettre |
| Anomalie signalée mais non traitée | Rappels automatiques, escalade possible |
| Recommandation en retard | Relance automatique, mention dans rapport |

---

# 24. JOURNAL D'AUDIT DU COMMISSAIRE

## 24.1 Opérations Tracées

| Opération | Informations enregistrées |
|-----------|---------------------------|
| Consultation données | Date, heure, type de données, période consultée |
| Validation transfert | Date, heure, décision, commentaire, référence |
| Validation dépense | Date, heure, décision, commentaire, référence |
| Validation prêt | Date, heure, décision, commentaire, référence |
| Vérification bilan | Date, heure, décision, observations |
| Contrôle périodique | Date, heure, type, période, résultat |
| Audit | Date, heure, type, période, avis, recommandations |
| Signalement | Date, heure, gravité, destinataires |
| Certification | Date, heure, période, décision, réserves |
| Demande éclaircissement | Date, heure, opération concernée, question |
| Recommandation | Date, heure, contexte, priorité, échéance |
| Export données | Date, heure, période, types de données, format |

## 24.2 Accès au Journal

| Rôle | Accès |
|------|-------|
| Commissaire | Lecture de toutes ses opérations et celles de l'adjoint |
| Commissaire adjoint | Lecture de ses propres opérations |
| Président | Lecture complète (audit du Commissaire) |
| Administrateur système | Lecture complète |

---

# 25. NAVIGATION DU COMMISSAIRE AUX COMPTES

## 25.1 Structure du Menu

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NAVIGATION - COMMISSAIRE AUX COMPTES                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         MENU PRINCIPAL                              │   │
│  └─────────────────────────────────────────────────��───────────────────┘   │
│                                    │                                        │
│       ┌──────────┬─────────────────┼─────────────────┬──────────┐          │
│       │          │                 │                 │          │          │
│       ▼          ▼                 ▼                 ▼          ▼          │
│  ┌─────────┐ ┌─────────┐     ┌─────────┐      ┌─────────┐ ┌─────────┐     │
│  │Tableau  │ │Consul-  │     │Contrôle │      │Rapports │ │Recomm.  │     │
│  │de bord  │ │tation   │     │& Audit  │      │         │ │         │     │
│  └────┬────┘ └────┬────┘     └────┬────┘      └────┬────┘ └────┬────┘     │
│       │          │                │                │          │           │
│       │     ┌────┴────┐      ┌────┴────┐      ┌────┴────┐     │           │
│       │     ▼         ▼      ▼         ▼      ▼         ▼     │           │
│       │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │           │
│       │ │Caisses│ │Mouve-│ │Contrôle│ │Audit │ │Séance│ │Certif│ │           │
│       │ │      │ │ments │ │périod.│ │formel│ │      │ │icat. │ │           │
│       │ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │           │
│       │                                                        │           │
│       │ ┌──────┐ ┌──────┐                                      │           │
│       │ │Cotis.│ │Prêts │                              ┌───────┴───────┐  │
│       │ └──────┘ └──────┘                              ▼               ▼  │
│       │                                           ┌──────┐       ┌──────┐ │
│       │ ┌──────┐ ┌──────┐                         │Émettre│       │Suivi │ │
│       │ │Dépens│ │Distri│                         │       │       │      │ │
│       │ └──────┘ └──────┘                         └──────┘       └──────┘ │
│       │                                                                    │
│       │ ┌──────┐ ┌──────┐                                                 │
│       │ │Sanct.│ │Histo.│                                                 │
│       │ └──────┘ └──────┘                                                 │
│       │                                                                    │
│       │ ┌──────┐                                                          │
│       │ │Justif│                                                          │
│       │ └──────┘                                                          │
│       │                                                                    │
│       │    ┌───────────────────────────────────────────────────────┐      │
│       └───►│                   NOTIFICATIONS                       │      │
│            │  • Validations en attente (transferts, dépenses, prêts)│     ���
│            │  • Bilans de séance à vérifier                        │      │
│            │  • Contrôles/audits planifiés                         │      │
│            │  • Réponses aux éclaircissements                      │      │
│            │  • Mises en œuvre de recommandations                  │      │
│            │  • Alertes système (anomalies détectées)              │      │
│            └───────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         ACTIONS RAPIDES                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  [✅ Validations]  [🔍 Contrôle]  [📊 Audit]  [⚠️ Signaler]        │   │
│  │                                                                     │   │
│  │  [📋 Rapport séance]  [📜 Certifier]  [💡 Recommandation]          │   │
│  │                                                                     │   │
│  │  [📥 Export]  [❓ Éclaircissement]                                  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 26. DOUBLE CASQUETTE : COMMISSAIRE ET MEMBRE

## 26.1 Gestion de la Double Casquette

Le Commissaire aux Comptes étant également un membre actif de la tontine, il a accès à deux interfaces :

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DOUBLE CASQUETTE DU COMMISSAIRE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      SÉLECTION DU RÔLE                              │   │
│  │                                                                     │   │
│  │  Bonjour M. NGUEMO,                                                │   │
│  │                                                                     │   │
│  │  Vous avez plusieurs rôles dans cette tontine :                    │   │
│  │                                                                     │   │
│  │  ┌───────────────────────┐     ┌───────────────────────┐          │   │
│  │  │                       │     │                       │          │   │
│  │  │  🔍 COMMISSAIRE       │     │  👤 MEMBRE            │          │   │
│  │  │     AUX COMPTES       │     │                       │          │   │
│  │  │                       │     │                       │          │   │
│  │  │  Contrôle, audit,     │     │  Cotisations, prêts,  │          │   │
│  │  │  validations          │     │  mon historique       │          │   │
│  │  │                       │     │                       │          │   │
│  │  │  [Accéder]            │     │  [Accéder]            │          │   │
│  │  │                       │     │                       │          │   │
│  │  └───────────────────────┘     └───────────────────────┘          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  EN TANT QUE COMMISSAIRE:                                                  │
│  • Accès au tableau de bord de contrôle                                    │
│  • Validations des opérations                                              │
│  • Audits et certifications                                                │
│  • Rapports et recommandations                                             │
│                                                                             │
│  EN TANT QUE MEMBRE:                                                       │
│  • Paiement de ses cotisations                                             │
│  • Demande de prêts                                                        │
│  • Consultation de son historique                                          │
│  • Réception de sa cagnotte                                                │
│                                                                             │
│  ⚠️ NOTE: Le Commissaire peut valider ses propres opérations              │
│     (pas d'exclusion pour conflit d'intérêt selon les règles définies)    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 26.2 Règles de la Double Casquette

| Règle | Description |
|-------|-------------|
| RM-DC01 | Le Commissaire peut basculer entre ses rôles |
| RM-DC02 | En tant que membre, il a les mêmes droits que tout membre |
| RM-DC03 | Il peut valider des opérations le concernant (pas d'exclusion) |
| RM-DC04 | Ses opérations personnelles sont tracées normalement |

---

# FIN DU DOCUMENT - FLOWS DU COMMISSAIRE AUX COMPTES

## Récapitulatif des Livrables

| Document | Contenu |
|----------|---------|
| Flows_CommissaireAuxComptes_TontineApp.md | Vue d'ensemble, Flows 1-4 (Consultation, Validations) |
| Flows_CommissaireAuxComptes_TontineApp_Suite.md | Flows 5-11 (Vérifications, Contrôles, Audits, Signalements, Certification) |
| Flows_CommissaireAuxComptes_TontineApp_Fin.md | Flows 12-16 (Recommandations, Rapports, Justificatifs, Export) |
| Flows_CommissaireAuxComptes_TontineApp_Final.md | Intégrations, Notifications, Délégation, Navigation |

## Statistiques

| Élément | Nombre |
|---------|--------|
| Flows principaux | 16 |
| Sous-flows | 4 |
| Écrans | 17 |
| Règles métier | 40+ |
| Types de notifications reçues | 11 |
| Types de notifications envoyées | 12 |
| Intégrations autres rôles | 6 |

## Prochaines Étapes

Les flows du **Commissaire aux Comptes** sont maintenant complets. 

Souhaitez-vous que je génère les flows pour un autre rôle ?
- **Membre** (membre simple de la tontine)
- **Secrétaire** (gestion administrative, PV)
- **Président** (direction, validations, décisions)
- **Vice-Président** (suppléance)

Ou souhaitez-vous un autre livrable ?
- **Diagrammes de séquence** pour les interactions entre rôles
- **Matrice des permissions** consolidée
- **Spécifications API** pour les flows
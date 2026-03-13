# 🔵 FLOWS COMPLETS DU TRÉSORIER
## Application de Gestion de Tontine - Cameroun
### Version 1.0 | Mars 2026

---

# TABLE DES MATIÈRES

1. [Vue d'Ensemble](#1-vue-densemble)
2. [Tableau de Bord du Trésorier](#2-tableau-de-bord-du-trésorier)
3. [Flow 1 : Encaissement d'une Cotisation](#3-flow-1--encaissement-dune-cotisation)
4. [Flow 2 : Approbation des Paiements Mobile Money](#4-flow-2--approbation-des-paiements-mobile-money)
5. [Flow 3 : Enregistrement Paiement Partiel](#5-flow-3--enregistrement-paiement-partiel)
6. [Flow 4 : Enregistrement Paiement en Avance](#6-flow-4--enregistrement-paiement-en-avance)
7. [Flow 5 : Gestion des Caisses](#7-flow-5--gestion-des-caisses)
8. [Flow 6 : Transfert entre Caisses](#8-flow-6--transfert-entre-caisses)
9. [Flow 7 : Enregistrement d'une Dépense](#9-flow-7--enregistrement-dune-dépense)
10. [Flow 8 : Distribution de la Cagnotte](#10-flow-8--distribution-de-la-cagnotte)
11. [Flow 9 : Décaissement d'un Prêt](#11-flow-9--décaissement-dun-prêt)
12. [Flow 10 : Enregistrement Remboursement Prêt](#12-flow-10--enregistrement-remboursement-prêt)
13. [Flow 11 : Encaissement des Sanctions](#13-flow-11--encaissement-des-sanctions)
14. [Flow 12 : Remboursement Sanction Annulée](#14-flow-12--remboursement-sanction-annulée)
15. [Flow 13 : Gestion Cotisation Extraordinaire](#15-flow-13--gestion-cotisation-extraordinaire)
16. [Flow 14 : Génération du Bilan de Séance](#16-flow-14--génération-du-bilan-de-séance)
17. [Flow 15 : Génération des Rapports](#17-flow-15--génération-des-rapports)
18. [Flow 16 : Réconciliation Mobile Money](#18-flow-16--réconciliation-mobile-money)
19. [Flow 17 : Paiement Sortant Mobile Money](#19-flow-17--paiement-sortant-mobile-money)
20. [Récapitulatif des Écrans](#20-récapitulatif-des-écrans)

---

# 1. VUE D'ENSEMBLE

## 1.1 Rôle du Trésorier

Le Trésorier est le **gardien des finances** de la tontine. Il gère les encaissements, les décaissements, les différentes caisses, et produit les rapports financiers. Il travaille en étroite collaboration avec le Président, le Censeur et le Commissaire aux Comptes.

## 1.2 Résumé des Pouvoirs

| Domaine | Pouvoir | Condition |
|---------|---------|-----------|
| Cotisations | Encaisser les cotisations | Pendant ou hors séance |
| Cotisations | Enregistrer paiements partiels | Aucune |
| Cotisations | Enregistrer paiements en avance | Aucune |
| Mobile Money | Approuver paiements entrants | Vérification requise |
| Mobile Money | Initier paiements sortants | Distribution, remboursement |
| Caisses | Gérer plusieurs caisses | Principale, secours, fonctionnement, autres |
| Caisses | Transférer entre caisses | Validation Président + Commissaire |
| Dépenses | Enregistrer des dépenses | Justificatif obligatoire |
| Dépenses | Dépenses > plafond | Validation Président + Commissaire |
| Distribution | Distribuer la cagnotte | Pendant la séance uniquement |
| Distribution | Confirmation bénéficiaire | Signature électronique / OTP / App |
| Prêts | Décaisser les prêts validés | Validation Président + Commissaire |
| Prêts | Enregistrer remboursements | Partiels autorisés |
| Sanctions | Encaisser les sanctions | Sur notification censeur |
| Sanctions | Rembourser si annulée | Sur notification |
| Cotis. Extra | Collecter les cotisations | Suivi payé/non payé |
| Cotis. Extra | Distribuer au bénéficiaire | Après clôture par Président |
| Rapports | Générer bilans | Automatique |
| Rapports | Valider avec Président | Signature requise |
| Adjoint | Déléguer opérations | Mêmes pouvoirs |

## 1.3 Liste des Flows

| # | Flow | Description |
|---|------|-------------|
| 1 | Encaissement Cotisation | Enregistrer un paiement de cotisation |
| 2 | Approbation Mobile Money | Approuver les paiements automatiques |
| 3 | Paiement Partiel | Enregistrer un paiement incomplet |
| 4 | Paiement en Avance | Enregistrer un paiement anticipé |
| 5 | Gestion des Caisses | Consulter et gérer les caisses |
| 6 | Transfert entre Caisses | Déplacer des fonds |
| 7 | Enregistrement Dépense | Enregistrer une dépense avec justificatif |
| 8 | Distribution Cagnotte | Remettre la cagnotte au bénéficiaire |
| 9 | Décaissement Prêt | Verser un prêt validé |
| 10 | Remboursement Prêt | Enregistrer un remboursement |
| 11 | Encaissement Sanctions | Collecter les amendes |
| 12 | Remboursement Sanction | Rembourser une sanction annulée |
| 13 | Cotisation Extraordinaire | Gérer la collecte spéciale |
| 14 | Bilan de Séance | Présenter le bilan pendant la séance |
| 15 | Génération Rapports | Produire les rapports financiers |
| 16 | Réconciliation Mobile Money | Vérifier la cohérence des paiements |
| 17 | Paiement Sortant | Initier un paiement via Mobile Money |

---

# 2. TABLEAU DE BORD DU TRÉSORIER

## 2.1 Vue Générale

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TABLEAU DE BORD - TRÉSORIER                              │
│                    Tontine: [Nom de la Tontine]                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      🔔 ALERTES ET TÂCHES                           │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ • 5 paiements Mobile Money à approuver                              │   │
│  │ • 3 échéances de prêt dans les 7 prochains jours                   │   │
│  │ • 2 remboursements de sanctions à effectuer                        │   │
│  │ • 1 dépense en attente de validation (> plafond)                   │   │
│  │ • 1 transfert entre caisses en attente de validation               │   │
│  │ • Cotisation extraordinaire en cours (Décès M. BIYA)               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      💰 ÉTAT DES CAISSES                            │   │
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
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  📊 COTISATIONS - CE MOIS        │  │  💳 PRÊTS EN COURS           │    │
│  ├──────────────────────────────────┤  ├──────────────────────────────┤    │
│  │                                  │  │                              │    │
│  │ Attendues: 2,250,000 XAF        │  │ Nombre de prêts: 8           │    │
│  │ Collectées: 1,890,000 XAF       │  │ Montant total: 1,200,000 XAF │    │
│  │ Taux: 84%                       │  │                              │    │
│  │                                  │  │ Prêts en retard: 2          │    │
│  │ Membres à jour: 38/45           │  │ Montant: 180,000 XAF         │    │
│  │ Membres en retard: 7            │  │                              │    │
│  │                                  │  │ Échéances cette semaine: 3  │    │
│  │ [Voir détails]                  │  │ Montant: 95,000 XAF          │    │
│  │                                  │  │                              │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  ⚖️ SANCTIONS À COLLECTER        │  │  📅 PROCHAINE DISTRIBUTION   │    │
│  ├──────────────────────────────────┤  ├──────────────────────────────┤    │
│  │                                  │  │                              │    │
│  │ Nombre: 8 sanctions             │  │ Séance: #8 - 15 Mars 2026   │    │
│  │ Montant total: 45,000 XAF       │  │                              │    │
│  │                                  │  │ Bénéficiaire:               │    │
│  │ [Voir détails]                  │  │ Paul NGOUFACK               │    │
│  │                                  │  │                              │    │
│  │                                  │  │ Montant estimé:             │    │
│  │                                  │  │ 1,350,000 XAF               │    │
│  │                                  │  │                              │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌─────────────────────────��────┐    │
│  │  🎁 COTISATION EXTRAORDINAIRE    │  │  📉 DÉPENSES DU MOIS         │    │
│  ├──────────────────────────────────┤  ├──────────────────────────────┤    │
│  │                                  │  │                              │    │
│  │ En cours: Décès M. BIYA         │  │ Total: 85,000 XAF           │    │
│  │ Montant/membre: 5,000 XAF       │  │                              │    │
│  │                                  │  │ • Location salle: 50,000    │    │
│  │ Collecté: 180,000 / 225,000     │  │ • Fournitures: 25,000       │    │
│  │ Taux: 80%                       │  │ • Divers: 10,000            │    │
│  │                                  │  │                              │    │
│  │ Deadline: 20 Mars 2026          │  │ [Voir toutes les dépenses]  │    │
│  │                                  │  │                              │    │
│  │ [Voir détails]                  │  │                              │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      ⚡ ACTIONS RAPIDES                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  [💵 Encaisser]  [📤 Décaisser]  [🔄 Transférer]  [📝 Dépense]     │   │
│  │                                                                     │   │
│  │  [📊 Bilan séance]  [📋 Rapports]  [✅ Approuver MoMo]             │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Indicateurs du Tableau de Bord

| Indicateur | Description | Mise à jour |
|------------|-------------|-------------|
| Solde caisse principale | Fonds des cotisations | Temps réel |
| Solde caisse de secours | Fonds d'urgence | Temps réel |
| Solde caisse de fonctionnement | Frais de fonctionnement | Temps réel |
| Cotisations du mois | Attendu vs collecté | Temps réel |
| Membres en retard | Cotisations impayées | Temps réel |
| Prêts en cours | Nombre et montant total | Temps réel |
| Prêts en retard | Remboursements en souffrance | Temps réel |
| Sanctions à collecter | Montant des amendes impayées | Temps réel |
| Cotisation extraordinaire | Progression de la collecte | Temps réel |
| Dépenses du mois | Total des dépenses | Temps réel |
| Prochaine distribution | Bénéficiaire et montant estimé | Selon planning |
| Alertes | Tâches urgentes | Temps réel |

---

# 3. FLOW 1 : ENCAISSEMENT D'UNE COTISATION

## 3.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ENCAISSEMENT D'UNE COTISATION                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Trésorier clique │                                                       │
│  │ "Encaisser       │                                                       │
│  │  cotisation"     │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SÉLECTION DU MEMBRE                           │      │
│  │                                                                  │      │
│  ��  Rechercher: [________________] 🔍                               │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 👤 Jean KAMGA                                           │    │      │
│  │  │    Cotisation: 50,000 XAF / mois                       │    │      │
│  │  │    Statut: ⚠️ En retard (2 mois)                       │    │      │
│  │  │    Dû: 100,000 XAF                                     │    │      │
│  │  │    [Sélectionner]                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Marie NGUEMO                                         │    │      │
│  │  │    Cotisation: 50,000 XAF / mois                       │    │      │
│  │  │    Statut: ✅ À jour                                   │    │      │
│  │  │    Prochaine: Mars 2026                                │    │      │
│  │  │    [Sélectionner]                                      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └───────────��────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE D'ENCAISSEMENT                     │      │
│  │                                                                  │      │
│  │  👤 Membre: Jean KAMGA                                          │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SITUATION DU MEMBRE                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Cotisation mensuelle: 50,000 XAF                       │    │      │
│  │  │ Arriérés: 100,000 XAF (2 mois)                         │    │      │
│  │  │ Mois en cours: 50,000 XAF                              │    │      │
│  │  │ Total dû: 150,000 XAF                                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PAIEMENT                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Type de paiement:                                      │    │      │
│  │  │ ○ Cotisation régulière                                 │    │      │
│  │  │ ○ Arriérés                                             │    │      │
│  │  │ ● Cotisation + Arriérés                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant reçu: [150,000] XAF                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Mode de paiement:                                      │    │      │
│  │  │ ● Espèces                                              │    │      │
│  │  │ ○ MTN Mobile Money                                     │    │      │
│  │  │ ○ Orange Money                                         │    │      │
│  │  │ ○ Virement bancaire                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ Référence transaction: [_______________] (si MoMo)     │    │      │
│  │  │                                                         │    │      │
│  │  │ Période couverte:                                      │    │      │
│  │  │ ☑ Janvier 2026 (arriéré)                               │    │      │
│  │  │ ☑ Février 2026 (arriéré)                               │    │      │
│  │  │ ☑ Mars 2026 (courant)                                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Caisse destination: [Caisse principale ▼]                      │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer le paiement]                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIRMATION                                  │      │
│  │                                                                  │      │
│  │  Récapitulatif:                                                 │      │
│  │  • Membre: Jean KAMGA                                           │      │
│  │  • Montant: 150,000 XAF                                         │      │
│  │  • Mode: Espèces                                                │      │
│  │  • Périodes: Janvier, Février, Mars 2026                        │      │
│  │  • Caisse: Principale                                           │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer]                                         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ PAIEMENT ENREGISTRÉ                        │      │
│  │                                                                  │      │
│  │  • Cotisation enregistrée                                       │      │
│  │  • Caisse principale mise à jour (+150,000 XAF)                 │      │
│  │  • Reçu généré automatiquement                                  │      │
│  │  • Reçu envoyé au membre (SMS + Email)                          │      │
│  │  • Statut membre: ✅ À jour                                     │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 🧾 REÇU N° 2026-03-0042                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Membre: Jean KAMGA                                      │    │      │
│  │  │ Montant: 150,000 XAF                                   │    │      │
│  │  │ Date: 15 Mars 2026 à 15:30                             │    │      │
│  │  │ Objet: Cotisations Janv-Fév-Mars 2026                  │    │      │
│  │  │                                                         │    │      │
│  │  │ [📥 Télécharger]  [🖨️ Imprimer]  [📤 Renvoyer]         │    │      │
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

## 3.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-EC01 | L'encaissement peut se faire pendant ou hors séance |
| RM-EC02 | Le trésorier doit sélectionner les périodes couvertes |
| RM-EC03 | Le reçu est généré et envoyé automatiquement |
| RM-EC04 | La caisse est mise à jour immédiatement |
| RM-EC05 | L'opération est tracée dans le journal |

---

# 4. FLOW 2 : APPROBATION DES PAIEMENTS MOBILE MONEY

## 4.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: APPROBATION DES PAIEMENTS MOBILE MONEY             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Nouveau paiement│                                                       │
│  │  Mobile Money    │                                                       │
│  │  reçu"           │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    LISTE DES PAIEMENTS À APPROUVER               │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PAIEMENTS EN ATTENTE (5)                                │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 💰 50,000 XAF - MTN MoMo                               │    │      │
│  │  │    Réf: TXN123456789                                   │    │      │
│  │  │    Tél: +237 677 123 456                               │    │      │
│  │  │    Date: 15/03/2026 14:23                              │    │      │
│  │  │    [Examiner]                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ 💰 75,000 XAF - Orange Money                           │    │      │
│  │  │    Réf: OM987654321                                    │    │      │
│  │  │    Tél: +237 699 987 654                               │    │      │
│  │  │    Date: 15/03/2026 13:15                              │    │      │
│  │  │    [Examiner]                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ...                                                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Examiner]                         │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    EXAMEN DU PAIEMENT                            │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉTAILS DU PAIEMENT                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ 💰 Montant: 50,000 XAF                                  │    │      │
│  │  │ 📱 Opérateur: MTN Mobile Money                          │    │      │
│  │  │ 🔢 Référence: TXN123456789                              │    │      │
│  │  │ 📞 Téléphone émetteur: +237 677 123 456                 │    │      │
│  │  │ 📅 Date/Heure: 15/03/2026 à 14:23                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ IDENTIFICATION DU PAYEUR                                │    │      │
│  │  │                                                         │    │      │
│  │  │ 🔍 Recherche automatique par numéro de téléphone...    │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Membre trouvé: Jean KAMGA                           │    │      │
│  │  │    Téléphone enregistré: +237 677 123 456              │    │      │
│  │  │    Cotisation mensuelle: 50,000 XAF                    │    │      │
│  │  │    Statut: ⚠️ En retard (1 mois)                       │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Confirmer ce membre                                  │    │      │
│  │  │ ○ Sélectionner un autre membre                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ AFFECTATION DU PAIEMENT                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Type de paiement:                                      │    │      │
│  │  │ ● Cotisation régulière                                 │    │      │
│  │  │ ��� Remboursement prêt                                   │    │      │
│  │  │ ○ Paiement sanction                                    │    │      │
│  │  │ ○ Cotisation extraordinaire                            │    │      │
│  │  │ ○ Autre                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Période: [Mars 2026 ▼]                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Caisse destination: [Caisse principale ▼]              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATIONS                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Montant correspond à la cotisation (50,000 XAF)      │    │      │
│  │  │ ☑ Numéro de téléphone correspond au membre             │    │      │
│  │  │ ☑ Transaction non déjà enregistrée                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Rejeter]  [Approuver le paiement]                             │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ APPROUVER               REJETER │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ PAIEMENT APPROUVÉ │          │ ❌ PAIEMENT REJETÉ   │                │
│  │                      │          │                      │                │
│  │ • Cotisation         │          │ Motif du rejet:      │                │
│  │   enregistrée        │          │ [________________]   │                │
│  │                      │          │                      │                │
│  │ • Caisse mise à jour │          │ • Montant retourné   │                │
│  │                      │          │   à l'émetteur       │                │
│  │ • Reçu généré et     │          │   (si possible)      │                │
│  │   envoyé             │          │                      │                │
│  │                      │          │ • Notification       │                │
│  │ • Membre notifié     │          │   envoyée            │                │
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
| RM-AM01 | Les paiements Mobile Money sont détectés automatiquement via API |
| RM-AM02 | Le trésorier doit approuver manuellement chaque paiement |
| RM-AM03 | Le système recherche automatiquement le membre par numéro de téléphone |
| RM-AM04 | Le trésorier doit vérifier le montant, l'identité et la non-duplication |
| RM-AM05 | Un paiement rejeté doit être remboursé si possible |
| RM-AM06 | L'historique des approbations/rejets est conservé |

---

# 5. FLOW 3 : ENREGISTREMENT PAIEMENT PARTIEL

## 5.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ENREGISTREMENT PAIEMENT PARTIEL                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SÉLECTION DU MEMBRE                           │      │
│  │                                                                  │      │
│  │  👤 Membre sélectionné: Pierre FOTSO                            │      │
│  │                                                                  │      │
│  │  Cotisation mensuelle: 50,000 XAF                               │      │
│  │  Statut: ⚠️ En retard (1 mois)                                  │      │
│  │  Dû: 100,000 XAF (2 mois)                                       │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE PAIEMENT PARTIEL                   │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PAIEMENT PARTIEL                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant dû: 100,000 XAF                                │    │      │
│  │  │ Montant reçu: [30,000] XAF                             │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ Ce montant est inférieur à la cotisation mensuelle │    │      │
│  │  │    (50,000 XAF)                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Reste à payer après ce paiement: 70,000 XAF            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ AFFECTATION DU PAIEMENT                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Appliquer le paiement à:                               │    │      │
│  │  │ ● Plus ancienne dette d'abord (FIFO)                   │    │      │
│  │  │ ○ Mois en cours d'abord                                │    │      │
│  │  │ ○ Répartir proportionnellement                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Résultat:                                              ��    │      │
│  │  │ • Février 2026: 30,000 / 50,000 XAF (partiel)         │    │      │
│  │  │ • Mars 2026: 0 / 50,000 XAF (non couvert)             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Mode de paiement: [Espèces ▼]                                  │      │
│  │                                                                  │      │
│  │  Commentaire: (optionnel)                                       │      │
│  │  [Membre promet de compléter la semaine prochaine____]          │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer le paiement partiel]                   │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ PAIEMENT PARTIEL ENREGISTRÉ                │      │
│  │                                                                  │      │
│  │  • Montant enregistré: 30,000 XAF                               │      │
│  │  • Appliqué à: Février 2026 (partiel)                           │      │
│  │  • Reste à payer: 70,000 XAF                                    │      │
│  │  • Statut membre: ⚠️ Toujours en retard                        │      │
│  │                                                                  │      │
│  │  • Reçu généré (mentionnant paiement partiel)                   │      │
│  │  • Reçu envoyé au membre                                        │      │
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
| RM-PP01 | Les paiements partiels sont autorisés |
| RM-PP02 | Le trésorier choisit la méthode d'affectation (FIFO, courant, proportionnel) |
| RM-PP03 | Le reçu mentionne qu'il s'agit d'un paiement partiel |
| RM-PP04 | Le membre reste en retard tant que le solde n'est pas nul |

---

# 6. FLOW 4 : ENREGISTREMENT PAIEMENT EN AVANCE

## 6.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ENREGISTREMENT PAIEMENT EN AVANCE                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SÉLECTION DU MEMBRE                           │      │
│  │                                                                  │      │
│  │  👤 Membre sélectionné: Marie NGUEMO                            │      │
│  │                                                                  │      │
│  │  Cotisation mensuelle: 50,000 XAF                               │      │
│  │  Statut: ✅ À jour (payé jusqu'à Mars 2026)                     │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE PAIEMENT EN AVANCE                 │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PAIEMENT EN AVANCE                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Le membre est à jour.                                  │    │      │
│  │  │ Dernier mois payé: Mars 2026                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant reçu: [150,000] XAF                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Cela correspond à: 3 mois d'avance                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Périodes couvertes:                                    │    │      │
│  │  │ ☑ Avril 2026                                           │    │      │
│  │  │ ☑ Mai 2026                                             │    │      │
│  │  │ ☑ Juin 2026                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Nouveau statut: Payé jusqu'à Juin 2026                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Mode de paiement: [MTN Mobile Money ▼]                         │      │
│  │  Référence: [TXN789456123______________]                        │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer le paiement]                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ PAIEMENT EN AVANCE ENREGISTRÉ              │      │
│  │                                                                  │      │
│  │  • Montant enregistré: 150,000 XAF                              │      │
│  │  • Périodes couvertes: Avril, Mai, Juin 2026                    │      │
│  │  • Nouveau statut: Payé jusqu'à Juin 2026                       │      │
│  │                                                                  │      │
│  │  • Reçu généré                                                  │      │
│  │  • Reçu envoyé au membre                                        │      │
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
| RM-PA01 | Les paiements en avance sont autorisés |
| RM-PA02 | Le système calcule automatiquement les mois couverts |
| RM-PA03 | Le statut du membre est mis à jour avec la nouvelle date |
| RM-PA04 | Le membre ne recevra pas de rappels pour les mois payés d'avance |

---

# 7. FLOW 5 : GESTION DES CAISSES

## 7.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GESTION DES CAISSES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────��                                                       │
│  │ Trésorier accède │                                                       │
│  │ "Gestion des     │                                                       │
│  │  caisses"        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ÉTAT DES CAISSES                              │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 💵 CAISSE PRINCIPALE                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ Solde actuel: 2,450,000 XAF                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Ce mois:                                               │    │      │
│  │  │ • Entrées: +1,890,000 XAF (cotisations)               │    │      │
│  │  │ • Sorties: -1,350,000 XAF (distribution)              │    │      │
│  │  │ • Solde: +540,000 XAF                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir détails]  [Historique]                           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 🏥 CAISSE DE SECOURS                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ Solde actuel: 350,000 XAF                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Ce mois:                                               │    │      │
│  │  │ • Entrées: +45,000 XAF (prélèvement 5%)               │    │      │
│  │  │ • Sorties: -0 XAF                                      │    │      │
│  │  │ • Solde: +45,000 XAF                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir détails]  [Historique]                           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ⚙️ CAISSE DE FONCTIONNEMENT                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Solde actuel: 125,000 XAF                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Ce mois:                                               │    │      │
│  │  │ • Entrées: +90,000 XAF (frais adhésion)               │    │      │
│  │  │ • Sorties: -85,000 XAF (dépenses)                     │    │      │
│  │  │ • Solde: +5,000 XAF                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir détails]  [Historique]                           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TOTAL GÉNÉRAL: 2,925,000 XAF                           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Actions:                                                       │      │
│  │  [🔄 Transférer entre caisses]  [📊 Rapport consolidé]          │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7.2 Sous-Flow : Détails d'une Caisse

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: DÉTAILS D'UNE CAISSE                          │
├──────────────────────────────────────────────────────────��──────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CAISSE PRINCIPALE - DÉTAILS                   │      │
│  │                                                                  │      │
│  │  Solde: 2,450,000 XAF                                           │      │
│  │                                                                  │      │
│  │  Filtres: [Ce mois ▼] [Toutes opérations ▼]                     │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ Date       │ Opération        │ Entrée   │ Sortie  │Solde│   │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │ 15/03 15:30│ Cotisation KAMGA │ +150,000 │    -    │2.45M│   │      │
│  │  │ 15/03 15:00│ Distribution     │    -     │-1,350,000│2.30M│  │      │
│  │  │ 15/03 14:45│ Cotisation NGUEMO│ +50,000  │    -    │3.65M│   │      │
│  │  │ 15/03 14:30│ Cotisation FOTSO │ +50,000  │    -    │3.60M│   │      │
│  │  │ ...        │ ...              │ ...      │ ...     │ ... │   │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [📥 Exporter Excel]  [📄 Exporter PDF]                         │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-GC01 | Trois caisses par défaut : Principale, Secours, Fonctionnement |
| RM-GC02 | D'autres caisses peuvent être créées selon la configuration |
| RM-GC03 | Chaque mouvement est tracé avec date, montant, nature |
| RM-GC04 | Le solde est mis à jour en temps réel |
| RM-GC05 | L'historique est exportable en Excel et PDF |

---

# 8. FLOW 6 : TRANSFERT ENTRE CAISSES
# 🔵 FLOWS COMPLETS DU TRÉSORIER (SUITE)
## Application de Gestion de Tontine - Cameroun

---

# 8. FLOW 6 : TRANSFERT ENTRE CAISSES (Suite)

## 8.1 Diagramme de Flux (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: TRANSFERT ENTRE CAISSES (Suite)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE DE TRANSFERT                       │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TRANSFERT                                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Caisse source: [Caisse principale ▼]                   │    │      │
│  │  │ Solde disponible: 2,450,000 XAF                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Caisse destination: [Caisse de secours ▼]              │    │      │
│  │  │ Solde actuel: 350,000 XAF                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant à transférer: [100,000] XAF                    │    │      │
│  │  │                                                         │    │      │
│  │  │ Après transfert:                                       │    │      │
│  │  │ • Caisse principale: 2,350,000 XAF                     │    │      │
│  │  │ • Caisse de secours: 450,000 XAF                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ JUSTIFICATION (obligatoire)                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Motif du transfert:                                    │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Renforcement de la caisse de secours suite à   │    │    │      │
│  │  │ │ plusieurs demandes d'aide attendues ce mois.   │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ⚠️ Ce transfert nécessite la validation du Président           │      │
│  │     et du Commissaire aux Comptes.                              │      │
│  │                                                                  │      │
│  │  [Annuler]  [Soumettre pour validation]                         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DEMANDE DE VALIDATION                         │      │
│  │                                                                  │      │
│  │  📤 Notifications envoyées:                                     │      │
│  │  • Président                                                    │      │
│  │  • Commissaire aux Comptes                                      │      │
│  │                                                                  │      │
│  │  Statut: ⏳ En attente de validation                            │      │
│  │                                                                  │      │
│  │  Validations requises: 2/2                                      │      │
│  │  ○ Président: ⏳ En attente                                     │      │
│  │  ○ Commissaire aux Comptes: ⏳ En attente                       │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│              ┌────────────────────────────────────┐                         │
│              │       PROCESSUS DE VALIDATION      │                         │
│              └────────────────┬───────────────────┘                         │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    VALIDATION PRÉSIDENT                          │      │
│  │                                                                  │      │
│  │  Le Président examine la demande de transfert                   │      │
│  │                                                                  │      │
│  │  [Approuver]  [Refuser]                                         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Si approuvé                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    VALIDATION COMMISSAIRE AUX COMPTES            │      │
│  │                                                                  │      │
│  │  Le Commissaire examine la demande de transfert                 │      │
│  │                                                                  │      │
│  │  [Approuver]  [Refuser]                                         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ TOUS APPROUVENT          REFUS  │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ TRANSFERT EFFECTUÉ│          │ ❌ TRANSFERT REFUSÉ  │                │
│  │                      │          │                      │                │
│  │ • Caisse source      │          │ • Notification au    │                │
│  │   débitée            │          │   trésorier          │                │
│  │                      │          │                      │                │
│  │ • Caisse destination │          │ • Motif du refus     │                │
│  │   créditée           │          │   communiqué         │                │
│  │                      │          │                      │                │
│  │ • Historique mis     │          │ • Aucun mouvement    │                │
│  │   à jour             │          │   effectué           │                │
│  │                      │          │                      │                │
│  │ • Journal d'audit    │          │                      │                │
│  │   enregistré         │          │                      │                │
│  │                      │          │                      │                │
│  │ • Notification au    │          │                      │                │
│  │   trésorier          │          │                      │                │
│  └──────────────────────┘          └──────────────────────┘                │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             ��
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-TC01 | Tous les transferts entre caisses nécessitent une validation |
| RM-TC02 | Double validation requise : Président + Commissaire aux Comptes |
| RM-TC03 | La justification est obligatoire |
| RM-TC04 | Le transfert n'est effectué qu'après toutes les validations |
| RM-TC05 | L'opération est tracée dans le journal d'audit |
| RM-TC06 | Le trésorier est notifié du résultat (approbation ou refus) |

---

# 9. FLOW 7 : ENREGISTREMENT D'UNE DÉPENSE

## 9.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ENREGISTREMENT D'UNE DÉPENSE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Trésorier clique │                                                       │
│  │ "Nouvelle        │                                                       │
│  │  dépense"        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE DE DÉPENSE                         │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS DE LA DÉPENSE                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Catégorie:                                             │    │      │
│  │  │ ○ Location de salle                                    │    │      │
│  │  │ ● Fournitures                                          │    │      │
│  │  │ ○ Transport                                            │    │      │
│  │  │ ○ Restauration                                         │    │      │
│  │  │ ○ Communication                                        │    │      │
│  │  │ ○ Autre                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Intitulé: [Achat de cahiers et stylos pour le bureau_] │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant: [25,000] XAF                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Date de la dépense: [15/03/2026]                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Bénéficiaire/Fournisseur: [Librairie FOTSO____________]│    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ JUSTIFICATIF (obligatoire)                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Type de justificatif:                                  │    │      │
│  │  │ ○ Facture                                              │    │      │
│  │  │ ● Reçu                                                 │    │      │
│  │  │ ○ Ticket de caisse                                     │    │      │
│  │  │ ○ Autre                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Fichier: [📎 recu_librairie.pdf]  [Parcourir...]       │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CAISSE                                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Caisse à débiter: [Caisse de fonctionnement ▼]         │    │      │
│  │  │ Solde disponible: 125,000 XAF                          │    │      │
│  │  │ Solde après dépense: 100,000 XAF                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VALIDATION                                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Plafond sans validation: 50,000 XAF                    │    │      │
│  │  │ Montant de la dépense: 25,000 XAF                      │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Cette dépense ne nécessite pas de validation        │    │      │
│  │  │    (montant < plafond)                                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer la dépense]                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│                   ┌───────────────────────┐                                 │
│                   │ Montant > Plafond ?   │                                 │
│                   └───────────┬───────────┘                                 │
│                               │                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ NON                         OUI │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ DÉPENSE           │          │ ⏳ EN ATTENTE        │                │
│  │    ENREGISTRÉE       │          │    VALIDATION        │                │
│  │                      │          │                      │                │
│  │ • Caisse débitée     │          │ • Notifications      │                │
│  │ • Historique mis     │          │   envoyées:          │                │
│  │   à jour             │          │   - Président        │                │
│  │ • Justificatif       │          │   - Commissaire      │                │
│  │   archivé            │          │                      │                │
│  │                      │          │ • Dépense en attente │                │
│  │                      │          │ • Caisse non débitée │                │
│  │                      │          │   (pour l'instant)   │                │
│  └──────────────────────┘          └──────────────────────┘                │
│                                             │                               │
│                                             ▼                               │
│                               ┌──────────────────────────┐                  │
│                               │ PROCESSUS DE VALIDATION  │                  │
│                               │ (Président + Commissaire)│                  │
│                               └──────────────────────────┘                  │
│                                             │                               │
│                        ┌────────────────────┴────────────────────┐          │
│                        │ TOUS APPROUVENT              REFUS      │          │
│                        ▼                                         ▼          │
│           ┌──────────────────────┐              ┌──────────────────────┐   │
│           │ ✅ DÉPENSE VALIDÉE   │              │ ❌ DÉPENSE REFUSÉE   │   │
│           │                      │              │                      │   │
│           │ • Caisse débitée     │              │ • Notification au    │   │
│           │ • Historique mis     │              │   trésorier          │   │
│           │   à jour             │              │ • Motif du refus     │   │
│           │ • Justificatif       │              │ • Aucun mouvement    │   │
│           │   archivé            │              │                      │   │
│           └──────────────────────┘              └──────────────────────┘   │
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
| RM-DE01 | Le justificatif est obligatoire pour toutes les dépenses |
| RM-DE02 | Les dépenses > plafond nécessitent validation Président + Commissaire |
| RM-DE03 | Le plafond est configurable par tontine |
| RM-DE04 | Les dépenses sont catégorisées (salle, fournitures, transport, etc.) |
| RM-DE05 | Le justificatif est archivé et consultable par le Commissaire |
| RM-DE06 | L'opération est tracée dans le journal d'audit |

---

# 10. FLOW 8 : DISTRIBUTION DE LA CAGNOTTE

## 10.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: DISTRIBUTION DE LA CAGNOTTE                        │
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
│  │ Trésorier clique │                                                       │
│  │ "Distribution    │                                                       │
│  │  cagnotte"       │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    VÉRIFICATION CONTEXTE                         │      │
│  │                                                                  │      │
│  │  Séance en cours: #8 - 15 Mars 2026                             │      │
│  │  Statut: ✅ Séance active                                        │      │
│  │                                                                  │      │
│  │  ⚠️ La distribution ne peut se faire que pendant une séance.   │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌───────────────────────────────────────────────────���──────────────┐      │
│  │                    INFORMATIONS DE DISTRIBUTION                  │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ BÉNÉFICIAIRE                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Paul NGOUFACK                                        │    │      │
│  │  │    Ordre de tour: #8                                    │    │      │
│  │  │    Statut cotisations: ✅ À jour                        │    │      │
│  │  │    Mobile Money: +237 677 888 999 (MTN)                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CALCUL DE LA CAGNOTTE                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Cotisations collectées (séance): 1,800,000 XAF         │    │      │
│  │  │ Cotisations en retard récupérées: 150,000 XAF          │    │      │
│  │  │ Total brut: 1,950,000 XAF                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Prélèvements:                                          │    │      │
│  │  │ • Caisse de secours (5%): -97,500 XAF                  │    │      │
│  │  │ • Frais de fonctionnement: -50,000 XAF                 │    │      │
│  │  │                                                         │    │      │
│  │  │ ═══════════════════════════════════════                │    │      │
│  │  │ MONTANT NET À DISTRIBUER: 1,802,500 XAF                │    │      │
│  │  │ ═══════════════════════════════════════                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MODE DE DISTRIBUTION                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Espèces                                              │    │      │
│  │  │ ● MTN Mobile Money                                      │    │      │
│  │  │ ○ Orange Money                                          │    │      │
│  │  │ ○ Virement bancaire                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Numéro destinataire: +237 677 888 999                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Procéder à la distribution]                        │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIRMATION DU BÉNÉFICIAIRE                  │      │
│  │                                                                  │      │
│  │  Le bénéficiaire doit confirmer la réception.                   │      │
│  │                                                                  │      │
│  │  Méthode de confirmation:                                       │      │
│  │  ○ Signature électronique (tablette/téléphone)                  │      │
│  │  ● Code OTP envoyé par SMS                                       │      │
│  │  ○ Confirmation sur son application mobile                       │      │
│  │                                                                  │      │
│  │  [Envoyer le code OTP]                                          │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CODE OTP ENVOYÉ                               │      │
│  │                                                                  │      │
│  │  📱 Un code OTP a été envoyé au +237 677 888 999                │      │
│  │                                                                  │      │
│  │  Code saisi par le bénéficiaire: [______]                       │      │
│  │                                                                  │      │
│  │  [Renvoyer le code]  [Valider]                                  │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Code validé                                 │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SIGNATURE ÉLECTRONIQUE                        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ZONE DE SIGNATURE                                       │    │      │
│  │  │                                                         │    │      │
│  │  │  ┌─────────────────────────────────────────────────┐   │    │      │
│  │  │  │                                                 │   │    │      │
│  │  │  │         [Zone de dessin tactile]               │   │    │      │
│  │  │  │              Paul NGOUFACK                      │   │    │      │
│  │  │  │                   ~~~~~~~~~~~                   │   │    │      │
│  │  │  │                                                 │   │    │      │
│  │  │  └─────────────────────────────────────────────────┘   │    │      │
│  │  │                                                         │    │      │
│  │  │  [Effacer]                                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ☑ Je confirme avoir reçu la somme de 1,802,500 XAF            │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer la réception]                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    EXÉCUTION DU PAIEMENT                         │      │
│  │                                                                  │      │
│  │  Mode: MTN Mobile Money                                         │      │
│  │  Montant: 1,802,500 XAF                                         │      │
│  │  Destinataire: +237 677 888 999                                 │      │
│  │                                                                  │      │
│  │  ⏳ Transfert en cours...                                       │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ DISTRIBUTION EFFECTUÉE                     │      │
│  │                                                                  │      │
│  │  • Montant distribué: 1,802,500 XAF                             │      │
│  │  • Bénéficiaire: Paul NGOUFACK                                  │      │
│  │  • Mode: MTN Mobile Money                                       │      │
│  │  • Référence: TXN987654321                                      │      │
│  │                                                                  │      ��
│  │  • Caisse principale débitée                                    │      │
│  │  • Caisse de secours créditée (+97,500 XAF)                     │      │
│  │  • Caisse fonctionnement créditée (+50,000 XAF)                 │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 🧾 REÇU DE DISTRIBUTION N° 2026-03-D008                │    │      │
│  │  │                                                         │    │      │
│  │  │ Bénéficiaire: Paul NGOUFACK                            │    │      │
│  │  │ Montant: 1,802,500 XAF                                 │    │      │
│  │  │ Date: 15 Mars 2026 à 16:00                             │    │      │
│  │  │ Séance: #8                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Signature bénéficiaire: [Signature]                    │    │      │
│  │  │ Signature trésorier: [Signature]                       │    │      │
│  │  │                                                         │    │      │
│  │  │ [📥 Télécharger]  [🖨️ Imprimer]  [📤 Envoyer]         │    │      │
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

## 10.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-DC01 | La distribution ne peut se faire que pendant une séance active |
| RM-DC02 | Le bénéficiaire est déterminé par l'ordre de distribution |
| RM-DC03 | Les prélèvements (secours, fonctionnement) sont automatiques |
| RM-DC04 | Le bénéficiaire doit confirmer via OTP + signature électronique |
| RM-DC05 | Un reçu est généré et envoyé automatiquement |
| RM-DC06 | Le paiement peut être fait en espèces ou via Mobile Money |

---

# 11. FLOW 9 : DÉCAISSEMENT D'UN PRÊT

## 11.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: DÉCAISSEMENT D'UN PRÊT                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Prêt approuvé   │                                                       │
│  │  à décaisser"    │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    LISTE DES PRÊTS À DÉCAISSER                   │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PRÊTS APPROUVÉS EN ATTENTE DE DÉCAISSEMENT (2)          │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 💰 Jean KAMGA                                           │    │      │
│  │  │    Montant: 200,000 XAF                                │    │      │
│  │  │    Approuvé le: 14/03/2026                             │    │      │
│  │  │    [Décaisser]                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 💰 Marie NGUEMO                                         │    │      │
│  │  │    Montant: 150,000 XAF                                │    │      │
│  │  │    Approuvé le: 13/03/2026                             │    │      │
│  │  │    [Décaisser]                                         │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Décaisser]                        │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉTAILS DU PRÊT                               │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS DU PRÊT                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Emprunteur: Jean KAMGA                               │    │      │
│  │  │ 💰 Montant emprunté: 200,000 XAF                        │    │      │
│  │  │ 📈 Taux d'intérêt: 5%                                   │    │      │
│  │  │ 💵 Intérêts: 10,000 XAF                                 │    │      │
│  │  │ 💰 Total à rembourser: 210,000 XAF                      │    │      │
│  │  │ 📅 Durée: 3 mois                                        │    │      │
│  │  │ 📆 Échéances: 70,000 XAF / mois                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 👥 Garants:                                             │    │      │
│  │  │ • Pierre FOTSO (validé)                                │    │      │
│  │  │ • Anne MBARGA (validé)                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Approuvé par: Bureau (14/03/2026)                   │    │      │
│  │  └───────────────────────────────��─────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ÉCHÉANCIER DE REMBOURSEMENT                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Échéance 1: 15/04/2026 - 70,000 XAF                    │    │      │
│  │  │ Échéance 2: 15/05/2026 - 70,000 XAF                    │    │      │
│  │  │ Échéance 3: 15/06/2026 - 70,000 XAF                    │    │      │
│  │  │ ─────────────────────────────────────                  │    │      │
│  │  │ Total: 210,000 XAF                                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ⚠️ Ce décaissement nécessite la validation du Président        │      │
│  │     et du Commissaire aux Comptes.                              │      │
│  │                                                                  │      │
│  │  [Annuler]  [Soumettre pour validation et décaissement]         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────��───────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PROCESSUS DE VALIDATION                       │      │
│  │                                                                  │      │
│  │  Validations requises: 2/2                                      │      │
│  │  ○ Président: ⏳ En attente                                     │      │
│  │  ○ Commissaire aux Comptes: ⏳ En attente                       │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ TOUS APPROUVENT          REFUS  │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ DÉCAISSEMENT         │          │ ❌ DÉCAISSEMENT      │                │
│  │                      │          │    REFUSÉ            │                │
│  │ Mode de paiement:    │          │                      │                │
│  │ ○ Espèces            │          │ • Notification à     │                │
│  │ ● MTN Mobile Money   │          │   l'emprunteur       │                │
│  │ ○ Orange Money       │          │ • Motif du refus     │                │
│  │ ○ Virement           │          │                      │                │
│  │                      │          │                      │                │
│  │ [Effectuer paiement] │          │                      │                │
│  └──────────┬───────────┘          └──────────────────────┘                │
│             │                                                               │
│             ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ PRÊT DÉCAISSÉ                              │      │
│  │                                                                  │      │
│  │  • Montant décaissé: 200,000 XAF                                │      │
│  │  • Bénéficiaire: Jean KAMGA                                     │      │
│  │  • Mode: MTN Mobile Money                                       │      │
│  │  • Référence: TXN456789123                                      │      │
│  │                                                                  │      │
│  │  • Caisse principale débitée                                    │      │
│  │  • Prêt activé dans le système                                  │      │
│  │  • Échéancier activé                                            │      │
│  │  • Notifications envoyées (emprunteur + garants)                │      │
│  │  • Rappels programmés avant chaque échéance                     │      │
│  │                                                                  │      │
│  │  • Reçu de prêt généré et envoyé                                │      │
│  │                                                                  │      │
│  └────────────────────────────────────────────────────────────────��─┘      │
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
| RM-DP01 | Le décaissement nécessite validation Président + Commissaire |
| RM-DP02 | L'échéancier est généré automatiquement |
| RM-DP03 | Les garants sont notifiés du décaissement |
| RM-DP04 | Des rappels sont programmés avant chaque échéance |
| RM-DP05 | Le prêt est activé et les remboursements sont suivis |

---

# 12. FLOW 10 : ENREGISTREMENT REMBOURSEMENT PRÊT

## 12.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ENREGISTREMENT REMBOURSEMENT PRÊT                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Trésorier clique │                                                       │
│  │ "Remboursement   │                                                       │
│  │  prêt"           │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    LISTE DES PRÊTS EN COURS                      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PRÊTS ACTIFS (8)                                        │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Jean KAMGA                                           │    │      │
│  │  │    Restant dû: 140,000 XAF                             │    │      │
│  │  │    Prochaine échéance: 15/04/2026 (70,000 XAF)         │    │      │
│  │  │    Statut: ✅ À jour                                   │    │      │
│  │  │    [Enregistrer remboursement]                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Marie NGUEMO                                         │    │      │
│  │  │    Restant dû: 150,000 XAF                             │    │      │
│  │  │    Prochaine échéance: 13/04/2026 (50,000 XAF)         │    │      │
│  │  │    Statut: ⚠️ Échéance proche (3 jours)                │    │      │
│  │  │    [Enregistrer remboursement]                         │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Pierre FOTSO                                         │    │      │
│  │  │    Restant dû: 80,000 XAF                              │    │      │
│  │  │    Prochaine échéance: 01/03/2026 (40,000 XAF)         │    │      │
│  │  │    Statut: ❌ En retard (14 jours)                     │    │      │
│  │  │    [Enregistrer remboursement]                         │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Enregistrer remboursement]        │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE DE REMBOURSEMENT                   │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SITUATION DU PRÊT                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Emprunteur: Jean KAMGA                               │    │      │
│  │  │ 💰 Montant initial: 200,000 XAF                         │    │      │
│  │  │ 💵 Déjà remboursé: 70,000 XAF                           │    │      │
│  │  │ 💰 Restant dû: 140,000 XAF                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Échéancier:                                            │    │      │
│  │  │ ✅ Échéance 1: 15/03/2026 - 70,000 XAF (payé)          │    │      │
│  │  │ ⏳ Échéance 2: 15/04/2026 - 70,000 XAF (en attente)    │    │      │
│  │  │ ⏳ Échéance 3: 15/05/2026 - 70,000 XAF (en attente)    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ REMBOURSEMENT                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant de l'échéance: 70,000 XAF                      │    │      │
│  │  │ Montant reçu: [70,000] XAF                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Type:                                                  │    │      │
│  │  │ ● Échéance complète                                    │    │      │
│  │  │ ○ Remboursement partiel                                │    │      │
│  │  │ ○ Remboursement anticipé (solder le prêt)              │    │      │
│  │  │                                                         │    │      │
│  │  │ Mode de paiement:                                      │    │      │
│  │  │ ○ Espèces                                              │    │      │
│  │  │ ● MTN Mobile Money                                      │    │      │
│  │  │ ○ Orange Money                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ Référence: [TXN111222333__________]                    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer le remboursement]                      │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌─────────────────────────────────────��────────────────────────────┐      │
│  │                    ✅ REMBOURSEMENT ENREGISTRÉ                   │      │
│  │                                                                  │      │
│  │  • Montant enregistré: 70,000 XAF                               │      │
│  │  • Échéance 2 marquée comme payée                               │      │
│  │  • Nouveau restant dû: 70,000 XAF                               │      │
│  │  • Prochaine échéance: 15/05/2026                               │      │
│  │                                                                  │      │
│  │  • Caisse principale créditée (+70,000 XAF)                     │      │
│  │  • Reçu de remboursement généré et envoyé                       │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 12.2 Sous-Flow : Remboursement Partiel

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: REMBOURSEMENT PARTIEL                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    REMBOURSEMENT PARTIEL                         │      │
│  │                                                                  │      │
│  │  Échéance attendue: 70,000 XAF                                  │      │
│  │  Montant reçu: [40,000] XAF                                     │      │
│  │                                                                  │      │
│  │  ⚠️ Ce montant est inférieur à l'échéance attendue.            │      │
│  │                                                                  │      │
│  │  Reste à payer pour cette échéance: 30,000 XAF                  │      │
│  │                                                                  │      │
│  │  Commentaire: (optionnel)                                       │      │
│  │  [Le membre complétera la semaine prochaine__________]          │      │
│  │                                                                  │      │
│  │  ⚠️ Note: Le censeur sera notifié si l'échéance n'est pas      │      │
│  │     complétée à temps pour application éventuelle de pénalité. │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer le paiement partiel]                   │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 12.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-RP01 | Les remboursements partiels sont autorisés |
| RM-RP02 | Le trésorier reçoit des alertes pour les échéances à venir |
| RM-RP03 | Les pénalités de retard sont appliquées par le censeur (pas le trésorier) |
| RM-RP04 | Un reçu est généré pour chaque remboursement |
| RM-RP05 | Le prêt est automatiquement soldé quand tout est remboursé |

---
# 🔵 FLOWS COMPLETS DU TRÉSORIER (FIN)
## Application de Gestion de Tontine - Cameroun

---

# 13. FLOW 11 : ENCAISSEMENT DES SANCTIONS (Suite)

## 13.1 Diagramme de Flux (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ENCAISSEMENT DES SANCTIONS (Suite)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌────────────────────��─────────────────────────────────────────────┐      │
│  │                    FORMULAIRE D'ENCAISSEMENT SANCTION            │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PAIEMENT                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant reçu: [10,000] XAF                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Mode de paiement:                                      │    │      │
│  │  │ ● Espèces                                              │    │      │
│  │  │ ○ MTN Mobile Money                                      │    │      │
│  │  │ ○ Orange Money                                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Caisse destination: [Caisse de fonctionnement ▼]               │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer le paiement]                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ SANCTION ENCAISSÉE                         │      │
│  │                                                                  │      │
│  │  • Montant encaissé: 10,000 XAF                                 │      │
│  │  • Sanction marquée comme payée                                 │      │
│  │  • Caisse de fonctionnement créditée (+10,000 XAF)              │      │
│  │                                                                  │      │
│  │  • Notification envoyée au Censeur                              │      │
│  │  • Reçu de paiement généré et envoyé au membre                  │      │
│  │  • Historique mis à jour                                        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 🧾 REÇU N° 2026-03-S015                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Membre: Jean KAMGA                                      │    │      │
│  │  │ Objet: Paiement sanction - Absence séance #7           │    │      │
│  │  │ Montant: 10,000 XAF                                    │    │      │
│  │  │ Date: 15 Mars 2026 à 15:45                             │    │      │
│  │  │                                                         │    │      │
│  │  │ [📥 Télécharger]  [🖨️ Imprimer]  [📤 Envoyer]         │    │      │
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

## 13.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-ES01 | Le trésorier reçoit une notification pour chaque nouvelle sanction |
| RM-ES02 | Les sanctions sont encaissées dans la caisse de fonctionnement (configurable) |
| RM-ES03 | Le censeur est notifié du paiement de la sanction |
| RM-ES04 | Un reçu est généré et envoyé automatiquement au membre |

---

# 14. FLOW 12 : REMBOURSEMENT SANCTION ANNULÉE

## 14.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: REMBOURSEMENT SANCTION ANNULÉE                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Sanction        │                                                       │
│  │  annulée -       │                                                       │
│  │  Remboursement   │                                                       │
│  │  requis"         │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉTAILS DU REMBOURSEMENT                      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SANCTION ANNULÉE                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Membre: Pierre FOTSO                                 │    │      │
│  │  │ ⚖️ Type: Retard                                        │    │      │
│  │  │ 📅 Séance: #8 - 15 Mars 2026                           │    │      │
│  │  │ 💰 Montant payé: 500 XAF                               │    │      │
│  │  │ 📅 Date paiement: 15/03/2026                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ❌ Annulée par: Censeur (contestation acceptée)        │    │      │
│  │  │ 📅 Date annulation: 16/03/2026                         │    │      │
│  │  │ 📝 Motif: Erreur de pointage confirmée                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ REMBOURSEMENT                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant à rembourser: 500 XAF                          │    │      │
│  │  │                                                         │    │      │
│  │  │ Mode de remboursement:                                 │    │      │
│  │  │ ○ Espèces                                              │    │      │
│  │  │ ● MTN Mobile Money                                      │    │      │
│  │  │ ○ Orange Money                                          │    │      │
│  │  │ ○ Crédit sur prochaine cotisation                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Numéro: +237 699 123 456                               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Caisse source: [Caisse de fonctionnement ▼]                    │      │
│  │  Solde disponible: 125,000 XAF                                  │      │
│  │                                                                  │      │
│  │  [Reporter]  [Effectuer le remboursement]                       │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    EXÉCUTION DU REMBOURSEMENT                    │      │
│  │                                                                  │      │
│  │  Mode: MTN Mobile Money                                         │      │
│  │  Montant: 500 XAF                                               │      │
│  │  Destinataire: +237 699 123 456                                 │      │
│  │                                                                  │      │
│  │  ⏳ Transfert en cours...                                       │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ REMBOURSEMENT EFFECTUÉ                     │      │
│  │                                                                  │      │
│  │  • Montant remboursé: 500 XAF                                   │      │
│  │  • Bénéficiaire: Pierre FOTSO                                   │      │
│  │  • Mode: MTN Mobile Money                                       │      │
│  │  • Référence: TXN321654987                                      │      │
│  │                                                                  │      │
│  │  • Caisse de fonctionnement débitée (-500 XAF)                  │      │
│  │  • Notification envoyée au membre                               │      │
│  │  • Notification envoyée au Censeur                              │      │
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

## 14.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-RS01 | Le trésorier est notifié automatiquement quand une sanction payée est annulée |
| RM-RS02 | Le remboursement peut être fait en espèces, Mobile Money ou crédit |
| RM-RS03 | Le remboursement est tracé dans l'historique |
| RM-RS04 | Le membre et le censeur sont notifiés du remboursement |

---

# 15. FLOW 13 : GESTION COTISATION EXTRAORDINAIRE

## 15.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GESTION COTISATION EXTRAORDINAIRE                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Cotisation      │                                                       │
│  │  extraordinaire  │                                                       │
│  │  lancée"         │                                                       │
│  │ (par Président)  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    COTISATION EXTRAORDINAIRE EN COURS            │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ 📋 Motif: Décès du père de M. Paul BIYA                │    │      │
│  │  │ 👤 Bénéficiaire: Paul BIYA                              │    │      │
│  │  │ 💰 Montant par membre: 5,000 XAF                        │    │      │
│  │  │ 👥 Nombre de membres: 45                                │    │      │
│  │  │ 💵 Total attendu: 225,000 XAF                           │    │      │
│  │  │ 📅 Date limite: 20 Mars 2026                            │    │      │
│  │  │ 🚀 Lancée par: Président (M. FOTSO) le 10/03/2026      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ÉTAT DE LA COLLECTE                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Progression: ████████████████░░░░ 80%                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Collecté: 180,000 / 225,000 XAF                        │    │      │
│  │  │ Membres ayant payé: 36 / 45                            │    │      │
│  │  │ Restant: 45,000 XAF (9 membres)                        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SUIVI PAR MEMBRE                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Payé (36):                                          │    │      │
│  │  │    Jean KAMGA, Marie NGUEMO, Pierre FOTSO...           │    │      │
│  │  │    [Voir tous]                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ ⏳ Non payé (9):                                        │    │      │
│  │  │ • Anne MBARGA - [Enregistrer paiement]                 │    │      │
│  │  │ • Robert TCHANA - [Enregistrer paiement]               │    │      │
│  │  │ • Claire ESSOMBA - [Enregistrer paiement]              │    │      │
│  │  │ • ...                                                   │    │      │
│  │  │    [Voir tous]  [Envoyer rappel groupé]                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Actions:                                                       │      │
│  │  [Enregistrer un paiement]  [Envoyer rappels]                   │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 15.2 Sous-Flow : Enregistrement Paiement Cotisation Extraordinaire

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              SOUS-FLOW: PAIEMENT COTISATION EXTRAORDINAIRE                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE DE PAIEMENT                        │      │
│  │                                                                  │      │
│  │  Cotisation: Décès du père de M. Paul BIYA                      │      │
│  │  👤 Membre: Anne MBARGA                                          │      │
│  │  💰 Montant attendu: 5,000 XAF                                   │      │
│  │                                                                  │      │
│  │  Montant reçu: [5,000] XAF                                      │      │
│  │                                                                  │      │
│  │  Mode de paiement:                                              │      │
│  │  ● Espèces                                                      │      │
│  │  ○ MTN Mobile Money                                              │      │
│  │  ○ Orange Money                                                  │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer]                                       │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ PAIEMENT ENREGISTRÉ                        │      │
│  │                                                                  │      │
│  │  • Membre: Anne MBARGA - Payé                                   │      │
│  │  • Progression: 37/45 membres (82%)                             │      │
│  │  • Collecté: 185,000 / 225,000 XAF                              │      │
│  │  • Reçu envoyé au membre                                        │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 15.3 Sous-Flow : Clôture et Distribution

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              SOUS-FLOW: CLÔTURE ET DISTRIBUTION                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CLÔTURE PAR LE PRÉSIDENT                      │      │
│  │                                                                  │      │
│  │  ⚠️ Seul le Président peut clôturer la cotisation.             │      │
│  │                                                                  │      │
│  │  Date limite atteinte: 20 Mars 2026                             │      │
│  │  Collecté: 220,000 / 225,000 XAF (98%)                          │      │
│  │  Non payé: 1 membre (5,000 XAF)                                 │      │
│  │                                                                  │      │
│  │  Le Président clôture la collecte.                              │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    🔔 NOTIFICATION AU TRÉSORIER                  │      │
│  │                                                                  │      │
│  │  "Cotisation extraordinaire clôturée - Distribuer"              │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌─────────────────────────────────────────────────────��────────────┐      │
│  │                    DISTRIBUTION AU BÉNÉFICIAIRE                  │      │
│  │                                                                  │      │
│  │  👤 Bénéficiaire: Paul BIYA                                     │      │
│  │  💰 Montant collecté: 220,000 XAF                               │      │
│  │  📋 Motif: Décès du père                                        │      │
│  │                                                                  │      │
│  │  Mode de distribution:                                          │      │
│  │  ○ Espèces                                                      │      │
│  │  ● MTN Mobile Money                                              │      │
│  │  ○ Orange Money                                                  │      │
│  │                                                                  │      │
│  │  Numéro: +237 677 555 444                                       │      │
│  │                                                                  │      │
│  │  [Effectuer la distribution]                                    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌────────────────────────────────────────────────────────��─────────┐      │
│  │                    ✅ DISTRIBUTION EFFECTUÉE                     │      │
│  │                                                                  │      │
│  │  • Montant distribué: 220,000 XAF                               │      │
│  │  • Bénéficiaire: Paul BIYA                                      │      │
│  │  • Mode: MTN Mobile Money                                       │      │
│  │  • Référence: TXN777888999                                      │      │
│  │                                                                  │      │
│  │  • Cotisation extraordinaire marquée comme terminée             │      │
│  │  • Reçu de distribution envoyé au bénéficiaire                  │      │
│  │  • Tous les membres notifiés                                    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 15.4 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-CE01 | Seul le Président peut lancer une cotisation extraordinaire |
| RM-CE02 | Le trésorier gère la collecte et le suivi |
| RM-CE03 | Seul le Président peut clôturer la collecte |
| RM-CE04 | Les membres non payés sont traités selon les statuts |
| RM-CE05 | Le trésorier effectue la distribution après clôture |

---

# 16. FLOW 14 : GÉNÉRATION DU BILAN DE SÉANCE

## 16.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GÉNÉRATION DU BILAN DE SÉANCE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  │(Pendant  │                                                               │
│  │ séance)  │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─��────────────────┐                                                       │
│  │ Trésorier clique │                                                       │
│  │ "Bilan de        │                                                       │
│  │  séance"         │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    BILAN GÉNÉRÉ AUTOMATIQUEMENT                  │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ BILAN FINANCIER - SÉANCE #8                             │    │      │
│  │  │ 15 Mars 2026                                            │    │      │
│  │  │ Tontine: [Nom de la Tontine]                            │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 💰 ENTRÉES                                              │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Cotisations régulières:        1,800,000 XAF           │    │      │
│  │  │ Cotisations arriérés:            150,000 XAF           │    │      │
│  │  │ Remboursements prêts:             70,000 XAF           │    │      │
│  │  │ Sanctions:                        12,500 XAF           │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ TOTAL ENTRÉES:                 2,032,500 XAF           │    │      │
│  │  │                                                         │    │      │
│  │  │ 💸 SORTIES                                              │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Distribution cagnotte:         1,802,500 XAF           │    │      │
│  │  │ Prélèvement caisse secours:       97,500 XAF           │    │      │
│  │  │ Prélèvement fonctionnement:       50,000 XAF           │    │      │
│  │  │ Décaissement prêt (Jean KAMGA):  200,000 XAF           │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ TOTAL SORTIES:                 2,150,000 XAF           │    │      │
│  │  │                                                         │    │      │
│  │  │ 📊 SOLDE DE LA SÉANCE                                   │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Entrées - Sorties:              -117,500 XAF           │    │      │
│  │  │ (Déficit couvert par solde caisse principale)          │    │      │
│  │  │                                                         │    │      │
│  │  │ 🏦 ÉTAT DES CAISSES APRÈS SÉANCE                        │    │      │
│  │  │ ──────────────────���──────────────────────────────       │    │      │
│  │  │ Caisse principale:             2,332,500 XAF           │    │      │
│  │  │ Caisse de secours:               447,500 XAF           │    │      │
│  │  │ Caisse de fonctionnement:        187,500 XAF           │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ TOTAL GÉNÉRAL:                 2,967,500 XAF           │    │      │
│  │  │                                                         │    │      │
│  │  │ 📋 DÉTAILS SUPPLÉMENTAIRES                              │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Membres ayant cotisé: 38/45                            │    │      │
│  │  │ Cotisations en retard: 7 membres (350,000 XAF)         │    │      │
│  │  │ Prêts actifs: 8 (1,130,000 XAF)                        │    │      │
│  │  │ Prêts en retard: 2 (180,000 XAF)                       │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ⚠️ Ce bilan doit être présenté et signé pendant la séance.    │      │
│  │                                                                  │      │
│  │  [Modifier]  [Prévisualiser PDF]  [Soumettre pour signature]    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SIGNATURE DU BILAN                            │      │
│  │                                                                  │      │
│  │  Le bilan doit être signé par:                                  │      │
│  │  1. Le Trésorier                                                │      │
│  │  2. Le Président                                                │      │
│  │                                                                  │      │
│  │  ┌──────────────────────────────────��──────────────────────┐    │      │
│  │  │ SIGNATURE TRÉSORIER                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Code OTP envoyé au +237 677 XXX XXX: [______]          │    │      │
│  │  │                                                         │    │      │
│  │  │ Signature:                                             │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │         [Zone de dessin tactile]               │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ [Signer]                                               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Signature Trésorier OK                      │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    📤 ENVOYÉ AU PRÉSIDENT                        │      │
│  │                                                                  │      │
│  │  Le Président doit maintenant signer le bilan.                  │      │
│  │                                                                  │      │
│  │  Statut: ⏳ En attente de signature du Président               │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Signature Président OK                      │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ BILAN VALIDÉ                               │      │
│  │                                                                  │      │
│  │  • Bilan signé par le Trésorier et le Président                 │      │
│  │  • Intégré au PV de la séance                                   │      │
│  │  • PDF archivé                                                  │      │
│  │  • Accessible au Commissaire aux Comptes                        │      │
│  │                                                                  │      │
│  │  [📥 Télécharger PDF]  [🖨️ Imprimer]                           │      │
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
| RM-BS01 | Le bilan est généré automatiquement |
| RM-BS02 | Il doit être présenté pendant la séance |
| RM-BS03 | Double signature requise : Trésorier + Président |
| RM-BS04 | Le bilan est intégré au PV du Secrétaire |
| RM-BS05 | Le Commissaire aux Comptes y a accès |

---

# 17. FLOW 15 : GÉNÉRATION DES RAPPORTS

## 17.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GÉNÉRATION DES RAPPORTS                            │
├──────────────���──────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Trésorier clique │                                                       │
│  │ "Rapports"       │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    TYPES DE RAPPORTS                             │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RAPPORTS DISPONIBLES                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ 📊 Bilan de séance                                      │    │      │
│  │  │    Rapport financier d'une séance spécifique           │    │      │
│  │  │    [Générer]                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ 📈 Bilan mensuel                                        │    │      │
│  │  │    Synthèse financière du mois                         │    │      │
│  │  │    [Générer]                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ 📉 Bilan de cycle                                       │    │      │
│  │  │    Rapport complet d'un cycle de tontine               │    │      │
│  │  │    [Générer]                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ 🏦 État des caisses                                     │    │      │
│  │  │    Situation actuelle de toutes les caisses            │    │      │
│  │  │    [Générer]                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ 💳 Rapport des prêts                                    │    │      │
│  │  │    Situation des prêts en cours                        │    │      │
│  │  │    [Générer]                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ 👥 Rapport des cotisations par membre                   │    │      │
│  │  │    Historique des paiements par membre                 │    │      │
│  │  │    [Générer]                                           │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 17.2 Sous-Flow : Génération Bilan Mensuel

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: BILAN MENSUEL                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PARAMÈTRES DU RAPPORT                         │      │
│  │                                                                  │      │
│  │  Mois: [Mars ▼]  Année: [2026 ▼]                                │      │
│  │                                                                  │      │
│  │  [Générer le rapport]                                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    BILAN MENSUEL - MARS 2026                     │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SYNTHÈSE DU MOIS                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Séances tenues: 2 (#7 et #8)                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ENTRÉES:                                               │    │      │
│  │  │ • Cotisations: 3,750,000 XAF                           │    │      │
│  │  │ • Remboursements prêts: 140,000 XAF                    │    │      │
│  │  │ • Sanctions: 25,000 XAF                                │    │      │
│  │  │ • Total: 3,915,000 XAF                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ SORTIES:                                               │    │      │
│  │  │ • Distributions: 3,605,000 XAF                         │    │      │
│  │  │ • Prêts décaissés: 350,000 XAF                         │    │      │
│  │  │ • Dépenses: 85,000 XAF                                 │    │      │
│  │  │ • Total: 4,040,000 XAF                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ VARIATION: -125,000 XAF                                │    │      │
│  │  │                                                         │    │      │
│  │  │ ÉTAT DES CAISSES FIN DE MOIS:                         │    │      │
│  │  │ • Principale: 2,332,500 XAF                            │    │      │
│  │  │ • Secours: 447,500 XAF                                 │    │      │
│  │  │ • Fonctionnement: 187,500 XAF                          │    │      │
│  │  │ • Total: 2,967,500 XAF                                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ⚠️ Ce rapport nécessite validation du Président.               │      │
│  │                                                                  │      │
│  │  [Soumettre pour validation]  [📥 PDF]  [📊 Excel]              │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└──────────���──────────────────────────────────────────────────────────────────┘
```

## 17.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-GR01 | Les rapports sont générés automatiquement |
| RM-GR02 | Le Président doit valider les bilans |
| RM-GR03 | Les rapports sont exportables en PDF et Excel |
| RM-GR04 | Le Commissaire aux Comptes a accès à tous les rapports |

---

# 18. FLOW 16 : RÉCONCILIATION MOBILE MONEY

## 18.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: RÉCONCILIATION MOBILE MONEY                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Trésorier clique │                                                       │
│  │ "Réconciliation  │                                                       │
│  │  Mobile Money"   │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    RÉCONCILIATION                                │      │
│  │                                                                  │      │
│  │  Période: [01/03/2026] au [15/03/2026]                          │      │
│  │                                                                  │      │
│  │  ┌───���─────────────────────────────────────────────────────┐    │      │
│  │  │ COMPARAISON                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Transactions Mobile Money (API):   25                   │    │      │
│  │  │ Paiements enregistrés (système):   24                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant Mobile Money: 1,250,000 XAF                    │    │      │
│  │  │ Montant enregistré: 1,200,000 XAF                      │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ ÉCART DÉTECTÉ: 1 transaction / 50,000 XAF           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TRANSACTIONS NON RÉCONCILIÉES (1)                       │    │      │
│  │  │                                                         │    │      │
│  │  │ 💰 50,000 XAF - MTN MoMo                               │    │      │
│  │  │    Réf: TXN999888777                                   │    │      │
│  │  │    Date: 14/03/2026 16:30                              │    │      │
│  │  │    Tél: +237 677 111 222                               │    │      │
│  │  │    Statut: ⚠️ Non approuvé                             │    │      │
│  │  │                                                         │    │      │
│  │  │    [Examiner et approuver]                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Exporter le rapport de réconciliation]                        │      │
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
| RM-RC01 | La réconciliation compare les transactions API et les enregistrements |
| RM-RC02 | Les écarts sont signalés pour action |
| RM-RC03 | Le trésorier doit traiter les transactions non réconciliées |
| RM-RC04 | Un rapport de réconciliation peut être exporté |

---

# 19. FLOW 17 : PAIEMENT SORTANT MOBILE MONEY

## 19.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: PAIEMENT SORTANT MOBILE MONEY                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    INITIATION PAIEMENT SORTANT                   │      │
│  │                                                                  │      │
│  │  Ce flow est déclenché depuis:                                  │      │
│  │  • Distribution de cagnotte (Flow 8)                            │      │
│  │  • Décaissement de prêt (Flow 9)                                │      │
│  │  • Remboursement de sanction (Flow 12)                          │      │
│  │  • Distribution cotisation extraordinaire (Flow 13)             │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE DE PAIEMENT                        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉTAILS DU PAIEMENT                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Type: Distribution de cagnotte                         │    │      │
│  │  │ Bénéficiaire: Paul NGOUFACK                            │    │      │
│  │  │ Montant: 1,802,500 XAF                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Opérateur:                                             │    │      │
│  │  │ ● MTN Mobile Money                                      │    │      │
│  │  │ ○ Orange Money                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ Numéro destinataire: +237 677 888 999                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Frais de transfert: 2,500 XAF (à la charge de: Tontine)│    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Initier le transfert]                              │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIRMATION SÉCURISÉE                        │      │
│  │                                                                  │      │
│  │  ⚠️ Vous êtes sur le point d'envoyer 1,802,500 XAF              │      │
│  │                                                                  │      │
│  │  Code PIN Trésorier: [______]                                   │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer]                                         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    TRANSFERT EN COURS                            │      │
│  │                                                                  │      │
│  │  ⏳ Connexion à l'API MTN Mobile Money...                       │      │
│  │  ⏳ Envoi de la demande de transfert...                         │      │
│  │  ⏳ En attente de confirmation...                               │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ SUCCÈS                   ÉCHEC  │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ TRANSFERT RÉUSSI  │          │ ❌ TRANSFERT ÉCHOUÉ  │                │
│  │                      │          │                      │                │
│  │ Référence:           │          │ Erreur: [Message]    │                │
│  │ TXN987654321         │          │                      │                │
│  │                      │          │ Options:             │                │
│  │ • Caisse débitée     │          │ • Réessayer          │                │
│  │ • Notification       │          │ • Payer en espèces   │                │
│  │   envoyée            │          │ • Annuler            │                │
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

## 19.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-PS01 | Le trésorier peut initier des paiements sortants via Mobile Money |
| RM-PS02 | Une confirmation sécurisée (PIN) est requise |
| RM-PS03 | En cas d'échec, des options alternatives sont proposées |
| RM-PS04 | Toutes les transactions sont tracées |

---

# 20. RÉCAPITULATIF DES ÉCRANS

## 20.1 Liste des Écrans du Trésorier

| # | Écran | Description | Accès |
|---|-------|-------------|-------|
| E-TR01 | Tableau de bord | Vue d'ensemble financière | Menu principal |
| E-TR02 | Encaissement cotisation | Formulaire de paiement | Actions rapides |
| E-TR03 | Approbation Mobile Money | Liste des paiements à approuver | Notifications |
| E-TR04 | Paiement partiel | Enregistrement paiement incomplet | Encaissement |
| E-TR05 | Paiement en avance | Enregistrement paiement anticipé | Encaissement |
| E-TR06 | Gestion des caisses | État et détails des caisses | Menu principal |
| E-TR07 | Transfert entre caisses | Formulaire de transfert | Caisses |
| E-TR08 | Enregistrement dépense | Formulaire avec justificatif | Actions rapides |
| E-TR09 | Distribution cagnotte | Paiement au bénéficiaire | Pendant séance |
| E-TR10 | Décaissement prêt | Versement prêt validé | Notifications |
| E-TR11 | Remboursement prêt | Enregistrement remboursement | Prêts |
| E-TR12 | Encaissement sanctions | Collecte des amendes | Notifications |
| E-TR13 | Remboursement sanction | Remboursement si annulée | Notifications |
| E-TR14 | Cotisation extraordinaire | Suivi de collecte spéciale | Menu principal |
| E-TR15 | Bilan de séance | Rapport financier séance | Pendant séance |
| E-TR16 | Génération rapports | Liste des rapports | Menu principal |
| E-TR17 | Réconciliation MoMo | Comparaison API/Système | Menu principal |
| E-TR18 | Paiement sortant MoMo | Initiation transfert | Distribution/Prêt |

# 🔵 FLOWS COMPLETS DU TRÉSORIER (FINAL)
## Application de Gestion de Tontine - Cameroun

---

# 20. RÉCAPITULATIF DES ÉCRANS (Suite)

## 20.2 Navigation du Trésorier (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NAVIGATION - TRÉSORIER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         MENU PRINCIPAL                              │   │
│  └───────────────────────���─────────────────────────────────────────────┘   │
│                                    │                                        │
│       ┌────────────┬───────────────┼───────────────┬────────────┐          │
│       │            │               │               │            │          │
│       ▼            ▼               ▼               ▼            ▼          │
│  ┌─────────┐  ┌─────────┐    ┌─────────┐    ┌─────────┐   ┌─────────┐     │
│  │Tableau  │  │Encais-  │    │Caisses  │    │Prêts    │   │Rapports │     │
│  │de bord  │  │sements  │    │         │    │         │   │         │     │
│  └────┬────┘  └────┬────┘    └────┬────┘    └────┬────┘   └────┬────┘     │
│       │            │              │              │             │           │
│       │       ┌────┴────┐    ┌────┴────┐    ┌────┴────┐   ┌────┴────┐     │
│       │       ▼         ▼    ▼         ▼    ▼         ▼   ▼         ▼     │
│       │   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│       │   │Cotis.│ │Sanc- │ │État  │ │Trans-│ │Décais│ │Rembou│ │Bilan │ │
│       │   │      │ │tions │ │caisses│ │ferts│ │sement│ │rsemt │ │séance│ │
│       │   └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ │
│       │                                                                    │
│       │    ┌───────────────────────────────────────────────────────┐      │
│       └───►│                   NOTIFICATIONS                       │      │
│            │  • Paiements Mobile Money à approuver                 │      │
│            │  • Sanctions à collecter                              │      │
│            │  • Prêts à décaisser                                 │      │
│            │  • Échéances de prêts                                │      │
│            │  • Remboursements de sanctions                       │      │
│            │  • Cotisations extraordinaires                       │      │
│            │  • Validations (transferts, dépenses)                │      │
│            └───────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 21. RÈGLES MÉTIER - RÉCAPITULATIF GLOBAL

## 21.1 Règles d'Encaissement

| Code | Règle |
|------|-------|
| RM-EC01 | L'encaissement peut se faire pendant ou hors séance |
| RM-EC02 | Les paiements partiels sont autorisés |
| RM-EC03 | Les paiements en avance sont autorisés |
| RM-EC04 | Un reçu est généré et envoyé automatiquement |
| RM-AM01 | Les paiements Mobile Money sont détectés automatiquement |
| RM-AM02 | Le trésorier doit approuver manuellement chaque paiement MoMo |

## 21.2 Règles de Gestion des Caisses

| Code | Règle |
|------|-------|
| RM-GC01 | Trois caisses par défaut : Principale, Secours, Fonctionnement |
| RM-GC02 | D'autres caisses peuvent être créées selon configuration |
| RM-TC01 | Tous les transferts entre caisses nécessitent validation |
| RM-TC02 | Double validation requise : Président + Commissaire aux Comptes |
| RM-TC03 | La justification est obligatoire pour les transferts |

## 21.3 Règles de Dépenses

| Code | Règle |
|------|-------|
| RM-DE01 | Le justificatif est obligatoire pour toutes les dépenses |
| RM-DE02 | Les dépenses > plafond nécessitent validation Président + Commissaire |
| RM-DE03 | Le plafond est configurable par tontine |
| RM-DE04 | Les dépenses sont catégorisées |

## 21.4 Règles de Distribution

| Code | Règle |
|------|-------|
| RM-DC01 | La distribution ne peut se faire que pendant une séance active |
| RM-DC02 | Le bénéficiaire est déterminé par l'ordre de distribution |
| RM-DC03 | Les prélèvements (secours, fonctionnement) sont automatiques |
| RM-DC04 | Le bénéficiaire doit confirmer via OTP + signature électronique |
| RM-DC05 | Un reçu est généré et envoyé automatiquement |

## 21.5 Règles de Prêts

| Code | Règle |
|------|-------|
| RM-DP01 | Le décaissement nécessite validation Président + Commissaire |
| RM-DP02 | L'échéancier est généré automatiquement |
| RM-DP03 | Les garants sont notifiés du décaissement |
| RM-RP01 | Les remboursements partiels sont autorisés |
| RM-RP02 | Le trésorier reçoit des alertes pour les échéances |
| RM-RP03 | Les pénalités sont appliquées par le censeur (pas le trésorier) |

## 21.6 Règles de Rapports

| Code | Règle |
|------|-------|
| RM-BS01 | Le bilan de séance est généré automatiquement |
| RM-BS02 | Il doit être présenté pendant la séance |
| RM-BS03 | Double signature requise : Trésorier + Président |
| RM-BS04 | Le bilan est intégré au PV du Secrétaire |
| RM-GR01 | Les rapports sont générés automatiquement |
| RM-GR02 | Le Président doit valider les bilans |

---

# 22. NOTIFICATIONS DU TRÉSORIER

## 22.1 Notifications Reçues

| Événement | Source | Priorité |
|-----------|--------|----------|
| Nouveau paiement Mobile Money | Système (API) | Haute |
| Nouvelle sanction à collecter | Censeur | Haute |
| Prêt approuvé à décaisser | Bureau | Haute |
| Échéance de prêt (J-7, J-3, J-1) | Système | Haute |
| Sanction annulée (remboursement requis) | Censeur | Haute |
| Cotisation extraordinaire lancée | Président | Normale |
| Cotisation extraordinaire clôturée | Président | Normale |
| Transfert/Dépense validé | Président/Commissaire | Normale |
| Transfert/Dépense refusé | Président/Commissaire | Normale |
| Rappel bilan de séance | Système | Normale |

## 22.2 Notifications Envoyées

| Événement | Destinataire | Canaux |
|-----------|--------------|--------|
| Cotisation encaissée + Reçu | Membre | SMS, Push, Email |
| Distribution effectuée + Reçu | Bénéficiaire | SMS, Push, Email |
| Prêt décaissé + Reçu | Emprunteur, Garants | SMS, Push, Email |
| Remboursement enregistré + Reçu | Emprunteur | SMS, Push, Email |
| Sanction encaissée | Membre, Censeur | Push |
| Remboursement sanction | Membre, Censeur | SMS, Push |
| Rappel cotisation extraordinaire | Membres non payés | SMS, Push |
| Demande validation transfert | Président, Commissaire | Push, Email |
| Demande validation dépense | Président, Commissaire | Push, Email |
| Bilan de séance pour signature | Président | Push, Email |

---

# 23. INTÉGRATIONS AVEC AUTRES RÔLES

## 23.1 Interactions avec le Président

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERACTIONS TRÉSORIER ↔ PRÉSIDENT                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TRÉSORIER                               PRÉSIDENT                          │
│  ─────────                               ─────────                          │
│                                                                             │
│  Demande validation transfert ─────────► Approuve ou refuse                │
│                                                                             │
│  Demande validation dépense ───────────► Approuve ou refuse                │
│                                                                             │
│  Demande validation décaissement ──────► Approuve ou refuse                │
│                                                                             │
│  Soumet bilan de séance ───────────────► Signe le bilan                    │
│                                                                             │
│  Soumet rapport mensuel/cycle ─────────► Valide le rapport                 │
│                                                                             │
│  Reçoit notification ◄─────────────────  Lance cotisation extraordinaire   │
│                                                                             │
│  Distribue après clôture ◄─────────────  Clôture cotisation extraordinaire │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 23.2 Interactions avec le Censeur

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERACTIONS TRÉSORIER ↔ CENSEUR                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TRÉSORIER                               CENSEUR                            │
│  ─────────                               ───────                            │
│                                                                             │
│  Reçoit notification ◄─────────────────  Applique une sanction             │
│  (sanction à collecter)                                                    │
│                                                                             │
│  Encaisse la sanction ─────────────────► Reçoit notification               │
│                                          (sanction payée)                  │
│                                                                             │
│  Reçoit notification ◄─────────────────  Annule une sanction (payée)       │
│  (remboursement requis)                                                    │
│                                                                             │
│  Effectue remboursement ───────────────► Reçoit notification               │
│                                          (remboursement effectué)          │
│                                                                             │
│  Signale retard prêt ──────────────────► Peut appliquer pénalité           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 23.3 Interactions avec le Commissaire aux Comptes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERACTIONS TRÉSORIER ↔ COMMISSAIRE                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TRÉSORIER                               COMMISSAIRE AUX COMPTES            │
│  ─────────                               ──────────────────────             │
│                                                                             │
│  Demande validation transfert ─────────► Approuve ou refuse                │
│                                                                             │
│  Demande validation dépense ───────────► Approuve ou refuse                │
│                                                                             │
│  Demande validation décaissement ──────► Approuve ou refuse                │
│                                                                             │
│  (Lecture seule) ◄─────────────────────  Consulte mouvements de caisse     │
│                                                                             │
│  (Lecture seule) ◄─────────────────────  Consulte justificatifs dépenses   │
│                                                                             │
│  (Lecture seule) ◄─────────────────────  Consulte rapports/bilans          │
│                                                                             │
│  (Lecture seule) ◄─────────────────────  Consulte historique paiements     │
│                                                                             │
│  (Lecture seule) ◄─────────────────────  Exporte données pour audit        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 23.4 Interactions avec le Secrétaire

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERACTIONS TRÉSORIER ↔ SECRÉTAIRE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TRÉSORIER                               SECRÉTAIRE                         │
│  ─────────                               ──────────                         │
│                                                                             │
│  Fournit bilan de séance ──────────────► Intègre au PV                     │
│                                                                             │
│  (Le secrétaire inclut le bilan financier signé dans le PV de la séance)  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 24. CAS D'ERREUR ET EXCEPTIONS

## 24.1 Cas d'Erreur Possibles

| Cas | Message | Action |
|-----|---------|--------|
| Distribution hors séance | "La distribution ne peut se faire que pendant une séance active." | Bloquer l'action |
| Solde caisse insuffisant | "Solde insuffisant dans la caisse [X]. Disponible: Y XAF" | Bloquer l'action |
| Dépense sans justificatif | "Le justificatif est obligatoire." | Bloquer l'enregistrement |
| Transfert MoMo échoué | "Erreur de transfert: [Message API]" | Proposer alternatives |
| Double paiement détecté | "Cette transaction semble déjà enregistrée." | Demander confirmation |
| Échéance prêt non trouvée | "Aucune échéance en attente pour ce prêt." | Vérifier le prêt |

## 24.2 Gestion des Conflits

| Conflit | Résolution |
|---------|------------|
| Paiement MoMo sans membre identifié | Demander sélection manuelle du membre |
| Montant paiement ≠ cotisation | Proposer paiement partiel ou multiple |
| Remboursement sanction caisse vide | Utiliser une autre caisse ou reporter |
| Transfert refusé après initiation | Annuler et notifier le trésorier |
| Décaissement prêt après annulation | Bloquer et notifier le bureau |

---

# 25. JOURNAL D'AUDIT

## 25.1 Opérations Tracées

| Opération | Informations enregistrées |
|-----------|---------------------------|
| Encaissement cotisation | Date, heure, trésorier, membre, montant, mode, caisse |
| Approbation paiement MoMo | Date, heure, trésorier, référence, montant, affectation |
| Transfert entre caisses | Date, heure, trésorier, source, destination, montant, validateurs |
| Enregistrement dépense | Date, heure, trésorier, catégorie, montant, justificatif, validateurs |
| Distribution cagnotte | Date, heure, trésorier, bénéficiaire, montant, mode, signature |
| Décaissement prêt | Date, heure, trésorier, emprunteur, montant, validateurs |
| Remboursement prêt | Date, heure, trésorier, emprunteur, montant, échéance |
| Encaissement sanction | Date, heure, trésorier, membre, sanction, montant |
| Remboursement sanction | Date, heure, trésorier, membre, montant, motif |
| Génération rapport | Date, heure, trésorier, type rapport, période |

## 25.2 Accès au Journal

| Rôle | Accès |
|------|-------|
| Trésorier | Lecture de ses propres opérations |
| Président | Lecture complète |
| Commissaire aux Comptes | Lecture complète + Export |
| Administrateur système | Lecture complète + Export |

---

# 26. DÉLÉGATION À L'ADJOINT

## 26.1 Règles de Délégation

| Règle | Description |
|-------|-------------|
| RM-AD01 | Le trésorier adjoint a les mêmes pouvoirs que le trésorier |
| RM-AD02 | Les opérations de l'adjoint sont tracées sous son nom |
| RM-AD03 | Le trésorier peut voir les opérations de son adjoint |
| RM-AD04 | Les validations (Président, Commissaire) s'appliquent aussi à l'adjoint |

## 26.2 Opérations de l'Adjoint

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POUVOIRS DU TRÉSORIER ADJOINT                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ✅ AUTORISÉ:                                                              │
│  • Encaisser des cotisations                                               │
│  • Approuver des paiements Mobile Money                                    │
│  • Enregistrer des dépenses (avec justificatif)                           │
│  • Effectuer des distributions (pendant séance)                           │
│  • Décaisser des prêts validés                                            │
│  • Enregistrer des remboursements de prêts                                │
│  • Encaisser des sanctions                                                │
│  • Effectuer des remboursements de sanctions                              │
│  • Gérer les cotisations extraordinaires                                  │
│  • Initier des transferts entre caisses (soumis à validation)             │
│  • Générer des rapports                                                   │
│                                                                             │
│  ⚠️ MÊME CONTRAINTES:                                                      │
│  • Validations requises (Président + Commissaire) pour:                   │
│    - Transferts entre caisses                                             │
│    - Dépenses > plafond                                                   │
│    - Décaissement de prêts                                                │
│  • Signature du bilan de séance (Trésorier principal ou Adjoint)          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# FIN DU DOCUMENT - FLOWS DU TRÉSORIER

## Récapitulatif des Livrables

| Document | Contenu |
|----------|---------|
| Flows_Tresorier_TontineApp.md | Flows 1-4 (Encaissements, Mobile Money) |
| Flows_Tresorier_TontineApp_Suite.md | Flows 5-13 (Caisses, Dépenses, Distribution, Prêts, Sanctions) |
| Flows_Tresorier_TontineApp_Fin.md | Flows 14-17 (Bilans, Rapports, Réconciliation, Paiements sortants) |
| Flows_Tresorier_TontineApp_Final.md | Écrans, Règles, Notifications, Intégrations, Audit |

## Statistiques

| Élément | Nombre |
|---------|--------|
| Flows principaux | 17 |
| Sous-flows | 5 |
| Écrans | 18 |
| Règles métier | 35+ |
| Types de notifications | 20+ |
| Intégrations autres rôles | 4 |
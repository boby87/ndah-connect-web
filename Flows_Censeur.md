# ⚫ FLOWS COMPLETS DU CENSEUR
## Application de Gestion de Tontine - Cameroun
### Version 1.0 | Mars 2026

---

# TABLE DES MATIÈRES

1. [Vue d'Ensemble](#1-vue-densemble)
2. [Tableau de Bord du Censeur](#2-tableau-de-bord-du-censeur)
3. [Flow 1 : Application d'une Sanction](#3-flow-1--application-dune-sanction)
4. [Flow 2 : Confirmation des Sanctions Automatiques](#4-flow-2--confirmation-des-sanctions-automatiques)
5. [Flow 3 : Création d'une Sanction Personnalisée](#5-flow-3--création-dune-sanction-personnalisée)
6. [Flow 4 : Application de Sanctions Multiples](#6-flow-4--application-de-sanctions-multiples)
7. [Flow 5 : Traitement d'une Contestation de Sanction](#7-flow-5--traitement-dune-contestation-de-sanction)
8. [Flow 6 : Annulation d'une Sanction](#8-flow-6--annulation-dune-sanction)
9. [Flow 7 : Validation des Modifications de Présence](#9-flow-7--validation-des-modifications-de-présence)
10. [Flow 8 : Validation des Justificatifs d'Absence](#10-flow-8--validation-des-justificatifs-dabsence)
11. [Flow 9 : Suivi des Sanctions Impayées](#11-flow-9--suivi-des-sanctions-impayées)
12. [Flow 10 : Envoi de Rappels de Paiement](#12-flow-10--envoi-de-rappels-de-paiement)
13. [Flow 11 : Génération du Rapport du Censeur](#13-flow-11--génération-du-rapport-du-censeur)
14. [Flow 12 : Communication et Avertissements](#14-flow-12--communication-et-avertissements)
15. [Flow 13 : Notification d'Annulation par Président/Assemblée](#15-flow-13--notification-dannulation-par-présidentassemblée)
16. [Récapitulatif des Écrans](#16-récapitulatif-des-écrans)

---

# 1. VUE D'ENSEMBLE

## 1.1 Rôle du Censeur

Le Censeur est le **garant de la discipline** au sein de la tontine. Il veille au respect du règlement intérieur, applique les sanctions, valide les justificatifs et les modifications de présence, et présente un rapport à chaque séance.

## 1.2 Résumé des Pouvoirs

| Domaine | Pouvoir | Condition |
|---------|---------|-----------|
| Sanctions | Appliquer des sanctions | Pendant la séance uniquement |
| Sanctions | Appliquer plusieurs sanctions à un membre | Même séance autorisée |
| Sanctions | Confirmer les sanctions automatiques | Confirmation manuelle requise |
| Sanctions | Créer des sanctions personnalisées | Pendant la séance |
| Sanctions | Annuler une sanction | Suite à contestation ou erreur |
| Contestations | Traiter les contestations | Peut annuler ou transférer au président |
| Présences | Valider les modifications de présence | Sur demande du secrétaire |
| Justificatifs | Valider les justificatifs d'absence | Avant le président |
| Justificatifs | Déléguer la validation | Uniquement à son vice |
| Suivi | Accéder aux sanctions impayées | Tableau de bord dédié |
| Communication | Envoyer des rappels de paiement | Aux membres sanctionnés |
| Communication | Envoyer des avertissements individuels | Aux membres |
| Rapport | Présenter un rapport à chaque séance | Généré automatiquement |

## 1.3 Liste des Flows

| # | Flow | Description |
|---|------|-------------|
| 1 | Application d'une Sanction | Appliquer une sanction prédéfinie |
| 2 | Confirmation des Sanctions Automatiques | Confirmer retards et absences détectés |
| 3 | Création d'une Sanction Personnalisée | Créer une sanction ponctuelle |
| 4 | Application de Sanctions Multiples | Plusieurs sanctions pour un membre |
| 5 | Traitement d'une Contestation | Examiner une contestation de sanction |
| 6 | Annulation d'une Sanction | Annuler une sanction appliquée |
| 7 | Validation Modification Présence | Valider demande du secrétaire |
| 8 | Validation Justificatifs | Valider les justificatifs d'absence |
| 9 | Suivi des Sanctions Impayées | Consulter les sanctions non payées |
| 10 | Envoi de Rappels | Envoyer des rappels de paiement |
| 11 | Génération du Rapport | Générer le rapport de séance |
| 12 | Communication et Avertissements | Envoyer des messages aux membres |
| 13 | Notification d'Annulation | Recevoir notification annulation externe |

---

# 2. TABLEAU DE BORD DU CENSEUR

## 2.1 Vue Générale

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TABLEAU DE BORD - CENSEUR                                │
│                    Tontine: [Nom de la Tontine]                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      🔔 ALERTES ET TÂCHES                           │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ • 3 demandes de modification de présence en attente                │   │
│  │ • 5 justificatifs à valider                                        │   │
│  │ • 2 contestations de sanctions à traiter                           │   │
│  │ • 8 sanctions impayées (total: 45,000 XAF)                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  ⚖️ SANCTIONS - CE MOIS          │  │  💰 SANCTIONS IMPAYÉES       │    │
│  ├──────────────────────────────────┤  ├──────────────────────────────┤    │
│  │                                  │  │                              │    │
│  │ Sanctions appliquées: 24         │  │ Nombre: 8                    │    │
│  │                                  │  │ Montant total: 45,000 XAF    │    │
│  │ ├─ Retards: 12                   │  │                              │    │
│  │ ├─ Absences: 8                   │  │ Plus ancienne:               │    │
│  │ ├─ Troubles: 2                   │  │ Jean KAMGA - 15,000 XAF      │    │
│  │ └─ Autres: 2                     │  │ (depuis 45 jours)            │    │
│  │                                  │  │                              │    │
│  │ Montant total: 78,000 XAF        │  │ [Voir détails]               │    │
│  │ Montant collecté: 33,000 XAF     │  │ [Envoyer rappels]            │    │
│  │                                  │  │                              │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  📋 VALIDATIONS EN ATTENTE       │  │  👥 MEMBRES LES + SANCTIONNÉS│    │
│  ├──────────────────────────────────┤  ├──────────────────────────────┤    │
│  │                                  │  │                              │    │
│  │ Modifications présence: 3        │  │ 1. Paul NGOUFACK (5 sanct.)  │    │
│  │ [Traiter]                        │  │    Total: 25,000 XAF         │    │
│  │                                  │  │                              │    │
│  │ Justificatifs: 5                 │  │ 2. Marie NGUEMO (4 sanct.)   │    │
│  │ [Traiter]                        │  │    Total: 18,000 XAF         │    │
│  │                                  │  │                              │    │
│  │ Contestations: 2                 │  │ 3. Jean KAMGA (3 sanct.)     │    │
│  │ [Traiter]                        │  │    Total: 15,000 XAF         │    │
│  │                                  │  │                              │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  📅 PROCHAINE SÉANCE             │  │  📊 STATISTIQUES CYCLE       │    │
│  ├──────────────────────────────────┤  ├──────────────────────────────┤    │
│  │                                  │  │                              │    │
│  │ Date: 15 Mars 2026               │  │ Total sanctions: 156         │    │
│  │ Heure: 15:00                     │  │ Total collecté: 520,000 XAF  │    │
│  │                                  │  │                              │    │
│  │ Mon rapport:                     │  │ Taux de paiement: 87%        │    │
│  │ [📄 Générer le rapport]          │  │                              │    │
│  │                                  │  │                              │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      ⚡ ACTIONS RAPIDES                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  [⚖️ Appliquer sanction]  [📋 Valider justificatifs]               │   │
│  │                                                                     │   │
│  │  [✉️ Envoyer rappels]  [📄 Générer rapport]  [📨 Avertissement]    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Indicateurs du Tableau de Bord

| Indicateur | Description | Mise à jour |
|------------|-------------|-------------|
| Sanctions appliquées (période) | Nombre et types de sanctions du mois | Temps réel |
| Sanctions impayées | Nombre et montant total | Temps réel |
| Modifications présence en attente | Demandes du secrétaire à valider | Temps réel |
| Justificatifs à valider | Justificatifs soumis par les membres | Temps réel |
| Contestations à traiter | Contestations de sanctions | Temps réel |
| Membres les plus sanctionnés | Top 3 des membres sanctionnés | Après chaque séance |
| Montant total collecté | Total des sanctions payées | Temps réel |
| Alertes | Tâches urgentes du censeur | Temps réel |

---

# 3. FLOW 1 : APPLICATION D'UNE SANCTION

## 3.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: APPLICATION D'UNE SANCTION                         │
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
│  │ Censeur constate │                                                       │
│  │ une infraction   │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    VÉRIFICATION CONTEXTE                         │      │
│  │                                                                  │      │
│  │  Séance en cours: #8 - 15 Mars 2026                             │      │
│  │  Statut: ✅ Séance active                                        │      │
│  │                                                                  │      │
│  │  ⚠️ Les sanctions ne peuvent être appliquées que pendant        │      │
│  │     une séance active.                                          │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE DE SANCTION                        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SÉLECTION DU MEMBRE                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Rechercher: [________________] 🔍                       │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Paul NGOUFACK                                        │    │      │
│  │  │    Statut présence: ✅ Présent (arrivé à 15:05)        │    │      │
│  │  │    Sanctions aujourd'hui: 0                             │    │      │
│  │  │    Sanctions impayées: 2 (10,000 XAF)                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPE DE SANCTION                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Retard ────────────────────────────── 500 XAF        │    │      │
│  │  │ ○ Absence non justifiée ─────────────── 1,000 XAF      │    │      │
│  │  │ ● Trouble à l'ordre ─────────────────── 2,000 XAF      │    │      │
│  │  │ ○ Non-paiement cotisation ───────────── 1,500 XAF      │    │      │
│  │  │ ○ Avertissement verbal ──────────────── 0 XAF          │    │      │
│  │  │ ○ Blâme ─────────────────────────────── 0 XAF          │    │      │
│  │  │ ○ Autre (personnalisée) ─────────────── [____] XAF     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ NIVEAU DE GRAVITÉ                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Léger (1er avertissement)                             │    │      │
│  │  │ ● Moyen (récidive ou faute caractérisée)                │    │      │
│  │  │ ○ Grave (faute grave)                                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MOTIF / DESCRIPTION (obligatoire)                       │    │      │
│  │  │                                                         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Le membre a perturbé la séance en interrompant │    │    │      │
│  │  │ │ à plusieurs reprises le président pendant son  │    │    │      │
│  │  │ │ discours d'ouverture.                          │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Appliquer la sanction]                             │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIRMATION                                  │      │
│  │                                                                  │      │
│  │  Récapitulatif de la sanction:                                  │      │
│  │                                                                  │      │
│  │  👤 Membre: Paul NGOUFACK                                       │      │
│  │  ⚖️ Type: Trouble à l'ordre                                     │      │
│  │  💰 Montant: 2,000 XAF                                          │      │
│  │  📊 Gravité: Moyen                                              │      │
│  │  📝 Motif: Perturbation de la séance...                         │      │
│  │                                                                  │      │
│  │  Le membre sera notifié immédiatement.                          │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer]                                         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ SANCTION APPLIQUÉE                         │      │
│  │                                                                  │      │
│  │  • Sanction enregistrée                                         │      │
│  │  • Notification envoyée au membre (SMS, Push, Email)            │      │
│  │  • Ajoutée au rapport de séance                                 │      │
│  │  • Historique mis à jour                                        │      │
│  │                                                                  │      │
│  │  Délai de contestation: jusqu'à la prochaine séance             │      │
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
| RM-AS01 | Les sanctions ne peuvent être appliquées que pendant une séance active |
| RM-AS02 | Le motif/description est obligatoire |
| RM-AS03 | Le membre est notifié immédiatement sur tous les canaux |
| RM-AS04 | La sanction est automatiquement ajoutée au rapport de séance |
| RM-AS05 | Le délai de contestation est jusqu'à la séance suivante |
| RM-AS06 | L'historique des sanctions du membre est visible avant application |

## 3.3 Notifications Envoyées

| Destinataire | Canal | Contenu |
|--------------|-------|---------|
| Membre sanctionné | SMS, Push, Email | Détails de la sanction et montant |
| Trésorier | Push | Nouvelle sanction à collecter |

---

# 4. FLOW 2 : CONFIRMATION DES SANCTIONS AUTOMATIQUES

## 4.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CONFIRMATION DES SANCTIONS AUTOMATIQUES            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  │(Après    │                                                               │
│  │ clôture  │                                                               │
│  │présences)│                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Sanctions à     │                                                       │
│  │  confirmer"      │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SANCTIONS DÉTECTÉES AUTOMATIQUEMENT           │      │
│  │                                                                  │      │
│  │  Séance #8 - 15 Mars 2026                                       │      │
│  │  Clôture des présences effectuée par le Secrétaire              │      │
│  │                                                                  │      │
│  │  ⚠️ Ces sanctions nécessitent votre confirmation pour être      │      │
│  │     appliquées.                                                  │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RETARDS DÉTECTÉS (5)                                    │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │ ☑ Marie NGUEMO - Arrivée: 15:12 (+12 min) - 500 XAF    │    │      │
│  │  │ ☑ Pierre FOTSO - Arrivée: 15:08 (+8 min) - 500 XAF     │    │      │
│  │  │ ☑ Anne MBARGA - Arrivée: 15:25 (+25 min) - 500 XAF     │    │      │
│  │  │ ☐ Robert TCHANA - Arrivée: 15:03 (+3 min) - 500 XAF    │    │      │
│  │  │ ☑ Claire ESSOMBA - Arrivée: 15:15 (+15 min) - 500 XAF  │    │      │
│  │  │                                                         │    │      │
│  │  │ [Tout sélectionner] [Tout désélectionner]               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ABSENCES DÉTECTÉES (7)                                  │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │ ☑ Paul BIYA - Non signalé - 1,000 XAF                  │    │      │
│  │  │ ☐ Sophie BELLO - Signalé (justif. en attente) - 1,000  │    │      │
│  │  │ ☑ David NKOA - Non signalé - 1,000 XAF                 │    │      │
│  │  │ ☑ Emma FOUDA - Non signalé - 1,000 XAF                 │    │      │
│  │  │ ☑ Lucas MESSI - Non signalé - 1,000 XAF                │    │      │
│  │  │ ☐ Michel ATANGANA - Signalé (justif. joint) - 1,000    │    │      │
│  │  │ ☑ Sarah OWONA - Non signalé - 1,000 XAF                │    │      │
│  │  │                                                         │    │      │
│  │  │ [Tout sélectionner] [Tout désélectionner]               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Récapitulatif:                                                 │      │
│  │  • Retards sélectionnés: 4/5 → 2,000 XAF                       │      │
│  │  • Absences sélectionnées: 5/7 → 5,000 XAF                     │      │
│  │  • Total: 7,000 XAF                                             │      │
│  │                                                                  │      │
│  │  💡 Conseil: Ne confirmez pas les sanctions pour les membres   │      │
│  │     ayant un justificatif en attente de validation.            │      │
│  │                                                                  │      │
│  │  [Annuler tout]  [Confirmer les sanctions sélectionnées]        │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ SANCTIONS CONFIRMÉES                       │      │
│  │                                                                  │      │
│  │  • 4 sanctions pour retard appliquées                           │      │
│  │  • 5 sanctions pour absence appliquées                          │      │
│  │  • Total: 7,000 XAF                                             │      │
│  │                                                                  │      │
│  │  • Notifications envoyées aux membres concernés                 │      │
│  │  • Sanctions ajoutées au rapport de séance                      │      │
│  │                                                                  │      │
│  │  Non confirmées (en attente justificatif):                      │      │
│  │  • Robert TCHANA (retard mineur)                                │      │
│  │  • Sophie BELLO (justificatif en attente)                       │      │
│  │  • Michel ATANGANA (justificatif à valider)                     │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
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
| RM-CA01 | Le système détecte automatiquement les retards et absences |
| RM-CA02 | Le censeur doit confirmer manuellement chaque sanction |
| RM-CA03 | Les membres avec justificatif en attente peuvent être exclus |
| RM-CA04 | Les sanctions non confirmées ne sont pas appliquées |
| RM-CA05 | Le censeur peut modifier le montant avant confirmation |

---

# 5. FLOW 3 : CRÉATION D'UNE SANCTION PERSONNALISÉE

## 5.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CRÉATION D'UNE SANCTION PERSONNALISÉE              │
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
│  │ Censeur choisit  │                                                       │
│  │ "Sanction        │                                                       │
│  │  personnalisée"  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE SANCTION PERSONNALISÉE             │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MEMBRE CONCERNÉ                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ [Jean KAMGA ▼]                                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INTITULÉ DE LA SANCTION                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ [Utilisation du téléphone pendant la séance_________]  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPE DE SANCTION                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Financière                                            │    │      │
│  │  │   Montant: [1,500] XAF                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ● Non financière                                        │    │      │
│  │  │   ○ Avertissement verbal                                │    │      │
│  │  │   ● Blâme                                               │    │      │
│  │  │   ○ Rappel à l'ordre                                    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ NIVEAU DE GRAVITÉ                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ ● Léger   ○ Moyen   ○ Grave                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DESCRIPTION DÉTAILLÉE (obligatoire)                     │    │      │
│  │  │                                                         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Le membre a utilisé son téléphone portable à   │    │    │      │
│  │  │ │ plusieurs reprises pendant la lecture du PV,   │    │    │      │
│  │  │ │ perturbant l'attention générale malgré deux    │    │    │      │
│  │  │ │ rappels à l'ordre.                              │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ☑ Notifier le membre immédiatement                            │      │
│  │  ☑ Ajouter au rapport de séance                                │      │
│  │                                                                  │      │
│  │  [Annuler]  [Appliquer]                                         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ SANCTION PERSONNALISÉE APPLIQUÉE           │      │
│  │                                                                  │      │
│  │  👤 Membre: Jean KAMGA                                          │      │
│  │  ⚖️ Sanction: Utilisation du téléphone pendant la séance       │      │
│  │  📊 Type: Blâme (non financière)                                │      │
│  │  📊 Gravité: Léger                                              │      │
│  │                                                                  │      │
│  │  • Notification envoyée au membre                               │      │
│  │  • Ajoutée au rapport de séance                                 │      │
│  │  • Enregistrée dans l'historique                                │      │
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
| RM-SP01 | Une sanction personnalisée peut être financière ou non |
| RM-SP02 | L'intitulé et la description sont obligatoires |
| RM-SP03 | Le niveau de gravité est obligatoire |
| RM-SP04 | La sanction est enregistrée dans l'historique du membre |

---

# 6. FLOW 4 : APPLICATION DE SANCTIONS MULTIPLES

## 6.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: APPLICATION DE SANCTIONS MULTIPLES                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SITUATION                                     │      │
│  │                                                                  │      │
│  │  Un membre commet plusieurs infractions lors de la même séance: │      │
│  │  • Retard de 20 minutes                                         │      │
│  │  • Trouble à l'ordre pendant la réunion                         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    APPLICATION SANCTIONS MULTIPLES               │      │
│  │                                                                  │      │
│  │  👤 Membre: Paul NGOUFACK                                       │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SANCTIONS À APPLIQUER                                   │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ Sanction 1:                                             │    │      │
│  │  │ ☑ Retard ─────────────────────────────── 500 XAF       │    │      │
│  │  │   Motif: Arrivé à 15:20 au lieu de 15:00               │    │      │
│  │  │                                                         │    │      │
│  │  │ Sanction 2:                                             │    │      │
│  │  │ ☑ Trouble à l'ordre ──────────────────── 2,000 XAF     │    │      │
│  │  │   Motif: Altercation verbale avec un autre membre      │    │      │
│  │  │                                                         │    │      │
│  │  │ [+ Ajouter une autre sanction]                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉCAPITULATIF                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Nombre de sanctions: 2                                  │    │      │
│  │  │ Montant total: 2,500 XAF                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Sanctions existantes aujourd'hui: 0                     │    │      │
│  │  │ Total sanctions impayées: 10,000 XAF                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Appliquer toutes les sanctions]                    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ SANCTIONS APPLIQUÉES                       │      │
│  │                                                                  │      │
│  │  2 sanctions appliquées à Paul NGOUFACK:                        │      │
│  │  • Retard: 500 XAF                                              │      │
│  │  • Trouble à l'ordre: 2,000 XAF                                 │      │
│  │                                                                  │      │
│  │  Total: 2,500 XAF                                               │      │
│  │                                                                  │      │
│  │  Notification envoyée au membre (détail des 2 sanctions)        │      │
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
| RM-SM01 | Plusieurs sanctions peuvent être appliquées au même membre lors d'une séance |
| RM-SM02 | Chaque sanction nécessite son propre motif |
| RM-SM03 | Le membre reçoit une seule notification groupée |
| RM-SM04 | Chaque sanction est enregistrée séparément dans l'historique |

---

# 7. FLOW 5 : TRAITEMENT D'UNE CONTESTATION DE SANCTION

## 7.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: TRAITEMENT D'UNE CONTESTATION DE SANCTION          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Nouvelle        │                                                       │
│  │  contestation    │                                                       │
│  │  de sanction"    │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉTAIL DE LA CONTESTATION                     │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SANCTION CONTESTÉE                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Membre: Marie NGUEMO                                 │    │      │
│  │  │ 📅 Séance: #8 - 15 Mars 2026                           │    │      │
│  │  │ ⚖️ Type: Retard                                        │    │      │
│  │  │ 💰 Montant: 500 XAF                                    │    │      │
│  │  │ ⏰ Heure enregistrée: 15:12                            │    │      │
│  │  │ 📝 Motif sanction: Arrivée 12 minutes après l'heure   │    │      │
│  │  │                                                         │    │      │
│  │  │ Statut paiement: ❌ Non payée                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CONTESTATION                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Soumise le: 16 Mars 2026 à 10:00                       │    │      │
│  │  │ Délai: Valide (avant la prochaine séance)              │    │      │
│  │  │                                                         │    │      │
│  │  │ Motif de contestation:                                  │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Je conteste cette sanction car j'étais bien    │    │    │      │
│  │  │ │ arrivée à 14:58 comme en témoigne la photo     │    │    │      │
│  │  │ │ horodatée que je joins. Le pointage a dû être  │    │    │      │
│  │  │ │ effectué en retard.                            │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Pièce jointe: photo_arrivee.jpg                        │    │      │
│  │  │ [📥 Télécharger] [👁️ Visualiser]                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉCISION                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Accepter la contestation (annuler la sanction)    │    │      │
│  │  │ ○ ❌ Rejeter la contestation (maintenir la sanction)   │    │      │
│  │  │ ○ 🔄 Transférer au Président pour décision             │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire: (obligatoire si rejet)                    │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ _______________________________________________│    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Demander plus d'infos]  [Valider ma décision]                 │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│           ┌───────────────────┼───────────────────┐                         │
│           ▼                   ▼                   ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │ ACCEPTER        │ │ REJETER         │ │ TRANSFÉRER      │               │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘               │
│           │                   │                   │                         │
│           ▼                   ▼                   ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │ ✅ Sanction     │ │ ❌ Contestation │ │ 📤 Transféré au │               │
│  │    annulée      │ │    rejetée      │ │    Président    │               │
│  │                 │ │                 │ │                 │               │
│  │ • Notification  │ │ • Notification  │ │ • Notification  │               │
│  │   au membre     │ │   au membre     │ │   au Président  │               │
│  │                 │ │   (avec motif)  │ │                 │               │
│  │ • Historique    │ │                 │ │ • En attente    │               │
│  │   mis à jour    │ │ • Sanction      │ │   décision      │               │
│  │                 │ │   maintenue     │ │                 │               │
│  │ • Si payée:     │ │                 │ │                 │               │
│  │   remboursement │ │                 │ │                 │               │
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
| RM-CS01 | Le délai de contestation est jusqu'à la séance suivante |
| RM-CS02 | Le censeur peut accepter, rejeter ou transférer au président |
| RM-CS03 | Le rejet nécessite un commentaire/motif |
| RM-CS04 | Si acceptée et déjà payée, un remboursement est initié |
| RM-CS05 | L'historique conserve la trace de la contestation |

---

# 8. FLOW 6 : ANNULATION D'UNE SANCTION

## 8.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ANNULATION D'UNE SANCTION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Censeur accède   │                                                       │
│  │ à l'historique   │                                                       │
│  │ des sanctions    │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    LISTE DES SANCTIONS                           │      │
│  │                                                                  │      │
│  │  Filtres: [Toutes ▼] [Ce mois ▼] [Tous membres ▼]               │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ Date       │ Membre        │ Type     │ Montant │ Statut│    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │ 15/03/2026 │ Paul NGOUFACK │ Retard   │ 500 XAF │⏳Impayé│   │      │
│  │  │ 15/03/2026 │ Marie NGUEMO  │ Trouble  │ 2,000   │✅Payé │    │      │
│  │  │ 01/03/2026 │ Jean KAMGA    │ Absence  │ 1,000   │⏳Impayé│   │      │
│  │  │ ...        │ ...           │ ...      │ ...     │ ...   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Clic sur une sanction pour voir les détails                   │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉTAIL DE LA SANCTION                         │      │
│  │                                                                  │      │
│  │  👤 Membre: Paul NGOUFACK                                       │      │
│  │  📅 Séance: #8 - 15 Mars 2026                                   │      │
│  │  ⚖️ Type: Retard                                                │      │
│  │  💰 Montant: 500 XAF                                            │      │
│  │  📝 Motif: Arrivée à 15:20                                      │      │
│  │  📊 Gravité: Léger                                              │      │
│  │  💳 Statut: ⏳ Non payée                                        │      │
│  │                                                                  │      │
│  │  [🗑️ Annuler cette sanction]                                   │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE D'ANNULATION                       │      │
│  │                                                                  │      │
│  │  ⚠️ Vous êtes sur le point d'annuler cette sanction.           │      │
│  │                                                                  │      │
│  │  Motif de l'annulation: (obligatoire)                          │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ○ Erreur de saisie                                      │    │      │
│  │  │ ○ Contestation acceptée                                 │    │      │
│  │  │ ○ Justificatif validé après coup                        │    │      │
│  │  │ ● Autre: [Le membre a présenté des preuves de son      │    │      │
│  │  │          arrivée à l'heure___________________________]  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ☑ Notifier le membre de l'annulation                          │      │
│  │                                                                  │      │
│  │  Si la sanction a déjà été payée:                              │      │
│  │  ○ Initier un remboursement                                    │      │
│  │  ○ Convertir en crédit pour future cotisation                  │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer l'annulation]                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ SANCTION ANNULÉE                           │      │
│  │                                                                  │      │
│  │  • Sanction marquée comme annulée                               │      │
│  │  • Motif: [Autre - preuves présentées]                         │      │
│  │  • Notification envoyée au membre                               │      │
│  │  • Historique mis à jour (sanction conservée mais annulée)     │      │
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
| RM-AN01 | Le censeur peut annuler ses propres sanctions |
| RM-AN02 | Le motif d'annulation est obligatoire |
| RM-AN03 | La sanction reste dans l'historique avec statut "Annulée" |
| RM-AN04 | Si déjà payée, remboursement ou crédit possible |
| RM-AN05 | L'annulation est tracée avec date et auteur |

---

# 9. FLOW 7 : VALIDATION DES MODIFICATIONS DE PRÉSENCE (Suite)

## 9.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: VALIDATION DES MODIFICATIONS DE PRÉSENCE           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Demande de      │                                                       │
│  │  modification    │                                                       │
│  │  de présence"    │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    LISTE DES DEMANDES EN ATTENTE                 │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DEMANDES DE MODIFICATION (3)                            │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 📋 Demande #1                                           │    │      │
│  │  │ Séance: #8 - 15 Mars 2026                              │    │      │
│  │  │ Membre: Jean KAMGA                                      │    │      │
│  │  │ Modification: Absent → Présent                          │    │      │
│  │  │ Demandé par: Secrétaire (16/03 à 10:00)                │    │      │
│  │  │ [Voir détails]                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ 📋 Demande #2                                           │    │      │
│  │  │ Séance: #8 - 15 Mars 2026                              │    │      │
│  │  │ Membre: Marie NGUEMO                                    │    │      │
│  │  │ Modification: Retard → Présent                          │    │      │
│  │  │ Demandé par: Secrétaire (16/03 à 11:30)                │    │      │
│  │  │ [Voir détails]                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ 📋 Demande #3                                           │    │      │
│  │  │ Séance: #7 - 01 Mars 2026                              │    │      │
│  │  │ Membre: Pierre FOTSO                                    │    │      │
│  │  │ Modification: Absent → Excusé                           │    │      │
│  │  │ Demandé par: Secrétaire (02/03 à 09:00)                │    │      │
│  │  │ [Voir détails]                                          │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Voir détails]                     │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉTAIL DE LA DEMANDE                          │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS DE LA DEMANDE                              │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Membre: Jean KAMGA                                   │    │      │
│  │  │ 📅 Séance: #8 - 15 Mars 2026                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Statut actuel: ❌ Absent                                │    │      │
│  │  │ Nouveau statut demandé: ✅ Présent                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Demandé par: Jean DUPONT (Secrétaire)                  │    │      │
│  │  │ Date demande: 16 Mars 2026 à 10:00                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Motif de la modification:                              │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Erreur de pointage. Le membre était présent    │    │    │      │
│  │  │ │ mais a été enregistré absent par erreur lors   │    │    │      │
│  │  │ │ de la clôture de la feuille de présence.       │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Impact si approuvé:                                    │    │      │
│  │  │ • Sanction d'absence (1,000 XAF) sera annulée         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ HISTORIQUE DU MEMBRE (cette séance)                    │    │      │
│  │  │                                                         │    │      │
│  │  │ • Pointage initial: Non pointé                         │    │      │
│  │  │ • Clôture: Marqué absent automatiquement              │    │      │
│  │  │ • Sanction appliquée: Absence (1,000 XAF) - Non payée │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉCISION                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Approuver la modification                         │    │      │
│  │  │ ○ ❌ Refuser la modification                           │    │      │
│  │  │ ○ ❓ Demander plus d'informations                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire: (obligatoire si refus)                    │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
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
│  │ APPROUVER       │ │ REFUSER         │ │ DEMANDER INFOS  │               │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘               │
│           │                   │                   │                         │
│           ▼                   ▼                   ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │ ✅ Modification │ │ ❌ Modification │ │ 📨 Message      │               │
│  │    appliquée    │ │    refusée      │ │    envoyé au    │               │
│  │                 │ │                 │ │    Secrétaire   │               │
│  │ • Présence mise │ │ • Notification  │ │                 │               │
│  │   à jour        │ │   au Secrétaire │ │ • Demande en    │               │
│  │                 │ │                 │ │   attente de    │               │
│  │ • Sanction      │ │ • Motif du      │ │   complément    │               │
│  │   annulée       │ │   refus         │ │                 │               │
│  │   automatiquement│ │   communiqué   │ │ • Question:     │               │
│  │                 │ │                 │ │   [___________] │               │
│  │ • Notification  │ │ • Présence      │ │                 │               │
│  │   au Secrétaire │ │   inchangée     │ │                 │               │
│  │   et au membre  │ │                 │ │                 │               │
│  │                 │ │ • Sanction      │ │                 │               │
│  │ • Historique    │ │   maintenue     │ │                 │               │
│  │   mis à jour    │ │                 │ │                 │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 9.2 Sous-Flow : Demande d'Informations Complémentaires

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: DEMANDE D'INFORMATIONS                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE DE DEMANDE                         │      │
│  │                                                                  │      │
│  │  Demande d'informations complémentaires au Secrétaire           │      │
│  │                                                                  │      │
│  │  Question / Demande:                                            │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ Pouvez-vous fournir des preuves de la présence du      │    │      │
│  │  │ membre ? (Photo, témoignage, signature sur un          │    │      │
│  │  │ document...)                                            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Envoyer la demande]                                │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    📨 DEMANDE ENVOYÉE                            │      │
│  │                                                                  │      │
│  │  • Notification envoyée au Secrétaire                           │      │
│  │  • Statut demande: ⏳ En attente de complément                  │      │
│  │  • Vous serez notifié quand le Secrétaire répondra             │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 9.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-VP01 | Le censeur reçoit une notification pour chaque demande |
| RM-VP02 | Il peut approuver, refuser ou demander plus d'informations |
| RM-VP03 | Le refus nécessite un commentaire/motif |
| RM-VP04 | Si approuvé, la sanction associée est automatiquement annulée |
| RM-VP05 | L'historique des demandes est consultable |
| RM-VP06 | La modification ne peut se faire que jusqu'à la prochaine séance |

---

# 10. FLOW 8 : VALIDATION DES JUSTIFICATIFS D'ABSENCE

## 10.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: VALIDATION DES JUSTIFICATIFS D'ABSENCE             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Nouveau         │                                                       │
│  │  justificatif    │                                                       │
│  │  à valider"      │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────��      │
│  │                    LISTE DES JUSTIFICATIFS EN ATTENTE            │      │
│  │                                                                  │      │
│  │  ⚠️ Le Censeur valide en premier, puis le Président.           │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ JUSTIFICATIFS À VALIDER (5)                             │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 📄 Marie NGUEMO - Séance #8                             │    │      │
│  │  │    Type: Certificat médical                             │    │      │
│  │  │    Soumis: 16/03/2026                                   │    │      │
│  │  │    [Examiner]                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ 📄 Pierre FOTSO - Séance #8                             │    │      │
│  │  │    Type: Ordre de mission                               │    │      │
│  │  │    Soumis: 16/03/2026                                   │    │      │
│  │  │    [Examiner]                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ 📄 Anne MBARGA - Séance #8                              │    │      │
│  │  │    Type: Attestation                                    │    │      │
│  │  │    Soumis: 17/03/2026                                   │    │      │
│  │  │    [Examiner]                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ...                                                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Examiner]                         │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    EXAMEN DU JUSTIFICATIF                        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Membre: Marie NGUEMO                                 │    │      │
│  │  │ 📅 Séance: #8 - 15 Mars 2026                           │    │      │
│  │  │ 📊 Statut présence: ❌ Absent                          │    │      │
│  │  │ 💰 Sanction appliquée: 1,000 XAF (Non payée)           │    │      │
│  │  │                                                         │    │      │
│  │  │ Motif d'absence déclaré: Maladie                       │    │      │
│  │  │ Signalement préalable: ✅ Oui (14/03/2026)             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ JUSTIFICATIF SOUMIS                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Type de document: Certificat médical                   │    │      │
│  │  │ Format: PDF                                             │    │      │
│  │  │ Taille: 245 Ko                                          │    │      │
│  │  │ Soumis le: 16/03/2026 à 09:30                          │    │      │
│  │  │                                                         │    │      │
│  │  │ [📥 Télécharger]  [👁️ Visualiser]                      │    │      │
│  │  │                                                         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │         [APERÇU DU DOCUMENT]                   │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │    Certificat Médical                          │    │    │      │
│  │  │ │    Dr. MBALLA Paul                             │    │    │      │
│  │  │ │    ...                                         │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ └─���───────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATIONS                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Le document est lisible                               │    │      │
│  │  │ ☑ Le document est daté                                  │    │      │
│  │  │ ☑ Le document couvre la date de l'absence              │    │      │
│  │  │ ☑ Le document semble authentique                       │    │      │
│  │  │ ☐ Le document porte un cachet officiel                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉCISION DU CENSEUR                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Valider et transmettre au Président               │    │      │
│  │  │ ○ ❌ Rejeter le justificatif                           │    │      │
│  │  │ ○ 📝 Demander un complément au membre                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire: (obligatoire si rejet)                    │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Document conforme. Certificat médical valide   │    │    │      │
│  │  │ │ couvrant la date de la séance.                 │    │    │      │
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
│  │ VALIDER         │ │ REJETER         │ │ DEMANDER        │               │
│  │ (→ Président)   │ │                 │ │ COMPLÉMENT      │               │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘               │
│           │                   │                   │                         │
│           ▼                   ▼                   ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │ 📤 Transféré au │ │ ❌ Justificatif │ │ 📨 Demande      │               │
│  │    Président    │ │    rejeté       │ │    envoyée      │               │
│  │                 │ │                 │ │                 │               │
│  │ • Notification  │ │ • Notification  │ │ • Notification  │               │
│  │   au Président  │ │   au membre     │ │   au membre     │               │
│  │                 │ │                 │ │                 │               │
│  │ • Statut:       │ │ • Motif du      │ │ • Délai pour    │               │
│  │   En attente    │ │   rejet         │ │   compléter     │               │
│  │   validation    │ │   communiqué    │ │                 │               │
│  │   Président     │ │                 │ │ • Peut soumettre│               │
│  │                 │ │ • Peut soumettre│ │   nouveau doc   │               │
│  │                 │ │   nouveau justif│ │                 │               │
│  └────────┬────────┘ └─────────────────┘ └─────────────────┘               │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ÉTAPE 2: VALIDATION PRÉSIDENT                 │      │
│  │                                                                  │      │
│  │  Le Président examine le justificatif                           │      │
│  │  (déjà validé par le Censeur)                                   │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ APPROUVE                 REFUSE │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ JUSTIFICATIF      │          │ ❌ Justificatif      │                │
│  │    VALIDÉ            │          │    refusé            │                │
│  │                      │          │                      │                │
│  │ • Absence excusée    │          │ • Notification au    │                │
│  │                      │          │   Censeur et membre  │                │
│  │ • Sanction annulée   │          │                      │                │
│  │   automatiquement    │          │ • Peut soumettre     │                │
│  │                      │          │   nouveau justif     │                │
│  │ • Notification au    │          │                      │                │
│  │   Censeur et membre  │          │ • Sanction maintenue │                │
│  │                      │          │                      │                │
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

## 10.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-VJ01 | Le censeur valide en premier, avant le président |
| RM-VJ02 | Les deux validations (Censeur + Président) sont nécessaires |
| RM-VJ03 | Le censeur peut déléguer uniquement à son vice |
| RM-VJ04 | Si rejeté par le censeur, pas de transmission au président |
| RM-VJ05 | Le membre peut soumettre un nouveau justificatif si rejeté |
| RM-VJ06 | La validation finale annule automatiquement la sanction |

---

# 11. FLOW 9 : SUIVI DES SANCTIONS IMPAYÉES

## 11.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: SUIVI DES SANCTIONS IMPAYÉES                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Censeur accède   │                                                       │
│  │ "Sanctions       │                                                       │
│  │  impayées"       │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    TABLEAU DE BORD SANCTIONS IMPAYÉES            │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉSUMÉ                                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Nombre total de sanctions impayées: 8                   │    │      │
│  │  │ Montant total: 45,000 XAF                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Par ancienneté:                                        │    │      │
│  │  │ • < 30 jours: 3 sanctions (12,000 XAF)                 │    │      │
│  │  │ • 30-60 jours: 3 sanctions (18,000 XAF)                │    │      │
│  │  │ • > 60 jours: 2 sanctions (15,000 XAF) ⚠️              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ LISTE DÉTAILLÉE                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Filtres: [Tous ▼] [Toutes séances ▼] [Tri: Ancienneté ▼]│   │      │
│  │  │                                                         │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │ Membre        │ Séance │ Type    │ Montant │ Depuis    │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │ ⚠️ Jean KAMGA │ #5     │ Absence │ 10,000  │ 75 jours  │    │      │
│  │  │    [Voir] [Rappel]                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ Paul NGOU. │ #6     │ Retard  │ 5,000   │ 62 jours  │    │      │
│  │  │    [Voir] [Rappel]                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Marie NGUEMO  │ #7     │ Trouble │ 8,000   │ 45 jours  │    │      │
│  │  │    [Voir] [Rappel]                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Pierre FOTSO  │ #7     │ Absence │ 5,000   │ 38 jours  │    │      │
│  │  │    [Voir] [Rappel]                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Anne MBARGA   │ #7     │ Retard  │ 5,000   │ 32 jours  │    │      │
│  │  │    [Voir] [Rappel]                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Robert TCHANA │ #8     │ Retard  │ 2,000   │ 15 jours  │    │      │
│  │  │    [Voir] [Rappel]                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Claire ESSOM. │ #8     │ Absence │ 5,000   │ 10 jours  │    │      │
│  │  │    [Voir] [Rappel]                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Michel ATAN.  │ #8     │ Trouble │ 5,000   │ 8 jours   │    │      │
│  │  │    [Voir] [Rappel]                                      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [📧 Envoyer rappel groupé]  [📊 Exporter la liste]             │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└──────────────────────────────────��──────────────────────────────────────────┘
```

## 11.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-SI01 | Les sanctions impayées sont classées par ancienneté |
| RM-SI02 | Les sanctions > 60 jours sont marquées comme critiques (⚠️) |
| RM-SI03 | Le censeur peut envoyer des rappels individuels ou groupés |
| RM-SI04 | La liste peut être exportée (PDF, Excel) |

---

# 12. FLOW 10 : ENVOI DE RAPPELS DE PAIEMENT

## 12.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ENVOI DE RAPPELS DE PAIEMENT                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Censeur clique   │                                                       │
│  │ "Envoyer rappel" │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│    ┌──────────────┐                                                         │
│    │ Type de      │                                                         │
│    │ rappel ?     │                                                         │
│    └──────┬───────┘                                                         │
│           │                                                                 │
│    ┌──────┴──────┐                                                          │
│    │ INDIVIDUEL  │  GROUPÉ                                                  │
│    ▼             ▼                                                          │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐          │
│  │ RAPPEL INDIVIDUEL          │  │ RAPPEL GROUPÉ               │          │
│  │                             │  │                             │          │
│  │ Membre: Jean KAMGA          │  │ Sélection:                  │          │
│  │                             │  │ ☑ Tous (8 membres)         │          │
│  │ Sanctions impayées: 2       │  │ ☐ > 30 jours (5 membres)   │          │
│  │ Montant total: 15,000 XAF   │  │ ☐ > 60 jours (2 membres)   │          │
│  │                             │  │                             │          │
│  │ Détail:                     │  │ Membres sélectionnés: 8    │          │
│  │ • Absence #5: 10,000 XAF    │  │ Montant total: 45,000 XAF  │          │
│  │ • Retard #7: 5,000 XAF      │  │                             │          │
│  └─────────────────────────────┘  └─────────────────────────────┘          │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PERSONNALISATION DU MESSAGE                   │      │
│  │                                                                  │      │
│  │  Modèle: [Rappel standard ▼]                                    │      │
│  │                                                                  │      │
│  │  Message:                                                        │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ Cher(e) {nom_membre},                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Nous vous rappelons que vous avez des sanctions        │    │      │
│  │  │ impayées d'un montant total de {montant_total} XAF.    │    │      │
│  │  │                                                         │    │      │
│  │  │ Détail:                                                 │    │      │
│  │  │ {liste_sanctions}                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Nous vous prions de régulariser votre situation       │    │      │
│  │  │ avant la prochaine séance.                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Le Censeur                                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Canaux d'envoi:                                                │      │
│  │  ☑ SMS  ☑ Email  ☑ Push  ☐ WhatsApp                            │      │
│  │                                                                  │      │
│  │  [Annuler]  [Prévisualiser]  [Envoyer]                          │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ RAPPEL(S) ENVOYÉ(S)                        │      │
│  │                                                                  │      │
│  │  • Rappel envoyé à 8 membre(s)                                  │      │
│  │  • Canaux utilisés: SMS, Email, Push                           │      │
│  │  • Historique mis à jour                                        │      │
│  │                                                                  │      │
│  │  Prochaine étape suggérée:                                      │      │
│  │  Vérifier les paiements lors de la prochaine séance            │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 12.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-RP01 | Le censeur peut envoyer des rappels individuels ou groupés |
| RM-RP02 | Le message peut être personnalisé |
| RM-RP03 | Les variables {nom_membre}, {montant_total}, {liste_sanctions} sont remplacées automatiquement |
| RM-RP04 | L'historique des rappels envoyés est conservé |
| RM-RP05 | Plusieurs canaux peuvent être sélectionnés |

---

# 13. FLOW 11 : GÉNÉRATION DU RAPPORT DU CENSEUR

## 13.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GÉNÉRATION DU RAPPORT DU CENSEUR                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Censeur clique   │                                                       │
│  │ "Générer         │                                                       │
│  │  rapport"        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SÉLECTION DE LA PÉRIODE                       │      │
│  │                                                                  │      │
│  │  Rapport pour:                                                  │      │
│  │  ● Dernière séance (#8 - 15 Mars 2026)                         │      │
│  │  ○ Période personnalisée                                        │      │
│  │    Du: [__/__/____] Au: [__/__/____]                           │      │
│  │  ○ Cycle complet (#2)                                          │      │
│  │                                                                  │      │
│  │  [Générer le rapport]                                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    RAPPORT GÉNÉRÉ AUTOMATIQUEMENT                │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RAPPORT DU CENSEUR                                      │    │      │
│  │  │ Séance #8 - 15 Mars 2026                                │    │      │
│  │  │ Tontine: [Nom de la Tontine]                            │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 📊 RÉSUMÉ DE LA SÉANCE                                  │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Sanctions appliquées: 7                                 │    │      │
│  │  │ Montant total: 12,500 XAF                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Répartition:                                           │    │      │
│  │  │ • Retards: 4 (2,000 XAF)                               │    │      │
│  │  │ • Absences: 2 (2,000 XAF)                              │    │      │
│  │  │ • Troubles: 1 (2,000 XAF)                              │    │      │
│  │  │ • Avertissements: 0 (non financier)                    │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚖️ LISTE DES SANCTIONS DE LA SÉANCE                    │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ # │ Membre        │ Type    │ Montant │ Gravité│ Statut │   │      │
│  │  │ 1 │ Marie NGUEMO  │ Retard  │ 500     │ Léger  │ Impayé │   │      │
│  │  │ 2 │ Pierre FOTSO  │ Retard  │ 500     │ Léger  │ Payé   │   │      │
│  │  │ 3 │ Anne MBARGA   │ Retard  │ 500     │ Léger  │ Impayé │   │      │
│  │  │ 4 │ Robert TCHANA │ Retard  │ 500     │ Léger  │ Payé   │   │      │
│  │  │ 5 │ Paul BIYA     │ Absence │ 1,000   │ Moyen  │ Impayé │   │      │
│  │  │ 6 │ David NKOA    │ Absence │ 1,000   │ Moyen  │ Impayé │   │      │
│  │  │ 7 │ Paul NGOUFACK │ Trouble │ 2,000   │ Moyen  │ Impayé │   │      │
│  │  │                                                         │    │      │
│  │  │ 💰 SANCTIONS IMPAYÉES (CUMUL)                          │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Total sanctions impayées: 8                            │    │      │
│  │  │ Montant cumulé: 45,000 XAF                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Membres avec sanctions impayées:                       │    │      │
│  │  │ • Jean KAMGA: 15,000 XAF (2 sanctions)                 │    │      │
│  │  │ • Paul NGOUFACK: 10,000 XAF (2 sanctions)              │    │      │
│  │  │ • Marie NGUEMO: 8,500 XAF (2 sanctions)                │    │      │
│  │  │ • Autres: 11,500 XAF (2 sanctions)                     │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ MEMBRES À RISQUE                                    │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Les membres suivants ont un historique de sanctions    │    │      │
│  │  │ préoccupant:                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ • Jean KAMGA: 5 sanctions ce cycle, 15,000 XAF impayés│    │      │
│  │  │ • Paul NGOUFACK: 4 sanctions ce cycle                  │    │      │
│  │  │                                                         │    │      │
│  │  │ 📝 OBSERVATIONS                                        │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ [Zone de texte pour observations du censeur]   │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ La discipline générale est satisfaisante.      │    │    │      │
│  │  │ │ Toutefois, je recommande une attention         │    │    │      │
│  │  │ │ particulière sur les retards récurrents.       │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Fait le: 15 Mars 2026                                  │    │      │
│  │  │ Le Censeur: [Nom du Censeur]                           │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Modifier observations]  [📄 Exporter PDF]  [📊 Exporter Excel] │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 13.2 Contenu du Rapport (Généré Automatiquement)

| Section | Contenu | Source |
|---------|---------|--------|
| Résumé | Nombre et montant des sanctions | Automatique |
| Liste des sanctions | Détail de chaque sanction de la période | Automatique |
| Sanctions impayées | Cumul des impayés | Automatique |
| Membres à risque | Membres avec historique préoccupant | Automatique |
| Observations | Commentaires du censeur | Manuel |

## 13.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-RC01 | Le rapport est généré automatiquement |
| RM-RC02 | Le censeur peut ajouter des observations manuelles |
| RM-RC03 | Le rapport peut être exporté en PDF ou Excel |
| RM-RC04 | Le rapport est présenté à chaque séance |

---

# 14. FLOW 12 : COMMUNICATION ET AVERTISSEMENTS

## 14.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: COMMUNICATION ET AVERTISSEMENTS                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Censeur accède   │                                                       │
│  │ "Communication"  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    MODULE COMMUNICATION                          │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ACTIONS DISPONIBLES                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ [📨 Nouvel avertissement]                               │    │      │
│  │  │ [💰 Rappel sanctions impayées]                          │    │      │
│  │  │ [📋 Historique des communications]                      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│           ┌───────────────────┼───────────────────┐                         │
│           ▼                   ▼                   ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │ AVERTISSEMENT   │ │ RAPPEL IMPAYÉS  │ │ HISTORIQUE      │               │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘               │
│           │                   │                   │                         │
│           ▼                   │                   ▼                         │
│  ┌─────────────────────┐      │      ┌─────────────────────┐               │
│  │ FORMULAIRE          │      │      │ LISTE DES           │               │
│  │ AVERTISSEMENT       │      │      │ COMMUNICATIONS      │               │
│  │                     │      │      │                     │               │
│  │ Destinataire:       │      │      │ Filtres:            │               │
│  │ ○ Un membre         │      │      │ [Tous ▼] [Ce mois▼] │               │
│  │ ○ Plusieurs membres │      │      │                     │               │
│  │ ○ Tous les membres  │      │      │ • 15/03 - Rappel    │               │
│  │                     │      │      │   Jean KAMGA        │               │
│  │ Type:               │      │      │ • 10/03 - Avertiss. │               │
│  │ ○ Avertissement     │      │      │   Paul NGOUFACK     │               │
│  │ ○ Rappel à l'ordre  │      │      │ • 05/03 - Rappel    │               │
│  │ ○ Information       │      │      │   groupé (5 membres)│               │
│  │                     │      │      │                     │               │
│  │ Objet:              │      │      │ [Exporter]          │               │
│  │ [________________]  │      │      │                     │               │
│  │                     │      │      └─────────────────────┘               │
│  │ Message:            │      │                                             │
│  │ ┌─────────────────┐ │      │                                             │
│  │ │                 │ │      │                                             │
│  │ │                 │ │      │                                             │
│  │ └─────────────────┘ │      │                                             │
│  │                     │      │                                             │
│  │ Canaux:             │      │                                             │
│  │ ☑ SMS ☑ Email      │       │                                             │
│  │ ☑ Push ☐ WhatsApp  │       │                                             │
│  │                     │      │                                             │
│  │ [Annuler] [Envoyer] │      │                                             │
│  └─────────────────────┘      │                                             │
│           │                   │                                             │
│           ▼                   │                                             │
│  ┌─────────────────────┐      │                                             │
│  │ ✅ MESSAGE ENVOYÉ   │      │                                             │
│  │                     │◄─────┘                                             │
│  │ • Notification      │   (→ Flow #10)                                     │
│  │   envoyée           │                                                    │
│  │ • Historique mis    │                                                    │
│  │   à jour            │                                                    │
│  └─────────────────────┘                                                    │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 14.2 Types de Communications

| Type | Description | Destinataires |
|------|-------------|---------------|
| Avertissement | Message formel de mise en garde | Individuel |
| Rappel à l'ordre | Rappel des règles | Individuel ou groupe |
| Rappel impayés | Rappel des sanctions à payer | Individuel ou groupe |
| Information | Message informatif | Tous |

## 14.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-CO01 | Le censeur peut envoyer des messages individuels ou groupés |
| RM-CO02 | Tous les messages sont archivés dans l'historique |
| RM-CO03 | Le censeur peut consulter l'historique de ses communications |
| RM-CO04 | Plusieurs canaux peuvent être utilisés simultanément |

---

# 15. FLOW 13 : NOTIFICATION D'ANNULATION PAR PRÉSIDENT/ASSEMBLÉE

## 15.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│          FLOW: NOTIFICATION D'ANNULATION PAR PRÉSIDENT/ASSEMBLÉE            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONTEXTE                                      │      │
│  │                                                                  │      │
│  │  Le Président ou l'Assemblée a annulé une sanction              │      │
│  │  appliquée par le Censeur.                                      │      │
│  │                                                                  │      │
│  │  Cette décision est définitive et ne peut pas être contestée    │      │
│  │  par le Censeur.                                                │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    🔔 NOTIFICATION REÇUE                         │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ANNULATION DE SANCTION                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Une sanction que vous avez appliquée a été annulée.    │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Membre concerné: Jean KAMGA                         │    │      │
│  │  │ 📅 Séance: #8 - 15 Mars 2026                           │    │      │
│  │  │ ⚖️ Type de sanction: Trouble à l'ordre                 │    │      │
│  │  │ 💰 Montant: 2,000 XAF                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Annulée par: Président (ou Assemblée)                  │    │      │
│  │  │ Date d'annulation: 20 Mars 2026 à 14:30                │    │      │
│  │  │                                                         │    │      │
│  │  │ Motif de l'annulation:                                 │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Après examen des faits par le bureau, il a été │    │    │      │
│  │  │ │ décidé que la sanction était disproportionnée  │    │    │      │
│  │  │ │ par rapport à l'incident.                       │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir les détails]  [Marquer comme lu]                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉTAILS DE L'ANNULATION                       │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SANCTION ORIGINALE                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Appliquée le: 15 Mars 2026 à 16:30                     │    │      │
│  │  │ Type: Trouble à l'ordre                                │    │      │
│  │  │ Montant: 2,000 XAF                                     │    │      │
│  │  │ Gravité: Moyen                                         │    │      │
│  │  │ Motif: Altercation verbale avec un autre membre        │    │      │
│  │  │ Statut paiement: Non payée                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉCISION D'ANNULATION                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Annulée par: M. Pierre FOTSO (Président)               │    │      │
│  │  │ Date: 20 Mars 2026 à 14:30                             │    │      │
│  │  │ Motif: Sanction jugée disproportionnée                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Contexte:                                              │    │      │
│  │  │ Suite à la contestation du membre et après examen     │    │      │
│  │  │ des témoignages, le président a jugé que la sanction  │    │      │
│  │  │ devait être annulée.                                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ HISTORIQUE / TRAÇABILITÉ                               │    │      │
│  │  │                                                         │    │      │
│  │  │ 15/03 16:30 - Sanction appliquée par Censeur          │    │      │
│  │  │ 15/03 16:35 - Notification envoyée au membre          │    │      │
│  │  │ 16/03 10:00 - Contestation soumise par le membre      │    │      │
│  │  │ 18/03 14:00 - Contestation transférée au Président    │    │      │
│  │  │ 20/03 14:30 - Sanction annulée par le Président       │    │      │
│  │  │ 20/03 14:30 - Notification envoyée au Censeur         │    │      │
│  │  │ 20/03 14:30 - Notification envoyée au membre          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ⚠️ Cette décision est définitive et ne peut pas être          │      │
│  │     contestée.                                                  │      │
│  │                                                                  │      │
│  │  [Fermer]                                                       │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────────────────────────────────────���───────────────────────┐      │
│  │                    MISE À JOUR AUTOMATIQUE                       │      │
│  │                                                                  │      │
│  │  • Sanction marquée comme "Annulée" dans l'historique          │      │
│  │  • Tableau de bord mis à jour                                   │      │
│  │  • Rapport du censeur mis à jour                                │      │
│  │  • Si sanction était payée: remboursement initié               │      │
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
| RM-NA01 | Le censeur est notifié de toute annulation de ses sanctions |
| RM-NA02 | L'annulation par le Président ou l'Assemblée est définitive |
| RM-NA03 | Le censeur ne peut pas contester l'annulation |
| RM-NA04 | L'annulation est tracée dans l'historique avec tous les détails |
| RM-NA05 | Si la sanction était payée, un remboursement est initié automatiquement |
| RM-NA06 | Le tableau de bord et les rapports sont mis à jour automatiquement |

---

# 16. RÉCAPITULATIF DES ÉCRANS

## 16.1 Liste des Écrans du Censeur

| # | Écran | Description | Accès |
|---|-------|-------------|-------|
| E-CE01 | Tableau de bord | Vue d'ensemble des sanctions et tâches | Menu principal |
| E-CE02 | Liste des sanctions | Historique de toutes les sanctions | Tableau de bord |
| E-CE03 | Formulaire de sanction | Application d'une nouvelle sanction | Pendant séance |
| E-CE04 | Confirmation sanctions auto | Validation des retards/absences détectés | Après clôture présences |
| E-CE05 | Sanction personnalisée | Création d'une sanction non prédéfinie | Pendant séance |
| E-CE06 | Sanctions multiples | Application de plusieurs sanctions | Pendant séance |
| E-CE07 | Détail contestation | Examen d'une contestation | Notifications |
| E-CE08 | Annulation sanction | Formulaire d'annulation | Détail sanction |
| E-CE09 | Demandes modification présence | Liste des demandes du secrétaire | Notifications |
| E-CE10 | Validation justificatif | Examen d'un justificatif d'absence | Notifications |
| E-CE11 | Sanctions impayées | Tableau de bord des impayés | Menu principal |
| E-CE12 | Envoi de rappels | Formulaire de rappel de paiement | Sanctions impayées |
| E-CE13 | Rapport du censeur | Rapport généré automatiquement | Menu principal |
| E-CE14 | Communication | Envoi d'avertissements | Menu principal |
| E-CE15 | Historique communications | Liste des messages envoyés | Communication |
| E-CE16 | Notification annulation | Détail d'une annulation externe | Notifications |
| E-CE17 | Cycles / Séances | Consultation lecture seule des cycles et séances | Sidebar › Séances |
| E-CE18 | Détail séance | Ordre du jour, présences, cotisations (lecture seule) | Liste séances |

## 16.1b Accès Consultation des Séances

Le Censeur dispose d'un accès **lecture seule** à la vue cycles/séances (identique à la vue Membre). Cet accès lui permet de vérifier les présences et l'ordre du jour d'une séance pour contextualiser ses décisions disciplinaires.

| Élément | Détail |
|---------|--------|
| Entrée | Sidebar › Discipline › **Séances** |
| Vue | Liste cycles (accordéon) → liste séances → détail séance |
| Onglets disponibles | Ordre du jour · Présences · Cotisations |
| Droit | Lecture seule — aucune saisie possible depuis cette vue |

> Voir **Flow 24 (Flows_Membre.md)** pour la description complète de la navigation.

## 16.2 Navigation du Censeur

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NAVIGATION - CENSEUR                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         MENU PRINCIPAL                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│       ┌────────────────────────────┼────────────────────────────┐          │
│       │              │             │             │              │          │
│       ▼              ▼             ▼             ▼              ▼          │
│  ┌─────────┐   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │Tableau  │   │Sanctions │  │Sanctions │  │Rapports  │  │Communi-  │     │
│  │de bord  │   │          │  │impayées  │  │          │  │cation    │     │
│  └────┬────┘   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │             │             │             │              │           │
│       │        ┌────┴────┐        │             │         ┌────┴────┐     │
│       │        ▼         ▼        │             │         ▼         ▼     │
│       │   ┌────────┐┌────────┐    │             │    ┌────────┐┌────────┐ │
│       │   │Appliquer││Histori-│   │             │    │Nouveau ││Histori-│ │
│       │   │sanction ││que     │   │             │    │message ││que     │ │
│       │   └────────┘└────────┘    │             │    └────────┘└────────┘ │
│       │                           │             │                          │
│       │                      ┌────┴────┐   ┌────┴────┐                     │
│       │                      ▼         ▼   ▼         ▼                     │
│       │                 ┌────────┐┌────────┐┌────────┐┌────────┐          │
│       │                 │Voir    ││Envoyer ││Générer │���Exporter│          │
│       │                 │détails ││rappels ││rapport ││PDF     │          │
│       │                 └────────┘└────────┘└────────┘└────────┘          │
│       │                                                                    │
│       │    ┌───────────────────────────────────────────────────────┐      │
│       └───►│                   NOTIFICATIONS                       │      │
│            │  • Demandes modification présence                     │      │
│            │  • Justificatifs à valider                           │      │
│            │  • Contestations de sanctions                        │      │
│            │  • Annulations par Président/Assemblée               │      │
│            └───────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 17. RÈGLES MÉTIER - RÉCAPITULATIF GLOBAL

## 17.1 Règles d'Application des Sanctions

| Code | Règle |
|------|-------|
| RM-AS01 | Les sanctions ne peuvent être appliquées que pendant une séance active |
| RM-AS02 | Le motif/description est obligatoire |
| RM-AS03 | Le membre est notifié immédiatement sur tous les canaux |
| RM-AS04 | Plusieurs sanctions peuvent être appliquées au même membre |
| RM-AS05 | Le censeur doit confirmer manuellement les sanctions automatiques |
| RM-AS06 | Les sanctions personnalisées peuvent être financières ou non |

## 17.2 Règles de Contestation et Annulation

| Code | Règle |
|------|-------|
| RM-CS01 | Le délai de contestation est jusqu'à la séance suivante |
| RM-CS02 | Le censeur peut accepter, rejeter ou transférer au président |
| RM-CS03 | Le rejet nécessite un commentaire/motif |
| RM-AN01 | Le censeur peut annuler ses propres sanctions |
| RM-AN02 | L'annulation par le Président/Assemblée est définitive |
| RM-AN03 | Toute annulation est tracée dans l'historique |

## 17.3 Règles de Validation

| Code | Règle |
|------|-------|
| RM-VP01 | Le censeur reçoit une notification pour chaque demande de modification |
| RM-VP02 | Il peut approuver, refuser ou demander plus d'informations |
| RM-VJ01 | Le censeur valide les justificatifs avant le président |
| RM-VJ02 | Les deux validations (Censeur + Président) sont nécessaires |
| RM-VJ03 | Le censeur peut déléguer uniquement à son vice |

## 17.4 Règles de Communication

| Code | Règle |
|------|-------|
| RM-CO01 | Le censeur peut envoyer des messages individuels ou groupés |
| RM-CO02 | Tous les messages sont archivés dans l'historique |
| RM-RP01 | Les rappels de paiement peuvent être personnalisés |
| RM-RC01 | Le rapport est généré automatiquement |
| RM-RC02 | Le censeur peut ajouter des observations manuelles |

---

# 18. NOTIFICATIONS DU CENSEUR

## 18.1 Notifications Reçues

| Événement | Source | Priorité |
|-----------|--------|----------|
| Demande de modification de présence | Secrétaire | Haute |
| Nouveau justificatif à valider | Membre | Haute |
| Contestation de sanction | Membre | Haute |
| Sanction annulée par Président | Président | Normale |
| Sanction annulée par Assemblée | Assemblée | Normale |
| Réponse du secrétaire (infos complémentaires) | Secrétaire | Normale |
| Paiement d'une sanction | Système | Basse |

## 18.2 Notifications Envoyées

| Événement | Destinataire | Canaux |
|-----------|--------------|--------|
| Application d'une sanction | Membre concerné | SMS, Push, Email |
| Rejet de contestation | Membre concerné | SMS, Push, Email |
| Acceptation de contestation | Membre concerné | SMS, Push, Email |
| Rappel de paiement | Membre(s) concerné(s) | SMS, Push, Email |
| Avertissement | Membre(s) concerné(s) | SMS, Push, Email |
| Validation justificatif (→ Président) | Président | Push, Email |
| Demande d'infos au secrétaire | Secrétaire | Push, Email |

---

# 19. INTÉGRATIONS AVEC AUTRES RÔLES

## 19.1 Interactions avec le Secrétaire

```
┌────────────��────────────────────────────────────────────────────────────────┐
│                    INTERACTIONS CENSEUR ↔ SECRÉTAIRE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SECRÉTAIRE                              CENSEUR                            │
│  ──────────                              ───────                            │
│                                                                             │
│  Clôture feuille présence ─────────────► Reçoit sanctions à confirmer      │
│                                                                             │
│  Demande modification présence ────────► Valide ou refuse                  │
│                                                                             │
│  Transmet justificatif ────────────────► Valide ou refuse                  │
│                                          (puis → Président)                │
│                                                                             │
│  Répond demande d'infos ◄──────────────  Demande infos complémentaires     │
│                                                                             │
│  Intègre au PV ◄───────────────────────  Rapport du censeur                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 19.2 Interactions avec le Président

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERACTIONS CENSEUR ↔ PRÉSIDENT                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CENSEUR                                 PRÉSIDENT                          │
│  ───────                                 ─────────                          │
│                                                                             │
│  Transfère contestation ───────────────► Décide (accepter/refuser)         │
│                                                                             │
│  Valide justificatif ───────────��──────► Valide définitivement             │
│                                                                             │
│  Reçoit notification ◄─────────────────  Annule une sanction               │
│                                                                             │
│  Présente rapport ─────────────────────► Prend connaissance                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 19.3 Interactions avec le Trésorier

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERACTIONS CENSEUR ↔ TRÉSORIER                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CENSEUR                                 TRÉSORIER                          │
│  ───────                                 ─────────                          │
│                                                                             │
│  Applique sanction ────────────────────► Reçoit notification               │
│                                          (sanction à collecter)            │
│                                                                             │
│  Reçoit notification ◄───��─────────────  Enregistre paiement sanction      │
│  (sanction payée)                                                          │
│                                                                             ��
│  Annule sanction ──────────────────────► Initie remboursement              │
│  (si déjà payée)                         (si nécessaire)                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 20. CAS D'ERREUR ET EXCEPTIONS

## 20.1 Cas d'Erreur Possibles

| Cas | Message | Action |
|-----|---------|--------|
| Application sanction hors séance | "Les sanctions ne peuvent être appliquées que pendant une séance active." | Bloquer l'action |
| Sanction sans motif | "Le motif est obligatoire." | Bloquer l'enregistrement |
| Modification présence hors délai | "Le délai de modification est dépassé (prochaine séance)." | Bloquer l'action |
| Justificatif format non supporté | "Format non supporté. Formats acceptés: PDF, JPG, PNG." | Demander nouveau fichier |
| Contestation hors délai | "Le délai de contestation est dépassé." | Bloquer la contestation |

## 20.2 Gestion des Conflits

| Conflit | Résolution |
|---------|------------|
| Sanction déjà payée puis annulée | Initier un remboursement automatique |
| Double sanction pour même fait | Alerte au censeur, demander confirmation |
| Justificatif validé après sanction payée | Initier remboursement |
| Modification présence après PV signé | Nécessite nouvelle signature du PV |

---

# FIN DU DOCUMENT - FLOWS DU CENSEUR
# 🟢 FLOWS COMPLETS DU MEMBRE
## Application de Gestion de Tontine - Cameroun
### Version 1.0 | Mars 2026

---

# TABLE DES MATIÈRES

1. [Vue d'Ensemble](#1-vue-densemble)
2. [Tableau de Bord du Membre](#2-tableau-de-bord-du-membre)
3. [Flow 1 : Inscription et Adhésion](#3-flow-1--inscription-et-adhésion)
4. [Flow 2 : Paiement de Cotisation](#4-flow-2--paiement-de-cotisation)
5. [Flow 3 : Consultation Historique Cotisations](#5-flow-3--consultation-historique-cotisations)
6. [Flow 4 : Consultation Planning des Tours](#6-flow-4--consultation-planning-des-tours)
7. [Flow 5 : Échange de Tour de Cagnotte](#7-flow-5--échange-de-tour-de-cagnotte)
8. [Flow 6 : Réception de la Cagnotte](#8-flow-6--réception-de-la-cagnotte)
9. [Flow 7 : Simulation de Prêt](#9-flow-7--simulation-de-prêt)
10. [Flow 8 : Demande de Prêt](#10-flow-8--demande-de-prêt)
11. [Flow 9 : Remboursement de Prêt](#11-flow-9--remboursement-de-prêt)
12. [Flow 10 : Signalement d'Événement](#12-flow-10--signalement-dévénement)
13. [Flow 11 : Demande d'Aide Sociale](#13-flow-11--demande-daide-sociale)
14. [Flow 12 : Contribution Cotisation Extraordinaire](#14-flow-12--contribution-cotisation-extraordinaire)
15. [Flow 13 : Signalement d'Absence](#15-flow-13--signalement-dabsence)
16. [Flow 14 : Soumission de Justificatif](#16-flow-14--soumission-de-justificatif)
17. [Flow 15 : Consultation des Sanctions](#17-flow-15--consultation-des-sanctions)
18. [Flow 16 : Contestation de Sanction](#18-flow-16--contestation-de-sanction)
19. [Flow 17 : Paiement de Sanction](#19-flow-17--paiement-de-sanction)
20. [Flow 18 : Confirmation de Présence](#20-flow-18--confirmation-de-présence)
21. [Flow 19 : Vote en Ligne](#21-flow-19--vote-en-ligne)
22. [Flow 20 : Consultation Documents](#22-flow-20--consultation-documents)
23. [Flow 21 : Communication avec le Bureau](#23-flow-21--communication-avec-le-bureau)
24. [Flow 22 : Gestion du Profil](#24-flow-22--gestion-du-profil)
25. [Flow 23 : Démission](#25-flow-23--démission)
26. [Flow 24 : Consultation des Séances](#26-flow-24--consultation-des-séances)
27. [Récapitulatif des Écrans](#27-récapitulatif-des-écrans)
28. [Règles Métier et Notifications](#28-règles-métier-et-notifications)

---

# 1. VUE D'ENSEMBLE

## 1.1 Rôle du Membre

Le Membre est le cœur de la tontine. Il cotise régulièrement, reçoit sa cagnotte à son tour, peut demander des prêts, participe aux décisions et bénéficie de la solidarité du groupe.

## 1.2 Caractéristiques du Rôle

| Caractéristique | Description |
|-----------------|-------------|
| Statut | Membre actif de la tontine |
| Adhésion | Par invitation + validation Bureau |
| Frais d'adhésion | Oui (montant configurable) |
| Période d'essai | Non, actif immédiatement |
| Documents requis | Pièce d'identité, photo |
| Parrainage | Non obligatoire |

## 1.3 Résumé des Fonctionnalités

| Domaine | Fonctionnalité |
|---------|----------------|
| Cotisations | Payer (Mobile Money, espèces, virement), avance, partiel, historique |
| Cagnotte | Voir planning, échanger tour, choisir mode réception, confirmer |
| Prêts | Simuler, demander, désigner garants, rembourser, voir état |
| Aide sociale | Signaler événement, demander aide, contribuer cotisation extra |
| Sanctions | Voir, contester, payer |
| Absences | Signaler, soumettre justificatif, suivre statut |
| Séances | Confirmer présence, voter, voir ordre du jour |
| Documents | Voir annonces, PV, rapports |
| Communication | Contacter Bureau |
| Profil | Modifier infos, préférences notifications |
| Départ | Démissionner |

## 1.4 Liste des Flows

| # | Flow | Description |
|---|------|-------------|
| 1 | Inscription et Adhésion | Rejoindre la tontine |
| 2 | Paiement de Cotisation | Payer sa cotisation |
| 3 | Historique Cotisations | Voir ses paiements passés |
| 4 | Planning des Tours | Voir l'ordre de distribution |
| 5 | Échange de Tour | Permuter avec un autre membre |
| 6 | Réception Cagnotte | Recevoir sa cagnotte |
| 7 | Simulation de Prêt | Calculer un prêt |
| 8 | Demande de Prêt | Soumettre une demande |
| 9 | Remboursement Prêt | Payer ses échéances |
| 10 | Signalement Événement | Déclarer naissance, décès, etc. |
| 11 | Demande Aide Sociale | Solliciter la caisse de secours |
| 12 | Cotisation Extraordinaire | Contribuer à une collecte spéciale |
| 13 | Signalement Absence | Prévenir d'une absence |
| 14 | Soumission Justificatif | Fournir une preuve d'absence |
| 15 | Consultation Sanctions | Voir ses sanctions |
| 16 | Contestation Sanction | Contester une sanction |
| 17 | Paiement Sanction | Payer une amende |
| 18 | Confirmation Présence | Confirmer sa venue |
| 19 | Vote en Ligne | Participer aux décisions |
| 20 | Consultation Documents | Voir PV, rapports, annonces |
| 21 | Communication Bureau | Contacter les responsables |
| 22 | Gestion Profil | Modifier ses informations |
| 23 | Démission | Quitter la tontine |

---

# 2. TABLEAU DE BORD DU MEMBRE

## 2.1 Vue Générale

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TABLEAU DE BORD - MEMBRE                                 │
│                    Tontine: [Nom de la Tontine]                            │
│                    Bienvenue, Jean KAMGA                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      📢 ANNONCES RÉCENTES                           │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ • Prochaine séance: Samedi 22 Mars 2026 à 15h00                    │   │
│  │ • Cotisation extraordinaire en cours: Décès père M. BIYA           │   │
│  │ • Rappel: Confirmez votre présence avant le 20/03                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  💵 MA SITUATION COTISATIONS     │  │  🎁 MA CAGNOTTE               │    │
│  ├──────────────────────────────────┤  ├──────────────────────────────┤    │
│  │                                  │  │                              │    │
│  │  Statut: ✅ À JOUR               │  │  Mon tour: #15               │    │
│  │                                  │  │  Date prévue: 15/06/2026     │    │
│  │  Dernière cotisation:            │  │                              │    │
│  │  Séance #8 - 50,000 XAF          │  │  Montant estimé:             │    │
│  │  Payée le: 15/03/2026            │  │  ~1,800,000 XAF              │    │
│  │                                  │  │                              │    │
│  │  Prochaine cotisation:           │  │  Mode de réception:          │    │
│  │  Séance #9 - 50,000 XAF          │  │  MTN Mobile Money            │    │
│  │  Échéance: 29/03/2026            │  │  [Modifier]                  │    │
│  │                                  │  │                              │    │
│  │  [Payer maintenant]              │  │  [Voir le planning]          │    │
│  │                                  │  │                              │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  💳 MES PRÊTS                    │  │  ⚖️ MES SANCTIONS             │    │
│  ├──────────────────────────────────┤  ├──────────────────────────────┤    │
│  │                                  │  │                              │    │
│  │  Prêts en cours: 1               │  │  Sanctions impayées: 0       │    │
│  │                                  │  │                              │    │
│  │  • Prêt #008                     │  │  ✅ Aucune sanction          │    │
│  │    Restant: 140,000 XAF          │  │     en attente               │    │
│  │    Prochaine échéance:           │  │                              │    │
│  │    15/04/2026 - 70,000 XAF       │  │                              │    │
│  │                                  │  │                              │    │
│  │  [Voir détails]  [Rembourser]    │  │  [Voir historique]           │    │
│  │                                  │  │                              │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────────────┐  ┌──────────────────────────────┐    │
│  │  📅 PROCHAINE SÉANCE             │  │  🤝 COTISATION EXTRA          │    │
│  ├──────────────────────────────────┤  ├─────────────────���────────────┤    │
│  │                                  │  │                              │    │
│  │  Séance #9                       │  │  Décès père M. BIYA          │    │
│  │  📅 29 Mars 2026 à 15h00         │  │                              │    │
│  │  📍 Salle des fêtes FOUDA        │  │  Montant: 5,000 XAF          │    │
│  │                                  │  │  Date limite: 20/03/2026     │    │
│  │  Ma présence:                    │  │                              │    │
│  │  ⏳ Non confirmée                │  │  Mon statut: ⏳ Non payé     │    │
│  │                                  │  │                              │    │
│  │  [Confirmer présence]            │  │  [Payer maintenant]          │    │
│  │  [Signaler absence]              │  │                              │    │
│  │                                  │  │                              │    │
│  │  [Voir ordre du jour]            │  │                              │    │
│  └──────────────────────────────────┘  └──────────────────────────────┘    │
│                                                                             │
│  ┌──���──────────────────────────────────────────────────────────────────┐   │
│  │                      ⚡ ACTIONS RAPIDES                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  [💵 Payer cotisation]  [💳 Demander prêt]  [📅 Confirmer présence] │   │
│  │                                                                     │   │
│  │  [🆘 Signaler événement]  [📄 Voir documents]  [✉️ Contacter Bureau]│   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      📊 MON HISTORIQUE RÉCENT                       │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   ���
│  │  15/03/2026 - Cotisation séance #8 payée: 50,000 XAF ✅            │   │
│  │  15/03/2026 - Prêt #008 décaissé: 200,000 XAF                      │   │
│  │  01/03/2026 - Cotisation séance #7 payée: 50,000 XAF ✅            │   │
│  │  01/03/2026 - Échéance prêt #008 payée: 70,000 XAF ✅              │   │
│  │                                                                     │   │
│  │  [Voir tout l'historique]                                          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Indicateurs du Tableau de Bord

| Indicateur | Description | Mise à jour |
|------------|-------------|-------------|
| Situation cotisations | À jour / En retard | Temps réel |
| Prochain paiement | Montant et date | Après chaque séance |
| Position tour cagnotte | Numéro et date prévue | Après chaque distribution |
| Prêts en cours | Montant restant, prochaine échéance | Temps réel |
| Sanctions impayées | Nombre et montant | Temps réel |
| Prochaine séance | Date, lieu, confirmation | Mise à jour par Secrétaire |
| Cotisations extraordinaires | En cours, statut personnel | Temps réel |
| Annonces récentes | Messages du Bureau | Temps réel |
| Historique récent | Dernières opérations | Temps réel |

---

# 3. FLOW 1 : INSCRIPTION ET ADHÉSION

## 3.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: INSCRIPTION ET ADHÉSION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Nouveau membre   │                                                       │
│  │ reçoit une       │                                                       │
│  │ invitation       │                                                       │
│  │ (lien/code)      │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PAGE D'INVITATION                             │      │
│  │                                                                  │      │
│  │  Vous avez été invité à rejoindre la tontine:                   │      │
│  │  "[Nom de la Tontine]"                                          │      │
│  │                                                                  │      │
│  │  Invité par: Marie NGUEMO (membre depuis 2024)                  │      │
│  │                                                                  │      │
│  │  Informations sur la tontine:                                   │      │
│  │  • Cotisation: 50,000 XAF / séance                              │      │
│  │  • Fréquence: Bimensuelle                                       │      │
│  │  • Membres actuels: 45                                          │      │
│  │  • Frais d'adhésion: 10,000 XAF                                 │      │
│  │                                                                  │      │
│  │  [Rejoindre cette tontine]                                      │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CRÉATION DE COMPTE                            │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS PERSONNELLES                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Nom: [KAMGA_____________________]                       │    │      │
│  │  │ Prénom: [Jean___________________]                       │    │      │
│  │  │ Date de naissance: [15/05/1985__]                       │    │      │
│  │  │ Lieu de naissance: [Douala______]                       │    │      │
│  │  │ Sexe: ● Homme ○ Femme                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Téléphone: [+237 677 123 456___]                        │    │      │
│  │  │ Email: [jean.kamga@email.com___] (optionnel)            │    │      │
│  │  │                                                         │    │      │
│  │  │ Adresse: [Yaoundé, Quartier Bastos________________]     │    │      │
│  │  │ Profession: [Ingénieur informatique_______________]     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Continuer]                                                    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DOCUMENTS REQUIS                              │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PIÈCES À FOURNIR                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ 📷 Photo d'identité:                                    │    │      │
│  │  │    [📎 photo_identite.jpg] ✅                           │    │      │
│  │  │    [Prendre une photo]  [Choisir un fichier]           │    │      │
│  │  │                                                         │    │      │
│  │  │ 🪪 Pièce d'identité (CNI ou Passeport):                 │    │      │
│  │  │    Recto: [📎 cni_recto.jpg] ✅                         │    │      │
│  │  │    Verso: [📎 cni_verso.jpg] ✅                         │    │      │
│  │  │    [Photographier]  [Choisir un fichier]               │    │      │
│  │  │                                                         │    │      │
│  │  │ Numéro CNI: [123456789__________]                       │    │      │
│  │  │ Date d'expiration: [15/05/2030__]                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Continuer]                                                    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    INFORMATIONS DE PAIEMENT                      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MODE DE PAIEMENT PRÉFÉRÉ                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Pour les cotisations et la réception de la cagnotte:   │    │      │
│  │  │                                                         │    │      │
│  │  │ ● MTN Mobile Money                                      │    │      │
│  │  │   Numéro: [+237 677 123 456]                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Orange Money                                          │    │      │
│  │  │   Numéro: [________________]                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Compte bancaire                                       │    │      │
│  │  │   Banque: [________________]                           │    │      │
│  │  │   IBAN: [___________________]                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Continuer]                                                    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    RÈGLEMENT INTÉRIEUR                           │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÈGLEMENT DE LA TONTINE                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ [Zone de texte scrollable avec le règlement complet]   │    │      │
│  │  │                                                         │    │      │
│  │  │ Article 1: Objet de la tontine...                      │    │      │
│  │  │ Article 2: Montant des cotisations...                  │    │      │
│  │  │ Article 3: Sanctions...                                │    │      │
│  │  │ ...                                                     │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ☑ J'ai lu et j'accepte le règlement intérieur                 │      │
│  │  ☑ J'accepte les conditions générales d'utilisation            │      │
│  │                                                                  │      │
│  │  [Continuer]                                                    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PAIEMENT DES FRAIS D'ADHÉSION                 │      │
│  │                                                                  │      │
│  │  Frais d'adhésion: 10,000 XAF                                   │      │
│  │                                                                  │      │
│  │  Mode de paiement:                                              │      │
│  │  ● MTN Mobile Money (+237 677 123 456)                          │      │
│  │  ○ Orange Money                                                 │      │
│  │  ○ Paiement lors de la prochaine séance                         │      │
│  │                                                                  │      │
│  │  [Payer maintenant]                                             │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    📤 DEMANDE SOUMISE                            │      │
│  │                                                                  │      │
│  │  Votre demande d'adhésion a été envoyée au Bureau.              │      │
│  │                                                                  │      │
│  │  Statut: ⏳ En attente de validation                            │      │
│  │                                                                  │      ��
│  │  Le Bureau examinera votre demande et vous serez notifié        │      │
│  │  de leur décision dans les 48 heures.                           │      │
│  │                                                                  │      │
│  │  En cas d'approbation, vous recevrez:                           │      │
│  │  • Un email de bienvenue                                        │      │
│  │  • L'accès complet à l'application                              │      │
│  │  • Les informations sur la prochaine séance                     │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    VALIDATION PAR LE BUREAU                      │      │
│  │                                                                  │      │
│  │  Le Bureau examine la demande:                                  │      │
│  │  • Vérification des documents                                   │      │
│  │  • Vérification du paiement des frais                          │      │
│  │  • Décision d'approbation ou de refus                          │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ APPROUVÉ                 REFUSÉ │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ BIENVENUE !       │          │ ❌ DEMANDE REFUSÉE   │                │
│  │                      │          │                      │                │
│  │ Vous êtes maintenant │          │ Motif du refus:      │                │
│  │ membre de la tontine │          │ [Motif]              │                │
│  │                      │          │                      │                │
│  │ • Accès complet      │          │ Vous pouvez          │                │
│  │ • Position tour: #46 │          │ contacter le Bureau  │                │
│  │ • Prochaine séance:  │          │ pour plus d'infos    │                │
│  │   29/03/2026         │          │                      │                │
│  │                      │          │ Frais remboursés     │                │
│  │ [Accéder à mon       │          │ (si payés)           │                │
│  │  espace membre]      │          │                      │                │
│  └──────────────────────┘          └──────────────────────┘                │
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
| RM-IA01 | L'adhésion se fait par invitation (lien ou code) |
| RM-IA02 | Les documents (photo, CNI) sont obligatoires |
| RM-IA03 | Les frais d'adhésion sont configurables |
| RM-IA04 | Le Bureau doit valider chaque demande |
| RM-IA05 | Le membre est actif immédiatement après validation |
| RM-IA06 | En cas de refus, les frais sont remboursés |

---

# 4. FLOW 2 : PAIEMENT DE COTISATION

## 4.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: PAIEMENT DE COTISATION                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Membre clique    │                                                       │
│  │ "Payer           │                                                       │
│  │  cotisation"     │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    MA SITUATION DE COTISATIONS                   │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ COTISATIONS EN ATTENTE                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ⏳ Séance #9 - 29 Mars 2026                             │    │      │
│  │  │    Montant: 50,000 XAF                                 │    │      │
│  │  │    Statut: Non payée                                   │    │      │
│  │  │    [Payer]                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Séance #8 - 15 Mars 2026                             │    │      │
│  │  │    Montant: 50,000 XAF                                 │    │      │
│  │  │    Statut: Payée le 15/03/2026                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ OPTIONS DE PAIEMENT                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Payer la prochaine séance (50,000 XAF)               │    │      │
│  │  │ ○ Payer plusieurs séances en avance                    │    │      │
│  │  │ ○ Payer un montant personnalisé (paiement partiel)     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Continuer]                                                    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CHOIX DU MONTANT                              │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PAIEMENT EN AVANCE                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Nombre de séances: [2 ▼]                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Détail:                                                │    │      │
│  │  │ • Séance #9 (29/03/2026): 50,000 XAF                   │    │      │
│  │  │ • Séance #10 (12/04/2026): 50,000 XAF                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ═══════════════════════════════════════                │    │      │
│  │  │ TOTAL: 100,000 XAF                                     │    │      │
│  │  │ ═══════════════════════════════════════                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Modifier]  [Continuer vers le paiement]                       │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    MODE DE PAIEMENT                              │      │
│  │                                                                  │      │
│  │  Montant à payer: 100,000 XAF                                   │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CHOISIR UN MODE DE PAIEMENT                             │    │      │
│  │  │                                                         │    │      │
│  │  │ ● MTN Mobile Money                                      │    │      │
│  │  │   Numéro: +237 677 123 456                             │    │      │
│  │  │   [Modifier le numéro]                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Orange Money                                          │    │      │
│  │  │   Numéro: +237 699 XXX XXX                             │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Virement bancaire                                     │    │      │
│  │  │   (Instructions affichées après sélection)             │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Paiement en espèces (lors de la séance)              │    │      │
│  │  │   (Réservation uniquement)                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Payer 100,000 XAF]                                 │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIRMATION PAIEMENT                         │      │
│  │                                                                  │      │
│  ���  ⚠️ Vous allez payer 100,000 XAF via MTN Mobile Money           │      │
│  │                                                                  │      │
│  │  Numéro débité: +237 677 123 456                                │      │
│  │                                                                  │      │
│  │  Vous allez recevoir une demande de confirmation sur votre      │      │
│  │  téléphone. Veuillez entrer votre code PIN Mobile Money.        │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer le paiement]                             │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    TRAITEMENT EN COURS                           │      │
│  │                                                                  │      │
│  │  ⏳ Paiement en cours de traitement...                          │      │
│  │                                                                  │      │
│  │  Veuillez confirmer sur votre téléphone.                        │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ SUCCÈS                   ÉCHEC  │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ PAIEMENT RÉUSSI   │          │ ❌ PAIEMENT ÉCHOUÉ   │                │
│  │                      │          │                      │                │
│  │ Montant: 100,000 XAF │          │ Erreur: [Message]    │                │
│  │ Référence: TXN123456 │          │                      │                │
│  │                      │          │ Causes possibles:    │                │
│  │ Cotisations payées:  │          │ • Solde insuffisant  │                │
│  │ • Séance #9 ✅       │          │ • Code PIN incorrect │                │
│  │ • Séance #10 ✅      │          │ • Délai dépassé      │                │
│  │                      │          │                      │                │
│  │ Reçu envoyé par SMS  │          │ [Réessayer]          │                │
│  │ et disponible dans   │          │ [Autre mode]         │                │
│  │ l'application        │          │                      │                │
│  │                      │          │                      │                │
│  │ [📥 Télécharger reçu]│          │                      │                │
│  │ [Retour accueil]     │          │                      │                │
│  └──────────────────────┘          └──────────────────────┘                │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └─��────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.2 Sous-Flow : Paiement Partiel

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: PAIEMENT PARTIEL                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PAIEMENT PARTIEL                              │      │
│  │                                                                  │      │
│  │  Cotisation séance #9: 50,000 XAF                               │      │
│  │                                                                  │      │
│  │  Montant que vous souhaitez payer: [30,000] XAF                 │      │
│  │                                                                  │      │
│  │  ⚠️ Après ce paiement:                                         │      │
│  │  • Montant payé: 30,000 XAF                                     │      │
│  │  • Reste à payer: 20,000 XAF                                    │      │
│  │                                                                  │      │
│  │  Le reste devra être payé avant ou pendant la séance.          │      │
│  │                                                                  │      │
│  │  [Annuler]  [Payer 30,000 XAF]                                  │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-PC01 | Le membre peut payer par Mobile Money, virement ou espèces |
| RM-PC02 | Le paiement en avance (plusieurs séances) est autorisé |
| RM-PC03 | Le paiement partiel est autorisé |
| RM-PC04 | Un reçu est généré et envoyé automatiquement |
| RM-PC05 | Le paiement Mobile Money est traité en temps réel |
| RM-PC06 | Le Trésorier est notifié des paiements |

---

# 5. FLOW 3 : CONSULTATION HISTORIQUE COTISATIONS

## 5.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CONSULTATION HISTORIQUE COTISATIONS                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    MON HISTORIQUE DE COTISATIONS                 │      │
│  │                                                                  │      │
│  │  Filtres: [Année: 2026 ▼] [Statut: Tous ▼]                      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉSUMÉ                                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Total cotisé (2026): 400,000 XAF                       │    │      │
│  │  │ Séances payées: 8/8                                    │    │      │
│  │  │ Statut actuel: ✅ À jour                               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌────────────��────────────────────────────────────────────┐    │      │
│  │  │ DÉTAIL PAR SÉANCE                                       │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Séance #8 - 15/03/2026                               │    │      │
│  │  │    Montant: 50,000 XAF                                 │    │      │
│  │  │    Payé le: 15/03/2026 via MTN MoMo                    │    │      │
│  │  │    Réf: TXN789012                                      │    │      │
│  │  │    [📥 Reçu]                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Séance #7 - 01/03/2026                               │    │      │
│  │  │    Montant: 50,000 XAF                                 │    │      │
│  │  │    Payé le: 28/02/2026 via Espèces                     │    │      │
│  │  │    Réf: ESP-2026-089                                   │    │      │
│  │  │    [📥 Reçu]                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ...                                                     │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [📥 Exporter PDF]  [📊 Exporter Excel]                         │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────��───────────────────────────┘
```

## 5.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-HC01 | Le membre peut voir tout son historique de cotisations |
| RM-HC02 | Il peut télécharger les reçus de paiement |
| RM-HC03 | Il peut exporter son historique en PDF ou Excel |
| RM-HC04 | L'historique inclut tous les cycles |

---

# 6. FLOW 4 : CONSULTATION PLANNING DES TOURS

## 6.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CONSULTATION PLANNING DES TOURS                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PLANNING DES TOURS - CYCLE #2                 │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MON TOUR                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ 🎁 Vous êtes en position #15                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Date prévue: 15 Juin 2026 (Séance #15)                 │    │      │
│  │  │ Montant estimé: ~1,800,000 XAF                         │    │      │
│  │  │                                                         │    │      │
│  │  │ [Demander un échange de tour]                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PLANNING COMPLET                                        │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ Tours passés:                                          │    │      │
│  │  │ ✅ #1 - Marie NGUEMO - 15/01/2026 - Distribué          │    │      │
│  │  │ ✅ #2 - Pierre FOTSO - 29/01/2026 - Distribué          │    │      │
│  │  │ ...                                                     │    │      │
│  │  │ ✅ #8 - Paul NGOUFACK - 15/03/2026 - Distribué         │    │      │
│  │  │                                                         │    │      │
│  │  │ Tours à venir:                                         │    │      │
│  │  │ ⏳ #9 - Anne MBARGA - 29/03/2026                        │    │      │
│  │  │ ⏳ #10 - Robert TCHANA - 12/04/2026                     │    │      │
│  │  │ ...                                                     │    │      │
│  │  │ ⭐ #15 - Jean KAMGA (VOUS) - 15/06/2026                │    │      │
│  │  │ ...                                                     │    │      │
│  │  │ ⏳ #45 - Michel ATANGANA - 15/12/2026                   │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Légende: ✅ Distribué  ⏳ À venir  ⭐ Votre tour              │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-PT01 | Le membre peut voir le planning complet des tours |
| RM-PT02 | Son tour est mis en évidence |
| RM-PT03 | Le montant estimé est affiché |
| RM-PT04 | Il peut demander un échange depuis cette vue |

---
# 🟢 FLOWS COMPLETS DU MEMBRE (SUITE)
## Application de Gestion de Tontine - Cameroun

---

# 7. FLOW 5 : ÉCHANGE DE TOUR DE CAGNOTTE (Suite)

## 7.1 Diagramme de Flux (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ÉCHANGE DE TOUR (Suite)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ ACCEPTE                  REFUSE │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ ÉCHANGE CONFIRMÉ  │          │ ❌ ÉCHANGE REFUSÉ    │                │
│  │                      │          │                      │                │
│  │ L'échange a été      │          │ Claire ESSOMBA a     │                │
│  │ validé.              │          │ refusé l'échange.    │                │
│  │                      │          │                      │                │
│  │ Votre nouveau tour:  │          │ Motif: "Je ne peux   │                │
│  │ #12 - 10/05/2026     │          │ pas reporter mon     │                │
│  │                      │          │ tour."               │                │
│  │ • Bureau notifié     │          │                      │                │
│  │ • Planning mis à jour│          │ [Demander à un autre │                │
│  │                      │          │  membre]             │                │
│  └──────────────────────┘          └──────────────────────┘                │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└────────────────────────────────────────────��────────────────────────────────┘
```

## 7.2 Sous-Flow : Réception d'une Demande d'Échange

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: RÉCEPTION DEMANDE D'ÉCHANGE                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Demande         │                                                       │
│  │  d'échange de    │                                                       │
│  │  tour reçue"     │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DEMANDE D'ÉCHANGE REÇUE                       │      │
│  │                                                                  ��      │
│  │  Jean KAMGA vous propose un échange de tour.                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PROPOSITION                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Votre tour actuel: #12 - 10/05/2026                    │    │      │
│  │  │ Tour proposé: #15 - 15/06/2026                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Différence: +35 jours                                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MOTIF DE LA DEMANDE                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ "J'ai besoin de recevoir ma cagnotte plus tôt pour un  │    │      │
│  │  │ projet immobilier urgent."                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE RÉPONSE                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Accepter l'échange                                │    │      │
│  │  │ ○ ❌ Refuser l'échange                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire (optionnel):                               │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ _______________________________________________│    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Répondre plus tard]  [Envoyer ma réponse]                     │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-ET01 | L'échange se fait de gré à gré entre deux membres |
| RM-ET02 | Les deux membres doivent être à jour de cotisations |
| RM-ET03 | L'échange est effectif après acceptation de l'autre membre |
| RM-ET04 | Le Bureau est notifié de tout échange |
| RM-ET05 | L'historique des échanges est conservé |

---

# 8. FLOW 6 : RÉCEPTION DE LA CAGNOTTE

## 8.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: RÉCEPTION DE LA CAGNOTTE                           │
├────────────────────────────────────────────────────────���────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  │(C'est    │                                                               │
│  │ mon tour)│                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Votre tour de   │                                                       │
│  │  cagnotte        │                                                       │
│  │  approche !"     │                                                       │
│  │ (J-7)            │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PRÉPARATION DE LA RÉCEPTION                   │      │
│  │                                                                  │      │
│  │  🎉 C'est bientôt votre tour !                                  │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Séance: #15 - 15 Juin 2026                             │    │      │
│  │  │ Montant estimé: ~1,800,000 XAF                         │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ Votre situation:                                    │    │      │
│  │  │ • Cotisations: ✅ À jour                               │    │      │
│  │  │ • Prêts: ✅ Aucun retard                               │    │      │
│  │  │ • Sanctions: ✅ Aucune impayée                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MODE DE RÉCEPTION                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Comment souhaitez-vous recevoir votre cagnotte ?       │    │      │
│  │  │                                                         │    │      │
│  │  │ ● MTN Mobile Money                                      │    │      │
│  │  │   Numéro: +237 677 123 456                             │    │      │
│  │  │   [Modifier]                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Orange Money                                          │    │      │
│  │  │   Numéro: [________________]                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Virement bancaire                                     │    │      │
│  │  │   Banque: [________________]                           │    │      │
│  │  │   IBAN: [___________________]                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Espèces (lors de la séance)                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Enregistrer mes préférences]                                  │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│                               ▼ Le jour de la séance                        │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DISTRIBUTION EN COURS                         │      │
│  │                                                                  │      │
│  │  Le Trésorier procède à la distribution de votre cagnotte.      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CALCUL DE VOTRE CAGNOTTE                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Cotisations collectées: 1,950,000 XAF                  │    │      │
│  │  │ Prélèvement caisse secours (5%): -97,500 XAF           │    │      │
│  │  │ Prélèvement fonctionnement: -50,000 XAF                │    │      │
│  │  │ ═══════════════════════════════════════                │    │      │
│  │  │ MONTANT NET: 1,802,500 XAF                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIRMATION DE RÉCEPTION                     │      │
│  │                                                                  │      │
│  │  📱 Un code OTP a été envoyé au +237 677 123 456                │      │
│  │                                                                  │      │
│  │  Code: [______]                                                 │      │
│  │                                                                  │      │
│  │  [Renvoyer le code]  [Valider]                                  │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Code validé                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SIGNATURE ÉLECTRONIQUE                        │      │
│  │                                                                  │      │
│  │  Je confirme avoir reçu la somme de 1,802,500 XAF               │      │
│  │                                                                  │      │
│  │  Signature:                                                     │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │         [Zone de dessin tactile]                       │    │      │
│  │  │              Jean KAMGA                                 │    │      │
│  │  │                 ~~~~~~~~~~~~                            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ☑ Je confirme avoir reçu ce montant                           │      │
│  │                                                                  │      │
│  │  [Effacer]  [Confirmer la réception]                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ CAGNOTTE REÇUE !                           │      │
│  │                                                                  │      │
│  │  🎉 Félicitations !                                             │      │
│  │                                                                  │      │
│  │  Montant reçu: 1,802,500 XAF                                    │      │
│  │  Mode: MTN Mobile Money                                         │      │
│  │  Référence: TXN987654321                                        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 🧾 REÇU DE DISTRIBUTION N° 2026-06-D015                │    │      │
│  │  │                                                         │    │      │
│  │  │ Bénéficiaire: Jean KAMGA                               │    │      │
│  │  │ Montant: 1,802,500 XAF                                 │    │      │
│  │  │ Date: 15 Juin 2026 à 16:30                             │    │      │
│  │  │ Séance: #15                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ [📥 Télécharger]  [📤 Partager]                        │    │      │
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

## 8.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-RC01 | Le membre est notifié J-7 avant son tour |
| RM-RC02 | Il peut choisir son mode de réception |
| RM-RC03 | Il doit confirmer via OTP + signature |
| RM-RC04 | Un reçu est généré automatiquement |
| RM-RC05 | Le membre doit être à jour (cotisations, prêts, sanctions) |

---

# 9. FLOW 7 : SIMULATION DE PRÊT

## 9.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: SIMULATION DE PRÊT                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Membre clique    │                                                       │
│  │ "Simuler un      │                                                       │
│  │  prêt"           │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SIMULATEUR DE PRÊT                            │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE ÉLIGIBILITÉ                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Cotisations à jour                                   │    │      │
│  │  │ ✅ Aucun prêt en cours                                  │    │      │
│  │  │ ✅ Membre depuis plus de 3 mois                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant maximum empruntable: 300,000 XAF               │    │      │
│  │  │ (Basé sur votre historique et les règles de la tontine)│    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PARAMÈTRES DU PRÊT                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant souhaité: [200,000] XAF                        │    │      │
│  │  │ ├──────────●──────────────────────────┤                │    │      │
│  │  │ 50,000                            300,000              │    │      │
│  │  │                                                         │    │      │
│  │  │ Durée de remboursement: [3 mois ▼]                     │    │      │
│  │  │ Options: 1 mois | 2 mois | 3 mois | 6 mois             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉSULTAT DE LA SIMULATION                               │    │      │
│  │  │                                                         │    │      │
│  │  │ 💰 Montant emprunté: 200,000 XAF                        │    │      │
│  │  │ 📈 Taux d'intérêt: 5%                                   │    │      │
│  │  │ 💵 Intérêts: 10,000 XAF                                 │    │      │
│  │  │ ═══════════════════════════════════════                │    │      │
│  │  │ 💰 TOTAL À REMBOURSER: 210,000 XAF                      │    │      │
│  │  │ ═════════════════���═════════════════════                │    │      │
│  │  │                                                         │    │      │
│  │  │ 📅 ÉCHÉANCIER:                                          │    │      │
│  │  │ • Échéance 1 (15/04/2026): 70,000 XAF                  │    │      │
│  │  │ • Échéance 2 (15/05/2026): 70,000 XAF                  │    │      │
│  │  │ • Échéance 3 (15/06/2026): 70,000 XAF                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Modifier les paramètres]  [Demander ce prêt]                  │      │
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
| RM-SP01 | Le simulateur calcule en temps réel |
| RM-SP02 | Le montant maximum dépend de l'historique du membre |
| RM-SP03 | Le taux d'intérêt est configurable par la tontine |
| RM-SP04 | L'échéancier est généré automatiquement |

---

# 10. FLOW 8 : DEMANDE DE PRÊT

## 10.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: DEMANDE DE PRÊT                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Membre clique    │                                                       │
│  │ "Demander ce     │                                                       │
│  │  prêt"           │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FORMULAIRE DE DEMANDE DE PRÊT                 │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉCAPITULATIF DU PRÊT                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant: 200,000 XAF                                   │    │      │
│  │  │ Durée: 3 mois                                          │    │      │
│  │  │ Taux: 5%                                               │    │      │
│  │  │ Total à rembourser: 210,000 XAF                        │    │      │
│  │  │ Échéances: 70,000 XAF / mois                           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MOTIF DU PRÊT                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Catégorie: [Projet personnel ▼]                        │    │      │
│  │  │ Options: Urgence médicale | Scolarité | Projet         │    │      │
│  │  │          | Commerce | Autre                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Description:                                           │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Besoin de financement pour des travaux de      │    │    │      │
│  │  │ │ rénovation de ma maison.                        │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ GARANTS (2 requis)                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ Les garants doivent être membres à jour             │    │      │
│  │  │                                                         │    │      │
│  │  │ Garant 1: [Pierre FOTSO ▼]                             │    │      │
│  │  │   Statut: ✅ Éligible                                  │    │      │
│  │  │   [Une demande lui sera envoyée]                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Garant 2: [Anne MBARGA ▼]                              │    │      │
│  │  │   Statut: ✅ Éligible                                  │    │      │
│  │  │   [Une demande lui sera envoyée]                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ENGAGEMENT                                              │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Je m'engage à rembourser selon l'échéancier prévu   │    │      │
│  │  │ ☑ J'accepte les conditions de prêt de la tontine      │    │      │
│  │  │ ☑ Je comprends que mes garants seront sollicités en   │    │      │
│  │  │   cas de défaillance                                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Soumettre la demande]                              │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    📤 DEMANDE ENVOYÉE                            │      │
│  │                                                                  │      │
│  │  Votre demande de prêt a été soumise.                           │      ���
│  │                                                                  │      │
│  │  Référence: PRET-2026-012                                       │      │
│  │                                                                  │      │
│  │  Prochaines étapes:                                             │      │
│  │  1. ⏳ Acceptation des garants                                  │      │
│  │  2. ⏳ Validation par le Bureau                                 │      │
│  │  3. ⏳ Validation par le Président                              │      │
│  │  4. ⏳ Validation par le Commissaire aux Comptes                │      │
│  │  5. ⏳ Décaissement par le Trésorier                            │      │
│  │                                                                  │      │
│  │  Vous serez notifié à chaque étape.                             │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│                               ▼ Processus de validation                     │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SUIVI DE MA DEMANDE                           │      │
│  │                                                                  │      │
│  │  Demande PRET-2026-012 - 200,000 XAF                            │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ÉTAPES DE VALIDATION                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ 1. Garant Pierre FOTSO: Accepté (15/03 10:00)       │    │      │
│  │  │ ✅ 2. Garant Anne MBARGA: Accepté (15/03 14:30)        │    │      │
│  │  │ ✅ 3. Bureau: Approuvé (16/03 09:00)                   │    │      │
│  │  │ ✅ 4. Président: Approuvé (16/03 11:00)                │    │      │
│  │  │ ✅ 5. Commissaire aux Comptes: Approuvé (16/03 14:00)  │    │      │
��  │  │ ⏳ 6. Décaissement: En attente                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ APPROUVÉ                 REFUSÉ │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ PRÊT ACCORDÉ !    │          │ ❌ PRÊT REFUSÉ       │                │
│  │                      │          │                      │                │
│  │ Votre prêt de        │          │ Votre demande a été  │                │
│  │ 200,000 XAF a été    │          │ refusée.             │                │
│  │ décaissé.            │          │                      │                │
│  │                      │          │ Motif: [Motif]       │                │
│  │ Mode: MTN MoMo       │          │                      │                │
│  │ Réf: TXN456789       │          │ Vous pouvez          │                │
│  │                      │          │ contacter le Bureau  │                │
│  │ 1ère échéance:       │          │ pour plus d'infos.   │                │
│  │ 15/04/2026           │          │                      │                │
│  │                      │          │                      │                │
│  │ [Voir mon prêt]      │          │                      │                │
│  └──────────────────────┘          └──────────────────────┘                │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 10.2 Sous-Flow : Acceptation en tant que Garant

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: ACCEPTATION GARANT                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Demande de      │                                                       │
│  │  cautionnement"  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DEMANDE DE CAUTIONNEMENT                      │      │
│  │                                                                  │      │
│  │  Jean KAMGA vous demande de vous porter garant pour un prêt.    │      │
│  │                                                                  │      │
│  │  ┌───��─────────────────────────────────────────────────────┐    │      │
│  │  │ DÉTAILS DU PRÊT                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Emprunteur: Jean KAMGA                                 │    │      │
│  │  │ Montant: 200,000 XAF                                   │    │      │
│  │  │ Durée: 3 mois                                          │    │      │
│  │  │ Total à rembourser: 210,000 XAF                        │    │      │
│  │  │ Motif: Travaux de rénovation                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Autre garant: Anne MBARGA                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ⚠️ EN ACCEPTANT, VOUS VOUS ENGAGEZ À:                   │    │      │
│  │  │                                                         │    │      │
│  │  │ • Rembourser à la place de l'emprunteur en cas de      │    │      │
│  │  │   défaillance de sa part                               │    │      │
│  │  │ • Être solidairement responsable avec l'autre garant   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ○ ✅ J'accepte de me porter garant                            │      │
│  │  ○ ❌ Je refuse                                                 │      │
│  │                                                                  │      │
│  │  Commentaire (optionnel):                                       │      │
│  │  ┌─────────────────────────────────────────────────┐            │      │
│  │  │ _______________________________________________│            │      │
│  │  └─────────────────────────────────────────────────┘            │      │
│  │                                                                  │      │
│  │  [Répondre]                                                     │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      ���
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 10.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-DP01 | Le membre doit désigner des garants |
| RM-DP02 | Les garants doivent accepter |
| RM-DP03 | Le prêt suit un processus de validation multi-niveaux |
| RM-DP04 | Le membre peut suivre l'avancement de sa demande |
| RM-DP05 | Le décaissement se fait via Mobile Money ou espèces |

---

# 11. FLOW 9 : REMBOURSEMENT DE PRÊT

## 11.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: REMBOURSEMENT DE PRÊT                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Membre clique    │                                                       │
│  │ "Mes prêts" ou   │                                                       │
│  │ "Rembourser"     │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    MES PRÊTS EN COURS                            │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PRÊT #008                                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant initial: 200,000 XAF                           │    │      │
│  │  │ Total à rembourser: 210,000 XAF                        │    │      │
│  │  │ Déjà remboursé: 70,000 XAF                             │    │      │
│  │  │ Restant dû: 140,000 XAF                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Prochaine échéance: 15/04/2026 - 70,000 XAF            │    │      │
│  │  │ Statut: ✅ À jour                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Progression: ████████░░░░░░░░░░░░ 33%                   │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir échéancier]  [Rembourser]                        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Rembourser]                       │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    REMBOURSEMENT                                 │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ÉCHÉANCIER                                              │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Échéance 1 (15/03/2026): 70,000 XAF - Payée          │    │      │
│  │  │ ⏳ Échéance 2 (15/04/2026): 70,000 XAF - À payer        │    │      │
│  │  │ ⏳ Échéance 3 (15/05/2026): 70,000 XAF - À venir        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPE DE REMBOURSEMENT                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ ● Payer l'échéance en cours (70,000 XAF)               │    │      │
│  │  │ ○ Payer plusieurs échéances                            │    │      │
│  │  │ ○ Remboursement anticipé (solder le prêt: 140,000 XAF) │    │      │
│  │  │ ○ Montant personnalisé                                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Montant à payer: 70,000 XAF                                    │      │
│  │                                                                  │      │
│  │  Mode de paiement:                                              │      │
│  │  ● MTN Mobile Money (+237 677 123 456)                          │      │
│  │  ○ Orange Money                                                 │      │
│  │  ○ Espèces (lors de la séance)                                  │      │
│  │                                                                  │      │
│  │  [Annuler]  [Payer 70,000 XAF]                                  │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ REMBOURSEMENT EFFECTUÉ                     │      │
│  │                                                                  │      │
│  │  Montant payé: 70,000 XAF                                       │      │
│  │  Référence: TXN111222333                                        │      │
│  │                                                                  │      │
│  │  Nouveau solde du prêt: 70,000 XAF                              │      │
│  │  Prochaine échéance: 15/05/2026 - 70,000 XAF                    │      │
│  │                                                                  │      │
│  │  [📥 Télécharger reçu]                                          │      │
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
| RM-RP01 | Le membre peut voir l'état de ses prêts |
| RM-RP02 | Il peut payer une ou plusieurs échéances |
| RM-RP03 | Le remboursement anticipé est possible |
| RM-RP04 | Il reçoit des rappels avant chaque échéance |
| RM-RP05 | Un reçu est généré pour chaque remboursement |

---

# 12. FLOW 10 : SIGNALEMENT D'ÉVÉNEMENT

## 12.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: SIGNALEMENT D'ÉVÉNEMENT                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Membre clique    │                                                       │
│  │ "Signaler un     │                                                       │
│  │  événement"      │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SIGNALEMENT D'ÉVÉNEMENT                       │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPE D'ÉVÉNEMENT                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ 👶 Naissance                                          │    │      │
│  │  │ ● ⚰️ Décès                                              │    │      │
│  │  │ ○ 💒 Mariage                                            │    │      │
│  │  │ ○ 🏥 Maladie grave                                      │    │      │
│  │  │ ○ 🎓 Événement heureux (diplôme, promotion, etc.)       │    │      │
│  │  │ ○ 📝 Autre                                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Personne concernée:                                    │    │      │
│  │  │ ○ Moi-même                                             │    │      │
│  │  │ ● Un membre de ma famille                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Lien de parenté: [Père ▼]                              │    │      │
│  │  │ Nom: [KAMGA Pierre_______________________________]     │    │      │
│  │  │                                                         │    │      │
│  │  │ Date de l'événement: [10/03/2026]                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Description:                                           │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Mon père est décédé le 10 mars 2026 à Douala.  │    │    │      │
│  │  │ │ Les obsèques auront lieu le 20 mars 2026.      │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PIÈCES JUSTIFICATIVES (optionnel)                       │    │      │
│  │  │                                                         │    │      │
│  │  │ [📎 acte_deces.pdf]                                    │    │      │
│  │  │ [+ Ajouter un fichier]                                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DEMANDE D'AIDE (optionnel)                              │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Je souhaite bénéficier d'une aide de la tontine      │    │      │
│  │  │                                                         │    │      │
│  │  │ Si coché, une cotisation extraordinaire pourra être    │    │      │
│  │  │ lancée selon les règles de la tontine.                 │    │      │
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
│  │  Votre signalement a été transmis au Bureau.                    │      │
│  │                                                                  │      │
│  │  Référence: EVT-2026-015                                        │      │
│  │  Type: Décès                                                    │      │
│  │                                                                  │      │
│  │  Le Bureau examinera votre signalement et vous informera        │      │
│  │  des suites données.                                            │      │
│  │                                                                  │      │
│  │  Toute la tontine vous présente ses condoléances.               │      │
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
| RM-SE01 | Le membre peut signaler différents types d'événements |
| RM-SE02 | Il peut joindre des justificatifs |
| RM-SE03 | Il peut demander une aide de la tontine |
| RM-SE04 | Le Bureau est notifié et décide des suites |

---
# 🟢 FLOWS COMPLETS DU MEMBRE (SUITE 2)
## Application de Gestion de Tontine - Cameroun

---

# 13. FLOW 11 : DEMANDE D'AIDE SOCIALE (Suite)

## 13.1 Diagramme de Flux (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: DEMANDE D'AIDE SOCIALE (Suite)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    📤 DEMANDE ENVOYÉE                            │      │
│  │                                                                  │      │
│  │  Votre demande d'aide a été transmise au Bureau.                │      │
│  │                                                                  │      │
│  │  Référence: AIDE-2026-008                                       │      │
│  │  Montant demandé: 100,000 XAF                                   │      │
│  │                                                                  │      │
│  │  Le Bureau examinera votre demande lors de la prochaine         │      │
│  │  réunion ou en urgence selon la nature de la demande.          │      │
│  │                                                                  │      │
│  │  Vous serez notifié de la décision.                             │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│                               ▼ Décision du Bureau                          │
│                                                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ APPROUVÉE                REFUSÉE│                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ AIDE ACCORDÉE     │          │ ❌ AIDE REFUSÉE      │                │
│  │                      │          │                      │                │
│  │ Votre demande a été  │          │ Votre demande a été  │                │
│  │ approuvée.           │          │ refusée.             │                │
│  │                      │          │                      │                │
│  │ Montant: 100,000 XAF │          │ Motif: [Motif]       │                │
│  │                      │          │                      │                │
│  │ Le Trésorier vous    │          │ Vous pouvez          │                │
│  │ contactera pour le   │          │ contacter le Bureau  │                │
│  │ versement.           │          │ pour plus d'infos.   │                │
│  │                      │          │                      │                │
│  └──────────────────────┘          └──────────────────────┘                │
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
| RM-AS01 | L'aide est prélevée sur la caisse de secours |
| RM-AS02 | Un montant maximum par aide est défini |
| RM-AS03 | Le Bureau décide de l'attribution |
| RM-AS04 | Les justificatifs peuvent être requis |
| RM-AS05 | L'aide peut être liée à un événement signalé |

---

# 14. FLOW 12 : CONTRIBUTION COTISATION EXTRAORDINAIRE

## 14.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CONTRIBUTION COTISATION EXTRAORDINAIRE             │
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
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    COTISATION EXTRAORDINAIRE                     │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ 📋 Motif: Décès du père de M. Paul BIYA                │    │      │
│  │  │ 👤 Bénéficiaire: Paul BIYA                              │    │      │
│  │  │ 💰 Montant par membre: 5,000 XAF                        │    │      │
│  │  │ 📅 Date limite: 20 Mars 2026                            │    │      │
│  │  │ 🚀 Lancée par: Président (10/03/2026)                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ÉTAT DE LA COLLECTE                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Progression: ████████████████░░░░ 80%                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Collecté: 180,000 / 225,000 XAF                        │    │      │
│  │  │ Membres ayant payé: 36 / 45                            │    │      │
│  │  │ Jours restants: 5                                      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MON STATUT                                              │    │      │
│  │  │                                                         │    │      │
│  │  │ ⏳ Vous n'avez pas encore contribué                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Montant à payer: 5,000 XAF                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Contribuer maintenant]                                        │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────��───────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PAIEMENT DE LA CONTRIBUTION                   │      │
│  │                                                                  │      │
│  │  Cotisation extraordinaire: Décès père M. BIYA                  │      │
│  │  Montant: 5,000 XAF                                             │      │
│  │                                                                  │      │
│  │  Mode de paiement:                                              │      │
│  │  ● MTN Mobile Money (+237 677 123 456)                          │      │
│  │  ○ Orange Money                                                 │      │
│  │  ○ Espèces (lors de la prochaine séance)                        │      │
│  │                                                                  │      │
│  │  [Annuler]  [Payer 5,000 XAF]                                   │      │
│  │                                                                  │      │
│  └─────────────────���──────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ CONTRIBUTION ENREGISTRÉE                   │      │
│  │                                                                  │      │
│  │  Merci pour votre solidarité !                                  │      │
│  │                                                                  │      │
│  │  Montant payé: 5,000 XAF                                        │      │
│  │  Référence: TXN555666777                                        │      │
│  │                                                                  │      │
│  │  Progression de la collecte: 185,000 / 225,000 XAF (82%)        │      │
│  │                                                                  │      │
│  │  [📥 Télécharger reçu]                                          │      │
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
| RM-CE01 | Le membre est notifié dès le lancement d'une cotisation extra |
| RM-CE02 | Il peut voir l'état de la collecte |
| RM-CE03 | Il peut payer via Mobile Money ou espèces |
| RM-CE04 | Un reçu est généré pour chaque contribution |

---

# 15. FLOW 13 : SIGNALEMENT D'ABSENCE

## 15.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: SIGNALEMENT D'ABSENCE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Membre clique    │                                                       │
│  │ "Signaler une    │                                                       │
│  │  absence"        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SIGNALEMENT D'ABSENCE                         │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PROCHAINE SÉANCE                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Séance #9 - 29 Mars 2026 à 15h00                       │    │      │
│  │  │ Lieu: Salle des fêtes FOUDA, Yaoundé                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE SIGNALEMENT                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Séance concernée: [Séance #9 - 29/03/2026 ▼]           │    │      │
│  │  │                                                         │    │      │
│  │  │ Motif d'absence:                                       │    │      │
│  │  │ ○ Voyage professionnel                                 │    │      │
│  │  │ ○ Voyage personnel                                     │    │      │
│  │  │ ● Raison médicale                                      │    │      │
│  │  │ ○ Événement familial                                   │    │      │
│  │  │ ○ Autre                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Description:                                           │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Je serai hospitalisé ce jour-là pour une       │    │    │      │
│  │  │ │ intervention chirurgicale programmée.          │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Je fournirai un justificatif après la séance        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ⚠️ Rappel: Les absences non justifiées entraînent une         │      │
│  │     sanction de 1,000 XAF selon le règlement.                  │      │
│  │                                                                  │      │
│  │  [Annuler]  [Envoyer le signalement]                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ ABSENCE SIGNALÉE                           │      │
│  │                                                                  │      │
│  │  Votre absence pour la séance #9 a été enregistrée.             │      │
│  │                                                                  │      │
│  │  Référence: ABS-2026-025                                        │      │
│  │  Statut: ⏳ En attente de justificatif                          │      │
│  │                                                                  │      │
│  │  Le Secrétaire et le Censeur ont été informés.                  │      │
│  │                                                                  │      │
│  │  📎 N'oubliez pas de soumettre votre justificatif pour          │      │
│  │     éviter une sanction.                                        │      │
│  │                                                                  │      │
│  │  [Soumettre un justificatif maintenant]                         │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────���───────────────────────────────┘
```

## 15.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-SA01 | Le membre peut signaler son absence à l'avance |
| RM-SA02 | Le signalement est transmis au Secrétaire et Censeur |
| RM-SA03 | Un justificatif peut être soumis ultérieurement |
| RM-SA04 | L'absence sans justificatif valide = sanction |

---

# 16. FLOW 14 : SOUMISSION DE JUSTIFICATIF

## 16.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: SOUMISSION DE JUSTIFICATIF                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Membre clique    │                                                       │
│  │ "Soumettre un    │                                                       │
│  │  justificatif"   │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SOUMISSION DE JUSTIFICATIF                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────��───────────────────────────────────┐    │      │
│  │  │ ABSENCE CONCERNÉE                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Séance: #9 - 29 Mars 2026                              │    │      │
│  │  │ Motif déclaré: Raison médicale                         │    │      │
│  │  │ Signalement: ABS-2026-025                              │    │      │
│  │  │ Statut: ⏳ En attente de justificatif                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE JUSTIFICATIF                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Type de document:                                      │    │      │
│  │  │ ● Certificat médical                                   │    │      │
│  │  │ ○ Ordre de mission                                     │    │      │
│  │  │ ○ Attestation                                          │    │      │
│  │  │ ○ Autre document officiel                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Fichier:                                               │    │      │
│  │  │ [📎 certificat_medical.pdf] ✅                         │    │      │
│  │  │ [Choisir un fichier]  [Prendre une photo]             │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire (optionnel):                               │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Certificat du Dr MBALLA de l'hôpital central.  │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Soumettre le justificatif]                         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    📤 JUSTIFICATIF SOUMIS                        │      │
│  │                                                                  │      │
│  │  Votre justificatif a été envoyé pour validation.               │      │
│  │                                                                  │      │
│  │  Référence: JUST-2026-018                                       │      │
│  │  Statut: ⏳ En attente de validation                            │      │
│  │                                                                  │      │
│  │  Processus de validation:                                       │      │
│  │  1. ⏳ Examen par le Censeur                                    │      │
│  │  2. ⏳ Validation par le Président                              │      │
│  │                                                                  │      │
│  │  Vous serez notifié de la décision.                             │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│                               ▼ Processus de validation                     │
│                                                                             │
│  ┌────────────────────────────────────────────��─────────────────────┐      │
│  │                    SUIVI DE MON JUSTIFICATIF                     │      │
│  │                                                                  │      │
│  │  Référence: JUST-2026-018                                       │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ÉTAT DE LA VALIDATION                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Examen Censeur: Validé (30/03 10:00)                │    │      │
│  │  │    Commentaire: "Document conforme"                    │    │      │
│  │  │ ⏳ Validation Président: En attente                    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ VALIDÉ                   REFUSÉ │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ JUSTIFICATIF      │          │ ❌ JUSTIFICATIF      │                │
│  │    VALIDÉ            │          │    REFUSÉ            │                │
│  │                      │          │                      │                │
│  │ Votre justificatif   │          │ Votre justificatif   │                │
│  │ a été accepté.       │          │ n'a pas été accepté. │                │
│  │                      │          │                      │                │
│  │ • Absence excusée    │          │ Motif: [Motif]       │                │
│  │ • Aucune sanction    │          │                      │                │
│  │                      │          │ • Sanction maintenue │                │
│  │                      │          │ • Vous pouvez        │                │
│  │                      │          │   soumettre un autre │                │
│  │                      │          │   justificatif       │                │
│  └──────────────────────┘          └──────────────────────┘                │
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
| RM-SJ01 | Le membre peut soumettre un justificatif après signalement |
| RM-SJ02 | Le justificatif est validé par Censeur puis Président |
| RM-SJ03 | Si validé, l'absence est excusée et la sanction annulée |
| RM-SJ04 | Si refusé, le membre peut soumettre un autre document |

---

# 17. FLOW 15 : CONSULTATION DES SANCTIONS

## 17.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CONSULTATION DES SANCTIONS                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    MES SANCTIONS                                 │      │
│  │                                                                  │      │
│  │  Filtres: [Année: 2026 ▼] [Statut: Tous ▼]                      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉSUMÉ                                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Sanctions ce cycle: 2                                  │    │      │
│  │  │ • Payées: 1 (500 XAF)                                  │    │      │
│  │  │ • Impayées: 1 (1,000 XAF)                              │    │      │
│  │  │ • Annulées: 0                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ Total impayé: 1,000 XAF                                │    │      │
│  │  │ [Payer maintenant]                                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉTAIL DES SANCTIONS                                    │    │      │
│  │  ├─────────────────────────────────────────��───────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ ⏳ Sanction #2026-045                                   │    │      │
│  │  │    Type: Absence non justifiée                         │    │      │
│  │  │    Séance: #8 - 15/03/2026                             │    │      │
│  │  │    Montant: 1,000 XAF                                  │    │      │
│  │  │    Statut: ❌ Non payée                                │    │      │
│  │  │    Appliquée par: Censeur (M. TCHANA)                  │    │      │
│  │  │    [Payer]  [Contester]                                │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Sanction #2026-032                                   │    │      │
│  │  │    Type: Retard                                        │    │      │
│  │  │    Séance: #7 - 01/03/2026                             │    │      │
│  │  │    Montant: 500 XAF                                    │    │      │
│  │  │    Statut: ✅ Payée le 01/03/2026                      │    │      │
│  │  │    [📥 Reçu]                                           │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [📥 Exporter l'historique]                                     │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 17.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-CS01 | Le membre peut voir toutes ses sanctions |
| RM-CS02 | Il peut voir le statut (payée, impayée, annulée) |
| RM-CS03 | Il peut payer ou contester depuis cette vue |
| RM-CS04 | Il peut télécharger les reçus des sanctions payées |

---

# 18. FLOW 16 : CONTESTATION DE SANCTION

## 18.1 Diagramme de Flux

```
┌────────────────────────────────────────────────────────────────────────────��┐
│                    FLOW: CONTESTATION DE SANCTION                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Membre clique    │                                                       │
│  │ "Contester"      │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONTESTATION DE SANCTION                      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SANCTION CONCERNÉE                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Référence: #2026-045                                   │    │      │
│  │  │ Type: Absence non justifiée                            │    │      │
│  │  │ Séance: #8 - 15/03/2026                                │    │      │
│  │  │ Montant: 1,000 XAF                                     │    │      │
│  │  │ Appliquée par: Censeur (M. TCHANA)                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE CONTESTATION                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Motif de contestation:                                 │    │      │
│  │  │ ○ Erreur de pointage (j'étais présent)                 │    │      │
│  │  │ ● Justificatif non pris en compte                      │    │      │
│  │  │ ○ Circonstances exceptionnelles                        │    │      │
│  │  │ ○ Autre                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Explication détaillée:                                 │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ J'avais signalé mon absence à l'avance et      │    │    │      │
│  │  │ │ soumis un certificat médical (JUST-2026-018).  │    │    │      │
│  │  │ │ La sanction a été appliquée avant que mon      │    │    │      │
│  │  │ │ justificatif soit examiné.                     │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Pièces jointes (optionnel):                            │    │      │
│  │  │ [📎 certificat_medical.pdf]                            │    │      │
│  │  │ [+ Ajouter un fichier]                                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Soumettre la contestation]                         │      │
│  │                                                                  │      │
│  └─────────���──────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    📤 CONTESTATION ENVOYÉE                       │      │
│  │                                                                  │      │
│  │  Votre contestation a été envoyée au Censeur.                   │      │
│  │                                                                  │      │
│  │  Référence: CONT-2026-012                                       │      │
│  │  Statut: ⏳ En attente d'examen                                 │      │
│  │                                                                  │      │
│  │  Le Censeur examinera votre contestation et pourra:             │      │
│  │  • Accepter: la sanction sera annulée                           │      │
│  │  • Refuser: la sanction sera maintenue                          │      │
│  │  • Demander des informations complémentaires                    │      │
│  │                                                                  │      │
│  │  Vous serez notifié de la décision.                             │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│              ┌────────────────┴────────────────┐                            │
│              │ ACCEPTÉE                REFUSÉE │                            │
│              ▼                                 ▼                            │
│  ┌──────────────────────┐          ┌──────────────────────┐                │
│  │ ✅ CONTESTATION      │          │ ❌ CONTESTATION      │                │
│  │    ACCEPTÉE          │          │    REFUSÉE           │                │
│  │                      │          │                      │                │
│  │ Votre contestation   │          │ Votre contestation   │                │
│  │ a été acceptée.      │          │ n'a pas été retenue. │                │
│  │                      │          │                      │                │
│  │ • Sanction annulée   │          │ Motif: [Motif]       │                │
│  │ • Si déjà payée,     │          │                      │                │
│  │   remboursement      │          │ • Sanction maintenue │                │
│  │   prévu              │          │ • Vous devez payer   │                │
│  │                      │          │   1,000 XAF          │                │
│  │                      │          │                      │                │
│  │                      │          │ [Payer maintenant]   │                │
│  └──────────────────────┘          └──────────────────────┘                │
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
| RM-CT01 | Le membre peut contester une sanction |
| RM-CT02 | La contestation est examinée par le Censeur |
| RM-CT03 | Si acceptée, la sanction est annulée (et remboursée si payée) |
| RM-CT04 | Si refusée, la sanction reste due |

---

# 19. FLOW 17 : PAIEMENT DE SANCTION

## 19.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: PAIEMENT DE SANCTION                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Membre clique    │                                                       │
│  │ "Payer" sur une  │                                                       │
│  │  sanction        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PAIEMENT DE SANCTION                          │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SANCTION À PAYER                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Référence: #2026-045                                   │    ��      │
│  │  │ Type: Absence non justifiée                            │    │      │
│  │  │ Séance: #8 - 15/03/2026                                │    │      │
│  │  │ Montant: 1,000 XAF                                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ AUTRES SANCTIONS IMPAYÉES                               │    │      │
│  │  │                                                         │    │      │
│  │  │ ☐ Sanction #2026-048 - Retard - 500 XAF                │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Payer toutes mes sanctions (1,500 XAF)               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Montant total: 1,000 XAF                                       │      │
│  │                                                                  │      │
│  │  Mode de paiement:                                              │      │
│  │  ● MTN Mobile Money (+237 677 123 456)                          │      │
│  │  ○ Orange Money                                                 │      │
│  │  ○ Espèces (lors de la prochaine séance)                        │      │
│  │                                                                  │      │
│  │  [Annuler]  [Payer 1,000 XAF]                                   │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ SANCTION PAYÉE                             │      │
│  │                                                                  │      │
│  │  Montant payé: 1,000 XAF                                        │      │
│  │  Référence: TXN888999000                                        │      │
│  │                                                                  │      │
│  │  Sanction #2026-045 marquée comme payée.                        │      │
│  │                                                                  │      │
│  │  [📥 Télécharger reçu]                                          │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
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
| RM-PS01 | Le membre peut payer ses sanctions via l'application |
| RM-PS02 | Il peut payer une ou plusieurs sanctions à la fois |
| RM-PS03 | Le paiement peut se faire via Mobile Money ou espèces |
| RM-PS04 | Un reçu est généré pour chaque paiement |

---

# 20. FLOW 18 : CONFIRMATION DE PRÉSENCE

## 20.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CONFIRMATION DE PRÉSENCE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Confirmez votre │                                                       │
│  │  présence à la   │                                                       │
│  │  séance #9"      │                                                       │
│  │ (J-5)            │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIRMATION DE PRÉSENCE                      │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PROCHAINE SÉANCE                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ Séance #9 - 29 Mars 2026 à 15h00                       │    │      │
│  │  │ Lieu: Salle des fêtes FOUDA, Yaoundé                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Ordre du jour:                                         │    │      │
│  │  │ 1. Lecture et adoption du PV                           │    │      │
│  │  │ 2. Rapport du Trésorier                                │    │      │
│  │  │ 3. Distribution de la cagnotte à Anne MBARGA          │    │      │
│  │  │ 4. Questions diverses                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir l'ordre du jour complet]                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE RÉPONSE                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Serez-vous présent à cette séance ?                    │    │      │
│  │  │                                                         │    │      │
│  │  │ ● ✅ Oui, je serai présent                             │    │      │
│  │  │ ○ ❌ Non, je serai absent                              │    │      │
│  │  │ ○ ❓ Je ne sais pas encore                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Confirmer]                                                    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│           ┌───────────────────┼───────────────────┐                         │
│           ▼                   ▼                   ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │ ✅ PRÉSENT      │ │ ❌ ABSENT       │ │ ❓ INCERTAIN    │               │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘               │
│           │                   │                   │                         │
│           ▼                   ▼                   ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │ Présence        │ │ Redirige vers   │ │ Rappel envoyé   │               │
│  │ confirmée       │ │ "Signaler       │ │ 24h avant la    │               │
│  │                 │ │ absence"        │ │ séance          │               │
│  │ Le Secrétaire   │ │ (Flow 13)       │ │                 │               │
│  │ est informé     │ │                 │ │                 │               │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘               │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 20.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-CP01 | Le membre est invité à confirmer sa présence J-5 |
| RM-CP02 | S'il confirme "absent", il est redirigé vers le signalement |
| RM-CP03 | S'il est incertain, un rappel lui est envoyé J-1 |
| RM-CP04 | Le Secrétaire voit les confirmations en temps réel |

---

# 21. FLOW 19 : VOTE EN LIGNE

## 21.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: VOTE EN LIGNE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Nouveau vote    │                                                       │
│  │  ouvert"         │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    VOTE EN COURS                                 │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ QUESTION SOUMISE AU VOTE                                │    │      │
│  │  │                                                         │    │      │
│  │  │ 📋 Sujet: Augmentation du montant des cotisations      │    │      │
│  │  │                                                         │    │      │
│  │  │ Description:                                           │    │      │
│  │  │ Suite à la proposition du Bureau lors de la séance #8, │    │      │
│  │  │ il est proposé d'augmenter le montant des cotisations  │    │      │
│  │  │ de 50,000 XAF à 60,000 XAF par séance, à partir du    │    │      │
│  │  │ cycle #3.                                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Initié par: Président (M. FOTSO)                       │    │      │
│  │  │ Date limite: 25 Mars 2026                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ÉTAT DU VOTE                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Participation: 32/45 membres (71%)                     │    │      │
│  │  │ Quorum requis: 30 membres (67%)                        │    │      │
│  │  │ Quorum: ✅ Atteint                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Jours restants: 5                                      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MON VOTE                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Pour (j'approuve la proposition)                  │    │      │
│  │  │ ○ ❌ Contre (je refuse la proposition)                 │    │      │
│  │  │ ○ ⚪ Abstention                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire (optionnel):                               │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ _______________________________________________│    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ⚠️ Votre vote est anonyme et ne peut pas être modifié          │      │
│  │     après soumission.                                           │      │
│  │                                                                  │      │
│  │  [Voter]                                                        │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ VOTE ENREGISTRÉ                            │      │
│  │                                                                  │      │
│  │  Votre vote a été enregistré avec succès.                       │      │
│  │                                                                  │      │
│  │  Vous serez notifié des résultats à la clôture du vote.         │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│                               ▼ À la clôture du vote                        │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    📊 RÉSULTATS DU VOTE                          │      │
│  │                                                                  │      │
│  │  Sujet: Augmentation du montant des cotisations                 │      │
│  │                                                                  │      │
│  │  Participation: 40/45 membres (89%)                             │      │
│  │                                                                  │      │
│  │  Résultats:                                                     │      │
│  │  ✅ Pour: 28 (70%)        ████████████████░░░░                  │      │
│  │  ❌ Contre: 10 (25%)      ██████░░░░░░░░░░░░░░                  │      │
│  │  ⚪ Abstention: 2 (5%)    █░░░░░░░░░░░░░░░░░░░                  │      │
│  │                                                                  │      │
│  │  Décision: ✅ PROPOSITION ADOPTÉE                               │      │
│  │  (Majorité simple requise: 50% + 1)                             │      │
│  │                                                                  │      │
│  │  La cotisation passera à 60,000 XAF à partir du cycle #3.      │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 21.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-VL01 | Le vote est anonyme |
| RM-VL02 | Le vote ne peut pas être modifié après soumission |
| RM-VL03 | Un quorum peut être requis |
| RM-VL04 | Les résultats sont publiés à la clôture |
| RM-VL05 | Tous les membres sont notifiés des résultats |

---

# 22. FLOW 20 : CONSULTATION DOCUMENTS

# 🟢 FLOWS COMPLETS DU MEMBRE (SUITE 3)
## Application de Gestion de Tontine - Cameroun

---

# 22. FLOW 20 : CONSULTATION DOCUMENTS (Suite)

## 22.1 Diagramme de Flux (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CONSULTATION DOCUMENTS (Suite)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DOCUMENTS DE LA TONTINE                       │      │
│  │                                                                  │      │
│  │  ┌───────────────���─────────────────────────────────────────┐    │      │
│  │  │ 📢 ANNONCES                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ • 15/03 - Cotisation extraordinaire lancée             │    │      │
│  │  │ • 10/03 - Changement de lieu pour la séance #9         │    │      │
│  │  │ • 01/03 - Vote ouvert: augmentation cotisations        │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir toutes les annonces]                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 📋 PROCÈS-VERBAUX                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ • PV Séance #8 - 15/03/2026 [📥]                       │    │      │
│  │  │ • PV Séance #7 - 01/03/2026 [📥]                       │    │      │
│  │  │ • PV Séance #6 - 15/02/2026 [📥]                       │    │      │
│  │  │ • PV Séance #5 - 01/02/2026 [📥]                       │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir tous les PV]                                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 📊 RAPPORTS                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Rapports du Trésorier:                                 │    │      │
│  │  │ • Bilan Séance #8 - 15/03/2026 [📥]                    │    │      │
│  │  │ • Bilan Mensuel Février 2026 [📥]                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Rapports du Censeur:                                   │    │      │
│  │  │ • Rapport Séance #8 - 15/03/2026 [📥]                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Rapports du Commissaire aux Comptes:                   │    │      │
│  │  │ • Audit Cycle #1 - Certification [📥]                  │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir tous les rapports]                               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 📜 DOCUMENTS OFFICIELS                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ • Règlement intérieur [📥]                             │    │      │
│  │  │ • Statuts de la tontine [📥]                           │    │      │
│  │  │ • Liste des membres [📥]                               │    │      │
│  │  │ • Planning des tours - Cycle #2 [📥]                   │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 22.2 Sous-Flow : Visualisation d'un Document

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: VISUALISATION DOCUMENT                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    VISUALISEUR DE DOCUMENT                       │      │
│  │                                                                  │      │
│  │  Document: PV Séance #8 - 15 Mars 2026                          │      │
│  │  Type: Procès-verbal                                            │      │
│  │  Date de publication: 16/03/2026                                │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │                                                         │    │      │
│  │  │           [APERÇU DU DOCUMENT PDF]                     │    │      │
│  │  │                                                         │    │      │
│  │  │   ┌─────────────────────────────────────────────┐      │    │      │
│  │  │   │                                             │      │    │      │
│  │  │   │      PROCÈS-VERBAL DE LA SÉANCE #8         │      │    │      │
│  │  │   │           15 Mars 2026                      │      │    │      │
│  │  │   │                                             │      │    │      │
│  │  │   │   Présents: 38 membres                     │      │    │      │
│  │  │   │   Absents: 7 membres                       │      │    │      │
│  │  │   │                                             │      │    │      │
│  │  │   │   Ordre du jour:                           │      │    │      │
│  │  │   │   1. Lecture du PV précédent               │      │    │      │
│  │  │   │   2. Rapport du Trésorier                  │      │    │      │
│  │  │   │   3. Distribution à M. NGOUFACK            │      │    │      │
│  │  │   │   ...                                       │      │    │      │
│  │  │   │                                             │      │    │      │
│  │  │   └─────────────────────────────────────────────┘      │    │      │
│  │  │                                                         │    │      │
│  │  │  [◀️ Page préc.]  Page 1/3  [Page suiv. ▶️]            │    │      │
│  │  │  [🔍 Zoom +]  [🔍 Zoom -]                              │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [📥 Télécharger]  [📤 Partager]  [Fermer]                      │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 22.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-CD01 | Le membre peut consulter tous les documents publics |
| RM-CD02 | Il peut télécharger et partager les documents |
| RM-CD03 | Les PV sont publiés après chaque séance |
| RM-CD04 | Les rapports sont accessibles après validation |

---

# 23. FLOW 21 : COMMUNICATION AVEC LE BUREAU

## 23.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: COMMUNICATION AVEC LE BUREAU                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Membre clique    │                                                       │
│  │ "Contacter le    │                                                       │
│  │  Bureau"         │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    MESSAGERIE INTERNE                            │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MES CONVERSATIONS                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ 💬 Président (M. FOTSO)                                │    │      │
│  │  │    Dernier message: 10/03 - "Votre demande a été..."  │    │      │
│  │  │                                                         │    │      │
│  │  │ 💬 Trésorier (M. TCHANA)                               │    │      │
│  │  │    Dernier message: 05/03 - "Merci pour votre..."     │    │      │
│  │  │                                                         │    │      │
│  │  │ 💬 Secrétaire (Mme NGUEMO)                             │    │      │
│  │  │    Dernier message: 01/03 - "Le PV est disponible..." │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [+ Nouveau message]                                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [+ Nouveau message]                │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    NOUVEAU MESSAGE                               │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DESTINATAIRE                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ À: [Choisir un destinataire ▼]                         │    │      │
│  │  │    • Président                                         │    │      │
│  │  │    • Vice-Président                                    │    │      │
│  │  │    • Secrétaire                                        │    │      │
│  │  │    • Trésorier                                         │    │      │
│  │  │    • Censeur                                           │    │      │
│  │  │    • Bureau (tous)                                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE MESSAGE                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Objet: [Question sur ma cotisation___________________] │    │      │
│  │  │                                                         │    │      │
│  │  │ Message:                                               │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Bonjour,                                        │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ J'ai effectué un paiement de 50,000 XAF le     │    │    │      │
│  │  │ │ 14/03 mais il n'apparaît pas encore dans mon   │    │    │      │
│  │  │ │ historique. Pouvez-vous vérifier ?             │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Référence: TXN123456789                        │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Merci.                                         │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Pièces jointes:                                        │    │      │
│  │  │ [📎 capture_paiement.jpg]                              │    │      │
│  │  │ [+ Ajouter un fichier]                                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Envoyer]                                           │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ MESSAGE ENVOYÉ                             │      │
│  │                                                                  │      │
│  │  Votre message a été envoyé au Trésorier.                       │      │
│  │                                                                  │      │
│  │  Vous serez notifié dès qu'une réponse sera reçue.              │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 23.2 Sous-Flow : Conversation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: CONVERSATION                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONVERSATION AVEC TRÉSORIER                   │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 💬 MESSAGES                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ ┌─────────────────────────────────────────┐            │    │      │
│  │  │ │ 👤 Vous - 14/03 10:30                   │            │    │      │
│  │  │ │ Question sur ma cotisation              │            │    │      │
│  │  │ │                                         │            │    │      │
│  │  │ │ Bonjour, j'ai effectué un paiement...  │            │    │      │
│  │  │ │ 📎 capture_paiement.jpg                 │            │    │      │
│  │  │ └─────────────────────────────────────────┘            │    │      │
│  │  │                                                         │    │      │
│  │  │        ┌─────────────────────────────────────────┐     │    │      │
│  │  │        │ 👤 Trésorier - 14/03 14:00              │     │    │      │
│  │  │        │                                         │     │    │      │
│  │  │        │ Bonjour Jean,                           │     │    │      │
│  │  │        │                                         │     │    │      │
│  │  │        │ Merci pour votre message. J'ai vérifié │     │    │      │
│  │  │        │ et votre paiement a bien été reçu.     │     │    │      │
│  │  │        │ Il sera validé ce soir.                │     │    │      │
│  │  │        │                                         │     │    │      │
│  │  │        │ Cordialement.                          │     │    │      │
│  │  │        └─────────────────────────────────────────┘     │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ Répondre:                                               │    │      │
│  │  │ ┌───────────────────────────────────────────────────┐  │    │      │
│  │  │ │ Tapez votre message...                            │  │    │      │
│  │  │ └───────────────────────────────────────────────────┘  │    │      │
│  │  │ [📎]  [Envoyer]                                        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 23.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-CB01 | Le membre peut contacter tout membre du Bureau |
| RM-CB02 | Il peut joindre des pièces aux messages |
| RM-CB03 | Les conversations sont conservées |
| RM-CB04 | Il est notifié des réponses |

---

# 24. FLOW 22 : GESTION DU PROFIL

## 24.1 Diagramme de Flux

```
┌─��───────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GESTION DU PROFIL                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Membre clique    │                                                       │
│  │ "Mon profil"     │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    MON PROFIL                                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 👤 INFORMATIONS PERSONNELLES                            │    │      │
│  │  │                                                         │    │      │
│  │  │  ┌───────┐                                              │    │      │
│  │  │  │ 📷    │  Jean KAMGA                                  │    │      │
│  │  │  │ Photo │  Membre depuis: Janvier 2024                 │    │      │
│  │  │  └───────┘  Position tour: #15                          │    │      │
│  │  │             [Modifier la photo]                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Nom: KAMGA                                             │    │      │
│  │  │ Prénom: Jean                                           │    │      │
│  │  │ Date de naissance: 15/05/1985                          │    │      │
│  │  │ Profession: Ingénieur informatique                     │    │      │
│  │  │                                                         │    │      │
│  │  │ [Modifier mes informations]                            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 📱 COORDONNÉES                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ Téléphone: +237 677 123 456                            │    │      │
│  │  │ Email: jean.kamga@email.com                            │    │      │
│  │  │ Adresse: Yaoundé, Quartier Bastos                      │    │      │
│  │  │                                                         │    │      │
│  │  │ [Modifier mes coordonnées]                             │    │      │
│  │  └────────────────────────────��────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 💳 MOYENS DE PAIEMENT                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ ● MTN Mobile Money: +237 677 123 456 (principal)       │    │      │
│  │  │ ○ Orange Money: Non configuré                          │    │      │
│  │  │ ○ Compte bancaire: Non configuré                       │    │      │
│  │  │                                                         │    │      │
│  │  │ [Gérer mes moyens de paiement]                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 🔔 PRÉFÉRENCES DE NOTIFICATION                          │    │      │
│  │  │                                                         │    │      │
│  │  │ Notifications push: ✅ Activées                        │    │      │
│  │  │ Notifications SMS: ✅ Activées                         │    │      │
│  │  │ Notifications email: ✅ Activées                       │    │      │
│  │  │                                                         │    │      │
│  │  │ [Gérer mes notifications]                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 🔒 SÉCURITÉ                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Mot de passe: ********                                 │    │      │
│  │  │ Dernière modification: 01/01/2026                      │    │      │
│  │  │                                                         │    │      │
│  │  │ [Changer mon mot de passe]                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Authentification 2 facteurs: ❌ Désactivée             │    │      │
│  │  │ [Activer]                                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 👁️ MON PROFIL PUBLIC                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ Ce que les autres membres voient:                      │    │      │
│  │  │ • Nom et prénom                                        │    │      │
│  │  │ • Photo                                                │    │      │
│  │  │ • Date d'adhésion                                      │    │      │
│  │  │ • Profession (optionnel)                               │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Afficher ma profession                               │    │      │
│  │  │ ☐ Afficher mon email                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ [Aperçu de mon profil public]                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 24.2 Sous-Flow : Modification des Préférences de Notification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: PRÉFÉRENCES NOTIFICATIONS                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PRÉFÉRENCES DE NOTIFICATION                   │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CANAUX DE NOTIFICATION                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ 📱 Push (application):     [✅ Activé]                 │    │      │
│  │  │ 📨 SMS:                    [✅ Activé]                 │    │      │
│  │  │ 📧 Email:                  [✅ Activé]                 │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPES DE NOTIFICATIONS                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ 💵 Cotisations et paiements                            │    │      │
│  │  │    Rappels de cotisation:          [✅]                │    │      │
│  │  │    Confirmation de paiement:       [✅]                │    │      │
│  │  │                                                         │    │      │
│  │  │ 🎁 Cagnotte                                            │    │      │
│  │  │    Rappel de mon tour:             [✅]                │    │      │
│  │  │    Distribution effectuée:         [✅]                │    │      │
│  │  │                                                         │    │      │
│  │  │ 💳 Prêts                                               │    │      │
│  │  │    Rappel d'échéance:              [✅]                │    │      │
│  │  │    Demande de cautionnement:       [✅]                │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚖️ Sanctions                                           │    │      │
│  │  │    Nouvelle sanction:              [✅]                │    │      │
│  │  │    Décision de contestation:       [✅]                │    │      │
│  │  │                                                         │    │      │
│  │  │ 📅 Séances                                             │    │      │
│  │  │    Rappel de séance:               [✅]                │    │      │
│  │  │    Ordre du jour publié:           [✅]                │    │      │
│  │  │                                                         │    │      │
│  │  │ 📢 Communications                                      │    │      │
│  │  │    Annonces du Bureau:             [✅]                │    │      │
│  │  │    Messages reçus:                 [✅]                │    │      │
│  │  │    Nouveaux documents:             [☐]                 │    │      │
│  │  │                                                         │    │      │
│  │  │ 🗳️ Votes                                               │    │      │
│  │  │    Nouveau vote ouvert:            [✅]                │    │      │
│  │  │    Résultats du vote:              [✅]                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer mes préférences]                       │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 24.3 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-GP01 | Le membre peut modifier ses informations personnelles |
| RM-GP02 | Il peut gérer ses moyens de paiement |
| RM-GP03 | Il peut personnaliser ses notifications |
| RM-GP04 | Il contrôle ce qui est visible publiquement |
| RM-GP05 | Il peut activer l'authentification à 2 facteurs |

---

# 25. FLOW 23 : DÉMISSION

## 25.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: DÉMISSION                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Membre clique    │                                                       │
│  │ "Démissionner"   │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DÉMISSION DE LA TONTINE                       │      │
│  │                                                                  │      │
│  │  ⚠️ ATTENTION: La démission est une décision importante.        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VOTRE SITUATION ACTUELLE                                │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Membre depuis: Janvier 2024 (2 ans)                  │    │      │
│  │  │ 📍 Position tour: #15 (pas encore reçu ce cycle)       │    │      │
│  │  │                                                         │    │      │
│  │  │ 💵 Cotisations versées ce cycle: 400,000 XAF           │    │      │
│  │  │ 💳 Prêt en cours: 140,000 XAF (restant)                │    │      │
│  │  │ ⚖️ Sanctions impayées: 0 XAF                           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ⚠️ CONSÉQUENCES DE LA DÉMISSION                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Selon le règlement de la tontine:                      │    │      │
│  │  │                                                         │    │      │
│  │  │ ❌ Aucun remboursement des cotisations versées         │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ Si vous avez un prêt en cours:                       │    │      │
│  │  │    Vous devez rembourser intégralement le solde        │    │      │
│  │  │    restant (140,000 XAF) avant la démission.           │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ Si vous avez des sanctions impayées:                 │    │      │
│  │  │    Elles doivent être réglées avant la démission.      │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ Votre tour de cagnotte:                              │    │      │
│  │  │    Vous perdez votre droit à la cagnotte.              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ BLOCAGES ÉVENTUELS                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ ❌ Prêt en cours: 140,000 XAF                          │    │      │
│  │  │    Vous devez d'abord rembourser ce prêt.              │    │      │
│  │  │    [Rembourser maintenant]                             │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Sanctions: Aucune impayée                           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Je comprends et je souhaite démissionner]          │      │
│  │  (Bouton grisé si blocages)                                     │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Si prêt soldé et sanctions payées           │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    CONFIRMATION DE DÉMISSION                     │      │
│  │                                                                  │      │
│  │  ⚠️ Cette action est irréversible.                              │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MOTIF DE DÉMISSION (optionnel)                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Déménagement                                         │    │      │
│  │  │ ○ Difficultés financières                              │    │      │
│  │  │ ○ Raisons personnelles                                 │    │      │
│  │  │ ○ Autre                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Commentaire:                                           │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ _______________________________________________│    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ☑ Je confirme vouloir démissionner de la tontine              │      │
│  │  ☑ Je comprends que je ne serai pas remboursé                  │      │
│  │  ☑ Je comprends que cette décision est irréversible            │      │
│  │                                                                  │      │
│  │  Pour confirmer, tapez "DÉMISSION":                             │      │
│  │  [________________]                                             │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer ma démission]                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    📤 DEMANDE DE DÉMISSION ENVOYÉE               │      │
│  │                                                                  │      │
│  │  Votre demande de démission a été envoyée au Bureau.            │      │
│  │                                                                  │      │
│  │  Référence: DEM-2026-003                                        │      │
│  │  Statut: ⏳ En attente de validation par le Bureau              │      │
│  │                                                                  │      │
│  │  Le Bureau examinera votre demande lors de la prochaine         │      │
│  │  réunion. Vous serez notifié de la décision.                    │      │
│  │                                                                  │      │
│  │  En attendant, votre compte reste actif.                        │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│                               ▼ Validation par le Bureau                    │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ DÉMISSION ACCEPTÉE                         │      │
│  │                                                                  │      │
│  │  Votre démission a été acceptée par le Bureau.                  │      │
│  │                                                                  │      │
│  │  Date d'effet: 20 Mars 2026                                     │      │
│  │                                                                  │      │
│  │  Votre compte sera désactivé à cette date.                      │      │
│  │                                                                  │      │
│  │  Nous vous remercions pour votre participation à la tontine     │      │
│  │  et vous souhaitons bonne continuation.                         │      │
│  │                                                                  │      │
│  │  [Télécharger l'attestation de démission]                       │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────��───────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 25.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-DM01 | La démission nécessite validation du Bureau |
| RM-DM02 | Aucun remboursement des cotisations |
| RM-DM03 | Les prêts doivent être soldés avant démission |
| RM-DM04 | Les sanctions doivent être payées |
| RM-DM05 | Le membre perd son droit à la cagnotte |
| RM-DM06 | Une attestation de démission est générée |

---

# 26. FLOW 24 : CONSULTATION DES SÉANCES

## 26.1 Description

Le membre (et tout rôle du bureau) peut consulter les cycles de la tontine, les séances rattachées à chaque cycle, et le détail complet de chaque séance : ordre du jour, présences et cotisations collectées. L'accès est en **lecture seule** — aucune action de saisie n'est disponible depuis ce flow.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: CONSULTATION DES SÉANCES                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  ÉCRAN : LISTE DES CYCLES (E-MB25)                                   │  │
│  │                                                                      │  │
│  │  ┌─────────────────────────────────────────────────────────────┐    │  │
│  │  │ 📅 MES SÉANCES                                               │    │  │
│  │  ├─────────────────────────────────────────────────────────────┤    │  │
│  │  │ ▼ Cycle 3 — juin 2026                        🟢 ACTIF       │    │  │
│  │  │   ┌────────────────────────────────────────────────────┐    │    │  │
│  │  │   │ Séance #3 · 28/06/2026             ⏳ PLANIFIÉE   │    │    │  │
│  │  │   │ Séance #2 · 14/06/2026             ✅ TERMINÉE    │    │    │  │
│  │  │   │ Séance #1 · 31/05/2026             ✅ TERMINÉE    │    │    │  │
│  │  │   └────────────────────────────────────────────────────┘    │    │  │
│  │  │                                                              │    │  │
│  │  │ ► Cycle 2 — janvier 2026                    🔒 CLÔTURÉ      │    │  │
│  │  │ ► Cycle 1 — juillet 2025                    🔒 CLÔTURÉ      │    │  │
│  │  └─────────────────────────────────────────────────────────────┘    │  │
│  │                                                                      │  │
│  │  ℹ️  Aucun cycle : message "Aucun cycle disponible pour             │  │
│  │      cette tontine" (état vide)                                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                           │ clic séance                                     │
│                           ▼                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  ÉCRAN : DÉTAIL SÉANCE (E-MB26)                                      │  │
│  │                                                                      │  │
│  │  ┌─────────────────────────────────────────────────────────────┐    │  │
│  │  │ ← Retour          SÉANCE #2 — 14/06/2026                    │    │  │
│  │  ├─────────────────────────────────────────────────────────────┤    │  │
│  │  │  Cycle 3 · Tontine ABC · ✅ TERMINÉE                        │    │  │
│  │  │  Lieu : Domicile NKOA · 14h00 → 16h30                       │    │  │
│  │  ├─────────────────────────────────────────────────────────────┤    │  │
│  │  │  [ Ordre du jour ]  [ Présences ]  [ Cotisations ]          │    │  │
│  │  └─────────────────────────────────────────────────────────────┘    │  │
│  │                                                                      │  │
│  │  ── Onglet ORDRE DU JOUR ────────────────────────────────────────   │  │
│  │  │  1. Ouverture et appel                                       │    │  │
│  │  │  2. Lecture du PV précédent                                  │    │  │
│  │  │  3. Collecte des cotisations                                 │    │  │
│  │  │  4. Distribution de la cagnotte — NKOA Paul                 │    │  │
│  │  │  5. Questions diverses                                       │    │  │
│  │  │  6. Clôture                                                  │    │  │
│  │  │                                                              │    │  │
│  │  ── Onglet PRÉSENCES ────────────────────────────────────────── │    │  │
│  │  │  ┌──────────┬──────────┬──────────┬──────────┐              │    │  │
│  │  │  │ ✅ 10    │ ⏰ 2     │ 🟡 1     │ ❌ 1     │              │    │  │
│  │  │  │ Présents │ En ret.  │ Excusés  │ Absents  │              │    │  │
│  │  │  └──────────┴──────────┴──────────┴──────────┘              │    │  │
│  │  │  • NKOA Paul          ✅ Présent                             │    │  │
│  │  │  • BIYA Marie         ✅ Présente                            │    │  │
│  │  │  • FOKA Jean          ⏰ En retard                           │    │  │
│  │  │  • MANGA Claire       🟡 Excusée                             │    │  │
│  │  │  • TAMBA René         ❌ Absent                              │    │  │
│  │  │  ...                                                         │    │  │
│  │  │                                                              │    │  │
│  │  ── Onglet COTISATIONS ──────────────────────────────────────── │    │  │
│  │  │  Total attendu : 700 000 XAF                                 │    │  │
│  │  │  Total collecté : 650 000 XAF (92,9%)                        │    │  │
│  │  │  ──────────────────────────────────────────────────────      │    │  │
│  │  │  • NKOA Paul    50 000 XAF  ✅ Payée                         │    │  │
│  │  │  • BIYA Marie   50 000 XAF  ✅ Payée                         │    │  │
│  │  │  • TAMBA René   50 000 XAF  ❌ Non payée                     │    │  │
│  │  │  ...                                                         │    │  │
│  │  └─────────────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 26.2 Règles Métier

| Règle | Description |
|-------|-------------|
| RM-CS01 | Accès disponible pour tous les rôles : Membre, Président, Secrétaire, Trésorier, Censeur, Commissaire |
| RM-CS02 | Vue en lecture seule — aucune saisie ni action depuis ces écrans |
| RM-CS03 | Les cycles sont triés du plus récent au plus ancien |
| RM-CS04 | Si aucun cycle n'existe (membre sans tontine), afficher l'état vide sans erreur |
| RM-CS05 | Les séances sont chargées à l'ouverture d'un cycle (accordéon) |
| RM-CS06 | L'onglet Ordre du Jour affiche les points dans l'ordre de saisie |
| RM-CS07 | L'onglet Présences affiche un résumé chiffré + la liste individuelle |
| RM-CS08 | L'onglet Cotisations affiche le total attendu, collecté et le détail par membre |

## 26.3 Points d'Entrée

| Plateforme | Entrée |
|-----------|--------|
| Web — Membre | Sidebar › Mon espace › Séances |
| Web — Trésorier | Sidebar › Trésorerie › Séances |
| Web — Censeur | Sidebar › Discipline › Séances |
| Web — Commissaire | Sidebar › Audit › Séances |
| Mobile | Barre d'onglets › Séances |

---

# 27. RÉCAPITULATIF DES ÉCRANS

## 27.1 Liste des Écrans du Membre

| # | Écran | Description | Accès |
|---|-------|-------------|-------|
| E-MB01 | Tableau de bord | Vue d'ensemble personnalisée | Menu principal |
| E-MB02 | Inscription | Formulaire d'adhésion | Invitation |
| E-MB03 | Paiement cotisation | Payer ses cotisations | Actions rapides |
| E-MB04 | Historique cotisations | Voir ses paiements passés | Menu cotisations |
| E-MB05 | Planning des tours | Voir l'ordre de distribution | Menu cagnotte |
| E-MB06 | Échange de tour | Permuter avec un autre membre | Planning |
| E-MB07 | Réception cagnotte | Confirmer la réception | Notification |
| E-MB08 | Simulation prêt | Calculer un prêt | Menu prêts |
| E-MB09 | Demande prêt | Soumettre une demande | Menu prêts |
| E-MB10 | Mes prêts | Voir et rembourser | Menu prêts |
| E-MB11 | Signalement événement | Déclarer un événement | Actions rapides |
| E-MB12 | Demande aide | Solliciter la caisse de secours | Menu solidarité |
| E-MB13 | Cotisation extra | Contribuer à une collecte | Notification |
| E-MB14 | Signalement absence | Prévenir d'une absence | Menu séances |
| E-MB15 | Justificatif | Soumettre une preuve | Menu séances |
| E-MB16 | Mes sanctions | Voir ses sanctions | Menu profil |
| E-MB17 | Contestation | Contester une sanction | Mes sanctions |
| E-MB18 | Paiement sanction | Payer une amende | Mes sanctions |
| E-MB19 | Confirmation présence | Confirmer sa venue | Notification |
| E-MB20 | Vote | Participer aux décisions | Notification |
| E-MB21 | Documents | Voir PV, rapports, annonces | Menu principal |
| E-MB22 | Messagerie | Contacter le Bureau | Menu principal |
| E-MB23 | Mon profil | Modifier ses informations | Menu principal |
| E-MB24 | Démission | Quitter la tontine | Paramètres |
| E-MB25 | Cycles / Séances | Liste des cycles et séances par cycle | Menu Séances |
| E-MB26 | Détail séance | Ordre du jour, présences, cotisations d'une séance | Liste séances |

---

# 28. RÈGLES MÉTIER ET NOTIFICATIONS

## 28.1 Notifications Reçues par le Membre

| Événement | Canaux | Priorité |
|-----------|--------|----------|
| Rappel cotisation (J-3) | Push, SMS | Haute |
| Cotisation approuvée | Push | Normale |
| Mon tour de cagnotte approche (J-7) | Push, SMS | Haute |
| Cagnotte distribuée | Push, SMS | Haute |
| Demande de prêt - statut | Push | Normale |
| Rappel échéance prêt (J-3) | Push, SMS | Haute |
| Demande de cautionnement | Push, SMS | Haute |
| Nouvelle sanction | Push, SMS | Haute |
| Décision contestation | Push | Normale |
| Cotisation extraordinaire lancée | Push, SMS | Haute |
| Nouvelle annonce | Push | Normale |
| Rappel séance (J-5, J-1) | Push, SMS | Normale |
| Ordre du jour publié | Push | Normale |
| Nouveau vote ouvert | Push | Haute |
| Résultats du vote | Push | Normale |
| PV publié | Push | Normale |
| Message du Bureau | Push | Normale |
| Risque de radiation | Push, SMS, Email | Critique |

## 28.2 Navigation du Membre

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NAVIGATION - MEMBRE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         MENU PRINCIPAL                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│       ┌────────┬──────────┬────────┼────────┬──────────┬────────┐          │
│       │        │          │        │        │          │        │          │
│       ▼        ▼          ▼        ▼        ▼          ▼        ▼          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  │Tableau │ │Cotisa- │ │Cagnotte│ │ Prêts  │ │Séances │ │Docs    │ │Profil  │
│  │de bord │ │tions   │ │        │ │        │ │        │ │        │ │        │
│  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
│      │          │          │          │          │          │          │
│      │     ┌────┴────┐ ┌───┴───┐ ┌────┴────┐ ┌───┴───┐      │     ┌────┴────┐
│      │     ▼         ▼ ▼       ▼ ▼         ▼ ▼       ▼      │     ▼         ▼
│      │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│ ┌──────┐ ┌──────┐
│      │ │Payer │ │Histo-│ │Plan- │ │Simu- │ │Confir│ │Signa-││ │Infos │ │Notif │
│      │ │      │ │rique │ │ning  │ │ler   │ │mer   │ │ler   ││ │perso │ │      │
│      │ └──────┘ └──────┘ └──────┘ │prêt  │ │prés. │ │abs.  ││ └──────┘ └──────┘
│      │                   ┌──────┐ └──────┘ └──────┘ └──────┘│
│      │                   │Échan-│ ┌──────┐ ┌──────┐        │ ┌──────┐ ┌──────┐
│      │                   │ger   │ │Deman-│ │Voter │        │ │Moyens│ │Démis-│
│      │                   │tour  │ │der   │ │      │        │ │paiem.│ │sion  │
│      │                   └──────┘ │prêt  │ └──────┘        │ └──────┘ └──────┘
│      │                            └──────┘                 │
│      │                   ┌──────┐ ┌──────┐                 │ ┌──────┐
│      │                   │Récep-│ │Rem-  │                 │ │Sanc- │
│      │                   │tion  │ │bour- │                 │ │tions │
│      │                   │cagn. │ │ser   │                 │ └──────┘
│      │                   └──────┘ └──────┘                 │
│      │                                                      │
│      │    ┌─────────────────────────────────────────────┐  │
│      └───►│           ACTIONS RAPIDES                   │  │
│           │                                             │  │
│           │ [💵 Payer] [💳 Prêt] [📅 Présence]          │  │
│           │ [🆘 Événement] [📄 Documents] [✉️ Bureau]    │  │
│           │                                             │  │
│           └─────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         🔔 NOTIFICATIONS                            │   │
│  │  • Rappels de cotisation et échéances                              │   │
│  │  • Tour de cagnotte                                                │   │
│  │  • Demandes de cautionnement                                       │   │
│  │  • Sanctions                                                       │   │
│  │  • Séances et votes                                                │   │
│  │  • Messages du Bureau                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# FIN DU DOCUMENT - FLOWS DU MEMBRE

## Récapitulatif des Livrables

| Document | Contenu |
|----------|---------|
| Flows_Membre_TontineApp.md | Vue d'ensemble, Flows 1-6 (Inscription, Cotisations, Planning, Échange) |
| Flows_Membre_TontineApp_Suite.md | Flows 7-11 (Prêts, Aide sociale) |
| Flows_Membre_TontineApp_Suite2.md | Flows 12-19 (Absences, Sanctions, Présence, Vote) |
| Flows_Membre_TontineApp_Suite3.md | Flows 20-24 (Documents, Communication, Profil, Démission, Séances), Récapitulatif |

## Statistiques

| Élément | Nombre |
|---------|--------|
| Flows principaux | 24 |
| Sous-flows | 6 |
| Écrans | 26 |
| Règles métier | 58+ |
| Types de notifications | 18 |

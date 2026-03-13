# 🟠 FLOWS COMPLETS DU SECRÉTAIRE
## Application de Gestion de Tontine - Cameroun

---

# 1. VUE D'ENSEMBLE DU RÔLE

## 1.1 Responsabilités du Secrétaire

Le Secrétaire est le **garant de l'administration** de la tontine. Il est responsable de :

- **Documentation** : Rédiger et archiver tous les documents officiels
- **Procès-verbaux** : Rédiger les PV de chaque séance
- **Ordres du jour** : Préparer et soumettre les ODJ
- **Gestion des membres** : Traiter les dossiers d'adhésion et de démission
- **Présences** : Gérer le pointage des membres aux séances
- **Communication** : Convoquer les membres et diffuser les informations
- **Archives** : Maintenir les archives de la tontine

## 1.2 Pouvoirs et Limites

| Action | Pouvoir du Secrétaire |
|--------|----------------------|
| Préparer l'ordre du jour | ✅ Seul (soumis au Président) |
| Rédiger le PV | ✅ Seul |
| Signer le PV | ✅ Seul (+ signature Président) |
| Pointage des présences | ✅ Seul |
| Traiter dossiers adhésion | ✅ Seul (soumis au Président) |
| Convoquer les membres | ✅ Seul |
| Valider des opérations financières | ❌ Non |
| Gérer les caisses | ❌ Non |
| Appliquer des sanctions | ❌ Non |

## 1.3 Accès et Permissions

| Fonction | Accès |
|----------|-------|
| Données financières | 👁️ Consultation (bilans uniquement) |
| Liste des membres | ✅ Lecture/Écriture |
| Présences/Absences | ✅ Gestion complète |
| Documents (ODJ, PV) | ✅ Création/Modification/Archive |
| Dossiers d'adhésion | ✅ Gestion complète |
| Annonces et convocations | ✅ Envoi |

## 1.4 Notifications Reçues

| Type | Priorité |
|------|----------|
| Rappel préparation ODJ | Haute |
| Séance à venir | Haute |
| Nouvelle demande d'adhésion | Normale |
| Demande de démission | Haute |
| PV validé par Président | Normale |
| ODJ validé par Président | Normale |
| Signalement d'absence | Normale |

---

# 2. FLOW 1 : TABLEAU DE BORD DU SECRÉTAIRE

## 2.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: TABLEAU DE BORD DU SECRÉTAIRE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Secrétaire se    │                                                       │
│  │ connecte à       │                                                       │
│  │ l'application    │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    TABLEAU DE BORD - SECRÉTAIRE                  │      │
│  │                                                                  │      │
│  │  Bonjour Marie NGUEMO 👋                      [🔔 5] [👤 Profil] │      │
│  │  Secrétaire de la Tontine [Nom]                                  │      │
│  │                                                                  │      │
│  │  ┌──────────────────────────────────────────────────────���──┐    │      │
│  │  │ 📅 PROCHAINE SÉANCE                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Séance #11 - Samedi 12 Avril 2026 à 15h00              │    │      │
│  │  │ Lieu: Salle des fêtes FOUDA, Yaoundé                   │    │      │
│  │  │ Bénéficiaire: Claire ESSOMBA                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Statut ODJ: ⏳ À préparer (J-5)                        │    │      │
│  │  │ Confirmations: 38/47 membres (81%)                     │    │      │
│  │  │                                                         │    │      │
│  │  │ [Préparer l'ODJ]  [Voir les confirmations]             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ⚡ ACTIONS URGENTES                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ 🔴 PV Séance #10 à finaliser (J+3)          [Rédiger]  │    │      │
│  │  │ 🟡 2 demandes d'adhésion en attente         [Traiter]  │    │      │
│  │  │ 🟡 1 demande de démission reçue             [Traiter]  │    │      │
│  │  │ 🟢 Convocations séance #11                  [Envoyer]  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 📊 VUE D'ENSEMBLE                                       │    │      │
│  │  │                                                         │    │      │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │      │
│  │  │  │ 👥       │ │ 📋       │ │ 📝       │ │ ✅       │   │    │      │
│  │  │  │ Membres  │ │ Séances  │ │ PV en    │ │ Taux     │   │    │      │
│  │  │  │ actifs   │ │ cycle    │ │ attente  │ │ présence │   │    │      │
│  │  │  │   47     │ │  10/12   │ │    1     │ │   85%    │   │    │      │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │      │
│  │  │                                                         │    │      │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │    │      │
│  │  │  │ 📥       │ │ 📤       │ │ 📂       │ │ 🔔       │   │    │      │
│  │  │  │ Adhésions│ │ Démiss.  │ │ Documents│ │ Absences │   │    │      │
│  │  │  │ en cours │ │ en cours │ │ archivés │ │ signalées│   │    │      │
│  │  │  │    2     │ │    1     │ │   156    │ │    3     │   │    │      │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ ⚡ ACTIONS RAPIDES                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ [📋 Préparer ODJ]     [📝 Rédiger PV]                  │    │      │
│  │  │ [👥 Gérer membres]    [📧 Envoyer convocations]        │    │      │
│  │  │ [✅ Pointage]         [📂 Archives]                    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 📜 ACTIVITÉ RÉCENTE                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ • 07/04 - ODJ #10 validé par le Président              │    │      │
│  │  │ • 05/04 - PV #9 signé et archivé                       │    │      │
│  │  │ • 04/04 - Convocations séance #10 envoyées (47)        │    │      │
│  │  │ • 03/04 - Demande adhésion Paul ESSONO reçue           │    │      │
│  │  │                                                         │    │      │
│  │  │ [Voir tout l'historique]                               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ 📅 CALENDRIER                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ Aujourd'hui (07/04):                                   │    │      │
│  │  │ • Finaliser PV #10                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Cette semaine:                                         │    │      │
│  │  │ • 09/04 - Préparer ODJ #11                             │    │      │
│  │  │ • 10/04 - Envoyer convocations                         │    │      │
│  │  │ • 12/04 - Séance #11 (Pointage à effectuer)            │    │      │
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
| Prochaine séance | Informations et statut ODJ | Temps réel |
| Actions urgentes | Tâches prioritaires | Temps réel |
| Vue d'ensemble | Indicateurs clés | Temps réel |
| Activité récente | Dernières actions | À chaque action |
| Calendrier | Échéances à venir | Quotidien |

---

# 3. FLOW 2 : PRÉPARATION DE L'ORDRE DU JOUR

## 3.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: PRÉPARATION DE L'ORDRE DU JOUR                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Secrétaire clique│                                                       │
│  │ "Préparer ODJ"   │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PRÉPARATION ORDRE DU JOUR                     │      │
│  │                    Séance #11 - 12 Avril 2026                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS DE LA SÉANCE                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Type: ● Ordinaire  ○ Extraordinaire                    │    │      │
│  │  │ Date: [12/04/2026]                                     │    │      │
│  │  │ Heure: [15:00]                                         │    │      │
│  │  │ Lieu: [Salle des fêtes FOUDA, Yaoundé_______________]  │    │      │
│  │  │                                                         │    │      │
│  │  │ Bénéficiaire de la cagnotte (auto):                    │    │      │
│  │  │ Claire ESSOMBA (Tour #11)                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ POINTS DE L'ORDRE DU JOUR                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Points standards (automatiques):                       │    │      │
│  │  │ ☑ 1. Ouverture de la séance                            │    │      │
│  │  │ ☑ 2. Appel des membres                                 │    │      │
│  │  │ ☑ 3. Lecture et adoption du PV précédent (#10)         │    │      │
│  │  │ ☑ 4. Rapport du Trésorier                              │    │      │
│  │  │ ☑ 5. Rapport du Censeur                                │    │      │
│  │  │ ☑ 6. Rapport du Commissaire aux Comptes                │    │      │
│  │  │ ☑ 7. Collecte des cotisations                          │    │      │
│  │  │ ☑ 8. Distribution de la cagnotte                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Points spécifiques à ajouter:                          │    │      │
│  │  │ ☑ 9. Présentation candidats adhésion (2)               │    │      │
│  │  │      • Paul ESSONO                                     │    │      │
│  │  │      • Jeanne FOUDA                                    │    │      │
│  │  │ ☑ 10. Vote adhésion Paul ESSONO                        │    │      │
│  │  │ ☑ 11. Vote adhésion Jeanne FOUDA                       │    │      │
│  │  │ ☐ 12. [Ajouter un point...]                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Points finaux (automatiques):                          │    │      │
│  │  │ ☑ Questions diverses                                   │    │      │
│  │  │ ☑ Clôture de la séance                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ [+ Ajouter un point]  [↕ Réorganiser]                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ POINTS SUGGÉRÉS                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Le système suggère d'ajouter:                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ⚠️ 1 demande de démission à traiter                    │    │      │
│  │  │    → Pierre NGUEMO (reçue le 05/04)                    │    │      │
│  │  │    [Ajouter à l'ODJ]                                   │    │      │
│  │  │                                                         ���    │      │
│  │  │ 📋 Cotisation extraordinaire en cours                  │    │      │
│  │  │    → Point d'information sur l'état de la collecte    │    │      │
│  │  │    [Ajouter à l'ODJ]                                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DOCUMENTS À JOINDRE                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ PV séance #10 (pour adoption)                        │    │      │
│  │  │ ☑ Dossier adhésion Paul ESSONO                         │    │      │
│  │  │ ☑ Dossier adhésion Jeanne FOUDA                        │    │      │
│  │  │ ☐ [Ajouter un document...]                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer brouillon]  [Prévisualiser]            │      │
│  │             [Soumettre au Président]                             │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Prévisualiser]                    │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PRÉVISUALISATION ODJ                          │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │         ORDRE DU JOUR - SÉANCE #11                      │    │      │
│  │  │         Tontine [Nom de la Tontine]                     │    │      │
│  │  │                                                         │    │      │
│  ��  │ Date: Samedi 12 Avril 2026 à 15h00                     │    │      │
│  │  │ Lieu: Salle des fêtes FOUDA, Yaoundé                   │    │      │
│  │  │ Type: Séance ordinaire                                 │    │      │
│  │  │ Bénéficiaire: Claire ESSOMBA                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │                                                         │    │      │
│  │  │ 1. Ouverture de la séance                              │    │      │
│  │  │ 2. Appel des membres                                   │    │      │
│  │  │ 3. Lecture et adoption du PV de la séance #10          │    │      │
│  │  │ 4. Rapport du Trésorier                                │    │      │
│  │  │ 5. Rapport du Censeur                                  │    │      │
│  │  │ 6. Rapport du Commissaire aux Comptes                  │    │      │
│  │  │ 7. Collecte des cotisations                            │    │      │
│  │  │ 8. Distribution de la cagnotte à Claire ESSOMBA        │    │      │
│  │  │ 9. Présentation des candidats à l'adhésion:            │    │      │
│  │  │    a) Paul ESSONO                                      │    │      │
│  │  │    b) Jeanne FOUDA                                     │    │      │
│  │  │ 10. Vote d'adhésion - Paul ESSONO                      │    │      │
│  │  │ 11. Vote d'adhésion - Jeanne FOUDA                     │    │      │
│  │  │ 12. Information: État cotisation extraordinaire        │    │      │
│  │  │ 13. Questions diverses                                 │    │      │
│  │  │ 14. Clôture de la séance                               │    │      │
│  │  │                                                         │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Préparé par: Marie NGUEMO, Secrétaire                  │    │      │
│  │  │ Date: 07/04/2026                                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Modifier]  [📥 Télécharger PDF]  [Soumettre au Président]     │      │
│  │                                                                  │      │
│  └───────────���────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Soumettre au Président]           │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ ODJ SOUMIS AU PRÉSIDENT                    │      │
│  │                                                                  │      │
│  │  L'ordre du jour de la séance #11 a été soumis au Président     │      │
│  │  pour validation.                                               │      │
│  │                                                                  │      │
│  │  Référence: ODJ-2026-011                                        │      │
│  │  Statut: ⏳ En attente de validation                            │      │
│  │                                                                  │      │
│  │  Vous serez notifié dès validation ou demande de modification.  │      │
│  │                                                                  │      │
│  │  [Voir l'ODJ]                                                   │      │
│  │                                                                  ���      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Sous-Flow : ODJ Validé / Modifications Demandées

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: RETOUR DU PRÉSIDENT                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │ 🔔 NOTIFICATION: "ODJ #11 - Modifications demandées"             │      │
│  └────────────────────────��───┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    MODIFICATIONS DEMANDÉES                       │      │
│  │                                                                  │      │
│  │  ODJ: Séance #11 - 12 Avril 2026                                │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ COMMENTAIRES DU PRÉSIDENT                               │    │      │
│  │  │                                                         │    │      │
│  │  │ "Merci de bien vouloir:                                │    │      │
│  │  │  1. Ajouter un point sur la démission de Pierre NGUEMO │    │      │
│  │  │  2. Prévoir 15 minutes pour les questions diverses     │    │      │
│  │  │     (plusieurs sujets à aborder)"                      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Modifier l'ODJ]                                               │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│              OU                                                             │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │ 🔔 NOTIFICATION: "ODJ #11 - Validé par le Président"             │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ ODJ VALIDÉ                                 │      │
│  │                                                                  │      │
│  │  L'ordre du jour de la séance #11 a été validé.                 │      │
│  │                                                                  │      │
│  │  • ODJ publié dans l'espace Documents                           │      │
│  │  • Prêt à être envoyé avec les convocations                     │      │
│  │                                                                  │      │
│  │  [Envoyer les convocations]  [Voir l'ODJ]                       │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3.3 Règles Métier - Ordre du Jour

| Règle | Description |
|-------|-------------|
| RM-OJ01 | L'ODJ doit être préparé au moins 5 jours avant la séance |
| RM-OJ02 | Les points standards sont automatiquement inclus |
| RM-OJ03 | L'ODJ doit être validé par le Président avant envoi |
| RM-OJ04 | Le système suggère les points pertinents (adhésions, démissions, etc.) |
| RM-OJ05 | L'ODJ est joint aux convocations |

---

# 4. FLOW 3 : ENVOI DES CONVOCATIONS

## 4.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ENVOI DES CONVOCATIONS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Secrétaire clique│                                                       │
│  │ "Envoyer         │                                                       │
│  │  convocations"   │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ENVOI DES CONVOCATIONS                        │      │
│  │                    Séance #11 - 12 Avril 2026                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATIONS                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ ODJ validé par le Président                         │    │      │
│  │  │ ✅ Date de séance confirmée                            │    │      │
│  │  │ ✅ Lieu confirmé                                       │    │      │
│  │  │ ✅ Liste des membres à jour (47)                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DESTINATAIRES                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ ● Tous les membres actifs (47)                         │    │      │
│  │  │ ○ Sélection personnalisée                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Inclure également:                                     │    │      │
│  │  │ ☑ Candidats à l'adhésion (pour présentation) (2)       │    │      │
│  │  │ ☐ Invités spéciaux                                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CANAUX D'ENVOI                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Notification push (application)                      │    │      │
│  │  │ ☑ SMS                                                  │    │      │
│  │  │ ☑ Email                                                │    │      │
│  │  │ ☐ WhatsApp                                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MESSAGE DE CONVOCATION                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Objet: [Convocation - Séance #11 du 12/04/2026________] │    │      │
│  │  │                                                         │    │      │
│  │  │ Message:                                               │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Cher(e) membre,                                 │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Vous êtes convoqué(e) à la séance #11 de notre │    │    │      │
│  │  │ │ tontine qui se tiendra:                        │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ 📅 Date: Samedi 12 Avril 2026                  │    │    │      │
│  │  │ │ 🕐 Heure: 15h00                                │    │    │      │
│  │  │ │ 📍 Lieu: Salle des fêtes FOUDA, Yaoundé        │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ 👤 Bénéficiaire: Claire ESSOMBA                │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ L'ordre du jour est joint à ce message.        │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Merci de confirmer votre présence.             │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Cordialement,                                  │    │    │      │
│  │  │ │ Marie NGUEMO, Secrétaire                       │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Joindre l'ordre du jour (PDF)                        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DEMANDE DE CONFIRMATION                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Demander aux membres de confirmer leur présence      │    │      │
│  │  │ Date limite de confirmation: [10/04/2026] (J-2)        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RAPPELS AUTOMATIQUES                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Rappel J-2 (membres n'ayant pas confirmé)            │    │      │
│  │  │ ☑ Rappel J-1 (tous les membres)                        │    │      │
│  │  │ ☑ Rappel le jour J (matin)                             │    │      │
│  │  └───────────────────────────────────────────────────────���─┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Prévisualiser]  [Envoyer les convocations]         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ CONVOCATIONS ENVOYÉES                      │      │
│  │                                                                  │      │
│  │  Les convocations pour la séance #11 ont été envoyées.          │      │
│  │                                                                  │      │
│  │  Résumé de l'envoi:                                             │      │
│  │  • 47 notifications push ✅                                     │      │
│  │  • 47 SMS ✅                                                    │      │
│  │  • 45 emails ✅ (2 adresses invalides)                          │      │
│  │  • 2 convocations candidats ✅                                  │      │
│  │                                                                  │      │
│  │  Rappels programmés:                                            │      │
│  │  • 10/04 - Rappel J-2                                           │      │
│  │  • 11/04 - Rappel J-1                                           │      │
│  │  • 12/04 - Rappel jour J                                        │      │
│  │                                                                  │      │
│  │  [Voir le suivi des confirmations]                              │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.2 Règles Métier - Convocations

| Règle | Description |
|-------|-------------|
| RM-CV01 | Les convocations sont envoyées au moins 5 jours avant |
| RM-CV02 | L'ODJ doit être validé avant envoi des convocations |
| RM-CV03 | Plusieurs canaux peuvent être utilisés simultanément |
| RM-CV04 | Les rappels automatiques sont configurables |
| RM-CV05 | Les candidats à l'adhésion peuvent être convoqués |

---

# 5. FLOW 4 : GESTION DES CONFIRMATIONS DE PRÉSENCE

## 5.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GESTION DES CONFIRMATIONS                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Secrétaire clique│                                                       │
│  │ "Voir les        │                                                       │
│  │  confirmations"  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SUIVI DES CONFIRMATIONS                       │      │
│  │                    Séance #11 - 12 Avril 2026                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉSUMÉ                                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Progression: ████████████████░░░░ 81%                   │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Présents confirmés:     38                          │    │      │
│  │  │ ❌ Absents signalés:        3                          │    │      │
│  │  │ ❓ Sans réponse:            6                          │    │      │
│  │  │ ─────────────────────────────                          │    │      │
│  │  │ Total membres:             47                          │    │      │
│  │  │                                                         │    │      │
│  │  │ Quorum (67%): ✅ Sera atteint (38 > 32)                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Filtres: [Tous ▼] [Rechercher: _________________]              │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉTAIL PAR MEMBRE                                       │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ PRÉSENTS CONFIRMÉS (38)                             │    │      │
│  │  │ ├─ Jean FOTSO (Président)         Confirmé le 08/04    │    │      │
│  │  │ ├─ Marie NGUEMO (Secrétaire)      Confirmé le 07/04    │    │      │
│  │  │ ├─ Robert TCHANA (Trésorier)      Confirmé le 08/04    │    │      │
│  │  │ ├─ Claire ESSOMBA (Bénéficiaire)  Confirmé le 07/04    │    │      │
│  │  │ ├─ ...                                                 │    │      │
│  │  │ └─ [Voir tous]                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ ❌ ABSENTS SIGNALÉS (3)                                │    │      │
│  │  │ ├─ Pierre NGUEMO                  Motif: Voyage        │    │      │
│  │  │ │   Signalé le 09/04                                   │    │      │
│  │  │ │   Justificatif: ⏳ En attente                        │    │      │
│  │  │ ├─ Anne MBARGA                    Motif: Raison médic. │    │      │
│  │  │ │   Signalé le 08/04                                   ��    │      │
│  │  │ │   Justificatif: ✅ Certificat joint                  │    │      │
│  │  │ └─ Paul BIYA                      Motif: Travail       │    │      │
│  │  │     Signalé le 10/04                                   │    │      │
│  │  │     Justificatif: ⏳ À fournir                         │    │      │
│  │  │                                                         │    │      │
│  │  │ ❓ SANS RÉPONSE (6)                                    │    │      │
│  │  │ ├─ Jacques FOUDA          [📱 Rappeler]  [📧 Relancer] │    │      │
│  │  │ ├─ Marthe ONANA           [📱 Rappeler]  [📧 Relancer] │    │      │
│  │  │ ├─ ...                                                 │    │      │
│  │  │ └─ [Relancer tous]                                     │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [📧 Relancer les sans réponse]  [📥 Exporter la liste]         │      │
│  │  [🖨️ Imprimer feuille de présence]                              │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 5.2 Règles Métier - Confirmations

| Règle | Description |
|-------|-------------|
| RM-CF01 | Les membres peuvent confirmer via l'application |
| RM-CF02 | Le Secrétaire voit les confirmations en temps réel |
| RM-CF03 | Les membres sans réponse peuvent être relancés |
| RM-CF04 | Le quorum est calculé automatiquement |
| RM-CF05 | La feuille de présence peut être préparée à l'avance |

---

# 6. FLOW 5 : POINTAGE DES PRÉSENCES (PENDANT LA SÉANCE)

## 6.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: POINTAGE DES PRÉSENCES                             │
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
│  │ Secrétaire clique│                                                       │
│  │ "Pointage"       │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    POINTAGE DES PRÉSENCES                        │      │
│  │                    Séance #11 - 12 Avril 2026                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ MODE DE POINTAGE                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ ● Liste manuelle                                       │    │      │
│  │  │ ○ QR Code (chaque membre scanne)                       │    │      │
│  │  │ ○ Appel nominal                                        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ HEURE D'OUVERTURE: 15:00                                │    │      │
│  │  │ HEURE DE POINTAGE: 15:12                                │    │      │
│  │  │ TOLÉRANCE RETARD: 15 minutes (jusqu'à 15:15)            │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Recherche rapide: [____________________] 🔍                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ LISTE DES MEMBRES (47)                                  │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Jean FOTSO (Président)                              │    │      │
│  │  │    Confirmé: ✅ | Statut: [✅ Présent ▼]               │    │      │
│  │  │    Heure arrivée: 14:55                                │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Marie NGUEMO (Secrétaire)                           │    │      │
│  │  │    Confirmé: ✅ | Statut: [✅ Présent ▼]               │    │      │
│  │  │    Heure arrivée: 14:50                                │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Robert TCHANA (Trésorier)                           │    │      │
│  │  │    Confirmé: ✅ | Statut: [��� Présent ▼]               │    │      │
│  │  │    Heure arrivée: 15:02                                │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Jacques FOUDA                                       │    │      │
│  │  │    Confirmé: ❓ | Statut: [⏰ En retard ▼]             │    │      │
│  │  │    Heure arrivée: 15:18 ⚠️ (+3 min après tolérance)    │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Pierre NGUEMO                                       │    │      │
│  │  │    Confirmé: ❌ Absent signalé                         │    │      │
│  │  │    Statut: [❌ Absent excusé ▼]                        │    │      │
│  │  │    Motif: Voyage | Justificatif: ⏳                    │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Anne MBARGA                                         │    │      │
│  │  │    Confirmé: ❌ Absent signalé                         │    │      │
│  │  │    Statut: [❌ Absent excusé ▼]                        │    │      │
│  │  │    Motif: Raison médicale | Justificatif: ✅           │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 Marthe ONANA                                        │    │      │
│  │  │    Confirmé: ❓ | Statut: [❌ Absent non excusé ▼]     │    │      │
│  │  │    → Sanction applicable                               │    │      │
│  │  │                                                         │    │      │
│  │  │ ... (40 autres membres)                                │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Options de statut:                                             │      │
│  │  ✅ Présent | ⏰ En retard | ❌ Absent excusé |                  │      │
│  │  ❌ Absent non excusé | 🚪 Parti avant la fin                   │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ RÉSUMÉ EN TEMPS RÉEL                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ ✅ Présents:           38                              │    │      │
│  │  │ ⏰ En retard:           2                              │    │      │
│  │  │ ❌ Absents excusés:     3                              │    │      │
│  │  │ ❌ Absents non excusés: 4                              │    │      │
│  │  │ ─────────────────────────────                          │    │      │
│  │  │ Total:                 47                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Quorum: ✅ Atteint (40 présents/retard sur 32 requis)  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Enregistrer provisoirement]  [Finaliser le pointage]          │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Finaliser le pointage]            │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FINALISATION DU POINTAGE                      │      │
│  │                                                                  │      │
│  │  ⚠️ Vous êtes sur le point de finaliser le pointage.            │      │
│  │     Après finalisation, les modifications nécessiteront         │      │
│  │     une justification.                                          │      │
│  │                                                                  │      │
│  │  Résumé:                                                        │      │
│  │  • 38 présents à l'heure                                        │      │
│  │  • 2 en retard (sanctions applicables)                          │      │
│  │  • 3 absents excusés                                            │      │
│  │  • 4 absents non excusés (sanctions applicables)                │      │
│  │                                                                  │      │
│  │  ☑ Transmettre les retards et absences au Censeur              │      │
│  │                                                                  │      │
│  │  [Annuler]  [Confirmer la finalisation]                         │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ POINTAGE FINALISÉ                          │      │
│  │                                                                  │      │
│  │  Le pointage de la séance #11 a été finalisé.                   │      │
│  │                                                                  │      │
│  │  • Feuille de présence enregistrée                              │      │
│  │  • 6 cas transmis au Censeur (2 retards + 4 absences)           │      │
│  │  • Données disponibles pour le PV                               │      │
│  │                                                                  │      │
│  │  [📥 Télécharger la feuille de présence]                        │      │
│  │                                                                  │      │
│  └──────────────────────────────────────��───────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Règles Métier - Pointage

| Règle | Description |
|-------|-------------|
| RM-PT01 | Le pointage est effectué par le Secrétaire |
| RM-PT02 | Les retards sont détectés automatiquement |
| RM-PT03 | La tolérance de retard est configurable |
| RM-PT04 | Les absents non excusés sont transmis au Censeur |
| RM-PT05 | Le pointage est finalisé une fois pour la séance |
| RM-PT06 | La feuille de présence est jointe au PV |

---

# 7. FLOW 6 : RÉDACTION DU PROCÈS-VERBAL
# 🟠 FLOWS COMPLETS DU SECRÉTAIRE (SUITE)
## Application de Gestion de Tontine - Cameroun

---

# 7. FLOW 6 : RÉDACTION DU PROCÈS-VERBAL (Suite)

## 7.1 Diagramme de Flux (Suite)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: RÉDACTION DU PROCÈS-VERBAL                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐                                                       │
│  │ Secrétaire clique│                                                       │
│  │ "Rédiger PV"     │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    RÉDACTION DU PROCÈS-VERBAL                    ���      │
│  │                    Séance #11 - 12 Avril 2026                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DONNÉES AUTOMATIQUES (pré-remplies)                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Date: Samedi 12 Avril 2026                             │    │      │
│  │  │ Lieu: Salle des fêtes FOUDA, Yaoundé                   │    │      │
│  │  │ Heure ouverture: 15:05                                 │    │      │
│  │  │ Heure clôture: 17:30                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Présents: 40/47 (85%)                                  │    │      │
│  │  │ Absents excusés: 3                                     │    │      │
│  │  │ Absents non excusés: 4                                 │    │      │
│  │  │ Quorum: ✅ Atteint                                     │    │      │
│  │  │                                                         │    │      │
│  │  │ Président de séance: Jean FOTSO                        │    │      │
│  │  │ Secrétaire de séance: Marie NGUEMO                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉROULEMENT DE LA SÉANCE                                │    │      │
│  │  │ (Suivre l'ordre du jour)                                │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 1. OUVERTURE DE LA SÉANCE                              │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Le Président a ouvert la séance à 15h05 en     │    │    │      │
│  │  │ │ souhaitant la bienvenue à tous les membres     │    │    │      │
│  │  │ │ présents.                                       │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 2. APPEL DES MEMBRES                                   │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ [Automatique: données du pointage]              │    │    │      │
│  │  │ │ 40 membres présents sur 47.                     │    │    │      │
│  │  │ │ Le quorum étant atteint, la séance peut        │    │    │      │
│  │  │ │ valablement délibérer.                          │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 3. LECTURE ET ADOPTION DU PV #10                       │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Le PV de la séance #10 a été lu et adopté à    │    │    │      │
│  │  │ │ l'unanimité sans modification.                  │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Vote: ● À l'unanimité ○ Majorité ○ Rejeté      │    │    │      │
│  │  │ │ Modifications: ○ Oui ● Non                      │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 4. RAPPORT DU TRÉSORIER                                │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ [Données automatiques du bilan financier]       │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Le Trésorier a présenté le bilan financier:    │    │    │      │
│  │  │ │ • Cotisations collectées: 1,950,000 XAF        │    │    │      │
│  │  │ │ • Solde caisses: 4,150,000 XAF                 │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Observations:                                   │    │    │      │
│  │  │ │ [Le rapport a été approuvé sans observation___] │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 5. RAPPORT DU CENSEUR                                  │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Le Censeur a présenté son rapport:             │    │    │      │
│  │  │ │ • Sanctions appliquées ce mois: 5              │    │    │      │
│  │  │ │ • Contestations traitées: 2                    │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Observations:                                   │    │    │      │
│  │  │ │ [RAS_________________________________________]  │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 6. RAPPORT DU COMMISSAIRE AUX COMPTES                  │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Le Commissaire aux Comptes a présenté son      │    │    │      │
│  │  │ │ rapport. Les comptes sont certifiés conformes. │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Observations:                                   │    │    │      │
│  │  │ │ [Recommandation de renforcer le suivi des_____] │    │    │      │
│  │  │ │ [remboursements de prêts._____________________] │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 7. COLLECTE DES COTISATIONS                            │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ [Automatique: données du Trésorier]             │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Cotisations collectées: 1,950,000 XAF          │    │    │      │
│  │  │ │ Membres ayant cotisé: 39/40 présents           │    │    │      │
│  │  │ │ Arriérés collectés: 100,000 XAF                │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 8. DISTRIBUTION DE LA CAGNOTTE                         │    │      │
│  │  │ ���─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ [Automatique: données de la distribution]       │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Bénéficiaire: Claire ESSOMBA (Tour #11)        │    │    │      │
│  │  │ │ Montant brut: 1,950,000 XAF                    │    │    │      │
│  │  │ │ Prélèvements: 97,500 XAF (5%)                  │    │    │      │
│  │  │ │ Montant net distribué: 1,852,500 XAF           │    │    │      │
│  │  │ │ Mode: Virement MTN Mobile Money                │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Signé par: Trésorier ✅, Président ✅,         │    │    │      │
│  │  │ │            Bénéficiaire ✅                      │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 9. PRÉSENTATION CANDIDATS ADHÉSION                     │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Deux candidatures ont été présentées:          │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ a) Paul ESSONO                                 │    │    │      │
│  │  │ │    Parrainé par: Jean KAMGA                    │    │    │      │
│  │  │ │    Profession: Ingénieur                       │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ b) Jeanne FOUDA                                │    │    │      │
│  │  │ │    Parrainée par: Marie NGUEMO                 │    │    │      │
│  │  │ │    Profession: Commerçante                     │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 10. VOTE ADHÉSION PAUL ESSONO                          │    │      │
│  │  │ ┌────────────────────────────────────────��────────┐    │    │      │
│  │  │ │ [Automatique: résultat du vote]                 │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Pour: 38 | Contre: 1 | Abstentions: 1          │    │    │      │
│  │  │ │ Résultat: ✅ ADMIS                             │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Paul ESSONO est admis comme nouveau membre     │    │    │      │
│  │  │ │ à compter du cycle #3.                         │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 11. VOTE ADHÉSION JEANNE FOUDA                         │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Pour: 35 | Contre: 3 | Abstentions: 2          │    │    │      │
│  │  │ │ Résultat: ✅ ADMISE                            │    │    │      │
│  │  │ └──────────────────────────────────────��──────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 12. INFORMATION COTISATION EXTRAORDINAIRE              │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Le Président a informé l'assemblée de l'état   │    │    │      │
│  │  │ │ de la cotisation extraordinaire pour M. BIYA:  │    │    │      │
│  │  │ │ • Collecté: 220,000 / 235,000 XAF (94%)        │    │    │      │
│  │  │ │ • Distribution prévue: 20/04/2026              │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 13. QUESTIONS DIVERSES                                 │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ 1. M. KAMGA a demandé si la fête de fin de    │    │    │      │
│  │  │ │    cycle était confirmée. Le Président a      │    │    │      │
│  │  │ │    confirmé: Restaurant Le Diplomate, 30/04.  │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ 2. Mme ESSOMBA a remercié les membres pour    │    │    │      │
│  │  │ │    la cagnotte reçue.                          │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ [+ Ajouter un point]                           │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ 14. CLÔTURE DE LA SÉANCE                               │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ L'ordre du jour étant épuisé, le Président a  │    │    │      │
│  │  │ │ clôturé la séance à 17h30.                     │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Prochaine séance: #12 - 26 Avril 2026          │    │    │      │
│  │  │ │ Bénéficiaire: François MBALLA                  │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PIÈCES JOINTES                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Feuille de présence (auto)                           │    │      │
│  │  │ ☑ Bilan financier du Trésorier (auto)                  │    │      │
│  │  │ ☑ Rapport du Censeur                                   │    │      │
│  │  │ ☑ Rapport du Commissaire aux Comptes                   │    │      │
│  │  │ ☑ Reçu de distribution cagnotte (auto)                 │    │      │
│  │  │ ☑ Résultats des votes adhésion                         │    │      │
│  │  │ ☐ [+ Ajouter une pièce]                                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Enregistrer brouillon]  [Prévisualiser]                       │      │
│  │  [Soumettre pour signature]                                      │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Prévisualiser]                    │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PRÉVISUALISATION DU PV                        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │         PROCÈS-VERBAL DE LA SÉANCE #11                  │    │      │
│  │  │         Tontine [Nom de la Tontine]                     │    │      │
│  │  │                                                         │    │      │
│  │  │ L'an deux mille vingt-six, le douze avril, à quinze    │    │      │
│  │  │ heures cinq minutes, les membres de la tontine [Nom]   │    │      │
│  │  │ se sont réunis en séance ordinaire #11 à la Salle des  │    │      │
│  │  │ fêtes FOUDA, Yaoundé, sur convocation du Président.    │    │      │
│  │  │                                                         │    │      │
│  │  │ Étaient présents: 40 membres sur 47 (voir liste        │    │      │
│  │  │ de présence en annexe).                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Le quorum étant atteint, le Président Jean FOTSO       │    │      │
│  │  │ a ouvert la séance.                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ [...]                                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ L'ordre du jour étant épuisé, la séance a été         │    │      │
│  │  │ levée à 17h30.                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Fait à Yaoundé, le 12 Avril 2026                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Le Secrétaire              Le Président                │    │      │
│  │  │ Marie NGUEMO               Jean FOTSO                  │    │      │
│  │  │ [Signature]                [Signature]                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Annexes:                                               │    │      │
│  │  │ 1. Feuille de présence                                 │    │      │
│  │  │ 2. Bilan financier                                     │    │      │
│  │  │ 3. Reçu de distribution                                │    │      │
│  │  │ ...                                                    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Page 1/4]  [◀️]  [▶️]                                         │      │
│  │                                                                  │      │
│  │  [Modifier]  [📥 Télécharger PDF]  [Soumettre pour signature]   │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7.2 Sous-Flow : Signature du PV

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: SIGNATURE DU PV                               │
├────────────────��────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    SIGNATURE DU SECRÉTAIRE                       │      │
│  │                                                                  │      │
│  │  PV Séance #11 - 12 Avril 2026                                  │      │
│  │                                                                  │      │
│  │  ⚠️ En signant ce PV, vous certifiez l'exactitude des          │      │
│  │     informations qu'il contient.                                │      │
│  │                                                                  │      │
│  │  Code OTP envoyé au +237 699 XXX XXX: [______]                  │      │
│  │                                                                  │      │
│  │  Signature:                                                     │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │                                                         │    │      │
│  │  │         [Zone de dessin tactile]                       │    │      │
│  │  │              Marie NGUEMO                               │    │      │
│  │  │              Secrétaire                                 │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Effacer]  [Signer]                                            │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    📤 PV ENVOYÉ AU PRÉSIDENT                     │      │
│  │                                                                  │      │
│  │  Votre signature a été apposée.                                 │      │
│  │                                                                  │      │
│  │  Le PV a été transmis au Président pour signature.              │      │
│  │                                                                  │      │
│  │  Statut: ⏳ En attente de signature du Président               │      │
│  │                                                                  │      │
│  │  Vous serez notifié dès validation.                             │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │                                             │
│                               ▼ Après signature Président                   │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │ 🔔 NOTIFICATION: "PV #11 signé par le Président"                 │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ PV VALIDÉ ET ARCHIVÉ                       │      │
│  │                                                                  │      │
│  │  Le PV de la séance #11 a été validé.                           │      │
│  │                                                                  │      │
│  │  • Signatures: Secrétaire ✅ + Président ✅                     │      │
│  │  • PV archivé dans l'espace Documents                           │      │
│  │  • Tous les membres peuvent le consulter                        │      │
│  │  • Sera présenté pour adoption à la séance #12                  │      │
│  │                                                                  │      │
│  │  [📥 Télécharger le PV signé]  [Voir dans les archives]         │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└──────────────────────────────────────────────────────────��──────────────────┘
```

## 7.3 Règles Métier - Procès-Verbal

| Règle | Description |
|-------|-------------|
| RM-PV01 | Le PV doit être rédigé dans les 3 jours suivant la séance |
| RM-PV02 | Les données financières et de présence sont pré-remplies |
| RM-PV03 | Double signature requise : Secrétaire + Président |
| RM-PV04 | Les pièces jointes sont automatiquement attachées |
| RM-PV05 | Le PV est archivé et accessible à tous les membres |
| RM-PV06 | Le PV est présenté pour adoption à la séance suivante |

---

# 8. FLOW 7 : TRAITEMENT DES DEMANDES D'ADHÉSION

## 8.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: TRAITEMENT DEMANDE D'ADHÉSION                      │
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
│  │  demande         │                                                       │
│  │  d'adhésion"     │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DEMANDES D'ADHÉSION                           │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DEMANDES EN COURS (2)                                   │    │      │
│  │  ├───────────���─────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 📥 Paul ESSONO                                         │    │      │
│  │  │    Reçue le: 03/04/2026                                │    │      │
│  │  │    Parrainé par: Jean KAMGA                            │    │      │
│  │  │    Statut: ⏳ Dossier à vérifier                       │    │      │
│  │  │    [Examiner le dossier]                               │    │      │
│  │  │                                                         │    │      │
│  │  │ 📥 Jeanne FOUDA                                        │    │      │
│  │  │    Reçue le: 05/04/2026                                │    │      │
│  │  │    Parrainée par: Marie NGUEMO                         │    │      │
│  │  │    Statut: ⏳ Dossier à vérifier                       │    │      │
│  │  │    [Examiner le dossier]                               │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼ Clic sur [Examiner le dossier]              │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DOSSIER D'ADHÉSION                            │      │
│  │                    Paul ESSONO                                   │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS PERSONNELLES                               │    │      │
│  │  │                                                         │    │      │
│  │  │ Nom complet: Paul ESSONO MBARGA                        │    │      │
│  │  │ Date de naissance: 15/08/1985 (40 ans)                 │    │      │
│  │  │ Profession: Ingénieur informatique                     │    │      │
│  │  │ Employeur: Société XYZ                                 │    │      │
│  │  │ Téléphone: +237 677 888 999                            │    │      │
│  │  │ Email: paul.essono@email.com                           │    │      │
│  │  │ Adresse: Bastos, Yaoundé                               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PARRAINAGE                                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Parrain: Jean KAMGA                                    │    │      │
│  │  │ Membre depuis: Janvier 2022                            │    │      │
│  │  │ Situation: ✅ À jour de cotisations                    │    │      │
│  │  │ Parrainages précédents: 2 (tous actifs)                │    │      │
│  │  │                                                         │    │      │
│  │  │ Motivation du parrain:                                 │    │      │
│  │  │ "Paul est un ami de longue date, sérieux et fiable.   │    │      │
│  │  │  Je me porte garant de son intégration."               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PIÈCES JUSTIFICATIVES                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ CNI ou Passeport              [👁️ Voir]  ✅ Valide   │    │      │
│  │  │ ☑ Photo d'identité              [👁️ Voir]  ✅ Conforme │    │      │
│  │  │ ☑ Justificatif de domicile      [👁️ Voir]  ✅ Valide   │    │      │
│  │  │ ☑ Attestation de travail        [👁️ Voir]  ✅ Valide   │    │      │
│  │  │ ☐ Bulletin de salaire (optionnel)                      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌──────────���──────────────────────────────────────────────┐    │      │
│  │  │ MOTIVATION DU CANDIDAT                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ "Je souhaite rejoindre cette tontine pour bénéficier   │    │      │
│  │  │  d'une épargne collective et me préparer à des projets │    │      │
│  │  │  futurs. Mon ami Jean m'a beaucoup parlé de            │    │      │
│  │  │  l'organisation et du sérieux du groupe."              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATION DU SECRÉTAIRE                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Checklist:                                             │    │      │
│  │  │ ☑ Identité vérifiée                                    │    │      │
│  │  │ ☑ Pièces justificatives complètes                      │    │      │
│  │  │ ☑ Parrain éligible                                     │    │      │
│  │  │ ☑ Aucun antécédent négatif connu                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Observations:                                          │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Dossier complet et conforme. Candidat sérieux  │    │    │      │
│  │  │ │ avec un bon parrain. Recommandé pour vote.     │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉCISION DU SECRÉTAIRE                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Valider le dossier (transmettre pour vote AG)     │    │      │
│  │  │ ○ ⏳ Demander des compléments                          │    │      │
│  │  │ ○ ❌ Rejeter le dossier                                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Valider ma décision]                               │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│           ┌───────────────────┼───────────────────┐                         │
│           ▼                   ▼                   ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │ ✅ VALIDÉ       │ │ ⏳ COMPLÉMENTS  │ │ ❌ REJETÉ       │               │
│  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘               │
│           │                   │                   │                         │
│           ▼                   ▼                   ▼                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐               │
│  │ • Dossier inscrit│ │ • Notification  │ │ • Notification  │               │
│  │   à l'ODJ        │ │   au candidat   │ │   au candidat   │               │
│  │ • Vote prévu     │ │ • Liste des     │ │ • Motif         │               │
│  │   prochaine      │ │   pièces        │ │   communiqué    │               │
│  │   séance         │ │   manquantes    │ │ • Parrain       │               │
│  │ • Candidat       │ │ • Délai accordé │ │   informé       │               │
│  │   convoqué       │ │                 │ │                 │               │
│  └─────────────────┘ └─────────────────┘ └────────────��────┘               │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 8.2 Règles Métier - Adhésion

| Règle | Description |
|-------|-------------|
| RM-AD01 | Le Secrétaire vérifie la complétude du dossier |
| RM-AD02 | Un parrain membre actif est requis |
| RM-AD03 | Le dossier validé est soumis au vote de l'AG |
| RM-AD04 | Le candidat peut être convoqué pour présentation |
| RM-AD05 | Après vote positif, le Président finalise l'adhésion |

---

# 9. FLOW 8 : TRAITEMENT DES DÉMISSIONS

## 9.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: TRAITEMENT DEMANDE DE DÉMISSION                    │
├───────────────────────────────���─────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ 🔔 Notification  │                                                       │
│  │ "Demande de      │                                                       │
│  │  démission       │                                                       │
│  │  reçue"          │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    DEMANDE DE DÉMISSION                          │      │
│  │                    Pierre NGUEMO                                 │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS DU MEMBRE                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Nom: Pierre NGUEMO                                     │    │      │
│  │  │ Membre depuis: Mars 2023 (3 ans)                       │    │      │
│  │  │ Tours effectués: 2                                     │    │      │
│  │  │ Tours restants: 0 (tous les tours ont été effectués)   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SITUATION FINANCIÈRE                                    │    │      │
│  │  │                                                         │    │      │
│  │  │ Cotisations: ⚠️ 150,000 XAF en retard (3 séances)      │    │      │
│  │  │ Prêts en cours: ❌ Aucun                               │    │      │
│  │  │ Sanctions impayées: ⚠️ 2,000 XAF                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Total dû à la tontine: 152,000 XAF                     │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DEMANDE DU MEMBRE                                       │    │      │
│  │  │                                                         │    │      │
│  │  │ Date de la demande: 05/04/2026                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Motif:                                                 │    │      │
│  │  │ "Pour des raisons personnelles et professionnelles,    │    │      │
│  │  │  je ne suis plus en mesure de continuer dans cette    │    │      │
│  │  │  tontine. Je demande à être libéré de mes             │    │      │
│  │  │  engagements."                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Effet souhaité: Immédiat                               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ VÉRIFICATION DU SECRÉTAIRE                              │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Identité du demandeur vérifiée                       │    │      │
│  │  │ ☑ Situation financière récupérée                       │    │      │
│  │  │ ☐ Pas de prêt en cours                                 │    │      │
│  │  │ ⚠️ Arriérés de cotisations à régulariser               │    │      │
│  │  │ ⚠️ Sanctions impayées                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Observations:                                          │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Le membre a des arriérés. La démission ne      │    │    │      │
│  │  │ │ peut être acceptée qu'après régularisation     │    │    │      │
│  │  �� │ ou accord du Bureau.                           │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ DÉCISION DU SECRÉTAIRE                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ ✅ Transmettre au Président (dossier complet)        │    │      │
│  │  │ ○ ⏳ Demander régularisation préalable                 │    │      │
│  │  │ ○ 📋 Inscrire à l'ordre du jour (décision Bureau)      │    │      │
│  │  │                                                         │    │      │
│  │  │ Conditions proposées:                                  │    │      │
│  │  │ ☑ Régularisation des arriérés (152,000 XAF)            │    │      │
│  │  │ ☐ Paiement échelonné                                   │    │      │
│  │  │ ☐ Abandon de créances par le Bureau                    │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Valider ma décision]                               │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    📤 DEMANDE TRANSMISE                          │      │
│  │                                                                  │      │
│  │  La demande de démission de Pierre NGUEMO a été transmise       │      │
│  │  au Président avec vos observations.                            │      │
│  │                                                                  │      │
│  │  Conditions: Régularisation préalable de 152,000 XAF            │      │
│  │                                                                  │      │
│  │  Le Président sera notifié pour décision.                       │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 9.2 Règles Métier - Démission

| Règle | Description |
|-------|-------------|
| RM-DM01 | Le Secrétaire vérifie la situation financière du membre |
| RM-DM02 | Les arriérés doivent être régularisés avant démission |
| RM-DM03 | Un prêt en cours empêche la démission immédiate |
| RM-DM04 | Le Président valide la démission |
| RM-DM05 | La démission est annoncée à l'AG si inscrite à l'ODJ |

---

# 10. FLOW 9 : GESTION DU REGISTRE DES MEMBRES

## 10.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GESTION DU REGISTRE DES MEMBRES                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Secrétaire clique│                                                       │
│  │ "Gérer membres"  │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    REGISTRE DES MEMBRES                          │      │
│  │                                                                  │      │
│  │  Filtres: [Tous ▼] [Actifs ▼] [Rechercher: _________] 🔍        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ STATISTIQUES                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ 👥 Total membres actifs: 47                            │    │      │
│  │  │ 📥 Adhésions en cours: 2                               │    │      │
│  │  │ 📤 Démissions en cours: 1                              │    │      │
│  │  │ ⚠️ Suspendus: 0                                        │    │      │
│  │  │ 🚫 Radiés: 3 (historique)                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ LISTE DES MEMBRES                                       │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │ #  │ Nom           │ Rôle      │ Depuis  │ Statut      │    │      │
│  │  │────┼───────────────┼───────────┼─────────┼─────────────│    │      │
│  │  │ 1  │ FOTSO Jean    │ Président │ 01/2020 │ ✅ Actif    │    │      │
│  │  │ 2  │ MBALLA Pierre │ Vice-Prés │ 01/2020 │ ✅ Actif    │    │      │
│  │  │ 3  │ NGUEMO Marie  │ Secrétaire│ 01/2020 │ ✅ Actif    │    │      │
│  │  │ 4  │ TCHANA Robert │ Trésorier │ 01/2021 │ ✅ Actif    │    │      │
│  │  │ 5  │ NKOULOU Paul  │ Censeur   │ 01/2021 │ ✅ Actif    │    │      │
│  │  │ 6  │ FOUDA Jacques │ Commiss.  │ 01/2022 │ ✅ Actif    │    │      │
│  │  │ 7  │ KAMGA Jean    │ Membre    │ 01/2022 │ ✅ Actif    │    │      │
│  │  │ 8  │ ESSOMBA Claire│ Membre    │ 03/2022 │ ✅ Actif    │    │      │
│  │  │ ...│ ...           │ ...       │ ...     │ ...         │    │      │
│  │  │ 47 │ NGUEMO Pierre │ Membre    │ 03/2023 │ ⏳ Démiss.  │    │      │
│  │  │                                                         │    │      │
│  │  │ [◀️ Préc]  Page 1/5  [Suiv ▶️]                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Actions: [📥 Exporter]  [🖨️ Imprimer]  [+ Ajouter membre]     │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│                               │ Clic sur un membre                          │
│                               ▼                                             │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    FICHE MEMBRE                                  │      │
│  │                    Jean KAMGA                                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS PERSONNELLES                               │    │      │
│  │  │                                                         │    │      │
│  │  │ 👤 [Photo]                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Nom complet: Jean KAMGA FOTSO                          │    │      │
│  │  │ Date de naissance: 22/05/1980                          │    │      │
│  │  │ Profession: Entrepreneur                               │    │      │
│  │  │ Téléphone: +237 677 111 222                            │    │      │
│  │  │ Email: jean.kamga@email.com                            │    │      │
│  │  │ Adresse: Omnisport, Yaoundé                            │    │      │
│  │  │                                                         │    │      │
│  │  │ [✏️ Modifier]                                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ HISTORIQUE DANS LA TONTINE                              │    │      │
│  │  │                                                         │    │      │
│  │  │ Membre depuis: Janvier 2022 (4 ans)                    │    │      │
│  │  │ Parrain: Pierre MBALLA (Vice-Président)                │    │      │
│  │  │ Cycles participés: 3                                   │    │      │
│  │  │ Tours effectués: 3                                     │    │      │
│  │  │ Taux de présence: 94%                                  │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ SITUATION ACTUELLE                                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Cotisations: ✅ À jour                                 │    │      │
│  │  │ Prêts en cours: 1 (140,000 XAF - 2 échéances rest.)    │    │      │
│  │  │ Sanctions: 0 impayées                                  │    │      │
│  │  │ Tour prochain: #3 du cycle #3                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PARRAINAGES                                             │    │      │
│  │  │                                                         │    │      │
│  │  │ Membres parrainés: 2                                   │    │      │
│  │  │ • Paul ESSONO (en cours d'adhésion)                    │    │      │
│  │  │ • Anne FOUDA (membre depuis 2023)                      │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Fermer]  [📥 Exporter fiche]  [🖨️ Imprimer]                   │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```
# 🟠 FLOWS COMPLETS DU SECRÉTAIRE (FIN)
## Application de Gestion de Tontine - Cameroun

---

# 10. FLOW 9 : GESTION DU REGISTRE DES MEMBRES (Suite)

## 10.2 Sous-Flow : Modification des Informations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: MODIFICATION INFORMATIONS MEMBRE              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    MODIFICATION MEMBRE                           │      │
│  │                    Jean KAMGA                                    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS MODIFIABLES                                │    │      │
│  │  │                                                         │    │      │
│  │  │ Téléphone: [+237 677 111 222_______________]           │    │      │
│  │  │ Email: [jean.kamga@email.com________________]          │    │      │
│  │  │ Adresse: [Omnisport, Yaoundé________________]          │    │      │
│  │  │ Profession: [Entrepreneur___________________]          │    │      │
│  │  │                                                         │    │      │
│  │  │ Photo: [📷 Changer la photo]                           │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS NON MODIFIABLES                            │    │      │
│  │  │ (Nécessitent validation Président)                      │    │      │
│  │  │                                                         │    │      │
│  │  │ Nom complet: Jean KAMGA FOTSO                          │    │      │
│  │  │ Date de naissance: 22/05/1980                          │    │      │
│  │  │ Date d'adhésion: 01/2022                               │    │      │
│  │  │ Rôle: Membre                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ [Demander une modification au Président]               │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Motif de modification:                                         │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ [Mise à jour du numéro de téléphone à la demande______] │    │      │
│  │  │ [du membre.___________________________________________ ] │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Enregistrer les modifications]                     │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ MODIFICATIONS ENREGISTRÉES                 │      │
│  │                                                                  │      │
│  │  Les informations de Jean KAMGA ont été mises à jour.           │      │
│  │                                                                  │      │
│  │  • Téléphone: +237 677 111 222                                  │      │
│  │  • Modification tracée dans l'historique                        │      │
│  │  • Membre notifié                                               │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 10.3 Règles Métier - Registre des Membres

| Règle | Description |
|-------|-------------|
| RM-RM01 | Le Secrétaire gère le registre des membres |
| RM-RM02 | Certaines informations sont modifiables directement |
| RM-RM03 | Les informations critiques nécessitent validation Président |
| RM-RM04 | Toutes les modifications sont tracées |
| RM-RM05 | Le registre peut être exporté et imprimé |

---

# 11. FLOW 10 : GESTION DES ARCHIVES

## 11.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GESTION DES ARCHIVES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Secrétaire clique│                                                       │
│  │ "Archives"       │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ARCHIVES DE LA TONTINE                        │      │
│  │                                                                  │      │
│  │  Recherche: [_______________________________] 🔍                │      │
│  │                                                                  │      │
│  │  Filtres: [Type: Tous ▼] [Année: 2026 ▼] [Cycle: Tous ▼]        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ STATISTIQUES                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ 📂 Total documents archivés: 156                       │    │      │
│  │  │ 📝 Procès-verbaux: 24                                  │    │      │
│  │  │ 📋 Ordres du jour: 24                                  │    │      │
│  │  │ 📊 Bilans financiers: 24                               │    │      │
│  │  │ 📄 Autres documents: 84                                │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌────────────────────────────────────────────────────���────┐    │      │
│  │  │ CATÉGORIES                                              │    │      │
│  │  ├─────────────────────────────────────────────────────────┤    │      │
│  │  │                                                         │    │      │
│  │  │ 📁 PROCÈS-VERBAUX                                      │    │      │
│  │  │    └─ 📁 Cycle #2 (2026)                               │    │      │
│  │  │       ├─ 📄 PV Séance #11 - 12/04/2026       [👁️] [📥] │    │      │
│  │  │       ├─ 📄 PV Séance #10 - 29/03/2026       [👁️] [📥] │    │      │
│  │  │       ├─ 📄 PV Séance #9 - 15/03/2026        [👁️] [📥] │    │      │
│  │  │       └─ ...                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ 📁 ORDRES DU JOUR                                      │    │      │
│  │  │    └─ 📁 Cycle #2 (2026)                               │    │      │
│  │  │       ├─ 📄 ODJ Séance #12 - 26/04/2026      [👁️] [📥] │    │      │
│  │  │       ├─ 📄 ODJ Séance #11 - 12/04/2026      [👁️] [📥] │    │      │
│  │  │       └─ ...                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ 📁 BILANS FINANCIERS                                   │    │      │
│  │  │    └─ 📁 Cycle #2 (2026)                               │    │      │
│  │  │       ├─ 📄 Bilan Séance #11                 [👁️] [📥] │    │      │
│  │  │       └─ ...                                           │    │      │
│  │  │                                                         │    │      │
│  │  │ 📁 RAPPORTS D'AUDIT                                    │    │      │
│  │  │    ├─ 📄 Audit Cycle #2 - Q1 2026            [👁️] [📥] │    │      │
│  │  │    └─ 📄 Audit Cycle #1 - 2025               [👁️] [📥] │    │      │
│  │  │                                                         │    │      │
│  │  │ 📁 DOSSIERS ADHÉSION/DÉMISSION                         │    │      │
│  │  │    ├─ 📄 Adhésion Paul ESSONO - 04/2026      [👁️] [📥] │    │      │
│  │  │    ├─ 📄 Démission Pierre NGUEMO - 04/2026   [👁️] [📥] │    │      │
│  │  │    └─ ...                                              │    │      │
│  │  │                                                         │    │      │
│  │  │ 📁 FEUILLES DE PRÉSENCE                                │    │      │
│  │  │                                                         │    │      │
│  │  │ 📁 RÈGLEMENT INTÉRIEUR                                 │    │      │
│  │  │    └─ 📄 Version 2.0 - 01/01/2025            [👁️] [📥] │    │      │
│  │  │                                                         │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  Actions: [📤 Ajouter un document]  [📥 Export complet]         │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 11.2 Sous-Flow : Ajout d'un Document

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOUS-FLOW: AJOUT D'UN DOCUMENT                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    AJOUTER UN DOCUMENT                           │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPE DE DOCUMENT                                        │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Procès-verbal                                        │    │      │
│  │  │ ○ Ordre du jour                                        │    │      │
│  │  │ ○ Bilan financier                                      │    │      │
│  │  │ ○ Rapport d'audit                                      │    │      │
│  │  │ ○ Dossier adhésion/démission                           │    │      │
│  │  │ ● Autre document                                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ INFORMATIONS                                            │    │      │
│  │  │                                                         │    │      │
│  │  │ Titre: [Convention de location salle___________________]│    │      │
│  │  │                                                         │    │      │
│  │  │ Description:                                           │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Convention annuelle avec la salle des fêtes    │    │    │      │
│  │  │ │ FOUDA pour la tenue des séances.               │    │    │      │
│  │  │ └─────────────────────────────────────────────────┘    │    │      │
│  │  │                                                         │    │      │
│  │  │ Cycle concerné: [Cycle #2 - 2026 ▼]                    │    │      │
│  │  │ Date du document: [01/01/2026]                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Fichier:                                               │    │      │
│  │  │ [📎 convention_salle_2026.pdf] ✅                      │    │      │
│  │  │ [Choisir un fichier]                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ Visibilité:                                            │    │      │
│  │  │ ● Tous les membres                                     │    │      │
│  │  │ ○ Bureau uniquement                                    │    │      │
│  │  │ ○ Secrétaire et Président uniquement                   │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Archiver le document]                              │      │
│  │                                                                  │      │
│  └────────────────��───────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    ✅ DOCUMENT ARCHIVÉ                           │      │
│  │                                                                  │      │
│  │  Le document a été ajouté aux archives.                         │      │
│  │                                                                  │      │
│  │  • Titre: Convention de location salle                          │      │
│  │  • Catégorie: Autres documents                                  │      │
│  │  • Accessible à: Tous les membres                               │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 11.3 Règles Métier - Archives

| Règle | Description |
|-------|-------------|
| RM-AR01 | Tous les documents officiels sont automatiquement archivés |
| RM-AR02 | Le Secrétaire peut ajouter des documents manuellement |
| RM-AR03 | Les archives sont organisées par type et par cycle |
| RM-AR04 | Certains documents peuvent avoir une visibilité restreinte |
| RM-AR05 | Les archives peuvent être exportées en masse |

---

# 12. FLOW 11 : ENVOI D'ANNONCES

## 12.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: ENVOI D'ANNONCES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
���  ┌──────────────────┐                                                       │
│  │ Secrétaire clique│                                                       │
│  │ "Envoyer         │                                                       ���
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
│  │  │ ● 📅 Rappel de séance                                  │    │      │
│  │  │ ○ 📋 Document publié                                   │    │      │
│  │  │ ○ ⚠️ Alerte                                            │    │      │
│  │  │ ○ 🎉 Félicitations / Célébration                       │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CONTENU                                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ Titre:                                                 │    │      │
│  │  │ [Rappel: Séance #12 ce samedi 26 avril________________]│    │      │
│  │  │                                                         │    │      │
│  │  │ Message:                                               │    │      │
│  │  │ ┌─────────────────────────────────────────────────┐    │    │      │
│  │  │ │ Chers membres,                                  │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ Je vous rappelle que notre prochaine séance    │    │    │      │
│  │  │ │ (#12) se tiendra ce samedi 26 avril 2026 à     │    │    │      │
│  │  │ │ 15h00 à la Salle des fêtes FOUDA.              │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ 👤 Bénéficiaire: François MBALLA               │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ N'oubliez pas de préparer vos cotisations.     │    │    │      │
│  │  │ │                                                 │    │    │      │
│  │  │ │ À samedi !                                     │    │    │      │
│  │  │ │ Le Secrétariat                                 │    │    │      │
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
│  │  │ ○ Sélection personnalisée                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ CANAUX D'ENVOI                                          │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Notification push                                    │    │      │
│  │  │ ☑ SMS                                                  │    │      │
│  │  │ ☐ Email                                                │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Publier dans l'espace Annonces                       │    │      │
│  │  └─────────────────────────────────────────────────────���───┘    │      │
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
│  │  • 47 notifications push ✅                                     │      │
│  │  • 47 SMS ✅                                                    │      │
│  │  • Publiée dans l'espace Annonces ✅                            │      │
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

## 12.2 Règles Métier - Annonces

| Règle | Description |
|-------|-------------|
| RM-AN01 | Le Secrétaire peut envoyer des annonces aux membres |
| RM-AN02 | Plusieurs canaux de diffusion sont disponibles |
| RM-AN03 | Les annonces peuvent être ciblées ou générales |
| RM-AN04 | Les annonces peuvent être programmées |
| RM-AN05 | Les annonces sont archivées dans l'espace Annonces |

---

# 13. FLOW 12 : GÉNÉRATION DE RAPPORTS

## 13.1 Diagramme de Flux

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLOW: GÉNÉRATION DE RAPPORTS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                                               │
│  │ DÉBUT    │                                                               │
│  └────┬─────┘                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌──────────────────┐                                                       │
│  │ Secrétaire clique│                                                       │
│  │ "Générer         │                                                       │
│  │  rapport"        │                                                       │
│  └────────┬─────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    GÉNÉRATION DE RAPPORTS                        │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ TYPE DE RAPPORT                                         │    │      │
│  │  │                                                         │    │      │
│  │  │ ● 📊 Rapport de présences                              │    │      │
│  │  │ ○ 👥 Liste des membres                                 │    │      │
│  │  │ ○ 📅 Historique des séances                            │    │      │
│  │  │ ○ 📋 Registre des adhésions/démissions                 │    │      │
│  │  │ ○ 📝 Récapitulatif des PV                              │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ PÉRIODE                                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ ○ Cycle en cours                                       │    │      │
│  │  │ ● Cycle spécifique: [Cycle #2 - 2026 ▼]                │    │      │
│  │  │ ○ Année: [2026 ▼]                                      │    │      │
│  │  │ ○ Personnalisé: Du [__/__/____] au [__/__/____]        │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ OPTIONS                                                 │    │      │
│  │  │                                                         │    │      │
│  │  │ ☑ Inclure les graphiques                               │    │      │
│  │  │ ☑ Inclure les statistiques détaillées                  │    │      │
│  │  │ ☐ Inclure la liste nominative                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │ FORMAT                                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ● PDF                                                  │    │      │
│  │  │ ○ Excel                                                │    │      │
│  │  │ ○ Les deux                                             │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Annuler]  [Prévisualiser]  [Générer le rapport]               │      │
│  │                                                                  │      │
│  └────────────────────────────┬─────────────────────────────────────┘      │
│                               │                                             │
│                               ▼                                             │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                    PRÉVISUALISATION DU RAPPORT                   │      │
│  │                                                                  │      │
│  │  ┌─────────────────────────────────────────────────────────┐    │      │
│  │  │     RAPPORT DE PRÉSENCES - CYCLE #2 (2026)              │    │      │
│  │  │     Tontine [Nom de la Tontine]                         │    │      │
│  │  │                                                         │    │      │
│  │  │ Période: Janvier - Avril 2026                          │    │      │
│  │  │ Séances analysées: 11                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ STATISTIQUES GLOBALES                                  │    │      │
│  │  │                                                         │    │      │
│  │  │ Taux de présence moyen: 85%                            │    │      │
│  │  │ Membres toujours présents: 28 (60%)                    │    │      │
│  │  │ Membres avec absences: 19 (40%)                        │    │      │
│  │  │                                                         │    │      │
│  │  │ [Graphique évolution présences]                        │    │      │
│  │  │ ██████████████████████████░░░░ 85%                     │    │      │
│  │  │                                                         │    │      │
│  │  │ TOP 5 MEILLEURS PRÉSENTS                               │    │      │
│  │  │ 1. Jean FOTSO (Président) - 100%                       │    │      │
│  │  │ 2. Marie NGUEMO (Secrétaire) - 100%                    │    │      │
│  │  │ 3. Robert TCHANA (Trésorier) - 100%                    │    │      │
│  │  │ 4. Claire ESSOMBA - 100%                               │    │      │
│  │  │ 5. Jean KAMGA - 100%                                   │    │      │
│  │  │                                                         │    │      │
│  │  │ MEMBRES AVEC ABSENCES RÉPÉTÉES                         │    │      │
│  │  │ 1. Pierre NGUEMO - 3 absences (27%)                    │    │      │
│  │  │ 2. Marthe ONANA - 2 absences (18%)                     │    │      │
│  │  │ 3. Jacques FOUDA - 2 absences (18%)                    │    │      │
│  │  │                                                         │    │      │
│  │  │ ─────────────────────────────────────────────────       │    │      │
│  │  │ Généré le: 15/04/2026                                  │    │      │
│  │  │ Par: Marie NGUEMO, Secrétaire                          │    │      │
│  │  └─────────────────────────────────────────────────────────┘    │      │
│  │                                                                  │      │
│  │  [Modifier]  [📥 Télécharger]  [📤 Envoyer au Bureau]           │      │
│  │                                                                  │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  ┌──────────┐                                                               │
│  │   FIN    │                                                               │
│  └──────────┘                                                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 13.2 Règles Métier - Rapports

| Règle | Description |
|-------|-------------|
| RM-RP01 | Le Secrétaire peut générer différents types de rapports |
| RM-RP02 | Les rapports peuvent couvrir différentes périodes |
| RM-RP03 | Les rapports sont exportables en PDF ou Excel |
| RM-RP04 | Les rapports peuvent être envoyés au Bureau |
| RM-RP05 | Les rapports générés sont archivés |

---

# 14. RÉCAPITULATIF DES ÉCRANS

## 14.1 Liste des Écrans du Secrétaire

| # | Écran | Description | Accès |
|---|-------|-------------|-------|
| E-SC01 | Tableau de bord | Vue d'ensemble des tâches | Menu principal |
| E-SC02 | Préparation ODJ | Créer/modifier ordre du jour | Actions rapides |
| E-SC03 | Convocations | Envoyer les convocations | Après validation ODJ |
| E-SC04 | Suivi confirmations | Voir les réponses des membres | Menu principal |
| E-SC05 | Pointage | Enregistrer les présences | Pendant séance |
| E-SC06 | Rédaction PV | Rédiger le procès-verbal | Après séance |
| E-SC07 | Demandes adhésion | Traiter les dossiers | Notifications |
| E-SC08 | Demandes démission | Traiter les démissions | Notifications |
| E-SC09 | Registre membres | Gérer la liste des membres | Menu principal |
| E-SC10 | Archives | Consulter/ajouter documents | Menu principal |
| E-SC11 | Annonces | Envoyer des communications | Actions rapides |
| E-SC12 | Rapports | Générer des rapports | Menu principal |

---

# 15. RÈGLES MÉTIER ET INTÉGRATIONS

## 15.1 Règles Métier - Récapitulatif

| Code | Règle |
|------|-------|
| RM-OJ | L'ODJ doit être validé par le Président avant diffusion |
| RM-CV | Les convocations sont envoyées au moins 5 jours avant |
| RM-PT | Le pointage est finalisé une fois par séance |
| RM-PV | Double signature requise pour le PV (Secrétaire + Président) |
| RM-AD | Les adhésions passent par vérification puis vote AG |
| RM-DM | Les démissions nécessitent régularisation préalable |
| RM-RM | Les modifications critiques nécessitent validation Président |
| RM-AR | Tous les documents officiels sont automatiquement archivés |

## 15.2 Intégrations avec Autres Rôles

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERACTIONS SECRÉTAIRE ↔ AUTRES RÔLES                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SECRÉTAIRE                              PRÉSIDENT                          │
│  ──────────                              ─────────                          │
│  Soumet ODJ ────────────────────────────► Valide ODJ                       │
│  Soumet PV ─────────────────────────────► Signe PV                         │
│  Transmet adhésion ─────────────────────► Valide adhésion                  │
│  Transmet démission ────────────────────► Valide démission                 │
│  Demande modification membre ───────────► Approuve                         │
│                                                                             │
│  SECRÉTAIRE                              TRÉSORIER                          │
│  ──────────                              ─────────                          │
│  Récupère bilan ◄───────────────────────  Fournit bilan                    │
│  Intègre au PV                                                             │
│                                                                             │
│  SECRÉTAIRE                              CENSEUR                            │
│  ──────────                              ───────                            │
│  Transmet absences ─────────────────────► Applique sanctions               │
│  Récupère rapport ◄────────────────────── Fournit rapport                  │
│                                                                             │
│  SECRÉTAIRE                              COMMISSAIRE                        │
│  ──────────                              ───────────                        │
│  Récupère rapport ◄────────────────────── Fournit rapport                  │
│  Intègre au PV                                                             │
│                                                                             │
│  SECRÉTAIRE                              MEMBRES                            │
│  ──────────                              ───────                            │
│  Envoie convocations ───────────────────► Reçoivent                        │
│  Reçoit confirmations ◄─────────────────  Confirment présence              │
│  Reçoit signalements ◄──────────────────  Signalent absence                │
│  Reçoit demandes adhésion ◄─────────────  Demandent adhésion               │
│  Reçoit demandes démission ◄────────────  Demandent démission              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 15.3 Échéances et Rappels

| Tâche | Échéance | Rappel |
|-------|----------|--------|
| Préparer ODJ | J-7 avant séance | J-8, J-7 |
| Envoyer convocations | J-5 avant séance | Après validation ODJ |
| Relancer confirmations | J-2 avant séance | Automatique |
| Finaliser pointage | Fin de séance | Pendant séance |
| Rédiger PV | J+3 après séance | J+1, J+2, J+3 |
| Traiter adhésions | Avant prochaine séance | À réception |
| Traiter démissions | Sous 5 jours | J+2, J+4 |

---

# 16. ANNEXES

## 16.1 Modèle d'Ordre du Jour

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ORDRE DU JOUR - SÉANCE #[N]                              │
│                    Tontine [Nom de la Tontine]                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Date: [JJ] [Mois] [AAAA] à [HH:MM]                                        │
│  Lieu: [Adresse complète]                                                  │
│  Type: Séance [ordinaire/extraordinaire]                                   │
│  Bénéficiaire: [Nom du bénéficiaire] (Tour #[N])                           │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                             │
│  1. Ouverture de la séance                                                 │
│  2. Appel des membres                                                      │
│  3. Lecture et adoption du PV de la séance #[N-1]                          │
│  4. Rapport du Trésorier                                                   │
│  5. Rapport du Censeur                                                     │
│  6. Rapport du Commissaire aux Comptes                                     │
│  7. Collecte des cotisations                                               │
│  8. Distribution de la cagnotte à [Nom]                                    │
│  [9. Points spécifiques...]                                                │
│  [N-1]. Questions diverses                                                 │
│  [N]. Clôture de la séance                                                 │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                             │
│  Préparé par: [Nom], Secrétaire                                            │
│  Date: [JJ/MM/AAAA]                                                        │
│  Validé par: [Nom], Président                                              │
│  Date: [JJ/MM/AAAA]                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 16.2 Modèle de Procès-Verbal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROCÈS-VERBAL DE LA SÉANCE #[N]                          │
│                    Tontine [Nom de la Tontine]                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  L'an [année en lettres], le [jour en lettres] [mois], à [heure],          │
│  les membres de la tontine [Nom] se sont réunis en séance                  │
│  [ordinaire/extraordinaire] #[N] à [lieu], sur convocation du              │
│  Président.                                                                │
│                                                                             │
│  PRÉSENTS: [Nombre] membres sur [Total] (voir feuille de présence          │
│  en annexe).                                                               │
│                                                                             │
│  ABSENTS EXCUSÉS: [Liste]                                                  │
│  ABSENTS NON EXCUSÉS: [Liste]                                              │
│                                                                             │
│  Le quorum étant [atteint/non atteint], le Président [Nom] a              │
│  [ouvert la séance / reporté la séance].                                   │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                             │
│  1. OUVERTURE DE LA SÉANCE                                                 │
│     [Description]                                                          │
│                                                                             │
│  2. APPEL DES MEMBRES                                                      │
│     [Résultat du pointage]                                                 │
│                                                                             │
│  [...]                                                                     │
│                                                                             │
│  L'ordre du jour étant épuisé, la séance a été levée à [heure].           │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────      │
│                                                                             │
│  Fait à [Ville], le [JJ Mois AAAA]                                         │
│                                                                             │
│  Le Secrétaire                    Le Président                             │
│  [Nom]                            [Nom]                                    │
│  [Signature]                      [Signature]                              │
│                                                                             │
│  ANNEXES:                                                                  │
│  1. Feuille de présence                                                    │
│  2. Bilan financier du Trésorier                                           │
│  3. [Autres annexes]                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

**FIN DES FLOWS DU SECRÉTAIRE**
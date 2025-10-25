# Fonctionnalité d'Export des Activités LED

## Description
Les étudiants peuvent maintenant exporter leurs activités LED dans trois formats différents : CSV, Excel et PDF.

## Modifications apportées

### Backend (`backend/routes/activities.js`)
- ✅ Ajout de la route `POST /api/activities/export`
- ✅ Support des formats CSV, Excel (XLSX) et PDF
- ✅ Installation du package `pdfkit` pour la génération de PDF
- ✅ Utilisation du package `xlsx` pour CSV et Excel
- ✅ Authentification requise pour accéder à la route
- ✅ Filtrage automatique des activités par utilisateur (étudiant)

### Frontend

#### `frontend/src/services/activityService.ts`
- ✅ Ajout de la fonction `exportActivities(format: "csv" | "excel" | "pdf")`
- ✅ Gestion du téléchargement automatique du fichier
- ✅ Gestion des erreurs

#### `frontend/src/services/api.ts`
- ✅ Modification de `baseURL` de `private` à `public` pour accès dans le service

#### `frontend/src/pages/ActivitySubmission.tsx`
- ✅ Mise à jour de la fonction `exportActivities` pour utiliser le service
- ✅ Ajout de messages de succès et d'erreur
- ✅ Indicateur de chargement pendant l'export

## Utilisation

1. L'étudiant accède à la page "Mes Réalisations LED"
2. En haut de la page, trois boutons sont disponibles :
   - **CSV** : Export au format CSV (compatible Excel, LibreOffice)
   - **Excel** : Export au format XLSX natif Excel
   - **PDF** : Export au format PDF avec mise en forme professionnelle

3. Cliquer sur un bouton déclenche :
   - L'affichage d'un indicateur de chargement
   - L'appel à l'API backend
   - Le téléchargement automatique du fichier
   - Un message de confirmation ou d'erreur

## Format des exports

### CSV / Excel
Colonnes incluses :
- Titre
- Type (entrepreneuriat, leadership, digital)
- Description
- Date de début
- Date de fin
- Statut
- Priorité
- Progression (%)
- Heures estimées
- Heures réelles
- Collaborateurs
- Objectifs
- Résultats
- Défis
- Apprentissages
- Score (si évalué)
- Feedback (si évalué)

### PDF
Le PDF inclut :
- Page de garde avec titre et date d'export
- Nombre total d'activités
- Pour chaque activité :
  - Titre numéroté avec couleur
  - Informations générales (type, statut, priorité, dates)
  - Barre de progression
  - Description complète
  - Objectifs listés avec puces
  - Résultats obtenus
  - Évaluation (score et feedback si disponible)
- Pagination automatique
- Numéros de page en pied de page

## Dépendances

### Backend
```json
{
  "pdfkit": "^0.15.0",
  "xlsx": "^0.18.5"
}
```

## Tests recommandés

1. ✅ Export CSV avec des activités contenant des caractères spéciaux
2. ✅ Export Excel avec plusieurs activités
3. ✅ Export PDF avec pagination (plus de 3-4 activités)
4. ✅ Test avec aucune activité
5. ✅ Test avec activités non évaluées
6. ✅ Test avec activités évaluées
7. ✅ Test des permissions (seul l'étudiant propriétaire peut exporter ses activités)

## Sécurité

- ✅ Authentification requise (`authenticate` middleware)
- ✅ Filtrage automatique par userId pour les étudiants
- ✅ Validation du format d'export
- ✅ Gestion des erreurs côté serveur et client

## Améliorations futures possibles

1. Ajout de filtres (par type, par date, par statut)
2. Export d'une sélection d'activités (pas toutes)
3. Templates PDF personnalisables
4. Export en JSON pour backup/import
5. Envoi par email du fichier exporté
6. Export avec graphiques et statistiques

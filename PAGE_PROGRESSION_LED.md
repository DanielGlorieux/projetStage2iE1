# Page Ma Progression - Documentation

## Vue d'ensemble

La page "Ma Progression" est une nouvelle vue interactive pour les étudiants qui affiche des graphiques et indicateurs pertinents sur leur parcours LED (Leadership, Entrepreneuriat, Digital).

## Fonctionnalités

### 📊 **Indicateurs Clés (KPI)**

1. **Score Moyen** 
   - Moyenne de toutes les évaluations reçues
   - Barre de progression visuelle
   - Couleur : Bleu

2. **Taux de Complétion**
   - Pourcentage d'activités complétées par rapport au total
   - Affiche le ratio (ex: 5 sur 10 activités)
   - Couleur : Vert

3. **Activités Évaluées**
   - Pourcentage d'activités ayant reçu une évaluation
   - Nombre d'activités notées
   - Couleur : Violet

4. **Temps Investi**
   - Somme des heures investies dans toutes les activités
   - Basé sur le champ `actualHours`
   - Couleur : Orange

### 📈 **Graphiques Interactifs**

#### 1. **Graphique Radar - Compétences LED**
- Type : Radar Chart (Spider Chart)
- Affiche les 3 compétences principales :
  - Entrepreneuriat
  - Leadership
  - Digital
- Score moyen pour chaque compétence (0-100)
- Couleur : Violet avec transparence

#### 2. **Graphique Circulaire - Répartition des Activités**
- Type : Pie Chart
- Montre la distribution des activités par type
- Couleurs :
  - Entrepreneuriat : Bleu (#3b82f6)
  - Leadership : Vert (#10b981)
  - Digital : Violet (#8b5cf6)
- Affiche les pourcentages

#### 3. **Graphique Linéaire - Progression Mensuelle**
- Type : Line Chart
- Affiche les 6 derniers mois
- Deux lignes :
  - Activités créées (Bleu)
  - Activités évaluées (Vert)
- Permet de voir l'évolution temporelle

#### 4. **Graphique en Barres - État des Activités**
- Type : Bar Chart
- Affiche le nombre d'activités par statut :
  - Planifiées (Gris)
  - En cours (Orange)
  - Terminées (Bleu)
  - Soumises (Violet)
  - Évaluées (Vert)

### 🎯 **Scores par Compétence**

Trois cartes individuelles affichant :
- Score moyen pour chaque compétence (0-100)
- Barre de progression
- Nombre d'activités dans cette catégorie

### 💬 **Message d'Encouragement Dynamique**

Affiche un message personnalisé basé sur le taux de complétion :
- **≥ 80%** : "Excellent travail ! 🎉"
- **≥ 50%** : "Bon progrès ! 💪"
- **< 50%** : "Continuez vos efforts ! 🚀"

Inclut également des conseils contextuels.

## Intégration

### Fichiers créés/modifiés

1. **`frontend/src/pages/Progress.tsx`** (CRÉÉ)
2. **`frontend/src/App.tsx`** (MODIFIÉ)

### Navigation

Accès : Menu latéral → "Ma progression" (icône TrendingUp)

## Graphiques Inclus

✅ Radar Chart - Compétences LED
✅ Pie Chart - Répartition par type
✅ Line Chart - Progression mensuelle  
✅ Bar Chart - État des activités
✅ 4 KPI Cards
✅ 3 Scores par compétence
✅ Messages d'encouragement

## API Utilisée

- Endpoint : `GET /api/activities`
- Service : `activityService.getActivities()`

# Thème 2iE - Documentation

## 📋 Vue d'ensemble

Le thème de l'application a été mis à jour pour correspondre à la charte graphique officielle du 2iE.

**Date d'application** : 25 janvier 2025  
**Sauvegarde** : `theme_backup_20251025_014549/`

## 🎨 Palette de couleurs 2iE

### Couleurs principales

| Nom | Hex | PANTONE | Usage |
|-----|-----|---------|-------|
| **Rouge 2iE** | `#DA291C` | 485 C | Couleur primaire, CTA, éléments importants |
| **Orange 2iE** | `#FF8200` | 151 C | Accents, dégradés, hover states |
| **Bleu 2iE** | `#00A3E0` | 299 C | Couleur secondaire, liens, infos |
| **Turquoise** | `#00B0B9` | 7466 C | Accents alternatifs |
| **Vert 2iE** | `#4C8C2B` | 363 C | Success, validation |
| **Jaune 2iE** | `#F1C400` | 7406 C | Warnings, alertes |
| **Gris foncé** | `#707372` | 424 C | Texte secondaire |
| **Gris clair** | `#B1B3B3` | Cool Gray 5C | Bordures, fonds |

### Classes Tailwind disponibles

```html
<!-- Rouge 2iE -->
<div className="bg-2ie-red text-white">
<div className="text-2ie-red">
<div className="border-2ie-red">

<!-- Orange 2iE -->
<div className="bg-2ie-orange">
<div className="text-2ie-orange-dark">

<!-- Bleu 2iE -->
<div className="bg-2ie-blue">
<div className="hover:bg-2ie-blue-light">

<!-- Vert 2iE -->
<div className="bg-2ie-green">

<!-- Jaune 2iE -->
<div className="bg-2ie-yellow">

<!-- Gris 2iE -->
<div className="text-2ie-gray">
<div className="bg-2ie-gray-light">
```

### Dégradés

```html
<!-- Dégradé rouge-orange (header principal) -->
<div className="bg-gradient-to-r from-2ie-red to-2ie-orange">

<!-- Dégradé bleu-turquoise -->
<div className="bg-gradient-to-r from-2ie-blue to-2ie-turquoise">
```

## 🔤 Typographie

**Police principale** : Open Sans  
**Poids disponibles** : 300, 400, 500, 600, 700, 800

```css
font-family: 'Open Sans', sans-serif;
```

La police est automatiquement appliquée via Tailwind :
```html
<p className="font-sans">Texte en Open Sans</p>
```

## 📁 Fichiers modifiés

### Configuration
1. **`frontend/tailwind.config.js`**
   - Ajout des couleurs 2iE
   - Configuration de la police Open Sans

2. **`frontend/src/index.css`**
   - Import de Open Sans (Google Fonts)
   - Mise à jour des variables CSS
   - Adaptation des couleurs primaires/secondaires

3. **`frontend/src/theme/colors2iE.ts`** (CRÉÉ)
   - Définition complète de la palette
   - Export pour utilisation programmatique

### Composants mis à jour
4. **`frontend/src/pages/Sidebar.tsx`**
   - Couleurs bleues → rouges 2iE
   - Dégradés adaptés

5. **`frontend/src/pages/ActivitySubmission.tsx`**
   - Header avec dégradé rouge-orange
   - Tabs avec couleurs 2iE (rouge, bleu, vert, orange)
   - Boutons adaptés

## 🔄 Retour à l'ancien thème

Si vous souhaitez revenir à l'ancien thème :

### Option 1 : Restauration rapide

```powershell
cd C:\Users\danie\Desktop\projetStage2iE

# Restaurer les fichiers sauvegardés
$backup = "theme_backup_20251025_014549"
Copy-Item "$backup\index.css" -Destination "frontend\src\index.css" -Force
Copy-Item "$backup\tailwind.config.js" -Destination "frontend\tailwind.config.js" -Force
Copy-Item "$backup\Sidebar.tsx" -Destination "frontend\src\pages\Sidebar.tsx" -Force
Copy-Item "$backup\ActivitySubmission.tsx" -Destination "frontend\src\pages\ActivitySubmission.tsx" -Force

Write-Host "✅ Thème restauré"
```

### Option 2 : Restauration sélective

Vous pouvez ne restaurer que certains fichiers si une partie du nouveau thème vous convient.

## 🎯 Utilisation dans de nouveaux composants

### Exemple : Bouton primaire 2iE
```tsx
<Button className="bg-2ie-red hover:bg-2ie-red-dark text-white">
  Action
</Button>
```

### Exemple : Card avec bordure 2iE
```tsx
<Card className="border-l-4 border-l-2ie-red">
  <CardHeader>
    <CardTitle className="text-2ie-red">Titre</CardTitle>
  </CardHeader>
</Card>
```

### Exemple : Badge 2iE
```tsx
<Badge className="bg-2ie-blue text-white">
  Info
</Badge>
```

### Exemple : Alert
```tsx
<Alert className="border-2ie-yellow bg-2ie-yellow/10">
  <AlertDescription className="text-2ie-gray">
    Message d'avertissement
  </AlertDescription>
</Alert>
```

## 📊 Graphiques (Recharts)

Les couleurs des graphiques ont été mises à jour dans les variables CSS :

```css
--chart-1: Rouge 2iE
--chart-2: Bleu 2iE
--chart-3: Vert 2iE
--chart-4: Jaune 2iE
--chart-5: Orange 2iE
```

Utilisation dans les graphiques :
```tsx
<Bar dataKey="value" fill="var(--chart-1)" />
<Line dataKey="value" stroke="var(--chart-2)" />
```

## 🎨 Bonnes pratiques

### Hiérarchie des couleurs

1. **Rouge 2iE** : Actions principales, CTA, éléments importants
2. **Bleu 2iE** : Informations, liens, navigation secondaire
3. **Vert 2iE** : Succès, validations, confirmations
4. **Jaune 2iE** : Avertissements, attention
5. **Orange 2iE** : Accents, états intermédiaires
6. **Gris 2iE** : Textes secondaires, bordures

### Accessibilité

- Toujours assurer un contraste suffisant (WCAG AA minimum)
- Rouge sur blanc : ✅ Bon contraste
- Jaune sur blanc : ⚠️ Utiliser du texte foncé
- Gris clair sur blanc : ⚠️ Réservé aux éléments non-critiques

### Cohérence

- Utiliser `bg-2ie-red` plutôt que des codes hex directs
- Préférer les classes Tailwind aux styles inline
- Utiliser les dégradés de manière cohérente

## 🔍 Vérification

Pour vérifier que le thème est bien appliqué :

1. Vérifiez la police : devrait être Open Sans
2. Les boutons principaux doivent être rouge 2iE
3. Le header du dialog d'activité : dégradé rouge-orange
4. Les tabs : rouge, bleu, vert, orange
5. Le sidebar : accents rouges

## 📝 Notes

- Les couleurs shadcn/ui (`primary`, `secondary`, etc.) ont été conservées pour la compatibilité
- Elles utilisent maintenant les teintes 2iE
- Les anciennes classes continuent de fonctionner

## 🚀 Prochaines étapes (optionnel)

Si vous souhaitez aller plus loin :

1. **Logo 2iE** : Remplacer le logo actuel
2. **Favicon** : Icône aux couleurs 2iE
3. **Page de connexion** : Design avec identité 2iE
4. **Emails** : Templates aux couleurs 2iE
5. **PDF exports** : En-têtes/pieds de page 2iE

## 📞 Support

En cas de problème avec le thème :
- Consultez la sauvegarde : `theme_backup_20251025_014549/`
- Référez-vous au fichier : `frontend/src/theme/colors2iE.ts`
- Charte complète : `2iE CHARTE GRAPHIQUE 110613.pdf`

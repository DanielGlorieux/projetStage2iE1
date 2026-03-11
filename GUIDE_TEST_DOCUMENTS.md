# 🚀 Guide de Test - Documents pour Superviseurs

## ✅ FONCTIONNALITÉ IMPLÉMENTÉE

Les superviseurs peuvent maintenant **consulter et télécharger** tous les documents soumis par les étudiants lors de l'évaluation des projets LED.

---

## 📋 CE QUI A ÉTÉ AJOUTÉ

### 1️⃣ Badge Indicateur dans la Liste
- Un badge bleu "X document(s) joint(s)" apparaît sur chaque activité ayant des documents
- Permet de voir rapidement quelles activités ont des pièces jointes

### 2️⃣ Section Documents dans le Dialog d'Évaluation
- Affichage de tous les documents avant d'évaluer
- Icônes colorées par type (PDF rouge, DOC bleu, etc.)
- Bouton de téléchargement pour chaque document
- Message si aucun document disponible

### 3️⃣ Section Documents dans le Dialog de Détails
- Grille responsive (2 colonnes sur desktop)
- Cards avec hover effects
- Téléchargement rapide en un clic

---

## 🧪 COMMENT TESTER

### Étape 1 : Lancer l'application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Étape 2 : Créer des activités de test avec documents
```bash
# Terminal 3
node test-activities-with-documents.js
```
Ce script crée automatiquement 2 activités avec des documents simulés.

### Étape 3 : Se connecter en tant que superviseur
1. Ouvrir http://localhost:3002 (ou le port affiché)
2. Se connecter avec :
   - **Email** : supervisor@2ie.bf
   - **Password** : [votre mot de passe superviseur]

### Étape 4 : Vérifier la fonctionnalité

#### ✅ Dans la liste des activités :
- Chercher les activités avec le badge bleu "X document(s) joint(s)"
- Le badge doit être visible directement sous la description

#### ✅ Dans le Dialog de Détails :
1. Cliquer sur le bouton "Détails" d'une activité
2. Scroller jusqu'à la section "Documents Justificatifs"
3. Vérifier :
   - Les icônes colorées (PDF rouge, DOC bleu, etc.)
   - Le nom des fichiers
   - Le compteur "(X documents)"
4. Cliquer sur le bouton Download (⬇️)
5. Vérifier que le téléchargement démarre

#### ✅ Dans le Dialog d'Évaluation :
1. Cliquer sur "Évaluer" pour une activité avec documents
2. La section "Documents Justificatifs" doit apparaître AVANT la notation
3. Vérifier :
   - Liste scrollable des documents
   - Boutons de téléchargement
   - Message : "💡 Consultez les documents avant d'évaluer l'activité"
4. Tester le téléchargement d'un document
5. Procéder à l'évaluation normalement

---

## 🎨 APERÇU VISUEL

### Badge dans la liste
```
┌─────────────────────────────────────────┐
│ 📝 Développement Application GED        │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ Description du projet...                │
│                                         │
│ 📄 5 documents joints  <-- BADGE ICI   │
│                                         │
│ [Détails] [Évaluer]                    │
└─────────────────────────────────────────┘
```

### Section Documents (Dialog)
```
┌─────────────────────────────────────────┐
│ 📄 Documents Justificatifs (5)          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ [📄] rapport-final.pdf    [⬇️] │   │
│ └─────────────────────────────────┘   │
│                                         │
│ ┌─────────────────────────────────┐   │
│ │ [📝] presentation.pptx     [⬇️] │   │
│ └─────────────────────────────────┘   │
│                                         │
│ 💡 Consultez les documents avant        │
│    d'évaluer l'activité                 │
└─────────────────────────────────────────┘
```

---

## 📁 FICHIERS MODIFIÉS

### frontend/src/pages/ActivityValidation.tsx
- ✅ Fonction `handleDownloadDocument()` ajoutée
- ✅ Badge indicateur dans liste (ligne ~520)
- ✅ Section documents dans Dialog d'évaluation (ligne ~653)
- ✅ Section documents dans Dialog de détails (ligne ~882)

### Aucune modification backend
Le service `activityService.downloadDocument()` existait déjà et est réutilisé.

---

## 🐛 DÉPANNAGE

### Le badge ne s'affiche pas
- Vérifier que l'activité a bien un tableau `documents` non vide
- Vérifier dans la console : `activity.documents`

### Le téléchargement ne fonctionne pas
- Vérifier que les URLs des documents sont valides
- Vérifier le token d'authentification
- Vérifier les permissions d'accès aux fichiers uploadés
- Regarder la console du navigateur pour les erreurs

### Les documents ne s'affichent pas
- Vérifier que `activity.documents` est un array
- Vérifier dans la console : `console.log(selectedActivity.documents)`

### Message "Aucun document justificatif"
- C'est normal si l'activité n'a pas de documents
- Utiliser le script `test-activities-with-documents.js` pour créer des données de test

---

## 📞 VÉRIFICATION FINALE

Checklist avant de valider :

- [ ] Le badge "X documents joints" s'affiche dans la liste
- [ ] La section Documents s'affiche dans le Dialog de Détails
- [ ] La section Documents s'affiche dans le Dialog d'Évaluation
- [ ] Les icônes sont colorées selon le type de fichier
- [ ] Le téléchargement fonctionne au clic sur le bouton
- [ ] Le message "Aucun document" s'affiche si pas de documents
- [ ] L'interface est responsive (mobile/tablet/desktop)
- [ ] Pas d'erreur dans la console du navigateur

---

## 🎉 RÉSULTAT ATTENDU

Les superviseurs peuvent maintenant :
1. ✅ Voir rapidement quelles activités ont des documents (badge)
2. ✅ Consulter la liste complète des documents
3. ✅ Télécharger les documents individuellement
4. ✅ Évaluer les projets avec tous les éléments nécessaires

Interface claire, intuitive et professionnelle ! 🚀

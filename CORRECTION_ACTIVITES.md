# Correction de l'erreur 400 lors de la création d'activités

## Problème identifié

L'erreur `POST http://localhost:5000/api/activities 400 (Bad Request)` était causée par un **désalignement entre la validation backend et le schéma Prisma**.

### Cause racine

1. **Frontend** : Envoie les données en minuscules (`"entrepreneuriat"`, `"leadership"`, `"digital"`, `"planned"`, `"in_progress"`, etc.)
2. **Schéma Prisma** : Définit les enums en minuscules (voir `backend/prisma/schema.prisma`)
3. **Validation Backend** : Attendait les valeurs en MAJUSCULES (`"ENTREPRENEURIAT"`, `"LEADERSHIP"`, etc.)

## Changements effectués

### 1. Middleware de validation (`backend/middleware/validation.js`)

**Avant :**
```javascript
body("type")
  .isIn(["ENTREPRENEURIAT", "LEADERSHIP", "DIGITAL"])
  .withMessage("Type d'activité invalide"),
body("status")
  .optional()
  .isIn(["PLANNED", "IN_PROGRESS", "COMPLETED", "SUBMITTED", "EVALUATED", "CANCELLED"])
  .withMessage("Statut invalide"),
```

**Après :**
```javascript
body("type")
  .customSanitizer((value) => value?.toLowerCase())
  .isIn(["entrepreneuriat", "leadership", "digital"])
  .withMessage("Type d'activité invalide"),
body("status")
  .optional()
  .customSanitizer((value) => value?.toLowerCase())
  .isIn(["planned", "in_progress", "completed", "submitted", "evaluated", "cancelled"])
  .withMessage("Statut invalide"),
```

### 2. Dates rendues optionnelles

Les champs `startDate` et `endDate` sont maintenant optionnels pour permettre la création d'activités sans dates spécifiques.

```javascript
body("startDate")
  .optional()
  .isISO8601()
  .withMessage("Date de début invalide"),
body("endDate")
  .optional()
  .isISO8601()
  .withMessage("Date de fin invalide")
```

### 3. Routes des activités (`backend/routes/activities.js`)

Tous les comparateurs de status ont été modifiés pour utiliser les minuscules :
- `"COMPLETED"` → `"completed"`
- `"IN_PROGRESS"` → `"in_progress"`
- `"SUBMITTED"` → `"submitted"`
- `"EVALUATED"` → `"evaluated"`
- `"PLANNED"` → `"planned"`

## Validation

Le backend accepte maintenant :
- ✅ Types : `"entrepreneuriat"`, `"leadership"`, `"digital"` (en minuscules)
- ✅ Status : `"planned"`, `"in_progress"`, `"completed"`, `"submitted"`, `"evaluated"`, `"cancelled"` (en minuscules)
- ✅ Priorités : `"low"`, `"medium"`, `"high"` (en minuscules)
- ✅ Dates optionnelles : `startDate` et `endDate` peuvent être omises

## Test

Pour tester la création d'une activité :

```javascript
POST http://localhost:5000/api/activities
Content-Type: application/json
Authorization: Bearer <votre-token>

{
  "title": "Ma nouvelle activité",
  "type": "entrepreneuriat",
  "description": "Description de l'activité avec au moins 100 caractères pour respecter la validation du backend...",
  "status": "planned",
  "priority": "medium",
  "objectives": ["Objectif 1 avec description", "Objectif 2 avec description"],
  "tags": ["innovation", "test"]
}
```

## Compatibilité

✅ Les changements sont **rétrocompatibles** avec la base de données existante
✅ Le frontend n'a pas besoin de modifications
✅ Le schéma Prisma reste inchangé

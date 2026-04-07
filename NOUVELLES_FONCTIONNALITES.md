# Nouvelles Fonctionnalités - Plateforme LED 2iE

Ce document décrit les nouvelles fonctionnalités implémentées dans la plateforme LED de suivi des activités en Leadership, Entreprenariat et Digital.

## 1. Rôles Super Admin par Type d'Activité

### Description
Création de trois nouveaux rôles de Super Admin, chacun spécialisé dans un domaine spécifique :
- **Super Admin Entrepreneuriat** : Gestion exclusive des activités entrepreneuriales
- **Super Admin Leadership** : Gestion exclusive des activités de leadership
- **Super Admin Digital** : Gestion exclusive des activités digitales

### Caractéristiques
- Chaque Super Admin a accès uniquement aux activités de son domaine de spécialisation
- Même niveau de privilèges qu'un administrateur LED Team pour leur domaine
- Authentification et autorisation automatiques basées sur la spécialisation

### Utilisation
**Inscription d'un Super Admin :**
```javascript
POST /api/auth/register
{
  "email": "admin.entrepreneuriat@2ie-edu.org",
  "password": "motdepasse123",
  "name": "Admin Entrepreneuriat",
  "role": "SUPER_ADMIN_ENTREPRENEURIAT",
  "specialization": "entrepreneuriat"
}
```

**Rôles disponibles :**
- `SUPER_ADMIN_ENTREPRENEURIAT`
- `SUPER_ADMIN_LEADERSHIP`
- `SUPER_ADMIN_DIGITAL`

## 2. Recherche Avancée

### Description
Système de recherche amélioré permettant de filtrer les étudiants et activités selon plusieurs critères.

### Critères de Recherche Disponibles

#### Recherche d'Étudiants
- **Par nom** : Recherche insensible à la casse
- **Par email** : Recherche partielle
- **Par filière** : Filtrage multiple
- **Par niveau** : Filtrage multiple
- **Par score** : Plage de scores (min/max)
- **Par type d'activité** : Entrepreneuriat, Leadership, Digital
- **Par statut d'activité** : planned, in_progress, completed, submitted, evaluated
- **Par mots-clés** : Recherche dans les activités des étudiants

### Utilisation
**Exemple de recherche :**
```javascript
POST /api/search/students
{
  "nom": "Dupont",
  "filiere": ["Informatique", "Génie Civil"],
  "scoreMin": 70,
  "scoreMax": 100,
  "typeActivite": ["entrepreneuriat"],
  "keywords": "innovation startup"
}
```

### Export des Résultats
Les résultats de recherche peuvent être exportés en :
- **PDF** : Rapport formaté avec statistiques
- **Excel** : Tableau détaillé avec formules
- **CSV** : Format compatible tableur

```javascript
POST /api/search/export
{
  "studentIds": ["uuid1", "uuid2"],
  "format": "pdf" // ou "excel" ou "csv"
}
```

## 3. Activités Créées par Superviseurs

### Description
Les superviseurs peuvent maintenant créer des activités et les assigner directement aux étudiants avec des délais.

### Fonctionnalités

#### Création d'Activité
```javascript
POST /api/supervisor-activities
{
  "title": "Projet Innovation",
  "type": "entrepreneuriat",
  "description": "Créer un business plan pour une startup",
  "deadline": "2026-05-30T23:59:59Z",
  "studentIds": ["uuid-etudiant-1", "uuid-etudiant-2"],
  "objectives": ["Analyser le marché", "Définir le modèle économique"],
  "estimatedHours": 20
}
```

#### Notation par le Créateur
Seul le superviseur qui a créé l'activité peut la noter :

```javascript
POST /api/supervisor-activities/:id/evaluate
{
  "score": 85,
  "feedback": "Excellent travail sur l'analyse de marché"
}
```

#### Envoi de Rappels
Le superviseur peut envoyer des rappels aux étudiants :

```javascript
POST /api/supervisor-activities/:id/remind
```

Cela envoie un email automatique avec :
- Le titre de l'activité
- La date limite
- Le nombre de jours restants
- Les détails de l'activité

#### Gestion des Activités Créées
```javascript
// Lister toutes les activités créées
GET /api/supervisor-activities

// Supprimer une activité
DELETE /api/supervisor-activities/:id
```

## 4. Système de Chat

### Description
Messagerie intégrée permettant la communication entre tous les utilisateurs de la plateforme.

### Fonctionnalités

#### Envoyer un Message
```javascript
POST /api/messages
{
  "receiverId": "uuid-destinataire",
  "content": "Bonjour, j'ai une question concernant..."
}
```

#### Lire les Messages
```javascript
// Tous les messages
GET /api/messages

// Messages d'une conversation spécifique
GET /api/messages/conversation/:userId

// Liste des conversations
GET /api/messages/conversations
```

#### Marquer comme Lu
```javascript
PUT /api/messages/:id/read
```

#### Compter les Messages Non Lus
```javascript
GET /api/messages/unread/count
```

#### Supprimer un Message
```javascript
DELETE /api/messages/:id
```

### Caractéristiques
- Messages temps réel
- Indicateur de lecture
- Compteur de messages non lus
- Historique de conversations
- Organisation par conversation

## 5. Modifications du Schéma de Base de Données

### Modèle User
Nouveaux champs :
- `specialization` : Type d'activité pour les Super Admins
- Relations pour les messages envoyés/reçus
- Relation pour les activités créées

### Modèle Activity
Nouveaux champs :
- `deadline` : Date limite pour les activités assignées
- `keywords` : Mots-clés pour la recherche
- `isSupervisorCreated` : Indicateur d'activité créée par superviseur
- `assignedStudents` : Liste des étudiants assignés
- `creatorId` : ID du superviseur créateur
- Relation avec le créateur

### Modèle Message (Nouveau)
- `id` : Identifiant unique
- `content` : Contenu du message
- `isRead` : Statut de lecture
- `senderId` : ID de l'expéditeur
- `receiverId` : ID du destinataire
- `createdAt` : Date de création
- `updatedAt` : Date de modification

## 6. Sécurité et Autorisations

### Middleware d'Autorisation Amélioré
- Les Super Admins héritent des droits `led_team` et `supervisor`
- Vérification automatique de la spécialisation pour les actions spécifiques
- Protection des routes sensibles

### Middleware Spécialisé
```javascript
authorizeSuperAdminForType(activityType)
```
Vérifie que l'utilisateur a les droits pour un type d'activité spécifique.

## 7. Migration et Installation

### Prérequis
- Node.js >= 14
- Prisma CLI
- Base de données SQLite (ou MySQL configuré)

### Installation
```bash
cd backend
npm install
```

### Migration de la Base de Données
```bash
# Générer le client Prisma
npm run prisma:generate

# Appliquer les migrations
npm run migrate

# Alternative : migration en production
npm run migrate:deploy
```

### Variables d'Environnement
Ajouter dans `.env` :
```env
# Email (pour les rappels)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe
SMTP_FROM="Plateforme LED <noreply@led-2ie.org>"

# JWT
JWT_SECRET=votre_secret_jwt_très_sécurisé
JWT_EXPIRES_IN=7d

# Base de données
DATABASE_URL="file:./dev.db"
```

## 8. Routes API Disponibles

### Authentification
- `POST /api/auth/register` - Inscription (inclut Super Admin)
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Recherche
- `POST /api/search/students` - Recherche étudiants
- `POST /api/search/export` - Export résultats
- `GET /api/search/filters` - Options de filtres
- `GET /api/search/stats` - Statistiques globales

### Activités Superviseur
- `POST /api/supervisor-activities` - Créer et assigner
- `GET /api/supervisor-activities` - Lister ses activités
- `POST /api/supervisor-activities/:id/evaluate` - Noter
- `POST /api/supervisor-activities/:id/remind` - Rappel
- `DELETE /api/supervisor-activities/:id` - Supprimer

### Messages
- `POST /api/messages` - Envoyer un message
- `GET /api/messages` - Lister les messages
- `GET /api/messages/conversations` - Lister conversations
- `GET /api/messages/conversation/:userId` - Conversation spécifique
- `PUT /api/messages/:id/read` - Marquer comme lu
- `GET /api/messages/unread/count` - Compteur non lus
- `DELETE /api/messages/:id` - Supprimer

## 9. Tests et Validation

### Tests Manuels Recommandés

1. **Super Admin**
   - Créer un Super Admin pour chaque spécialisation
   - Vérifier l'accès restreint aux activités du domaine
   - Tester les autorisations

2. **Recherche**
   - Tester chaque filtre individuellement
   - Combiner plusieurs filtres
   - Exporter en PDF, Excel et CSV
   - Vérifier les résultats avec des mots-clés

3. **Activités Superviseur**
   - Créer une activité avec plusieurs étudiants
   - Envoyer un rappel
   - Noter une activité soumise
   - Vérifier que seul le créateur peut noter

4. **Chat**
   - Envoyer des messages entre utilisateurs
   - Vérifier le compteur de non lus
   - Tester les conversations multiples
   - Marquer des messages comme lus

## 10. Développements Futurs Possibles

- Interface WebSocket pour chat en temps réel
- Notifications push pour les rappels
- Tableau de bord Super Admin personnalisé
- Export de statistiques par domaine
- Système de templates d'activités pour superviseurs
- Gamification avec badges et récompenses
- Analyse avancée avec graphiques de progression

## Support et Contact

Pour toute question ou problème :
- Email: support@led-2ie.org
- Documentation complète: /api/docs
- GitHub Issues: [Lien vers le repo]

---

**Version:** 2.0.0
**Date:** Avril 2026
**Auteur:** Claude Code Agent

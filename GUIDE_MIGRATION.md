# Guide de Migration - Nouvelles Fonctionnalités LED

## Vue d'ensemble

Ce guide décrit comment migrer la base de données existante pour supporter les nouvelles fonctionnalités :
- Rôles Super Admin
- Système de messages
- Activités créées par superviseurs
- Champs de recherche avancés

## Étapes de Migration

### 1. Sauvegarde

**IMPORTANT** : Toujours sauvegarder votre base de données avant une migration !

```bash
# Pour SQLite
cp backend/prisma/dev.db backend/prisma/dev.db.backup

# Pour MySQL
mysqldump -u root -p led_platform > led_platform_backup.sql
```

### 2. Installer les Dépendances

```bash
cd backend
npm install
```

Cela installera :
- `@prisma/client` : Client Prisma
- `prisma` : CLI Prisma
- `ws` : WebSocket pour chat temps réel (optionnel)

### 3. Générer le Client Prisma

```bash
npm run prisma:generate
```

Cette commande génère le client Prisma avec les nouveaux modèles.

### 4. Créer et Appliquer la Migration

```bash
# Créer une nouvelle migration
npx prisma migrate dev --name add_super_admin_and_messages

# Ou appliquer directement en production
npx prisma migrate deploy
```

### 5. Vérifier la Migration

```bash
# Ouvrir Prisma Studio pour vérifier
npm run prisma:studio
```

Vérifiez que les tables suivantes existent :
- `users` avec les nouveaux champs : `specialization`
- `activities` avec les nouveaux champs : `deadline`, `keywords`, `isSupervisorCreated`, `assignedStudents`, `creatorId`
- `messages` (nouvelle table)

## Modifications de la Base de Données

### Table `users`

**Nouveaux champs ajoutés :**
```sql
ALTER TABLE users ADD COLUMN specialization VARCHAR(50);
```

**Nouvelles valeurs d'enum Role :**
- `super_admin_entrepreneuriat`
- `super_admin_leadership`
- `super_admin_digital`

### Table `activities`

**Nouveaux champs ajoutés :**
```sql
ALTER TABLE activities ADD COLUMN deadline DATETIME;
ALTER TABLE activities ADD COLUMN keywords TEXT DEFAULT '[]';
ALTER TABLE activities ADD COLUMN isSupervisorCreated BOOLEAN DEFAULT FALSE;
ALTER TABLE activities ADD COLUMN assignedStudents TEXT DEFAULT '[]';
ALTER TABLE activities ADD COLUMN creatorId VARCHAR(36);
ALTER TABLE activities ADD FOREIGN KEY (creatorId) REFERENCES users(id);
```

### Table `messages` (Nouvelle)

```sql
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    content TEXT NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    senderId VARCHAR(36) NOT NULL,
    receiverId VARCHAR(36) NOT NULL,
    FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_senderId (senderId),
    INDEX idx_receiverId (receiverId),
    INDEX idx_createdAt (createdAt)
);
```

## Migration des Données Existantes

### Aucune Action Requise Pour :
- Utilisateurs existants (les champs sont optionnels)
- Activités existantes (les nouveaux champs ont des valeurs par défaut)

### Actions Optionnelles :

#### 1. Convertir un Administrateur en Super Admin

```javascript
// Exemple via Prisma Client
await prisma.user.update({
  where: { email: 'admin.led@2ie-edu.org' },
  data: {
    role: 'super_admin_entrepreneuriat',
    specialization: 'entrepreneuriat'
  }
});
```

#### 2. Ajouter des Mots-clés aux Activités Existantes

```javascript
// Script de migration optionnel
const activities = await prisma.activity.findMany();

for (const activity of activities) {
  // Extraire des mots-clés du titre et de la description
  const keywords = [
    ...activity.title.toLowerCase().split(' '),
    ...activity.description.toLowerCase().split(' ')
  ]
  .filter(word => word.length > 3)
  .slice(0, 10)
  .join(' ');

  await prisma.activity.update({
    where: { id: activity.id },
    data: { keywords }
  });
}
```

## Résolution des Problèmes

### Erreur: "Database migration required"
```bash
npx prisma migrate deploy
```

### Erreur: "P1012 - datasource url error"
Vérifiez votre `schema.prisma` :
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### Erreur: "Cannot find module '@prisma/client'"
```bash
npm install @prisma/client
npm run prisma:generate
```

### Erreur lors de la migration
1. Restaurez la sauvegarde
2. Vérifiez le schéma Prisma
3. Essayez de créer une nouvelle migration :
```bash
npx prisma migrate dev --create-only
# Vérifier le SQL généré dans prisma/migrations
npx prisma migrate dev
```

## Script de Migration Automatique

Créez un fichier `backend/scripts/migrate-to-v2.js` :

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Début de la migration vers v2.0...');

  try {
    // 1. Vérifier la connexion
    await prisma.$connect();
    console.log('✅ Connexion à la base de données établie');

    // 2. Compter les données existantes
    const userCount = await prisma.user.count();
    const activityCount = await prisma.activity.count();
    console.log(`📊 Données existantes : ${userCount} utilisateurs, ${activityCount} activités`);

    // 3. Mettre à jour les activités sans creatorId
    const updated = await prisma.activity.updateMany({
      where: { creatorId: null },
      data: { isSupervisorCreated: false }
    });
    console.log(`✅ ${updated.count} activités mises à jour`);

    console.log('🎉 Migration terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur de migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

Exécutez-le :
```bash
node backend/scripts/migrate-to-v2.js
```

## Vérification Post-Migration

### 1. Tester les Nouvelles Routes

```bash
# Tester la création d'un Super Admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@2ie-edu.org",
    "password": "test123",
    "name": "Super Admin Test",
    "role": "SUPER_ADMIN_ENTREPRENEURIAT",
    "specialization": "entrepreneuriat"
  }'

# Tester le chat
curl -X GET http://localhost:5000/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Vérifier les Données

```bash
# Ouvrir Prisma Studio
npm run prisma:studio
```

Vérifiez :
- Les nouveaux rôles dans la table `users`
- Les nouveaux champs dans `activities`
- La table `messages` existe

### 3. Tester l'Application

1. Démarrer le serveur : `npm run dev`
2. Créer un compte Super Admin
3. Tester la recherche avancée
4. Créer une activité en tant que superviseur
5. Envoyer un message

## Retour en Arrière (Rollback)

Si vous devez annuler la migration :

```bash
# 1. Arrêter le serveur
# 2. Restaurer la sauvegarde
cp backend/prisma/dev.db.backup backend/prisma/dev.db

# Pour MySQL
mysql -u root -p led_platform < led_platform_backup.sql

# 3. Revenir au code précédent
git checkout HEAD~1

# 4. Régénérer le client Prisma
npm run prisma:generate
```

## Checklist de Migration

- [ ] Sauvegarde de la base de données effectuée
- [ ] Dépendances installées (`npm install`)
- [ ] Client Prisma généré (`npm run prisma:generate`)
- [ ] Migration créée et appliquée
- [ ] Nouvelles tables et champs vérifiés
- [ ] Routes API testées
- [ ] Application testée en local
- [ ] Documentation lue
- [ ] Script de migration exécuté (si nécessaire)
- [ ] Tests de régression effectués

## Support

En cas de problème :
1. Consultez les logs : `npm run dev`
2. Vérifiez Prisma Studio : `npm run prisma:studio`
3. Consultez la documentation Prisma : https://www.prisma.io/docs
4. Contactez l'équipe de développement

---

**Important** : Cette migration est non-destructive. Toutes les données existantes sont préservées.

# Utilisation du Composant GradeBadge

Ce guide explique comment utiliser les nouveaux composants de notation dans votre application React.

## Import

```typescript
import { 
  GradeBadge, 
  GradingScale, 
  GPAProgress,
  calculateLetterGrade,
  calculateGPA 
} from '../components/GradeBadge';
```

## 1. Badge de Note Simple

Affiche la note lettre avec le score :

```tsx
<GradeBadge 
  score={85} 
  letterGrade="B"
  gpa={3.0}
/>
```

**Résultat** : Badge bleu affichant "B (85)"

## 2. Badge avec Détails

Affiche la note avec description et GPA :

```tsx
<GradeBadge 
  score={92} 
  letterGrade="A"
  gpa={4.0}
  showDetails={true}
/>
```

**Résultat** : 
- Badge vert "A (92/100)"
- Ligne de détails "Excellent • GPA: 4.0"

## 3. Tailles Disponibles

```tsx
{/* Petit */}
<GradeBadge score={85} size="sm" />

{/* Moyen (défaut) */}
<GradeBadge score={85} size="md" />

{/* Grand */}
<GradeBadge score={85} size="lg" />
```

## 4. Échelle de Notation

Affiche l'échelle complète A-F :

```tsx
<GradingScale />
```

**Affiche** :
- Grille des 6 notes (A à F)
- Plages de scores
- GPA correspondant
- Descriptions

## 5. Progression GPA

Affiche une barre de progression du GPA :

```tsx
<GPAProgress 
  currentGPA={3.2} 
  targetGPA={3.5}
  showTarget={true}
/>
```

**Affiche** :
- Barre de progression colorée
- GPA actuel / 4.0
- Ligne d'objectif (optionnel)

## 6. Dans un Tableau d'Activités

```tsx
import { GradeBadge } from '../components/GradeBadge';

function ActivitiesTable({ activities }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Note</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={activity.id}>
            <TableCell>{activity.title}</TableCell>
            <TableCell>{activity.type}</TableCell>
            <TableCell>
              {activity.score ? (
                <GradeBadge 
                  score={activity.score}
                  letterGrade={activity.letterGrade}
                  gpa={activity.gpa}
                />
              ) : (
                <span className="text-muted-foreground">Non évalué</span>
              )}
            </TableCell>
            <TableCell>
              <Badge>{activity.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## 7. Dans un Card de Profil Étudiant

```tsx
import { GradeBadge, GPAProgress } from '../components/GradeBadge';

function StudentProfile({ student }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{student.name}</CardTitle>
        <CardDescription>{student.email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* GPA Global */}
        <div>
          <h3 className="text-sm font-medium mb-2">Performance Globale</h3>
          <GPAProgress 
            currentGPA={student.gpa} 
            targetGPA={3.0}
          />
        </div>

        {/* Notes par Type */}
        <div>
          <h3 className="text-sm font-medium mb-2">Notes par Compétence</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Entrepreneuriat</span>
              <GradeBadge 
                score={student.scores.entrepreneuriat}
                size="sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Leadership</span>
              <GradeBadge 
                score={student.scores.leadership}
                size="sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Digital</span>
              <GradeBadge 
                score={student.scores.digital}
                size="sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 8. Dans un Dialog d'Évaluation

```tsx
import { useState } from 'react';
import { GradeBadge, GradingScale } from '../components/GradeBadge';

function EvaluationDialog({ activity, onEvaluate }) {
  const [score, setScore] = useState(0);

  return (
    <Dialog>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Évaluer l'activité</DialogTitle>
          <DialogDescription>
            {activity.title} - {activity.user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Échelle de notation pour référence */}
          <GradingScale />

          {/* Saisie du score */}
          <div className="space-y-2">
            <Label htmlFor="score">Score (0-100)</Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value))}
            />
          </div>

          {/* Prévisualisation de la note */}
          {score > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Note attribuée :</p>
              <GradeBadge 
                score={score} 
                showDetails={true}
                size="lg"
              />
            </div>
          )}

          {/* Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback">Commentaires</Label>
            <Textarea
              id="feedback"
              rows={4}
              placeholder="Donnez votre retour à l'étudiant..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline">Annuler</Button>
          <Button onClick={() => onEvaluate(score)}>
            Valider l'évaluation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## 9. Fonctions Utilitaires

### Calculer la note lettre manuellement

```typescript
import { calculateLetterGrade } from '../components/GradeBadge';

const grade = calculateLetterGrade(87); // "B"
```

### Calculer le GPA manuellement

```typescript
import { calculateGPA } from '../components/GradeBadge';

const gpa = calculateGPA(87); // 3.0
```

### Obtenir la couleur d'une note

```typescript
import { getGradeColor } from '../components/GradeBadge';

const color = getGradeColor('A'); // "bg-green-100 text-green-800 border-green-300"
```

### Obtenir la description

```typescript
import { getGradeDescription } from '../components/GradeBadge';

const desc = getGradeDescription('A'); // "Excellent"
```

## 10. Exemple Complet: Dashboard Étudiant

```tsx
import { GradeBadge, GPAProgress, GradingScale } from '../components/GradeBadge';

export function StudentDashboard() {
  const { data: activities } = useActivities();
  const { data: stats } = useStudentStats();

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec GPA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>GPA Global</CardTitle>
          </CardHeader>
          <CardContent>
            <GPAProgress 
              currentGPA={stats.gpa} 
              targetGPA={3.0}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activités Évaluées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.evaluatedCount} / {stats.totalCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meilleure Note</CardTitle>
          </CardHeader>
          <CardContent>
            <GradeBadge 
              score={stats.bestScore}
              showDetails={true}
              size="lg"
            />
          </CardContent>
        </Card>
      </div>

      {/* Échelle de notation */}
      <Card>
        <CardHeader>
          <CardTitle>Système de Notation</CardTitle>
        </CardHeader>
        <CardContent>
          <GradingScale />
        </CardContent>
      </Card>

      {/* Liste des activités */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Activités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {activity.type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activity.score ? (
                    <GradeBadge score={activity.score} />
                  ) : (
                    <Badge variant="outline">En attente</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Personnalisation

### Modifier les couleurs

Vous pouvez personnaliser les couleurs dans `GradeBadge.tsx` :

```typescript
const getGradeColor = (grade: string): string => {
  if (grade === 'A') return 'bg-green-100 text-green-800 border-green-300';
  // Modifiez selon vos besoins
};
```

### Ajouter des variantes

Vous pouvez créer des variantes du badge :

```tsx
export function CompactGradeBadge({ score }: { score: number }) {
  const grade = calculateLetterGrade(score);
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getGradeColor(grade)}`}>
      {grade}
    </span>
  );
}
```

## Support et Documentation

- **Échelle complète** : GET `/api/activities/grading/scale`
- **Conversion backend** : `backend/utils/grading.js`
- **Documentation** : `CORRECTION_ACCES_SUPERVISEUR_NOTATION.md`

---

**Version** : 2.0  
**Dernière mise à jour** : 7 novembre 2025

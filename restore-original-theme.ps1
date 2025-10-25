# Script de restauration du thème original
# Usage: .\restore-original-theme.ps1

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║     🔄 RESTAURATION DU THÈME ORIGINAL                     ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""

$projectRoot = "C:\Users\danie\Desktop\projetStage2iE"
$backupDir = "theme_backup_20251025_014549"
$backupPath = Join-Path $projectRoot $backupDir

if (-not (Test-Path $backupPath)) {
    Write-Host "❌ Dossier de sauvegarde introuvable: $backupDir" -ForegroundColor Red
    Write-Host "Recherche d'autres sauvegardes..." -ForegroundColor Yellow
    
    $backups = Get-ChildItem -Path $projectRoot -Directory -Filter "theme_backup_*" | Sort-Object LastWriteTime -Descending
    
    if ($backups.Count -eq 0) {
        Write-Host "❌ Aucune sauvegarde trouvée !" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "`nSauvegardes disponibles:" -ForegroundColor Cyan
    for ($i = 0; $i -lt $backups.Count; $i++) {
        Write-Host "  $($i+1). $($backups[$i].Name) - $($backups[$i].LastWriteTime)" -ForegroundColor White
    }
    
    $choice = Read-Host "`nChoisissez une sauvegarde (1-$($backups.Count))"
    $backupPath = $backups[[int]$choice - 1].FullName
    Write-Host "Utilisation de: $($backups[[int]$choice - 1].Name)" -ForegroundColor Green
}

Write-Host "`n📋 Fichiers à restaurer:" -ForegroundColor Cyan

$files = @(
    @{ Source = "index.css"; Dest = "frontend\src\index.css" },
    @{ Source = "tailwind.config.js"; Dest = "frontend\tailwind.config.js" },
    @{ Source = "App.tsx"; Dest = "frontend\src\App.tsx" },
    @{ Source = "Sidebar.tsx"; Dest = "frontend\src\pages\Sidebar.tsx" },
    @{ Source = "ActivitySubmission.tsx"; Dest = "frontend\src\pages\ActivitySubmission.tsx" },
    @{ Source = "Dashboard.tsx"; Dest = "frontend\src\pages\Dashboard.tsx" }
)

foreach ($file in $files) {
    $sourcePath = Join-Path $backupPath $file.Source
    $destPath = Join-Path $projectRoot $file.Dest
    
    if (Test-Path $sourcePath) {
        Write-Host "  ✓ $($file.Source)" -ForegroundColor Gray
    } else {
        Write-Host "  ⚠ $($file.Source) (non trouvé dans la sauvegarde)" -ForegroundColor Yellow
    }
}

Write-Host ""
$confirm = Read-Host "Voulez-vous restaurer ces fichiers ? (O/N)"

if ($confirm -ne "O" -and $confirm -ne "o") {
    Write-Host "`n❌ Restauration annulée" -ForegroundColor Yellow
    exit 0
}

Write-Host "`n🔄 Restauration en cours..." -ForegroundColor Cyan
Write-Host ""

$restored = 0
$failed = 0

foreach ($file in $files) {
    $sourcePath = Join-Path $backupPath $file.Source
    $destPath = Join-Path $projectRoot $file.Dest
    
    if (Test-Path $sourcePath) {
        try {
            Copy-Item $sourcePath -Destination $destPath -Force
            Write-Host "  ✅ $($file.Source) → $($file.Dest)" -ForegroundColor Green
            $restored++
        } catch {
            Write-Host "  ❌ Erreur: $($file.Source) - $($_.Exception.Message)" -ForegroundColor Red
            $failed++
        }
    } else {
        Write-Host "  ⚠️  Ignoré: $($file.Source) (non trouvé)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║               RESTAURATION TERMINÉE                        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Résumé:" -ForegroundColor Cyan
Write-Host "   Fichiers restaurés: $restored" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "   Fichiers en erreur: $failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "⚠️  IMPORTANT:" -ForegroundColor Yellow
Write-Host "   1. Relancez le serveur frontend (npm run dev)" -ForegroundColor White
Write-Host "   2. Videz le cache du navigateur (Ctrl+Shift+R)" -ForegroundColor White
Write-Host "   3. Vérifiez que l'ancien thème est bien appliqué" -ForegroundColor White
Write-Host ""

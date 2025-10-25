/**
 * Test simple de génération PDF avec PDFKit
 * Pour vérifier que le package fonctionne correctement
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');

console.log('🧪 Test de génération PDF avec PDFKit...\n');

try {
  // Créer un document PDF simple
  const doc = new PDFDocument({ 
    size: 'A4', 
    margin: 50,
    bufferPages: true 
  });
  
  const filename = `test-pdf-${Date.now()}.pdf`;
  const stream = fs.createWriteStream(filename);
  
  doc.pipe(stream);

  // Contenu du test
  doc
    .fontSize(20)
    .font('Helvetica-Bold')
    .text('Test PDF - Activites LED', { align: 'center' });
  
  doc.moveDown();
  
  doc
    .fontSize(12)
    .font('Helvetica')
    .text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });
  
  doc.moveDown(2);
  
  // Ajouter du contenu test
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .fillColor('blue')
    .text('1. Activite de test')
    .fillColor('black');
  
  doc.moveDown(0.5);
  
  doc
    .fontSize(10)
    .font('Helvetica')
    .text('Type: entrepreneuriat')
    .text('Statut: completed')
    .text('Progression: 100%');
  
  doc.moveDown(0.5);
  
  doc
    .fontSize(9)
    .font('Helvetica-Bold')
    .text('Description:');
  
  doc
    .font('Helvetica')
    .text('Ceci est une description de test pour verifier que la generation PDF fonctionne correctement avec des caracteres accentues.', {
      width: 500,
      align: 'justify'
    });
  
  doc.moveDown(1);
  
  // Séparateur
  doc
    .strokeColor('gray')
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke();
  
  // Ajouter une deuxième page pour tester la pagination
  doc.addPage();
  
  doc
    .fontSize(14)
    .text('Page 2 - Test de pagination');
  
  doc.moveDown();
  
  doc
    .fontSize(10)
    .text('Si vous voyez cette page, la pagination fonctionne correctement.');
  
  // Pied de page
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(8)
      .fillColor('gray')
      .text(
        `Page ${i + 1} sur ${range.count}`,
        50,
        doc.page.height - 50,
        { align: 'center', width: 500 }
      );
  }
  
  // Finaliser
  doc.end();
  
  stream.on('finish', () => {
    const stats = fs.statSync(filename);
    console.log('✅ PDF genere avec succes!');
    console.log(`📁 Fichier: ${filename}`);
    console.log(`📊 Taille: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log('\n💡 Ouvrez le fichier pour verifier le contenu.');
  });
  
  stream.on('error', (err) => {
    console.error('❌ Erreur lors de l\'ecriture du fichier:', err);
  });

} catch (error) {
  console.error('❌ Erreur lors de la generation PDF:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
}

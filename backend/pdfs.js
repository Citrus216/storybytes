const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

async function generatePDF(id, textArray) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ layout: 'landscape',  });
    const outputPath = `temp/${id}/story.pdf`;
    const imagesDir = `temp/${id}`;
    
    doc.pipe(fs.createWriteStream(outputPath));

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Define dimensions for image and text areas
    const imageWidth = pageWidth * 0.4;  // Image takes 40% of the page width
    const textWidth = pageWidth * 0.5;   // Text takes 50% of the page width
    const margin = pageWidth * 0.05;     // Margin between image and text

    doc.fontSize(30).text(textArray[0], { width: doc.page.width * 0.9, align: 'center' });
    const coverImagePath = path.join(imagesDir, 'cover.jpg');
    if (fs.existsSync(coverImagePath)) {
      const imageOptions = {
        fit: [pageWidth * 0.8, pageHeight * 0.8],
        align: 'center',
        valign: 'center',
      };
      doc.image(coverImagePath, pageWidth * 0.1, pageHeight * 0.2, imageOptions);
    }
    doc.moveDown();

    textArray.slice(1).forEach((text, index) => {
      doc.addPage();
      doc.fontSize(14);

      // Load the image for the current page
      const imagePath = path.join(imagesDir, `page${index}.jpg`);
      
      // Check if image exists
      if (fs.existsSync(imagePath)) {
        // Place the image and text, centered
        const imageOptions = {
          fit: [imageWidth, pageHeight * 0.8],
          align: 'center',
          valign: 'center',
        };
        doc.image(imagePath, margin, pageHeight * 0.1, imageOptions); // Centered vertically with 10% margin on top
      }
      
      // Calculate the vertical position for centered text
      const textHeight = doc.heightOfString(text, { width: textWidth, align: 'left' });
      const textYPosition = (pageHeight - textHeight) / 2;

      // Add the text, centered vertically on the right side
      doc
        .fontSize(14)
        .text(text, imageWidth + 2 * margin, textYPosition, {
          width: textWidth,
          align: 'left'
        })
        .moveDown();
    });

    doc.end();

    doc.on('finish', () => resolve(outputPath));
    doc.on('error', (err) => reject(err));
  });
}

module.exports = { generatePDF };

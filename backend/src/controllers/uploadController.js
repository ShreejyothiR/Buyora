const path = require('path');
const fs = require('fs');
const prisma = require('../prisma');
const { extractProductIntelligence } = require('../ai/geminiService');

exports.uploadAndExtract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload a screenshot, product image, or PDF.' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    let extractedText = '';

    // If PDF, parse text if possible
    if (mimeType === 'application/pdf') {
      try {
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
      } catch (err) {
        console.warn('PDF parse fallback:', err.message);
      }
    }

    const intelligence = await extractProductIntelligence({
      text: extractedText,
      filePath: mimeType.startsWith('image/') ? filePath : null,
      mimeType: mimeType.startsWith('image/') ? mimeType : null,
    });

    const fileUrl = `/uploads/${req.file.filename}`;

    // Optionally save upload log
    if (req.user) {
      try {
        await prisma.uploadedDocument.create({
          data: {
            userId: req.user.id,
            fileName: req.file.originalname,
            fileUrl,
            fileType: mimeType.includes('pdf') ? 'PDF' : 'IMAGE',
            extractedData: JSON.stringify(intelligence),
          }
        });
      } catch (e) {}
    }

    res.json({
      fileUrl,
      fileName: req.file.originalname,
      extractedData: intelligence,
    });
  } catch (error) {
    console.error('Upload extract error:', error);
    res.status(500).json({ error: 'Failed to process and analyze uploaded file.' });
  }
};

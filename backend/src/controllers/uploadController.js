const prisma = require('../prisma');
const { extractProductIntelligence } = require('../ai/geminiService');

exports.uploadAndExtract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded. Please upload a screenshot, product image, or PDF.',
      });
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    let extractedText = '';

    // PDF text extraction
    if (mimeType === 'application/pdf') {
      try {
        const pdfParse = require('pdf-parse');
        const pdfData = await pdfParse(fileBuffer);
        extractedText = pdfData.text || '';
      } catch (err) {
        console.warn('PDF parse fallback:', err.message);
      }
    }

    // Send uploaded file to Gemini service
    const intelligence = await extractProductIntelligence({
      text: extractedText,
      fileBuffer: mimeType.startsWith('image/') ? fileBuffer : null,
      mimeType: mimeType.startsWith('image/') ? mimeType : null,
    });

    // Since Vercel serverless storage is temporary,
    // don't create a permanent /uploads URL here.
    const fileUrl = null;

    // Save upload information if authenticated
    if (req.user) {
      try {
        await prisma.uploadedDocument.create({
          data: {
            userId: req.user.id,
            fileName: req.file.originalname,
            fileUrl: fileUrl,
            fileType: mimeType.includes('pdf') ? 'PDF' : 'IMAGE',
            extractedData: JSON.stringify(intelligence),
          },
        });
      } catch (e) {
        console.warn('Could not save upload record:', e.message);
      }
    }

    res.json({
      fileUrl,
      fileName: req.file.originalname,
      extractedData: intelligence,
    });
  } catch (error) {
    console.error('Upload extract error:', error);

    res.status(500).json({
      error: 'Failed to process and analyze uploaded file.',
      details: error.message,
    });
  }
};

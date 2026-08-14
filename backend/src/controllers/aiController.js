const prisma = require('../prisma');
const { extractProductIntelligence, generateChatResponse } = require('../ai/geminiService');

// Extract intelligence from URL or direct text
exports.extractFromInput = async (req, res) => {
  try {
    const { url, text } = req.body;

    if (!url && !text) {
      return res.status(400).json({ error: 'Please provide either a product URL or product text details.' });
    }

    const extracted = await extractProductIntelligence({ text, url });
    res.json(extracted);
  } catch (error) {
    console.error('AI Extraction error:', error);
    res.status(500).json({ error: 'Failed to extract product intelligence.' });
  }
};

// Context-aware AI Chat Assistant
exports.chat = async (req, res) => {
  try {
    const { message, currentProductId1, currentProductId2, sessionId, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    let product1 = null;
    let product2 = null;

    if (currentProductId1) {
      product1 = await prisma.product.findUnique({
        where: { id: currentProductId1 },
        include: { productAnalysis: true, specifications: true }
      });
    }

    if (currentProductId2) {
      product2 = await prisma.product.findUnique({
        where: { id: currentProductId2 },
        include: { productAnalysis: true, specifications: true }
      });
    }

    const response = await generateChatResponse({
      message,
      currentProduct1: product1,
      currentProduct2: product2,
      history: history || [],
    });

    // If user is logged in and sessionId is provided, persist messages
    if (req.user && sessionId) {
      try {
        await prisma.chatMessage.createMany({
          data: [
            { sessionId, role: 'user', content: message },
            { sessionId, role: 'assistant', content: response.text, actionData: response.actionData ? JSON.stringify(response.actionData) : null }
          ]
        });
      } catch (e) {
        console.warn('Failed to save chat message:', e.message);
      }
    }

    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'AI assistant service encountered an error.' });
  }
};

// Budget Optimizer - Recommends best products for a given budget
exports.recommendByBudget = async (req, res) => {
  try {
    const { budget, category } = req.body;
    const targetBudget = parseFloat(budget) || 50000;

    const where = {};
    if (category && category !== 'All') {
      where.category = category;
    }

    const products = await prisma.product.findMany({
      where,
      include: { productAnalysis: true, specifications: true }
    });

    // Group products into under-budget, at-budget, and slight-stretch
    const underBudget = products
      .filter(p => p.currentPrice <= targetBudget * 0.85)
      .sort((a, b) => b.futureProofScore - a.futureProofScore)[0];

    const atBudget = products
      .filter(p => p.currentPrice > targetBudget * 0.85 && p.currentPrice <= targetBudget * 1.05)
      .sort((a, b) => (b.rating * 20 + b.futureProofScore) - (a.rating * 20 + a.futureProofScore))[0];

    const stretchOption = products
      .filter(p => p.currentPrice > targetBudget * 1.05 && p.currentPrice <= targetBudget * 1.3)
      .sort((a, b) => b.futureProofScore - a.futureProofScore)[0];

    res.json({
      targetBudget,
      bestValueAtBudget: atBudget || underBudget || products[0],
      economyAlternative: underBudget,
      performanceStretchOption: stretchOption,
      recommendationSummary: atBudget
        ? `At ₹${targetBudget.toLocaleString()}, the ${atBudget.name} maximizes your price-to-future-proofing ratio.`
        : `We evaluated available options and highlighted the closest matches for your ₹${targetBudget.toLocaleString()} allocation.`
    });
  } catch (error) {
    console.error('Budget recommendation error:', error);
    res.status(500).json({ error: 'Failed to generate budget optimization.' });
  }
};

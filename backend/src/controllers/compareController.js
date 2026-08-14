const prisma = require('../prisma');
const { compareProducts } = require('../services/productService');

exports.compareProducts = async (req, res) => {
  try {
    const { productIds, weights } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({ error: 'Please provide at least 2 product IDs to compare.' });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      },
      include: {
        specifications: true,
        productAnalysis: true,
        reviewAnalysis: true,
        priceHistory: { orderBy: { recordedAt: 'asc' } },
        listings: { include: { seller: true } }
      }
    });

    if (products.length < 2) {
      return res.status(404).json({ error: 'One or more selected products were not found.' });
    }

    // Default or user's preferences if logged in
    let finalWeights = weights;
    if (!finalWeights && req.user && req.user.preferences) {
      finalWeights = {
        price: req.user.preferences.priceWeight,
        performance: req.user.preferences.performanceWeight,
        battery: req.user.preferences.batteryWeight,
        camera: req.user.preferences.cameraWeight,
        durability: req.user.preferences.durabilityWeight,
        portability: req.user.preferences.portabilityWeight,
        gaming: req.user.preferences.gamingWeight,
        longTerm: req.user.preferences.longTermWeight,
      };
    }

    const comparisonResult = compareProducts(products, finalWeights);

    // Save comparison if user is logged in
    if (req.user) {
      try {
        await prisma.comparison.create({
          data: {
            userId: req.user.id,
            productIds: JSON.stringify(productIds),
            categoryWinners: JSON.stringify(comparisonResult.categoryWinners),
            overallWinnerId: comparisonResult.overallWinnerId,
            winnerScore: comparisonResult.overallWinnerScore,
            userWeights: JSON.stringify(finalWeights || {}),
          }
        });
      } catch (e) {
        console.warn('Failed to persist comparison history:', e.message);
      }
    }

    res.json(comparisonResult);
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({ error: 'Failed to process product comparison.' });
  }
};

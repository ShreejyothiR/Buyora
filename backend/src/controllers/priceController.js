const prisma = require('../prisma');

exports.getProductPriceHistory = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        priceHistory: { orderBy: { recordedAt: 'asc' } },
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const prices = product.priceHistory.map(p => p.price);
    const currentPrice = product.currentPrice;
    const minPrice = prices.length ? Math.min(...prices, currentPrice) : currentPrice;
    const maxPrice = prices.length ? Math.max(...prices, currentPrice) : currentPrice;
    const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : currentPrice;

    // AI Good time to buy logic
    let verdict = 'GOOD TIME TO BUY';
    let explanation = `The current price of ₹${currentPrice.toLocaleString()} is near its recent historical low of ₹${minPrice.toLocaleString()}.`;

    if (currentPrice > avgPrice * 1.05) {
      verdict = 'WAIT FOR SALE';
      explanation = `Current price is approximately ${Math.round(((currentPrice - avgPrice) / avgPrice) * 100)}% above its 60-day average. You could save ~₹${(currentPrice - minPrice).toLocaleString()} during festive or weekend sales.`;
    } else if (currentPrice < avgPrice * 0.95) {
      verdict = 'EXCELLENT DEAL';
      explanation = `Current price is ${Math.round(((avgPrice - currentPrice) / avgPrice) * 100)}% below average historical pricing. High likelihood of stock depletion.`;
    }

    res.json({
      productId,
      currentPrice,
      lowestPrice: minPrice,
      averagePrice: avgPrice,
      highestPrice: maxPrice,
      buyTimingVerdict: verdict,
      buyTimingExplanation: explanation,
      priceHistory: product.priceHistory,
    });
  } catch (error) {
    console.error('Price intelligence error:', error);
    res.status(500).json({ error: 'Failed to retrieve price history.' });
  }
};

exports.createPriceAlert = async (req, res) => {
  try {
    const { productId, targetPrice } = req.body;
    const userId = req.user.id;

    if (!productId || !targetPrice) {
      return res.status(400).json({ error: 'Product ID and target price are required.' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const alert = await prisma.priceAlert.create({
      data: {
        userId,
        productId,
        targetPrice: parseFloat(targetPrice),
        currentPrice: product.currentPrice,
        isActive: true,
        isTriggered: product.currentPrice <= parseFloat(targetPrice),
      },
      include: { product: true }
    });

    res.status(201).json({ message: 'Price alert created successfully', alert });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Failed to create price alert.' });
  }
};

exports.getUserPriceAlerts = async (req, res) => {
  try {
    const alerts = await prisma.priceAlert.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch price alerts.' });
  }
};

exports.deletePriceAlert = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.priceAlert.delete({ where: { id } });
    res.json({ message: 'Price alert deleted' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ error: 'Failed to delete price alert.' });
  }
};

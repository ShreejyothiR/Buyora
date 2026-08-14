const prisma = require('../prisma');

exports.getSavedProducts = async (req, res) => {
  try {
    const saved = await prisma.savedProduct.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: { productAnalysis: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = saved.map(s => {
      let analysis = s.product.productAnalysis;
      if (analysis) {
        try {
          analysis = {
            ...analysis,
            productDna: typeof analysis.productDna === 'string' ? JSON.parse(analysis.productDna) : analysis.productDna,
          };
        } catch (e) {}
      }
      return {
        ...s,
        product: { ...s.product, productAnalysis: analysis }
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Get saved error:', error);
    res.status(500).json({ error: 'Failed to fetch saved products.' });
  }
};

exports.toggleSaveProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const existing = await prisma.savedProduct.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (existing) {
      await prisma.savedProduct.delete({
        where: { id: existing.id }
      });
      return res.json({ saved: false, message: 'Removed from saved products.' });
    } else {
      const saved = await prisma.savedProduct.create({
        data: { userId, productId },
        include: { product: true }
      });
      return res.json({ saved: true, message: 'Added to saved products.', item: saved });
    }
  } catch (error) {
    console.error('Toggle save error:', error);
    res.status(500).json({ error: 'Failed to toggle saved product.' });
  }
};

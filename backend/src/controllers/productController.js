const prisma = require('../prisma');
const { calculateUpgradeComparison } = require('../services/productService');

// Get all products with filtering, search, and sorting
exports.getProducts = async (req, res) => {
  try {
    const { category, brand, search, minPrice, maxPrice, verdict, sort } = req.query;

    const where = {};

    if (category && category !== 'All') {
      where.category = { equals: category };
    }

    if (brand && brand !== 'All') {
      where.brand = { equals: brand };
    }

    if (verdict && verdict !== 'All') {
      where.buyVerdict = { equals: verdict };
    }

    if (minPrice || maxPrice) {
      where.currentPrice = {};
      if (minPrice) where.currentPrice.gte = parseFloat(minPrice);
      if (maxPrice) where.currentPrice.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { category: { contains: search } },
        { rawDescription: { contains: search } },
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { currentPrice: 'asc' };
    if (sort === 'price_desc') orderBy = { currentPrice: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'future_proof') orderBy = { futureProofScore: 'desc' };
    if (sort === 'completeness') orderBy = { listingCompletenessScore: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        productAnalysis: true,
        specifications: { take: 6 },
        _count: { select: { reviews: true } }
      },
    });

    // Parse JSON fields in analysis for clean frontend consumption
    const formatted = products.map(p => {
      let analysis = p.productAnalysis;
      if (analysis) {
        try {
          analysis = {
            ...analysis,
            marketingClaims: typeof analysis.marketingClaims === 'string' ? JSON.parse(analysis.marketingClaims) : analysis.marketingClaims,
            missingInformation: typeof analysis.missingInformation === 'string' ? JSON.parse(analysis.missingInformation) : analysis.missingInformation,
            hiddenCosts: typeof analysis.hiddenCosts === 'string' ? JSON.parse(analysis.hiddenCosts) : analysis.hiddenCosts,
            regretReasons: typeof analysis.regretReasons === 'string' ? JSON.parse(analysis.regretReasons) : analysis.regretReasons,
            whoShouldNotBuy: typeof analysis.whoShouldNotBuy === 'string' ? JSON.parse(analysis.whoShouldNotBuy) : analysis.whoShouldNotBuy,
            productDna: typeof analysis.productDna === 'string' ? JSON.parse(analysis.productDna) : analysis.productDna,
          };
        } catch (e) {}
      }
      return { ...p, productAnalysis: analysis };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

// Get single product with full deep intelligence
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        specifications: true,
        listings: { include: { seller: true } },
        priceHistory: { orderBy: { recordedAt: 'asc' } },
        reviews: { orderBy: { date: 'desc' }, take: 20 },
        reviewAnalysis: true,
        productAnalysis: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Format analysis & reviewAnalysis JSON fields
    let formattedAnalysis = product.productAnalysis;
    if (formattedAnalysis) {
      try {
        formattedAnalysis = {
          ...formattedAnalysis,
          marketingClaims: typeof formattedAnalysis.marketingClaims === 'string' ? JSON.parse(formattedAnalysis.marketingClaims) : formattedAnalysis.marketingClaims,
          missingInformation: typeof formattedAnalysis.missingInformation === 'string' ? JSON.parse(formattedAnalysis.missingInformation) : formattedAnalysis.missingInformation,
          hiddenCosts: typeof formattedAnalysis.hiddenCosts === 'string' ? JSON.parse(formattedAnalysis.hiddenCosts) : formattedAnalysis.hiddenCosts,
          regretReasons: typeof formattedAnalysis.regretReasons === 'string' ? JSON.parse(formattedAnalysis.regretReasons) : formattedAnalysis.regretReasons,
          whoShouldNotBuy: typeof formattedAnalysis.whoShouldNotBuy === 'string' ? JSON.parse(formattedAnalysis.whoShouldNotBuy) : formattedAnalysis.whoShouldNotBuy,
          productDna: typeof formattedAnalysis.productDna === 'string' ? JSON.parse(formattedAnalysis.productDna) : formattedAnalysis.productDna,
          fakeDiscountAnalysis: formattedAnalysis.fakeDiscountAnalysis ? (typeof formattedAnalysis.fakeDiscountAnalysis === 'string' ? JSON.parse(formattedAnalysis.fakeDiscountAnalysis) : formattedAnalysis.fakeDiscountAnalysis) : null,
          contradictions: formattedAnalysis.contradictions ? (typeof formattedAnalysis.contradictions === 'string' ? JSON.parse(formattedAnalysis.contradictions) : formattedAnalysis.contradictions) : [],
        };
      } catch (e) {}
    }

    let formattedReviewAnalysis = product.reviewAnalysis;
    if (formattedReviewAnalysis) {
      try {
        formattedReviewAnalysis = {
          ...formattedReviewAnalysis,
          positiveThemes: typeof formattedReviewAnalysis.positiveThemes === 'string' ? JSON.parse(formattedReviewAnalysis.positiveThemes) : formattedReviewAnalysis.positiveThemes,
          negativeThemes: typeof formattedReviewAnalysis.negativeThemes === 'string' ? JSON.parse(formattedReviewAnalysis.negativeThemes) : formattedReviewAnalysis.negativeThemes,
          commonComplaints: typeof formattedReviewAnalysis.commonComplaints === 'string' ? JSON.parse(formattedReviewAnalysis.commonComplaints) : formattedReviewAnalysis.commonComplaints,
          commonPraise: typeof formattedReviewAnalysis.commonPraise === 'string' ? JSON.parse(formattedReviewAnalysis.commonPraise) : formattedReviewAnalysis.commonPraise,
        };
      } catch (e) {}
    }

    res.json({
      ...product,
      productAnalysis: formattedAnalysis,
      reviewAnalysis: formattedReviewAnalysis,
    });
  } catch (error) {
    console.error('Get product detail error:', error);
    res.status(500).json({ error: 'Failed to retrieve product details.' });
  }
};

// Create product manually or from ingestion
exports.createProduct = async (req, res) => {
  try {
    const data = req.body;

    const product = await prisma.product.create({
      data: {
        name: data.name,
        brand: data.brand || 'Universal',
        category: data.category || 'Electronics',
        modelNumber: data.modelNumber,
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
        currentPrice: parseFloat(data.currentPrice) || 49999,
        originalPrice: parseFloat(data.originalPrice) || parseFloat(data.currentPrice) * 1.15,
        rating: parseFloat(data.rating) || 4.5,
        reviewCount: parseInt(data.reviewCount) || 120,
        buyVerdict: data.buyVerdict || 'BUY',
        verdictReason: data.verdictReason || 'Verified solid price-to-performance ratio.',
        decisionConfidence: parseInt(data.decisionConfidence) || 88,
        listingCompletenessScore: parseInt(data.listingCompletenessScore) || 82,
        futureProofScore: parseInt(data.futureProofScore) || 85,
        regretRisk: data.regretRisk || 'LOW',
        rawDescription: data.rawDescription,
        specifications: {
          create: (data.specifications || []).map(s => ({
            category: s.category || 'General',
            key: s.key,
            value: s.value,
            unit: s.unit || '',
            isEstimated: Boolean(s.isEstimated),
            isUnavailable: Boolean(s.isUnavailable),
            confidenceScore: parseInt(s.confidenceScore) || 90,
          }))
        },
        productAnalysis: {
          create: {
            marketingClaims: JSON.stringify(data.marketingClaims || []),
            missingInformation: JSON.stringify(data.missingInformation || []),
            hiddenCosts: JSON.stringify(data.hiddenCosts || []),
            totalEstimatedRealCost: parseFloat(data.totalEstimatedRealCost) || parseFloat(data.currentPrice) * 1.08,
            regretReasons: JSON.stringify(data.regretReasons || []),
            whoShouldNotBuy: JSON.stringify(data.whoShouldNotBuy || []),
            productDna: JSON.stringify(data.productDna || { performance: 85, value: 80, durability: 80, portability: 85, innovation: 80, repairability: 60, risk: 20, longTermValue: 82 }),
            marginalValueScore: parseFloat(data.marginalValueScore) || 8.0,
            fakeDiscountAnalysis: JSON.stringify(data.fakeDiscountAnalysis || { isSuspicious: false, typicalPrice: parseFloat(data.currentPrice), explanation: 'Normal market pricing', confidence: 85 }),
            contradictions: JSON.stringify(data.contradictions || [])
          }
        },
        priceHistory: {
          create: [
            { price: parseFloat(data.originalPrice) || parseFloat(data.currentPrice) * 1.15, recordedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
            { price: parseFloat(data.currentPrice) * 1.05, recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            { price: parseFloat(data.currentPrice), recordedAt: new Date() }
          ]
        }
      },
      include: {
        specifications: true,
        productAnalysis: true,
        priceHistory: true,
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product listing.' });
  }
};

// Upgrade vs Buy New Comparison calculation
exports.compareUpgrade = async (req, res) => {
  try {
    const { targetProductId, currentDeviceName, currentDeviceYear, currentDeviceCategory } = req.body;

    const targetProduct = await prisma.product.findUnique({
      where: { id: targetProductId },
      include: { productAnalysis: true, specifications: true }
    });

    if (!targetProduct) {
      return res.status(404).json({ error: 'Target product not found' });
    }

    const comparison = calculateUpgradeComparison({
      currentDeviceName,
      currentDeviceYear,
      currentDeviceCategory,
      targetProduct,
    });

    res.json(comparison);
  } catch (error) {
    console.error('Upgrade comparison error:', error);
    res.status(500).json({ error: 'Failed to calculate upgrade comparison.' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};

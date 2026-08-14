const prisma = require('../prisma');

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { date: 'desc' }
    });

    const analysis = await prisma.reviewAnalysis.findUnique({
      where: { productId }
    });

    let formattedAnalysis = analysis;
    if (analysis) {
      try {
        formattedAnalysis = {
          ...analysis,
          positiveThemes: typeof analysis.positiveThemes === 'string' ? JSON.parse(analysis.positiveThemes) : analysis.positiveThemes,
          negativeThemes: typeof analysis.negativeThemes === 'string' ? JSON.parse(analysis.negativeThemes) : analysis.negativeThemes,
          commonComplaints: typeof analysis.commonComplaints === 'string' ? JSON.parse(analysis.commonComplaints) : analysis.commonComplaints,
          commonPraise: typeof analysis.commonPraise === 'string' ? JSON.parse(analysis.commonPraise) : analysis.commonPraise,
        };
      } catch (e) {}
    }

    res.json({
      reviews,
      reviewAnalysis: formattedAnalysis,
    });
  } catch (error) {
    console.error('Reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { productId, author, rating, title, content } = req.body;

    if (!productId || !author || !rating || !content) {
      return res.status(400).json({ error: 'Product ID, author, rating, and content are required.' });
    }

    // Heuristic bot / anomaly detector on submitted review
    const isBotSuspect = content.length < 15 || /great product best ever click here/i.test(content);

    const review = await prisma.review.create({
      data: {
        productId,
        author,
        rating: parseFloat(rating),
        title,
        content,
        verifiedPurchase: true,
        flaggedAnomaly: isBotSuspect,
      }
    });

    // Update product rating summary
    const allReviews = await prisma.review.findMany({ where: { productId } });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Failed to add review.' });
  }
};

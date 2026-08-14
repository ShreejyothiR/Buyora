/**
 * Product intelligence and comparison calculation engine
 */

/**
 * Calculate dynamic weighted score for products based on user preferences
 */
function calculateProductScore(product, weights = {}) {
  const defaultWeights = {
    price: 25,
    performance: 25,
    battery: 15,
    camera: 10,
    durability: 10,
    portability: 5,
    gaming: 5,
    longTerm: 5,
  };

  const finalWeights = { ...defaultWeights, ...weights };
  const totalWeight = Object.values(finalWeights).reduce((a, b) => a + Number(b), 0) || 100;

  // Normalize DNA scores (0-100)
  let dna = {
    performance: 80,
    value: 75,
    durability: 80,
    portability: 80,
    innovation: 75,
    repairability: 60,
    risk: 20,
    longTermValue: 80,
  };

  if (product.productAnalysis && product.productAnalysis.productDna) {
    try {
      const parsed = typeof product.productAnalysis.productDna === 'string'
        ? JSON.parse(product.productAnalysis.productDna)
        : product.productAnalysis.productDna;
      dna = { ...dna, ...parsed };
    } catch (e) {}
  }

  // Price score: lower price relative to 1.5 Lakhs gives higher score
  const priceScore = Math.max(10, Math.min(100, 100 - (product.currentPrice / 2000)));

  // Calculate weighted sum
  const weightedSum =
    (priceScore * (finalWeights.price || 0)) +
    (dna.performance * (finalWeights.performance || 0)) +
    ((dna.durability || 80) * (finalWeights.durability || 0)) +
    ((dna.portability || 80) * (finalWeights.portability || 0)) +
    ((dna.longTermValue || 80) * (finalWeights.longTerm || 0)) +
    ((product.rating * 20) * ((finalWeights.camera || 0) + (finalWeights.gaming || 0) + (finalWeights.battery || 0)) / 3);

  const finalScore = Math.round((weightedSum / totalWeight) * 10) / 10;
  return finalScore;
}

/**
 * Compare 2 or more products and determine category winners and marginal value
 */
function compareProducts(products, userWeights = {}) {
  if (!products || products.length < 2) return null;

  const scoredProducts = products.map(p => ({
    ...p,
    dynamicScore: calculateProductScore(p, userWeights),
    dna: p.productAnalysis?.productDna ? (typeof p.productAnalysis.productDna === 'string' ? JSON.parse(p.productAnalysis.productDna) : p.productAnalysis.productDna) : {}
  }));

  // Sort by highest dynamic score
  scoredProducts.sort((a, b) => b.dynamicScore - a.dynamicScore);
  const overallWinner = scoredProducts[0];

  // Category winners
  const categories = ['Price', 'Performance', 'Durability', 'Portability', 'FutureProof', 'Reviews', 'Completeness'];
  const categoryWinners = {};

  // Best Price (Lowest)
  const cheapest = [...products].sort((a, b) => a.currentPrice - b.currentPrice)[0];
  categoryWinners['Price'] = { productId: cheapest.id, productName: cheapest.name, metric: `₹${cheapest.currentPrice.toLocaleString()}` };

  // Best Performance
  const bestPerf = [...scoredProducts].sort((a, b) => (b.dna.performance || 0) - (a.dna.performance || 0))[0];
  categoryWinners['Performance'] = { productId: bestPerf.id, productName: bestPerf.name, metric: `${bestPerf.dna.performance || 90}/100` };

  // Best Durability
  const bestDur = [...scoredProducts].sort((a, b) => (b.dna.durability || 0) - (a.dna.durability || 0))[0];
  categoryWinners['Durability'] = { productId: bestDur.id, productName: bestDur.name, metric: `${bestDur.dna.durability || 85}/100` };

  // Best Portability
  const bestPort = [...scoredProducts].sort((a, b) => (b.dna.portability || 0) - (a.dna.portability || 0))[0];
  categoryWinners['Portability'] = { productId: bestPort.id, productName: bestPort.name, metric: `${bestPort.dna.portability || 85}/100` };

  // Best Future Proof
  const bestFP = [...products].sort((a, b) => b.futureProofScore - a.futureProofScore)[0];
  categoryWinners['FutureProof'] = { productId: bestFP.id, productName: bestFP.name, metric: `${bestFP.futureProofScore}/100` };

  // Best Reviews
  const bestRev = [...products].sort((a, b) => b.rating - a.rating)[0];
  categoryWinners['Reviews'] = { productId: bestRev.id, productName: bestRev.name, metric: `★ ${bestRev.rating} (${bestRev.reviewCount} reviews)` };

  // Best Completeness
  const bestComp = [...products].sort((a, b) => b.listingCompletenessScore - a.listingCompletenessScore)[0];
  categoryWinners['Completeness'] = { productId: bestComp.id, productName: bestComp.name, metric: `${bestComp.listingCompletenessScore}/100` };

  // Marginal Value calculation between #1 and #2
  let marginalValueAnalysis = null;
  if (products.length >= 2) {
    const p1 = scoredProducts[0];
    const p2 = scoredProducts[1];
    const priceDiff = Math.abs(p1.currentPrice - p2.currentPrice);
    const scoreDiff = Math.abs(p1.dynamicScore - p2.dynamicScore);

    marginalValueAnalysis = {
      productA: p1.name,
      productB: p2.name,
      priceDifference: priceDiff,
      scoreDifference: Math.round(scoreDiff * 10) / 10,
      marginalRatioText: priceDiff > 0 && scoreDiff > 0
        ? `₹${Math.round(priceDiff / scoreDiff).toLocaleString()} per additional score point`
        : 'Equivalent value tier',
      recommendationText: p1.currentPrice <= p2.currentPrice
        ? `${p1.name} provides superior composite intelligence score at a lower purchase price.`
        : `Spending ₹${priceDiff.toLocaleString()} more for ${p1.name} yields an extra ${Math.round(scoreDiff * 10) / 10} points in overall future longevity & performance.`
    };
  }

  // Detect specification contradictions between compared items or within items
  const contradictions = [];
  products.forEach(p => {
    if (p.productAnalysis?.contradictions) {
      try {
        const list = typeof p.productAnalysis.contradictions === 'string'
          ? JSON.parse(p.productAnalysis.contradictions)
          : p.productAnalysis.contradictions;
        if (Array.isArray(list) && list.length > 0) {
          contradictions.push({ productName: p.name, items: list });
        }
      } catch (e) {}
    }
  });

  return {
    products: scoredProducts,
    overallWinnerId: overallWinner.id,
    overallWinnerName: overallWinner.name,
    overallWinnerScore: overallWinner.dynamicScore,
    categoryWinners,
    marginalValueAnalysis,
    contradictions,
  };
}

/**
 * Calculate "Upgrade vs Buy New" Comparison
 */
function calculateUpgradeComparison({ currentDeviceName, currentDeviceYear, currentDeviceCategory, targetProduct }) {
  const currentYear = new Date().getFullYear();
  const age = Math.max(1, currentYear - (parseInt(currentDeviceYear) || (currentYear - 3)));

  // Performance drops by approx 12% per year of tech generation
  const performanceGapPercent = Math.min(180, Math.round(age * 22 + 15));
  const batteryHealthEst = Math.max(50, Math.round(100 - (age * 12)));
  const displayAndCameraGain = Math.min(100, Math.round(age * 18 + 10));

  const upgradeScore = Math.min(98, Math.max(30, Math.round((performanceGapPercent * 0.4) + ((100 - batteryHealthEst) * 0.3) + (displayAndCameraGain * 0.3))));

  const shouldUpgrade = upgradeScore >= 65;

  return {
    currentDevice: {
      name: currentDeviceName || 'Current Device',
      ageYears: age,
      estimatedBatteryHealth: `${batteryHealthEst}%`,
    },
    targetProduct: {
      id: targetProduct.id,
      name: targetProduct.name,
      price: targetProduct.currentPrice,
    },
    metrics: {
      performanceImprovement: `+${performanceGapPercent}%`,
      batteryLifeImprovement: `+${Math.round((100 - batteryHealthEst) * 1.3)}% runtime`,
      featureGenerationalGain: `+${displayAndCameraGain}%`,
      upgradeScore: upgradeScore, // out of 100
    },
    verdict: shouldUpgrade ? 'UPGRADE' : 'KEEP CURRENT DEVICE',
    verdictTitle: shouldUpgrade ? 'Strong Upgrade Justification' : 'Hold Off - Minor Generational Jump',
    reasoning: shouldUpgrade
      ? `Upgrading from your ${age}-year-old device will deliver a massive +${performanceGapPercent}% performance jump and restore full battery endurance. The upgrade cost of ₹${targetProduct.currentPrice.toLocaleString()} is well justified.`
      : `Your current device is only ~${age} year(s) old and retains solid performance. The generational leap does not justify spending ₹${targetProduct.currentPrice.toLocaleString()} today.`
  };
}

module.exports = {
  calculateProductScore,
  compareProducts,
  calculateUpgradeComparison,
};

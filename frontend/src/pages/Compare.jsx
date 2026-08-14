import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Scale, 
  Sparkles, 
  Trophy, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  ShieldAlert, 
  ArrowRight, 
  Layers, 
  ChevronDown, 
  Info,
  Loader2,
  X
} from 'lucide-react';
import { productsApi, compareApi } from '../services/api';
import ProductDnaRadar from '../components/ProductDnaRadar';
import VerdictBadge from '../components/VerdictBadge';

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic user weights for personalized scoring
  const [weights, setWeights] = useState({
    price: 30,
    performance: 25,
    battery: 15,
    durability: 15,
    camera: 10,
    portability: 5,
  });

  const [showWeightPanel, setShowWeightPanel] = useState(false);

  useEffect(() => {
    productsApi.getAll()
      .then((res) => {
        setAllProducts(res.data);
        
        // Extract query params p1, p2, p3, p4
        const p1 = searchParams.get('p1');
        const p2 = searchParams.get('p2');
        const p3 = searchParams.get('p3');

        let ids = [];
        if (p1) ids.push(p1);
        if (p2) ids.push(p2);
        if (p3) ids.push(p3);

        if (ids.length < 2 && res.data.length >= 2) {
          // Default compare first 2 products
          ids = [res.data[0].id, res.data[1].id];
        }

        setSelectedProductIds(ids);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedProductIds.length >= 2) {
      fetchComparison(selectedProductIds, weights);
    }
  }, [selectedProductIds, weights]);

  const fetchComparison = async (ids, currentWeights) => {
    setLoading(true);
    try {
      const res = await compareApi.compare({
        productIds: ids,
        weights: currentWeights,
      });
      setComparisonData(res.data);
    } catch (err) {
      console.error('Comparison fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (index, newId) => {
    const updated = [...selectedProductIds];
    updated[index] = newId;
    setSelectedProductIds(updated);
  };

  const addProductSlot = () => {
    if (selectedProductIds.length >= 4) return;
    const available = allProducts.find(p => !selectedProductIds.includes(p.id));
    if (available) {
      setSelectedProductIds([...selectedProductIds, available.id]);
    }
  };

  const removeProductSlot = (index) => {
    if (selectedProductIds.length <= 2) {
      alert('You must compare at least 2 products.');
      return;
    }
    const updated = selectedProductIds.filter((_, idx) => idx !== index);
    setSelectedProductIds(updated);
  };

  const handleWeightChange = (key, value) => {
    setWeights(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">
            <Scale className="w-4 h-4" /> AI Comparative Decision Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Multi-Product Intelligence Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Evaluating hardware durability, real TCO costs, omitted specs, and personalized weight priorities.
          </p>
        </div>

        {/* Action button to customize weights */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWeightPanel(!showWeightPanel)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              showWeightPanel
                ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Customize Weights ({Object.values(weights).reduce((a, b) => a + b, 0)}%)</span>
          </button>
          {selectedProductIds.length < 4 && (
            <button
              onClick={addProductSlot}
              className="px-3.5 py-2 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
            >
              + Add 3rd Product
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Weight Adjustment Panel */}
      {showWeightPanel && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <h3 className="font-bold text-slate-900 text-sm">Personalized AI Weight Sliders</h3>
            </div>
            <span className="text-xs font-medium text-slate-500">
              Drag sliders to adjust what matters most to your workflow.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {Object.keys(weights).map((key) => (
              <div key={key} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between font-semibold text-slate-700 capitalize">
                  <span>{key} Weight</span>
                  <span className="text-brand-600 font-bold">{weights[key]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights[key]}
                  onChange={(e) => handleWeightChange(key, e.target.value)}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Selectors Bar */}
      <div className={`grid grid-cols-1 md:grid-cols-${selectedProductIds.length} gap-4`}>
        {selectedProductIds.map((id, index) => {
          const prod = allProducts.find(p => p.id === id);
          return (
            <div key={index} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 font-extrabold flex items-center justify-center text-xs shrink-0">
                  {String.fromCharCode(65 + index)}
                </div>
                <select
                  value={id}
                  onChange={(e) => handleProductSelect(index, e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-transparent focus:outline-none truncate"
                >
                  {allProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.currentPrice?.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
              {selectedProductIds.length > 2 && (
                <button
                  onClick={() => removeProductSlot(index)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Calculating dynamic weight composite scores...</p>
        </div>
      ) : comparisonData ? (
        <div className="space-y-8">
          
          {/* 1. OVERALL WINNER & MARGINAL VALUE HERO CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Overall Recommendation Winner
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {comparisonData.overallWinnerName}
                  </h2>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-400">
                  {comparisonData.overallWinnerScore}
                </span>
                <span className="text-xs text-slate-400 font-semibold">/ 100 Composite Score</span>
              </div>
            </div>

            {/* Marginal Value of Money calculation */}
            {comparisonData.marginalValueAnalysis && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-brand-300 font-bold uppercase tracking-wider">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Marginal Value of Money Analysis</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {comparisonData.marginalValueAnalysis.recommendationText}
                </p>
                <p className="text-slate-400 text-[11px]">
                  <strong>Value Ratio:</strong> {comparisonData.marginalValueAnalysis.marginalRatioText}
                </p>
              </div>
            )}
          </div>

          {/* 2. CATEGORY WINNERS TILES */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-lg">Category Winner Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.keys(comparisonData.categoryWinners || {}).map((cat) => {
                const item = comparisonData.categoryWinners[cat];
                return (
                  <div key={cat} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-soft space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span>{cat} Winner</span>
                      <span className="text-amber-500">🏆</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate" title={item.productName}>
                      {item.productName}
                    </p>
                    <p className="text-xs text-emerald-600 font-semibold">{item.metric}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. PRODUCT DNA RADAR COMPARISON */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Product DNA Comparison</h3>
                <p className="text-xs text-slate-500">Multi-axis balance of performance, durability, repairability, and longevity</p>
              </div>
            </div>
            <ProductDnaRadar
              dnaData={comparisonData.products[0]?.dna}
              productName={comparisonData.products[0]?.name}
              comparisonDna={comparisonData.products[1]?.dna}
              comparisonName={comparisonData.products[1]?.name}
            />
          </div>

          {/* 4. SPECIFICATION COMPARISON MATRIX TABLE */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg">Specification & Intelligence Matrix</h3>
              <span className="text-xs text-slate-400">Verified & Extracted Parameters</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="p-4 font-bold w-1/4">Parameter</th>
                    {comparisonData.products.map((p, idx) => (
                      <th key={p.id} className="p-4 font-bold">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Verdict Row */}
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">AI Verdict</td>
                    {comparisonData.products.map(p => (
                      <td key={p.id} className="p-4">
                        <VerdictBadge verdict={p.buyVerdict} confidence={p.decisionConfidence} size="sm" />
                      </td>
                    ))}
                  </tr>

                  {/* Listed Price */}
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Listed Price</td>
                    {comparisonData.products.map(p => (
                      <td key={p.id} className="p-4 font-extrabold text-slate-900 text-sm">
                        ₹{p.currentPrice?.toLocaleString()}
                      </td>
                    ))}
                  </tr>

                  {/* Estimated Real Cost */}
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Estimated Real Cost (TCO)</td>
                    {comparisonData.products.map(p => (
                      <td key={p.id} className="p-4 font-bold text-indigo-600">
                        ₹{p.productAnalysis?.totalEstimatedRealCost?.toLocaleString() || p.currentPrice?.toLocaleString()}
                      </td>
                    ))}
                  </tr>

                  {/* Future-Proof Score */}
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Future-Proof Score</td>
                    {comparisonData.products.map(p => (
                      <td key={p.id} className="p-4 font-bold text-emerald-600">
                        {p.futureProofScore} / 100
                      </td>
                    ))}
                  </tr>

                  {/* Listing Completeness */}
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Listing Completeness</td>
                    {comparisonData.products.map(p => (
                      <td key={p.id} className="p-4 font-semibold text-slate-700">
                        {p.listingCompletenessScore} / 100
                      </td>
                    ))}
                  </tr>

                  {/* Regret Risk */}
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Post-Purchase Regret Risk</td>
                    {comparisonData.products.map(p => (
                      <td key={p.id} className="p-4 font-semibold">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] ${
                          p.regretRisk === 'LOW' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {p.regretRisk} RISK
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="p-4 font-bold text-slate-700 bg-slate-50/50">Verified User Rating</td>
                    {comparisonData.products.map(p => (
                      <td key={p.id} className="p-4 font-semibold text-slate-800">
                        ★ {p.rating} ({p.reviewCount} reviews)
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Matrix CTA Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Want to ask deeper specific questions about these products?
              </span>
              <Link
                to={`/assistant?p1=${comparisonData.products[0]?.id}&p2=${comparisonData.products[1]?.id}`}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Open in AI Chat Assistant →
              </Link>
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}

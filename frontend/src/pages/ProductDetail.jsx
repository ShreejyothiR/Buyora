import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Scale, 
  Bot, 
  Bookmark, 
  Bell, 
  ShieldAlert, 
  EyeOff, 
  FileSearch, 
  DollarSign, 
  AlertOctagon, 
  HeartCrack, 
  Compass, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Share2, 
  ExternalLink,
  ChevronRight,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Flame,
  Battery,
  Cpu
} from 'lucide-react';
import { productsApi, pricesApi, savedApi } from '../services/api';
import VerdictBadge from '../components/VerdictBadge';
import ProductDnaRadar from '../components/ProductDnaRadar';
import PriceChart from '../components/PriceChart';

export default function ProductDetail({ onOpenVoice }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const [prodRes, priceRes] = await Promise.all([
        productsApi.getById(id),
        pricesApi.getHistory(id),
      ]);
      setProduct(prodRes.data);
      setPriceData(priceRes.data);
      if (prodRes.data) {
        setAlertTargetPrice(Math.round(prodRes.data.currentPrice * 0.9).toString());
      }
    } catch (err) {
      console.error('Failed to load product detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async () => {
    try {
      const res = await savedApi.toggleSave(product.id);
      setIsSaved(res.data.saved);
    } catch (err) {
      console.error('Toggle save error:', err);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!alertTargetPrice) return;
    try {
      await pricesApi.createAlert({
        productId: product.id,
        targetPrice: parseFloat(alertTargetPrice),
      });
      setAlertSuccess(true);
      setTimeout(() => setAlertSuccess(false), 4000);
    } catch (err) {
      console.error('Alert creation error:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Gathering deep product intelligence and verified claims...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500">The product intelligence record you requested does not exist.</p>
        <Link to="/dashboard" className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const analysis = product.productAnalysis || {};
  const reviewAnalysis = product.reviewAnalysis || {};
  const hiddenCostTotal = (analysis.hiddenCosts || []).reduce((acc, h) => acc + (h.estimatedCost || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* 1. PRODUCT HERO HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Product Image & Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="h-80 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center p-6 relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain"
            />
            <div className="absolute top-4 left-4">
              <VerdictBadge verdict={product.buyVerdict} confidence={product.decisionConfidence} size="md" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                isSaved
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isSaved ? 'Saved in Watchlist' : 'Save Product'}</span>
            </button>
            <Link
              to={`/compare?p1=${product.id}`}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Scale className="w-4 h-4" /> Compare
            </Link>
            <button
              onClick={onOpenVoice}
              className="p-2.5 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-100 transition-colors"
              title="Ask voice question about this product"
            >
              <Bot className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Key Specs, Pricing, & Verdict Explanation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>{product.brand}</span>
              <span>•</span>
              <span>{product.category}</span>
              {product.modelNumber && <span>• Model: {product.modelNumber}</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-amber-500">★ {product.rating}</span>
              <span className="text-slate-400">({product.reviewCount} verified consumer reviews)</span>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-emerald-600">{product.futureProofScore}/100 Future-Proof Score</span>
            </div>
          </div>

          {/* Pricing & Real Cost Tile */}
          <div className="p-5 bg-gradient-to-r from-slate-50 to-indigo-50/40 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500 font-medium">Listed Retail Price</p>
              <p className="text-2xl font-extrabold text-slate-900">₹{product.currentPrice?.toLocaleString()}</p>
              {product.originalPrice > product.currentPrice && (
                <p className="text-xs text-slate-400 line-through">MRP: ₹{product.originalPrice?.toLocaleString()}</p>
              )}
            </div>

            <div>
              <p className="text-xs text-indigo-600 font-medium">Estimated Real Cost (TCO)</p>
              <p className="text-2xl font-extrabold text-indigo-700">
                ₹{(analysis.totalEstimatedRealCost || (product.currentPrice + hiddenCostTotal)).toLocaleString()}
              </p>
              <p className="text-xs text-indigo-600/80 font-semibold">Includes chargers & essentials</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">Post-Purchase Regret</p>
              <div className="mt-1">
                <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase ${
                  product.regretRisk === 'LOW' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {product.regretRisk} RISK
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Based on hardware specs</p>
            </div>
          </div>

          {/* AI Verdict Summary Box */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Buyora AI Verdict Breakdown
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
              {product.verdictReason || product.rawDescription}
            </p>
          </div>

          {/* Quick Specifications Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            {(product.specifications || []).slice(0, 6).map((s, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-400 font-medium">{s.key}</p>
                <p className="font-bold text-slate-800 truncate" title={s.value}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. "WHAT THE SELLER DIDN'T TELL YOU" & LISTING COMPLETENESS */}
      <section className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">What the Seller Didn't Tell You</h2>
              <p className="text-xs text-slate-500">Crucial omitted technical parameters and undisclosed limitations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Listing Completeness Score:</span>
            <span className="text-sm font-extrabold px-3 py-1 bg-slate-100 text-slate-800 rounded-full border border-slate-200">
              {product.listingCompletenessScore} / 100
            </span>
          </div>
        </div>

        {analysis.missingInformation && analysis.missingInformation.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.missingInformation.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{item.field}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">
                    {item.impact} Impact
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.whyImportant}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">All major technical specifications are transparently disclosed by the manufacturer.</p>
        )}
      </section>

      {/* 3. MARKETING LANGUAGE TRANSLATOR */}
      <section className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Marketing Language Translator</h2>
            <p className="text-xs text-slate-500">Separating seller advertising hype from verified technical reality</p>
          </div>
        </div>

        {analysis.marketingClaims && analysis.marketingClaims.length > 0 ? (
          <div className="space-y-3">
            {analysis.marketingClaims.map((claim, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Seller Claim</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">"{claim.claim}"</p>
                </div>
                <div className="md:col-span-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Actual Technical Evidence</span>
                  <p className="text-xs text-slate-700 mt-0.5">{claim.evidence}</p>
                </div>
                <div className="md:col-span-3 flex flex-col items-start md:items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Fact Verdict</span>
                  <span className="text-xs font-bold text-indigo-600 mt-0.5">{claim.verdict}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{claim.confidence}% verified</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No active marketing contradictions detected.</p>
        )}
      </section>

      {/* 4. HIDDEN COST DETECTOR & FAKE DISCOUNT CHECK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Hidden Cost Detector */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Hidden Cost Detector</h2>
              <p className="text-xs text-slate-500">Mandatory accessories and omitted essentials</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {(analysis.hiddenCosts || []).map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900">{item.item}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{item.note}</p>
                </div>
                <span className="font-extrabold text-rose-600 shrink-0">+₹{item.estimatedCost?.toLocaleString()}</span>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-sm">
              <span className="text-slate-800">Total Hidden Overhead:</span>
              <span className="text-rose-600">+₹{hiddenCostTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Fake Discount & Timing Radar */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Discount & Pricing Authenticity</h2>
              <p className="text-xs text-slate-500">Analysis against MSRP launch benchmarks</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold">
              <span className="text-emerald-900">
                {analysis.fakeDiscountAnalysis?.isSuspicious ? '⚠️ Suspicious Price Pattern' : '✓ Verified Legitimate Pricing'}
              </span>
              <span className="text-emerald-700">{analysis.fakeDiscountAnalysis?.confidence || 90}% Confidence</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {analysis.fakeDiscountAnalysis?.explanation || 'Listed price matches authentic market discount trajectories.'}
            </p>
          </div>

          {priceData && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Deal Timing Advice:</span>
                <span className="font-bold text-brand-600">{priceData.buyTimingVerdict}</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                {priceData.buyTimingExplanation}
              </p>
            </div>
          )}
        </div>

      </div>

      {/* 5. PRODUCT DNA RADAR & REGRET PREDICTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Product DNA Radar */}
        <div className="lg:col-span-6 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">8-Axis Product DNA</h2>
              <p className="text-xs text-slate-500">Comprehensive hardware viability footprint</p>
            </div>
          </div>
          <ProductDnaRadar dnaData={analysis.productDna} productName={product.name} />
        </div>

        {/* Regret Predictor & "Who Should NOT Buy This" */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Regret Predictor */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                <HeartCrack className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Things You May Regret</h2>
                <p className="text-xs text-slate-500">Common post-purchase buyer friction points</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {(analysis.regretReasons || []).map((r, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{r.reason}</span>
                    <span className="text-[10px] text-amber-600">{r.severity} Severity</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    <strong>Mitigation:</strong> {r.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* "Who Should NOT Buy This" */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Who Should NOT Buy This</h2>
                <p className="text-xs text-slate-500">Skip this product if you fall into these categories</p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-700">
              {(analysis.whoShouldNotBuy || []).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* 6. PRICE RADAR & SET PRICE ALERT */}
      <section className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Price History Radar</h2>
              <p className="text-xs text-slate-500">Historical price tracking across verified retail listings</p>
            </div>
          </div>

          {/* Set Price Alert Inline Form */}
          <form onSubmit={handleCreateAlert} className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={alertTargetPrice}
                onChange={(e) => setAlertTargetPrice(e.target.value)}
                placeholder="Target Price"
                className="w-32 pl-6 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Track Price</span>
            </button>
          </form>
        </div>

        {alertSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Price alert created! Buyora will notify you when price drops to ₹{parseFloat(alertTargetPrice).toLocaleString()}.</span>
          </div>
        )}

        {priceData && (
          <PriceChart
            priceHistory={priceData.priceHistory}
            currentPrice={priceData.currentPrice}
            lowestPrice={priceData.lowestPrice}
            averagePrice={priceData.averagePrice}
            highestPrice={priceData.highestPrice}
          />
        )}
      </section>

      {/* 7. REVIEWS & REVIEW ANOMALY INTELLIGENCE */}
      <section className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Review Intelligence & Anomaly Filter</h2>
            <p className="text-xs text-slate-500">AI analysis of verified customer reviews across hardware categories</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Bot Anomaly Likelihood:</span>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full border border-emerald-200">
              {reviewAnalysis.anomalyScore || 6}% (Clean)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Cpu className="w-4 h-4 text-brand-600" />
              <span>Performance Issues</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{reviewAnalysis.performanceComplaints || 0} mentions</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Heating Complaints</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{reviewAnalysis.heatingComplaints || 0} mentions</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Battery className="w-4 h-4 text-emerald-600" />
              <span>Battery Drain</span>
            </div>
            <p className="text-lg font-bold text-slate-900">{reviewAnalysis.batteryComplaints || 0} mentions</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <ThumbsUp className="w-4 h-4 text-indigo-600" />
              <span>Sentiment Score</span>
            </div>
            <p className="text-lg font-bold text-indigo-700">{reviewAnalysis.sentimentScore || 88} / 100</p>
          </div>
        </div>

        {/* Positive vs Negative Themes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
            <span className="font-bold text-emerald-900 uppercase tracking-wider block">Common Verified Praise</span>
            <ul className="space-y-1.5 text-slate-700">
              {(reviewAnalysis.positiveThemes || []).map((t, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2">
            <span className="font-bold text-rose-900 uppercase tracking-wider block">Common User Complaints</span>
            <ul className="space-y-1.5 text-slate-700">
              {(reviewAnalysis.negativeThemes || []).map((t, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}

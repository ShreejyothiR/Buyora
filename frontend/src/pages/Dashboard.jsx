import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Scale, 
  Bot, 
  UploadCloud, 
  Mic, 
  Search, 
  Filter, 
  Bookmark, 
  Bell, 
  Layers, 
  ChevronRight, 
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { productsApi, savedApi, pricesApi, aiApi } from '../services/api';
import VerdictBadge from '../components/VerdictBadge';

export default function Dashboard({ onOpenUpload, onOpenVoice }) {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [verdictFilter, setVerdictFilter] = useState('All');
  const [sortBy, setSortBy] = useState('future_proof');

  // Stats & Widgets
  const [savedCount, setSavedCount] = useState(0);
  const [alertsCount, setAlertsCount] = useState(0);
  const [budgetAmount, setBudgetAmount] = useState('65000');
  const [budgetRecommendation, setBudgetRecommendation] = useState(null);
  const [isBudgetLoading, setIsBudgetLoading] = useState(false);

  // Selected products for quick comparison bar
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchUserStats();
    fetchBudgetRecommendation('65000');
  }, [selectedCategory, verdictFilter, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        verdict: verdictFilter !== 'All' ? verdictFilter : undefined,
        search: searchQuery.trim() || undefined,
        sort: sortBy,
      };
      const res = await productsApi.getAll(params);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (user) {
      try {
        const [savedRes, alertsRes] = await Promise.all([
          savedApi.getSaved(),
          pricesApi.getUserAlerts(),
        ]);
        setSavedCount(savedRes.data.length);
        setAlertsCount(alertsRes.data.length);
      } catch (e) {}
    }
  };

  const fetchBudgetRecommendation = async (amt) => {
    setIsBudgetLoading(true);
    try {
      const res = await aiApi.recommendByBudget({ budget: parseFloat(amt) || 50000 });
      setBudgetRecommendation(res.data);
    } catch (e) {
      console.warn('Budget recommendation error:', e);
    } finally {
      setIsBudgetLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const toggleCompare = (product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else {
      if (compareList.length >= 4) {
        alert('You can compare up to 4 products simultaneously.');
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  const categories = ['All', 'Smartphones', 'Laptops', 'Headphones', 'Smartwatches', 'Electronics'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner & Quick Launcher */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 text-white shadow-soft-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-300" />
            <span>Product Intelligence Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user ? user.name : 'Shopper'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-brand-100 max-w-xl leading-relaxed">
            Scan any product URL or screenshot, compare verified hardware specifications, or ask Buyora's AI assistant to find the best deal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl text-xs shadow-md transition-all hover:scale-105"
          >
            <UploadCloud className="w-4 h-4 text-brand-600" />
            <span>Scan Product</span>
          </button>
          <Link
            to="/compare"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-xs backdrop-blur-md border border-white/20 transition-all"
          >
            <Scale className="w-4 h-4 text-brand-200" />
            <span>Compare Matrix</span>
          </Link>
          <button
            onClick={onOpenVoice}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-950/40 hover:bg-indigo-950/60 text-white font-semibold rounded-xl text-xs backdrop-blur-md border border-white/20 transition-all"
          >
            <Mic className="w-4 h-4 text-brand-300" />
            <span>Voice Assistant</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Catalog Verified</span>
            <Layers className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{products.length}</p>
          <p className="text-[11px] text-slate-400">Products with AI DNA profiling</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Saved Shortlist</span>
            <Bookmark className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{savedCount}</p>
          <Link to="/saved" className="text-[11px] text-indigo-600 font-semibold hover:underline">
            View saved watchlist →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Price Alerts</span>
            <Bell className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{alertsCount}</p>
          <Link to="/prices" className="text-[11px] text-amber-600 font-semibold hover:underline">
            Track price radars →
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">AI Assistant</span>
            <Bot className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">Active</p>
          <Link to="/assistant" className="text-[11px] text-emerald-600 font-semibold hover:underline">
            Ask contextual questions →
          </Link>
        </div>
      </div>

      {/* Budget Optimization Interactive Widget */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50/60 via-white to-sky-50/60 border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-sm">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Budget Optimizer</h3>
              <p className="text-xs text-slate-500">Enter your target budget to calculate maximum future-proof value</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">My Budget:</span>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
              <input
                type="number"
                step="5000"
                value={budgetAmount}
                onChange={(e) => {
                  setBudgetAmount(e.target.value);
                  fetchBudgetRecommendation(e.target.value);
                }}
                className="w-36 pl-6 pr-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {budgetRecommendation && budgetRecommendation.bestValueAtBudget && (
          <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md uppercase tracking-wider">
                Best Value At ₹{parseFloat(budgetAmount).toLocaleString()}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">
                {budgetRecommendation.bestValueAtBudget.name}
              </h4>
              <p className="text-xs text-slate-600">
                {budgetRecommendation.recommendationSummary}
              </p>
            </div>
            <Link
              to={`/product/${budgetRecommendation.bestValueAtBudget.id}`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
            >
              Inspect Intelligence →
            </Link>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter brand or model..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </form>

          <div className="flex items-center gap-2">
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="All">All Verdicts</option>
              <option value="BUY">🟢 BUY</option>
              <option value="WAIT">🟡 WAIT</option>
              <option value="AVOID">🔴 AVOID</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="future_proof">Future-Proof Score</option>
              <option value="completeness">Listing Completeness</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">User Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Drawer Bar (Sticky bottom if items selected) */}
      {compareList.length > 0 && (
        <div className="sticky bottom-6 z-30 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-300 shrink-0">
              <Scale className="w-4 h-4" />
              <span>Comparing ({compareList.length}/4):</span>
            </div>
            <div className="flex items-center gap-2">
              {compareList.map((p) => (
                <div key={p.id} className="flex items-center gap-2 bg-white/10 px-2.5 py-1 rounded-lg text-xs">
                  <span className="max-w-[120px] truncate">{p.name}</span>
                  <button onClick={() => toggleCompare(p)} className="text-slate-400 hover:text-white">✕</button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <Link
              to={`/compare?${compareList.map((p, i) => `p${i+1}=${p.id}`).join('&')}`}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors"
            >
              Run AI Compare →
            </Link>
          </div>
        </div>
      )}

      {/* Product Intelligence Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-2xl bg-white border border-slate-200 animate-pulse p-6 space-y-4">
              <div className="h-44 bg-slate-100 rounded-xl" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No products found matching filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords or scan a new product listing using our AI OCR scanner.
          </p>
          <button
            onClick={onOpenUpload}
            className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700"
          >
            Scan New Product Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const isComparing = compareList.some(item => item.id === p.id);
            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-brand-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <VerdictBadge verdict={p.buyVerdict} confidence={p.decisionConfidence} size="sm" showConfidence={false} />
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-white/90 backdrop-blur-md text-slate-700 rounded-full border border-slate-200 shadow-sm">
                        {p.futureProofScore}/100 Future-Proof
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                        <span>{p.brand}</span>
                        <span>★ {p.rating} ({p.reviewCount || 0})</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                    </div>

                    {/* Price and Real Cost */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-baseline justify-between">
                        <span className="text-slate-500 font-medium">List Price:</span>
                        <span className="text-base font-extrabold text-slate-900">₹{p.currentPrice?.toLocaleString()}</span>
                      </div>
                      {p.productAnalysis?.totalEstimatedRealCost && (
                        <div className="flex items-baseline justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">Real Cost (TCO):</span>
                          <span className="font-bold text-indigo-600">
                            ₹{p.productAnalysis.totalEstimatedRealCost?.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Key Omission / Fluff Alert */}
                    {p.productAnalysis?.missingInformation && p.productAnalysis.missingInformation.length > 0 && (
                      <div className="text-[11px] text-amber-800 bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 line-clamp-2">
                        <strong>Omission:</strong> {p.productAnalysis.missingInformation[0].field} ({p.productAnalysis.missingInformation[0].whyImportant})
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-6 pt-0 border-t border-slate-100 flex items-center gap-2">
                  <Link
                    to={`/product/${p.id}`}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Deep Intelligence
                  </Link>

                  <button
                    onClick={() => toggleCompare(p)}
                    className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                      isComparing
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-600'
                    }`}
                    title={isComparing ? 'Remove from compare' : 'Add to compare'}
                  >
                    <Scale className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

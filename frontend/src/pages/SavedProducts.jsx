import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, Scale, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { savedApi } from '../services/api';
import VerdictBadge from '../components/VerdictBadge';

export default function SavedProducts() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await savedApi.getSaved();
      setSavedItems(res.data);
    } catch (err) {
      console.error('Failed to load saved products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await savedApi.toggleSave(productId);
      setSavedItems(savedItems.filter(item => item.product.id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
          <Bookmark className="w-4 h-4" /> Personal Watchlist
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Saved Products & Comparison Shortlist
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track intelligence updates, price movements, and launch comparisons from your bookmarked items.
        </p>
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Loading saved intelligence records...</p>
        </div>
      ) : savedItems.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">No saved products in your shortlist</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Bookmark products from the explore catalog or after running an AI extraction to monitor them here.
          </p>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 inline-block transition-colors shadow-md"
          >
            Explore Verified Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map((item) => {
            const p = item.product;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="h-44 bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 left-3">
                      <VerdictBadge verdict={p.buyVerdict} confidence={p.decisionConfidence} size="sm" showConfidence={false} />
                    </div>
                    <button
                      onClick={() => handleRemove(p.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-400 hover:text-rose-600 shadow-sm transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{p.brand} • {p.category}</span>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5 group-hover:text-indigo-600 transition-colors">
                        {p.name}
                      </h3>
                    </div>

                    <div className="flex items-baseline justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="text-base font-extrabold text-slate-900">₹{p.currentPrice?.toLocaleString()}</span>
                      <span className="text-emerald-600 font-semibold">{p.futureProofScore}/100 Future-Proof</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center gap-2">
                  <Link
                    to={`/product/${p.id}`}
                    className="flex-1 py-2 text-center text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    View Intelligence
                  </Link>
                  <Link
                    to={`/compare?p1=${p.id}`}
                    className="p-2 bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                    title="Compare this product"
                  >
                    <Scale className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

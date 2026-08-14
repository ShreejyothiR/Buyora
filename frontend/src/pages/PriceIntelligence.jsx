import React, { useState, useEffect } from 'react';
import { 
  LineChart as ChartIcon, 
  Sparkles, 
  Bell, 
  TrendingDown, 
  Trash2, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { productsApi, pricesApi } from '../services/api';
import PriceChart from '../components/PriceChart';

export default function PriceIntelligence() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [priceData, setPriceData] = useState(null);
  const [userAlerts, setUserAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New alert form
  const [targetPrice, setTargetPrice] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  useEffect(() => {
    productsApi.getAll()
      .then((res) => {
        setProducts(res.data);
        if (res.data.length > 0) {
          setSelectedProductId(res.data[0].id);
        }
      })
      .catch((err) => console.error(err));

    fetchUserAlerts();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      fetchPriceHistory(selectedProductId);
    }
  }, [selectedProductId]);

  const fetchPriceHistory = async (pId) => {
    setLoading(true);
    try {
      const res = await pricesApi.getHistory(pId);
      setPriceData(res.data);
      setTargetPrice(Math.round(res.data.currentPrice * 0.9).toString());
    } catch (err) {
      console.error('Failed to fetch price history:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAlerts = async () => {
    try {
      const res = await pricesApi.getUserAlerts();
      setUserAlerts(res.data);
    } catch (e) {}
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    if (!targetPrice) return;
    try {
      await pricesApi.createAlert({
        productId: selectedProductId,
        targetPrice: parseFloat(targetPrice),
      });
      setAlertSuccess(true);
      fetchUserAlerts();
      setTimeout(() => setAlertSuccess(false), 4000);
    } catch (err) {
      console.error('Create alert error:', err);
    }
  };

  const handleDeleteAlert = async (id) => {
    try {
      await pricesApi.deleteAlert(id);
      setUserAlerts(userAlerts.filter(a => a.id !== id));
    } catch (err) {
      console.error('Delete alert error:', err);
    }
  };

  const currentProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">
            <ChartIcon className="w-4 h-4" /> Price Intelligence & Timing Radar
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Price History & Drop Watchdog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Evaluating historical discount trajectories and setting automated price triggers.
          </p>
        </div>

        {/* Product Selector */}
        <div className="sm:w-72">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none shadow-sm"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name} (₹{p.currentPrice?.toLocaleString()})</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Retrieving historical price points across retail channels...</p>
        </div>
      ) : priceData ? (
        <div className="space-y-8">
          
          {/* Main Price Analysis & Chart Card */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
            
            {/* Advice Banner */}
            <div className="p-5 bg-gradient-to-r from-brand-50 to-indigo-50 rounded-2xl border border-brand-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-600" /> AI Timing Verdict
                </span>
                <h3 className="text-base font-bold text-slate-900">{priceData.buyTimingVerdict}</h3>
                <p className="text-xs text-slate-600 max-w-xl">{priceData.buyTimingExplanation}</p>
              </div>

              {/* Set Alert Trigger */}
              <form onSubmit={handleCreateAlert} className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-32 pl-6 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Set Alert</span>
                </button>
              </form>
            </div>

            {alertSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Price drop trigger activated! You will receive updates when price touches ₹{parseFloat(targetPrice).toLocaleString()}.</span>
              </div>
            )}

            {/* Interactive Recharts Line Chart */}
            <PriceChart
              priceHistory={priceData.priceHistory}
              currentPrice={priceData.currentPrice}
              lowestPrice={priceData.lowestPrice}
              averagePrice={priceData.averagePrice}
              highestPrice={priceData.highestPrice}
            />
          </div>

          {/* Active User Price Alerts Watchlist */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Your Active Price Radars</h3>
              <span className="text-xs text-slate-400">{userAlerts.length} active monitors</span>
            </div>

            {userAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                You have no active price alerts configured. Set target thresholds above to get notified on sudden price drops.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {userAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                    <div className="space-y-1 truncate">
                      <p className="font-bold text-slate-900 truncate">{alert.product?.name || 'Product'}</p>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <span>Current: ₹{alert.currentPrice?.toLocaleString()}</span>
                        <span>•</span>
                        <span className="font-bold text-emerald-600">Target: ₹{alert.targetPrice?.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="Remove Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      ) : null}

    </div>
  );
}

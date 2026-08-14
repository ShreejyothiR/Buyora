import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Battery, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Loader2,
  Layers
} from 'lucide-react';
import { productsApi } from '../services/api';

export default function UpgradeCalculator() {
  const [products, setProducts] = useState([]);
  const [targetProductId, setTargetProductId] = useState('');
  const [currentDeviceName, setCurrentDeviceName] = useState('iPhone 12 Pro (2020)');
  const [currentDeviceYear, setCurrentDeviceYear] = useState('2020');
  const [currentDeviceCategory, setCurrentDeviceCategory] = useState('Smartphones');
  
  const [calculationResult, setCalculationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    productsApi.getAll()
      .then((res) => {
        setProducts(res.data);
        if (res.data.length > 0) {
          setTargetProductId(res.data[0].id);
          // Run default calculation
          calculate(res.data[0].id, 'iPhone 12 Pro (2020)', '2020', 'Smartphones');
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const calculate = async (tId, name, yr, cat) => {
    setLoading(true);
    try {
      const res = await productsApi.compareUpgrade({
        targetProductId: tId,
        currentDeviceName: name,
        currentDeviceYear: yr,
        currentDeviceCategory: cat,
      });
      setCalculationResult(res.data);
    } catch (err) {
      console.error('Upgrade calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateSubmit = (e) => {
    e.preventDefault();
    calculate(targetProductId, currentDeviceName, currentDeviceYear, currentDeviceCategory);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
          <TrendingUp className="w-4 h-4" /> Generational Delta Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Upgrade vs Buy New Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Determine if upgrading from your existing device provides measurable real-world value or if you should keep it.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft">
        <form onSubmit={handleCalculateSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Your Current Device Name</label>
            <input
              type="text"
              required
              value={currentDeviceName}
              onChange={(e) => setCurrentDeviceName(e.target.value)}
              placeholder="e.g. MacBook Pro 2019"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Purchase Year</label>
            <select
              value={currentDeviceYear}
              onChange={(e) => setCurrentDeviceYear(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="2024">2024 (Under 1 year old)</option>
              <option value="2023">2023 (~1-2 years old)</option>
              <option value="2022">2022 (~2-3 years old)</option>
              <option value="2021">2021 (~3-4 years old)</option>
              <option value="2020">2020 (~4-5 years old)</option>
              <option value="2019">2019 or earlier (5+ years old)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Device Category</label>
            <select
              value={currentDeviceCategory}
              onChange={(e) => setCurrentDeviceCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Smartphones">Smartphones</option>
              <option value="Laptops">Laptops</option>
              <option value="Headphones">Headphones</option>
              <option value="Smartwatches">Smartwatches</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target New Product</label>
            <select
              value={targetProductId}
              onChange={(e) => setTargetProductId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (₹{p.currentPrice?.toLocaleString()})</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 md:col-span-4 flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all text-xs flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Calculate Upgrade Value</span>
            </button>
          </div>

        </form>
      </div>

      {/* Result Presentation */}
      {calculationResult && (
        <div className="space-y-6">
          
          {/* Main Verdict Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
            calculationResult.verdict === 'UPGRADE'
              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
              : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
          }`}>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white shadow-sm">
                <span className={`w-2 h-2 rounded-full ${calculationResult.verdict === 'UPGRADE' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>Verdict: {calculationResult.verdict}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {calculationResult.verdictTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 max-w-2xl leading-relaxed">
                {calculationResult.reasoning}
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center shrink-0 w-36">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Upgrade Value
              </span>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                {calculationResult.metrics.upgradeScore}
              </p>
              <span className="text-[11px] text-slate-500 font-semibold">/ 100 Score</span>
            </div>
          </div>

          {/* Generational Leap Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-slate-500 font-semibold">
                <span>CPU & GPU Performance</span>
                <Cpu className="w-4 h-4 text-brand-600" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-600">
                {calculationResult.metrics.performanceImprovement}
              </p>
              <p className="text-[11px] text-slate-400">Processing throughput delta</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-slate-500 font-semibold">
                <span>Battery & Thermal Efficiency</span>
                <Battery className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-2xl font-extrabold text-teal-600">
                {calculationResult.metrics.batteryLifeImprovement}
              </p>
              <p className="text-[11px] text-slate-400">Runtime recovery over aged cell</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-slate-500 font-semibold">
                <span>Display & Sensor Leap</span>
                <Zap className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-extrabold text-indigo-600">
                {calculationResult.metrics.featureGenerationalGain}
              </p>
              <p className="text-[11px] text-slate-400">Brightness, refresh rate & optics</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

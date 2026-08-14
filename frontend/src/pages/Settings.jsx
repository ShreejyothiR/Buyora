import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sliders, User, Shield, CheckCircle2, Save, Sparkles } from 'lucide-react';

export default function Settings() {
  const { user, updatePreferences } = useAuth();
  
  const [weights, setWeights] = useState({
    priceWeight: 25,
    performanceWeight: 25,
    batteryWeight: 15,
    cameraWeight: 10,
    durabilityWeight: 10,
    portabilityWeight: 5,
    gamingWeight: 5,
    longTermWeight: 5,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      setWeights({
        priceWeight: user.preferences.priceWeight || 25,
        performanceWeight: user.preferences.performanceWeight || 25,
        batteryWeight: user.preferences.batteryWeight || 15,
        cameraWeight: user.preferences.cameraWeight || 10,
        durabilityWeight: user.preferences.durabilityWeight || 10,
        portabilityWeight: user.preferences.portabilityWeight || 5,
        gamingWeight: user.preferences.gamingWeight || 5,
        longTermWeight: user.preferences.longTermWeight || 5,
      });
    }
  }, [user]);

  const handleSliderChange = (field, val) => {
    setWeights(prev => ({ ...prev, [field]: parseInt(val) }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updatePreferences(weights);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Save preferences error:', err);
    }
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + Number(b), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-widest mb-1">
          <Sliders className="w-4 h-4" /> Personalization
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          User Settings & Scoring Priorities
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Customize how Buyora weighs different hardware categories when generating recommendations.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-soft flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">{user?.name || 'Guest Shopper'}</h3>
          <p className="text-xs text-slate-500">{user?.email || 'demo@buyora.com'}</p>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1">
            <CheckCircle2 className="w-3 h-3" /> Independent Verified Account
          </span>
        </div>
      </div>

      {/* Priority Weight Adjuster */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Default Category Weights</h3>
            <p className="text-xs text-slate-500">These weights will automatically bias your future product comparisons</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
            totalWeight === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}>
            Total Weight: {totalWeight}% {totalWeight !== 100 && '(Normalized automatically)'}
          </span>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Preferences saved successfully! All comparison charts will now reflect these priorities.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {[
              { label: 'Price & Value Weight', field: 'priceWeight' },
              { label: 'Raw Performance Weight', field: 'performanceWeight' },
              { label: 'Battery Runtime Weight', field: 'batteryWeight' },
              { label: 'Camera & Video Optics', field: 'cameraWeight' },
              { label: 'Durability & Materials', field: 'durabilityWeight' },
              { label: 'Portability & Form Factor', field: 'portabilityWeight' },
              { label: 'Gaming & GPU Load', field: 'gamingWeight' },
              { label: 'Long-Term Software Support', field: 'longTermWeight' },
            ].map(({ label, field }) => (
              <div key={field} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between font-semibold text-slate-800">
                  <span>{label}</span>
                  <span className="font-bold text-brand-600">{weights[field]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights[field]}
                  onChange={(e) => handleSliderChange(field, e.target.value)}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Scoring Weights</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

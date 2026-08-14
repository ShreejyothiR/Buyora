import React from 'react';
import { Sparkles, Shield, Cpu, Lock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Buyora
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              AI-powered product intelligence engine built to protect consumers from misleading marketing, hidden costs, fake discounts, and post-purchase regret.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Independent & Consumer-First</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Intelligence Tools</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/compare" className="hover:text-brand-600 transition-colors">Multi-Product Comparison</Link></li>
              <li><Link to="/assistant" className="hover:text-brand-600 transition-colors">Context-Aware AI Assistant</Link></li>
              <li><Link to="/upgrade" className="hover:text-brand-600 transition-colors">Upgrade vs Buy New</Link></li>
              <li><Link to="/prices" className="hover:text-brand-600 transition-colors">Price Fluctuation Radar</Link></li>
            </ul>
          </div>

          {/* AI Features */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Core Analytics</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><span className="text-slate-500">Seller Fluff Translator</span></li>
              <li><span className="text-slate-500">Missing Spec Completeness Score</span></li>
              <li><span className="text-slate-500">Hidden Cost & Real TCO Detector</span></li>
              <li><span className="text-slate-500">Review Sentiment & Bot Anomaly</span></li>
              <li><span className="text-slate-500">Product DNA Radar Chart</span></li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Transparency</h4>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Zero Sponsored Bias</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Buyora ranks products purely using verifiable hardware metrics, verified review distributions, and user-defined weighting.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Buyora Intelligence Systems Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-slate-600">Google Gemini & Buyora AI Heuristics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

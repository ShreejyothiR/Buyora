import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Scale, 
  Bot, 
  ShieldAlert, 
  EyeOff, 
  TrendingDown, 
  MessageSquare, 
  FileSearch, 
  Compass, 
  AlertOctagon, 
  Mic, 
  LineChart, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight,
  Search,
  Zap,
  TrendingUp,
  Star
} from 'lucide-react';
import { productsApi } from '../services/api';
import VerdictBadge from '../components/VerdictBadge';

export default function Home({ onOpenUpload, onOpenVoice }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    productsApi.getAll()
      .then((res) => {
        setFeaturedProducts(res.data.slice(0, 4));
      })
      .catch((err) => console.error('Failed to load featured products:', err));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/dashboard');
    }
  };

  const featureCards = [
    {
      icon: Scale,
      title: 'AI Multi-Product Comparison',
      desc: 'Compare 2 to 4 devices simultaneously with dynamic personalized weighting based on what matters to you.',
      tag: 'Dynamic Matrix',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: EyeOff,
      title: 'What the Seller Didn\'t Tell You',
      desc: 'Discovers omitted specs like sustained brightness, soldered RAM, SSD speeds, and repair costs.',
      tag: 'Completeness Score',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: FileSearch,
      title: 'Marketing Claims Translator',
      desc: 'Translates hype like "Studio Audio" and "Military Grade" into verified technical reality and confidence %.',
      tag: 'Fact vs Hype',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: TrendingDown,
      title: 'Hidden Cost & Real TCO Detector',
      desc: 'Calculates chargers, adapters, glass shields, and subscriptions to reveal the true Total Cost of Ownership.',
      tag: 'Real Price',
      color: 'from-rose-500 to-red-500'
    },
    {
      icon: ShieldAlert,
      title: 'Fake & Misleading Discount Radar',
      desc: 'Evaluates baseline market prices and historical launch MSRPs to spot inflated "sale" discounts.',
      tag: 'Pricing Truth',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: MessageSquare,
      title: 'Review Intelligence & Bot Anomaly',
      desc: 'Extracts real heating, battery, and durability themes while flagging unnatural rating spikes and bot patterns.',
      tag: 'Sentiment Analytics',
      color: 'from-violet-500 to-indigo-500'
    },
    {
      icon: Compass,
      title: '8-Axis Product DNA Radar',
      desc: 'Visualizes Performance, Real Value, Durability, Portability, Innovation, Repairability, and Longevity.',
      tag: 'Visual Radar',
      color: 'from-sky-500 to-blue-600'
    },
    {
      icon: Zap,
      title: 'Future-Proof & Regret Predictor',
      desc: 'Scores multi-year hardware viability and highlights specific things you might regret post-purchase.',
      tag: 'Longevity Score',
      color: 'from-fuchsia-500 to-pink-500'
    },
    {
      icon: AlertOctagon,
      title: '"Who Should NOT Buy This?"',
      desc: 'Tells you upfront who this product is wrong for, preventing costly mismatched buying decisions.',
      tag: 'Risk Profiler',
      color: 'from-amber-600 to-rose-600'
    },
    {
      icon: TrendingUp,
      title: 'Upgrade vs Buy New Calculator',
      desc: 'Enter your current device and evaluate if the generational jump truly justifies spending extra cash today.',
      tag: 'Upgrade Delta',
      color: 'from-teal-500 to-emerald-600'
    },
    {
      icon: Mic,
      title: 'Conversational Voice Assistant',
      desc: 'Speak naturally to Buyora to query battery endurance, compare devices, or create price drop alerts.',
      tag: 'Web Speech STT/TTS',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      icon: LineChart,
      title: 'Price Fluctuation Intelligence',
      desc: 'Tracks price timelines with AI timing advice: "Good Time to Buy" vs "Wait for Upcoming Sale".',
      tag: 'Deal Timing',
      color: 'from-indigo-600 to-sky-500'
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        {/* Subtle Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-brand-100/50 via-indigo-100/40 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 shadow-sm text-xs font-semibold text-brand-700 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>AI Product Intelligence & Verification Platform</span>
          </div>

          {/* Main Headings */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Don't Just Compare Products. <br />
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 bg-clip-text text-transparent">
                Understand Them.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              AI-powered product intelligence that tells you what sellers don't: hidden costs, marketing hype translation, missing specs, future-proof scores, and regret risks.
            </p>
          </div>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-soft-lg rounded-2xl bg-white border border-slate-200/80 p-1.5 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search iPhone 15 Pro, S24 Ultra, MacBook M3, Sony XM5..."
                className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 transition-all shrink-0"
              >
                Search AI
              </button>
            </div>
          </form>

          {/* Call-to-action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/compare"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-lg shadow-slate-900/10 hover:scale-[1.02] transition-all"
            >
              <Scale className="w-4 h-4 text-brand-400" />
              Start Comparing
            </Link>
            <Link
              to="/assistant"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-semibold shadow-sm hover:scale-[1.02] transition-all"
            >
              <Bot className="w-4 h-4 text-indigo-600" />
              Ask AI Assistant
            </Link>
            <button
              onClick={onOpenVoice}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 text-sm font-semibold transition-all"
            >
              <Mic className="w-4 h-4 text-indigo-600" />
              Voice Query
            </button>
          </div>

          {/* Hero Visual Mockup Card */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 text-left relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 font-bold">
                    IQ
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Live AI Decision Matrix</h3>
                    <p className="text-xs text-slate-500">Samsung Galaxy S24 Ultra vs. Apple iPhone 15 Pro Max</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    ✓ 96% AI Decision Confidence
                  </span>
                </div>
              </div>

              {/* Matrix Preview Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                
                {/* Product A */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product A</span>
                    <VerdictBadge verdict="BUY" confidence={96} size="sm" showConfidence={false} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Samsung Galaxy S24 Ultra</h4>
                    <p className="text-xs text-slate-500">Snapdragon 8 Gen 3 • 200MP • 7yr OS Updates</p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Listed Price:</span>
                      <span className="font-bold text-slate-800">₹129,999</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Estimated Real Cost:</span>
                      <span className="font-bold text-indigo-600">₹136,097 (+₹6,098 in-box omissions)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Future-Proof Score:</span>
                      <span className="font-bold text-emerald-600">96 / 100 🏆 Category Winner</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Missing Info Detected:</span>
                      <span className="font-semibold text-amber-600">Galaxy AI free tier duration unspecified</span>
                    </div>
                  </div>
                </div>

                {/* Product B */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product B</span>
                    <VerdictBadge verdict="BUY" confidence={94} size="sm" showConfidence={false} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Apple iPhone 15 Pro Max</h4>
                    <p className="text-xs text-slate-500">Apple A17 Pro (3nm) • Grade 5 Titanium • ProRAW</p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Listed Price:</span>
                      <span className="font-bold text-slate-800">₹148,900</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Estimated Real Cost:</span>
                      <span className="font-bold text-indigo-600">₹158,328 (+₹9,428 fast charger + case)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/60">
                      <span className="text-slate-500">Video Capture:</span>
                      <span className="font-bold text-emerald-600">98 / 100 🏆 Category Winner</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Regret Risk:</span>
                      <span className="font-semibold text-slate-700">Slow 27W wired charging cap</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Summary Bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    <strong>Marginal Value Verdict:</strong> S24 Ultra saves ₹18,901 while offering identical 2024 flagship speed and 7-year software guarantee.
                  </span>
                </div>
                <Link
                  to="/compare"
                  className="text-brand-600 font-bold hover:text-brand-700 flex items-center gap-1 shrink-0"
                >
                  Run Full Comparison <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURE INTELLIGENCE SUITE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Deep Consumer Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            12 AI Capabilities That Protect Your Wallet
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Traditional comparison sites just show basic spec tables. Buyora investigates listings to uncover marketing illusions, omissions, and genuine long-term value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-brand-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-brand-600 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. HOW IT WORKS (5 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          
          <div className="max-w-3xl space-y-4 mb-12">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Seamless 5-Step Intelligence Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              From Raw Listing to Confident Purchase in Seconds
            </h2>
            <p className="text-sm text-slate-300">
              Upload a product URL, screenshot, image, or PDF. Buyora's neural parser extracts facts and generates actionable intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Upload or Enter', desc: 'Paste a product link, upload a screenshot, or drop a PDF spec sheet.' },
              { step: '02', title: 'AI Extraction', desc: 'Multimodal OCR extracts specifications and detects missing parameters.' },
              { step: '03', title: 'Deep Intelligence', desc: 'Translates marketing claims, calculates real costs, and checks discounts.' },
              { step: '04', title: 'Dynamic Compare', desc: 'Adjust personal weights (Battery vs Price vs Performance) in real time.' },
              { step: '05', title: 'Smart Recommendation', desc: 'Get a clear BUY / WAIT / AVOID verdict with quantified decision confidence.' },
            ].map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
                <span className="text-xs font-extrabold text-brand-400">{s.step}</span>
                <h4 className="font-bold text-white text-sm">{s.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-300 text-center sm:text-left">
              Ready to scan a product listing you're considering buying?
            </p>
            <button
              onClick={onOpenUpload}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all"
            >
              Scan a Product Listing Now
            </button>
          </div>

        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SHOWCASE */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Verified Intelligence Profiles
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Explore Popular Products
              </h2>
            </div>
            <Link
              to="/dashboard"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View Full Product Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-brand-300 transition-all overflow-hidden flex flex-col group"
              >
                <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <VerdictBadge verdict={p.buyVerdict} confidence={p.decisionConfidence} size="sm" showConfidence={false} />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{p.brand} • {p.category}</span>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {p.name}
                    </h3>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-extrabold text-slate-900">₹{p.currentPrice?.toLocaleString()}</span>
                      <span className="text-emerald-600 font-semibold">{p.futureProofScore}/100 Future-Proof</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {p.verdictReason || p.rawDescription}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      to={`/product/${p.id}`}
                      className="flex-1 py-2 text-center text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                    >
                      Deep Intelligence
                    </Link>
                    <Link
                      to={`/compare?p1=${p.id}`}
                      className="p-2 text-slate-600 hover:text-brand-600 bg-slate-100 hover:bg-brand-50 rounded-xl transition-colors"
                      title="Compare this product"
                    >
                      <Scale className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. TRUST & TRANSPARENCY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-50 via-white to-indigo-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-soft text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-brand-600 mx-auto shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              "AI doesn't just tell you what to buy. <br className="hidden sm:inline"/> It explains why."
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every Buyora recommendation is supported by quantified evidence: hardware thermal dissipation thresholds, verified review frequency distributions, missing spec completeness scores, and transparent marginal cost-to-benefit ratios.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Sponsored Bias</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multimodal Image & PDF OCR</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dynamic User Weights</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Speech Recognition & Synthesis</span>
          </div>
        </div>
      </section>

    </div>
  );
}

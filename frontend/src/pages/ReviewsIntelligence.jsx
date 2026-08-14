import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Flame, 
  Battery, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  Star,
  Loader2
} from 'lucide-react';
import { productsApi, reviewsApi } from '../services/api';

export default function ReviewsIntelligence() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  // New review form state
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('5');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    productsApi.getAll()
      .then((res) => {
        setProducts(res.data);
        if (res.data.length > 0) {
          setSelectedProductId(res.data[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      fetchReviews(selectedProductId);
    }
  }, [selectedProductId]);

  const fetchReviews = async (pId) => {
    setLoading(true);
    try {
      const res = await reviewsApi.getReviews(pId);
      setReviewData(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!author || !content) return;
    setIsSubmitting(true);

    try {
      await reviewsApi.addReview({
        productId: selectedProductId,
        author,
        rating: parseFloat(rating),
        title,
        content,
      });
      setSubmitSuccess(true);
      setAuthor('');
      setTitle('');
      setContent('');
      fetchReviews(selectedProductId);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error('Add review error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentProduct = products.find(p => p.id === selectedProductId);
  const analysis = reviewData?.reviewAnalysis || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
            <MessageSquare className="w-4 h-4" /> AI Sentiment & Anomaly Filter
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Review Intelligence Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Filtering bot spam, extracting real hardware failure rates, and aggregating praise themes.
          </p>
        </div>

        {/* Product Selector Dropdown */}
        <div className="sm:w-72">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none shadow-sm"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Analyzing reviewer syntax and anomaly clustering...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Sentiment Metric Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Overall Sentiment</span>
              <p className="text-2xl font-extrabold text-indigo-700">{analysis.sentimentScore || 88} / 100</p>
              <p className="text-[11px] text-slate-400">Weighted consumer approval</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Bot / Fake Anomaly Likelihood</span>
              <p className="text-2xl font-extrabold text-emerald-600">{analysis.anomalyScore || 6}%</p>
              <p className="text-[11px] text-emerald-600 font-medium">Clean organic distribution</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Thermal / Heating Issues</span>
              <p className="text-2xl font-extrabold text-rose-600">{analysis.heatingComplaints || 0}</p>
              <p className="text-[11px] text-slate-400">Mentions in user reports</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-soft space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Battery Drain Complaints</span>
              <p className="text-2xl font-extrabold text-amber-600">{analysis.batteryComplaints || 0}</p>
              <p className="text-[11px] text-slate-400">Mentions in user reports</p>
            </div>
          </div>

          {/* AI Synthesis Summary Card */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-50/70 to-brand-50/70 rounded-3xl border border-indigo-100 shadow-soft space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-slate-900 text-base">AI Executive Review Summary</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {analysis.summaryText || 'Based on comprehensive review analysis, verified consumers consistently praise ergonomic daily hand-feel and screen visibility, while citing minor concerns regarding charging speed accessories.'}
            </p>
          </div>

          {/* Praise Themes vs Complaint Themes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-emerald-700 font-bold text-sm">
                <ThumbsUp className="w-4 h-4" />
                <span>Verified Strengths & Praise Themes</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {(analysis.positiveThemes || []).map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 bg-emerald-50/50 rounded-xl">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-rose-700 font-bold text-sm">
                <ThumbsDown className="w-4 h-4" />
                <span>Common User Complaints & Friction</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {(analysis.negativeThemes || []).map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 bg-rose-50/50 rounded-xl">
                    <span className="text-rose-600 font-bold shrink-0">✕</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* User Review Submission Form */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Contribute Your Experience</h3>
            
            {submitSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Your verified feedback has been indexed by Buyora's sentiment parser.</span>
              </div>
            )}

            <form onSubmit={handleAddReview} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="5">★★★★★ (5/5) Exceptional</option>
                  <option value="4">★★★★☆ (4/5) Very Good</option>
                  <option value="3">★★★☆☆ (3/5) Average</option>
                  <option value="2">★★☆☆☆ (2/5) Disappointing</option>
                  <option value="1">★☆☆☆☆ (1/5) Poor</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solid performance, but charger omission is annoying"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Detailed Findings</label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share details on battery endurance, display legibility, and build quality..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors"
                >
                  {isSubmitting ? 'Posting Review...' : 'Submit Verified Review'}
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}

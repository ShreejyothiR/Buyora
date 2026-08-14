import React, { useState } from 'react';
import { 
  X, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  FileText, 
  Edit3, 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  UploadCloud
} from 'lucide-react';
import { aiApi, uploadApi, productsApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function UploadModal({ isOpen, onClose, onProductCreated }) {
  const [activeTab, setActiveTab] = useState('url'); // url, screenshot, image, pdf, manual
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [error, setError] = useState('');
  const [extractedPreview, setExtractedPreview] = useState(null);
  
  // Manual Form State
  const [manualData, setManualData] = useState({
    name: '',
    brand: '',
    category: 'Smartphones',
    currentPrice: '',
    originalPrice: '',
    rating: '4.5',
    rawDescription: '',
  });

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  const handleProcess = async () => {
    setError('');
    setIsProcessing(true);
    setAnalysisStatus('AI scanning input specifications & seller claims...');

    try {
      let extractedResult = null;

      if (activeTab === 'url') {
        if (!urlInput.trim()) {
          throw new Error('Please enter a valid product URL.');
        }
        setAnalysisStatus('Fetching listing and extracting technical parameters...');
        const res = await aiApi.extract({ url: urlInput, text: textInput });
        extractedResult = res.data;
      } else if (activeTab === 'screenshot' || activeTab === 'image' || activeTab === 'pdf') {
        if (!selectedFile) {
          throw new Error('Please select a file to upload.');
        }
        setAnalysisStatus('Multimodal OCR parsing specification table & marketing text...');
        const formData = new FormData();
        formData.append('file', selectedFile);
        const res = await uploadApi.uploadFile(formData);
        extractedResult = res.data.extractedData;
      } else if (activeTab === 'manual') {
        if (!manualData.name || !manualData.currentPrice) {
          throw new Error('Please provide at least a Product Name and Current Price.');
        }
        setAnalysisStatus('Generating Product DNA, regret risk & completeness scores...');
        const res = await aiApi.extract({ text: `${manualData.name} by ${manualData.brand}, Category: ${manualData.category}, Price: ₹${manualData.currentPrice}. Description: ${manualData.rawDescription}` });
        extractedResult = {
          ...res.data,
          name: manualData.name,
          brand: manualData.brand || res.data.brand,
          category: manualData.category,
          currentPrice: parseFloat(manualData.currentPrice),
          originalPrice: parseFloat(manualData.originalPrice) || parseFloat(manualData.currentPrice) * 1.15,
          rawDescription: manualData.rawDescription || res.data.rawDescription,
        };
      }

      setAnalysisStatus('Finalizing product intelligence metrics...');
      setExtractedPreview(extractedResult);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to process product intelligence.');
      setIsProcessing(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!extractedPreview) return;
    setIsProcessing(true);
    setAnalysisStatus('Saving verified product intelligence to database...');

    try {
      const res = await productsApi.create(extractedPreview);
      setIsProcessing(false);
      onClose();
      if (onProductCreated) onProductCreated(res.data);
      navigate(`/product/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to save product.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-500 text-white rounded-lg shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Scan & Add Product</h3>
              <p className="text-xs text-slate-500">Extract specifications, detect hidden costs, and translate claims</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!extractedPreview ? (
            <>
              {/* Input Method Tabs */}
              <div className="flex flex-wrap gap-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-medium">
                <button
                  onClick={() => { setActiveTab('url'); setError(''); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'url' ? 'bg-white text-brand-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" /> Product URL
                </button>
                <button
                  onClick={() => { setActiveTab('screenshot'); setError(''); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'screenshot' ? 'bg-white text-brand-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Screenshot OCR
                </button>
                <button
                  onClick={() => { setActiveTab('image'); setError(''); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'image' ? 'bg-white text-brand-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Photo Upload
                </button>
                <button
                  onClick={() => { setActiveTab('pdf'); setError(''); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'pdf' ? 'bg-white text-brand-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> PDF Spec Sheet
                </button>
                <button
                  onClick={() => { setActiveTab('manual'); setError(''); }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'manual' ? 'bg-white text-brand-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Manual Form
                </button>
              </div>

              {/* Tab Form Renderings */}
              {activeTab === 'url' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Product URL (Amazon, Flipkart, Brand Store, etc.)
                    </label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://www.amazon.in/dp/B0CX23VGP5 or https://store.apple.com/..."
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Additional Context or Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Paste product specs or highlights if available..."
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {(activeTab === 'screenshot' || activeTab === 'image' || activeTab === 'pdf') && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-brand-400 bg-slate-50/60 transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      accept={activeTab === 'pdf' ? 'application/pdf' : 'image/*'}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mb-1">
                        {selectedFile ? selectedFile.name : `Click to browse or drop ${activeTab.toUpperCase()} here`}
                      </p>
                      <p className="text-xs text-slate-400">
                        {activeTab === 'pdf' ? 'PDF specification document up to 15MB' : 'PNG, JPG, WEBP screenshots of product specs'}
                      </p>
                    </label>
                  </div>
                  {selectedFile && (
                    <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate font-medium">{selectedFile.name}</span>
                      </div>
                      <span className="text-[11px] text-emerald-600 shrink-0 font-semibold">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'manual' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title *</label>
                    <input
                      type="text"
                      value={manualData.name}
                      onChange={(e) => setManualData({ ...manualData, name: e.target.value })}
                      placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={manualData.brand}
                      onChange={(e) => setManualData({ ...manualData, brand: e.target.value })}
                      placeholder="e.g. Sony, Apple, Samsung"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={manualData.category}
                      onChange={(e) => setManualData({ ...manualData, category: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none"
                    >
                      <option value="Smartphones">Smartphones</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Headphones">Headphones & Audio</option>
                      <option value="Smartwatches">Smartwatches</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Price (₹) *</label>
                    <input
                      type="number"
                      value={manualData.currentPrice}
                      onChange={(e) => setManualData({ ...manualData, currentPrice: e.target.value })}
                      placeholder="e.g. 26990"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Original / MRP (₹)</label>
                    <input
                      type="number"
                      value={manualData.originalPrice}
                      onChange={(e) => setManualData({ ...manualData, originalPrice: e.target.value })}
                      placeholder="e.g. 34990"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Key Description or Specs</label>
                    <textarea
                      rows={2}
                      value={manualData.rawDescription}
                      onChange={(e) => setManualData({ ...manualData, rawDescription: e.target.value })}
                      placeholder="Processor, battery size, display specs, warranty..."
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* AI Processing Animation Banner */}
              {isProcessing && (
                <div className="mt-6 p-4 bg-brand-50/80 border border-brand-200 rounded-xl flex items-center gap-3 ai-pulse">
                  <Loader2 className="w-5 h-5 text-brand-600 animate-spin shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-brand-900">AI Extraction in progress</p>
                    <p className="text-brand-700">{analysisStatus}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Extracted Intelligence Preview */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    AI Extraction Successful
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-200/70 text-emerald-900 rounded-full">
                    {extractedPreview.decisionConfidence || 88}% Confidence
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900">{extractedPreview.name}</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Brand: <span className="font-semibold text-slate-800">{extractedPreview.brand}</span> | Category: <span className="font-semibold text-slate-800">{extractedPreview.category}</span>
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-slate-900">₹{extractedPreview.currentPrice?.toLocaleString()}</span>
                  {extractedPreview.originalPrice > extractedPreview.currentPrice && (
                    <span className="text-xs text-slate-400 line-through">₹{extractedPreview.originalPrice?.toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Extracted Specifications Summary */}
              {extractedPreview.specifications && extractedPreview.specifications.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Extracted Specifications</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {extractedPreview.specifications.slice(0, 6).map((s, i) => (
                      <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-slate-500 font-medium">{s.key}: </span>
                        <span className="text-slate-800 font-semibold">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hidden Costs Detected */}
              {extractedPreview.hiddenCosts && extractedPreview.hiddenCosts.length > 0 && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs">
                  <p className="font-bold text-amber-900 mb-1">
                    ⚠️ Detected Hidden Costs: ₹{extractedPreview.hiddenCosts.reduce((acc, h) => acc + (h.estimatedCost || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-amber-800 text-[11px]">
                    Estimated Real Cost of Ownership: ₹{extractedPreview.totalEstimatedRealCost?.toLocaleString()}
                  </p>
                </div>
              )}

              {isProcessing && (
                <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl flex items-center gap-2 text-xs text-brand-800">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                  <span>{analysisStatus}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              if (extractedPreview) setExtractedPreview(null);
              else onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            {extractedPreview ? '← Back / Re-scan' : 'Cancel'}
          </button>

          {!extractedPreview ? (
            <button
              disabled={isProcessing}
              onClick={handleProcess}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze with AI
                </>
              )}
            </button>
          ) : (
            <button
              disabled={isProcessing}
              onClick={handleSaveToDatabase}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Save & Open Product
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

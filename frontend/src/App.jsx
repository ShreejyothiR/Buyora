import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UploadModal from './components/UploadModal';
import VoiceAssistantModal from './components/VoiceAssistantModal';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Compare from './pages/Compare';
import ProductDetail from './pages/ProductDetail';
import AiAssistant from './pages/AiAssistant';
import ReviewsIntelligence from './pages/ReviewsIntelligence';
import PriceIntelligence from './pages/PriceIntelligence';
import SavedProducts from './pages/SavedProducts';
import UpgradeCalculator from './pages/UpgradeCalculator';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
      />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onOpenUpload={() => setIsUploadOpen(true)} onOpenVoice={() => setIsVoiceOpen(true)} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard onOpenUpload={() => setIsUploadOpen(true)} onOpenVoice={() => setIsVoiceOpen(true)} />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/product/:id" element={<ProductDetail onOpenVoice={() => setIsVoiceOpen(true)} />} />
          <Route path="/assistant" element={<AiAssistant onOpenVoice={() => setIsVoiceOpen(true)} />} />
          <Route path="/reviews" element={<ReviewsIntelligence />} />
          <Route path="/prices" element={<PriceIntelligence />} />
          <Route path="/upgrade" element={<UpgradeCalculator />} />
          <Route path="/saved" element={<ProtectedRoute><SavedProducts /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

import React from 'react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function VerdictBadge({ verdict = 'BUY', confidence, size = 'md', showConfidence = true }) {
  const normalized = (verdict || 'BUY').toUpperCase();

  const configs = {
    BUY: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      label: 'BUY VERDICT',
      dot: 'bg-emerald-500',
    },
    WAIT: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
      label: 'WAIT FOR SALE',
      dot: 'bg-amber-500',
    },
    AVOID: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: AlertTriangle,
      label: 'AVOID / HIGH RISK',
      dot: 'bg-rose-500',
    }
  };

  const current = configs[normalized] || configs.BUY;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs font-semibold',
    lg: 'px-4 py-2 text-sm font-bold',
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span className={`inline-flex items-center gap-1.5 rounded-full border ${current.bg} ${sizeClasses[size] || sizeClasses.md} shadow-sm tracking-wide`}>
        <span className={`w-2 h-2 rounded-full ${current.dot} animate-pulse`}></span>
        <Icon className="w-3.5 h-3.5" />
        <span>{current.label}</span>
      </span>
      {showConfidence && confidence && (
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
          {confidence}% Confidence
        </span>
      )}
    </div>
  );
}

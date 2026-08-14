import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

export default function PriceChart({ priceHistory = [], currentPrice, lowestPrice, averagePrice, highestPrice }) {
  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        No historical price records tracked yet.
      </div>
    );
  }

  const formattedData = priceHistory.map((item) => {
    const d = new Date(item.recordedAt);
    return {
      date: `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`,
      price: item.price,
    };
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Current Price</p>
          <p className="text-lg font-bold text-slate-900">₹{currentPrice?.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
          <p className="text-xs text-emerald-600 font-medium">Lowest Tracked</p>
          <p className="text-lg font-bold text-emerald-700">₹{lowestPrice?.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <p className="text-xs text-blue-600 font-medium">Average Price</p>
          <p className="text-lg font-bold text-blue-700">₹{averagePrice?.toLocaleString()}</p>
        </div>
        <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
          <p className="text-xs text-rose-600 font-medium">Highest Tracked</p>
          <p className="text-lg font-bold text-rose-700">₹{highestPrice?.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `₹${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Price']}
              contentStyle={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            {averagePrice && (
              <ReferenceLine y={averagePrice} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'Avg', fill: '#94a3b8', fontSize: 10 }} />
            )}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#0c8ce9"
              strokeWidth={3}
              dot={{ fill: '#0c8ce9', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 6, fill: '#026fc7' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

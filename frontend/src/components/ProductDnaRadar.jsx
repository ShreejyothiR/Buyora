import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function ProductDnaRadar({ dnaData, productName = 'Product', comparisonDna = null, comparisonName = 'Competitor' }) {
  const defaultDna = {
    performance: 85,
    value: 80,
    durability: 82,
    portability: 84,
    innovation: 80,
    repairability: 60,
    risk: 20,
    longTermValue: 85,
  };

  const primary = { ...defaultDna, ...(dnaData || {}) };
  const secondary = comparisonDna ? { ...defaultDna, ...comparisonDna } : null;

  const data = [
    { subject: 'Performance', A: primary.performance || 80, B: secondary?.performance, fullMark: 100 },
    { subject: 'Real Value', A: primary.value || 75, B: secondary?.value, fullMark: 100 },
    { subject: 'Durability', A: primary.durability || 80, B: secondary?.durability, fullMark: 100 },
    { subject: 'Portability', A: primary.portability || 80, B: secondary?.portability, fullMark: 100 },
    { subject: 'Innovation', A: primary.innovation || 80, B: secondary?.innovation, fullMark: 100 },
    { subject: 'Repairability', A: primary.repairability || 60, B: secondary?.repairability, fullMark: 100 },
    { subject: 'Low Risk', A: 100 - (primary.risk || 20), B: secondary ? 100 - (secondary.risk || 20) : undefined, fullMark: 100 },
    { subject: 'Longevity', A: primary.longTermValue || 80, B: secondary?.longTermValue, fullMark: 100 },
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} stroke="#cbd5e1" />
          <Radar
            name={productName}
            dataKey="A"
            stroke="#0c8ce9"
            fill="#0c8ce9"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          {secondary && (
            <Radar
              name={comparisonName}
              dataKey="B"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          )}
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
          {secondary && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

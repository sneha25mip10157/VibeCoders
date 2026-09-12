import React, { useState } from 'react';
import { Award, Layers, Plus, Trash2, ArrowRight, ShieldCheck, DollarSign, Clock, Users, Coffee } from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, Tooltip 
} from 'recharts';

export default function CorridorComparison({ metroData, onSelectCorridor }) {
  const corridors = metroData.corridors || [];
  const [selectedIds, setSelectedIds] = useState([
    corridors[0]?.id || '',
    corridors[1]?.id || ''
  ]);

  const selectedCorridors = selectedIds
    .map(id => corridors.find(c => c.id === id))
    .filter(Boolean);

  const addCorridor = (id) => {
    if (id && !selectedIds.includes(id) && selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeCorridor = (id) => {
    if (selectedIds.length > 1) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  // Daypart radar comparison dataset
  const radarMetrics = [
    { metric: 'Morning (AM)', key: 'weekday_am' },
    { metric: 'Midday', key: 'weekday_midday' },
    { metric: 'Evening (PM)', key: 'weekday_evening' },
    { metric: 'Late Night', key: 'late_night' },
    { metric: 'Weekend Day', key: 'weekend_day' },
  ];

  const radarData = radarMetrics.map(m => {
    const row = { metric: m.metric };
    selectedCorridors.forEach((c, idx) => {
      row[`c_${idx}`] = c.dayparts?.[m.key] || 0;
    });
    return row;
  });

  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Corridor Head-to-Head Comparison Matrix</h2>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold">
              Comparative Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Compare 2 to 4 commercial corridors side-by-side. Benchmark daypart activity rhythms, audience overlap, 
            whitespace capacity, existing venue density, and commercial viability in direct parallel.
          </p>
        </div>

        {/* Add Corridor Selector */}
        {selectedIds.length < 4 && (
          <div className="w-full md:w-64">
            <label className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">Add Corridor to Compare</label>
            <select
              value=""
              onChange={(e) => addCorridor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="">+ Choose Corridor...</option>
              {corridors
                .filter(c => !selectedIds.includes(c.id))
                .map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.district})</option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Selected Corridors Header Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedCorridors.map((c, idx) => (
          <div 
            key={c.id}
            className="bg-slate-900/90 p-4 rounded-2xl border relative space-y-2 shadow-xl"
            style={{ borderColor: colors[idx] }}
          >
            {selectedCorridors.length > 1 && (
              <button
                onClick={() => removeCorridor(c.id)}
                className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block font-mono"
              style={{ backgroundColor: `${colors[idx]}25`, color: colors[idx] }}
            >
              Corridor {idx + 1}
            </span>
            <h4 className="font-bold text-white text-base truncate">{c.name}</h4>
            <span className="text-xs text-slate-400 block">{c.district}</span>
          </div>
        ))}
      </div>

      {/* Radar Chart & Key Metrics Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daypart Rhythm Radar */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Daypart Footfall Rhythm Overlay
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Multi-corridor 24/7 activity cycle overlay.</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                {selectedCorridors.map((c, idx) => (
                  <Radar
                    key={c.id}
                    name={c.name}
                    dataKey={`c_${idx}`}
                    stroke={colors[idx]}
                    fill={colors[idx]}
                    fillOpacity={0.25}
                  />
                ))}
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 justify-center text-xs pt-2">
            {selectedCorridors.map((c, idx) => (
              <div key={c.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx] }}></span>
                <span className="text-slate-300 text-[11px] font-medium truncate max-w-28">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Direct Metric Matrix</h3>
            <p className="text-xs text-slate-400">Side-by-side analysis of key operational variables.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Dimension</th>
                  {selectedCorridors.map((c, idx) => (
                    <th key={c.id} className="py-3 px-4 font-semibold" style={{ color: colors[idx] }}>
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-400">Dominant Audience</td>
                  {selectedCorridors.map(c => (
                    <td key={c.id} className="py-3 px-4 font-bold text-white">{c.dominant_audience}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-400">Spending Band</td>
                  {selectedCorridors.map(c => (
                    <td key={c.id} className="py-3 px-4 font-bold text-amber-400">{c.spending_band}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-400">Café Whitespace</td>
                  {selectedCorridors.map(c => (
                    <td key={c.id} className="py-3 px-4 font-mono font-bold text-emerald-400">{c.whitespace?.cafe || 50}/100</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-400">Existing Cafés</td>
                  {selectedCorridors.map(c => (
                    <td key={c.id} className="py-3 px-4 font-mono">{c.place_counts?.cafe || 0} venues</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-400">Total Mapped Places</td>
                  {selectedCorridors.map(c => (
                    <td key={c.id} className="py-3 px-4 font-mono">{c.total_places}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-400">Key Anchors</td>
                  {selectedCorridors.map(c => (
                    <td key={c.id} className="py-3 px-4 text-[11px] text-purple-300">
                      {(c.anchors || []).slice(0, 2).join(', ') || 'General Hub'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

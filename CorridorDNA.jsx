import React, { useState } from 'react';
import { 
  Building2, Users, Clock, MapPin, ShoppingBag, Landmark, DollarSign, CheckCircle2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function CorridorDNA({ metroData, activeCorridor, onSelectCorridor }) {
  const corridors = metroData.corridors || [];
  const [selectedId, setSelectedId] = useState(activeCorridor?.id || corridors[0]?.id || '');

  const corridor = corridors.find(c => c.id === selectedId) || corridors[0];

  if (!corridor) {
    return <div className="p-8 text-center text-slate-400">No corridor data available.</div>;
  }

  const daypartData = [
    { label: 'Weekday AM', key: 'weekday_am', value: corridor.dayparts?.weekday_am || 0, color: '#6366f1' },
    { label: 'Weekday Midday', key: 'weekday_midday', value: corridor.dayparts?.weekday_midday || 0, color: '#38bdf8' },
    { label: 'Weekday PM', key: 'weekday_evening', value: corridor.dayparts?.weekday_evening || 0, color: '#a855f7' },
    { label: 'Late Night', key: 'late_night', value: corridor.dayparts?.late_night || 0, color: '#ec4899' },
    { label: 'Weekend Day', key: 'weekend_day', value: corridor.dayparts?.weekend_day || 0, color: '#10b981' },
  ];

  const audienceData = (corridor.top_audiences || []).slice(0, 7).map(a => ({
    name: a.label,
    score: a.score
  }));

  const placeData = Object.entries(corridor.place_counts || {})
    .filter(([k, v]) => v > 0)
    .map(([key, count]) => ({
      category: key.replace(/_/g, ' ').toUpperCase(),
      count
    }));

  const topArchetypeScores = Object.values(corridor.scores || {})
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-2xl border border-indigo-500/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Corridor DNA Studio (360° Profile)</h2>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-semibold">
              Example 02 Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Understand any commercial corridor in 60 seconds. Instant synthesized breakdown of neighborhood character,
            daypart vitality rhythms, audience persona affinity, place mix, and top business format fits.
          </p>
        </div>

        <div className="w-full md:w-80">
          <label className="text-[11px] text-slate-400 block mb-1 font-semibold uppercase tracking-wider">Select Corridor to Inspect</label>
          <select
            value={corridor.id}
            onChange={(e) => {
              setSelectedId(e.target.value);
              const found = corridors.find(c => c.id === e.target.value);
              if (found) onSelectCorridor(found);
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-500 shadow-md"
          >
            {corridors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white tracking-tight">{corridor.name}</h1>
              <span className="px-3 py-1 bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-bold">
                {corridor.district}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-4xl italic">
              "{corridor.character}"
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Spending Band</span>
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                {corridor.spending_band || 'MODERATE'}
              </span>
            </div>
            <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Dominant Audience</span>
              <span className="font-bold text-indigo-400">
                {corridor.dominant_audience || 'General Traffic'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5 mr-2">
            <Landmark className="w-4 h-4 text-purple-400" />
            Key Anchors & Magnets:
          </span>
          {corridor.anchors && corridor.anchors.length > 0 ? (
            corridor.anchors.map((anc, idx) => (
              <span key={idx} className="bg-purple-950/40 text-purple-300 border border-purple-800/50 px-2.5 py-1 rounded-lg text-[11px] font-medium">
                {anc}
              </span>
            ))
          ) : (
            <span className="text-slate-500 italic">No isolated major anchor</span>
          )}

          {corridor.special_zones && corridor.special_zones.length > 0 && (
            <div className="flex items-center gap-1.5 ml-4">
              <span className="text-amber-400 font-semibold">Special Zones:</span>
              {corridor.special_zones.map((sz, idx) => (
                <span key={idx} className="bg-amber-950/40 text-amber-300 border border-amber-800/50 px-2.5 py-1 rounded-lg text-[11px] font-medium">
                  {sz}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                Daypart Activity Index
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Relative Vitality (0-100)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Relative foot-traffic cadence throughout the week.
            </p>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daypartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val) => [`${val} / 100`, 'Activity Index']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {daypartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-center bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[10px]">
            {daypartData.map((dp) => (
              <div key={dp.key}>
                <span className="text-slate-400 block truncate">{dp.label.split(' ')[1] || dp.label}</span>
                <span className="font-bold text-slate-200 font-mono">{dp.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Audience Persona Affinity
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Scale 1 - 7</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Relative representation of the 55 standard audience personas.
            </p>
          </div>

          <div className="space-y-2.5 my-auto">
            {audienceData.map((aud, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{aud.name}</span>
                  <span className="font-mono font-bold text-emerald-400">{aud.score} / 7</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full"
                    style={{ width: `${(aud.score / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span>Dominant Persona:</span>
            <span className="font-bold text-emerald-400">{corridor.dominant_audience}</span>
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-pink-400" />
                Place Ecosystem Breakdown
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{corridor.total_places} Total Mapped</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Surrounding commercial, civic, and cultural venue inventory.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 my-auto">
            {placeData.slice(0, 6).map((pl, i) => (
              <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium text-[11px]">{pl.category}</span>
                <span className="font-mono font-bold text-pink-400">{pl.count}</span>
              </div>
            ))}
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Café Whitespace Headroom:</span>
              <span className="font-bold text-amber-400">{corridor.whitespace?.cafe || 50}/100</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Dining Whitespace Headroom:</span>
              <span className="font-bold text-amber-400">{corridor.whitespace?.fast_casual || 50}/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Highest Compatible Business Archetypes
            </span>
            <span className="text-[10px] text-indigo-400 font-semibold">Pre-scored</span>
          </div>

          <div className="space-y-2.5">
            {topArchetypeScores.map((arch, i) => (
              <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs hover:border-indigo-500/40 transition-colors">
                <div>
                  <span className="font-bold text-white block">{arch.name}</span>
                  <span className="text-[11px] text-slate-400">{arch.category_id} • Tier: {arch.tier}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-indigo-400 text-sm">{(arch.score * 100).toFixed(1)}%</span>
                  <span className="text-[10px] text-slate-500 block">Fit Index</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Sample Mapped Venues & Points of Interest
            </span>
            <span className="text-[10px] text-slate-400">{corridor.sample_points?.length || 0} sample venues</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {(corridor.sample_points || []).map((pt, i) => (
              <div key={i} className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200 block">{pt.name}</span>
                  <span className="text-[10px] text-slate-400">{pt.category || pt.family}</span>
                </div>
                {pt.lat && pt.lon && (
                  <span className="text-[10px] font-mono text-slate-500">
                    {pt.lat.toFixed(3)}, {pt.lon.toFixed(3)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

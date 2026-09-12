import React, { useState, useMemo } from 'react';
import { Sparkles, TrendingUp, Filter } from 'lucide-react';

export default function OpportunityFinder({ metroData, onSelectCorridor }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedArchetypeId, setSelectedArchetypeId] = useState('');
  const [minFitScore, setMinFitScore] = useState(0.0);
  const [whitespaceWeight, setWhitespaceWeight] = useState(30);
  const [fitWeight, setFitWeight] = useState(50);
  const [supplyPenaltyWeight, setSupplyPenaltyWeight] = useState(20);
  const [selectedCorridorDetail, setSelectedCorridorDetail] = useState(null);

  const availableArchetypes = useMemo(() => {
    const list = metroData.archetypes || [];
    if (selectedCategory === 'ALL') return list;
    return list.filter(a => a.category_id === selectedCategory);
  }, [metroData.archetypes, selectedCategory]);

  const activeArchetypeId = selectedArchetypeId || (availableArchetypes[0]?.id || '');
  const activeArchetype = useMemo(() => {
    return (metroData.archetypes || []).find(a => a.id === activeArchetypeId);
  }, [metroData.archetypes, activeArchetypeId]);

  const rankedCorridors = useMemo(() => {
    if (!metroData.corridors) return [];

    return metroData.corridors.map(corridor => {
      const scoreObj = corridor.scores?.[activeArchetypeId] || {
        score: 0,
        tier: 'GATED_OUT',
        contributions: []
      };

      const rawFit = scoreObj.score || 0;
      const isCafe = activeArchetype?.category_id === 'CAFE' || activeArchetypeId.includes('cafe');
      const wsRaw = isCafe 
        ? (corridor.whitespace?.cafe ?? 50)
        : (corridor.whitespace?.fast_casual ?? corridor.whitespace?.qsr ?? 50);
      const wsNorm = wsRaw / 100;

      const existingSupply = isCafe 
        ? (corridor.place_counts?.cafe ?? 0)
        : (corridor.place_counts?.food_drink ?? corridor.place_counts?.cafe ?? 0);
      
      const supplyPenalty = Math.min(existingSupply / 25, 1);

      const totalW = fitWeight + whitespaceWeight + supplyPenaltyWeight || 1;
      const composite = Math.max(0, (
        (rawFit * fitWeight) + 
        (wsNorm * whitespaceWeight) - 
        (supplyPenalty * supplyPenaltyWeight)
      ) / (fitWeight + whitespaceWeight));

      const compositeScore100 = Math.round(composite * 100);

      return {
        ...corridor,
        fitScore: rawFit,
        fitTier: scoreObj.tier,
        scoreKind: scoreObj.score_kind,
        contributions: scoreObj.contributions || [],
        whitespaceValue: wsRaw,
        existingSupply,
        compositeScore: compositeScore100,
        timingIndex: scoreObj.timing_index,
        audienceIndex: scoreObj.audience_index
      };
    })
    .filter(c => c.fitScore >= minFitScore)
    .sort((a, b) => b.compositeScore - a.compositeScore);
  }, [metroData, activeArchetypeId, activeArchetype, fitWeight, whitespaceWeight, supplyPenaltyWeight, minFitScore]);

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'STRONG_FIT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Strong Fit</span>;
      case 'MODERATE_FIT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">Moderate Fit</span>;
      case 'WEAK_FIT':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">Weak Fit</span>;
      case 'GATED_OUT':
      case 'INSUFFICIENT_CONTEXT':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">{tier || 'Gated Out'}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/40 p-6 rounded-2xl border border-indigo-500/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Corridor Opportunity Finder</h2>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-semibold">
              Example 01 Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Identifies promising expansion locations for business formats. Balances mathematical format compatibility (Fit Score), 
            estimated demand headroom (Whitespace), and local market competition (Existing Supply Penalty).
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Total Evaluated</span>
            <span className="text-base font-bold text-white">{rankedCorridors.length} Corridors</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-400 block">Strong / Mod Fit</span>
            <span className="text-base font-bold text-emerald-400">
              {rankedCorridors.filter(c => c.fitTier === 'STRONG_FIT' || c.fitTier === 'MODERATE_FIT').length}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-400" />
              1. Select Target Business Format (Archetype)
            </span>
            <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${selectedCategory === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                All ({metroData.archetypes?.length || 0})
              </button>
              <button
                onClick={() => setSelectedCategory('CAFE')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${selectedCategory === 'CAFE' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Cafés
              </button>
              <button
                onClick={() => setSelectedCategory('RESTAURANT')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${selectedCategory === 'RESTAURANT' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Restaurants
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Business Archetype Template</label>
              <select
                value={activeArchetypeId}
                onChange={(e) => setSelectedArchetypeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                {availableArchetypes.map((arch) => (
                  <option key={arch.id} value={arch.id}>
                    {arch.name} ({arch.category_id})
                  </option>
                ))}
              </select>
            </div>

            {activeArchetype && (
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs flex flex-col justify-between">
                <div>
                  <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">Format Mission</span>
                  <p className="text-slate-200 mt-0.5 line-clamp-2">{activeArchetype.mission || 'Standard retail/hospitality operational format.'}</p>
                </div>
                {activeArchetype.required_gate && (
                  <span className="text-[10px] text-amber-400/90 font-mono mt-2 block">
                    Gate: {activeArchetype.required_gate}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              2. Opportunity Formula Weights
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Custom Weighting</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Business Fit Score Weight</span>
                <span className="font-mono text-indigo-400 font-bold">{fitWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={fitWeight}
                onChange={(e) => setFitWeight(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Whitespace Headroom Weight</span>
                <span className="font-mono text-emerald-400 font-bold">{whitespaceWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={whitespaceWeight}
                onChange={(e) => setWhitespaceWeight(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Existing Supply Penalty</span>
                <span className="font-mono text-rose-400 font-bold">{supplyPenaltyWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={supplyPenaltyWeight}
                onChange={(e) => setSupplyPenaltyWeight(Number(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Ranked Corridors for {activeArchetype?.name}</h3>
            <p className="text-xs text-slate-400">Sorted by Composite Opportunity Index. Click any corridor to inspect signal breakdown.</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Showing top {rankedCorridors.length} corridors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Rank</th>
                <th className="py-3.5 px-4 font-semibold">Corridor & District</th>
                <th className="py-3.5 px-4 font-semibold">Composite Opportunity</th>
                <th className="py-3.5 px-4 font-semibold">Fit Score & Tier</th>
                <th className="py-3.5 px-4 font-semibold">Whitespace</th>
                <th className="py-3.5 px-4 font-semibold">Existing Supply</th>
                <th className="py-3.5 px-4 font-semibold">Peak Daypart</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rankedCorridors.slice(0, 20).map((c, idx) => {
                const dpEntries = Object.entries(c.dayparts || {});
                dpEntries.sort((a, b) => b[1] - a[1]);
                const topDaypart = dpEntries[0] ? `${dpEntries[0][0].replace('_', ' ')} (${dpEntries[0][1]})` : 'N/A';

                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCorridorDetail(c)}
                    className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      #{idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {c.name}
                      </div>
                      <span className="text-[11px] text-slate-400">{c.district}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.compositeScore > 70 ? 'bg-emerald-500' : c.compositeScore > 45 ? 'bg-indigo-500' : 'bg-slate-600'
                            }`}
                            style={{ width: `${Math.min(c.compositeScore, 100)}%` }}
                          ></div>
                        </div>
                        <span className="font-mono font-bold text-white">{c.compositeScore}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-200">{(c.fitScore * 100).toFixed(1)}%</span>
                        {getTierBadge(c.fitTier)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`${c.whitespaceValue >= 60 ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                        {c.whitespaceValue}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className={`${c.existingSupply > 15 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {c.existingSupply} venues
                      </span>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-[11px] text-slate-400">
                      {topDaypart}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCorridor(c);
                        }}
                        className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-xs font-semibold transition-all border border-indigo-500/30 cursor-pointer"
                      >
                        View DNA →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signal Contribution Drawer */}
      {selectedCorridorDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Explainable Evidence Breakdown</span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedCorridorDetail.name}</h3>
                <p className="text-xs text-slate-400">{selectedCorridorDetail.district} • {activeArchetype?.name}</p>
              </div>
              <button
                onClick={() => setSelectedCorridorDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Opportunity Index</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">{selectedCorridorDetail.compositeScore}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Raw Fit Score</span>
                <span className="text-xl font-bold text-indigo-400 font-mono">{(selectedCorridorDetail.fitScore * 100).toFixed(1)}%</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Whitespace Room</span>
                <span className="text-xl font-bold text-amber-400 font-mono">{selectedCorridorDetail.whitespaceValue}/100</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Underlying Model Signals & Weights</span>
              {selectedCorridorDetail.contributions && selectedCorridorDetail.contributions.length > 0 ? (
                <div className="space-y-2">
                  {selectedCorridorDetail.contributions.map((sig, i) => (
                    <div key={i} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">{sig.signal.replace(/_/g, ' ')}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${sig.role === 'PRIMARY' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
                            {sig.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">Effective Weight: {(sig.weight * 100).toFixed(1)}%</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-indigo-400 font-bold">Value: {(sig.value * 100).toFixed(0)}%</span>
                        <span className="text-slate-400 block text-[10px]">Net: +{(sig.contribution * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
                  Canonical Fit Score derived from multi-layered corridor audience segments, timing clock indices, and host availability.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCorridorDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectCorridor(selectedCorridorDetail);
                  setSelectedCorridorDetail(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Explore Full Corridor DNA →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

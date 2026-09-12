import React, { useState, useMemo } from 'react';
import { Sliders, Users, Clock, ArrowRight, Check, Sparkles, Filter, Building2, MapPin } from 'lucide-react';

export default function PersonaRecommender({ metroData, onSelectCorridor }) {
  const [selectedPersonas, setSelectedPersonas] = useState(['morning_commute', 'office_routine']);
  const [selectedDaypart, setSelectedDaypart] = useState('ALL');
  const [minAudienceScore, setMinAudienceScore] = useState(4);

  const allPersonas = metroData.audience_segments || [];

  const togglePersona = (pId) => {
    if (selectedPersonas.includes(pId)) {
      if (selectedPersonas.length > 1) {
        setSelectedPersonas(selectedPersonas.filter(id => id !== pId));
      }
    } else {
      setSelectedPersonas([...selectedPersonas, pId]);
    }
  };

  // Rank corridors based on selected personas & dayparts
  const rankedCorridors = useMemo(() => {
    if (!metroData.corridors) return [];

    return metroData.corridors.map(c => {
      // Calculate average persona relevance score (1-7)
      let personaScoreSum = 0;
      let matchedCount = 0;

      selectedPersonas.forEach(pId => {
        const score = c.audiences?.[pId] ?? 0;
        personaScoreSum += score;
        if (score >= minAudienceScore) matchedCount++;
      });

      const avgPersonaScore = selectedPersonas.length > 0 ? (personaScoreSum / selectedPersonas.length) : 0;

      // Daypart filter multiplier
      let daypartMultiplier = 1.0;
      if (selectedDaypart !== 'ALL') {
        const dpVal = c.dayparts?.[selectedDaypart] || 50;
        daypartMultiplier = dpVal / 100;
      }

      // Composite match score (0-100)
      const matchScore = Math.round(((avgPersonaScore / 7) * 70 + daypartMultiplier * 30));

      return {
        ...c,
        avgPersonaScore: avgPersonaScore.toFixed(1),
        matchedCount,
        matchScore
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
  }, [metroData.corridors, selectedPersonas, selectedDaypart, minAudienceScore]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950/40 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-teal-500/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Persona → Place Recommender</h2>
            <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30 font-semibold">
              Example 03 Engine
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Start with the audience you want to reach. Select one or multiple demographic personas, specify preferred daypart cadences, 
            and discover the commercial corridors with the strongest customer concentration.
          </p>
        </div>

        <div className="bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 block font-medium">Selected Personas</span>
          <span className="text-base font-bold text-teal-400">{selectedPersonas.length} Active Target Personas</span>
        </div>
      </div>

      {/* Filter and Selection Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Persona Selector Chips */}
        <div className="lg:col-span-2 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              1. Choose Target Demographic Personas (Multi-Select)
            </span>
            <span className="text-[11px] text-slate-400">{selectedPersonas.length} selected</span>
          </div>

          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
            {allPersonas.map((persona) => {
              const isSelected = selectedPersonas.includes(persona.id);
              return (
                <button
                  key={persona.id}
                  onClick={() => togglePersona(persona.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 border border-teal-400/40 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                  {persona.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daypart Alignment & Min Score Threshold */}
        <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-4">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            2. Peak Daypart Vitality Filter
          </span>

          <div className="space-y-2">
            {[
              { id: 'ALL', label: 'Any Time / Full Week' },
              { id: 'weekday_am', label: 'Weekday Morning Rush (AM)' },
              { id: 'weekday_midday', label: 'Weekday Midday (Lunch/Work)' },
              { id: 'weekday_evening', label: 'Weekday Evening (Dinner/Social)' },
              { id: 'weekend_day', label: 'Weekend Daytime (Leisure/Shopping)' },
              { id: 'late_night', label: 'Late Night (Nightlife)' },
            ].map((dp) => (
              <label
                key={dp.id}
                className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                  selectedDaypart === dp.id
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60'
                }`}
              >
                <span>{dp.label}</span>
                <input
                  type="radio"
                  name="daypart"
                  checked={selectedDaypart === dp.id}
                  onChange={() => setSelectedDaypart(dp.id)}
                  className="accent-indigo-500"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Corridors Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Top Recommended Corridors for Target Personas</h3>
          <span className="text-xs text-slate-400">Ranked by Demographic Match & Daypart Alignment</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rankedCorridors.slice(0, 12).map((c, idx) => (
            <div
              key={c.id}
              onClick={() => onSelectCorridor(c)}
              className="bg-slate-900/90 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 hover:border-teal-500/40 shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-400">RANK #{idx + 1}</span>
                    <h4 className="font-bold text-base text-white group-hover:text-teal-400 transition-colors mt-0.5">
                      {c.name}
                    </h4>
                    <span className="text-xs text-slate-400">{c.district}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-teal-400 font-mono">{c.matchScore}%</span>
                    <span className="text-[10px] text-slate-500 block">Match Score</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-3 line-clamp-2 italic leading-relaxed">
                  "{c.character}"
                </p>
              </div>

              {/* Persona Breakdown Pills */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">Target Persona Scores:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPersonas.slice(0, 3).map(pId => {
                    const score = c.audiences?.[pId] ?? 0;
                    const meta = allPersonas.find(p => p.id === pId);
                    return (
                      <span
                        key={pId}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                          score >= 5 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {meta?.label || pId}: {score}/7
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-slate-400 font-medium">Dominant: {c.dominant_audience}</span>
                <span className="text-teal-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  Inspect DNA <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

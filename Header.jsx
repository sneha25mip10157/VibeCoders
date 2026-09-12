import React from 'react';
import { Building2, Sparkles, Sliders, Presentation, Search, MapPin, Award } from 'lucide-react';

export default function Header({ 
  currentMetro, 
  setCurrentMetro, 
  activeTab, 
  setActiveTab, 
  searchQuery, 
  setSearchQuery,
  stats,
  onOpenPitchDeck
}) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Metro Switcher */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('opportunities')}>
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 rounded-xl shadow-lg shadow-indigo-500/30 text-white font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white">UrbanPulse</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v26 Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">Commercial Corridor Intelligence & Decision Platform</p>
            </div>
          </div>

          {/* Metro Switcher Pills */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setCurrentMetro('nyc')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentMetro === 'nyc'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              New York City (65)
            </button>
            <button
              onClick={() => setCurrentMetro('dfw')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentMetro === 'dfw'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Dallas–Fort Worth (72)
            </button>
          </div>
        </div>

        {/* Global Search & Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search corridors, archetypes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <button
            onClick={onOpenPitchDeck}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Presentation className="w-4 h-4" />
            10-Slide Pitch Deck
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'opportunities', label: '1. Opportunity Finder', icon: Sparkles },
            { id: 'dna', label: '2. Corridor DNA (360°)', icon: Building2 },
            { id: 'persona', label: '3. Persona → Place Matcher', icon: Sliders },
            { id: 'compare', label: '4. Head-to-Head Compare', icon: Award },
            { id: 'ai', label: '5. Ask Corridor AI', icon: Sparkles },
            { id: 'map', label: '6. Geospatial Map', icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Global Live Stats Badge */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            137 Corridors
          </span>
          <span className="text-slate-600">•</span>
          <span>6,684 Fit Scores</span>
          <span className="text-slate-600">•</span>
          <span>55 Audience Personas</span>
        </div>
      </div>
    </header>
  );
}

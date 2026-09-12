import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import OpportunityFinder from './components/OpportunityFinder';
import CorridorDNA from './components/CorridorDNA';
import PersonaRecommender from './components/PersonaRecommender';
import CorridorComparison from './components/CorridorComparison';
import AskCorridorAI from './components/AskCorridorAI';
import CorridorMap from './components/CorridorMap';
import HackathonPitchDeck from './components/HackathonPitchDeck';

import corridorData from './data/corridorData.json';

export default function App() {
  const [currentMetro, setCurrentMetro] = useState('nyc');
  const [activeTab, setActiveTab] = useState('opportunities');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCorridor, setActiveCorridor] = useState(null);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);

  // Active Metro dataset
  const metroData = useMemo(() => {
    return corridorData.metros[currentMetro] || corridorData.metros.nyc;
  }, [currentMetro]);

  // Handle selecting a corridor from anywhere (e.g. search, opportunity table, AI)
  const handleSelectCorridor = (corridor) => {
    setActiveCorridor(corridor);
    setActiveTab('dna');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header with Switcher & Global Search */}
      <Header
        currentMetro={currentMetro}
        setCurrentMetro={setCurrentMetro}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stats={corridorData.stats}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {activeTab === 'opportunities' && (
          <OpportunityFinder
            metroData={metroData}
            onSelectCorridor={handleSelectCorridor}
          />
        )}

        {activeTab === 'dna' && (
          <CorridorDNA
            metroData={metroData}
            activeCorridor={activeCorridor}
            onSelectCorridor={handleSelectCorridor}
          />
        )}

        {activeTab === 'persona' && (
          <PersonaRecommender
            metroData={metroData}
            onSelectCorridor={handleSelectCorridor}
          />
        )}

        {activeTab === 'compare' && (
          <CorridorComparison
            metroData={metroData}
            onSelectCorridor={handleSelectCorridor}
          />
        )}

        {activeTab === 'ai' && (
          <AskCorridorAI
            metroData={metroData}
            onSelectCorridor={handleSelectCorridor}
          />
        )}

        {activeTab === 'map' && (
          <CorridorMap
            metroData={metroData}
            onSelectCorridor={handleSelectCorridor}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 UrbanPulse • ACM × EVAM Hackathon: Beyond the Prompt (Day 02)</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Authoritative Dataset: usa-corridors-20260906-r2</span>
            <span>•</span>
            <span>NYC & DFW Metros</span>
          </div>
        </div>
      </footer>

      {/* 10-Slide Pitch Presentation Modal */}
      {isPitchDeckOpen && (
        <HackathonPitchDeck onClose={() => setIsPitchDeckOpen(false)} />
      )}
    </div>
  );
}

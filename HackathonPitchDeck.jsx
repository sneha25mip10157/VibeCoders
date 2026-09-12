import React, { useState } from 'react';
import { 
  Presentation, ChevronLeft, ChevronRight, CheckCircle2, 
  Sparkles, Building2, TrendingUp, Users, Award, ShieldAlert, 
  ExternalLink, Layers, ArrowRight, Code, Database 
} from 'lucide-react';

export default function HackathonPitchDeck({ onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "UrbanPulse: Beyond the Prompt",
      subtitle: "Commercial Corridor Intelligence & Opportunity Engine",
      badge: "SLIDE 01 / 10 • PROBLEM & MISSION",
      icon: Building2,
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-950/40 p-6 rounded-2xl border border-indigo-500/30">
            <h4 className="text-lg font-bold text-white">The Commercial Site Selection Problem</h4>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Retailers, hospitality entrepreneurs, and urban planners evaluate expansion opportunities using fragmented data. 
              Looking at a single metric is misleading: high foot traffic often suffers from extreme saturation, while high-demand formats fail when misaligned with daypart rhythms.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-2xl font-black text-indigo-400 font-mono">137</span>
              <span className="text-xs text-slate-400 block mt-1">Commercial Districts</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-2xl font-black text-emerald-400 font-mono">6,684</span>
              <span className="text-xs text-slate-400 block mt-1">Pre-Computed Fit Scores</span>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-2xl font-black text-pink-400 font-mono">55</span>
              <span className="text-xs text-slate-400 block mt-1">Audience Personas</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Dataset Architecture & Ingestion",
      subtitle: "Grounded in Canonical NYC & Dallas–Fort Worth Data Releases",
      badge: "SLIDE 02 / 10 • DATA INTEGRITY",
      icon: Database,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            UrbanPulse directly digests portable Mongo exports from the active bundle <code className="text-indigo-400 font-mono bg-slate-900 px-2 py-0.5 rounded">usa-corridors-20260906-r2</code>.
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <h5 className="font-bold text-indigo-300">New York City (65 Corridors)</h5>
              <ul className="space-y-1.5 text-slate-300">
                <li>• 60 macro + 5 sub-corridors across 5 boroughs</li>
                <li>• 81,767 exact non-overlapping H3-10 hex cells (~65m grain)</li>
                <li>• 31 pre-scored café business archetypes</li>
                <li>• 25 special traffic magnets (campuses, stadiums)</li>
              </ul>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <h5 className="font-bold text-teal-300">Dallas–Fort Worth (72 Corridors)</h5>
              <ul className="space-y-1.5 text-slate-300">
                <li>• 72 walkable commercial corridors across North Texas</li>
                <li>• 67 business archetypes (cafés + restaurants)</li>
                <li>• 4,824 full signal contribution records</li>
                <li>• 37 major activity envelopes and special zones</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Core Architectural Solution",
      subtitle: "Four Unified Analytical Engines in One Cohesive Platform",
      badge: "SLIDE 03 / 10 • ARCHITECTURE",
      icon: Layers,
      content: (
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900 p-4 rounded-xl border border-indigo-500/30 space-y-1.5">
            <span className="font-bold text-indigo-400 text-sm">1. Opportunity Finder</span>
            <p className="text-slate-300">Multi-factor ranking balancing Fit Score, Whitespace Quality, and Existing Venue Competition.</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-teal-500/30 space-y-1.5">
            <span className="font-bold text-teal-400 text-sm">2. Corridor DNA Studio</span>
            <p className="text-slate-300">360° instant summary: daypart cadence charts, top audience personas, place mix, and anchor alerts.</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/30 space-y-1.5">
            <span className="font-bold text-amber-400 text-sm">3. Persona → Place Matcher</span>
            <p className="text-slate-300">Reverse discovery engine: start with a target customer cohort, filter by time of day, and discover optimal corridors.</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/30 space-y-1.5">
            <span className="font-bold text-purple-400 text-sm">4. Ask Corridor AI (MCP)</span>
            <p className="text-slate-300">Natural language query interface backed by grounded dataset extraction with explainable evidence citations.</p>
          </div>
        </div>
      )
    },
    {
      title: "Opportunity Scoring Engine",
      subtitle: "Explainable Mathematical Formulation",
      badge: "SLIDE 04 / 10 • ALGORITHM",
      icon: TrendingUp,
      content: (
        <div className="space-y-4 text-xs">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-center space-y-2">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Composite Opportunity Formula</span>
            <div className="text-base font-mono text-emerald-400 font-bold bg-slate-950 p-3 rounded-xl border border-slate-800">
              Score = (FitScore × w_fit) + (Whitespace × w_ws) - (CompetitionPenalty × w_comp)
            </div>
            <p className="text-slate-400 text-[11px]">User-customizable weights ensure tailored recommendations for different business models.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-indigo-400 block">Fit Score (0-1)</span>
              <span className="text-slate-300 text-[11px]">Pre-computed format archetype compatibility rule matrix.</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-emerald-400 block">Whitespace (0-100)</span>
              <span className="text-slate-300 text-[11px]">Expert demand headroom indicating room for new entrants.</span>
            </div>
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-rose-400 block">Supply Penalty</span>
              <span className="text-slate-300 text-[11px]">Normalized density deduction for overcrowded categories.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Corridor DNA: 360° Place Intelligence",
      subtitle: "Translating Complex Geospatial Records into Instant Decisions",
      badge: "SLIDE 05 / 10 • CORRIDOR DNA",
      icon: Building2,
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-sm text-slate-300 leading-relaxed">
            Corridor DNA synthesizes 5 discrete layers of intelligence into a unified profile card readable in under 60 seconds:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="font-bold text-white block">1. Daypart Vitality Cadence</span>
              <p className="text-slate-400 text-[11px] mt-1">Tracks footfall indices across Weekday AM, Midday, Evening, Late Night, and Weekend Day.</p>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="font-bold text-white block">2. Audience Persona Vectors</span>
              <p className="text-slate-400 text-[11px] mt-1">Identifies dominant demographic cohorts from Morning Commuters to Family Households.</p>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="font-bold text-white block">3. Surrounding Commercial Mix</span>
              <p className="text-slate-400 text-[11px] mt-1">Real mapped venues: Cafés, Food & Drink, Retail, Groceries, Healthcare, Culture.</p>
            </div>
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
              <span className="font-bold text-white block">4. Magnet & Anchor Influence</span>
              <p className="text-slate-400 text-[11px] mt-1">Major external demand drivers: Transit hubs, university campuses, medical districts.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Persona-to-Place Recommender",
      subtitle: "Audience-First Commercial Target Discovery",
      badge: "SLIDE 06 / 10 • AUDIENCE MATCHING",
      icon: Users,
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-sm text-slate-300 leading-relaxed">
            Instead of searching districts one by one, operators specify target demographic personas and operating hours. 
            UrbanPulse calculates demographic overlap and temporal alignment.
          </p>
          <div className="bg-slate-900 p-4 rounded-xl border border-teal-500/30 space-y-2">
            <span className="font-bold text-teal-400 text-xs uppercase tracking-wider">Example User Scenario:</span>
            <p className="text-slate-200">
              <em>"Find top locations for a specialty bakery targeting Morning Commuters & Hybrid Remote Workers active in weekday mornings."</em>
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <p>✓ Evaluates 55 persona indices across all 137 districts</p>
              <p>✓ Multiplies by Weekday AM vitality score</p>
              <p>✓ Delivers ranked match cards with transparent reasoning</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Head-to-Head Comparative Matrix",
      subtitle: "Side-by-Side Visual Benchmarking",
      badge: "SLIDE 07 / 10 • COMPARISON",
      icon: Award,
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-sm text-slate-300 leading-relaxed">
            Directly benchmark 2 to 4 corridors in parallel across daypart rhythms, spending capacity, and competition metrics.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <h5 className="font-bold text-amber-400">Daypart Radar Overlay</h5>
              <p className="text-slate-300 text-[11px]">
                Superimposes 24/7 footfall cycles to identify morning-heavy vs. evening-nightlife districts instantly.
              </p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
              <h5 className="font-bold text-amber-400">Direct Metric Matrix</h5>
              <p className="text-slate-300 text-[11px]">
                Side-by-side comparison of spending band, whitespace quality, existing venue supply, and major anchors.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Ask Corridor AI & MCP Integration",
      subtitle: "Zero-Hallucination Natural Language Engine",
      badge: "SLIDE 08 / 10 • AI + MCP",
      icon: Sparkles,
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-sm text-slate-300 leading-relaxed">
            UrbanPulse implements the Model Context Protocol (MCP) design pattern: natural-language intent is translated into structured queries against canonical JSON records.
          </p>
          <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-300">MCP Structured Pipeline</span>
              <span className="text-[10px] text-purple-400 font-mono">User Query → Tool Call → Verified Evidence</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-medium pt-2">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300">1. Natural Query</div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300">2. Intent Extraction</div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300">3. Matrix Tool Query</div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-purple-300 font-bold">4. Grounded Citation</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Business Impact & Real-World Value",
      subtitle: "De-Risking Capital Allocation for Businesses & Cities",
      badge: "SLIDE 09 / 10 • IMPACT",
      icon: CheckCircle2,
      content: (
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 text-sm">Retail Operators</span>
            <p className="text-slate-300 text-[11px]">
              Saves hundreds of consulting hours by providing quantitative opportunity shortlists with signal explainability.
            </p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-indigo-400 text-sm">Real Estate Brokers</span>
            <p className="text-slate-300 text-[11px]">
              Equips agents with rich 360° corridor DNA cards to pitch prime commercial parcels to matched tenant formats.
            </p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-pink-400 text-sm">City Planners</span>
            <p className="text-slate-300 text-[11px]">
              Identifies commercial deserts and underserved community needs through whitespace quality metrics.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Summary & Hackathon Conclusion",
      subtitle: "Find. Build. Explain. — Built for Beyond the Prompt Day 02",
      badge: "SLIDE 10 / 10 • CONCLUSION",
      icon: Award,
      content: (
        <div className="space-y-4 text-xs">
          <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 p-5 rounded-2xl border border-indigo-500/40 space-y-2">
            <h5 className="font-bold text-white text-base">Key Achievements Today</h5>
            <ul className="space-y-1.5 text-slate-300">
              <li>✓ Ingested and indexed all 137 commercial corridors across NYC & DFW.</li>
              <li>✓ Implemented all 4 challenge problem archetypes (Opportunity Finder, DNA Studio, Persona Recommender, Ask AI).</li>
              <li>✓ Built an ultra-fast, responsive web interface with explainable mathematical formulas and interactive charts.</li>
              <li>✓ 100% grounded in provided data with zero unverified assumptions.</li>
            </ul>
          </div>
          <div className="text-center pt-2">
            <span className="text-indigo-400 font-bold text-sm">Ready for Judge Review & Live Demonstration 🚀</span>
          </div>
        </div>
      )
    }
  ];

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-8 shadow-2xl flex flex-col justify-between h-[620px] relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase">{slide.badge}</span>
              <h3 className="text-xl font-bold text-white tracking-tight">{slide.title}</h3>
              <p className="text-xs text-slate-400">{slide.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Exit Presentation (ESC)
          </button>
        </div>

        {/* Slide Body */}
        <div className="my-auto py-4">
          {slide.content}
        </div>

        {/* Slide Navigation Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-xl text-xs font-semibold transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

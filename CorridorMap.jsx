import React, { useState } from 'react';
import { MapPin, Navigation, Info, Compass, Layers, Sparkles, Coffee } from 'lucide-react';

export default function CorridorMap({ metroData, onSelectCorridor }) {
  const corridors = metroData.corridors || [];
  const [hoveredCorridor, setHoveredCorridor] = useState(null);
  const [selectedBorough, setSelectedBorough] = useState('ALL');

  const boroughs = Array.from(new Set(corridors.map(c => c.district).filter(Boolean)));

  const filteredCorridors = selectedBorough === 'ALL'
    ? corridors
    : corridors.filter(c => c.district === selectedBorough);

  // Compute map bounds
  const lats = corridors.map(c => c.center?.[0]).filter(Boolean);
  const lons = corridors.map(c => c.center?.[1]).filter(Boolean);

  const minLat = Math.min(...lats, 40.5);
  const maxLat = Math.max(...lats, 40.9);
  const minLon = Math.min(...lons, -74.3);
  const maxLon = Math.max(...lons, -73.7);

  const latSpan = maxLat - minLat || 1;
  const lonSpan = maxLon - minLon || 1;

  // Convert lat/lon to SVG coordinate
  const projectCoord = (lat, lon) => {
    const x = ((lon - minLon) / lonSpan) * 760 + 20;
    const y = ((maxLat - lat) / latSpan) * 460 + 20;
    return { x: Math.max(20, Math.min(780, x)), y: Math.max(20, Math.min(480, y)) };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-blue-500/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Geospatial Corridor Explorer</h2>
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-semibold">
              Spatial Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Geographic distribution of commercial corridors, spatial clustering, and special activity anchors across {metroData.metro_name}.
          </p>
        </div>

        {/* Borough/District Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Filter District:</span>
          <select
            value={selectedBorough}
            onChange={(e) => setSelectedBorough(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Districts ({corridors.length})</option>
            {boroughs.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Map Canvas + Details Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Spatial Canvas */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between z-10 mb-2 px-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-400" />
              Interactive District Map Canvas
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Displaying {filteredCorridors.length} Districts
            </span>
          </div>

          <div className="w-full h-[480px] bg-slate-950 rounded-xl border border-slate-800/80 relative overflow-hidden flex items-center justify-center">
            
            {/* Ambient Hex Grid Background */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <svg viewBox="0 0 800 500" className="w-full h-full">
              {/* Connector lines between districts */}
              {filteredCorridors.map((c, i) => {
                const pos = projectCoord(c.center[0], c.center[1]);
                return (
                  <circle
                    key={`pulse-${c.id}`}
                    cx={pos.x}
                    cy={pos.y}
                    r="12"
                    fill="#6366f1"
                    fillOpacity="0.1"
                  />
                );
              })}

              {/* Corridor Pins */}
              {filteredCorridors.map((c) => {
                const pos = projectCoord(c.center[0], c.center[1]);
                const isHovered = hoveredCorridor?.id === c.id;
                const ws = c.whitespace?.cafe || 50;
                const pinColor = ws >= 60 ? '#10b981' : ws >= 40 ? '#6366f1' : '#f59e0b';

                return (
                  <g
                    key={c.id}
                    onClick={() => onSelectCorridor(c)}
                    onMouseEnter={() => setHoveredCorridor(c)}
                    className="cursor-pointer transition-transform"
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isHovered ? 9 : 6}
                      fill={pinColor}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? 2.5 : 1}
                      className="transition-all"
                    />
                    <text
                      x={pos.x + 10}
                      y={pos.y + 4}
                      fill="#e2e8f0"
                      fontSize="9"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow-md select-none"
                    >
                      {c.name.split('–')[0].split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Map Controls Overlay */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[10px] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-300">High Whitespace (60+)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-slate-300">Balanced Density</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-300">Dense / Saturated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Corridor Preview Sidebar */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Corridor Focus Inspector
            </span>
            <p className="text-xs text-slate-400 mt-0.5">Hover or click a node on the map to inspect details.</p>
          </div>

          {hoveredCorridor ? (
            <div className="space-y-4 my-auto bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase">{hoveredCorridor.district}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{hoveredCorridor.name}</h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed italic">
                  "{hoveredCorridor.character}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Dominant Persona</span>
                  <span className="font-bold text-indigo-400 truncate block">{hoveredCorridor.dominant_audience}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Café Whitespace</span>
                  <span className="font-bold text-emerald-400">{hoveredCorridor.whitespace?.cafe || 50}/100</span>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                <span className="font-semibold block mb-1">Key Anchors:</span>
                <span className="text-slate-300 text-[11px]">
                  {(hoveredCorridor.anchors || []).slice(0, 3).join(', ') || 'Community district'}
                </span>
              </div>

              <button
                onClick={() => onSelectCorridor(hoveredCorridor)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all text-center block"
              >
                Open Full 360° DNA Studio →
              </button>
            </div>
          ) : (
            <div className="my-auto text-center py-16 text-slate-500 space-y-2">
              <MapPin className="w-8 h-8 mx-auto text-slate-600 animate-bounce" />
              <p className="text-xs">Hover over any pin on the map to preview its commercial profile.</p>
            </div>
          )}

          <div className="text-[11px] text-slate-500 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
            Authoritative spatial grain: H3-10 (~65m resolution)
          </div>
        </div>
      </div>
    </div>
  );
}

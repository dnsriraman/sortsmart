import React, { useEffect, useMemo, useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Filter, 
  Navigation, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { RECYCLING_CENTRES, WASTE_CATEGORIES } from './wasteDataset';

interface BinReportLocation {
  id: string;
  location: string;
  campusArea: string;
  status: string;
  severity: string;
  wasteType: string;
  coordinates?: { lat: number; lng: number };
}

const approximateBinCoordinates = (report: BinReportLocation) => {
  if (report.coordinates && Number.isFinite(report.coordinates.lat) && Number.isFinite(report.coordinates.lng)) {
    return report.coordinates;
  }
  const location = `${report.location} ${report.campusArea}`.toLowerCase();
  if (location.includes('library')) return { lat: 27.1819, lng: 88.5138 };
  if (location.includes('hostel') || location.includes('residential')) return { lat: 27.1806, lng: 88.5131 };
  if (location.includes('engineering') || location.includes('workshop') || location.includes('lab')) return { lat: 27.1822, lng: 88.5155 };
  return { lat: 27.1812, lng: 88.5142 };
};

const mercatorY = (latitude: number) => Math.log(Math.tan(Math.PI / 4 + (latitude * Math.PI) / 360));

export const CentresView: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeCentreId, setActiveCentreId] = useState<string>(RECYCLING_CENTRES[0].id);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [binReports, setBinReports] = useState<BinReportLocation[]>([]);
  const [showCentresOnMap, setShowCentresOnMap] = useState(true);
  const [showBinsOnMap, setShowBinsOnMap] = useState(true);
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null);

  useEffect(() => {
    const refreshBins = () => fetch('/api/campus-bins')
      .then((response) => response.json())
      .then((data) => setBinReports(data.reports || []))
      .catch((error) => console.error('Could not load recycling bin reports:', error));
    refreshBins();
    const interval = window.setInterval(refreshBins, 10000);
    return () => window.clearInterval(interval);
  }, []);

  const filterOptions = [
    { id: 'all', label: 'All Centers' },
    { id: 'e_waste', label: 'E-Waste & Electronics' },
    { id: 'batteries', label: 'Batteries & Hazardous' },
    { id: 'dry_recyclable', label: 'Dry Recyclables (Paper/Plastics)' },
    { id: 'wet_organic', label: 'Organic Composting' },
  ];

  const filteredCentres = RECYCLING_CENTRES.filter((c) => {
    if (selectedFilter === 'all') return true;
    return c.acceptedMaterials.includes(selectedFilter);
  });

  const activeCentre = RECYCLING_CENTRES.find(c => c.id === activeCentreId) || RECYCLING_CENTRES[0];
  const selectedBin = binReports.find((report) => report.id === selectedBinId);
  const mapBounds = useMemo(() => {
    const points = [
      ...RECYCLING_CENTRES.map((centre) => centre.coordinates),
      ...binReports.map(approximateBinCoordinates),
    ];
    const minLat = Math.min(...points.map((point) => point.lat));
    const maxLat = Math.max(...points.map((point) => point.lat));
    const minLng = Math.min(...points.map((point) => point.lng));
    const maxLng = Math.max(...points.map((point) => point.lng));
    const latPadding = Math.max((maxLat - minLat) * 0.12, 0.006);
    const lngPadding = Math.max((maxLng - minLng) * 0.12, 0.006);
    return { south: minLat - latPadding, north: maxLat + latPadding, west: minLng - lngPadding, east: maxLng + lngPadding };
  }, [binReports]);

  const markerPosition = (point: { lat: number; lng: number }) => {
    const x = ((point.lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;
    const y = ((mercatorY(mapBounds.north) - mercatorY(point.lat)) / (mercatorY(mapBounds.north) - mercatorY(mapBounds.south))) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          Verified Drop-off Network
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 font-heading">
          Recycling & Collection Centres
        </h1>
        <p className="text-sm text-slate-600">
          Locate authorized e-waste depots, university material recovery facilities (MRFs), and certified scrap dealer partners near campus.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedFilter === f.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 2-Column Map & Listing View */}
      <div className="grid lg:grid-cols-12 gap-6 items-start max-w-6xl mx-auto">
        {/* Left: Centre Cards List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing <strong>{filteredCentres.length}</strong> facilities nearby</span>
            <span>Radius: 5 km (Campus Zone)</span>
          </div>

          <div className="space-y-3">
            {filteredCentres.map((centre) => {
              const isSelected = centre.id === activeCentreId;
              return (
                <div
                  key={centre.id}
                  onClick={() => setActiveCentreId(centre.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-emerald-600 shadow-sm ring-1 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-emerald-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 font-heading">
                          {centre.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {centre.type} • {centre.distanceKm} km away
                      </p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      centre.isVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {centre.isVerified ? '✓ Verified Partner' : '⚠️ Demo Entry'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{centre.address}</span>
                  </p>

                  {/* Accepted Materials Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                    {centre.acceptedMaterials.map((mat) => (
                      <span
                        key={mat}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 capitalize"
                      >
                        {mat.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Centre Detail Card & Interactive Radar Map */}
        <div className="lg:col-span-6 space-y-5 lg:sticky lg:top-24">
          {/* Interactive map centered on the selected recycling centre */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-md">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Recycling centres & bins
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {activeCentre.coordinates.lat.toFixed(4)}, {activeCentre.coordinates.lng.toFixed(4)}
              </span>
            </div>
            <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
              <iframe
                title="Map of recycling centres and campus recycling bins"
                className="absolute inset-0 h-full w-full border-0 pointer-events-none"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds.west}%2C${mapBounds.south}%2C${mapBounds.east}%2C${mapBounds.north}&layer=mapnik`}
                loading="lazy"
                referrerPolicy="no-referrer"
                tabIndex={-1}
              />
              <div className="absolute inset-0" aria-label="Map markers">
                {showCentresOnMap && RECYCLING_CENTRES.map((centre) => (
                  <button
                    key={centre.id}
                    type="button"
                    onClick={() => setActiveCentreId(centre.id)}
                    style={markerPosition(centre.coordinates)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 shadow-md ring-2 ring-white ${centre.id === activeCentreId ? 'bg-emerald-800 text-white z-20 scale-110' : 'bg-emerald-600 text-white z-10'}`}
                    title={`Recycling centre: ${centre.name}`}
                    aria-label={`Select recycling centre ${centre.name}`}
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                ))}
                {showBinsOnMap && binReports.map((report) => (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => setSelectedBinId(report.id)}
                    style={markerPosition(approximateBinCoordinates(report))}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 shadow-md ring-2 ring-white ${report.id === selectedBinId ? 'bg-amber-800 text-white z-30 scale-110' : 'bg-amber-500 text-white z-20'}`}
                    title={`Reported recycling bin: ${report.location} (${report.status})`}
                    aria-label={`Show reported bin ${report.location}`}
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-[11px] border-t border-slate-100">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setShowCentresOnMap((visible) => !visible)} className={`inline-flex items-center gap-1.5 font-semibold ${showCentresOnMap ? 'text-emerald-800' : 'text-slate-400'}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Recycling centres ({RECYCLING_CENTRES.length})
                </button>
                <button type="button" onClick={() => setShowBinsOnMap((visible) => !visible)} className={`inline-flex items-center gap-1.5 font-semibold ${showBinsOnMap ? 'text-amber-800' : 'text-slate-400'}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Reported bins ({binReports.length})
                </button>
              </div>
              <a className="text-sky-700 hover:underline" target="_blank" rel="noreferrer" href={`https://www.openstreetmap.org/?bbox=${mapBounds.west}%2C${mapBounds.south}%2C${mapBounds.east}%2C${mapBounds.north}`}>
                Open interactive map ↗
              </a>
              <span className="w-full text-slate-500">Map data © OpenStreetMap contributors. Bin reports refresh every 10 seconds; campus-area pins may be approximate.</span>
              {selectedBin && <span className="w-full text-amber-900 font-semibold">Selected bin: {selectedBin.location} · {selectedBin.status} · {selectedBin.severity}</span>}
            </div>
          </div>

          {/* Detailed Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  {activeCentre.name}
                </h3>
                <p className="text-xs text-slate-500">{activeCentre.address}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {activeCentre.badge}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Operating Hours: <strong>{activeCentre.timings}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Contact: <strong>{activeCentre.phone}</strong></span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900">Drop-off Instructions:</span>
              <p className="text-slate-600">{activeCentre.instructions}</p>
            </div>

            {actionNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold animate-fadeIn">
                {actionNotice}
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setActionNotice(`📍 Routing to ${activeCentre.name} (${activeCentre.distanceKm} km). Estimated walking time: ${Math.round(activeCentre.distanceKm * 14)} mins via NH10.`);
                  setTimeout(() => setActionNotice(null), 5000);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Walking Directions</span>
              </button>

              <button
                onClick={() => {
                  setActionNotice(`📞 Contacting facility desk: ${activeCentre.phone} (${activeCentre.timings})`);
                  setTimeout(() => setActionNotice(null), 5000);
                }}
                className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Call Center</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

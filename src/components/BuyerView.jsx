import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  User, 
  ExternalLink, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  FlaskConical, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Search, 
  Loader2, 
  AlertCircle,
  Share2,
  FileCheck2,
  Award,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { fetchBatchFromTzKT } from '../services/tezos';
import { DEMO_BATCHES } from '../data/demoBatches';
import { TZKT_EXPLORER_URL, CONTRACT_ADDRESS, NETWORK } from '../config';

export default function BuyerView({
  batchIdParam,
  onNavigateToProducer,
  onBatchChange,
}) {
  const [currentBatchId, setCurrentBatchId] = useState(batchIdParam || 'BATCH-TEA-8942');
  const [searchInput, setSearchInput] = useState(batchIdParam || 'BATCH-TEA-8942');
  const [batchData, setBatchData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (isDemoMode && DEMO_BATCHES[currentBatchId]) {
          if (!isCancelled) {
            setBatchData({
              ...DEMO_BATCHES[currentBatchId],
              source: 'demo',
            });
            setIsLoading(false);
          }
          return;
        }

        const data = await fetchBatchFromTzKT(currentBatchId);
        if (!isCancelled) {
          if (data) {
            setBatchData(data);
          } else {
            setError(`No verified blockchain record found for batch "${currentBatchId}".`);
            setBatchData(null);
          }
        }
      } catch (err) {
        console.error('Failed to load batch', err);
        if (!isCancelled) {
          setError('Unable to contact Tezos indexer. Please verify network or enable Demo Mode.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [currentBatchId, isDemoMode]);

  useEffect(() => {
    if (batchIdParam && batchIdParam !== currentBatchId) {
      setCurrentBatchId(batchIdParam);
      setSearchInput(batchIdParam);
    }
  }, [batchIdParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const clean = searchInput.trim().toUpperCase();
      setCurrentBatchId(clean);
      if (onBatchChange) onBatchChange(clean);
    }
  };

  const handleSelectDemoBatch = (demoKey) => {
    setIsDemoMode(true);
    setCurrentBatchId(demoKey);
    setSearchInput(demoKey);
    if (onBatchChange) onBatchChange(demoKey);
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/?batch=${encodeURIComponent(currentBatchId)}`;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // fallback
    }
  };

  const getStageMeta = (stageName = '') => {
    const s = stageName.toLowerCase();
    if (s.includes('harvest') || s.includes('register')) {
      return {
        icon: <Calendar className="w-3.5 h-3.5" />,
        badgeBg: 'bg-stone-100 text-stone-800 border-stone-200',
        dotBg: 'bg-forest-600',
      };
    }
    if (s.includes('pack')) {
      return {
        icon: <Package className="w-3.5 h-3.5" />,
        badgeBg: 'bg-amber-50 text-amber-900 border-amber-200/80',
        dotBg: 'bg-amber-600',
      };
    }
    if (s.includes('inspect')) {
      return {
        icon: <FlaskConical className="w-3.5 h-3.5" />,
        badgeBg: 'bg-sky-50 text-sky-900 border-sky-200/80',
        dotBg: 'bg-sky-600',
      };
    }
    if (s.includes('transit')) {
      return {
        icon: <Truck className="w-3.5 h-3.5" />,
        badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200/80',
        dotBg: 'bg-indigo-600',
      };
    }
    if (s.includes('deliver')) {
      return {
        icon: <Check className="w-3.5 h-3.5" />,
        badgeBg: 'bg-forest-100 text-forest-900 border-forest-200',
        dotBg: 'bg-forest-700',
      };
    }
    return {
      icon: <Clock className="w-3.5 h-3.5" />,
      badgeBg: 'bg-stone-100 text-stone-800 border-stone-200',
      dotBg: 'bg-stone-500',
    };
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return 'Recorded';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] pb-24">
      
      {/* Top Mobile Bar: Navigation & Demo Controls */}
      <div className="bg-[#FAF9F5]/90 border-b border-stone-200/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={onNavigateToProducer}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 transition bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-subtle"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-stone-500" />
            <span>Producer Workspace</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border border-stone-200 bg-white shadow-subtle hover:bg-stone-50 transition"
            >
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-forest-600' : 'bg-stone-300'}`} />
              <span className="text-stone-700 font-semibold text-[11px]">
                Demo Mode: {isDemoMode ? 'Active' : 'Off'}
              </span>
            </button>

            <button
              onClick={handleShare}
              title="Share verification passport link"
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-white rounded-xl border border-stone-200 shadow-subtle transition"
            >
              {copiedLink ? <Check className="w-4 h-4 text-forest-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Search & Sample Batch Selector */}
        <div className="space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Batch ID (e.g. BATCH-TEA-8942)"
                className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 uppercase shadow-subtle transition"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-forest-900 hover:bg-forest-800 text-stone-50 rounded-xl text-xs font-semibold shadow-subtle transition"
            >
              Verify
            </button>
          </form>

          {/* Sample Batches */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 font-mono text-[10px] uppercase tracking-wider whitespace-nowrap">
              Curated:
            </span>
            <button
              onClick={() => handleSelectDemoBatch('BATCH-TEA-8942')}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition whitespace-nowrap ${
                currentBatchId === 'BATCH-TEA-8942'
                  ? 'bg-forest-900 text-stone-50 border-forest-900 shadow-subtle'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              🍃 Nilgiri Reserve Tea
            </button>
            <button
              onClick={() => handleSelectDemoBatch('BATCH-COFFEE-3021')}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition whitespace-nowrap ${
                currentBatchId === 'BATCH-COFFEE-3021'
                  ? 'bg-forest-900 text-stone-50 border-forest-900 shadow-subtle'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              ☕ Arabica Coffee
            </button>
            <button
              onClick={() => handleSelectDemoBatch('BATCH-SAFFRON-1049')}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition whitespace-nowrap ${
                currentBatchId === 'BATCH-SAFFRON-1049'
                  ? 'bg-forest-900 text-stone-50 border-forest-900 shadow-subtle'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              🌸 Kashmiri Saffron
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-subtle space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-forest-700 mx-auto" />
            <h3 className="font-serif text-base text-stone-800 font-medium">
              Verifying Cryptographic Provenance...
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Connecting with Tezos Ghostnet BigMap indexer to validate immutable batch stamps.
            </p>
          </div>
        )}

        {/* Error / Not Found */}
        {!isLoading && error && (
          <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 shadow-subtle space-y-4">
            <div className="w-12 h-12 bg-stone-100 text-stone-600 rounded-xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-stone-900 font-medium">
              Record Not Found on Ledger
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              {error}
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleSelectDemoBatch('BATCH-TEA-8942')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest-900 text-stone-50 text-xs font-semibold rounded-xl shadow-subtle hover:bg-forest-800 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-forest-300" />
                <span>Load Verified Nilgiri Tea Passport</span>
              </button>
            </div>
          </div>
        )}

        {/* Provenance Passport Presentation */}
        {!isLoading && batchData && (
          <div className="space-y-6">
            
            {/* Physical Certificate Style Passport Hero */}
            <div className="bg-[#FFFDF9] border border-stone-300/80 rounded-2xl p-6 sm:p-8 shadow-card relative overflow-hidden">
              
              {/* Top Certificate Stamp */}
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-forest-700" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-forest-800 font-bold">
                    Authenticated Provenance • Tezos Ghostnet
                  </span>
                </div>
                <span className="font-mono text-[11px] text-stone-400 font-medium">
                  ID: {batchData.batchId}
                </span>
              </div>

              {/* Title & Terroir */}
              <div className="space-y-3">
                <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal leading-tight">
                  {batchData.productName}
                </h1>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="text-xs font-semibold text-stone-800">
                    Producer: <span className="font-serif italic font-normal text-forest-900 text-sm">{batchData.producerName}</span>
                  </div>
                  <span className="text-stone-300">•</span>
                  <div className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{batchData.originLocation}</span>
                  </div>
                </div>

                {batchData.description && (
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-2 border-t border-stone-100 font-normal">
                    {batchData.description}
                  </p>
                )}

                {/* Certifications & Badges */}
                {batchData.certifications && batchData.certifications.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-3">
                    {batchData.certifications.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[11px] font-medium bg-forest-50 text-forest-900 px-2.5 py-1 rounded-full border border-forest-200/60"
                      >
                        <Award className="w-3 h-3 text-forest-700" />
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* On-Chain Footer Seal */}
              <div className="mt-6 pt-4 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-stone-400" />
                  <span>BigMap Registry:</span>
                  <a
                    href={`${TZKT_EXPLORER_URL}/${CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-forest-700 hover:underline font-semibold flex items-center gap-0.5"
                  >
                    <span>
                      {CONTRACT_ADDRESS
                        ? `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`
                        : 'Ghostnet Ledger'}
                    </span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                <div className="text-stone-400">
                  Harvested: {formatDate(batchData.registeredAt)}
                </div>
              </div>

            </div>

            {/* Vertical Milestone Journey */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-7 shadow-subtle space-y-6">
              
              <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
                <div>
                  <h3 className="font-serif text-lg text-stone-900 font-medium">
                    Journey Milestones
                  </h3>
                  <p className="text-xs text-stone-500">
                    Physical checkpoints signed into the Tezos ledger
                  </p>
                </div>
                <span className="font-mono text-xs text-stone-400 font-medium">
                  {batchData.events?.length || 0} Checkpoints
                </span>
              </div>

              {/* Timeline Items */}
              <div className="relative pl-6 sm:pl-7 space-y-7 before:absolute before:left-2 sm:before:left-2.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-stone-200">
                {batchData.events && batchData.events.length > 0 ? (
                  batchData.events.map((evt, idx) => {
                    const meta = getStageMeta(evt.stage);
                    const isLatest = idx === batchData.events.length - 1;

                    return (
                      <div key={evt.id || idx} className="relative group">
                        
                        {/* Dot on the line */}
                        <div className={`absolute -left-6 sm:-left-7 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${meta.dotBg}`}>
                          <span className="w-1 h-1 rounded-full bg-white" />
                        </div>

                        {/* Event Card */}
                        <div className="space-y-1.5">
                          
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-md border ${meta.badgeBg}`}>
                                {evt.stage}
                              </span>
                              {isLatest && (
                                <span className="font-mono text-[10px] text-forest-700 bg-forest-50 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                                  Current Station
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-stone-400">
                              {formatDate(evt.timestamp)}
                            </span>
                          </div>

                          {evt.location && (
                            <div className="text-xs font-semibold text-stone-800 flex items-center gap-1 pt-0.5">
                              <MapPin className="w-3 h-3 text-stone-400" />
                              <span>{evt.location}</span>
                            </div>
                          )}

                          {evt.notes && (
                            <p className="text-xs text-stone-600 bg-stone-50/80 p-3 rounded-xl border border-stone-100 leading-relaxed">
                              {evt.notes}
                            </p>
                          )}

                          {/* Cryptographic Link */}
                          <div className="pt-1 flex items-center justify-between text-[11px] text-stone-400 font-mono">
                            {evt.actor && (
                              <span className="truncate max-w-[200px]">
                                Signed: <span className="text-stone-600">{evt.actor}</span>
                              </span>
                            )}
                            {evt.txHash && (
                              <a
                                href={`${TZKT_EXPLORER_URL}/${evt.txHash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-forest-700 hover:underline flex items-center gap-1 font-semibold ml-auto"
                              >
                                <span>Proof {evt.txHash.slice(0, 6)}...</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>

                        </div>

                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-stone-400 py-3">No journey checkpoints logged.</div>
                )}
              </div>

            </div>

            {/* Bottom Certificate Verification Guarantee */}
            <div className="p-5 bg-stone-100/70 border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h4 className="font-semibold text-xs text-stone-800">
                  Are you a participating estate or certifier?
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Authorized checkpoints can append verified events directly from the Producer Portal.
                </p>
              </div>
              <button
                onClick={onNavigateToProducer}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold rounded-xl transition shadow-subtle whitespace-nowrap"
              >
                Return to Portal
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Plus, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Package, 
  MapPin, 
  User, 
  CheckCircle, 
  Loader2, 
  Layers, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  FileText,
  Truck,
  ArrowUpRight,
  HelpCircle,
  Hash
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRGeneratorCard from './QRGeneratorCard';
import { registerBatchOnChain, addJourneyEventOnChain, isConfiguredContractValid } from '../services/tezos';
import { getStoredBatches, DEMO_BATCHES } from '../data/demoBatches';
import { CONTRACT_ADDRESS } from '../config';

export default function ProducerPortal({
  walletAddress,
  onConnectWallet,
  onNotify,
  onOpenBuyerVerification,
}) {
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'event'

  // Register Form State
  const [batchId, setBatchId] = useState('');
  const [productName, setProductName] = useState('');
  const [producerName, setProducerName] = useState('');
  const [originLocation, setOriginLocation] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Event Form State
  const [eventBatchId, setEventBatchId] = useState('');
  const [stage, setStage] = useState('Packed');
  const [eventLocation, setEventLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // QR Code display state
  const [lastRegisteredBatch, setLastRegisteredBatch] = useState(null);

  // Auto-generate unique Batch ID
  const handleAutoGenerateId = () => {
    const prefixes = ['TEA', 'COF', 'SAF', 'HON', 'SPI'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newId = `BATCH-${randomPrefix}-${randomDigits}`;
    setBatchId(newId);
  };

  // Sample batch pre-filler
  const handleLoadSampleBatch = () => {
    setBatchId(`BATCH-TEA-${Math.floor(1000 + Math.random() * 9000)}`);
    setProductName('Nilgiri High-Grown Frost Green Tea');
    setProducerName('Highland Organics Estate');
    setOriginLocation('Ooty, Nilgiris, Tamil Nadu, India (2,240m)');
  };

  // Handle Register Batch
  const handleRegisterBatch = async (e) => {
    e.preventDefault();

    if (!batchId.trim()) {
      onNotify({ type: 'error', title: 'Batch ID Required', message: 'Please enter or generate a unique Batch ID.' });
      return;
    }
    if (!productName.trim() || !producerName.trim() || !originLocation.trim()) {
      onNotify({ type: 'error', title: 'Missing Fields', message: 'Please provide all product and origin details.' });
      return;
    }

    setIsRegistering(true);
    try {
      const res = await registerBatchOnChain({
        batchId: batchId.trim().toUpperCase(),
        productName: productName.trim(),
        producerName: producerName.trim(),
        originLocation: originLocation.trim(),
        userAddress: walletAddress,
      });

      if (res.success) {
        setLastRegisteredBatch(res.batch);
        setEventBatchId(res.batch.batchId);

        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#285236', '#478159', '#9FBFA9', '#2C7DF7'],
          });
        } catch {
          // ignore
        }

        onNotify({
          type: 'success',
          title: 'Batch Registered on Ghostnet',
          message: res.isSimulated
            ? `Batch ${res.batch.batchId} recorded to ledger with simulated confirmation.`
            : `Batch ${res.batch.batchId} confirmed on Ghostnet blockchain!`,
          txHash: res.opHash,
        });

        setProductName('');
        setProducerName('');
        setOriginLocation('');
      }
    } catch (err) {
      console.error(err);
      onNotify({
        type: 'error',
        title: 'Registration Failed',
        message: err.message || 'Failed to submit batch to Tezos.',
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle Add Journey Event
  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!eventBatchId.trim()) {
      onNotify({ type: 'error', title: 'Missing Batch ID', message: 'Please specify the Batch ID for this milestone.' });
      return;
    }
    if (!eventLocation.trim()) {
      onNotify({ type: 'error', title: 'Missing Location', message: 'Please enter the checkpoint location.' });
      return;
    }

    setIsAddingEvent(true);
    try {
      const res = await addJourneyEventOnChain({
        batchId: eventBatchId.trim().toUpperCase(),
        stage,
        location: eventLocation.trim(),
        notes: notes.trim() || `Milestone logged: ${stage}`,
        userAddress: walletAddress,
      });

      if (res.success) {
        onNotify({
          type: 'success',
          title: `Milestone Recorded (${stage})`,
          message: `Checkpoint verified on Tezos Ghostnet for ${eventBatchId}.`,
          txHash: res.opHash,
        });

        setNotes('');
        setEventLocation('');

        if (lastRegisteredBatch && lastRegisteredBatch.batchId === eventBatchId.trim().toUpperCase()) {
          setLastRegisteredBatch(prev => ({
            ...prev,
            events: [...(prev.events || []), res.event],
          }));
        }
      }
    } catch (err) {
      console.error(err);
      onNotify({
        type: 'error',
        title: 'Milestone Logging Error',
        message: err.message || 'Failed to record event to blockchain.',
      });
    } finally {
      setIsAddingEvent(false);
    }
  };

  const storedBatches = getStoredBatches();
  const allBatches = { ...DEMO_BATCHES, ...storedBatches };
  const recentBatchKeys = Object.keys(allBatches);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Editorial Hero Header */}
      <div className="border-b border-stone-200/80 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-forest-700">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
            Decentralized Commodity Provenance
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
            Record harvests, certify checkpoints, and mint physical passports.
          </h1>
          <p className="text-stone-600 text-sm leading-relaxed pt-1">
            OriginChain connects farm-level harvesting directly to the Tezos Ghostnet blockchain. Every batch receives an immutable smart contract record and customer-verifiable QR certificate.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex-shrink-0 flex items-center gap-2 text-xs font-mono bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-subtle">
          <span className="text-stone-400">Ledger:</span>
          <span className="text-forest-800 font-semibold">Tezos Ghostnet</span>
          <span className="text-stone-300">•</span>
          <span className="text-stone-500">BigMap Indexer</span>
        </div>
      </div>

      {/* Main Grid: Management Workspace & Certificate / Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Management Forms */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-subtle overflow-hidden">
            
            {/* Segmented Sub-tabs */}
            <div className="p-2 border-b border-stone-100 bg-stone-50/70 flex gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition duration-150 flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'bg-white text-stone-900 font-semibold shadow-subtle border border-stone-200/60'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Plus className="w-4 h-4 text-forest-600" />
                <span>1. Register Product Batch</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('event')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition duration-150 flex items-center justify-center gap-2 ${
                  activeTab === 'event'
                    ? 'bg-white text-stone-900 font-semibold shadow-subtle border border-stone-200/60'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Truck className="w-4 h-4 text-forest-600" />
                <span>2. Log Journey Event</span>
              </button>
            </div>

            {/* TAB 1: Register Product Batch */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterBatch} className="p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="font-semibold text-stone-900 text-sm">
                      New Batch Specification
                    </h3>
                    <p className="text-xs text-stone-500">
                      Smart contract call: <code className="font-mono text-forest-700 bg-forest-50 px-1 py-0.5 rounded text-[11px]">register_batch</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadSampleBatch}
                    className="text-xs text-stone-600 hover:text-forest-800 flex items-center gap-1.5 bg-stone-100/80 hover:bg-forest-50 px-2.5 py-1.5 rounded-lg border border-stone-200/80 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                    <span>Auto-Fill Sample</span>
                  </button>
                </div>

                {/* Batch ID */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    Batch Identifier / Lot Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Hash className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value.toUpperCase())}
                        placeholder="e.g. BATCH-TEA-8942"
                        className="w-full pl-9 pr-3 py-2 bg-stone-50/70 border border-stone-200 rounded-xl font-mono text-xs sm:text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 uppercase transition"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoGenerateId}
                      className="px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-subtle"
                    >
                      <RefreshCw className="w-3 h-3 text-stone-500" />
                      <span>Generate</span>
                    </button>
                  </div>
                </div>

                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    Product Name & Grade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Organic Nilgiri Single-Estate Green Tea (Silver Tips)"
                    className="w-full px-3.5 py-2 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 transition"
                    required
                  />
                </div>

                {/* Producer & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-700">
                      Producer / Estate Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={producerName}
                      onChange={(e) => setProducerName(e.target.value)}
                      placeholder="e.g. Highland Organics Estate"
                      className="w-full px-3.5 py-2 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 transition"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-700">
                      Origin Location & Terroir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={originLocation}
                      onChange={(e) => setOriginLocation(e.target.value)}
                      placeholder="e.g. Ooty, Nilgiris, Tamil Nadu, India"
                      className="w-full px-3.5 py-2 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 transition"
                      required
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-3 px-5 rounded-xl font-semibold text-xs sm:text-sm text-stone-50 bg-forest-900 hover:bg-forest-800 active:scale-[0.99] transition shadow-subtle flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-forest-300" />
                        <span>Signing & Committing to Tezos Ghostnet...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-forest-300" />
                        <span>Register Batch & Mint Origin Passport</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Add Journey Event */}
            {activeTab === 'event' && (
              <form onSubmit={handleAddEvent} className="p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="font-semibold text-stone-900 text-sm">
                      Log Journey Milestone
                    </h3>
                    <p className="text-xs text-stone-500">
                      Smart contract call: <code className="font-mono text-forest-700 bg-forest-50 px-1 py-0.5 rounded text-[11px]">add_event</code>
                    </p>
                  </div>
                </div>

                {/* Target Batch ID */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    Target Batch Identifier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={eventBatchId}
                    onChange={(e) => setEventBatchId(e.target.value.toUpperCase())}
                    placeholder="e.g. BATCH-TEA-8942"
                    list="batches-datalist"
                    className="w-full px-3.5 py-2 bg-stone-50/70 border border-stone-200 rounded-xl font-mono text-xs sm:text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 uppercase transition"
                    required
                  />
                  <datalist id="batches-datalist">
                    {recentBatchKeys.map(k => (
                      <option key={k} value={k}>{allBatches[k]?.productName || k}</option>
                    ))}
                  </datalist>

                  {/* Quick Selectors */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase text-stone-400">Quick Pick:</span>
                    {recentBatchKeys.slice(0, 3).map(k => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setEventBatchId(k)}
                        className={`text-[11px] font-mono px-2 py-0.5 rounded border transition ${
                          eventBatchId === k
                            ? 'bg-forest-100 text-forest-800 border-forest-300 font-semibold'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stage Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    Milestone Stage <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 transition"
                  >
                    <option value="Packed">📦 Packed — Sealed & Serialized</option>
                    <option value="Inspected">🔬 Inspected — Lab Quality Certified</option>
                    <option value="In Transit">🚚 In Transit — Logistics Dispatch</option>
                    <option value="Delivered">✅ Delivered — Final Hub Received</option>
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    Checkpoint Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Export Terminal, Chennai Sea Port"
                    className="w-full px-3.5 py-2 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 transition"
                    required
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    Inspection / Handover Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g. Temperature sustained at 16°C. Tamper-evident seal #8841 verified intact."
                    className="w-full px-3.5 py-2 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-700 transition"
                  />
                </div>

                {/* Submit Event */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAddingEvent}
                    className="w-full py-3 px-5 rounded-xl font-semibold text-xs sm:text-sm text-stone-50 bg-forest-900 hover:bg-forest-800 active:scale-[0.99] transition shadow-subtle flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAddingEvent ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-forest-300" />
                        <span>Recording Milestone on Blockchain...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-forest-300" />
                        <span>Append Checkpoint to Tezos BigMap</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Wallet Guide Hint */}
          {!walletAddress && (
            <div className="bg-stone-100/80 border border-stone-200 rounded-xl p-4 text-xs text-stone-600 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-stone-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="font-semibold text-stone-800">
                  Wallet Optional (Simulated Ledger Active)
                </div>
                <p className="text-stone-500 leading-relaxed">
                  You can register batches and log events immediately with simulated Tezos operation hashes. To sign transactions live on Ghostnet, click "Connect Wallet" in the header.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Physical Label Preview & Ledger Explorer */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* QR Card */}
          {lastRegisteredBatch ? (
            <QRGeneratorCard
              batch={lastRegisteredBatch}
              onOpenBuyerVerification={onOpenBuyerVerification}
            />
          ) : (
            <div className="bg-white border border-stone-200 rounded-2xl p-7 text-center space-y-3 shadow-subtle">
              <div className="w-12 h-12 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base text-stone-900 font-medium">
                Consumer QR Passport Preview
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                Register a new batch or choose an existing record to generate a high-resolution, printable provenance certificate.
              </p>
              <button
                type="button"
                onClick={() => setLastRegisteredBatch(DEMO_BATCHES['BATCH-TEA-8942'])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-semibold rounded-lg border border-stone-200 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-forest-600" />
                <span>Preview Sample Passport (Nilgiri Tea)</span>
              </button>
            </div>
          )}

          {/* Registered Ledger History */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-subtle p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-forest-700" />
                <h4 className="font-mono text-xs uppercase tracking-wider text-stone-600 font-semibold">
                  Known Batches on Node
                </h4>
              </div>
              <span className="font-mono text-[11px] text-stone-400">
                {recentBatchKeys.length} Batches
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {recentBatchKeys.map((key) => {
                const b = allBatches[key];
                return (
                  <div
                    key={key}
                    className="p-3 rounded-xl border border-stone-100 hover:border-forest-200 hover:bg-forest-50/30 transition duration-150 flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-stone-800 group-hover:text-forest-800 transition">
                          {b.batchId}
                        </span>
                        {b.certifications && (
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-medium">
                            Certified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 truncate mt-0.5 font-medium">
                        {b.productName}
                      </p>
                      <p className="text-[11px] text-stone-400 truncate">
                        {b.producerName}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setLastRegisteredBatch(b);
                          setEventBatchId(b.batchId);
                        }}
                        title="Display Passport QR"
                        className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
                      >
                        <Package className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenBuyerVerification(b.batchId)}
                        title="Inspect Buyer Verification Page"
                        className="p-1.5 text-stone-400 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

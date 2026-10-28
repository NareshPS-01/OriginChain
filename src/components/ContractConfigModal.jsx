import React, { useState } from 'react';
import { X, Cpu, Check, Copy, ExternalLink, Code2 } from 'lucide-react';
import { CONTRACT_ADDRESS, NETWORK, RPC_URL, TZKT_EXPLORER_URL } from '../config';

export default function ContractConfigModal({ isOpen, onClose }) {
  const [copiedPy, setCopiedPy] = useState(false);

  if (!isOpen) return null;

  const smartPyCode = `# OriginChain SmartPy Smart Contract
import smartpy as sp

@sp.module
def main():
    class OriginChain(sp.Contract):
        def __init__(self, admin):
            self.data.admin = admin
            self.data.batches = sp.big_map({})

        @sp.entrypoint
        def register_batch(self, params):
            sp.cast(params.batch_id, sp.string)
            sp.cast(params.product_name, sp.string)
            sp.cast(params.producer_name, sp.string)
            sp.cast(params.origin_location, sp.string)
            assert not self.data.batches.contains(params.batch_id), "BATCH_ALREADY_EXISTS"

            initial_event = sp.record(
                stage = "Harvested & Registered",
                location = params.origin_location,
                notes = "Batch initialized on OriginChain ledger",
                timestamp = sp.now,
                actor = params.producer_name,
                tx_sender = sp.sender
            )
            self.data.batches[params.batch_id] = sp.record(
                product_name = params.product_name,
                producer_name = params.producer_name,
                origin_location = params.origin_location,
                producer_address = sp.sender,
                timestamp = sp.now,
                events = [initial_event]
            )

        @sp.entrypoint
        def add_event(self, params):
            sp.cast(params.batch_id, sp.string)
            sp.cast(params.stage, sp.string)
            sp.cast(params.location, sp.string)
            sp.cast(params.notes, sp.string)
            assert self.data.batches.contains(params.batch_id), "BATCH_NOT_FOUND"

            batch = self.data.batches[params.batch_id]
            new_event = sp.record(
                stage = params.stage,
                location = params.location,
                notes = params.notes,
                timestamp = sp.now,
                actor = "Authorized Checkpoint",
                tx_sender = sp.sender
            )
            batch.events.push(new_event)
            self.data.batches[params.batch_id] = batch`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPy(true);
    setTimeout(() => setCopiedPy(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF9F5] w-full max-w-xl rounded-2xl shadow-elevated border border-stone-300 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-forest-700" />
            <h3 className="font-serif text-base text-stone-900 font-medium">
              Smart Contract & Network Parameters
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          <div className="bg-white rounded-xl p-4 border border-stone-200 space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">CONTRACT_ADDRESS:</span>
              <span className="font-semibold text-stone-900">{CONTRACT_ADDRESS}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">NETWORK:</span>
              <span className="font-semibold text-forest-800">{NETWORK}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">RPC_URL:</span>
              <span className="text-stone-600 truncate max-w-[260px]">{RPC_URL}</span>
            </div>
          </div>

          <div className="bg-forest-50 border border-forest-200/70 rounded-xl p-4 text-xs text-forest-900 leading-relaxed space-y-1">
            <div className="font-semibold text-[11px] uppercase tracking-wider text-forest-800">
              HYBRID ON-CHAIN & BIGMAP INDEXER ARCHITECTURE
            </div>
            <p className="text-forest-800/90 text-[11px]">
              OriginChain records batch provenance onto Tezos Ghostnet while maintaining a synchronized local state cache for instant, zero-latency QR passport verification.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-stone-500" />
                SmartPy Contract (contracts/OriginChain.py)
              </span>
              <button
                onClick={() => copyToClipboard(smartPyCode)}
                className="text-xs text-forest-700 hover:text-forest-900 font-semibold flex items-center gap-1"
              >
                {copiedPy ? <Check className="w-3.5 h-3.5 text-forest-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPy ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-3.5 bg-stone-900 text-stone-200 rounded-xl text-[11px] font-mono overflow-x-auto max-h-44 border border-stone-800">
              {smartPyCode}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

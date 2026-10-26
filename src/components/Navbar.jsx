import React from 'react';
import { Leaf, Wallet, LogOut, ExternalLink, ShieldCheck, QrCode, Cpu, Check, Copy } from 'lucide-react';
import { NETWORK, TZKT_EXPLORER_URL, CONTRACT_ADDRESS } from '../config';

export default function Navbar({
  walletAddress,
  walletBalance,
  isConnecting,
  onConnect,
  onDisconnect,
  currentView,
  onViewChange,
  onOpenContractModal,
}) {
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/85 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewChange('producer')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-900 text-stone-100 flex items-center justify-center shadow-subtle group-hover:bg-forest-800 transition duration-200">
                <Leaf className="w-5 h-5 text-forest-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif italic text-2xl tracking-tight text-stone-900 font-semibold group-hover:text-forest-800 transition">
                    Origin<span className="font-sans not-italic text-forest-700 font-bold text-xl ml-0.5">Chain</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wider uppercase bg-forest-100/70 text-forest-800 border border-forest-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-pulse" />
                    {NETWORK}
                  </span>
                </div>
                <p className="text-[11px] font-normal text-stone-500 hidden md:block tracking-wide">
                  Product Provenance & Physical-to-Digital Ledger
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation: Segmented Switcher */}
          <nav className="flex items-center bg-stone-200/60 p-1 rounded-xl border border-stone-300/40">
            <button
              onClick={() => onViewChange('producer')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition duration-200 ${
                currentView === 'producer'
                  ? 'bg-white text-stone-900 shadow-subtle font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${currentView === 'producer' ? 'text-forest-700' : 'text-stone-400'}`} />
              <span>Producer Portal</span>
            </button>
            <button
              onClick={() => onViewChange('buyer')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition duration-200 ${
                currentView === 'buyer'
                  ? 'bg-white text-stone-900 shadow-subtle font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <QrCode className={`w-4 h-4 ${currentView === 'buyer' ? 'text-forest-700' : 'text-stone-400'}`} />
              <span>Buyer Passport</span>
            </button>
          </nav>

          {/* Right Action: Smart Contract Info & Tezos Wallet */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenContractModal}
              title="Inspect SmartPy Contract & Ghostnet Setup"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100/70 hover:bg-stone-200/60 border border-stone-200 rounded-xl transition duration-150"
            >
              <Cpu className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-mono text-[11px] text-stone-600">
                {CONTRACT_ADDRESS && CONTRACT_ADDRESS !== 'KT1YourContractAddressHere'
                  ? `${CONTRACT_ADDRESS.slice(0, 5)}...${CONTRACT_ADDRESS.slice(-4)}`
                  : 'Contract Info'}
              </span>
            </button>

            {walletAddress ? (
              <div className="flex items-center gap-1.5 bg-white border border-stone-200/80 rounded-xl p-1 shadow-subtle">
                <a
                  href={`${TZKT_EXPLORER_URL}/${walletAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  title="View on TzKT Ghostnet Explorer"
                  className="flex items-center gap-2 px-2.5 py-1 text-xs font-mono text-stone-800 hover:text-forest-700 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-forest-500" />
                  <span className="font-medium">{shortAddress}</span>
                  {walletBalance && (
                    <span className="hidden sm:inline font-sans text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                      {walletBalance} ꜩ
                    </span>
                  )}
                  <ExternalLink className="w-3 h-3 text-stone-400 ml-0.5" />
                </a>

                <button
                  onClick={onDisconnect}
                  title="Disconnect Wallet"
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  aria-label="Disconnect"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                disabled={isConnecting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-stone-50 bg-forest-900 hover:bg-forest-800 active:scale-[0.98] transition shadow-subtle disabled:opacity-50"
              >
                <Wallet className="w-4 h-4 text-forest-300" />
                <span>{isConnecting ? 'Opening Beacon...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

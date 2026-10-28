import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ProducerPortal from './components/ProducerPortal';
import BuyerView from './components/BuyerView';
import NotificationBanner from './components/NotificationBanner';
import ContractConfigModal from './components/ContractConfigModal';
import { connectWallet, disconnectWallet, getActiveAccount } from './services/tezos';

export default function App() {
  const [currentView, setCurrentView] = useState('producer');
  const [activeBatchId, setActiveBatchId] = useState('');

  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const [notification, setNotification] = useState(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  // Parse URL on mount
  useEffect(() => {
    const parseUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const batchParam = params.get('batch');
      if (batchParam) {
        setActiveBatchId(batchParam.toUpperCase());
        setCurrentView('buyer');
      } else {
        setCurrentView('producer');
      }
    };

    parseUrlParams();
    window.addEventListener('popstate', parseUrlParams);
    return () => window.removeEventListener('popstate', parseUrlParams);
  }, []);

  // Check existing wallet session
  useEffect(() => {
    let isMounted = true;
    const checkActiveWallet = async () => {
      try {
        const account = await getActiveAccount();
        if (isMounted && account) {
          setWalletAddress(account.address);
          setWalletBalance(account.balance);
        }
      } catch (e) {
        console.warn('Initial active account lookup:', e);
      }
    };
    checkActiveWallet();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const res = await connectWallet();
      if (res.success) {
        setWalletAddress(res.address);
        setWalletBalance(res.balance);
        showNotification({
          type: 'success',
          title: res.isDemoWallet ? 'Connected (Ghostnet Demo)' : 'Wallet Connected',
          message: res.isDemoWallet
            ? `Connected with Ghostnet demo wallet (${res.address.slice(0, 6)}...${res.address.slice(-4)})`
            : `Connected to Ghostnet (${res.address.slice(0, 6)}...${res.address.slice(-4)})`,
        });
      } else {
        showNotification({
          type: 'error',
          title: 'Connection Cancelled',
          message: res.error || 'Wallet connection was cancelled or rejected.',
        });
      }
    } catch (err) {
      showNotification({
        type: 'error',
        title: 'Connection Error',
        message: err.message || 'Error occurred while connecting Beacon wallet.',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
      setWalletAddress(null);
      setWalletBalance(null);
      showNotification({
        type: 'info',
        title: 'Wallet Disconnected',
        message: 'Tezos wallet session cleared.',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const showNotification = useCallback((notif) => {
    setNotification(notif);
    if (notif.type !== 'error') {
      setTimeout(() => {
        setNotification((current) => (current === notif ? null : current));
      }, 5500);
    }
  }, []);

  const handleViewChange = (newView, batchIdToOpen = '') => {
    setCurrentView(newView);
    if (newView === 'buyer') {
      const targetId = batchIdToOpen || activeBatchId || 'BATCH-TEA-8942';
      setActiveBatchId(targetId);
      const url = new URL(window.location.href);
      url.searchParams.set('batch', targetId);
      window.history.pushState({}, '', url.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('batch');
      window.history.pushState({}, '', url.pathname);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 selection:bg-forest-900 selection:text-stone-50">
      
      {/* Top Navigation */}
      <Navbar
        walletAddress={walletAddress}
        walletBalance={walletBalance}
        isConnecting={isConnecting}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
        currentView={currentView}
        onViewChange={(v) => handleViewChange(v)}
        onOpenContractModal={() => setIsContractModalOpen(true)}
      />

      {/* Main Workspace / View */}
      <div className="flex-1">
        {currentView === 'producer' ? (
          <ProducerPortal
            walletAddress={walletAddress}
            onConnectWallet={handleConnectWallet}
            onNotify={showNotification}
            onOpenBuyerVerification={(id) => handleViewChange('buyer', id)}
          />
        ) : (
          <BuyerView
            batchIdParam={activeBatchId}
            onNavigateToProducer={() => handleViewChange('producer')}
            onBatchChange={(newId) => {
              setActiveBatchId(newId);
              const url = new URL(window.location.href);
              url.searchParams.set('batch', newId);
              window.history.pushState({}, '', url.toString());
            }}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white/70 py-6 text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-semibold text-stone-900 text-sm">OriginChain</span>
            <span className="text-stone-300">•</span>
            <span>Tezos Ghostnet Traceability & Provenance</span>
          </div>
          <div className="flex items-center gap-4 text-stone-600 font-medium text-[11px]">
            <button
              onClick={() => setIsContractModalOpen(true)}
              className="hover:text-forest-800 transition underline underline-offset-4"
            >
              Smart Contract
            </button>
            <a
              href="https://ghostnet.tzkt.io"
              target="_blank"
              rel="noreferrer"
              className="hover:text-forest-800 transition underline underline-offset-4"
            >
              TzKT Explorer
            </a>
            <a
              href="https://tezos.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-forest-800 transition underline underline-offset-4"
            >
              Tezos Ecosystem
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <ContractConfigModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
      />

      <NotificationBanner
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}

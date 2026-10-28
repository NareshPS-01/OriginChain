import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { CONTRACT_ADDRESS, NETWORK, RPC_URL, TZKT_API_URL } from '../config';
export { CONTRACT_ADDRESS, NETWORK, RPC_URL, TZKT_API_URL };
import { DEMO_BATCHES, getStoredBatches, saveStoredBatch } from '../data/demoBatches';

// Initialize Tezos Toolkit
export const Tezos = new TezosToolkit(RPC_URL);

// Singleton BeaconWallet instance
let beaconWallet = null;

// Realistic Ghostnet demo wallet fallback
export const DEMO_WALLET_ADDRESS = 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb';

export const getBeaconWallet = () => {
  if (typeof window === 'undefined') return null;
  
  if (!beaconWallet) {
    beaconWallet = new BeaconWallet({
      name: 'OriginChain: Product Journey Tracker',
      network: {
        type: NETWORK,
        rpcUrl: RPC_URL,
      },
      preferredNetwork: NETWORK,
      iconUrl: 'https://tezos.com/favicon.ico',
    });
    Tezos.setWalletProvider(beaconWallet);
  }
  return beaconWallet;
};

/**
 * Connect to Tezos Ghostnet via Beacon Wallet (Temple, Kukai, Umami, etc.)
 * Falls back cleanly to realistic Ghostnet demo wallet if Beacon is unavailable, declined, or throws
 */
export const connectWallet = async () => {
  try {
    const wallet = getBeaconWallet();
    if (!wallet) throw new Error('Beacon Wallet could not be initialized');

    // Request permissions for Ghostnet (network passed at instantiation, no args here)
    await wallet.requestPermissions();

    const activeAccount = await wallet.client.getActiveAccount();
    if (!activeAccount) {
      throw new Error('No active account returned from wallet');
    }

    const address = activeAccount.address;
    let balance = '0';

    try {
      const balanceMutez = await Tezos.tz.getBalance(address);
      balance = (balanceMutez.toNumber() / 1_000_000).toFixed(3);
    } catch (balErr) {
      console.warn('Could not fetch balance immediately:', balErr);
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('originchain_demo_wallet_connected');
    }

    return {
      success: true,
      address,
      balance,
      network: activeAccount.network?.type || NETWORK,
      isDemoWallet: false,
    };
  } catch (error) {
    console.warn('Beacon wallet connection failed or declined, falling back to demo Ghostnet wallet:', error);

    // Clean fallback to realistic Ghostnet demo wallet
    let fallbackBalance = '24.500';
    try {
      const balanceMutez = await Tezos.tz.getBalance(DEMO_WALLET_ADDRESS);
      fallbackBalance = (balanceMutez.toNumber() / 1_000_000).toFixed(3);
    } catch {
      // Use fallback default if testnet RPC is busy
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('originchain_demo_wallet_connected', 'true');
    }

    return {
      success: true,
      address: DEMO_WALLET_ADDRESS,
      balance: fallbackBalance,
      network: NETWORK,
      isDemoWallet: true,
    };
  }
};

/**
 * Disconnect wallet
 */
export const disconnectWallet = async () => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('originchain_demo_wallet_connected');
    }
    const wallet = getBeaconWallet();
    if (wallet) {
      await wallet.clearActiveAccount();
    }
    return { success: true };
  } catch (error) {
    console.error('Wallet disconnect error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get currently active account if already connected
 */
export const getActiveAccount = async () => {
  try {
    // Check if demo wallet was connected
    if (typeof window !== 'undefined' && localStorage.getItem('originchain_demo_wallet_connected') === 'true') {
      let balance = '24.500';
      try {
        const bal = await Tezos.tz.getBalance(DEMO_WALLET_ADDRESS);
        balance = (bal.toNumber() / 1_000_000).toFixed(3);
      } catch {
        // ignore
      }
      return {
        address: DEMO_WALLET_ADDRESS,
        balance,
        network: NETWORK,
        isDemoWallet: true,
      };
    }

    const wallet = getBeaconWallet();
    if (!wallet) return null;

    const account = await wallet.client.getActiveAccount();
    if (!account) return null;

    let balance = '0';
    try {
      const balanceMutez = await Tezos.tz.getBalance(account.address);
      balance = (balanceMutez.toNumber() / 1_000_000).toFixed(3);
    } catch {
      // Ignore initial balance fetch failure
    }

    return {
      address: account.address,
      balance,
      network: account.network?.type || NETWORK,
      isDemoWallet: false,
    };
  } catch (error) {
    console.warn('Error reading active account:', error);
    return null;
  }
};

/**
 * Generate a realistic simulated Tezos operation hash
 */
const generateSimulatedOpHash = () => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let hash = 'op';
  for (let i = 0; i < 49; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
};

/**
 * Check if the configured contract address is a real deployed Tezos KT1 address
 */
export const isConfiguredContractValid = () => {
  return CONTRACT_ADDRESS && CONTRACT_ADDRESS.startsWith('KT1') && CONTRACT_ADDRESS !== 'KT1YourContractAddressHere';
};

/**
 * Register a product batch on chain (calls contract entrypoint `register_batch`)
 * @param {Object} batchData { batchId, productName, producerName, originLocation, userAddress }
 */
export const registerBatchOnChain = async ({ batchId, productName, producerName, originLocation, userAddress }) => {
  const isRealContract = isConfiguredContractValid();

  // If real contract is configured, invoke actual entrypoint
  if (isRealContract) {
    try {
      const contract = await Tezos.wallet.at(CONTRACT_ADDRESS);
      
      // Smart contract entrypoint: register_batch
      // Expects (batch_id, product_name, producer_name, origin_location)
      let op;
      if (contract.methods.register_batch) {
        op = await contract.methods.register_batch(
          batchId,
          productName,
          producerName,
          originLocation
        ).send();
      } else if (contract.methodsObject && contract.methodsObject.register_batch) {
        op = await contract.methodsObject.register_batch({
          batch_id: batchId,
          product_name: productName,
          producer_name: producerName,
          origin_location: originLocation,
        }).send();
      } else {
        throw new Error('Entrypoint register_batch not found on contract');
      }

      await op.confirmation(1);

      const newBatch = {
        batchId,
        productName,
        producerName,
        originLocation,
        producerAddress: userAddress || CONTRACT_ADDRESS,
        registeredAt: new Date().toISOString(),
        txHash: op.opHash,
        events: [
          {
            id: 1,
            stage: 'Harvested & Registered',
            location: originLocation,
            timestamp: new Date().toISOString(),
            actor: producerName,
            notes: 'Batch initial registration on Tezos Ghostnet',
            txHash: op.opHash,
            status: 'Completed',
            verifier: userAddress,
          }
        ]
      };

      saveStoredBatch(newBatch);

      return {
        success: true,
        opHash: op.opHash,
        isSimulated: false,
        batch: newBatch,
      };
    } catch (err) {
      console.warn('Real contract call failed or cancelled by user, checking details:', err);
      // If user declined in wallet, rethrow user abort
      if (err.name === 'BeaconBroadcastError' || err.message?.includes('declined') || err.message?.includes('rejected')) {
        throw new Error('Transaction was rejected in your wallet.');
      }
      // Otherwise throw error so caller can display exact issue
      throw err;
    }
  }

  // Fallback simulation mode (when CONTRACT_ADDRESS is 'KT1YourContractAddressHere')
  // Simulates realistic blockchain delay & creates local persistence
  await new Promise(resolve => setTimeout(resolve, 1400));

  const simulatedOpHash = generateSimulatedOpHash();
  const newBatch = {
    batchId,
    productName,
    producerName,
    originLocation,
    producerAddress: userAddress || 'tz1GhostnetDemoProducer89X4aB2c7d9e',
    registeredAt: new Date().toISOString(),
    txHash: simulatedOpHash,
    events: [
      {
        id: 1,
        stage: 'Harvested & Registered',
        location: originLocation,
        timestamp: new Date().toISOString(),
        actor: producerName,
        notes: 'Batch registered to OriginChain ledger on Ghostnet testnet simulation',
        txHash: simulatedOpHash,
        status: 'Completed',
        verifier: userAddress || 'tz1GhostnetDemoProducer89X4aB2c7d9e',
      }
    ]
  };

  saveStoredBatch(newBatch);

  return {
    success: true,
    opHash: simulatedOpHash,
    isSimulated: true,
    batch: newBatch,
  };
};

/**
 * Add Journey Event on chain (calls contract entrypoint `add_event`)
 * @param {Object} eventData { batchId, stage, location, notes, userAddress }
 */
export const addJourneyEventOnChain = async ({ batchId, stage, location, notes, userAddress }) => {
  const isRealContract = isConfiguredContractValid();

  if (isRealContract) {
    try {
      const contract = await Tezos.wallet.at(CONTRACT_ADDRESS);

      let op;
      if (contract.methods.add_event) {
        op = await contract.methods.add_event(
          batchId,
          stage,
          location,
          notes
        ).send();
      } else if (contract.methodsObject && contract.methodsObject.add_event) {
        op = await contract.methodsObject.add_event({
          batch_id: batchId,
          stage,
          location,
          notes,
        }).send();
      } else {
        throw new Error('Entrypoint add_event not found on contract');
      }

      await op.confirmation(1);

      const eventItem = {
        id: Date.now(),
        stage,
        location,
        timestamp: new Date().toISOString(),
        actor: userAddress || 'Tezos Verified Node',
        notes,
        txHash: op.opHash,
        status: stage === 'Delivered' ? 'Delivered' : 'Completed',
        verifier: userAddress,
      };

      // Append to local storage record if present
      const stored = getStoredBatches();
      if (stored[batchId]) {
        stored[batchId].events = stored[batchId].events || [];
        stored[batchId].events.push(eventItem);
        saveStoredBatch(stored[batchId]);
      }

      return {
        success: true,
        opHash: op.opHash,
        isSimulated: false,
        event: eventItem,
      };
    } catch (err) {
      if (err.message?.includes('declined') || err.message?.includes('rejected')) {
        throw new Error('Transaction was rejected in your wallet.');
      }
      throw err;
    }
  }

  // Simulated mode
  await new Promise(resolve => setTimeout(resolve, 1200));
  const simulatedOpHash = generateSimulatedOpHash();

  const eventItem = {
    id: Date.now(),
    stage,
    location,
    timestamp: new Date().toISOString(),
    actor: userAddress || 'OriginChain Verified Dispatch',
    notes,
    txHash: simulatedOpHash,
    status: stage === 'Delivered' ? 'Delivered' : 'Completed',
    verifier: userAddress || 'tz1GhostnetDemoInspector44qP1',
  };

  const stored = getStoredBatches();
  if (stored[batchId]) {
    stored[batchId].events = stored[batchId].events || [];
    stored[batchId].events.push(eventItem);
    saveStoredBatch(stored[batchId]);
  } else if (DEMO_BATCHES[batchId]) {
    // Clone demo batch into local storage with new event
    const cloned = JSON.parse(JSON.stringify(DEMO_BATCHES[batchId]));
    cloned.events.push(eventItem);
    saveStoredBatch(cloned);
  } else {
    // Create skeleton batch
    const skeleton = {
      batchId,
      productName: `Product (${batchId})`,
      producerName: 'OriginChain Registered Farm',
      originLocation: location,
      producerAddress: userAddress || 'tz1GhostnetProducer',
      registeredAt: new Date().toISOString(),
      txHash: simulatedOpHash,
      events: [eventItem],
    };
    saveStoredBatch(skeleton);
  }

  return {
    success: true,
    opHash: simulatedOpHash,
    isSimulated: true,
    event: eventItem,
  };
};

/**
 * Fetch batch details directly and asynchronously from TzKT Ghostnet API
 * Endpoint: https://api.ghostnet.tzkt.io/v1/contracts/${CONTRACT_ADDRESS}/bigmaps/batches/keys/${batchId}
 */
export const fetchBatchFromTzKT = async (batchId) => {
  if (!batchId) return null;
  const cleanId = batchId.trim();

  // 1. Try real TzKT API if contract address is configured
  if (isConfiguredContractValid()) {
    try {
      const url = `${TZKT_API_URL}/contracts/${CONTRACT_ADDRESS}/bigmaps/batches/keys/${encodeURIComponent(cleanId)}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });

      if (res.ok) {
        const data = await res.json();
        if (data && (data.value || data.key)) {
          const val = data.value || {};
          return {
            source: 'tzkt',
            batchId: cleanId,
            productName: val.product_name || val.productName || 'Verified Product',
            producerName: val.producer_name || val.producerName || 'Verified Producer',
            originLocation: val.origin_location || val.originLocation || 'Verified Location',
            producerAddress: val.producer_address || val.producer || CONTRACT_ADDRESS,
            registeredAt: val.timestamp || val.registered_at || new Date().toISOString(),
            txHash: data.hash || val.tx_hash || null,
            events: Array.isArray(val.events) ? val.events.map((e, idx) => ({
              id: idx + 1,
              stage: e.stage || 'Checkpoint',
              location: e.location || 'Logged Station',
              notes: e.notes || '',
              timestamp: e.timestamp || new Date().toISOString(),
              txHash: e.tx_hash || e.hash || null,
              status: e.stage === 'Delivered' ? 'Delivered' : 'Completed',
              actor: e.actor || 'Authorized Actor',
            })) : [],
          };
        }
      }
    } catch (e) {
      console.warn('TzKT API query encountered an issue, falling back to local/demo dataset:', e);
    }
  }

  // 2. Check locally registered batches
  const stored = getStoredBatches();
  if (stored[cleanId]) {
    return {
      ...stored[cleanId],
      source: 'local',
    };
  }

  // 3. Check demo sample batches
  if (DEMO_BATCHES[cleanId]) {
    return {
      ...DEMO_BATCHES[cleanId],
      source: 'demo',
    };
  }

  return null;
};

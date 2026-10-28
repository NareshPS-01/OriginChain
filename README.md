# OriginChain: Product Journey Tracker 🌿⛓️

**OriginChain** is a decentralized product journey and supply-chain traceability platform built for the **Tezos Blockchain Hackathon**. It empowers producers, quality inspectors, logistics handlers, and end consumers to verify the authentic origin and lifecycle of agricultural commodities (such as single-estate tea, specialty coffee, and Kashmiri saffron) using Tezos Ghostnet smart contracts and TzKT BigMap indexing.

---

## 🚀 Key Features

### 1. View 1: Producer Portal (`/`)
- **Tezos Beacon Wallet Connection**: Seamlessly connects to Tezos Ghostnet using Temple, Kukai, or Umami wallets. Displays connected `tz1...` address and balance in ꜩ (XTZ).
- **Register Product Batch Form**:
  - Auto-generate unique batch IDs (`BATCH-TEA-XXXX`, etc.)
  - Captures Product Name, Producer / Estate Name, and Origin Location
  - Invokes smart contract entrypoint `register_batch`
- **Add Journey Event Form**:
  - Allows handlers to record checkpoints: `Packed`, `Inspected`, `In Transit`, `Delivered`
  - Captures Checkpoint Location and Inspector/Handler audit notes
  - Invokes smart contract entrypoint `add_event`
- **Consumer QR Generator Card**:
  - Automatically renders high-resolution scannable QR codes powered by `qrcode.react`
  - Encodes the buyer verification URL (`/?batch=BATCH_ID`)
  - One-click PNG download (`OriginChain-QR-{batchId}.png`) and link copy

### 2. View 2: Buyer Verification Page (`/?batch=BATCH_ID`)
- **Zero-Wallet Mobile Verification**: Clean consumer view that requires no crypto wallet.
- **TzKT Ghostnet API Asynchronous Query**: Directly queries `https://api.ghostnet.tzkt.io/v1/contracts/${CONTRACT_ADDRESS}/bigmaps/batches/keys/${batchId}` for sub-second retrieval.
- **Interactive Demo Mode**: One-click toggle with verified sample batches (Organic Nilgiri Single-Estate Green Tea, Artisan Arabica Coffee, Grade 1 Kashmiri Saffron) ensuring judges can evaluate the app instantly without testnet RPC latency.
- **Verified Authenticity Badge**: Shows cryptographic proof, origin coordinates, producer info, and TzKT explorer links.
- **Chronological Vertical Timeline**: Visual timeline with color-coded milestone badges, timestamping, verifier signatures, and transaction proofs.

---

## 🛠️ Tech Stack & Polyfills

- **Frontend**: React 18, Vite 6, Tailwind CSS
- **Tezos Integration**: `@taquito/taquito`, `@taquito/beacon-wallet`
- **Node Polyfills**: `vite-plugin-node-polyfills` configured in `vite.config.js` with `Buffer`, `process`, and `crypto` shims for Beacon SDK in browser.
- **Icons & QR**: `lucide-react`, `qrcode.react`, `canvas-confetti`

---

## 📁 Project Structure

```
originchain/
├── contracts/
│   └── OriginChain.py              # SmartPy smart contract source code
├── src/
│   ├── components/
│   │   ├── BuyerView.jsx           # Buyer mobile verification view (/?batch=...)
│   │   ├── ContractConfigModal.jsx # Smart contract inspector & SmartPy code
│   │   ├── Navbar.jsx              # Navigation, Tezos wallet connect, network pill
│   │   ├── NotificationBanner.jsx  # Alerts & TzKT transaction toasts
│   │   ├── ProducerPortal.jsx      # Batch registration & event logging forms
│   │   └── QRGeneratorCard.jsx     # Scannable QR passport generator & downloader
│   ├── data/
│   │   └── demoBatches.js          # Pre-loaded sample batches for instant judging
│   ├── services/
│   │   └── tezos.js                # BeaconWallet & Taquito contract services
│   ├── config.js                   # CONTRACT_ADDRESS & NETWORK configuration
│   ├── App.jsx                     # Root router & application controller
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Tailwind styles & theme variables
├── package.json
├── tailwind.config.js
└── vite.config.js                  # Vite configuration with Node Polyfills
```

---

## ⚙️ Configuration (`src/config.js`)

```javascript
export const CONTRACT_ADDRESS = 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5';
export const NETWORK = 'ghostnet';
export const RPC_URL = 'https://ghostnet.ecadinfra.com';
export const TZKT_API_URL = 'https://api.ghostnet.tzkt.io/v1';
export const TZKT_EXPLORER_URL = 'https://ghostnet.tzkt.io';
```

> **Hybrid On-Chain & BigMap Architecture**: OriginChain records batch provenance onto Tezos Ghostnet while maintaining a synchronized local state cache for instant, zero-latency QR passport verification. When a deployed KT1 contract address is supplied, it signs and broadcasts transactions to Ghostnet via Beacon Wallet.

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 📜 Tezos Smart Contract (SmartPy)

The contract is located at `contracts/OriginChain.py`:

```python
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
            self.data.batches[params.batch_id] = batch
```

---

## 🧪 Testing the User Flows

1. **Producer Workflow**:
   - Navigate to `/`
   - Click "Connect Tezos Wallet" (or use automated simulated mode)
   - Click "Generate" to create a unique Batch ID or "Auto-Fill Demo"
   - Click "Register Batch on Blockchain"
   - Observe the celebratory confetti and the newly rendered QR Passport
   - Switch to the "Add Journey Event" tab, select a stage (`Packed`, `Inspected`, `In Transit`, `Delivered`), add location and notes, and submit.
2. **Buyer Verification Workflow**:
   - Click "Open Buyer Verification Page" or scan the QR code pointing to `/?batch=BATCH_ID`
   - Observe the mobile-optimized verification screen displaying the "100% Genuine" badge, origin location, producer details, TzKT explorer links, and the full chronological vertical milestone history.
   - Use the "Demo Mode" toggle to switch between sample tea, coffee, and saffron batches.

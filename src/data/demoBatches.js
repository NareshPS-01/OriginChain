// Pre-loaded verified sample batches for Demo Mode & instant testing
export const DEMO_BATCHES = {
  'BATCH-TEA-8942': {
    batchId: 'BATCH-TEA-8942',
    productName: 'Organic Nilgiri Single-Estate Green Tea',
    producerName: 'Highland Organics Estate',
    originLocation: 'Ooty, Nilgiris, Tamil Nadu, India (Elevation: 2,240m)',
    producerAddress: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
    registeredAt: '2026-10-20T08:30:00Z',
    txHash: 'opC4uV9wQmY7XzE1K8rNtPfL3sDjG5hBvA6mK9qR2tXyZ',
    category: 'Highland Tea',
    certifications: ['India Organic (NPOP)', 'USDA Organic', 'Rainforest Alliance'],
    description: 'Hand-picked silver tips and tender two-leaf flushes harvested during the autumn frost period. Dried using wood-free solar dryers with zero synthetic fertilizers.',
    events: [
      {
        id: 1,
        stage: 'Harvested & Registered',
        location: 'Estate Field Block 4B, Ooty, Nilgiris (11.4102° N, 76.6950° E)',
        timestamp: '2026-10-20T08:30:00Z',
        actor: 'Highland Organics Estate (Harvest Lead)',
        notes: 'Hand-plucked first light harvest. Initial moisture content 74.2%, sorted for whole-leaf grade.',
        txHash: 'opC4uV9wQmY7XzE1K8rNtPfL3sDjG5hBvA6mK9qR2tXyZ',
        status: 'Completed',
        verifier: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      },
      {
        id: 2,
        stage: 'Packed',
        location: 'Coonoor Eco-Processing Facility, Nilgiris (11.3530° N, 76.7959° E)',
        timestamp: '2026-10-21T14:15:00Z',
        actor: 'Blue Mountain Packhouse Ops',
        notes: 'Nitrogen-flushed vacuum sealed in 100% home-compostable cornstarch foil pouches. Lot #NP-2026-44.',
        txHash: 'op8kLmPqRtYuIwOxZvBnCmA7sDfGjHkLqWeRtYuIoP3',
        status: 'Completed',
        verifier: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      },
      {
        id: 3,
        stage: 'Inspected',
        location: 'Quality Assurance Lab, Coimbatore (11.0168° N, 76.9558° E)',
        timestamp: '2026-10-22T10:45:00Z',
        actor: 'FSSAI Certified Lab #TN-882 & SGS Inspector',
        notes: 'Aflatoxin: Not Detected. Heavy metals < 0.01 ppm. Pesticide screen: 0.00% residues. Passed export grade A+ standard.',
        txHash: 'op7xBnMqWeRtYuIoPzAsDfGhJkLcXvBnMqWeRtYuIo5',
        status: 'Completed',
        verifier: 'tz1e5d...sgs_cert',
      },
      {
        id: 4,
        stage: 'In Transit',
        location: 'Cold-Chain Container #MSKU-99824, En route to Rotterdam via Chennai Port',
        timestamp: '2026-10-24T06:00:00Z',
        actor: 'Maersk Cold-Chain Logistics',
        notes: 'Loaded into IoT-monitored refrigerated container. Temperature maintained at stable 16°C, relative humidity 48%. GPS tracking active.',
        txHash: 'op2aZbXcVnMaSdFgHjKlQwErTyUiOp1234567890abc',
        status: 'Completed',
        verifier: 'tz1m4e...logistics',
      },
      {
        id: 5,
        stage: 'Delivered',
        location: 'Organic Superfoods Central Hub, Frankfurt am Main, Germany (50.1109° N, 8.6821° E)',
        timestamp: '2026-10-26T12:00:00Z',
        actor: 'EuroOrganic Logistics Depo',
        notes: 'Consignment received in intact tamper-evident seals. Batch released for direct distributor shipment across EU.',
        txHash: 'op9qWeRtYuIoPlKjHgFdSaZxCvBnMqWeRtYuIoPlKj9',
        status: 'Delivered',
        verifier: 'tz1h7y...euro_receiver',
      }
    ]
  },
  'BATCH-COFFEE-3021': {
    batchId: 'BATCH-COFFEE-3021',
    productName: 'Artisan Arabica Micro-Lot #7',
    producerName: 'Chikmagalur Heritage Plantation',
    originLocation: 'Chikmagalur, Western Ghats, Karnataka, India',
    producerAddress: 'tz1a8...heritage_coffee',
    registeredAt: '2026-10-18T09:00:00Z',
    txHash: 'op44kLxPmQwErTyUiOpAsDfGhJkLzXcVbNm12345678',
    category: 'Specialty Coffee',
    certifications: ['UTZ Certified', 'Fair Trade Certified'],
    description: 'Shade-grown under native fig and silver oak canopies. Natural anaerobic fermented for 72 hours, achieving 87.5 SCA cupping score.',
    events: [
      {
        id: 1,
        stage: 'Harvested & Registered',
        location: 'Chikmagalur Estate, Karnataka',
        timestamp: '2026-10-18T09:00:00Z',
        actor: 'Chikmagalur Heritage Plantation',
        notes: 'Harvested ripe red cherries with Brix reading 22.1%. Micro-lot separated for anaerobic fermentation.',
        txHash: 'op44kLxPmQwErTyUiOpAsDfGhJkLzXcVbNm12345678',
        status: 'Completed',
      },
      {
        id: 2,
        stage: 'Inspected',
        location: 'Coffee Board of India Quality Lab, Bengaluru',
        timestamp: '2026-10-21T16:20:00Z',
        actor: 'Certified Q-Grader Panel',
        notes: 'Cupping notes: Jasmine aroma, bright mandarin acidity, velvety dark chocolate finish. Defect count: 0.',
        txHash: 'op88jKnLmQwErTyUiOpAsDfGhJkLzXcVbNm87654321',
        status: 'Completed',
      },
      {
        id: 3,
        stage: 'In Transit',
        location: 'Mangalore Port Cargo Terminal',
        timestamp: '2026-10-25T11:00:00Z',
        actor: 'Oceanic Freight Express',
        notes: 'Sealed in GrainPro airtight hermetic bags inside ventilated containers destined for Melbourne, Australia.',
        txHash: 'op11bVnCxZmA7sDfGjHkLqWeRtYuIoP0987654321aa',
        status: 'Active',
      }
    ]
  },
  'BATCH-SAFFRON-1049': {
    batchId: 'BATCH-SAFFRON-1049',
    productName: 'Grade 1 Mogra Kashmiri Saffron',
    producerName: 'Pampore Saffron Farmers Cooperative',
    originLocation: 'Pampore Plateau, Pulwama, Kashmir, India',
    producerAddress: 'tz1s9...pampore_saffron',
    registeredAt: '2026-10-22T07:15:00Z',
    txHash: 'op33xZcMbVnMaSdFgHjKlQwErTyUiOp112233445566',
    category: 'Spices & Herbs',
    certifications: ['GI Tag Certified (Kashmir Saffron)', 'ISO 3632 Category I'],
    description: 'Pure red stigmas (Crocus sativus) grown on rich karewa soils. Crocin color strength 245+ exceeding international Grade 1 standards.',
    events: [
      {
        id: 1,
        stage: 'Harvested & Registered',
        location: 'Pampore Saffron Fields, Pulwama, Kashmir',
        timestamp: '2026-10-22T07:15:00Z',
        actor: 'Pampore Saffron Farmers Cooperative',
        notes: 'Hand-picked pre-dawn blossoms. Hand-stripped pure Mogra stigmas without style.',
        txHash: 'op33xZcMbVnMaSdFgHjKlQwErTyUiOp112233445566',
        status: 'Completed',
      },
      {
        id: 2,
        stage: 'Packed',
        location: 'India International Kashmir Saffron Trading Centre (IIKSTC), Dusoo',
        timestamp: '2026-10-23T14:00:00Z',
        actor: 'IIKSTC Certified Packing Unit',
        notes: 'Hermetically sealed in tamper-proof serialized 2g glass vials with laser-etched batch QR.',
        txHash: 'op77mMnBvCxZlKjHgFdSaZxCvBnMqWeRtYuIoPlKj77',
        status: 'Completed',
      },
      {
        id: 3,
        stage: 'Inspected',
        location: 'National Accreditation Board Testing Lab, Srinagar',
        timestamp: '2026-10-24T18:30:00Z',
        actor: 'Geographical Indication (GI) Registry Lab',
        notes: 'Crocin: 248.6 | Safranal: 38.4 | Picrocrocin: 89.2. Authenticated as 100% Genuine Kashmiri Mogra GI.',
        txHash: 'op99vCxZlKjHgFdSaZxCvBnMqWeRtYuIoPlKj998877',
        status: 'Completed',
      }
    ]
  }
};

// Local storage key for batches registered during the current session
export const LOCAL_BATCHES_STORAGE_KEY = 'originchain_local_batches_v1';

export const getStoredBatches = () => {
  try {
    const raw = localStorage.getItem(LOCAL_BATCHES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to parse local stored batches', e);
    return {};
  }
};

export const saveStoredBatch = (batch) => {
  try {
    const current = getStoredBatches();
    current[batch.batchId] = batch;
    localStorage.setItem(LOCAL_BATCHES_STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (e) {
    console.error('Failed to save stored batch', e);
    return {};
  }
};

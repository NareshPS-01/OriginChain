# OriginChain Smart Contract (SmartPy implementation)
# Tested on Tezos Ghostnet & Mainnet
# Compilation: https://smartpy.io/ide

import smartpy as sp

@sp.module
def main():
    class OriginChain(sp.Contract):
        def __init__(self, admin):
            self.data.admin = admin
            # BigMap storing batchId -> Batch details & chronological events
            self.data.batches = sp.big_map({
                # batch_id -> { product_name, producer_name, origin_location, producer_address, timestamp, events }
            })

        @sp.entrypoint
        def register_batch(self, params):
            # Assert batch does not already exist
            sp.cast(params.batch_id, sp.string)
            sp.cast(params.product_name, sp.string)
            sp.cast(params.producer_name, sp.string)
            sp.cast(params.origin_location, sp.string)

            assert not self.data.batches.contains(params.batch_id), "BATCH_ALREADY_EXISTS"

            # Create initial registration event
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

            # Append new journey event
            batch.events.push(new_event)
            self.data.batches[params.batch_id] = batch

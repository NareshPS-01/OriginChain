import React, { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Copy, Check, ExternalLink, QrCode, ShieldCheck, Printer } from 'lucide-react';

export default function QRGeneratorCard({ batch, onOpenBuyerVerification }) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  if (!batch || !batch.batchId) return null;

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const verificationUrl = `${originUrl}/?batch=${encodeURIComponent(batch.batchId)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    try {
      const canvas = qrRef.current?.querySelector('canvas');
      if (!canvas) return;

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `OriginChain-Passport-${batch.batchId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Failed to download QR code', err);
    }
  };

  return (
    <div className="bg-[#FFFDF9] border border-stone-300/80 rounded-2xl shadow-card overflow-hidden">
      
      {/* Packaging Label Header */}
      <div className="bg-stone-100/70 border-b border-stone-200/80 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-forest-600" />
          <span className="font-mono text-[11px] font-semibold tracking-widest text-stone-600 uppercase">
            Certificate of Provenance
          </span>
        </div>
        <span className="font-mono text-[10px] text-stone-500 font-medium">
          Tezos Ghostnet
        </span>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Physical Label Style Card with Perforated Accent */}
        <div className="bg-[#FAF8F3] border border-stone-200 rounded-xl p-5 relative">
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* High-Resolution QR Canvas with subtle framing */}
            <div
              ref={qrRef}
              className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-subtle flex flex-col items-center justify-center relative flex-shrink-0"
            >
              <QRCodeCanvas
                value={verificationUrl}
                size={168}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23173121"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
                  height: 26,
                  width: 26,
                  excavate: true,
                }}
              />
              <span className="mt-2 text-[9px] font-mono uppercase tracking-widest text-stone-400 font-semibold">
                Scan for History
              </span>
            </div>

            {/* Batch Provenance Details */}
            <div className="flex-1 min-w-0 space-y-3 text-left w-full">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-medium">
                  Serial Identifier
                </span>
                <div className="font-mono font-bold text-stone-900 text-lg tracking-tight">
                  {batch.batchId}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-medium">
                  Product & Origin
                </span>
                <div className="font-serif text-base text-stone-900 font-medium leading-snug line-clamp-2">
                  {batch.productName}
                </div>
                {batch.producerName && (
                  <div className="text-xs text-stone-600 mt-0.5 truncate">
                    by <span className="font-semibold text-stone-800">{batch.producerName}</span>
                  </div>
                )}
                {batch.originLocation && (
                  <div className="text-[11px] text-stone-500 truncate mt-0.5">
                    📍 {batch.originLocation}
                  </div>
                )}
              </div>

              {batch.txHash && (
                <div className="pt-2 border-t border-stone-200/70 text-[10px] font-mono text-stone-500 flex items-center justify-between">
                  <span>Tx Hash:</span>
                  <span className="text-forest-700 font-medium">
                    {batch.txHash.slice(0, 10)}...{batch.txHash.slice(-6)}
                  </span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Action Controls */}
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 shadow-subtle transition duration-150"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Download PNG</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 shadow-subtle transition duration-150"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-forest-600" />
                  <span className="text-forest-700 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => onOpenBuyerVerification(batch.batchId)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-forest-900 hover:bg-forest-800 text-stone-50 text-xs font-semibold rounded-xl transition duration-150 shadow-subtle group"
          >
            <span>Preview Consumer Passport</span>
            <ExternalLink className="w-3.5 h-3.5 text-forest-300 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
}

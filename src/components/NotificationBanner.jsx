import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, ExternalLink } from 'lucide-react';
import { TZKT_EXPLORER_URL } from '../config';

export default function NotificationBanner({ notification, onClose }) {
  if (!notification) return null;

  const { type = 'info', title, message, txHash } = notification;

  const typeConfig = {
    success: {
      bg: 'bg-white border-stone-200 text-stone-900',
      icon: <CheckCircle2 className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />,
      accent: 'text-forest-700',
    },
    error: {
      bg: 'bg-white border-red-200 text-stone-900',
      icon: <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />,
      accent: 'text-red-700',
    },
    info: {
      bg: 'bg-white border-stone-200 text-stone-900',
      icon: <Info className="w-4 h-4 text-stone-600 flex-shrink-0 mt-0.5" />,
      accent: 'text-stone-700',
    },
  };

  const style = typeConfig[type] || typeConfig.info;

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-sm w-full border rounded-2xl shadow-elevated p-4 transition-all duration-300 animate-slide-up ${style.bg}`}>
      <div className="flex items-start gap-3">
        {style.icon}
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-semibold text-xs text-stone-900 mb-0.5">{title}</h4>}
          <p className="text-xs text-stone-600 leading-relaxed break-words">{message}</p>

          {txHash && (
            <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono">
              <span className="text-stone-400 truncate max-w-[160px]">
                {txHash.slice(0, 8)}...{txHash.slice(-6)}
              </span>
              <a
                href={`${TZKT_EXPLORER_URL}/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-forest-700 hover:underline"
              >
                <span>TzKT Proof</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

import React from 'react';

export default function VIPBadge({ text = 'VIP Exclusive', variant = 'gold' }) {
  if (variant === 'gold') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-600/20 text-yellow-300 border border-yellow-500/40 shadow-[0_0_12px_rgba(212,175,55,0.2)]">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
        {text}
      </span>
    );
  }

  if (variant === 'red') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-red-950/80 text-red-400 border border-red-700/50">
        {text}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-stone-800 text-stone-300 border border-stone-700">
      {text}
    </span>
  );
}

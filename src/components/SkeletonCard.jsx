import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="manga-card glass-panel block p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl animate-pulse">
      <div className="w-full aspect-[2/3] bg-zinc-800 rounded-lg mb-4"></div>
      <div className="h-6 bg-zinc-800 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
    </div>
  );
}

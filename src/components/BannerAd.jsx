import React from 'react';

export default function BannerAd({ position }) {
  return (
    <div className={`w-full max-w-2xl mx-auto my-6 p-4 border border-zinc-800 bg-zinc-900/50 rounded-xl flex flex-col items-center justify-center text-center ${position === 'top' ? 'mt-0' : 'mb-8'}`}>
      <span className="text-xs text-zinc-500 uppercase tracking-widest mb-2 block">Publicidade</span>
      <div className="w-full h-[100px] bg-zinc-950 flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700">
        <p className="text-zinc-400 font-medium">Espaço para Banner (Amazon/Shopee)</p>
        <p className="text-zinc-600 text-sm">320x100 Mobile Format</p>
      </div>
    </div>
  );
}

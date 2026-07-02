import React, { useState, useEffect } from 'react';

export default function PreloadedImage({ src, alt, nextSrc }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Pré-carrega a próxima imagem na fila do navegador de forma silenciosa
    if (nextSrc) {
      const img = new Image();
      img.src = nextSrc;
    }
  }, [nextSrc]);

  const [error, setError] = useState(false);

  return (
    <div className={`w-full bg-zinc-950 flex flex-col items-center justify-center transition-opacity duration-500 min-h-[50vh] ${loaded || error ? 'opacity-100' : 'opacity-20'}`}>
      {!error ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className="w-full h-auto object-contain border-b border-zinc-900 ui-scan-reader-img transition"
          style={{
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        />
      ) : (
        <div className="text-zinc-500 p-10 text-center border-b border-zinc-900 w-full flex flex-col items-center gap-4">
          <span className="text-4xl">⚠️</span>
          <p>O abismo engoliu esta página.</p>
          <button
            onClick={() => setError(false)}
            className="px-4 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition cursor-pointer pointer-events-auto"
          >
            Tentar recarregar
          </button>
        </div>
      )}
    </div>
  );
}

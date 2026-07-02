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

  return (
    <div className={`w-full bg-zinc-950 flex items-center justify-center transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-20'}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className="w-full h-auto object-contain border-b border-zinc-900 ui-scan-reader-img grayscale transition hover:grayscale-0"
        style={{ 
          WebkitTouchCallout: 'none', 
          WebkitUserSelect: 'none', 
          userSelect: 'none',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

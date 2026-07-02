import { useEffect } from 'react';

export default function useTikTokAnalytics() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const originParam = urlParams.get('utm_source');
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (originParam === 'tiktok' || document.referrer.includes('tiktok.com')) {
        console.log('📈 Tráfego detectado vindo do TikTok! Registrando métrica...');
        
        // Simulação de registro em banco de dados
        console.table({
          source: 'tiktok',
          device: isMobile ? 'Celular' : 'Desktop',
          timestamp: new Date().toISOString()
        });
      }
    }
  }, []);
}

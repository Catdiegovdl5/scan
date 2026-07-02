import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Go() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const obraId = params.get('obra');

    // Mapeamento de rotas amigáveis (simulando um BD)
    const mapaDeObras = {
      'abismo': '/ler/o-abismo-em-preto-e-branco/1',
      'solo': '/ler/solo-leveling/1',
      'recompensa': '/ler/the-breaker/1'
    };

    const destinoFinal = mapaDeObras[obraId] || '/';

    // Redireciona o usuário
    navigate(destinoFinal, { replace: true });
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-zinc-800 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-zinc-500">Redirecionando do TikTok...</p>
      </div>
    </div>
  );
}

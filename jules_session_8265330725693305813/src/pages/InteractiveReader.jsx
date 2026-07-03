import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import PreloadedImage from '../components/PreloadedImage';
import BannerAd from '../components/BannerAd';
import DiscordCTA from '../components/DiscordCTA';

export default function InteractiveReader() {
  const { slug, capitulo } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Rolando para baixo
        setShowNav(false);
      } else {
        // Rolando para cima
        setShowNav(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchPaginasDoCapitulo() {
      try {
        setLoading(true);

        // 1. Busca o ID do capítulo cruzando o slug da obra e o número do capítulo
        const { data: capituloData, error: capError } = await supabase
          .from('capitulos')
          .select('id, obras!inner(slug)')
          .eq('numero_capitulo', capitulo)
          .eq('obras.slug', slug)
          .single();

        if (capError && capError.code !== 'PGRST116') throw capError;

        // 2. Busca todas as páginas pertencentes àquele capítulo ordenadas numericamente
        if (capituloData) {
          const { data: paginasData, error: pagError } = await supabase
            .from('paginas')
            .select('imagem_url, numero_pagina')
            .eq('capitulo_id', capituloData.id)
            .order('numero_pagina', { ascending: true });

          if (pagError) throw pagError;
          setPages(paginasData || []);
        }
      } catch (error) {
        console.error('Erro ao renderizar leitor:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPaginasDoCapitulo();
    localStorage.setItem('historico_leitura', JSON.stringify({ slug, capitulo }));
  }, [slug, capitulo]);

  const changeChapter = (direction) => {
    const currentCap = parseInt(capitulo || '1');
    if (direction === 'next') navigate(`/ler/${slug}/${currentCap + 1}`);
    if (direction === 'prev' && currentCap > 1) navigate(`/ler/${slug}/${currentCap - 1}`);
  };

  return (
    <div className="reader-container bg-black min-h-screen flex flex-col items-center sm:py-4 px-0">
      
      {/* Navegação de Capítulos */}
      <div 
        className={`navigation-bar sticky top-0 w-full max-w-2xl bg-zinc-900/95 backdrop-blur p-4 flex justify-between items-center text-white mb-0 sm:mb-6 sm:rounded-xl shadow-2xl z-50 border-b sm:border border-zinc-800 transition-transform duration-300 ${
          showNav ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <button onClick={() => changeChapter('prev')} className="hover:text-red-500 font-medium transition cursor-pointer flex items-center gap-2">
          <span>⬅️</span> Anterior
        </button>
        <span className="font-bold text-sm uppercase tracking-wider text-center">
          {slug.replace('-', ' ')} <br/>
          <span className="text-zinc-400">Capítulo {capitulo}</span>
        </span>
        <button onClick={() => changeChapter('next')} className="hover:text-red-500 font-medium transition cursor-pointer flex items-center gap-2">
          Próximo <span>➡️</span>
        </button>
      </div>

      {/* Banner Topo */}
      {!loading && pages.length > 0 && <BannerAd position="top" />}

      {/* Páginas do Manhwa em Cascata */}
      <div className="manga-pages-wrapper w-full max-w-2xl flex flex-col bg-zinc-950 shadow-2xl relative">
        {loading ? (
          <div className="w-full flex flex-col gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full h-[80vh] bg-zinc-900 animate-pulse border-b border-zinc-950"></div>
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-10 text-zinc-500">Este capítulo ainda não foi traduzido.</div>
        ) : (
          pages.map((page, index) => {
            const currentSrc = page.imagem_url || page.url;
            const nextSrc = index < pages.length - 1 ? (pages[index + 1].imagem_url || pages[index + 1].url) : null;
            return (
              <PreloadedImage 
                key={page.numero_pagina || index}
                src={currentSrc}
                alt={`Página ${page.numero_pagina || index + 1}`}
                nextSrc={nextSrc}
              />
            );
          })
        )}
      </div>

      {/* Funil de Retenção (Discord) e Banner Fim */}
      {!loading && pages.length > 0 && (
        <>
          <DiscordCTA />
          <BannerAd position="bottom" />
        </>
      )}
      
      {/* Voltar para Home */}
      <div className="mt-12 mb-8">
        <Link to="/" className="text-zinc-500 hover:text-white transition border border-zinc-800 px-6 py-3 rounded-full">
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
}

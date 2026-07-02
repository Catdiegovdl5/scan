import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Home() {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchObras() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('obras')
          .select('id, titulo, slug, capa_url, status')
          .order('criado_em', { ascending: false });

        if (error) throw error;
        setObras(data || []);
      } catch (error) {
        console.error('Erro ao carregar obras:', error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchObras();
  }, []);

  return (
    <div className="app-container">
      <header className="header flex justify-between items-center py-6 border-b border-[#333] mb-12">
        <Link to="/" className="logo text-2xl font-black uppercase tracking-widest bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          UI Scan
        </Link>
        <nav className="nav-links flex gap-8">
          <Link to="/" className="nav-link text-gray-400 hover:text-white transition">Lançamentos</Link>
          <Link to="/admin" className="nav-link text-gray-400 hover:text-white transition text-red-500 font-bold">Painel Admin</Link>
          <a href="#" className="nav-link text-gray-400 hover:text-white transition">Comunidade</a>
        </nav>
      </header>

      <main>
        <section className="hero text-center py-24 relative">
          <h1 className="hero-title text-6xl font-black mb-4 leading-tight">O abismo em <br/>Preto e Branco</h1>
          <p className="hero-subtitle text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Mergulhe nas melhores traduções de manhwas e mangás. Qualidade premium, lançamentos diários e uma comunidade apaixonada.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8">Destaques da Semana</h2>
          <div className="manga-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-10 text-zinc-500">Buscando catálogo no abismo...</div>
            ) : obras.length === 0 ? (
              <div className="col-span-full text-center py-10 text-zinc-500">Nenhuma obra encontrada. Faça o upload no painel admin!</div>
            ) : (
              obras.map(obra => (
                <Link to={`/ler/${obra.slug}/1`} key={obra.id} className="manga-card glass-panel block p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition hover:-translate-y-2 hover:scale-105">
                  <div className="manga-cover w-full aspect-[2/3] bg-zinc-900 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                    <img src={obra.capa_url || 'https://via.placeholder.com/500x750?text=Sem+Capa'} alt={obra.titulo} className="w-full h-full object-cover grayscale transition hover:grayscale-0 hover:scale-110" />
                  </div>
                  <h3 className="manga-title text-xl font-bold mb-2">{obra.titulo}</h3>
                  <span className="manga-genre text-sm text-gray-400 uppercase tracking-wide">{obra.status}</span>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

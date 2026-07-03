import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DragDropUploader from '../components/DragDropUploader';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const [obras, setObras] = useState([]);
  const [stats, setStats] = useState({ capitulosTraduzidos: 0 });

  useEffect(() => {
    async function fetchDashboardData() {
      // Busca obras e o count de capitulos relacionalmente
      const { data, error } = await supabase.from('obras').select('id, titulo, status, capitulos(id)');
      if (data && !error) {
         let totalCapitulos = 0;
         const obrasComCount = data.map(o => {
            const count = o.capitulos ? o.capitulos.length : 0;
            totalCapitulos += count;
            return {
              id: o.id,
              titulo: o.titulo,
              status: o.status || 'Ativo',
              capitulos: count,
              cliques: Math.floor(Math.random() * 500) // Mock provisorio para a métrica do TikTok
            };
         });
         setObras(obrasComCount);
         setStats({ capitulosTraduzidos: totalCapitulos });
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-zinc-950 border-r border-zinc-900 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-black tracking-widest text-white uppercase mb-8">
            <Link to="/">UI SCAN <span className="text-red-500">.</span></Link>
          </h2>
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 bg-zinc-900 text-white px-4 py-3 rounded-lg font-medium text-sm transition">
              <span>📊</span> <span>Visão Geral</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-zinc-400 hover:bg-zinc-900 hover:text-white px-4 py-3 rounded-lg font-medium text-sm transition">
              <span>📚</span> <span>Gerenciar Obras</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-zinc-400 hover:bg-zinc-900 hover:text-white px-4 py-3 rounded-lg font-medium text-sm transition">
              <span>📤</span> <span>Upload em Massa</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-zinc-400 hover:bg-zinc-900 hover:text-white px-4 py-3 rounded-lg font-medium text-sm transition">
              <span>👥</span> <span>Equipe (Staff)</span>
            </a>
          </nav>
        </div>
        <div className="text-xs text-zinc-600 border-t border-zinc-900 pt-4">
          Ambiente Local: v1.0.0
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Painel de Controle</h1>
            <p className="text-zinc-500 text-sm mt-1">Monitore suas conversões do TikTok e lançamentos.</p>
          </div>
          <button className="bg-white text-black font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-zinc-200 transition cursor-pointer">
            + Nova Obra
          </button>
        </header>

        {/* Grid de Cartões de Métricas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl">
            <div className="flex justify-between items-center text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Cliques via TikTok (Hoje)</span>
              <span>📱</span>
            </div>
            <div className="text-3xl font-black">1.240</div>
            <p className="text-emerald-500 text-xs mt-2 font-medium">▲ +14% em relação a ontem</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl">
            <div className="flex justify-between items-center text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Capítulos Traduzidos</span>
              <span>📖</span>
            </div>
            <div className="text-3xl font-black">{stats.capitulosTraduzidos}</div>
            <p className="text-zinc-500 text-xs mt-2 font-medium">Meta semanal: 85% concluída</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl">
            <div className="flex justify-between items-center text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Membros da Scan</span>
              <span>⚔️</span>
            </div>
            <div className="text-3xl font-black">12</div>
            <p className="text-zinc-500 text-xs mt-2 font-medium">3 Tradutores, 5 Editores, 4 Cleaners</p>
          </div>
        </section>

        {/* Módulo de Upload em Massa Drag & Drop */}
        <section className="mb-10">
          <DragDropUploader />
        </section>

        {/* Tabela de Obras */}
        <section className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
            <h3 className="font-bold text-lg">Desempenho por Obra</h3>
            <span className="text-xs text-zinc-500">Ordenado por engajamento</span>
          </div>
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-900/50 text-xs text-zinc-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Título da Obra</th>
                <th className="p-4">Total Capítulos</th>
                <th className="p-4">Conversão TikTok</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {obras.map(obra => (
                <tr key={obra.id} className="hover:bg-zinc-900/30 transition">
                  <td className="p-4 font-semibold text-white">{obra.titulo}</td>
                  <td className="p-4">{obra.capitulos}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold">{obra.cliques}</span>
                      <span className="text-xs text-zinc-600">cliques</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${obra.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                      {obra.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

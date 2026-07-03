// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DragDropUploader from '../components/DragDropUploader';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const [obras, setObras] = useState([]);
  const [stats, setStats] = useState({ capitulosTraduzidos: 0 });
  
  // Controles de UI: Abas e Gaveta
  const [activeTab, setActiveTab] = useState('desempenho'); 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Controles de Estado de Dados
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const staff = [
    { id: 1, nome: 'Diego', funcao: 'Admin / Growth Engineer', status: 'Ativo' },
    { id: 2, nome: 'Alex', funcao: 'Tradutor', status: 'Ativo' },
    { id: 3, nome: 'Julia', funcao: 'Cleaner', status: 'Inativo' },
  ];

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('obras')
          .select('id, titulo, status, capitulos(id)');
          
        if (supabaseError) throw supabaseError;

        if (data) {
           let totalCapitulos = 0;
           const obrasComCount = data.map(o => {
              const count = o.capitulos ? o.capitulos.length : 0;
              totalCapitulos += count;
              return {
                id: o.id,
                titulo: o.titulo,
                status: o.status || 'Ativo',
                capitulos: count,
                cliques: Math.floor(Math.random() * 500) // Mock temporário para Analytics
              };
           });
           setObras(obrasComCount);
           setStats({ capitulosTraduzidos: totalCapitulos });
        }
      } catch (err) {
        setError("Falha de conexão com o banco. Verifique suas credenciais no Supabase.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  // Escotilha de fuga para fechar a gaveta com 'Esc'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) setIsDrawerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  return (
    <div className="flex h-screen bg-[#000000] text-[#ffffff] font-sans overflow-hidden">
      
      {/* SIDEBAR (Minimalista e Trancada) */}
      <aside className="w-64 bg-[#09090b] border-r border-zinc-900/50 p-6 flex-shrink-0 flex flex-col justify-between hidden md:flex">
        <div>
          <h2 className="text-xl font-black tracking-widest uppercase mb-8 flex items-center gap-2">
            <span className="text-[#ef4444]">■</span> UI SCAN
          </h2>
          <nav className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-zinc-900/40 text-white rounded-lg font-medium text-sm border border-zinc-800/50 transition">
              <span className="text-[#ef4444]">◈</span> <span>Painel Central</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-zinc-500 hover:text-white transition rounded-lg font-medium text-sm">
              <span>⚙️</span> <span>Configurações</span>
            </button>
          </nav>
        </div>
        <div className="text-xs text-zinc-700 pt-4 border-t border-zinc-900/50 mt-auto">
          Operação: Abismo<br/>
          v2.0 (Build Tático)
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto bg-[#000000] relative">
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          
          {/* Header e Gatilho da Gaveta */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Visão Geral</h1>
              <p className="text-zinc-500 text-sm mt-1">Gestão de tráfego orgânico e lançamentos</p>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="bg-[#ef4444] hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center gap-2"
            >
              <span>+</span> Novo Capítulo
            </button>
          </header>

          {/* Alerta de Erro Crítico */}
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border-l-4 border-[#ef4444] rounded-r-lg text-red-400 text-sm font-medium flex items-center gap-3">
              <span className="font-black text-lg">!</span> {error}
            </div>
          )}

          {/* 1. CENTRALIZAÇÃO DE MÉTRICAS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#09090b] border border-zinc-900/50 p-6 rounded-xl hover:border-zinc-800 transition">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex justify-between">
                <span>Cliques TikTok (Hoje)</span> <span>📱</span>
              </div>
              <div className="text-3xl font-black">1.240</div>
              <p className="text-emerald-500 text-[10px] mt-2 font-medium tracking-wide">▲ +14% CRESCIMENTO</p>
            </div>
            <div className="bg-[#09090b] border border-zinc-900/50 p-6 rounded-xl hover:border-zinc-800 transition">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex justify-between">
                <span>Capítulos Traduzidos</span> <span>📖</span>
              </div>
              <div className="text-3xl font-black">
                {isLoading ? <div className="h-9 w-16 bg-zinc-800 animate-pulse rounded"></div> : stats.capitulosTraduzidos}
              </div>
              <p className="text-zinc-500 text-[10px] mt-2 font-medium tracking-wide">NO BANCO DE DADOS</p>
            </div>
            <div className="bg-[#09090b] border border-zinc-900/50 p-6 rounded-xl hover:border-zinc-800 transition">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex justify-between">
                <span>Membros (Staff)</span> <span>⚔️</span>
              </div>
              <div className="text-3xl font-black">12</div>
              <p className="text-zinc-500 text-[10px] mt-2 font-medium tracking-wide">3 T / 5 E / 4 C</p>
            </div>
          </section>

          {/* 3. SISTEMA DE ABAS (Tabs) */}
          <section className="bg-[#09090b] border border-zinc-900/50 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex border-b border-zinc-900/50">
              <button 
                onClick={() => setActiveTab('desempenho')}
                className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'desempenho' ? 'text-[#ffffff] border-b-2 border-[#ef4444] bg-[#18181b]/30' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#18181b]/10'}`}
              >
                Desempenho (Obras)
              </button>
              <button 
                onClick={() => setActiveTab('equipe')}
                className={`px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'equipe' ? 'text-[#ffffff] border-b-2 border-[#ef4444] bg-[#18181b]/30' : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#18181b]/10'}`}
              >
                Equipe (Staff)
              </button>
            </div>

            {/* ABA 1: OBRAS */}
            {activeTab === 'desempenho' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                  <thead className="bg-[#09090b] text-[10px] text-zinc-600 uppercase tracking-widest font-bold border-b border-zinc-900/50">
                    <tr>
                      <th className="px-8 py-4">Título da Obra</th>
                      <th className="px-8 py-4">Total Capítulos</th>
                      <th className="px-8 py-4">Conversão TikTok</th>
                      <th className="px-8 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {isLoading ? (
                      [...Array(3)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-8 py-5"><div className="h-4 bg-zinc-800/50 rounded w-3/4"></div></td>
                          <td className="px-8 py-5"><div className="h-4 bg-zinc-800/50 rounded w-1/4"></div></td>
                          <td className="px-8 py-5"><div className="h-4 bg-zinc-800/50 rounded w-1/2"></div></td>
                          <td className="px-8 py-5"><div className="h-6 bg-zinc-800/50 rounded w-16"></div></td>
                        </tr>
                      ))
                    ) : obras.length === 0 ? (
                      <tr><td colSpan="4" className="p-10 text-center text-zinc-600 text-xs uppercase tracking-widest font-bold">Nenhuma obra localizada</td></tr>
                    ) : (
                      obras.map(obra => (
                        <tr key={obra.id} className="hover:bg-[#18181b]/40 transition-colors group">
                          <td className="px-8 py-5 font-semibold text-white group-hover:text-[#ef4444] transition-colors">{obra.titulo}</td>
                          <td className="px-8 py-5 font-mono text-zinc-300">{obra.capitulos}</td>
                          <td className="px-8 py-5 font-mono text-white font-bold">{obra.cliques} <span className="text-zinc-600 text-xs ml-1">CLIQUES</span></td>
                          <td className="px-8 py-5">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${obra.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                              {obra.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ABA 2: EQUIPE */}
            {activeTab === 'equipe' && (
              <div className="p-8">
                <div className="grid gap-4">
                  {staff.map(member => (
                    <div key={member.id} className="flex justify-between items-center p-5 bg-[#18181b] border border-zinc-800/50 rounded-xl hover:border-zinc-700 transition-colors">
                      <div>
                        <h4 className="text-white font-bold text-sm">{member.nome}</h4>
                        <span className="text-xs text-zinc-500 font-mono mt-1 block">{member.funcao}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${member.status === 'Ativo' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`}></span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{member.status}</span>
                        </div>
                        <button className="text-[10px] bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded uppercase tracking-widest font-bold transition-colors">Editar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* 2. GAVETA LATERAL RETRÁTIL (Drawer de Upload) */}
        <div 
          className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-40 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsDrawerOpen(false)}
        />
        
        <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-[#09090b] border-l border-zinc-900 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="text-[#ef4444]">📥</span> Lançar Capítulo
            </h2>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="text-zinc-500 hover:text-white transition-colors bg-[#18181b] hover:bg-zinc-800 rounded p-1.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
             {/* Renderiza o componente funcional de Upload real */}
             <DragDropUploader />
          </div>
        </div>

      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DragDropUploader from '../components/DragDropUploader';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const [obras, setObras] = useState([]);
  const [stats, setStats] = useState({ capitulosTraduzidos: 0 });
  const [activeTab, setActiveTab] = useState('desempenho'); 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mock de equipe temporário para a interface
  const staff = [
    { id: 1, nome: 'Diego', funcao: 'Admin supremo', status: 'Ativo' },
    { id: 2, nome: 'Alex', funcao: 'Tradutor', status: 'Ativo' },
    { id: 3, nome: 'Julia', funcao: 'Cleaner', status: 'Inativo' },
  ];

  useEffect(() => {
    async function fetchDashboardData() {
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
              cliques: Math.floor(Math.random() * 500)
            };
         });
         setObras(obrasComCount);
         setStats({ capitulosTraduzidos: totalCapitulos });
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* Sidebar Lateral (Minimalista) */}
      <aside className="w-64 bg-[#09090b] border-r border-zinc-900 p-6 flex-shrink-0 flex flex-col justify-between hidden md:flex">
        <div>
          <h2 className="text-xl font-black tracking-widest text-white uppercase mb-8 flex items-center gap-2">
            <span className="text-red-500">■</span>
            <Link to="/">UI SCAN</Link>
          </h2>
          <nav className="space-y-1">
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-zinc-900/40 text-white rounded-lg font-medium text-sm border border-zinc-800/50">
              <span className="text-red-500">◈</span> <span>Painel Central</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-zinc-500 hover:text-white transition rounded-lg font-medium text-sm">
              <span>⚙️</span> <span>Configurações</span>
            </button>
          </nav>
        </div>
        <div className="text-xs text-zinc-700 pt-4">
          Operação: Abismo<br/>
          v2.0 Beta
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto bg-black relative">
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Visão Geral</h1>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">Gestão de tráfego orgânico e lançamentos</p>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-xs md:text-sm transition cursor-pointer shadow-lg shadow-red-500/20"
            >
              + Novo Capítulo
            </button>
          </header>

          {/* 1. CENTRALIZAÇÃO DE MÉTRICAS */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#09090b] border border-zinc-900 p-5 rounded-xl">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Cliques TikTok (Hoje)</div>
              <div className="text-2xl font-black text-white">1.240</div>
              <p className="text-emerald-500 text-[10px] mt-1 font-medium">▲ +14% crescimento</p>
            </div>
            <div className="bg-[#09090b] border border-zinc-900 p-5 rounded-xl">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Capítulos Traduzidos</div>
              <div className="text-2xl font-black text-white">{stats.capitulosTraduzidos}</div>
              <p className="text-zinc-500 text-[10px] mt-1 font-medium">No banco de dados</p>
            </div>
            <div className="bg-[#09090b] border border-zinc-900 p-5 rounded-xl">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Membros (Staff)</div>
              <div className="text-2xl font-black text-white">12</div>
              <p className="text-zinc-500 text-[10px] mt-1 font-medium">3 T / 5 E / 4 C</p>
            </div>
          </section>

          {/* 3. ABAS DE NAVEGAÇÃO DE CONTEÚDO */}
          <section className="bg-[#09090b] border border-zinc-900 rounded-xl overflow-hidden">
            {/* Headers das Abas */}
            <div className="flex border-b border-zinc-900">
              <button 
                onClick={() => setActiveTab('desempenho')}
                className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'desempenho' ? 'text-white border-b-2 border-red-500 bg-zinc-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Desempenho (Obras)
              </button>
              <button 
                onClick={() => setActiveTab('equipe')}
                className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition ${activeTab === 'equipe' ? 'text-white border-b-2 border-red-500 bg-zinc-900/30' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Equipe (Staff)
              </button>
            </div>

            {/* Conteúdo Aba 1: Obras */}
            {activeTab === 'desempenho' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-zinc-400">
                  <thead className="bg-[#09090b] text-[10px] text-zinc-600 uppercase tracking-widest font-bold border-b border-zinc-900">
                    <tr>
                      <th className="px-6 py-3">Título da Obra</th>
                      <th className="px-6 py-3">Total Capítulos</th>
                      <th className="px-6 py-3">Conversão TikTok</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {obras.length === 0 ? (
                      <tr><td colSpan="4" className="p-8 text-center text-zinc-600 text-xs uppercase tracking-widest">Nenhuma obra</td></tr>
                    ) : (
                      obras.map(obra => (
                        <tr key={obra.id} className="hover:bg-zinc-900/20 transition group">
                          <td className="px-6 py-4 font-semibold text-white group-hover:text-red-400 transition">{obra.titulo}</td>
                          <td className="px-6 py-4 font-mono text-zinc-300">{obra.capitulos}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <span className="text-white font-bold">{obra.cliques}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${obra.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
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

            {/* Conteúdo Aba 2: Equipe */}
            {activeTab === 'equipe' && (
              <div className="p-6">
                <div className="grid gap-3">
                  {staff.map(member => (
                    <div key={member.id} className="flex justify-between items-center p-4 bg-[#18181b] border border-zinc-800 rounded-lg hover:border-zinc-700 transition">
                      <div>
                        <h4 className="text-white font-bold text-sm">{member.nome}</h4>
                        <span className="text-xs text-zinc-500">{member.funcao}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${member.status === 'Ativo' ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
                        <button className="text-xs text-zinc-500 hover:text-red-500 uppercase tracking-widest font-bold transition">Editar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* 2. GAVETA LATERAL RETRÁTIL (Drawer) */}
        {/* Overlay escuro */}
        <div 
          className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsDrawerOpen(false)}
        />
        
        {/* Container da Gaveta */}
        <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-[#09090b] border-l border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl overflow-y-auto ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-zinc-900 flex justify-between items-center sticky top-0 bg-[#09090b]/90 backdrop-blur z-10">
            <h2 className="text-lg font-black text-white uppercase tracking-widest">Postar Capítulo</h2>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="text-zinc-500 hover:text-white p-2 transition"
            >
              ✕
            </button>
          </div>
          <div className="p-6">
            <DragDropUploader />
          </div>
        </div>

      </main>
    </div>
  );
}

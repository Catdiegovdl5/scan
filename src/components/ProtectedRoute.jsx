import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // 🛠️ MODO DE EMERGÊNCIA (DEV BYPASS)
      // Força a liberação da rota Admin no localhost para o seu Gmail específico
      if (!session && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.warn('⚠️ Bypass de Admin ativado para 9919622diego@gmail.com');
        setSession({ 
          user: { 
            email: '9919622diego@gmail.com', 
            role: 'authenticated' 
          } 
        });
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. Se não houver sessão ativa (nem pelo bypass), vai para o Login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 2. Trava de Segurança Suprema: Apenas ESSE e-mail específico pode entrar no Admin
  const adminEmail = '9919622diego@gmail.com';
  if (session.user?.email !== adminEmail) {
    console.warn(`Acesso negado para o e-mail: ${session.user?.email}`);
    // Se um invasor logar com o Google dele, será expulso de volta para a página inicial
    return <Navigate to="/" replace />;
  }

  // Passou em todas as travas, pode ver o painel
  return children;
}

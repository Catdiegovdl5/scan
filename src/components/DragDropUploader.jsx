import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function DragDropUploader() {
  const [obras, setObras] = useState([]);
  const [obraId, setObraId] = useState('');
  const [capituloNum, setCapituloNum] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  // Busca obras para popular o select
  useEffect(() => {
    async function fetchObras() {
      const { data, error } = await supabase.from('obras').select('id, titulo, slug');
      if (!error && data) {
        setObras(data);
        if (data.length > 0) setObraId(data[0].id);
      }
    }
    fetchObras();
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    // Ordena os arquivos por nome
    const sortedFiles = droppedFiles.sort((a, b) => a.name.localeCompare(b.name));
    setFiles(prev => [...prev, ...sortedFiles]);
  }, []);

  const handleUpload = async () => {
    if (!obraId || !capituloNum || files.length === 0) {
      setMessage('Preencha a obra, capítulo e adicione imagens.');
      return;
    }

    setUploading(true);
    setMessage('Iniciando upload...');
    setProgress(0);

    try {
      const obraSelecionada = obras.find(o => o.id === obraId);
      
      // 1. Cria ou pega o capítulo
      let capitulo_id;
      const { data: capData } = await supabase
        .from('capitulos')
        .select('id')
        .eq('obra_id', obraId)
        .eq('numero_capitulo', capituloNum);

      if (capData && capData.length > 0) {
        capitulo_id = capData[0].id;
      } else {
        const { data: newCap, error: capError } = await supabase
          .from('capitulos')
          .insert({
            obra_id: obraId,
            numero_capitulo: parseFloat(capituloNum),
            titulo_capitulo: `Capítulo ${capituloNum}`
          })
          .select('id');
        
        if (capError) throw capError;
        capitulo_id = newCap[0].id;
      }

      // 2. Upload de imagens
      let uploadCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const pageNumber = i + 1;
        const filePath = `${obraSelecionada.slug}/cap-${capituloNum}/pag-${pageNumber}-${Date.now()}.${file.name.split('.').pop()}`;

        setMessage(`Enviando página ${pageNumber}...`);

        const { error: storageError } = await supabase.storage
          .from('manga-pages')
          .upload(filePath, file);

        if (storageError) throw storageError;

        const { data: publicUrlData } = supabase.storage
          .from('manga-pages')
          .getPublicUrl(filePath);

        await supabase.from('paginas').insert({
          capitulo_id: capitulo_id,
          numero_pagina: pageNumber,
          imagem_url: publicUrlData.publicUrl
        });

        uploadCount++;
        setProgress(Math.round((uploadCount / files.length) * 100));
      }

      setMessage(`Sucesso! ${uploadCount} páginas enviadas.`);
      setFiles([]);
      setCapituloNum('');
    } catch (error) {
      console.error('Erro de upload:', error);
      setMessage(`Erro: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-6">Upload Rápido (Drag & Drop)</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Selecione a Obra</label>
          <select 
            value={obraId} 
            onChange={(e) => setObraId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition"
          >
            {obras.map(obra => (
              <option key={obra.id} value={obra.id}>{obra.titulo}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Nº do Capítulo</label>
          <input 
            type="number" 
            placeholder="Ex: 1"
            value={capituloNum}
            onChange={(e) => setCapituloNum(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition"
          />
        </div>
      </div>

      <div 
        onDragOver={(e) => e.preventDefault()} 
        onDrop={onDrop}
        className="border-2 border-dashed border-zinc-700 hover:border-red-500 rounded-xl p-10 text-center transition cursor-pointer bg-zinc-900/50 mb-6"
      >
        <span className="text-4xl mb-4 block">📥</span>
        <p className="text-zinc-400 font-medium">Arraste as páginas do capítulo para cá</p>
        <p className="text-xs text-zinc-600 mt-2">Formatos suportados: PNG, JPG, WEBP</p>
      </div>

      {files.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-zinc-400 mb-2">{files.length} arquivos selecionados na fila</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {files.map((f, i) => (
              <div key={i} className="min-w-16 h-16 bg-zinc-800 rounded flex items-center justify-center text-xs overflow-hidden relative group">
                 <img src={URL.createObjectURL(f)} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition" />
                 <span className="absolute inset-0 flex items-center justify-center font-bold bg-black/50">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {message && (
        <div className={`p-3 rounded-lg mb-6 text-sm font-medium ${message.includes('Erro') ? 'bg-red-500/10 text-red-500' : message.includes('Sucesso') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
          {message}
        </div>
      )}

      {uploading && (
        <div className="w-full bg-zinc-900 rounded-full h-2.5 mb-6">
          <div className="bg-red-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <button 
        onClick={handleUpload} 
        disabled={uploading || files.length === 0}
        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3 px-4 rounded-xl transition shadow-lg cursor-pointer"
      >
        {uploading ? `Enviando... ${progress}%` : 'Publicar Capítulo Agora'}
      </button>
    </div>
  );
}

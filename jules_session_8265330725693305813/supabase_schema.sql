-- 1. Tabela de Obras (Mangás/Manhwas)
CREATE TABLE obras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- Ex: o-abismo-em-preto-e-branco
    sinopse TEXT,
    capa_url TEXT,
    status VARCHAR(50) DEFAULT 'Em lançamento', -- Concluído, Hiato
    criado_em TIMESTAMP DEFAULT NOW()
);

-- 2. Tabela de Capítulos
CREATE TABLE capitulos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
    numero_capitulo NUMERIC(6, 1) NOT NULL, -- Suporta cap 1.5, 2.0, etc.
    titulo_capitulo VARCHAR(255),
    criado_em TIMESTAMP DEFAULT NOW()
);

-- 3. Tabela de Páginas (Ordem de leitura na cascata)
CREATE TABLE paginas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capitulo_id UUID REFERENCES capitulos(id) ON DELETE CASCADE,
    numero_pagina INT NOT NULL, -- Determina a ordem de empilhamento (1, 2, 3...)
    imagem_url TEXT NOT NULL -- Link do Storage (Cloudflare R2, Supabase Storage, etc.)
);

-- 4. Tabela de Métricas do TikTok (Rastreamento de Conversão)
CREATE TABLE metricas_tiktok (
    id SERIAL PRIMARY KEY,
    obra_id UUID REFERENCES obras(id) ON DELETE SET NULL,
    cliques INT DEFAULT 0,
    data_registro DATE DEFAULT CURRENT_DATE UNIQUE
);

-- 5. Tabela de Histórico de Leitura (Sincronização de Progresso)
CREATE TABLE historico_leitura (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Conectado à tabela de Auth do Supabase
    obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
    ultimo_capitulo_lido NUMERIC(6, 1),
    atualizado_em TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, obra_id)
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE capitulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE paginas ENABLE ROW LEVEL SECURITY;

-- Criar políticas de leitura pública
CREATE POLICY "Leitura pública de obras" ON obras FOR SELECT USING (true);
CREATE POLICY "Leitura pública de capitulos" ON capitulos FOR SELECT USING (true);
CREATE POLICY "Leitura pública de paginas" ON paginas FOR SELECT USING (true);

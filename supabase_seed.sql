-- 1. Tabela Trilhas
CREATE TABLE trilhas (
  id TEXT PRIMARY KEY, -- ex: 'plano-de-saude'
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  descricao TEXT,
  icon TEXT,
  cor TEXT,
  nivel TEXT,
  duracao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela Módulos
CREATE TABLE modulos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trilha_id TEXT REFERENCES trilhas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela Aulas
CREATE TABLE aulas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  modulo_id UUID REFERENCES modulos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  duracao TEXT,
  youtube_id TEXT,
  ordem INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela Quizzes
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trilha_id TEXT REFERENCES trilhas(id) ON DELETE CASCADE,
  pergunta TEXT NOT NULL,
  opcoes JSONB NOT NULL, -- Array de strings: '["A", "B", "C"]'
  correta INTEGER NOT NULL, -- Indice da opcao correta (0, 1, 2)
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permissões (RLS)
ALTER TABLE trilhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE aulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa logada pode LER os conteudos
CREATE POLICY "Leitura de trilhas" ON trilhas FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura de modulos" ON modulos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura de aulas" ON aulas FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Leitura de quizzes" ON quizzes FOR SELECT USING (auth.role() = 'authenticated');

-- Apenas admins podem INSERIR, ATUALIZAR, DELETAR
CREATE POLICY "Admins alteram trilhas" ON trilhas USING (public.is_admin_user());
CREATE POLICY "Admins alteram modulos" ON modulos USING (public.is_admin_user());
CREATE POLICY "Admins alteram aulas" ON aulas USING (public.is_admin_user());
CREATE POLICY "Admins alteram quizzes" ON quizzes USING (public.is_admin_user());

-- ==========================================
-- DADOS INICIAIS (SEED)
-- ==========================================

INSERT INTO trilhas (id, titulo, subtitulo, descricao, icon, cor, nivel, duracao) VALUES
('plano-de-saude', 'Plano de Saúde', 'Especialista em benefícios médicos', 'Domine as regras da ANS, tabelas de preços, e técnicas avançadas para fechar contratos de saúde.', '🏥', '#32DDC9', 'Iniciante', '8h 30min'),
('seguro-de-vida', 'Seguro de Vida', 'Proteção familiar e sucessão', 'Aprenda a calcular o capital ideal, argumentar sobre a importância da proteção e vender segurança financeira.', '🛡️', '#73A09F', 'Iniciante', '6h 45min'),
('consultoria-patrimonial', 'Consultoria Patrimonial', 'Planejamento financeiro 360°', 'O produto mais premium da W1 Goiânia. Aprenda a realizar diagnósticos e apresentar soluções de investimento.', '💼', '#305A5F', 'Intermediário → Avançado', '12h 00min');

-- Módulos para Plano de Saúde (usando gen_random_uuid)
DO $$ 
DECLARE 
  mod1_id UUID := gen_random_uuid();
  mod2_id UUID := gen_random_uuid();
  mod3_id UUID := gen_random_uuid();
BEGIN
  -- Módulos
  INSERT INTO modulos (id, trilha_id, titulo, ordem) VALUES (mod1_id, 'plano-de-saude', 'Fundamentos e Mercado', 1);
  INSERT INTO modulos (id, trilha_id, titulo, ordem) VALUES (mod2_id, 'plano-de-saude', 'Produtos e Operadoras', 2);
  INSERT INTO modulos (id, trilha_id, titulo, ordem) VALUES (mod3_id, 'plano-de-saude', 'Vendas e Comercial', 3);

  -- Aulas Mod 1
  INSERT INTO aulas (modulo_id, titulo, duracao, youtube_id, ordem) VALUES
  (mod1_id, 'Panorama do setor de saúde no Brasil', '18min', 'dQw4w9WgXcQ', 1),
  (mod1_id, 'Regulamentação e ANS', '22min', 'dQw4w9WgXcQ', 2);

  -- Aulas Mod 2
  INSERT INTO aulas (modulo_id, titulo, duracao, youtube_id, ordem) VALUES
  (mod2_id, 'Individual, Familiar e Coletivo', '25min', 'dQw4w9WgXcQ', 1),
  (mod2_id, 'Carências e como explicar ao cliente', '20min', 'dQw4w9WgXcQ', 2);

  -- Aulas Mod 3
  INSERT INTO aulas (modulo_id, titulo, duracao, youtube_id, ordem) VALUES
  (mod3_id, 'Como ler e comparar tabelas de preços', '30min', 'dQw4w9WgXcQ', 1),
  (mod3_id, 'Fatores que influenciam no preço', '20min', 'dQw4w9WgXcQ', 2);

  -- Quiz Plano de Saúde
  INSERT INTO quizzes (trilha_id, pergunta, opcoes, correta, ordem) VALUES
  ('plano-de-saude', 'Qual é a principal diferença entre um plano individual e um coletivo por adesão?', '["O plano coletivo tem reajuste regulado pela ANS", "O plano coletivo exige vínculo com uma entidade de classe", "Planos individuais não têm carência", "Não há diferença nas coberturas"]', 1, 1);
END $$;

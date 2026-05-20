# 🎓 Processo Sol e Sombra — W1 Goiânia

Portal de treinamentos para consultores do escritório **W1 Goiânia**.

## 🚀 Setup Rápido

### 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/solsombra-w1.git
cd solsombra-w1
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Supabase

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Configure o banco de dados no Supabase

Execute este SQL no Supabase SQL Editor:

```sql
-- 1. Tabela de usuários autorizados
CREATE TABLE authorized_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE authorized_users ENABLE ROW LEVEL SECURITY;

-- Políticas para authorized_users
-- Todos autenticados podem ler para checar permissão
CREATE POLICY "Users can check their own authorization"
  ON authorized_users FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Função segura para checar admin sem causar loop infinito
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
  SELECT is_admin FROM public.authorized_users WHERE email = auth.jwt() ->> 'email' LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Admins podem ler tudo
CREATE POLICY "Admins can select all"
  ON authorized_users FOR SELECT USING ( public.is_admin_user() );

-- Admins podem inserir/atualizar/deletar
CREATE POLICY "Admins can insert"
  ON authorized_users FOR INSERT WITH CHECK ( public.is_admin_user() );
CREATE POLICY "Admins can update"
  ON authorized_users FOR UPDATE USING ( public.is_admin_user() );
CREATE POLICY "Admins can delete"
  ON authorized_users FOR DELETE USING ( public.is_admin_user() );

-- Adicione seu email como o primeiro ADMIN
INSERT INTO authorized_users (email, nome, is_admin) VALUES
  ('SEU-EMAIL@gmail.com', 'Seu Nome', true);


-- 2. Tabela de Progresso (Aulas Concluídas)
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  trilha_id TEXT NOT NULL,
  aula_id INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, trilha_id, aula_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Usuários podem ler, inserir e deletar o próprio progresso
CREATE POLICY "Users can manage their own progress"
  ON user_progress FOR ALL USING (auth.jwt() ->> 'email' = user_email);


-- 3. Tabela de Notas dos Quizzes
CREATE TABLE user_quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  trilha_id TEXT NOT NULL,
  score_percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_quiz_results ENABLE ROW LEVEL SECURITY;

-- Usuários podem ler e inserir as próprias notas
CREATE POLICY "Users can manage their own quiz results"
  ON user_quiz_results FOR ALL USING (auth.jwt() ->> 'email' = user_email);
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

## 🔧 Deploy no GitHub Pages

### 1. Ajuste o `vite.config.js`

Altere `base` para o nome do seu repositório:

```js
base: '/nome-do-seu-repositorio/',
```

### 2. Adicione o script de deploy no `package.json`

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

### 3. Instale gh-pages

```bash
npm install -D gh-pages
```

### 4. Faça o deploy

```bash
npm run deploy
```

## 🎨 Design System

**Cores principais (W1):**
- Fundo: `#05171E`
- Destaque/CTA: `#32DDC9`
- Verde médio: `#73A09F`
- Verde escuro: `#305A5F`

## 📚 Trilhas Disponíveis

1. 🏥 Plano de Saúde
2. 🛡️ Seguro de Vida
3. 💼 Consultoria Patrimonial
4. 🚀 Business W1
5. 📦 Treinamento de Entregas
6. 🎯 Técnicas de Vendas

## 📝 Estrutura do Projeto

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── TrilhaCard.jsx
│   └── ProtectedRoute.jsx
├── contexts/
│   └── AuthContext.jsx
├── data/
│   └── trilhas.js
├── lib/
│   └── supabase.js
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── TrilhaPage.jsx
│   └── NotFound.jsx
└── index.css
```

---

Desenvolvido para o **Processo Sol e Sombra — W1 Goiânia** © 2025

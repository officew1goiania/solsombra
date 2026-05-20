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
-- Tabela de usuários autorizados
CREATE TABLE authorized_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE authorized_users ENABLE ROW LEVEL SECURITY;

-- Política: qualquer usuário autenticado pode verificar seu próprio email
CREATE POLICY "Users can check their own authorization"
  ON authorized_users
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- Adicione emails autorizados:
INSERT INTO authorized_users (email, nome) VALUES
  ('email@exemplo.com', 'Nome do Consultor');
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

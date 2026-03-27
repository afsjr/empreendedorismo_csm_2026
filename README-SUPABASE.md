# 🚀 Guia Supabase - 100% GRÁTIS (SEM CARTÃO!)
## Empreendedores Exponenciais - CSM

---

## ✅ **Por que Supabase é MELHOR que Firebase:**

| Recurso | Supabase | Firebase |
|---------|----------|----------|
| **Cartão de crédito** | ❌ NÃO pede | ⚠️ Pede |
| **Banco de dados** | PostgreSQL (SQL real) | NoSQL |
| **Interface** | Super simples | Mais complexa |
| **Limite grátis** | 500 MB + 50k req/mês | 1 GB + 50k leituras/dia |
| **SQL direto** | ✅ Sim | ❌ Não |

**Conclusão:** Para você, Supabase é **PERFEITO**! 🎯

---

## 🚀 **Configuração (10 minutos)**

### **PASSO 1: Criar Conta (2 min)**

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"**
3. Faça login com **GitHub** (ou crie conta com email)
4. ✅ **NÃO pede cartão!**

---

### **PASSO 2: Criar Projeto (3 min)**

1. Clique em **"New Project"**
2. Preencha:
   - **Name:** `empreendedores-csm`
   - **Database Password:** Crie uma senha forte (anote!)
   - **Region:** `South America (São Paulo)` ⭐
   - **Pricing Plan:** **Free** (já vem selecionado)
3. Clique em **"Create new project"**
4. Aguarde 2 minutos enquanto cria...

---

### **PASSO 3: Criar Tabelas (5 min)**

Quando o projeto estiver pronto:

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**
3. **COLE ESTE CÓDIGO INTEIRO:**

```sql
-- ========================================
-- TABELAS DO PROJETO EMPREENDEDORES
-- ========================================

-- Tabela de Dúvidas
CREATE TABLE duvidas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  turma TEXT NOT NULL,
  ano TEXT NOT NULL,
  aula TEXT NOT NULL,
  duvida TEXT NOT NULL,
  status TEXT DEFAULT 'pendente',
  resposta TEXT,
  respondido_por TEXT,
  data_resposta TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Projetos
CREATE TABLE projetos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_aluno TEXT NOT NULL,
  turma TEXT NOT NULL,
  ano TEXT NOT NULL,
  trimestre TEXT,
  tipo_projeto TEXT,
  titulo TEXT NOT NULL,
  descricao TEXT,
  conteudo JSONB,
  arquivos TEXT[],
  status TEXT DEFAULT 'em_andamento',
  nota NUMERIC(3,1),
  feedback TEXT,
  avaliado_por TEXT,
  data_avaliacao TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Conquistas
CREATE TABLE conquistas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_aluno TEXT NOT NULL,
  turma TEXT NOT NULL,
  ano TEXT NOT NULL,
  tipo_conquista TEXT,
  titulo TEXT NOT NULL,
  descricao TEXT,
  icone TEXT DEFAULT '🏆',
  pontos INTEGER DEFAULT 0,
  concedido_por TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_duvidas_turma ON duvidas(turma);
CREATE INDEX idx_duvidas_status ON duvidas(status);
CREATE INDEX idx_projetos_turma ON projetos(turma);
CREATE INDEX idx_projetos_tipo ON projetos(tipo_projeto);
CREATE INDEX idx_conquistas_aluno ON conquistas(nome_aluno);
CREATE INDEX idx_conquistas_turma ON conquistas(turma);

-- ========================================
-- PRONTO! Tabelas criadas com sucesso! ✅
-- ========================================
```

4. Clique em **"RUN"** (botão verde no canto inferior direito)
5. Deve aparecer: **"Success. No rows returned"** ✅

---

### **PASSO 4: Pegar suas Credenciais (2 min)**

1. No menu lateral, clique em **"Settings"** (engrenagem)
2. Clique em **"API"**
3. Você verá duas informações importantes:

**Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```

**anon/public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...
```

4. **COPIE AMBOS!** (você vai usar no próximo passo)

---

### **PASSO 5: Configurar o Arquivo supabase-config.js**

1. Abra o arquivo `supabase-config.js`
2. Localize estas linhas:

```javascript
const SUPABASE_URL = 'https://seu-projeto.supabase.co';
const SUPABASE_ANON_KEY = 'sua-anon-key-aqui';
```

3. **SUBSTITUA** pelos valores que você copiou:

```javascript
const SUPABASE_URL = 'https://xxxxxxxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...';
```

4. Salve o arquivo ✅

---

### **PASSO 6: Upload para GitHub**

Faça upload destes arquivos para seu repositório:

```
empreendedorismo_csm_2026/
├── index.html (já existe)
├── CSM_Empreendedores_2025.html (já existe)
├── empreendedores-platform.html (já existe)
├── supabase-config.js (NOVO - configurado!)
├── painel-professor-supabase.html (NOVO)
└── README-SUPABASE.md (este arquivo)
```

---

## 🎯 **Como Usar**

### **Adicionar o Supabase nas suas páginas HTML:**

No `<head>` de cada página, adicione:

```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Sua configuração -->
<script src="supabase-config.js"></script>
```

### **Exemplos de Uso:**

**Enviar Dúvida (aluno):**
```javascript
const dados = {
  nome: 'João Silva',
  turma: '6º Ano A',
  ano: '2026',
  aula: 'Aula 5',
  duvida: 'Como identificar oportunidades?'
};

const result = await SupabaseDB.enviarDuvida(dados);
console.log(result); // { success: true, id: '...' }
```

**Listar Dúvidas Pendentes (professor):**
```javascript
const duvidas = await SupabaseDB.listarDuvidas({ 
  status: 'pendente' 
});
console.log(duvidas); // Array de dúvidas
```

**Responder Dúvida (professor):**
```javascript
await SupabaseDB.responderDuvida(
  'id-da-duvida',
  'Ótima pergunta! Você pode...',
  'Prof. Adelino'
);
```

**Ver Ranking:**
```javascript
const ranking = await SupabaseDB.getRanking({ 
  turma: '6º Ano A' 
});
console.log(ranking); // Array ordenado por pontos
```

---

## 📊 **Ver os Dados no Supabase**

1. No Supabase, clique em **"Table Editor"**
2. Você verá 3 tabelas:
   - `duvidas`
   - `projetos`
   - `conquistas`
3. Clique em cada uma para ver os dados em tempo real!
4. Você pode **editar, deletar ou adicionar** direto pela interface

---

## 🔒 **Segurança (Configurar depois)**

Por padrão, qualquer pessoa pode **ler e escrever** nas tabelas.

**Para produção, configure as Row Level Security (RLS):**

1. Vá em **"Authentication"** > **"Policies"**
2. Para cada tabela, clique em **"Enable RLS"**
3. Adicione políticas como:

```sql
-- Todos podem inserir dúvidas
CREATE POLICY "Todos podem enviar duvidas"
ON duvidas FOR INSERT
TO public
WITH CHECK (true);

-- Todos podem ler
CREATE POLICY "Todos podem ler duvidas"
ON duvidas FOR SELECT
TO public
USING (true);

-- Só autenticados podem atualizar (professores)
CREATE POLICY "Só professores respondem"
ON duvidas FOR UPDATE
TO authenticated
USING (true);
```

**Por enquanto, pode deixar sem RLS para testar!**

---

## 🆘 **Problemas Comuns**

### **❌ "Supabase is not defined"**
**Solução:** Adicione o script do Supabase:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### **❌ "relation 'duvidas' does not exist"**
**Solução:** Você esqueceu de criar as tabelas no Passo 3!

### **❌ "Invalid API key"**
**Solução:** Verifique se copiou a **anon key** correta (é bem longa!)

### **❌ Dados não aparecem**
**Solução:** 
1. Abra **Table Editor** no Supabase
2. Verifique se as tabelas estão vazias
3. Execute o script `dados-teste-supabase.js`

---

## 💰 **Limites do Plano Grátis**

| Recurso | Limite Grátis |
|---------|---------------|
| **Armazenamento** | 500 MB |
| **Requisições** | 50 mil/mês |
| **Usuários autenticados** | Ilimitados |
| **Projetos** | 2 projetos |
| **Expira?** | ❌ NUNCA! |

**Para uma escola, isso é MAIS que suficiente!** 🎉

Se precisar de mais, só criar outro projeto (grátis também).

---

## 📈 **Recursos Extras do Supabase**

✅ **Realtime:** Ver dados atualizando em tempo real  
✅ **Storage:** Upload de arquivos (projetos dos alunos)  
✅ **Auth:** Login de professores  
✅ **Edge Functions:** Automatizar tarefas  
✅ **Backups automáticos:** Seu dados sempre seguros  

---

## 🎓 **Comparação Visual**

```
FIREBASE (pede cartão 💳)
├── Firestore (NoSQL)
├── Configuração complexa
└── 1 GB grátis

SUPABASE (SEM cartão! ✅)
├── PostgreSQL (SQL real)
├── Super fácil
├── Interface visual linda
└── 500 MB grátis (renovável!)
```

---

## 📞 **Próximos Passos**

1. ✅ Configurou o Supabase? → Teste enviando uma dúvida
2. ✅ Funcionou? → Adicione o formulário nas páginas
3. ✅ Quer dados de exemplo? → Execute `dados-teste-supabase.js`
4. ✅ Pronto para usar! → Compartilhe o link do painel

---

## 🎯 **Link Final do Painel:**

```
https://afsjr.github.io/empreendedorismo_csm_2026/painel-professor-supabase.html
```

**Desenvolvido com ❤️ para o Colégio Santa Mônica**  
Adelino Jr. • 2026

---

**Dúvidas? Me avise que te ajudo! 🚀**

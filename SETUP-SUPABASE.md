# Tutorial: Configurar Supabase para o Projeto Empreendedores CSM

Este guia passo a passo mostra como configurar o banco de dados Supabase.

---

## Etapa 1: Acessar o Supabase

1. Abra o navegador e vá para: **https://supabase.com/dashboard**
2. Faça login com sua conta (GitHub ou email)

---

## Etapa 2: Selecionar o Projeto

1. Na página inicial do Dashboard, clique no projeto **"empreendedores-csm"**

```
┌─────────────────────────────────────────┐
│  📁 Seus Projetos                       │
│  ├─ empreendimento-csm    [SELECIONAR]  │
│  └─ outro-projeto                       │
└─────────────────────────────────────────┘
```

---

## Etapa 3: Acessar Configurações do Projeto

1. No menu lateral ESQUERDO, clique no ícone de **engrenagem** (⚙️)
2. Clique em **"Project Settings"**

```
┌──────────┐
│ ⚙️ SETTINGS     ← CLIQUE AQUI          │
│ ─────────────────                 │
│ General                        │
│ API                            │
│ Database                       │
│ Authentication                 │
└──────────┘
```

---

## Etapa 4: Obter as Chaves de API

1. Na página de Settings, clique em **"API"**

```
┌─────────────────────────────────────────┐
│  Project Settings                       │
│  ─────────────                          │
│  [General]  [API]  [Database] ← CLIQUE │
└─────────────────────────────────────────┘
```

2. Você verá duas informações importantes:

### Copie a **Project URL**
```
🔗 Project URL
https://vujjlzgotmeokocfhjah.supabase.co/
         ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
         COPIE ESTA URL COMPLETA
```

### Copie a **anon public** (anon key)
```
🔑 Project API keys
├─ anon public          ← USE ESTA
│  eyJhbGciOiJIUzI1N...
│  [Copy]               ← CLIQUE PARA COPIAR
│
└─ service_role         ← NÃO USE ESTA
```

---

## Etapa 5: Atualizar o Código

1. Abra o arquivo **`supabase-config.js`** no seu editor
2. Nas primeiras linhas (14-15), cole as chaves:

```javascript
// ANTES (linhas 14-15):
const SUPABASE_URL = 'https://vujjlzgotmeokocfhjah.supabase.co/';
const SUPABASE_ANON_KEY = 'sua_anon_key_aqui';

// DEPOIS (cole suas chaves):
const SUPABASE_URL = 'https://vujjlzgotmeokocfhjah.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...COPIE_AQUI';
```

---

## Etapa 6: Criar as Tabelas no Banco

### Opção A: Usando o SQL Editor (Recomendado)

1. No menu lateral do Supabase, clique em **"SQL Editor"**

```
┌──────────┐
│ 📊 SQL EDITOR    ← CLIQUE AQUI          │
└──────────┘
```

2. Clique em **"New query"** ou **"+ New"**

3. **Copie todo o script SQL** do arquivo `supabase-config.js` (das linhas ~17 até ~94, entre `/*` e `*/`)

4. Cole no editor e clique em **"Run"** ou **"Execute"**

```
┌─────────────────────────────────────────┐
│  SQL Editor                              │
│  ──────────────────────                  │
│  + New query                             │
│  ─────────────────────────────────────  │
│  /*                                     │
│  -- CRIAÇÃO DE TABELAS                  │
│  CREATE TABLE IF NOT EXISTS alunos (     │
│      id UUID...                         │
│  ...                                    │
│  */                                     │
│                                          │
│          [▶ Run]    [Clear]             │
└─────────────────────────────────────────┘
```

5. Você verá uma mensagem de **"Success"** ou **"Completed"** se der tudo certo

### Verificar se as tabelas foram criadas

1. Clique em **"Table Editor"** no menu lateral

```
┌──────────┐
│ 📋 Table Editor   ← CLIQUE PARA VERIFICAR│
└──────────┘
```

2. Você deve ver estas tabelas criadas:
- [ ] `alunos`
- [ ] `grupos`
- [ ] `duvidas`
- [ ] `projetos`
- [ ] `conquistas`
- [ ] `progresso`
- [ ] `observacoes`

---

## Etapa 7: Testar a Conexão

1. Atualize a página do projeto no navegador
2. Abra o **DevTools** (F12 ou clique direito → Inspect)
3. Vá na aba **Console**
4. Você deve ver a mensagem:
```
✅ Supabase DB configurado!
```

---

## Solução de Problemas

### "Failed to fetch" ou erro de rede
- Verifique se a URL está correta
- Tente acessar a URL do Supabase diretamente no navegador

### "Invalid API key"
- Verifique se copiou a chave **anon public** (não a service_role)
- A chave deve começar com `eyJ`

### "Relation does not exist"
- Execute novamente o script SQL no SQL Editor
- Verifique se todas as tabelas foram criadas na Etapa 6

---

## Próximos Passos

Após configurar o Supabase:
1. ✅ Dados de dúvidas serão salvos no banco
2. ✅ Dados de projetos serão salvos no banco
3. ✅ Conquistas serão salvas no banco
4. ✅ Acessíveis de qualquer dispositivo

---

## Precisa de Ajuda?

Se tiver algum erro, tire um print da mensagem de erro e me envie.

// ========================================
// SUPABASE CONFIGURATION
// Empreendedores Exponenciais - CSM
// ========================================

// INSTRUÇÕES PARA CONFIGURAR O SUPABASE:
// 1. Acesse https://supabase.com/dashboard
// 2. Selecione seu projeto "empreendedores-csm"
// 3. Vá em SQL Editor e execute o script abaixo:
// ========================================

/*
-- CRIAÇÃO DE TABELAS
-- Execute este SQL no Supabase SQL Editor

-- Tabela de Alunos
CREATE TABLE IF NOT EXISTS alunos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE,
    turma TEXT NOT NULL,
    ano TEXT DEFAULT '2026',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Grupos
CREATE TABLE IF NOT EXISTS grupos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    projeto_id TEXT,
    ano INTEGER NOT NULL,
    membros TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Dúvidas
CREATE TABLE IF NOT EXISTS duvidas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_aluno TEXT NOT NULL,
    turma TEXT NOT NULL,
    ano TEXT DEFAULT '2026',
    modulo TEXT,
    pergunta TEXT NOT NULL,
    resposta TEXT,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'respondida')),
    respondido_por TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    respondida_at TIMESTAMPTZ
);

-- Tabela de Projetos
CREATE TABLE IF NOT EXISTS projetos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_aluno TEXT NOT NULL,
    turma TEXT NOT NULL,
    ano TEXT DEFAULT '2026',
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    conteudo JSONB,
    nota INTEGER CHECK (nota >= 0 AND nota <= 10),
    feedback TEXT,
    avaliado_por TEXT,
    status TEXT DEFAULT 'enviado' CHECK (status IN ('enviado', 'avaliado')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    avaliado_at TIMESTAMPTZ
);

-- Tabela de Conquistas
CREATE TABLE IF NOT EXISTS conquistas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_aluno TEXT NOT NULL,
    turma TEXT NOT NULL,
    ano TEXT DEFAULT '2026',
    titulo TEXT NOT NULL,
    descricao TEXT,
    icone TEXT DEFAULT '🏆',
    pontos INTEGER DEFAULT 0,
    concedido_por TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Progresso (etapas concluídas)
CREATE TABLE IF NOT EXISTS progresso (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grupo_id UUID REFERENCES grupos(id),
    projeto_id TEXT NOT NULL,
    etapa INTEGER NOT NULL,
    concluida BOOLEAN DEFAULT FALSE,
    anotacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(grupo_id, projeto_id, etapa)
);

-- Tabela de Observações do Professor
CREATE TABLE IF NOT EXISTS observacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    projeto_id TEXT NOT NULL,
    etapa INTEGER NOT NULL,
    observacao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(projeto_id, etapa)
);

-- CONFIGURAR ROW LEVEL SECURITY (RLS)
-- Execute estes comandos após criar as tabelas

ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE duvidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE conquistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE progresso ENABLE ROW LEVEL SECURITY;
ALTER TABLE observacoes ENABLE ROW LEVEL SECURITY;

-- Política: todos podem ler, apenas authenticated podem inserir/atualizar
CREATE POLICY "Allow public read" ON alunos FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON grupos FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON duvidas FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON projetos FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON conquistas FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON progresso FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON observacoes FOR SELECT USING (true);

CREATE POLICY "Allow all for authenticated" ON duvidas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON projetos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON conquistas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON progresso FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated" ON observacoes FOR ALL USING (auth.role() = 'authenticated');
*/

// ========================================
// CONFIGURAÇÃO DO CLIENTE
// ========================================

const SUPABASE_URL = 'https://vujjlzgotmeokocfhjah.supabase.co/';
const SUPABASE_ANON_KEY = 'sb_publishable_HesgpESGRCAPfuQMkWHt5Q_HtMSwcgc';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========================================
// BANCO DE DADOS
// ========================================

const DB = {
    // ALUNOS
    async listarAlunos(turma = null) {
        let query = supabaseClient.from('alunos').select('*').order('nome');
        if (turma) query = query.eq('turma', turma);
        const { data } = await query;
        return data || [];
    },

    async criarAluno(dados) {
        const { data, error } = await supabaseClient.from('alunos').insert([dados]).select();
        if (error) throw error;
        return data[0];
    },

    // GRUPOS
    async listarGrupos(turma = null) {
        let query = supabaseClient.from('grupos').select('*').order('created_at', { ascending: false });
        if (turma) query = query.eq('ano', turma);
        const { data } = await query;
        return data || [];
    },

    async criarGrupo(dados) {
        const { data, error } = await supabaseClient.from('grupos').insert([dados]).select();
        if (error) throw error;
        return data[0];
    },

    async atualizarGrupo(id, dados) {
        const { data, error } = await supabaseClient.from('grupos').update(dados).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    async excluirGrupo(id) {
        const { error } = await supabaseClient.from('grupos').delete().eq('id', id);
        if (error) throw error;
    },

    // DÚVIDAS
    async listarDuvidas(filtros = {}) {
        let query = supabaseClient.from('duvidas').select('*').order('created_at', { ascending: false });
        if (filtros.turma) query = query.eq('turma', filtros.turma);
        if (filtros.status) query = query.eq('status', filtros.status);
        const { data } = await query;
        return data || [];
    },

    async enviarDuvida(dados) {
        const { data, error } = await supabaseClient.from('duvidas').insert([{
            nome_aluno: dados.nome,
            turma: dados.turma,
            ano: dados.ano,
            modulo: dados.modulo,
            pergunta: dados.pergunta,
            status: 'pendente'
        }]).select();
        if (error) throw error;
        return data[0];
    },

    async responderDuvida(id, resposta, professor) {
        const { data, error } = await supabaseClient.from('duvidas').update({
            resposta,
            status: 'respondida',
            respondido_por: professor,
            respondida_at: new Date().toISOString()
        }).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    async excluirDuvida(id) {
        const { error } = await supabaseClient.from('duvidas').delete().eq('id', id);
        if (error) throw error;
    },

    // PROJETOS
    async listarProjetos(filtros = {}) {
        let query = supabaseClient.from('projetos').select('*').order('created_at', { ascending: false });
        if (filtros.turma) query = query.eq('turma', filtros.turma);
        if (filtros.tipo) query = query.eq('tipo', filtros.tipo);
        const { data } = await query;
        return data || [];
    },

    async enviarProjeto(dados) {
        const { data, error } = await supabaseClient.from('projetos').insert([{
            nome_aluno: dados.nome,
            turma: dados.turma,
            ano: dados.ano,
            tipo: dados.tipo,
            titulo: dados.titulo,
            descricao: dados.descricao,
            conteudo: dados.conteudo,
            status: 'enviado'
        }]).select();
        if (error) throw error;
        return data[0];
    },

    async avaliarProjeto(id, nota, feedback, professor) {
        const { data, error } = await supabaseClient.from('projetos').update({
            nota,
            feedback,
            avaliado_por: professor,
            status: 'avaliado',
            avaliado_at: new Date().toISOString()
        }).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    // CONQUISTAS
    async listarConquistas(filtros = {}) {
        let query = supabaseClient.from('conquistas').select('*').order('created_at', { ascending: false });
        if (filtros.turma) query = query.eq('turma', filtros.turma);
        const { data } = await query;
        return data || [];
    },

    async concederConquista(dados) {
        const { data, error } = await supabaseClient.from('conquistas').insert([{
            nome_aluno: dados.aluno,
            turma: dados.turma,
            ano: dados.ano,
            titulo: dados.titulo,
            descricao: dados.descricao,
            icone: dados.icone,
            pontos: dados.pontos,
            concedido_por: dados.concedidoPor
        }]).select();
        if (error) throw error;
        return data[0];
    },

    async getRanking(turma = null) {
        let query = supabaseClient.from('conquistas').select('nome_aluno, turma, pontos');
        if (turma) query = query.eq('turma', turma);
        const { data } = await query;

        const ranking = {};
        (data || []).forEach(c => {
            if (!ranking[c.nome_aluno]) {
                ranking[c.nome_aluno] = { nome: c.nome_aluno, turma: c.turma, pontos: 0, conquistas: 0 };
            }
            ranking[c.nome_aluno].pontos += c.pontos || 0;
            ranking[c.nome_aluno].conquistas++;
        });

        return Object.values(ranking).sort((a, b) => b.pontos - a.pontos);
    },

    // PROGRESSO
    async getProgresso(grupoId, projetoId) {
        const { data } = await supabaseClient.from('progresso')
            .select('*')
            .eq('grupo_id', grupoId)
            .eq('projeto_id', projetoId);
        return data || [];
    },

    async atualizarProgresso(grupoId, projetoId, etapa, concluida, anotações = '') {
        const { data, error } = await supabaseClient.from('progresso').upsert({
            grupo_id: grupoId,
            projeto_id: projetoId,
            etapa,
            concluida,
            anotações,
            updated_at: new Date().toISOString()
        }, { onConflict: 'grupo_id,projeto_id,etapa' }).select();
        if (error) throw error;
        return data;
    },

    // OBSERVAÇÕES
    async getObservacao(projetoId, etapa) {
        const { data } = await supabaseClient.from('observacoes')
            .select('*')
            .eq('projeto_id', projetoId)
            .eq('etapa', etapa)
            .single();
        return data;
    },

    async salvarObservacao(projetoId, etapa, texto) {
        const { data, error } = await supabaseClient.from('observacoes').upsert({
            projeto_id: projetoId,
            etapa,
            observacao: texto,
            updated_at: new Date().toISOString()
        }, { onConflict: 'projeto_id,etapa' }).select();
        if (error) throw error;
        return data;
    },

    // ESTATÍSTICAS
    async getEstatisticas() {
        const [duvidas, projetos, conquistas] = await Promise.all([
            supabaseClient.from('duvidas').select('status'),
            supabaseClient.from('projetos').select('status'),
            supabaseClient.from('conquistas').select('nome_aluno')
        ]);

        const stats = {
            duvidasPendentes: (duvidas.data || []).filter(d => d.status === 'pendente').length,
            duvidasRespondidas: (duvidas.data || []).filter(d => d.status === 'respondida').length,
            projetosEnviados: (projetos.data || []).filter(p => p.status === 'enviado').length,
            projetosAvaliados: (projetos.data || []).filter(p => p.status === 'avaliado').length,
            totalConquistas: (conquistas.data || []).length,
            alunosAtivos: new Set((conquistas.data || []).map(c => c.nome_aluno)).size
        };

        return stats;
    }
};

// Exportar para uso global
window.DB = DB;

console.log('✅ Supabase DB configurado!');

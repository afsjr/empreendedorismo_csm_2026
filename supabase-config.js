// ========================================
// SUPABASE CONFIGURATION
// Empreendedores Exponenciais - CSM
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

    async listarDuvidas(filtros = {}) {
        let query = supabaseClient.from('duvidas').select('*').order('created_at', { ascending: false });
        if (filtros.status) query = query.eq('status', filtros.status);
        if (filtros.ano) query = query.eq('ano', filtros.ano.toString());
        if (filtros.turma) query = query.eq('turma', filtros.turma);
        const { data } = await query;
        return data || [];
    },

    async responderDuvida(id, resposta, respondidoPor) {
        const { data, error } = await supabaseClient.from('duvidas').update({
            resposta: resposta,
            respondido_por: respondidoPor,
            status: 'respondida',
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

    async listarProjetos(filtros = {}) {
        let query = supabaseClient.from('projetos').select('*').order('created_at', { ascending: false });
        if (filtros.status) query = query.eq('status', filtros.status);
        if (filtros.ano) query = query.eq('ano', filtros.ano.toString());
        if (filtros.turma) query = query.eq('turma', filtros.turma);
        const { data } = await query;
        return data || [];
    },

    async avaliarProjeto(id, nota, feedback, avaliadoPor) {
        const { data, error } = await supabaseClient.from('projetos').update({
            nota: nota,
            feedback: feedback,
            avaliado_por: avaliadoPor,
            status: 'avaliado',
            avaliado_at: new Date().toISOString()
        }).eq('id', id).select();
        if (error) throw error;
        return data[0];
    },

    async excluirProjeto(id) {
        const { error } = await supabaseClient.from('projetos').delete().eq('id', id);
        if (error) throw error;
    },

    // CONQUISTAS
    async listarConquistas(filtros = {}) {
        let query = supabaseClient.from('conquistas').select('*').order('created_at', { ascending: false });
        if (filtros.ano) query = query.eq('ano', filtros.ano.toString());
        if (filtros.turma) query = query.eq('turma', filtros.turma);
        const { data } = await query;
        return data || [];
    },

    async adicionarConquista(dados) {
        const { data, error } = await supabaseClient.from('conquistas').insert([{
            nome_aluno: dados.nome,
            turma: dados.turma,
            ano: dados.ano,
            titulo: dados.titulo,
            descricao: dados.descricao,
            icone: dados.icone || '🏆',
            pontos: dados.pontos || 0,
            concedido_por: dados.concedidoPor
        }]).select();
        if (error) throw error;
        return data[0];
    },

    async excluirConquista(id) {
        const { error } = await supabaseClient.from('conquistas').delete().eq('id', id);
        if (error) throw error;
    },

    // PROGRESSO
    async atualizarProgresso(grupoId, projetoId, etapa, concluida, anotacoes) {
        const { data, error } = await supabaseClient.from('progresso').upsert({
            grupo_id: grupoId,
            projeto_id: projetoId,
            etapa: etapa,
            concluida: concluida,
            anotacoes: anotacoes,
            updated_at: new Date().toISOString()
        }, { onConflict: 'grupo_id,projeto_id,etapa' }).select();
        if (error) throw error;
        return data[0];
    },

    async buscarProgresso(grupoId, projetoId) {
        const { data } = await supabaseClient.from('progresso')
            .select('*')
            .eq('grupo_id', grupoId)
            .eq('projeto_id', projetoId)
            .order('etapa');
        return data || [];
    },

    // OBSERVAÇÕES
    async salvarObservacao(projetoId, etapa, observacao) {
        const { data, error } = await supabaseClient.from('observacoes').upsert({
            projeto_id: projetoId,
            etapa: etapa,
            observacao: observacao,
            updated_at: new Date().toISOString()
        }, { onConflict: 'projeto_id,etapa' }).select();
        if (error) throw error;
        return data[0];
    },

    async buscarObservacoes(projetoId) {
        const { data } = await supabaseClient.from('observacoes')
            .select('*')
            .eq('projeto_id', projetoId)
            .order('etapa');
        return data || [];
    },

    // ESTATÍSTICAS
    async getStats() {
        const [duvidas, projetos, conquistas] = await Promise.all([
            supabaseClient.from('duvidas').select('id', { count: 'exact' }),
            supabaseClient.from('projetos').select('id', { count: 'exact' }),
            supabaseClient.from('conquistas').select('*')
        ]);

        const stats = {
            totalDuvidas: duvidas.count || 0,
            duvidasRespondidas: (duvidas.data || []).filter(d => d.status === 'respondida').length,
            totalProjetos: projetos.count || 0,
            projetosAvaliados: (projetos.data || []).filter(p => p.status === 'avaliado').length,
            totalConquistas: conquistas.data?.length || 0,
            alunosAtivos: new Set((conquistas.data || []).map(c => c.nome_aluno)).size
        };

        return stats;
    }
};

window.DB = DB;
console.log('✅ Supabase DB configurado!');

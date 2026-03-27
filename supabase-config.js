// ========================================
// SUPABASE CONFIGURATION
// Empreendedores Exponenciais - CSM
// 100% GRÁTIS - SEM CARTÃO DE CRÉDITO
// ========================================

// INSTRUÇÕES:
// 1. Acesse https://supabase.com
// 2. Clique em "Start your project"
// 3. Faça login com GitHub (ou crie conta grátis)
// 4. Crie um novo projeto chamado "empreendedores-csm"
// 5. Copie a URL e a anon key e cole abaixo

const SUPABASE_URL = 'https://vujjlzgotmeokocfhjah.supabase.co/';
const SUPABASE_ANON_KEY = 'sb_secret_9KDs1V7Hjx02NTSja7Of7w__bJsljCG';

// Inicializar Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase configurado!');

// ========================================
// FUNÇÕES DE DÚVIDAS
// ========================================

/**
 * Enviar nova dúvida do aluno
 */
async function enviarDuvida(dados) {
  try {
    const duvida = {
      nome: dados.nome,
      turma: dados.turma,
      ano: dados.ano,
      aula: dados.aula,
      duvida: dados.duvida,
      status: 'pendente',
      resposta: null,
      respondido_por: null,
      data_resposta: null,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('duvidas')
      .insert([duvida])
      .select();

    if (error) throw error;

    console.log('✅ Dúvida enviada! ID:', data[0].id);
    return { success: true, id: data[0].id };
  } catch (error) {
    console.error('❌ Erro ao enviar dúvida:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Listar todas as dúvidas (para professores)
 */
async function listarDuvidas(filtros = {}) {
  try {
    let query = supabase
      .from('duvidas')
      .select('*')
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (filtros.turma) {
      query = query.eq('turma', filtros.turma);
    }
    if (filtros.ano) {
      query = query.eq('ano', filtros.ano);
    }
    if (filtros.status) {
      query = query.eq('status', filtros.status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('❌ Erro ao listar dúvidas:', error);
    return [];
  }
}

/**
 * Responder dúvida (professor)
 */
async function responderDuvida(duvidaId, resposta, professorNome) {
  try {
    const { data, error } = await supabase
      .from('duvidas')
      .update({
        resposta: resposta,
        respondido_por: professorNome,
        data_resposta: new Date().toISOString(),
        status: 'respondida'
      })
      .eq('id', duvidaId)
      .select();

    if (error) throw error;

    console.log('✅ Dúvida respondida com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao responder dúvida:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Deletar/Arquivar dúvida
 */
async function deletarDuvida(duvidaId) {
  try {
    const { error } = await supabase
      .from('duvidas')
      .delete()
      .eq('id', duvidaId);

    if (error) throw error;

    console.log('✅ Dúvida arquivada!');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao arquivar dúvida:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// FUNÇÕES DE PROJETOS
// ========================================

/**
 * Salvar projeto do aluno
 */
async function salvarProjeto(dados) {
  try {
    const projeto = {
      nome_aluno: dados.nomeAluno,
      turma: dados.turma,
      ano: dados.ano,
      trimestre: dados.trimestre,
      tipo_projeto: dados.tipoProjeto,
      titulo: dados.titulo,
      descricao: dados.descricao,
      conteudo: dados.conteudo, // JSONB
      arquivos: dados.arquivos || [],
      status: 'em_andamento',
      nota: null,
      feedback: null,
      avaliado_por: null,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('projetos')
      .insert([projeto])
      .select();

    if (error) throw error;

    console.log('✅ Projeto salvo! ID:', data[0].id);
    return { success: true, id: data[0].id };
  } catch (error) {
    console.error('❌ Erro ao salvar projeto:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Listar projetos por turma/ano
 */
async function listarProjetos(filtros = {}) {
  try {
    let query = supabase
      .from('projetos')
      .select('*')
      .order('created_at', { ascending: false });

    if (filtros.turma) {
      query = query.eq('turma', filtros.turma);
    }
    if (filtros.ano) {
      query = query.eq('ano', filtros.ano);
    }
    if (filtros.trimestre) {
      query = query.eq('trimestre', filtros.trimestre);
    }
    if (filtros.tipoProjeto) {
      query = query.eq('tipo_projeto', filtros.tipoProjeto);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('❌ Erro ao listar projetos:', error);
    return [];
  }
}

/**
 * Avaliar projeto
 */
async function avaliarProjeto(projetoId, nota, feedback, professorNome) {
  try {
    const { data, error } = await supabase
      .from('projetos')
      .update({
        nota: nota,
        feedback: feedback,
        avaliado_por: professorNome,
        status: 'avaliado',
        data_avaliacao: new Date().toISOString()
      })
      .eq('id', projetoId)
      .select();

    if (error) throw error;

    console.log('✅ Projeto avaliado com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao avaliar projeto:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// FUNÇÕES DE CONQUISTAS
// ========================================

/**
 * Adicionar conquista para aluno
 */
async function adicionarConquista(dados) {
  try {
    const conquista = {
      nome_aluno: dados.nomeAluno,
      turma: dados.turma,
      ano: dados.ano,
      tipo_conquista: dados.tipoConquista,
      titulo: dados.titulo,
      descricao: dados.descricao,
      icone: dados.icone || '🏆',
      pontos: dados.pontos || 0,
      concedido_por: dados.concedidoPor || 'Sistema',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('conquistas')
      .insert([conquista])
      .select();

    if (error) throw error;

    console.log('✅ Conquista adicionada! ID:', data[0].id);
    return { success: true, id: data[0].id };
  } catch (error) {
    console.error('❌ Erro ao adicionar conquista:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Listar conquistas de um aluno
 */
async function listarConquistas(nomeAluno, turma = null) {
  try {
    let query = supabase
      .from('conquistas')
      .select('*')
      .eq('nome_aluno', nomeAluno)
      .order('created_at', { ascending: false });

    if (turma) {
      query = query.eq('turma', turma);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('❌ Erro ao listar conquistas:', error);
    return [];
  }
}

/**
 * Obter ranking de alunos por pontos
 */
async function getRanking(filtros = {}) {
  try {
    let query = supabase
      .from('conquistas')
      .select('*');

    if (filtros.turma) {
      query = query.eq('turma', filtros.turma);
    }
    if (filtros.ano) {
      query = query.eq('ano', filtros.ano);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Agrupar por aluno
    const pontuacoes = {};

    (data || []).forEach(conquista => {
      const aluno = conquista.nome_aluno;

      if (!pontuacoes[aluno]) {
        pontuacoes[aluno] = {
          nome: aluno,
          turma: conquista.turma,
          ano: conquista.ano,
          pontos: 0,
          conquistas: 0
        };
      }

      pontuacoes[aluno].pontos += conquista.pontos || 0;
      pontuacoes[aluno].conquistas += 1;
    });

    // Converter para array e ordenar
    const ranking = Object.values(pontuacoes)
      .sort((a, b) => b.pontos - a.pontos);

    return ranking;
  } catch (error) {
    console.error('❌ Erro ao obter ranking:', error);
    return [];
  }
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

/**
 * Obter estatísticas gerais
 */
async function getEstatisticas() {
  try {
    const stats = {
      totalDuvidas: 0,
      duvidasPendentes: 0,
      duvidasRespondidas: 0,
      totalProjetos: 0,
      projetosAvaliados: 0,
      totalConquistas: 0,
      alunosAtivos: new Set()
    };

    // Contar dúvidas
    const { data: duvidas } = await supabase
      .from('duvidas')
      .select('nome, status');

    if (duvidas) {
      stats.totalDuvidas = duvidas.length;
      duvidas.forEach(d => {
        if (d.status === 'pendente') stats.duvidasPendentes++;
        if (d.status === 'respondida') stats.duvidasRespondidas++;
        stats.alunosAtivos.add(d.nome);
      });
    }

    // Contar projetos
    const { data: projetos } = await supabase
      .from('projetos')
      .select('nome_aluno, status');

    if (projetos) {
      stats.totalProjetos = projetos.length;
      projetos.forEach(p => {
        if (p.status === 'avaliado') stats.projetosAvaliados++;
        stats.alunosAtivos.add(p.nome_aluno);
      });
    }

    // Contar conquistas
    const { data: conquistas } = await supabase
      .from('conquistas')
      .select('nome_aluno');

    if (conquistas) {
      stats.totalConquistas = conquistas.length;
      conquistas.forEach(c => {
        stats.alunosAtivos.add(c.nome_aluno);
      });
    }

    stats.alunosAtivos = stats.alunosAtivos.size;

    return stats;
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    return null;
  }
}

// ========================================
// EXPORTAR FUNÇÕES
// ========================================

window.SupabaseDB = {
  // Dúvidas
  enviarDuvida,
  listarDuvidas,
  responderDuvida,
  deletarDuvida,

  // Projetos
  salvarProjeto,
  listarProjetos,
  avaliarProjeto,

  // Conquistas
  adicionarConquista,
  listarConquistas,
  getRanking,

  // Auxiliares
  getEstatisticas
};

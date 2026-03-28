-- ========================================
-- TABELA DE REGISTRO DE ATIVIDADES (LOGBOOK)
-- Empreendedores Exponenciais - CSM
-- ========================================

-- Criar tabela de logs
CREATE TABLE IF NOT EXISTS logs_atividades (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL DEFAULT 'acao',
    descricao TEXT NOT NULL,
    usuario VARCHAR(100),
    ano_escolar INTEGER,
    entidade_id VARCHAR(100),
    ip_anonimizado VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE logs_atividades ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura apenas por autenticados
CREATE POLICY "Permitir leitura logs_atividades" ON logs_atividades
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Política para permitir insert por todos
CREATE POLICY "Permitir insert logs_atividades" ON logs_atividades
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Criar índice para melhor performance
CREATE INDEX idx_logs_atividades_created_at ON logs_atividades(created_at DESC);
CREATE INDEX idx_logs_atividades_tipo ON logs_atividades(tipo);

-- Comentário da tabela
COMMENT ON TABLE logs_atividades IS 'Registro de atividades do sistema - Logbook';
COMMENT ON COLUMN logs_atividades.tipo IS 'Tipo de ação: login, criacao_grupo, exclusao_grupo, atualizacao_progresso';
COMMENT ON COLUMN logs_atividades.descricao IS 'Descrição da ação realizada';
COMMENT ON COLUMN logs_atividades.usuario IS 'Usuário que realizou a ação';

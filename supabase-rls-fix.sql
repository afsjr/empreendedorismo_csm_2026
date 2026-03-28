-- ========================================
-- CORREÇÃO RLS (Row Level Security)
-- Execute no SQL Editor do Supabase
-- ========================================

-- ========================================
-- DROPAR TODAS AS POLÍTICAS EXISTENTES
-- ========================================

DROP POLICY IF EXISTS "enable_all_operations_grupos" ON grupos;
DROP POLICY IF EXISTS "Allow public read" ON grupos;
DROP POLICY IF EXISTS "Allow all for authenticated" ON grupos;

DROP POLICY IF EXISTS "enable_all_operations_alunos" ON alunos;
DROP POLICY IF EXISTS "Allow public read" ON alunos;

DROP POLICY IF EXISTS "enable_all_operations_duvidas" ON duvidas;
DROP POLICY IF EXISTS "Allow public read" ON duvidas;
DROP POLICY IF EXISTS "Allow all for authenticated" ON duvidas;

DROP POLICY IF EXISTS "enable_all_operations_projetos" ON projetos;
DROP POLICY IF EXISTS "Allow public read" ON projetos;
DROP POLICY IF EXISTS "Allow all for authenticated" ON projetos;

DROP POLICY IF EXISTS "enable_all_operations_conquistas" ON conquistas;
DROP POLICY IF EXISTS "Allow public read" ON conquistas;
DROP POLICY IF EXISTS "Allow all for authenticated" ON conquistas;

DROP POLICY IF EXISTS "enable_all_operations_progresso" ON progresso;
DROP POLICY IF EXISTS "Allow public read" ON progresso;
DROP POLICY IF EXISTS "Allow all for authenticated" ON progresso;

DROP POLICY IF EXISTS "enable_all_operations_observacoes" ON observacoes;
DROP POLICY IF EXISTS "Allow public read" ON observacoes;
DROP POLICY IF EXISTS "Allow all for authenticated" ON observacoes;

-- ========================================
-- CRIAR NOVAS POLÍTICAS PÚBLICAS
-- ========================================

-- GRUPOS
CREATE POLICY "enable_all_operations_grupos" ON grupos
FOR ALL USING (true) WITH CHECK (true);

-- ALUNOS
CREATE POLICY "enable_all_operations_alunos" ON alunos
FOR ALL USING (true) WITH CHECK (true);

-- DÚVIDAS
CREATE POLICY "enable_all_operations_duvidas" ON duvidas
FOR ALL USING (true) WITH CHECK (true);

-- PROJETOS
CREATE POLICY "enable_all_operations_projetos" ON projetos
FOR ALL USING (true) WITH CHECK (true);

-- CONQUISTAS
CREATE POLICY "enable_all_operations_conquistas" ON conquistas
FOR ALL USING (true) WITH CHECK (true);

-- PROGRESSO
CREATE POLICY "enable_all_operations_progresso" ON progresso
FOR ALL USING (true) WITH CHECK (true);

-- OBSERVAÇÕES
CREATE POLICY "enable_all_operations_observacoes" ON observacoes
FOR ALL USING (true) WITH CHECK (true);

-- ========================================
-- VERIFICAR
-- ========================================

SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' ORDER BY tablename;

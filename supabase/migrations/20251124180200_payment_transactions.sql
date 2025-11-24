-- ============================================
-- MIGRATION: Tabela de transações de pagamento
-- Data: 2025-11-24
-- Objetivo: Registrar histórico de pagamentos
-- ============================================

BEGIN;

-- ============================================
-- ENUM: Status de Pagamento
-- ============================================
DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- TABELA: payment_transactions
-- ============================================
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Informações do pagamento
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MZN',
  payment_method TEXT NOT NULL, -- 'stripe', 'mpesa', 'whatsapp', 'manual'
  payment_id TEXT, -- ID externo (Stripe, M-Pesa, etc)
  status payment_status NOT NULL DEFAULT 'pending',

  -- Informações da subscription
  subscription_tier TEXT NOT NULL, -- 'semanal', 'mensal', 'vitalicio'
  subscription_period_start TIMESTAMPTZ,
  subscription_period_end TIMESTAMPTZ,

  -- Metadata adicional
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id
ON payment_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_status
ON payment_transactions(status);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment_id
ON payment_transactions(payment_id)
WHERE payment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at
ON payment_transactions(created_at DESC);

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas suas próprias transações
DROP POLICY IF EXISTS "Users can view own payment transactions" ON payment_transactions;
CREATE POLICY "Users can view own payment transactions"
ON payment_transactions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Apenas service role pode inserir transações
DROP POLICY IF EXISTS "Service role can insert payment transactions" ON payment_transactions;
CREATE POLICY "Service role can insert payment transactions"
ON payment_transactions
FOR INSERT
TO service_role
WITH CHECK (true);

-- Apenas service role pode atualizar transações
DROP POLICY IF EXISTS "Service role can update payment transactions" ON payment_transactions;
CREATE POLICY "Service role can update payment transactions"
ON payment_transactions
FOR UPDATE
TO service_role
USING (true);

-- ============================================
-- FUNÇÃO: Obter histórico de pagamentos
-- ============================================
CREATE OR REPLACE FUNCTION get_user_payment_history(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  amount DECIMAL,
  currency TEXT,
  payment_method TEXT,
  status payment_status,
  subscription_tier TEXT,
  created_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pt.id,
    pt.amount,
    pt.currency,
    pt.payment_method,
    pt.status,
    pt.subscription_tier,
    pt.created_at,
    pt.paid_at
  FROM payment_transactions pt
  WHERE pt.user_id = p_user_id
  ORDER BY pt.created_at DESC;
END;
$$;

-- ============================================
-- FUNÇÃO: Obter estatísticas de pagamentos (Admin)
-- ============================================
CREATE OR REPLACE FUNCTION get_payment_stats()
RETURNS TABLE (
  total_revenue DECIMAL,
  total_transactions BIGINT,
  pending_count BIGINT,
  completed_count BIGINT,
  failed_count BIGINT,
  semanal_count BIGINT,
  mensal_count BIGINT,
  vitalicio_count BIGINT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as total_revenue,
    COUNT(*) as total_transactions,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
    COUNT(*) FILTER (WHERE subscription_tier = 'semanal') as semanal_count,
    COUNT(*) FILTER (WHERE subscription_tier = 'mensal') as mensal_count,
    COUNT(*) FILTER (WHERE subscription_tier = 'vitalicio') as vitalicio_count
  FROM payment_transactions;
END;
$$;

-- ============================================
-- GRANTS
-- ============================================
GRANT SELECT ON payment_transactions TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_payment_history(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_payment_stats() TO authenticated;

-- ============================================
-- TRIGGER: Atualizar updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at
BEFORE UPDATE ON payment_transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- SELECT * FROM payment_transactions LIMIT 5;
-- SELECT * FROM get_payment_stats();

CREATE INDEX IF NOT EXISTS idx_opportunity_owner_stage_created
ON opportunity(owner_id, stage, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_app_user_store_role
ON app_user(store_id, role);

CREATE INDEX IF NOT EXISTS idx_opportunity_stage_history
ON opportunity_stage_history(opportunity_id, changed_at, history_id);
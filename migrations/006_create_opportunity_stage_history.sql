CREATE TABLE IF NOT EXISTS opportunity_stage_history (
    history_id BIGSERIAL PRIMARY KEY,

    opportunity_id BIGINT NOT NULL
        REFERENCES opportunity(opportunity_id),

    from_stage VARCHAR(20) NOT NULL
        CHECK (from_stage IN ('TIEP_CAN', 'TU_VAN', 'BAO_GIA', 'CHOT')),

    to_stage VARCHAR(20) NOT NULL
        CHECK (to_stage IN ('TIEP_CAN', 'TU_VAN', 'BAO_GIA', 'CHOT')),

    changed_by BIGINT NOT NULL
        REFERENCES app_user(user_id),

    changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_stage_transition
        CHECK (
            (from_stage = 'TIEP_CAN' AND to_stage = 'TU_VAN')
            OR
            (from_stage = 'TU_VAN' AND to_stage = 'BAO_GIA')
            OR
            (from_stage = 'BAO_GIA' AND to_stage = 'CHOT')
        )
);
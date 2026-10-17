CREATE TABLE IF NOT EXISTS opportunity (
    opportunity_id BIGSERIAL PRIMARY KEY,

    customer_id BIGINT NOT NULL
        REFERENCES customer(customer_id),

    product_id BIGINT NOT NULL
        REFERENCES product(product_id),

    owner_id BIGINT NOT NULL
        REFERENCES app_user(user_id),

    need_desc VARCHAR(500) NOT NULL
        CHECK (length(trim(need_desc)) BETWEEN 1 AND 500),

    expected_value NUMERIC(15,0) NOT NULL
        CHECK (expected_value >= 0),

    stage VARCHAR(20) NOT NULL DEFAULT 'TIEP_CAN'
        CHECK (stage IN ('TIEP_CAN', 'TU_VAN', 'BAO_GIA', 'CHOT')),

    result VARCHAR(20)
        CHECK (result IS NULL OR result IN ('THANH_CONG', 'THAT_BAI')),

    failure_reason VARCHAR(500),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_result_at_chot
        CHECK (
            result IS NULL
            OR stage = 'CHOT'
        ),

    CONSTRAINT chk_failure_reason
    CHECK (
        result IS DISTINCT FROM 'THAT_BAI'
        OR (
            failure_reason IS NOT NULL
            AND length(trim(failure_reason)) BETWEEN 1 AND 500
        )
    )
);
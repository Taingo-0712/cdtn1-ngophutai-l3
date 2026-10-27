const pool = require("../db");

async function getAll()
 {
  
  const result = await pool.query(`
    SELECT
      opportunity_id,
      customer_id,
      product_id,
      owner_id,
      need_desc,
      expected_value,
      stage,
      result,
      failure_reason,
      created_at,
      updated_at
    FROM opportunity
    ORDER BY opportunity_id
  `);

  return result.rows;
}

async function getById(id) {
  const result = await pool.query(
    `
    SELECT
      opportunity_id,
      customer_id,
      product_id,
      owner_id,
      need_desc,
      expected_value,
      stage,
      result,
      failure_reason,
      created_at,
      updated_at
    FROM opportunity
    WHERE opportunity_id = $1
    `,
    [id]
  );

  return result.rows[0];
}

async function create(data) {
  const {
    customer_id,
    product_id,
    owner_id,
    need_desc,
    expected_value
  } = data;

  const result = await pool.query(
    `
    INSERT INTO opportunity (
      customer_id,
      product_id,
      owner_id,
      need_desc,
      expected_value,
      stage
    )
    VALUES ($1, $2, $3, $4, $5, 'TIEP_CAN')
    RETURNING *
    `,
    [
      customer_id,
      product_id,
      owner_id,
      need_desc,
      expected_value
    ]
  );

  return result.rows[0];
}

async function update(id, data) {
  const {
    need_desc,
    expected_value
  } = data;

  const result = await pool.query(
    `
    UPDATE opportunity
    SET
      need_desc = COALESCE($1, need_desc),
      expected_value = COALESCE($2, expected_value),
      updated_at = now()
    WHERE opportunity_id = $3
    RETURNING *
    `,
    [
      need_desc ?? null,
      expected_value ?? null,
      id
    ]
  );

  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(
    `
    DELETE FROM opportunity
    WHERE opportunity_id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0];
}

async function updateStage(id, newStage) {
  const client = await pool.connect();

  const stages = ["TIEP_CAN", "TU_VAN", "BAO_GIA", "CHOT"];

  try {
    await client.query("BEGIN");

    // Khóa bản ghi để tránh hai yêu cầu cập nhật đồng thời
    const currentResult = await client.query(
      `
      SELECT opportunity_id, stage, owner_id
      FROM opportunity
      WHERE opportunity_id = $1
      FOR UPDATE
      `,
      [id]
    );

    const existing = currentResult.rows[0];

    if (!existing) {
      throw new Error("OPPORTUNITY_NOT_FOUND");
    }

    const currentIndex = stages.indexOf(existing.stage);
    const newIndex = stages.indexOf(newStage);

    // Kiểm tra lại khi đã khóa bản ghi
    if (newIndex !== currentIndex + 1) {
      throw new Error("INVALID_STAGE_TRANSITION");
    }

    // Cập nhật giai đoạn mới
    const result = await client.query(
      `
      UPDATE opportunity
      SET stage = $1,
          updated_at = NOW()
      WHERE opportunity_id = $2
      RETURNING *
      `,
      [newStage, id]
    );

    // Tạm dùng nhân viên phụ trách làm người thao tác
    // Chỉ sử dụng khi chạy thử, chưa có đăng nhập thật
    await client.query(
      `
      INSERT INTO opportunity_stage_history (
        opportunity_id,
        from_stage,
        to_stage,
        changed_by
      )
      VALUES ($1, $2, $3, $4)
      `,
      [
        id,
        existing.stage,
        newStage,
        existing.owner_id
      ]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function updateResult(id, result, failureReason) {
  const queryResult = await pool.query(
    `
    UPDATE opportunity
    SET
      result = $1,
      failure_reason = $2,
      updated_at = NOW()
    WHERE opportunity_id = $3
      AND stage = 'CHOT'
      AND result IS NULL
    RETURNING *
    `,
    [
      result,
      failureReason,
      id
    ]
  );

  return queryResult.rows[0];
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  updateStage,
  updateResult,
  remove
};

const pool = require("../db");

async function getAll(user) {
  const result = await pool.query(
    `
    SELECT o.*
    FROM opportunity AS o
    JOIN app_user AS owner
      ON owner.user_id = o.owner_id
    WHERE owner.store_id = $1
      AND (
        $2 = 'MANAGER'
        OR ($2 = 'SALES' AND o.owner_id = $3)
      )
    ORDER BY o.opportunity_id
    `,
    [user.store_id, user.role, user.user_id]
  );

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

async function getByIdForUser(id, user) {
  const result = await pool.query(
    `
    SELECT o.*
    FROM opportunity AS o
    JOIN app_user AS owner
      ON owner.user_id = o.owner_id
    WHERE o.opportunity_id = $1
      AND owner.store_id = $2
      AND (
        $3 = 'MANAGER'
        OR ($3 = 'SALES' AND o.owner_id = $4)
      )
    `,
    [id, user.store_id, user.role, user.user_id]
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

async function remove(id, user) {
  const result = await pool.query(
    `
    DELETE FROM opportunity
    WHERE opportunity_id = $1
      AND owner_id = $2
      AND EXISTS (SELECT 1 FROM app_user u WHERE u.user_id = owner_id AND u.store_id = $3)
    RETURNING *
    `,
    [id, user.user_id, user.store_id]
  );

  return result.rows[0];
}

async function updateStage(id, newStage, user) {
  const client = await pool.connect();

  const stages = ["TIEP_CAN", "TU_VAN", "BAO_GIA", "CHOT"];

  try {
    await client.query("BEGIN");

    // Khóa bản ghi để tránh hai yêu cầu cập nhật đồng thời
    const currentResult = await client.query(
      `
      SELECT opportunity_id, stage, owner_id, result
      FROM opportunity
      WHERE opportunity_id = $1
        AND owner_id = $2
        AND EXISTS (SELECT 1 FROM app_user u WHERE u.user_id = owner_id AND u.store_id = $3)
      FOR UPDATE
      `,
      [id, user.user_id, user.store_id]
    );

    const existing = currentResult.rows[0];

    if (!existing) {
      throw new Error("OPPORTUNITY_NOT_FOUND");
    }

    if (existing.result != null) throw new Error("RESULT_ALREADY_RECORDED");

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

    // Người thao tác lấy từ tài khoản xác thực.
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
        user.user_id
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

async function updateResult(id, result, failureReason, user) {
  const queryResult = await pool.query(
    `
    UPDATE opportunity
    SET
      result = $1,
      failure_reason = $2,
      updated_at = NOW()
    WHERE opportunity_id = $3
      AND owner_id = $4
      AND EXISTS (SELECT 1 FROM app_user u WHERE u.user_id = owner_id AND u.store_id = $5)
      AND stage = 'CHOT'
      AND result IS NULL
    RETURNING *
    `,
    [
      result,
      failureReason,
      id,
      user.user_id,
      user.store_id
    ]
  );

  return queryResult.rows[0];
}

async function updateForOwner(id, data, user) {
  const result = await pool.query(
    `UPDATE opportunity AS o
     SET need_desc = COALESCE($1, o.need_desc),
         expected_value = COALESCE($2, o.expected_value),
         updated_at = NOW()
     WHERE o.opportunity_id = $3
       AND o.owner_id = $4
       AND EXISTS (
         SELECT 1 FROM app_user u
         WHERE u.user_id = o.owner_id
           AND u.store_id = $5
       )
     RETURNING o.*`,
    [
      data.need_desc ?? null,
      data.expected_value ?? null,
      id,
      user.user_id,
      user.store_id
    ]
  );

  return result.rows[0];
}

async function getReferences() {
  const customers = await pool.query("SELECT customer_id, full_name FROM customer ORDER BY full_name, customer_id");
  const products = await pool.query("SELECT product_id, product_code, product_name FROM product WHERE is_active = TRUE ORDER BY product_name, product_id");
  return { customers: customers.rows, products: products.rows };
}

async function getFunnel(storeId) {
  const result = await pool.query(
    `SELECT o.stage, COUNT(*)::int AS count
     FROM opportunity o JOIN app_user u ON u.user_id = o.owner_id
     WHERE u.store_id = $1 GROUP BY o.stage`, [storeId]
  );
  return result.rows;
}

async function getHistory(id, user) {
  const result = await pool.query(
    `SELECT h.history_id, h.from_stage, h.to_stage, h.changed_at,
            h.changed_by, actor.full_name AS changed_by_name
     FROM opportunity_stage_history h
     JOIN opportunity o ON o.opportunity_id = h.opportunity_id
     JOIN app_user owner ON owner.user_id = o.owner_id
     JOIN app_user actor ON actor.user_id = h.changed_by
     WHERE o.opportunity_id = $1 AND owner.store_id = $2
       AND ($3 = 'MANAGER' OR ($3 = 'SALES' AND o.owner_id = $4))
     ORDER BY h.changed_at, h.history_id`,
    [id, user.store_id, user.role, user.user_id]
  );
  return result.rows;
}

module.exports = {
  getFunnel,
  getHistory,
  getReferences,
  getAll,
  getById,
  getByIdForUser,
  create,
  update,
  updateStage,
  updateResult,
  remove,
  updateForOwner
};

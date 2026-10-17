const pool = require("../db");

async function getAll() {
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

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};

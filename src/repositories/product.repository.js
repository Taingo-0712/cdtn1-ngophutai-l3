const pool = require("../db");

async function getAll() {
  const result = await pool.query(`
    SELECT product_id, product_code, product_name, is_active, created_at
    FROM product
    WHERE is_active = TRUE
    ORDER BY product_id
  `);

  return result.rows;
}

async function getById(id) {
  const result = await pool.query(
    `SELECT product_id, product_code, product_name, is_active, created_at
     FROM product
     WHERE product_id = $1 AND is_active = TRUE`,
    [id]
  );

  return result.rows[0];
}

async function create(data) {
  const result = await pool.query(
    `INSERT INTO product (product_code, product_name)
     VALUES ($1, $2)
     RETURNING *`,
    [data.product_code, data.product_name]
  );

  return result.rows[0];
}

async function update(id, data) {
  const result = await pool.query(
    `UPDATE product
     SET product_code = COALESCE($1, product_code),
         product_name = COALESCE($2, product_name)
     WHERE product_id = $3 AND is_active = TRUE
     RETURNING *`,
    [data.product_code ?? null, data.product_name ?? null, id]
  );

  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(
    `UPDATE product
     SET is_active = FALSE
     WHERE product_id = $1 AND is_active = TRUE
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}

module.exports = { getAll, getById, create, update, remove };

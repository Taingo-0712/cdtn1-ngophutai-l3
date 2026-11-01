const pool = require("../db");

// Dùng nội bộ khi kiểm tra tên đăng nhập và mật khẩu.
async function findByUsername(username) {
  const result = await pool.query(
    `SELECT
       user_id,
       store_id,
       full_name,
       username,
       password_hash,
       role,
       is_active
     FROM app_user
     WHERE username = $1`,
    [username]
  );

  return result.rows[0];
}

// Dùng để kiểm tra tài khoản khi xác thực token.
async function findById(id) {
  const result = await pool.query(
    `SELECT
       user_id,
       store_id,
       full_name,
       username,
       role,
       is_active
     FROM app_user
     WHERE user_id = $1
       AND is_active = TRUE`,
    [id]
  );

  return result.rows[0];
}

module.exports = {
  findByUsername,
  findById
};

const bcrypt = require("bcryptjs");
const pool = require("../src/db");

async function main() {
  let client;
  let transactionStarted = false;

  try {
    const password = process.env.DEMO_PASSWORD;

    if (
      !password ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      throw new Error("DEMO_PASSWORD_CAN_TU_8_KY_TU_VA_TOI_DA_72_BYTE");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const accounts = [
      {
        email: "an.sales@mekongmobile.vn",
        username: "sales01",
        role: "SALES"
      },
      {
        email: "binh.manager@mekongmobile.vn",
        username: "manager01",
        role: "MANAGER"
      }
    ];

    client = await pool.connect();

    await client.query("BEGIN");
    transactionStarted = true;

    for (const account of accounts) {
      const result = await client.query(
        `UPDATE app_user AS u
         SET username = $1,
             password_hash = $2
         FROM store AS s
         WHERE u.store_id = s.store_id
           AND s.store_code = $3
           AND u.email = $4
           AND u.role = $5
           AND u.is_active = TRUE
         RETURNING u.user_id`,
        [
          account.username,
          passwordHash,
          "MM001",
          account.email,
          account.role
        ]
      );

      if (result.rowCount !== 1) {
        throw new Error(
          "CAN_DUNG_1_TAI_KHOAN_MAU_CHO_" + account.username
        );
      }
    }

    // Tạo cửa hàng thứ hai.
    await client.query(`
      INSERT INTO store (store_code, store_name)
      VALUES ('MM002', 'Mekong Mobile - Chi nhanh 2')
      ON CONFLICT (store_code) DO NOTHING
    `);

    const extraAccounts = [
      {
        username: "sales02",
        name: "Nhan vien thu nghiem 02",
        role: "SALES",
        store: "MM001"
      },
      {
        username: "sales03",
        name: "Nhan vien thu nghiem 03",
        role: "SALES",
        store: "MM002"
      },
      {
        username: "manager02",
        name: "Quan ly thu nghiem 02",
        role: "MANAGER",
        store: "MM002"
      }
    ];

    for (const account of extraAccounts) {
      const storeResult = await client.query(
        "SELECT store_id FROM store WHERE store_code = $1",
        [account.store]
      );

      if (storeResult.rowCount !== 1) {
        throw new Error("KHONG_TIM_THAY_CUA_HANG_" + account.store);
      }

      const storeId = storeResult.rows[0].store_id;
      const email = `${account.username}@authz.example.test`;

      const existing = await client.query(
        `SELECT user_id, store_id, role, email
         FROM app_user
         WHERE username = $1`,
        [account.username]
      );

      if (existing.rowCount === 1) {
        const user = existing.rows[0];

        if (
          String(user.store_id) !== String(storeId) ||
          user.role !== account.role ||
          user.email !== email
        ) {
          throw new Error("TRUNG_USERNAME_" + account.username);
        }

        await client.query(
          `UPDATE app_user
           SET password_hash = $1, is_active = TRUE
           WHERE user_id = $2`,
          [passwordHash, user.user_id]
        );
      } else {
        await client.query(
          `INSERT INTO app_user (
             store_id, full_name, role, email,
             username, password_hash, is_active
           )
           VALUES ($1, $2, $3, $4, $5, $6, TRUE)`,
          [
            storeId,
            account.name,
            account.role,
            email,
            account.username,
            passwordHash
          ]
        );
      }
    }

    // Lấy khách hàng và sản phẩm hiện có.
    const customerResult = await client.query(
      "SELECT customer_id FROM customer ORDER BY customer_id LIMIT 1"
    );

    const productResult = await client.query(
      `SELECT product_id FROM product
       WHERE is_active = TRUE
       ORDER BY product_id LIMIT 1`
    );

    if (!customerResult.rowCount || !productResult.rowCount) {
      throw new Error("CAN_CO_KHACH_HANG_VA_SAN_PHAM_MAU");
    }

    // Tạo một cơ hội thử cho mỗi nhân viên.
    for (const username of ["sales01", "sales02", "sales03"]) {
      const ownerResult = await client.query(
        `SELECT user_id FROM app_user
         WHERE username = $1
           AND role = 'SALES'
           AND is_active = TRUE`,
        [username]
      );

      if (ownerResult.rowCount !== 1) {
        throw new Error("THIEU_NHAN_VIEN_" + username);
      }

      await client.query(
        `INSERT INTO opportunity (
           customer_id, product_id, owner_id,
           need_desc, expected_value, stage
         )
         SELECT
           $1::bigint,
           $2::bigint,
           $3::bigint,
           $4::varchar(500),
           1000000,
           'TIEP_CAN'
         WHERE NOT EXISTS (
           SELECT 1
           FROM opportunity
           WHERE owner_id = $3::bigint
             AND need_desc = $4::varchar(500)
         )`,
        [
          customerResult.rows[0].customer_id,
          productResult.rows[0].product_id,
          ownerResult.rows[0].user_id,
          "AUTHZ_TEST_" + username
        ]
      );
    }

    // Thêm 5 cơ hội cho mỗi nhân viên để kiểm tra danh sách.
    const demoStages = [
      "TIEP_CAN",
      "TU_VAN",
      "BAO_GIA",
      "CHOT",
      "TIEP_CAN"
    ];

    for (const username of ["sales01", "sales02", "sales03"]) {
      const ownerResult = await client.query(
        `SELECT user_id
         FROM app_user
         WHERE username = $1
           AND role = 'SALES'
           AND is_active = TRUE`,
        [username]
      );

      if (ownerResult.rowCount !== 1) {
        throw new Error("THIEU_NHAN_VIEN_" + username);
      }

      for (let i = 1; i <= 5; i++) {
        await client.query(
          `INSERT INTO opportunity (
             customer_id,
             product_id,
             owner_id,
             need_desc,
             expected_value,
             stage
           )
           SELECT
             $1::bigint,
             $2::bigint,
             $3::bigint,
             $4::varchar(500),
             $5::numeric,
             $6::varchar(20)
           WHERE NOT EXISTS (
             SELECT 1
             FROM opportunity
             WHERE owner_id = $3::bigint
               AND need_desc = $4::varchar(500)
           )`,
          [
            customerResult.rows[0].customer_id,
            productResult.rows[0].product_id,
            ownerResult.rows[0].user_id,
            `AUTHZ_MORE_${username}_${i}`,
            i * 5000000,
            demoStages[i - 1]
          ]
        );
      }
    }

    const testData = await client.query(`
      SELECT
        o.opportunity_id,
        u.username,
        u.user_id,
        s.store_code,
        o.need_desc,
        o.stage,
        o.expected_value
      FROM opportunity o
      JOIN app_user u ON u.user_id = o.owner_id
      JOIN store s ON s.store_id = u.store_id
      WHERE
        o.need_desc IN (
          'AUTHZ_TEST_sales01',
          'AUTHZ_TEST_sales02',
          'AUTHZ_TEST_sales03'
        )
        OR LEFT(o.need_desc, 11) = 'AUTHZ_MORE_'
      ORDER BY u.username, o.opportunity_id
    `);

    await client.query("COMMIT");
    transactionStarted = false;

    console.log(
      "Da thiet lap: sales01, sales02, sales03, manager01, manager02."
    );
    console.log("Mat khau ca 5 tai khoan lay tu DEMO_PASSWORD.");
    console.table(testData.rows);
  } catch (error) {
    if (client && transactionStarted) {
      await client.query("ROLLBACK");
    }

    console.error("Thiet lap that bai:", error.code || error.message);
    process.exitCode = 1;
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

main();

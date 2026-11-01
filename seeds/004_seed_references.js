const pool = require('../src/db');
async function main() {
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    // Dữ liệu mô phỏng, không phải hồ sơ khách hàng thật.
    for (let i = 1; i <= 10; i++) {
      await client.query(
        `INSERT INTO customer (full_name, phone) VALUES ($1, $2)
         ON CONFLICT (phone) DO NOTHING`,
        ['Khach hang demo ' + String(i).padStart(2, '0'), '090000' + String(1000 + i)]
      );
    }
    const products = [
      ['DEMO-IP15', 'iPhone 15 128GB'],
      ['DEMO-IP16', 'iPhone 16 128GB'],
      ['DEMO-S24', 'Samsung Galaxy S24'],
      ['DEMO-A55', 'Samsung Galaxy A55'],
      ['DEMO-X14', 'Xiaomi 14'],
      ['DEMO-RN13', 'Redmi Note 13'],
      ['DEMO-OP12', 'OPPO Reno12'],
      ['DEMO-V30', 'vivo V30']
    ];
    for (const [code, name] of products) {
      await client.query(
        `INSERT INTO product (product_code, product_name)
         VALUES ($1, $2) ON CONFLICT (product_code) DO NOTHING`, [code, name]
      );
    }
    await client.query('COMMIT');
    console.log('Da nap 10 khach hang demo va 8 san pham; chay lai khong nhan doi.');
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error(error.code || error.message); process.exitCode = 1;
  } finally {
    if (client) client.release();
    await pool.end();
  }
}
main();

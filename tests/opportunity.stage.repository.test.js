const test = require("node:test");
const assert = require("node:assert/strict");
const pool = require("../src/db");
const repository = require("../src/repositories/opportunity.repository");

// Test hợp đồng transaction; không mô phỏng cơ chế khóa/rollback của PostgreSQL.
function fakeConnection(t, { stage = "TIEP_CAN", missing = false, failOn } = {}) {
  const failure = new Error("SIMULATED_DATABASE_ERROR");
  const updated = { opportunity_id: 1, stage: "TU_VAN", owner_id: 7 };
  const commands = [];
  const client = {
    query: t.mock.fn(async (sql, params) => {
      const statement = sql.trim().replace(/\s+/g, " ");
      commands.push({ statement, params });
      if (failOn && failOn.test(statement)) throw failure;
      if (statement.startsWith("SELECT")) {
        return { rows: missing ? [] : [{ opportunity_id: 1, stage, owner_id: 7 }] };
      }
      if (statement.startsWith("UPDATE")) return { rows: [updated] };
      return { rows: [] };
    }),
    release: t.mock.fn()
  };
  const connect = t.mock.method(pool, "connect", async () => client);
  // Mọi truy vấn transaction phải dùng cùng client, không dùng pool.query.
  t.mock.method(pool, "query", async () => {
    throw new Error("TRANSACTION_MUST_USE_CLIENT");
  });
  return { client, commands, updated, failure, connect };
}

// US5/FR5, BR6: chỉ commit sau khi cập nhật và ghi lịch sử thành công.
test("Khoa co hoi, cap nhat va ghi lich su tren cung ket noi truoc COMMIT", async (t) => {
  const { client, commands, updated, connect } = fakeConnection(t);
  assert.deepEqual(await repository.updateStage(1, "TU_VAN"), updated);
  assert.equal(connect.mock.callCount(), 1);
  assert.equal(commands.length, 5);
  assert.equal(commands[0].statement, "BEGIN");
  assert.match(commands[1].statement, /SELECT .* FROM opportunity .* FOR UPDATE$/);
  assert.deepEqual(commands[1].params, [1]);
  assert.match(commands[2].statement, /^UPDATE opportunity SET stage = \$1, updated_at = NOW\(\)/);
  assert.deepEqual(commands[2].params, ["TU_VAN", 1]);
  assert.match(commands[3].statement, /^INSERT INTO opportunity_stage_history/);
  assert.deepEqual(commands[3].params, [1, "TIEP_CAN", "TU_VAN", 7]);
  assert.equal(commands[4].statement, "COMMIT");
  assert.equal(client.release.mock.callCount(), 1);
});

for (const [description, failOn] of [
  ["ghi lich su", /^INSERT/],
  ["cap nhat giai doan", /^UPDATE/]
]) {
  test(`ROLLBACK va tra ket noi khi loi ${description}`, async (t) => {
    const { client, commands, failure } = fakeConnection(t, { failOn });
    await assert.rejects(() => repository.updateStage(1, "TU_VAN"), failure);
    assert.equal(commands.at(-1).statement, "ROLLBACK");
    assert.equal(commands.some(({ statement }) => statement === "COMMIT"), false);
    if (description === "cap nhat giai doan") {
      assert.equal(commands.some(({ statement }) => statement.startsWith("INSERT")), false);
    }
    assert.equal(client.release.mock.callCount(), 1);
  });
}

test("Co hoi khong ton tai sau khi khoa: ROLLBACK va khong ghi du lieu", async (t) => {
  const { client, commands } = fakeConnection(t, { missing: true });
  await assert.rejects(() => repository.updateStage(1, "TU_VAN"), {
    message: "OPPORTUNITY_NOT_FOUND"
  });
  assert.equal(commands.length, 3);
  assert.equal(commands.at(-1).statement, "ROLLBACK");
  assert.equal(client.release.mock.callCount(), 1);
});

test("Kiem tra lai stage da khoa: tu choi yeu cau lap ma khong tao lich su", async (t) => {
  const { client, commands } = fakeConnection(t, { stage: "TU_VAN" });
  await assert.rejects(() => repository.updateStage(1, "TU_VAN"), {
    message: "INVALID_STAGE_TRANSITION"
  });
  assert.equal(commands.length, 3);
  assert.match(commands[1].statement, /FOR UPDATE$/);
  assert.equal(commands.at(-1).statement, "ROLLBACK");
  assert.equal(client.release.mock.callCount(), 1);
});

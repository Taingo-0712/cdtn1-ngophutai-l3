const opportunityRepository = require("../repositories/opportunity.repository");

function formatOpportunityPhone(opportunity, role) {
  const phone = opportunity.customer_phone;
  if (!phone || role === "MANAGER") return opportunity;

  const masked = phone.length >= 8
    ? phone.slice(0, 3) + "*".repeat(phone.length - 6) + phone.slice(-3)
    : "*".repeat(phone.length);

  return { ...opportunity, customer_phone: masked };
}

async function getAllOpportunities(user, stage) {
  if (
    !user ||
    !user.user_id ||
    !user.store_id ||
    !["SALES", "MANAGER"].includes(user.role)
  ) {
    throw new Error("FORBIDDEN");
  }

  if (
    stage !== undefined &&
    !["TIEP_CAN", "TU_VAN", "BAO_GIA", "CHOT"].includes(stage)
  ) {
    throw new Error("INVALID_STAGE");
  }

  const opportunities = await opportunityRepository.getAll(user, stage);
  return opportunities.map(item => formatOpportunityPhone(item, user.role));
}

async function getOpportunityById(id, user) {
  if (
    !user ||
    !user.user_id ||
    !user.store_id ||
    !["SALES", "MANAGER"].includes(user.role)
  ) {
    throw new Error("FORBIDDEN");
  }

  const opportunity =
    await opportunityRepository.getByIdForUser(id, user);

  if (!opportunity) {
    throw new Error("OPPORTUNITY_NOT_FOUND");
  }

  return formatOpportunityPhone(opportunity, user.role);
}

async function createOpportunity(data, user) {
  if (!user || user.role !== "SALES") {
    throw new Error("FORBIDDEN");
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("INVALID_OPPORTUNITY_DATA");
  }

  const {
    customer_id,
    product_id,
    need_desc,
    expected_value
  } = data;

  if (!customer_id || !product_id) {
    throw new Error("MISSING_REQUIRED_FIELDS");
  }

  if (
    typeof need_desc !== "string" ||
    need_desc.trim().length === 0 ||
    need_desc.trim().length > 500
  ) {
    throw new Error("INVALID_NEED_DESC");
  }

  if (
    !["number", "string"].includes(typeof expected_value) ||
    String(expected_value).trim() === "" ||
    !Number.isFinite(Number(expected_value)) ||
    Number(expected_value) < 0
  ) {
    throw new Error("INVALID_EXPECTED_VALUE");
  }

  return await opportunityRepository.create({
    customer_id,
    product_id,
    owner_id: user.user_id,
    need_desc: need_desc.trim(),
    expected_value
  });
}

async function updateOpportunity(id, data, user) {
  if (!user || user.role !== "SALES" || !user.user_id || !user.store_id) {
    throw new Error("FORBIDDEN");
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("INVALID_OPPORTUNITY_DATA");
  }

  const fields = Object.keys(data);
  const editableFields = ["product_id", "need_desc", "expected_value"];
  if (!fields.length || fields.some(field => !editableFields.includes(field))) {
    throw new Error("INVALID_OPPORTUNITY_DATA");
  }

  const { product_id, need_desc, expected_value } = data;
  if (Object.hasOwn(data, "product_id")) {
    const validType = typeof product_id === "string" || Number.isSafeInteger(product_id);
    if (
      !validType ||
      !/^[1-9]\d{0,18}$/.test(String(product_id)) ||
      BigInt(product_id) > 9223372036854775807n
    ) {
      throw new Error("INVALID_PRODUCT_ID");
    }
  }

  if (
    Object.hasOwn(data, "need_desc") &&
    (
      typeof need_desc !== "string" ||
      !need_desc.trim() ||
      [...need_desc.trim()].length > 500 ||
      need_desc.includes("\u0000")
    )
  ) {
    throw new Error("INVALID_NEED_DESC");
  }

  let normalizedValue;
  if (Object.hasOwn(data, "expected_value")) {
    normalizedValue = typeof expected_value === "string" && /^\d+$/.test(expected_value.trim())
      ? Number(expected_value)
      : expected_value;

    if (!Number.isSafeInteger(normalizedValue) || normalizedValue < 0 || normalizedValue > 999999999999999) {
      throw new Error("INVALID_EXPECTED_VALUE");
    }
  }

  return opportunityRepository.updateForOwner(
    id,
    {
      product_id,
      need_desc: need_desc?.trim(),
      expected_value: normalizedValue
    },
    user
  );
}

async function deleteOpportunity(id, user) {
  if (!user || user.role !== "SALES" || !user.user_id || !user.store_id) throw new Error("FORBIDDEN");
  const existing = await opportunityRepository.getByIdForUser(id, user);

  if (!existing) {
    throw new Error("OPPORTUNITY_NOT_FOUND");
  }

  const removed = await opportunityRepository.remove(id, user);
  if (!removed) throw new Error("OPPORTUNITY_NOT_FOUND");
  return removed;
}

async function updateOpportunityStage(id, newStage, user) {
  if (!user || user.role !== "SALES" || !user.user_id || !user.store_id) throw new Error("FORBIDDEN");
  const stages = ["TIEP_CAN", "TU_VAN", "BAO_GIA", "CHOT"];

  // Kiểm tra giai đoạn mới có hợp lệ không
  if (!stages.includes(newStage)) {
    throw new Error("INVALID_STAGE");
  }

  // Lấy thông tin cơ hội hiện tại
  const existing = await opportunityRepository.getByIdForUser(id, user);

  if (!existing) {
    throw new Error("OPPORTUNITY_NOT_FOUND");
  }

  const currentIndex = stages.indexOf(existing.stage);
  const newIndex = stages.indexOf(newStage);

  // Chỉ cho phép chuyển sang giai đoạn tiếp theo
  if (newIndex !== currentIndex + 1) {
    throw new Error("INVALID_STAGE_TRANSITION");
  }

  // Gọi Repository cập nhật PostgreSQL
  return await opportunityRepository.updateStage(id, newStage, user);
}

async function updateOpportunityResult(id, result, failureReason, user) {
  if (!user || user.role !== "SALES" || !user.user_id || !user.store_id) throw new Error("FORBIDDEN");
  // 1. Kiểm tra kết quả có hợp lệ không
  const validResults = ["THANH_CONG", "THAT_BAI"];

  if (!validResults.includes(result)) {
    throw new Error("INVALID_RESULT");
  }

  // 2. Kiểm tra cơ hội có tồn tại không
  const existing = await opportunityRepository.getByIdForUser(id, user);

  if (!existing) {
    throw new Error("OPPORTUNITY_NOT_FOUND");
  }

  // 3. Chỉ cho ghi kết quả khi ở giai đoạn CHOT
  if (existing.stage !== "CHOT") {
    throw new Error("OPPORTUNITY_NOT_AT_CHOT");
  }

  // 4. Không được ghi đè kết quả đã chốt
  if (existing.result !== null && existing.result !== undefined) {
    throw new Error("RESULT_ALREADY_RECORDED");
  }

  // 5. Nếu thất bại phải có lý do
  if (
    result === "THAT_BAI" &&
    (typeof failureReason !== "string" ||
      failureReason.trim().length === 0 || failureReason.trim().length > 500)
  ) {
    throw new Error("FAILURE_REASON_REQUIRED");
  }

  // 6. Nếu thành công thì không lưu lý do thất bại
  const normalizedReason =
    result === "THAT_BAI" ? failureReason.trim() : null;

  // 7. Gọi Repository lưu kết quả
  const updated = await opportunityRepository.updateResult(
    id,
    result,
    normalizedReason,
    user
  );

  // 8. Xử lý trường hợp dữ liệu thay đổi đồng thời
  if (!updated) {
    throw new Error("RESULT_UPDATE_CONFLICT");
  }

  return updated;
}

async function getOpportunityReferences(user) {
  if (!user || !["SALES", "MANAGER"].includes(user.role)) throw new Error("FORBIDDEN");
  return opportunityRepository.getReferences();
}

async function getFunnel(user) {
  if (!user || user.role !== 'MANAGER' || !user.store_id) throw new Error('FORBIDDEN');
  const rows = await opportunityRepository.getFunnel(user.store_id);
  return ['TIEP_CAN', 'TU_VAN', 'BAO_GIA', 'CHOT'].map(stage => ({
    stage, count: Number(rows.find(row => row.stage === stage)?.count || 0)
  }));
}

async function getHistory(id, user) {
  await getOpportunityById(id, user);
  return opportunityRepository.getHistory(id, user);
}

module.exports = {
  getFunnel,
  getHistory,
  getOpportunityReferences,
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  updateOpportunityStage,
  updateOpportunityResult,
  deleteOpportunity
};

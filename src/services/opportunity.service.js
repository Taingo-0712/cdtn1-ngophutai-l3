const opportunityRepository = require("../repositories/opportunity.repository");

async function getAllOpportunities() {
  return await opportunityRepository.getAll();
}

async function getOpportunityById(id) {
  const opportunity = await opportunityRepository.getById(id);

  if (!opportunity) {
    throw new Error("OPPORTUNITY_NOT_FOUND");
  }

  return opportunity;
}

async function createOpportunity(data) {
  const {
    customer_id,
    product_id,
    owner_id,
    need_desc,
    expected_value
  } = data;

  if (!customer_id || !product_id || !owner_id) {
    throw new Error("MISSING_REQUIRED_FIELDS");
  }

  if (!need_desc || need_desc.trim().length === 0) {
    throw new Error("INVALID_NEED_DESC");
  }

  if (
    expected_value === undefined ||
    expected_value === null ||
    Number(expected_value) < 0
  ) {
    throw new Error("INVALID_EXPECTED_VALUE");
  }

  return await opportunityRepository.create({
    customer_id,
    product_id,
    owner_id,
    need_desc: need_desc.trim(),
    expected_value
  });
}

async function updateOpportunity(id, data) {
  const existing = await opportunityRepository.getById(id);

  if (!existing) {
    throw new Error("OPPORTUNITY_NOT_FOUND");
  }

  if (
    data.need_desc !== undefined &&
    data.need_desc.trim().length === 0
  ) {
    throw new Error("INVALID_NEED_DESC");
  }

  if (
    data.expected_value !== undefined &&
    Number(data.expected_value) < 0
  ) {
    throw new Error("INVALID_EXPECTED_VALUE");
  }

  return await opportunityRepository.update(id, {
    need_desc:
      data.need_desc !== undefined
        ? data.need_desc.trim()
        : undefined,

    expected_value: data.expected_value
  });
}

async function deleteOpportunity(id) {
  const existing = await opportunityRepository.getById(id);

  if (!existing) {
    throw new Error("OPPORTUNITY_NOT_FOUND");
  }

  return await opportunityRepository.remove(id);
}

async function updateOpportunityStage(id, newStage) {
  const stages = ["TIEP_CAN", "TU_VAN", "BAO_GIA", "CHOT"];

  // Kiểm tra giai đoạn mới có hợp lệ không
  if (!stages.includes(newStage)) {
    throw new Error("INVALID_STAGE");
  }

  // Lấy thông tin cơ hội hiện tại
  const existing = await opportunityRepository.getById(id);

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
  return await opportunityRepository.updateStage(id, newStage);
}

async function updateOpportunityResult(id, result, failureReason) {
  // 1. Kiểm tra kết quả có hợp lệ không
  const validResults = ["THANH_CONG", "THAT_BAI"];

  if (!validResults.includes(result)) {
    throw new Error("INVALID_RESULT");
  }

  // 2. Kiểm tra cơ hội có tồn tại không
  const existing = await opportunityRepository.getById(id);

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
      failureReason.trim().length === 0)
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
    normalizedReason
  );

  // 8. Xử lý trường hợp dữ liệu thay đổi đồng thời
  if (!updated) {
    throw new Error("RESULT_UPDATE_CONFLICT");
  }

  return updated;
}

module.exports = {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  updateOpportunityStage,
  updateOpportunityResult,
  deleteOpportunity
};

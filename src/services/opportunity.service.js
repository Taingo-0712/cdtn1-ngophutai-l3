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

module.exports = {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
};
const express = require("express");
const router = express.Router();

const opportunityService = require("../services/opportunity.service");

// GET /api/opportunities
router.get("/", async (req, res) => {
  try {
    const data = await opportunityService.getAllOpportunities();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
});

// GET /api/opportunities/:id
router.get("/:id", async (req, res) => {
  try {
    const data = await opportunityService.getOpportunityById(req.params.id);
    res.json(data);
  } catch (error) {
    if (error.message === "OPPORTUNITY_NOT_FOUND") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
});

// POST /api/opportunities
router.post("/", async (req, res) => {
  try {
    const data = await opportunityService.createOpportunity(req.body);
    res.status(201).json(data);
  } catch (error) {
    if (
      error.message === "MISSING_REQUIRED_FIELDS" ||
      error.message === "INVALID_NEED_DESC" ||
      error.message === "INVALID_EXPECTED_VALUE"
    ) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
});

// PATCH /api/opportunities/:id
router.patch("/:id", async (req, res) => {
  try {
    const data = await opportunityService.updateOpportunity(
      req.params.id,
      req.body
    );

    res.json(data);
  } catch (error) {
    if (error.message === "OPPORTUNITY_NOT_FOUND") {
      return res.status(404).json({ message: error.message });
    }

    if (
      error.message === "INVALID_NEED_DESC" ||
      error.message === "INVALID_EXPECTED_VALUE"
    ) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
});

// DELETE /api/opportunities/:id
router.delete("/:id", async (req, res) => {
  try {
    const data = await opportunityService.deleteOpportunity(req.params.id);
    res.json(data);
  } catch (error) {
    if (error.message === "OPPORTUNITY_NOT_FOUND") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
});

module.exports = router;
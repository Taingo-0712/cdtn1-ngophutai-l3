const express = require("express");
const router = express.Router();

const opportunityService = require("../services/opportunity.service");
const { authenticate } = require("../middlewares/auth.middleware");

// Tất cả API trong Router này đều phải xác thực.
router.use(authenticate);

// GET /api/opportunities
router.get("/", async (req, res) => {
  try {
    const data = await opportunityService.getAllOpportunities(
      req.user,
      req.query.stage
    );

    return res.json(data);
  } catch (error) {
    if (error.message === "INVALID_STAGE") {
      return res.status(400).json({ message: "INVALID_STAGE" });
    }
    if (error.message === "FORBIDDEN") return res.status(403).json({ message: "FORBIDDEN" });
    if (["22P02", "22003"].includes(error.code)) return res.status(400).json({ message: "INVALID_DATA" });
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({
        message: "FORBIDDEN"
      });
    }

    return res.status(500).json({
      message: "INTERNAL_SERVER_ERROR"
    });
  }
});

// Đặt trước /:id để không hiểu references là ID.
router.get("/references", async (req, res) => {
  try {
    return res.json(await opportunityService.getOpportunityReferences(req.user));
  } catch (error) {
    return res.status(error.message === "FORBIDDEN" ? 403 : 500).json({
      message: error.message === "FORBIDDEN" ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR"
    });
  }
});

router.get('/funnel', async (req, res) => {
  try { return res.json(await opportunityService.getFunnel(req.user)); }
  catch (error) {
    return res.status(error.message === 'FORBIDDEN' ? 403 : 500).json({message: error.message === 'FORBIDDEN' ? 'FORBIDDEN' : 'INTERNAL_SERVER_ERROR'});
  }
});

router.get('/:id/history', async (req, res) => {
  try { return res.json(await opportunityService.getHistory(req.params.id, req.user)); }
  catch (error) {
    const status = error.message === 'FORBIDDEN' ? 403 : error.message === 'OPPORTUNITY_NOT_FOUND' ? 404 : error.code === '22P02' ? 400 : 500;
    return res.status(status).json({message: status === 500 ? 'INTERNAL_SERVER_ERROR' : status === 400 ? 'INVALID_DATA' : error.message});
  }
});

// GET /api/opportunities/:id
router.get("/:id", async (req, res) => {
  try {
    const data = await opportunityService.getOpportunityById(
      req.params.id,
      req.user
    );

    return res.json(data);
  } catch (error) {
    if (error.message === "FORBIDDEN") return res.status(403).json({ message: "FORBIDDEN" });
    if (["22P02", "22003"].includes(error.code)) return res.status(400).json({ message: "INVALID_DATA" });
    if (error.message === "OPPORTUNITY_NOT_FOUND") {
      return res.status(404).json({
        message: "OPPORTUNITY_NOT_FOUND"
      });
    }

    if (error.message === "FORBIDDEN") {
      return res.status(403).json({
        message: "FORBIDDEN"
      });
    }

    return res.status(500).json({
      message: "INTERNAL_SERVER_ERROR"
    });
  }
});

// POST /api/opportunities
router.post("/", async (req, res) => {
  try {
    const data = await opportunityService.createOpportunity(
      req.body,
      req.user
    );

    return res.status(201).json(data);
  } catch (error) {
    if (error.message === "FORBIDDEN") return res.status(403).json({ message: "FORBIDDEN" });
    if (["22P02", "22003"].includes(error.code)) return res.status(400).json({ message: "INVALID_DATA" });
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({
        message: "FORBIDDEN"
      });
    }

    if (
      [
        "INVALID_OPPORTUNITY_DATA",
        "MISSING_REQUIRED_FIELDS",
        "INVALID_NEED_DESC",
        "INVALID_EXPECTED_VALUE",
        "INVALID_REFERENCE"
      ].includes(error.message)
    ) {
      return res.status(400).json({
        message: error.message
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        message: "INVALID_REFERENCE"
      });
    }

    return res.status(500).json({
      message: "INTERNAL_SERVER_ERROR"
    });
  }
});

// PATCH /api/opportunities/:id/stage
router.patch("/:id/stage", async (req, res) => {
  try {
    const data = await opportunityService.updateOpportunityStage(
      req.params.id,
      req.body?.stage,
      req.user
    );

    res.json(data);
  } catch (error) {
    if (error.message === "FORBIDDEN") return res.status(403).json({ message: "FORBIDDEN" });
    if (["22P02", "22003"].includes(error.code)) return res.status(400).json({ message: "INVALID_DATA" });
    if (error.message === "OPPORTUNITY_NOT_FOUND") {
      return res.status(404).json({
        message: error.message
      });
    }

    if (error.message === "RESULT_ALREADY_RECORDED") return res.status(409).json({ message: error.message });

    if (error.message === "INVALID_STAGE_TRANSITION") {
      return res.status(409).json({
        message: error.message
      });
    }

    if (error.message === "INVALID_STAGE") {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error("Update stage error:", error);

    return res.status(500).json({
      message: "INTERNAL_SERVER_ERROR"
    });
  }
});

// PATCH /api/opportunities/:id/result
router.patch("/:id/result", async (req, res) => {
  try {
    const data = await opportunityService.updateOpportunityResult(
      req.params.id,
      req.body?.result,
      req.body?.failure_reason,
      req.user
    );

    return res.status(200).json(data);
  } catch (error) {
    if (error.message === "FORBIDDEN") return res.status(403).json({ message: "FORBIDDEN" });
    if (["22P02", "22003"].includes(error.code)) return res.status(400).json({ message: "INVALID_DATA" });
    if (error.message === "OPPORTUNITY_NOT_FOUND") {
      return res.status(404).json({
        message: error.message
      });
    }

    if (
      error.message === "INVALID_RESULT" ||
      error.message === "FAILURE_REASON_REQUIRED"
    ) {
      return res.status(400).json({
        message: error.message
      });
    }

    if (
      error.message === "OPPORTUNITY_NOT_AT_CHOT" ||
      error.message === "RESULT_ALREADY_RECORDED" ||
      error.message === "RESULT_UPDATE_CONFLICT"
    ) {
      return res.status(409).json({
        message: error.message
      });
    }

    console.error("Update opportunity result error:", error);

    return res.status(500).json({
      message: "INTERNAL_SERVER_ERROR"
    });
  }
});

// PATCH /api/opportunities/:id
router.patch("/:id", async (req, res) => {
  try {
    const data = await opportunityService.updateOpportunity(
      req.params.id,
      req.body,
      req.user
    );

    return res.json(data);
  } catch (error) {
    if (error.message === "FORBIDDEN") return res.status(403).json({ message: "FORBIDDEN" });
    if (["22P02", "22003"].includes(error.code)) return res.status(400).json({ message: "INVALID_DATA" });
    if (error.message === "FORBIDDEN") {
      return res.status(403).json({ message: "FORBIDDEN" });
    }

    if (error.message === "OPPORTUNITY_NOT_FOUND") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "OPPORTUNITY_FINALIZED") {
      return res.status(409).json({ message: error.message });
    }

    if (
      ["INVALID_OPPORTUNITY_DATA", "INVALID_PRODUCT_ID", "INVALID_NEED_DESC", "INVALID_EXPECTED_VALUE"]
        .includes(error.message)
    ) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
});

// DELETE /api/opportunities/:id
router.delete("/:id", async (req, res) => {
  try {
    const data = await opportunityService.deleteOpportunity(req.params.id, req.user);
    res.json(data);
  } catch (error) {
    if (error.code === "23503") return res.status(409).json({ message: "OPPORTUNITY_HAS_HISTORY" });
    if (error.message === "FORBIDDEN") return res.status(403).json({ message: "FORBIDDEN" });
    if (["22P02", "22003"].includes(error.code)) return res.status(400).json({ message: "INVALID_DATA" });
    if (error.message === "OPPORTUNITY_NOT_FOUND") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
});

module.exports = router;

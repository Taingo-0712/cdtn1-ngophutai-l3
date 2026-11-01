const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service");
const { authenticate } = require("../middlewares/auth.middleware");

router.post("/login", async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    const result = await authService.login(req.body);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "INVALID_LOGIN_DATA") {
      return res.status(400).json({
        message: "INVALID_LOGIN_DATA"
      });
    }

    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        message: "INVALID_CREDENTIALS"
      });
    }

    return res.status(500).json({
      message: "INTERNAL_SERVER_ERROR"
    });
  }
});

router.get("/me", authenticate, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ user: req.user });
});

module.exports = router;

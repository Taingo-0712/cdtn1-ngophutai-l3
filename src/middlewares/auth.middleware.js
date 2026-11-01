const authService = require("../services/auth.service");

async function authenticate(req, res, next) {
  const header = req.get("Authorization");
  const match =
    typeof header === "string"
      ? /^Bearer\s+(\S+)$/i.exec(header.trim())
      : null;

  if (!match) {
    return res.status(401).json({
      message: "UNAUTHENTICATED"
    });
  }

  try {
    req.user = await authService.authenticateToken(match[1]);
    return next();
  } catch (error) {
    if (error.message === "UNAUTHENTICATED") {
      return res.status(401).json({
        message: "UNAUTHENTICATED"
      });
    }

    return res.status(500).json({
      message: "INTERNAL_SERVER_ERROR"
    });
  }
}

module.exports = { authenticate };

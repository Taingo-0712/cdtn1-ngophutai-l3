const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/auth.repository");

async function login(data) {
  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    typeof data.username !== "string" ||
    typeof data.password !== "string"
  ) {
    throw new Error("INVALID_LOGIN_DATA");
  }

  const username = data.username.trim().toLowerCase();
  const password = data.password;

  if (
    username.length === 0 ||
    username.length > 80 ||
    password.length === 0 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    throw new Error("INVALID_LOGIN_DATA");
  }

  const user = await authRepository.findByUsername(username);

  if (
    !user ||
    !user.is_active ||
    typeof user.password_hash !== "string" ||
    !user.password_hash ||
    !["SALES", "MANAGER"].includes(user.role)
  ) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("AUTH_NOT_CONFIGURED");
  }

  const accessToken = jwt.sign({}, secret, {
    algorithm: "HS256",
    subject: String(user.user_id),
    expiresIn: "1h"
  });

  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,
    user: {
      user_id: user.user_id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      store_id: user.store_id
    }
  };
}

async function authenticateToken(token) {
  const secret = process.env.JWT_SECRET;

  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("AUTH_NOT_CONFIGURED");
  }

  let payload;

  try {
    payload = jwt.verify(token, secret, {
      algorithms: ["HS256"]
    });
  } catch {
    throw new Error("UNAUTHENTICATED");
  }

  if (
    !payload ||
    typeof payload.sub !== "string" ||
    !/^[1-9]\d{0,18}$/.test(payload.sub) ||
    BigInt(payload.sub) > 9223372036854775807n
  ) {
    throw new Error("UNAUTHENTICATED");
  }

  const user = await authRepository.findById(payload.sub);

  if (
    !user ||
    !user.is_active ||
    !["SALES", "MANAGER"].includes(user.role)
  ) {
    throw new Error("UNAUTHENTICATED");
  }

  return {
    user_id: user.user_id,
    username: user.username,
    full_name: user.full_name,
    role: user.role,
    store_id: user.store_id
  };
}

module.exports = { login, authenticateToken };

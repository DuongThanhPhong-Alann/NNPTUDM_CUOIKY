const jwt = require("jsonwebtoken");
const nguoiDungController = require("../controllers/nguoidungs");

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getTokenFromRequest(req) {
  const authorization = req.headers.authorization || "";
  if (!authorization.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
}

async function requireAuth(req, _res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) throw createHttpError(401, "Unauthorized");

    const secret = process.env.JWT_SECRET;
    if (!secret) throw createHttpError(500, "Missing env JWT_SECRET");

    const payload = jwt.verify(token, secret);
    const user = await nguoiDungController.GetById(payload.id);
    if (!user) throw createHttpError(401, "Unauthorized");

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error.name === "JsonWebTokenError" ? createHttpError(401, "Invalid token") : error);
  }
}

function requireRoles(...roles) {
  return function roleMiddleware(req, _res, next) {
    if (!req.user) return next(createHttpError(401, "Unauthorized"));
    if (!roles.includes(req.user.loaiNguoiDung)) {
      return next(createHttpError(403, "Forbidden"));
    }
    return next();
  };
}

module.exports = { requireAuth, requireRoles, createHttpError };

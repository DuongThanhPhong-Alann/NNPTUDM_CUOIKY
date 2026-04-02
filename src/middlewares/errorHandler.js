function notFoundHandler(_req, res) {
  res.status(404).json({ ok: false, error: { message: "Not found" } });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    ok: false,
    error: {
      message: err.message || "Internal server error",
      code: err.code,
    },
  });
}

module.exports = { errorHandler, notFoundHandler };


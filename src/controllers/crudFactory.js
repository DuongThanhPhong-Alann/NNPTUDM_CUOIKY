const mongoose = require("mongoose");

function createHttpError(statusCode, message, code) {
  const err = new Error(message);
  err.statusCode = statusCode;
  if (code) err.code = code;
  return err;
}

function parsePositiveInt(value, fallback) {
  const n = Number.parseInt(String(value), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function parseSort(sort) {
  if (!sort) return { createdAt: -1 };
  // sort=-createdAt,ten
  return String(sort)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .reduce((acc, field) => {
      if (field.startsWith("-")) acc[field.slice(1)] = -1;
      else acc[field] = 1;
      return acc;
    }, {});
}

function applyPopulate(query, populate) {
  if (!populate || populate.length === 0) return query;
  for (const p of populate) query.populate(p);
  return query;
}

function makeCrudController(model, options = {}) {
  const { populate = [] } = options;

  return {
    list: async (req, res) => {
      const page = parsePositiveInt(req.query.page, 1);
      const limit = Math.min(parsePositiveInt(req.query.limit, 20), 100);
      const skip = (page - 1) * limit;
      const sort = parseSort(req.query.sort);

      const query = applyPopulate(model.find({}), populate).sort(sort).skip(skip).limit(limit);
      const [items, total] = await Promise.all([query.exec(), model.countDocuments({})]);

      res.json({
        ok: true,
        data: items,
        meta: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
      });
    },

    getById: async (req, res) => {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) throw createHttpError(400, "Invalid id");

      const item = await applyPopulate(model.findById(id), populate).exec();
      if (!item) throw createHttpError(404, "Not found");
      res.json({ ok: true, data: item });
    },

    create: async (req, res) => {
      const created = await model.create(req.body);
      const item = await applyPopulate(model.findById(created._id), populate).exec();
      res.status(201).json({ ok: true, data: item });
    },

    updateById: async (req, res) => {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) throw createHttpError(400, "Invalid id");

      const updated = await model
        .findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
        .exec();
      if (!updated) throw createHttpError(404, "Not found");

      const item = await applyPopulate(model.findById(updated._id), populate).exec();
      res.json({ ok: true, data: item });
    },

    deleteById: async (req, res) => {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) throw createHttpError(400, "Invalid id");

      const deleted = await model.findByIdAndDelete(id).exec();
      if (!deleted) throw createHttpError(404, "Not found");
      res.json({ ok: true, data: { id } });
    },
  };
}

module.exports = { makeCrudController, createHttpError };


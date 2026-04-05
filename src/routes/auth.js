const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nguoiDungController = require("../controllers/nguoidungs");
const { requireAuth, requireRoles, createHttpError } = require("../middlewares/auth");

const router = express.Router();

function buildToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw createHttpError(500, "Missing env JWT_SECRET");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      loaiNguoiDung: user.loaiNguoiDung,
    },
    secret,
    { expiresIn: "1d" },
  );
}

router.post("/register", async function (req, res, next) {
  try {
    const { hoTen, email, matKhau, soDienThoai } = req.body;
    const existingUser = await nguoiDungController.FindByEmail(email);
    if (existingUser) {
      throw createHttpError(400, "Email da ton tai");
    }

    const user = await nguoiDungController.Create({
      hoTen,
      email,
      matKhau,
      soDienThoai,
      loaiNguoiDung: "Cu dan",
    });

    res.status(201).send({
      token: buildToken(user),
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const { email, matKhau } = req.body;
    const user = await nguoiDungController.FindByEmailWithPassword(email);
    if (!user) throw createHttpError(401, "Thong tin dang nhap khong dung");

    const isValidPassword = await bcrypt.compare(matKhau, user.matKhau);
    if (!isValidPassword) throw createHttpError(401, "Thong tin dang nhap khong dung");

    const safeUser = user.toObject();
    delete safeUser.matKhau;

    res.send({
      token: buildToken(user),
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, function (req, res) {
  res.send(req.user);
});

router.get("/users", requireAuth, requireRoles("Ban quan ly"), async function (_req, res, next) {
  try {
    const users = await nguoiDungController.GetAll();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const candidate = await User.findOne({ phone });
  if (candidate) {
    return res.status(400).json({ message: "Пользователь уже существует" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    phone,
    password: hash,
    favorites: [],
    cart: [],
  });

  return res
    .status(201)
    .json(new ApiResponse(200, { user }, "Аккаунт успешно создан"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(400).json({ message: "Неверные данные" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Неверный пароль" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1y",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { user, token }, "Добро пожаловать!"));
});

export { registerUser, loginUser };

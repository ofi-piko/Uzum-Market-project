import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Неавторизованный запрос");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Произошла ошибка во время верификации JWT токена.");
  }
});

export default verifyJWT;

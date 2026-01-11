import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";

const addToFavorites = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.userId, {
    $addToSet: { favorites: req.params.productId },
  });

  res.status(200).json({ message: "Добавлено в избранное" });
});

const removeFromFavorites = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.userId, {
    $pull: { favorites: req.params.productId },
  });

  res.status(200).json({ message: "Удалено из избранного" });
});

const addToCart = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.userId, {
    $addToSet: { cart: req.params.productId },
  });
  res.status(200).json({ message: "Добавлено в корзину" });
});

const removeFromCart = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.userId, {
    $pull: { cart: req.params.productId },
  });

  res.status(200).json({ message: "Удалено из корзины" });
});

const userInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId)
    .populate("favorites")
    .populate("cart");

  res.status(200).json(user);
});

export {
  addToFavorites,
  addToCart,
  removeFromCart,
  removeFromFavorites,
  userInfo,
};

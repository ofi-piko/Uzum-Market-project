import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/async-handler.js";

const getAllProducts = asyncHandler(async (_, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

export { getAllProducts };

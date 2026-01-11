import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    title: String,
    description: String,
    colors: [String],
    rating: Number,
    price: Number,
    isBlackFriday: Boolean,
    salePercentage: Number,
    media: [String],
    type: String,
  },
  {
    collection: "goods",
  }
);

const Product = mongoose.model("Product", productSchema);

export { Product };

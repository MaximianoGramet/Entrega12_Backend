import { Schema,model } from "mongoose"

const cartSchema = new Schema({
  products: [{
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true, default: 1 },
  }],
});

const CartModel = model("carts", cartSchema)

export {CartModel}
import { CartModel } from "../../../models/cart.model.js";
import {postModel} from "../../../models/product.model.js";

export class CartDao {
  async findCart() {
    return await CartModel.find();
  }

  async findById(_id) {
    return await CartModel.findById(_id);
  }

  async createCart(cart) {
    return await CartModel.create(cart);
  }

  async updateCart(_id, cart) {
    return await CartModel.findByIdAndUpdate({ _id }, cart);
  }

  async deleteCart(_id) {
    await CartModel.deleteMany({ author: _id });

    return await CartModel.findByIdAndDelete({ _id });
  }

  //* Preentrega 2

  async getCartProduct(id) {
    try {
      const cart = await CartModel.findById(id).populate('products.product').lean();

      if (!cart) {
        return null;
      }

      return cart;
    } catch (error) {
      console.error(`Error at getting the cart: ${error.message}`);
      throw error;
    }
  }

  async addProductCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      const product = await postModel.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
  
      const productExist = cart.products.find((p) => p._id.equals(productId));
  
      if (productExist) {
        productExist.quantity += 1;
      } else {
        cart.products.push({
          _id: productId,
          quantity: 1,
        });
      }

      await cart.save();
  
      return 'Product added to the cart';
    } catch (error) {
      throw error;
    }
  }

  async setProductQuantity(cartId, productId, newQuantity) {
    try {
      const cart = await CartModel.findById(cartId);
  
      if (!cart) {
        throw new Error('Cart not found');
      }
      const product = cart.products.find((p) => p._id.equals(productId));
  
      if (!product) {
        throw new Error('Product not found in the cart');
      }
  
      product.quantity = newQuantity;
  
      await cart.save();
  
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
  
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      const initialProductCount = cart.products.length;
  
      cart.products = cart.products.filter((p) => !p._id.equals(productId));
      if (cart.products.length === initialProductCount) {
        throw new Error('Product not found in the cart');
      }
  
      await cart.save();
  
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async setCartProducts(cartId, newProducts) {
    try {
      const cart = await CartModel.findById(cartId);
  
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      cart.products = [];

      newProducts.forEach(product => {
        cart.products.push({
          product: product.productId,
          quantity: product.quantity
        });
      });
  
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }
  
  async clearCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        throw new Error('Cart not found');
      }

      cart.products = [];
 
      await cart.save();
  
      return cart;
    } catch (error) {
      throw error;
    }
  }
}


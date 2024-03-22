//TODO:sincronizar las funciones con el dao

export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async findCart() {
    return await this.dao.findCart();
  }

  async findById(_id) {
    return await this.dao.findById(_id);
  }

  async createCart(cart) {
    return await this.dao.createCart({cart});
  }

  async updateProducts(cid, cart) {
    return await this.dao.updateCart(cid, cart);
  }

  async deleteProductFromCart(cid, pid) {
    try {
      return await this.dao.deleteProductFromCart(cid, pid);
    } catch (error) {
      throw error;
    }
  }

  async clearCart(cid) {
    try {
      return await this.dao.clearCart(cid);
    } catch (error) {
      throw error;
    }
  }

  async setProductQuantity(cid, pid, quantity) {
    try {
      return await this.dao.setProductQuantity(cid, pid, quantity);
    } catch (error) {
      throw error;
    }
  }

  async addProductCart(cid, pid) {
    try {
      return await this.dao.addProductCart(cid, pid);
    } catch (error) {
      throw error;
    }
  }
}

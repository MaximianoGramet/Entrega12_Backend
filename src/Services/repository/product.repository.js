export default class ProductRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    async findProduct(limit, page, query, sort) {
      const options = {
        limit: parseInt(limit) || 10,
        skip: parseInt(page - 1) * parseInt(limit) || 0,
        sort: sort || { createdAt: -1 }
      };
  
      return await this.dao.find(query || {}, null, options);
    }
  
    async getProductById(id) {
      return await this.dao.getProductById(id);
    }
  
    async createProduct(productData) {
      return await this.dao.createProduct(productData);
    }
  
    async updateProduct(id, productData) {
      return await this.dao.updateProduct(id, productData, { new: true });
    }
  
    async deleteProduct(id) {
      return await this.dao.findByIdAndDelete(id);
    }
  }
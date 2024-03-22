import { postModel } from "../../../models/product.model.js";

export default class ProductDao {
  async findProduct() {
    try {
      return await postModel.find();
    } catch (error) {
      throw new Error(`Error while finding products: ${error.message}`);
    }
  }

  async createProduct(post) {
    try {
      return await postModel.create(post);
    } catch (error) {
      throw new Error(`Error while creating product: ${error.message}`);
    }
  }

  async updateProduct(_id, post) {
    try {
      return await postModel.findOneAndUpdate({ _id }, post);
    } catch (error) {
      throw new Error(`Error while updating product: ${error.message}`);
    }
  }

  async deleteProduct(_id) {
    try {
      return await postModel.findByIdAndDelete({ _id });
    } catch (error) {
      throw new Error(`Error while deleting product: ${error.message}`);
    }
  }

  async getProductById(_id) {
    try {
      const testeo = await postModel.findById(_id);
      return(testeo)
    } catch (error) {
      throw new Error(`Error while getting product by ID: ${error.message}`);
    }
  }
  //trabajo 7:
  async   findProducts(limit = 10, page = 1, query, sort) {
    let consult = {}

    if (query != undefined)
    {
      consult[query.split(":")[0]] = query.split(":")[1]
    }

    return await postModel.paginate(consult,{limit:limit,page:page,sort:sort == undefined ? {}: {price:Number(sort)}})
  }

}



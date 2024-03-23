import { productService } from "../Services/services.js";
import CustomError from "../Services/errors/customError.js";
import { generateProductErrorInfo } from "../Services/errors/infoError.js";
import { EErrors } from "../Services/errors/enumError.js";

export const getProductList = async (req, res) => {
  try {
    const { limit, page, query, sort } = req.query
    const products = await productService.findProduct(limit, page, query, sort)
    res.json({
      data: products,
      message: "Products List"
    })
  } catch (error) {
    console.error(error)
    res.json({
      error,
      message: "error",
    })
  }
}

export const getProductById = async (req, res) => {
  const { id } = req.params
  try {
    const product = await productService.getProductById(id)

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({
      product,
      message: "Product found",
    })
  } catch (error) {
    console.error(error)
    res.json({
      error,
      message: "Error",
    })
  }
}

export const deleteProduct = async (req, res) => {
  const { id } = req.params
  try {
    const productToDelete = await productService.getProductById(id);
    if (!productToDelete) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const currentUser = req.session.user;
    if (currentUser.rol !== 'admin' && productToDelete.owner !== currentUser.email) {
      return res.status(403).json({ message: 'Access denied. You do not have permission to delete this product.' });
    }
    await productService.deleteProduct(id)
    return res.status(200).json({ message: 'Product deleted successfully' })
  } catch (error) {
    return res.status(404).json({ error: error.message })
  }
}

export const createProduct = async (req, res) => {
  const product = req.body;
  const owner = req.session.user?.email  || "admin"
  try {
    if (
      product.title === undefined ||
      product.description === undefined ||
      product.price === undefined ||
      product.thumbnail === undefined ||
      product.code === undefined ||
      product.status === undefined ||
      product.stock === undefined
    ) {
      CustomError.createError({
        name: "Product creation error",
        cause: generateProductErrorInfo(product),
        message:
          "Product cannot be created. Please see your console for details.",
        code: EErrors.MISSING_PROPERTY_ERROR,
      });
    }
    const newProduct = await productService.createProduct({ ...product, owner })
    res.json({
      product: newProduct,
      message: "Product created"
    });
  } catch (error) {
    console.log("[ERROR]: " + error.cause);
    res.status(400).json({
      error: error.name,
      message: error.message,
      code: error.code,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params
    const productToUpdate = await productService.getProductById(pid);
    if (!productToUpdate) {
      return res.status(404).json({ message: "Product not found" });
    }
    const currentUser = req.session.user;

    if (currentUser.rol !== "admin" && productToUpdate.owner !== currentUser.email) {
      return res.status(403).json({ message: "Access denied. You do not have permission to update this product." });
    }
    const product = await productService.updateProduct(pid, req.body)

    res.json({
      product,
      message: "Product updated"
    })
  } catch (error) {
    console.error(error)
    res.json({
      error,
      message: "error"
    })
  }
}

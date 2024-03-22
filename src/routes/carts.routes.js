import { Router } from "express"
import * as CartController from "../controllers/cart.controllers.js"
import { adminApiBlock } from "../utils/utils.js"
const router = Router()

router.get("/",CartController.getCartController)
router.get("/:cid", CartController.getCartByIdController)
router.get('/:cid/purchase',adminApiBlock() , CartController.finishPurchase)
router.post("/", CartController.createCartController)
router.put("/:cid",adminApiBlock() , CartController.updateCartController)
router.delete("/:cid", CartController.deleteCartController)
router.delete("/clear/:cid", CartController.clearCartController)
router.delete("/:cid/products/:pid", CartController.deleteProductFromCartController)
router.put(':/cid/products/:pid',adminApiBlock() , CartController.setProductQuantityController)
router.post("/:cid/products/:pid",adminApiBlock() , CartController.addProductCartController)


export default router

import { Router } from "express";
import ProductDao from "../Services/daos/dbManager/product.dao.js";
import { chatBlock } from "../controllers/chat.controller.js";

const router = Router();
const productDao = new ProductDao()

router.get("/", (req, res) => {res.render("login.hbs");});
router.get("/realtimeproducts", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/users/login");
    }res.render("products.hbs", {user:new UserDto(req.session.user)});
})

router.get("/chat",chatBlock,(req,res)=>{

        if (!req.session.user) {
            return res.redirect("/users/login");
        }
        res.render("chat.hbs");
    }
);

router.get("/products", async (req,res) => {

    if (!req.session.user) {
        return res.redirect("/users/login");
      }
    const { limit, page, query, sort } = req.query;
    const products = await productDao.findProducts(limit, page, query, sort);

    const userData = req.session.user;
    const welcomeMessage = 'Welcome to my store';

    res.render("products.hbs", { products, user: userData, welcomeMessage }, (err, html) => {
        if (err) {
            throw err
        }
        res.send(html)
    })
})

export default router;
import { Router } from "express";
import UserDto from "../Services/dtos/user.dto.js"; 

const router = Router()

router.get("/login", (req,res)=>{
    res.render('login')
})

router.get("/register", (req,res)=>{
    res.render('register')
})

router.get("/current", (req,res)=>{
    if (!req.session.user) {
        return res.redirect("/users/login");
    }
    res.render('profile', {user:new UserDto(req.session.user)})
})

router.get("/premium/:uid", async (req,res)=>{
    if (!req.session.user) {
        return res.redirect("/users/login");
    }
    try {
        const userId = req.params.uid;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.roll = user.roll === 'user' ? 'premium' : 'user';
        await user.save();

        res.render('profile', { user: new UserDto(user) });
    } catch (error) {
        console.error("Error at changing user roll:", error);
        res.status(500).send("Internal server error");
    }
})

router.get('/reset-password/:token', (req, res) => {
    const token = req.params.token;
    res.render('reset-password', { token });
});

router.get('/recover-password', (req, res) => {
    res.render('recover-password');
})

router.get("/cart", (req,res)=>{
    if (!req.session.user) {return res.redirect("/users/login");}
    res.render('cart')
})

export default router
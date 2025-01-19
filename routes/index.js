const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middelwares/isLoggedIn");
const productModel = require('../models/product-model');
const userModel = require("../models/user-models");
const { disconnect } = require('mongoose');

router.get("/", (req, res) => {
    try{
    let error = req.flash("error");
    res.render("index", {error, LoggedIn: false });
    }catch (err) {
        next(err);
    }
});

    router.get("/shop",isLoggedIn, async (req, res, next) => {
        try {
            let product = await productModel.find({});
            let success = req.flash("success");
            res.render('shop', {product: product, success});
        } catch (error) {
            next(error);
        }
    });
    router.get("/cart",isLoggedIn, async (req, res, next) => {
        try {
           let user = await userModel.findOne({email: req.user.email})
           .findOne({email : req.user.email})
           .populate("cart");
             const bill = (Number(user.cart[0].price)+20)-Number(user.cart[0].discount)
            res.render('cart', {user, bill});
        } catch (error) {
            next(error);
        }
    });

    router.get("/addtocart/:id",isLoggedIn, async (req, res, next) => {
        try {
            let user = await userModel.findOne({email: req.user.email});
            user.cart.push(req.params.id);
         await user.save();
         req.flash("success", "added to cart");
         res.redirect("/shop")
        } catch (error) {
            next(error);
        }
    });


module.exports = router;
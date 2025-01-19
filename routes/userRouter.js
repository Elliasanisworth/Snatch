const express = require('express');
const router = express.Router();
const isLoggedIn = require("../middelwares/isLoggedIn");
const {resigterUser, loginUser, logout,} = require("../controllers/authcontroller"); 

router.get("/", (req, res, next) => {
    try{
        res.sendFile("hey its working");
    }catch(err) {
        next(err);
    }
});

router.post("/register", resigterUser );
router.post("/login", loginUser);
router.get("/logout", logout);

module.exports = router;
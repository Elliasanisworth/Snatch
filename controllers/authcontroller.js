const usermodel = require("../models/user-models")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {genratetoken} = require("../utils/genratetoken");

  module.exports.resigterUser = async function(req, res) {
    try{
     let {email, password, fullname} = req.body;

    let user = await usermodel.findOne({email: email});
   
    if (user){ 
        return res.status(401).redirect("/")     
    }
     bcrypt.genSalt(10, function(err, salt){
        if(err){
            console.error("error genrating salt:", err);
            return res.status(500).send(" Error genrating salt");
        }
        bcrypt.hash(password, salt,async function (err, hash){
            if(err) {
                console.error("error genrating salt:", err);
                return res.status(500).send("error genrating hash");
            }
            try {
                let user = await usermodel.create({
                    email,
                    password: hash,
                    fullname,
                });
                let token = genratetoken(user);    
                res.cookie("token", token)
                res.redirect("/shop");
            }catch (createError) {
                console.error("error creating user", createError);
                res.status(500).send("error creating user");
            }
        });
     });
    }
    catch(err){
        console.error("error in resgisteruser:", err);
     res.send(err.message);
    }
 };

 module.exports.loginUser = async function(req, res) {
    try{
    let {email, password} = req.body;
    

    let user = await usermodel.findOne({email:email});
    if(!user){
     return res.send("Email or Password is wrong");
 }
    bcrypt.compare(password, user.password, function(err, result){
        if (result) {
            let token = genratetoken(user);
            res.cookie("token", token);
            res.redirect("/shop");
        }else {
            console.log("email or password is incorrect");
            return res.send("email or password is incorret");
        }
    });
 }catch (err) {
    console.error("error in loginuser:", err);
    res.send(err.message);
  }
};

 module.exports.logout = async function(req, res) {
    res.cookie("token", " ");
    res.redirect("/");
 };
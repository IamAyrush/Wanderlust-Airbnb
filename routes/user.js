const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const {saveRedirectUrl} =require("../middleware.js")

const userController =require("../controller/user.js")


router.get("/signup",userController.signUp)

router.post("/signup",wrapAsync(userController.signUpUser))

router.get("/login",userController.login)

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}) ,userController.loginUser)

router.get("/logout",userController.logOutUser)

module.exports =router;



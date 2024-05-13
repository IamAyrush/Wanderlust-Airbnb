const User = require("../models/user.js")

module.exports.signUp =(req,res)=>{
    res.render("user/signUp.ejs")
}
module.exports.login =(req,res)=>{
    res.render("user/login.ejs")
}
module.exports.signUpUser =async (req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser = new User({email,username})
   const registeredUser =await User.register(newUser,password)
   req.login(registeredUser,(err)=>{
    if(err){
        return next(err)
    }
    req.flash("success","Welcome to WanderLust")
    res.redirect("/listing")
})
    }
    catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }

}

module.exports.loginUser =async (req,res)=>{
    req.flash("success","welcome Again!!")
    let redirectUrl =res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl)
}

module.exports.logOutUser =(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash("success","you are logged out!")
        res.redirect("/listing")
    })
}
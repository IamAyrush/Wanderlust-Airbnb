if(process.env.NODE_ENV != "producton"){
require('dotenv').config();
}



const express = require("express")
const app = express();
const mongoose = require('mongoose')
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError =require("./utils/ExpressError.js")
const {listingSchema ,reviewSchema} =require("./schema.js")
const Review = require("./models/review.js")
const passport=require("passport");
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")

const listingRouter =require("./routes/listing.js")
const reviewRouter =require("./routes/review.js")
const localStrategy = require("passport-local")
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");




main()
.then(()=>{
    console.log("connect to DB")
})
.catch(err => console.log(err));

async function main() {
   await mongoose.connect(process.env.ATLASDB_URL);
}


app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store =MongoStore.create({
    mongoUrl:process.env.ATLASDB_URL,
    crypto:{
        secret:process.env.SECRET,
    }
    ,touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err)
});

const sessionOption ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
}



app.use(session(sessionOption))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.success =req.flash("success")
    res.locals.error =req.flash("error")
    res.locals.currUser=req.user
    next();
})



app.use('/listing',listingRouter)
app.use("/listing/:id/reviews",reviewRouter)
app.use("/",userRouter)

app.get("/",(req,res)=>{
    res.redirect("./listing")
})




// app.get("/testListing",async (req,res)=>{
//     let sampleListing =new Listing({
//         title:"my New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Goa",
//         country:"India",
//      })

//      await sampleListing.save();
//      console.log("saved")
//      res.send("saved")
// })

app.all("*", (req, res) => {
    res.status(404).render("listing/page404");
});


app.use((err,req,res,next)=>{
    let {status=500 ,message="something went wrong"}=err;
    // res.status(status).send(message);
   res.status(status).render("error.ejs",{err})
})


app.listen(8080,()=>{
    console.log("server is Listening to port 8080")
})
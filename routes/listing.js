const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema ,reviewSchema} =require("../schema.js")
const Listing = require("../models/listing.js")
const ExpressError =require("../utils/ExpressError.js")
const {isLoggedIn, isOwner}= require("../middleware.js")
const listingController =require("../controller/listing.js")

const multer =require('multer');
const {storage} =require('../cloudConfig.js')
const upload = multer({storage})

let category =["Trending","Rooms","Beach","Castles","Amezing_Pools","Mountain","Arctic","Farms","Camping","Iconic_cities"]
const categories =[["Trending","fa-solid fa-fire"],["Rooms",'fa-solid fa-bed'],["Beach",'fa-solid fa-water'],["Castles","fa-brands fa-fort-awesome"],["Amezing_Pools","fa-solid fa-person-swimming"],["Mountain","fa-solid fa-mountain"],["Arctic","fa-regular fa-snowflake"],["Farms","fa-solid fa-cow"],["Camping","fa-solid fa-campground"],["Iconic_cities","fa-solid fa-mountain-city"]]

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400, error)
    }
    else{
        next();
    }

}


router.get("/new",isLoggedIn,listingController.newForm)

router.route('/')
.get(wrapAsync(listingController.index))

.post(isLoggedIn,upload.single("listing[img]"),wrapAsync(listingController.createListing),validateListing)

for(let i=0;i<=10;i++){
    router.get(`/${category[i]}`,async (req,res)=>{
        let option =category[i];
        const allListing= await Listing.find({});
          
        const filterListing =allListing.filter((listing)=>{
            return listing.category==option ;
        })
    
    
    
        res.render("listing/filter.ejs",{option,categories,filterListing})
    })
}


// this is for search results.
router.post('/result',  wrapAsync(listingController.result));

router.post(
    "/:id/upload",
    isLoggedIn,
    upload.single('listing[img]'),
    wrapAsync(listingController.uploadImage)
);

router.route("/:id")
.get(wrapAsync(listingController.showListing))

.put(isLoggedIn,isOwner,upload.single('listing[img]'),validateListing,wrapAsync(listingController.updateListing))

.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))


router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing))


module.exports=router;

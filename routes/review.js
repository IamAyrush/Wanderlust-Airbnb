const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError =require("../utils/ExpressError.js")
const {listingSchema ,reviewSchema} =require("../schema.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing.js");
const { isLoggedIn,isReviewAuthor } = require("../middleware.js");

const ReviewController =require("../controller/reviews.js")


const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    
    if(error){
       throw new ExpressError(400, error)
    }
    else{
        next();
    }

}
//post reviews route
router.post("/",isLoggedIn,validateReview,wrapAsync (ReviewController.newReview))

//delete reviews route
router.delete("/:reviewId",isReviewAuthor , wrapAsync(ReviewController.destroyListing))

module.exports= router;
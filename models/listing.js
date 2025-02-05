const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const cloudinary =require('cloudinary').v2;
const Review = require('./review.js');
const { string, required } = require('joi');
const listingSchema = new Schema({
    title :{
        type:String,
        required : true,
    },
    description:String,
    img: [
        {
            url: String,  // Directly storing URL string
            filename: String
        }
    ],
    price:Number,
    location:String,
    country:String,
    category:{
        type:String,
        enum:["Trending","Mountain","Beach","Castles","Amezing_Pools","Rooms","Arctic","Farms","Camping","Iconic_cities"],
    },
    reviews:[
        {
           type : Schema.Types.ObjectId,
           ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if (listing) {
        // Delete associated reviews
        await Review.deleteMany({ _id: { $in: listing.reviews } });

        // Delete associated images from Cloudinary
        if (listing.img && listing.img.length > 0) {
            for (let image of listing.img) {
                if (image.filename) {
                    await cloudinary.uploader.destroy(image.filename);
                }
            }
        }
    }
})

const Listing =mongoose.model("Listing",listingSchema);
module.exports = Listing;

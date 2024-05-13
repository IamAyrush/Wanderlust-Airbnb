const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const Review = require('./review.js');
const { string, required } = require('joi');
const listingSchema = new Schema({
    title :{
        type:String,
        required : true,
    },
    description:String,
    img:{
       url:String,
       filename:String,
    },
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
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

const Listing =mongoose.model("Listing",listingSchema);
module.exports = Listing;

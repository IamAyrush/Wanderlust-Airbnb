const Listing= require("../models/listing")


module.exports.index=async (req,res)=>{
    const categories =[["Trending","fa-solid fa-fire"],["Rooms",'fa-solid fa-bed'],["Beach",'fa-solid fa-water'],["Castles","fa-brands fa-fort-awesome"],["Amezing_Pools","fa-solid fa-person-swimming"],["Mountain","fa-solid fa-mountain"],["Arctic","fa-regular fa-snowflake"],["Farms","fa-solid fa-cow"],["Camping","fa-solid fa-campground"],["Iconic_cities","fa-solid fa-mountain-city"]]
    const allListing= await Listing.find({});
    res.render("listing/index.ejs",{allListing,categories});
}

module.exports.result = async(req,res)=>{
    const {q} = req.body;
    // res.send(q);
     const categories =[["Trending","fa-solid fa-fire"],["Rooms",'fa-solid fa-bed'],["Beach",'fa-solid fa-water'],["Castles","fa-brands fa-fort-awesome"],["Amezing_Pools","fa-solid fa-person-swimming"],["Mountain","fa-solid fa-mountain"],["Arctic","fa-regular fa-snowflake"],["Farms","fa-solid fa-cow"],["Camping","fa-solid fa-campground"],["Iconic_cities","fa-solid fa-mountain-city"]]
     const AccListing= await Listing.find({}); //Listing All Accomdation
     const allListing = AccListing.filter((listing)=>{
        const str1 = `${listing.location}`.toLowerCase();
        const str2 = `${q}`.toLowerCase();
       if( str1.includes(str2) ){
        return listing;
       }
        
    }) // listing of filter accomodation.

    if(allListing.length ==0){
        req.flash("error",`There is no Location named as ${q}`)
        res.redirect("/listing");
    }else{
        req.flash("success",`Found results for ${q}`);
        res.render("listing/index.ejs",{allListing,categories});

    }  

}

module.exports.newForm =(req,res)=>{
    res.render("listing/new.ejs")
}

module.exports.showListing =async (req,res)=>{
    let {id} =req.params;
    const listing= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error"," This Listing does not exist!!")
        res.redirect("/listing")
    }
    res.render("listing/show.ejs",{listing})
}


module.exports.editListing =async (req,res)=>{
    let {id} =req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","This Listing does not exist!!")
        res.redirect("/listing")
    }
    let originalImgUrl =listing.img.url;
    originalImgUrl= originalImgUrl.replace("/upload","/upload/h_300,w_250")
    res.render("listing/edit.ejs",{listing, originalImgUrl})

}

module.exports.createListing=async (req,res,next)=>{
    
    let url =req.file.path;
    let filename=req.file.filename;

   const newListing = new Listing(req.body.listing) ;
   newListing.owner =req.user._id;
   newListing.img ={url,filename}
   await newListing.save();
   req.flash("success","New Listing Created")
   res.redirect("/listing");
    
}

module.exports.updateListing =async (req,res)=>{
    let {id} =req.params;

    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url =req.file.path;
    let filename=req.file.filename;
    listing.img={url,filename}
    await listing.save();
    }
    req.flash("success","Updated successfuly!!")
    res.redirect(`/listing/${id}`)
}
module.exports.deleteListing =async (req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted succesfuly")
    res.redirect("/listing")
}
const Listing = require('../models/listing');


module.exports.index = async (req, res) => {
    const categories = [
        ["Trending", "fa-solid fa-fire"],
        ["Rooms", "fa-solid fa-bed"],
        ["Beach", "fa-solid fa-water"],
        ["Castles", "fa-brands fa-fort-awesome"],
        ["Amezing_Pools", "fa-solid fa-person-swimming"],
        ["Mountain", "fa-solid fa-mountain"],
        ["Arctic", "fa-regular fa-snowflake"],
        ["Farms", "fa-solid fa-cow"],
        ["Camping", "fa-solid fa-campground"],
        ["Iconic_cities", "fa-solid fa-mountain-city"]
    ];

    // Fetch listings with owner info, NO NEED TO POPULATE "img"
    const allListing = await Listing.find({}).populate("owner");

    res.render("listing/index.ejs", { allListing, categories });
};


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

module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    // Fetch listing with owner and reviews (NO need to populate img)
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } }) // Populating reviews and their authors
        .populate("owner"); // Populating owner of the listing

    // If listing doesn't exist, show error
    if (!listing) {
        req.flash("error", "This Listing does not exist!");
        return res.redirect("/listing");
    }

    // Ensure listing.img exists as an array
    if (!listing.img || listing.img.length === 0) {
        listing.img = [{ url: "https://static.vecteezy.com/system/resources/thumbnails/022/059/000/small_2x/no-image-available-icon-vector.jpg" }];
    }

    res.render("listing/show.ejs", { listing });
};



module.exports.editListing =async (req,res)=>{
    let {id} =req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","This Listing does not exist!!")
        res.redirect("/listing")
    }
    res.render("listing/edit.ejs",{listing})

}

module.exports.createListing = async (req, res, next) => {
    try {
        if (!req.file) {
            req.flash("error", "Please upload an image!");
            return res.redirect("/listing/new");
        }

        // Create a new `ListingImg` document for the image
        const image = {
            url: req.file.path,
            filename: req.file.filename
        };

        // Create a new `Listing` and store images directly in `img`
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.img.push(image); // Store as an array for future multiple uploads

        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listing");
    } catch (error) {
        next(error);
    }
};


module.exports.uploadImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listing");
        }
        
        if (!req.file) {
            req.flash("error", "No image uploaded!");
            return res.redirect(`/listing/${id}`);
        }

        // Extract image details
        const { path: url, filename } = req.file;
        
        // Create an image object
        const newImage = {
              url,
              filename 
        };

        // Add the new image to the listing
        listing.img.push(newImage);
        await listing.save();

        req.flash("success", "Image uploaded successfully!");
        res.redirect(`/listing/${req.params.id}`);
    } catch (error) {
        req.flash("error", "Upload failed. Try again later!");
        console.log(error);
        
        res.redirect(`/listing/${req.params.id}`);
    }
};



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
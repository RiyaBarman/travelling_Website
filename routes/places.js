const express = require('express');
const router = express.Router();
const Place = require("../models/place");
const Comment = require("../models/comment"); 


/* =============
    places routes
   =============*/

   router.get("/", (req, res) => {
    // Get all places from db 
    Place.find({}, (err, allPlaces) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { places: allPlaces })
        }
    });
    // res.render("places", { places: places });
});


router.post("/", isLoggedIn, (req, res) => {

    // get data from form and add to places array
    let place_name = req.body.place_name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newPlace = {
        name: place_name,
        image: image,
        description: desc,
        author: author
    }

    
    // console.log(newPlace);
    // Create newplace and save to db
    Place.create(newPlace, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Created New Place");

            // redirect back to places route
            // console.log(newlyCreated);
            res.redirect("/places");
        }
    });
});


router.get("/new", isLoggedIn, (req, res) => {
    res.render("new");
})

router.get("/:id", (req, res) => {
    Place.findById(req.params.id).populate("comments").exec(function (err, foundPlace) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundPlace);
            res.render("show", { place: foundPlace });
        }
    });
});

// isLoggedin middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/log-in");
    }
}
module.exports = router;
const express = require('express');
const router = express.Router();
const Place = require("../models/place");
const Comment = require("../models/comment");
const middleware = require("../middleware"); 

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


router.post("/", middleware.isLoggedIn, (req, res) => {

    // get data from form and add to places array
    let place_name = req.body.place_name;
    let image = req.body.image;
    let desc = req.body.description;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newPlace = {
        name: place_name,
        image: image,
        description: desc,
        author: author,
        price: price
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


router.get("/new", middleware.isLoggedIn, (req, res) => {
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

// EDIT PLACE ROUTE
router.get("/:id/edit", middleware.checkPlaceAuth, (req, res) => {

    Place.findById(req.params.id, (err, foundPlace) => {

        res.render("places/edit", { place: foundPlace });

    });

});


// UPDATE PLACE ROUTE
router.put("/:id", middleware.checkPlaceAuth, (req, res) => {
    // find and update the place 

    Place.findByIdAndUpdate(req.params.id, req.body.place, (err, updatedPlace) => {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/places");
        } else {
            // redirect to the show page
            req.flash("success", "Your place updated successfully!");
            res.redirect("/places/" + req.params.id);
        }
    });

});

// DESTROY PLACE ROUTE
router.delete("/:id", middleware.checkPlaceAuth, (req, res) => {
    Place.findOneAndDelete(req.params.id, (err) => {
        if (err) {
            req.flash("error", "Something went wrong!");
            res.redirect("/places");
        } else {
            req.flash("success", "Place deleted successfully!");
            res.redirect("/places");
        }
    })

})

// isLoggedin middleware
// CHECK AUTH FOR EDIT AND DELETE
// moved to middleware dir

module.exports = router;
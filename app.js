const e = require('express');

const express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require('mongoose')


mongoose.connect("mongodb://localhost/travellers",
    { useNewUrlParser: true, useUnifiedTopology: true });

var placeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Place = mongoose.model("Traveller", placeSchema);

// Place.create({
//     name: "Goa",
//     image: "https://www.photosforclass.com/download/pb_1121506",
//     description: "this is a wonderful place to be at and tan your skin!!"
// }, (err, place) => {
//     if (err) {
//         console.log(err + " Error in creating place");
//     } else {
//         console.log("NEWLY CREATED PLACE:");
//         console.log(place);
//     }
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.get('/', (req, res) => {
    res.render('landing');
});

app.get("/places", (req, res) => {
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


app.post("/places", (req, res) => {

    // get data from form and add to places array
    let place_name = req.body.place_name;
    let image = req.body.image;
    let desc = req.body.description;
    let newPlace = {
        name: place_name,
        image: image,
        description : desc
    }
    // Create newplace and save to db
    Place.create(newPlace, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Created New Place");

            // redirect back to places route
            res.redirect("/places");
        }
    });
});


app.get("/places/new", (req, res) => {
    res.render("new");
})

app.get("/places/:id", (req, res) => {
    Place.findById(req.params.id, (err, foundPlace) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show" ,{place : foundPlace});
        }
    });
});

app.listen(3000, () => {
    console.log("Server is Up !!!")
});
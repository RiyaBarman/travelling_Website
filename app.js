const express        = require('express'),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require('mongoose'),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      Place          = require("./models/place"),
      Comment        = require("./models/comment"),
      User           = require("./models/user"),
      seedDB         = require("./seeds")

const placesRoutes    = require("./routes/places"),
      commentRoutes   = require("./routes/comments"),
      authRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost/travellers",
    { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB();


// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "We all will be selected in a very good company.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
});
app.use("/",authRoutes);
app.use("/places", placesRoutes);
app.use("/places/:id/comments",commentRoutes);



app.listen(3000, () => {
    console.log("Server is Up !!!")
});
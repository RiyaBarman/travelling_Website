const express        = require('express'),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require('mongoose'),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      flash          = require("connect-flash"),
      Place          = require("./models/place"),
      Comment        = require("./models/comment"),
      User           = require("./models/user"),
      seedDB         = require("./seeds")

const placesRoutes    = require("./routes/places"),
      commentRoutes   = require("./routes/comments"),
      authRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost/travellers",
    { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect("mongodb+srv://Kunal:Rinal27074@cluster0.oykc8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
//     { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
    next();
});
app.use("/",authRoutes);
app.use("/places", placesRoutes);
app.use("/places/:id/comments",commentRoutes);



app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Up !!!")
});
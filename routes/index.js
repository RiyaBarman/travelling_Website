const express = require('express');
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
/* ===============
    HOME ROUTE
===============*/

router.get('/', (req, res) => {
    res.render('landing');
});




/* =============
    AUTH ROUTES
   ============= */

//    signup routes
router.get("/sign-up", (req, res) => {
    res.render("sign_up");
});

router.post("/sign-up", (req, res) => {
    let newUser = new User({
        username: req.body.username
    })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error",err.message);
            console.log(err);
            return res.render("sign_up");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to Travellers "+ user.username);
            res.redirect("/log-in");
        });
    });
});

// login routes
router.get("/log-in", (req, res) => {
    res.render("log_in");
});
// handle login logic
router.post("/log-in", passport.authenticate("local", {

    successRedirect: "/places",
    
    failureRedirect: "/sign-up"
}), (req, res) => {

});

// LOGOUT ROUTE
router.get("/log-out", (req,res)=>{
    req.logout();
    req.flash("success", "Logged out successfully!")
    res.redirect("/");
});



module.exports = router;

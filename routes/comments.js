const express = require('express');
const router = express.Router({mergeParams: true});
const Place = require("../models/place");
const Comment = require("../models/comment"); 
/*=================
 comments-routes
 ==================*/

 router.post("/",isLoggedIn,  (req, res) => {
    Place.findById(req.params.id, (err, place) => {
        if (err) {
            console.log(err);
            res.redirect("/places");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(req.user)
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    place.comments.push(comment);
                    place.save();
                    res.redirect("/places/" + place._id);
                }
            });
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

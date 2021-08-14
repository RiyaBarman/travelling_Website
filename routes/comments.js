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
// COMMENT UPDATE ROUTE
router.put("/:comment_id",checkCommentAuth, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/places/"+ req.params.id);

        }
    })
});

router.delete("/:comment_id",checkCommentAuth, (req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/places/"+req.params.id);
        }
    })
});
// isLoggedin middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/log-in");
    }
}
function checkCommentAuth(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                // foundcomment.author.id => Mongoose Object
                // req.user._id => string
                // annot use == or  ===
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }

}

module.exports = router;

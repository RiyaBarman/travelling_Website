const express = require('express');
const router = express.Router({mergeParams: true});
const Place = require("../models/place");
const Comment = require("../models/comment"); 
const middleware = require("../middleware");
/*=================
 comments-routes
 ==================*/

 router.post("/",middleware.isLoggedIn,  (req, res) => {
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
router.put("/:comment_id",middleware.checkCommentAuth, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/places/"+ req.params.id);

        }
    })
});

router.delete("/:comment_id",middleware.checkCommentAuth, (req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/places/"+req.params.id);
        }
    })
});
// isLoggedin middleware


module.exports = router;

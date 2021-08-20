const Place =  require("../models/place");
const Comment =  require("../models/comment");
var middlewareObj = {};


middlewareObj.checkPlaceAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        Place.findById(req.params.id, (err, foundPlace) => {
            if (err) {
                req.flash("error", "Place not found!");
                res.redirect("/places");
            } else {
                // foundPlace.author.id => Mongoose Object
                // req.user._id => string
                // annot use == or  ===
                if (foundPlace.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("warning","You do not have permission to do that!" )
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("warning", "You need to be logged in to do that!")
        res.redirect("back");
    }
}

middlewareObj.checkCommentAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else {
                // foundcomment.author.id => Mongoose Object
                // req.user._id => string
                // annot use == or  ===
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("warning","You do not have permission to do that!" )
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("warning", "You need to be logged in to do that!")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("warning", "You need to be logged in to do that!")
        res.redirect("/log-in");
    }
}









module.exports = middlewareObj;
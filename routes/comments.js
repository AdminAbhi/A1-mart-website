var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
//var middleware = require("../middleware");


// ==========================
// COMMENTS ROUTES
// ==========================


// Comments New

router.get("/new", isLoggedIn, function(req, res){
	// find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
});

// Comments create
router.post("/",isLoggedIn, function(req, res){
	// lookup campground using id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			res.flash("error","Something went wrong!!");
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error","Something went wrong!!");
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//save comment
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Comment added successfully!!");
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", "Something went wrong!!");
			res.redirect("back");
		}else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
	
});

// Commnet UPDATE
router.put("/:comment_id", checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Comment DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
	//find by id
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});

// middleware
function checkCommentOwnership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error","Product not found not found!!");
				res.redirect("back");
			}else{
				// does the user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","you don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error","Please login first!!");
		res.redirect("back");
	}
}

function isLoggedIn(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash("error", "Please login first!");
		res.redirect("/login");
}


module.exports = router;


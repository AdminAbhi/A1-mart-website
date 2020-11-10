// All the middleware goes here
var Product = require("../models/product");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkProductOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Product.findById(req.params.id, function(err, foundProduct){
			if(err){
				res.redirect("back");
			}else{
				// does the user own the product?
				if(foundProduct.author.id.equals(req.user._id) || req.user.username == "admin"){
					next();
				}else{
					res.redirect("back");
				}
			}
		});
	}else{
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			}else{
				// does the user own the comment?
				if(foundComment.author.id.equals(req.user._id) || req.user.username == "admin"){
					next();
				}else{
					res.redirect("back");
				}
			}
		});
	}else{
		res.redirect("back");
	}
}

middlewareObj.isloggedIn = function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		res.redirect("/login");
}

module.exports = middlewareObj;
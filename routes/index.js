var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//HOME PAGE - ROOT ROUTE
router.get("/", function(req, res){
	res.render("landing");
});


// ====================
// AUTH ROUTE 
// ====================

//show register form
router.get("/register", function(req, res){
	res.render("register", {page: 'register'});
});
//handle Sign Up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			console.log(err);
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to A1 Mart " + user.username);
			res.redirect("/products");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login",{page: 'login'});
});

//handling login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/products",
		failureRedirect: "/login"
	}), 
	function(req, res){
});

// Logout ROUTE
router.get("/logout", function(req, res){
	req.logout(); 
	req.flash("success", "Logged out!");
	res.redirect("/products");
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First!");
	res.redirect("/login");
}
module.exports = router;
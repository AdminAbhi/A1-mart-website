var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//var middleware = require("../middleware");

// INDEX - Show all available Campgrounds
router.get("/", function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds', currentUser: req.user});
		}
	});
});

//Add new Campground to DataBase
router.post("/",isLoggedIn,  function(req, res){
	//res.send("You hit the post route");
	var n = req.body.name;
	var i = req.body.image;
	var p = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: n, price: p, image: i, description: desc, author: author};
	
	//Create new campground and save it to database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			consol.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});

//FORM to add new Campground
router.get("/new",isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			//render show template with that campground
			//console.log(foundCampground);
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
});

// EDIT Campgrounds ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
	//is user logged in?
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// UPDATE Campground ROUTE
router.put("/:id", function(req, res){
	// Find and UPDATE the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
	//redirect to show page
	
});

// DESTROY Campgrounds ROUTE
router.delete("/:id", checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

// middleware
function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error","Product not found!!");
				res.redirect("back");
			}else{
				// does the user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error","you don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "Please login first!!");
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

 
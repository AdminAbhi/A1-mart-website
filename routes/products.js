var express = require("express");
var router = express.Router();
var Product = require("../models/product");
//var middleware = require("../middleware");

// INDEX - Show all available Products
router.get("/", function(req, res){
	//Get all products from DB
	Product.find({}, function(err, allProducts){
		if(err){
			console.log(err);
		}else{
			res.render("products/index",{products: allProducts, page: 'products', currentUser: req.user});
		}
	});
});

//Add new Product to DataBase
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
	var newProduct = {name: n, price: p, image: i, description: desc, author: author};
	
	//Create new product and save it to database
	Product.create(newProduct, function(err, newlyCreated){
		if(err){
			consol.log(err);
		}else{
			res.redirect("/products");
		}
	});
});

//FORM to add new Product
router.get("/new",isLoggedIn, function(req, res){
	res.render("products/new");
});

router.get("/:id", function(req, res){
	//find the product with provided ID
	Product.findById(req.params.id).populate("comments").exec( function(err, foundProduct){
		if(err){
			console.log(err);
		}else{
			//render show template with that product
			//console.log(foundProduct);
			res.render("products/show",{product: foundProduct});
		}
	});
});

// EDIT Products ROUTE
router.get("/:id/edit", checkProductOwnership, function(req, res){
	//is user logged in?
	Product.findById(req.params.id, function(err, foundProduct){
		res.render("products/edit", {product: foundProduct});
	});
});

// UPDATE Product ROUTE
router.put("/:id", function(req, res){
	// Find and UPDATE the correct product
	Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
		if(err){
			res.redirect("/products");
		}else{
			res.redirect("/products/" + req.params.id);
		}
	});
	
	//redirect to show page
	
});

// DESTROY Products ROUTE
router.delete("/:id", checkProductOwnership, function(req, res){
	Product.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/products");
		}else{
			res.redirect("/products");
		}
	});
});

// middleware
function checkProductOwnership(req, res, next){
	if(req.isAuthenticated()){
		Product.findById(req.params.id, function(err, foundProduct){
			if(err){
				req.flash("error","Product not found!!");
				res.redirect("back");
			}else{
				// does the user own the product?
				if(foundProduct.author.id.equals(req.user._id) || req.user.username == "admin"){
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

 
var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	flash		= require("connect-flash"),
	passport	= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride 	= require("method-override"),
	Product 	= require("./models/product"),
	Comment   	= require("./models/comment"),
	seedDB  	= require("./seeds"),
	User		= require("./models/user")

// requiring routes
var commentRoutes = require("./routes/comments"),
	productRoutes = require("./routes/products"),
	indexRoutes = require("./routes/index")

app.locals.moment = require('moment');
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Hello abhi",
	resave: false,
	saveUninitialized: false
}));
  
app.use(flash());  
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.connect('mongodb+srv://admin:Admin@a1mart.ibzry.mongodb.net/<dbname>?retryWrites=true&w=majority' , {
	useNewUrlParser: true, 
	useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
	console.log('Mongoose is Connected!!');
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
}); 


app.use("/", indexRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/comments", commentRoutes);


// app.listen(process.env.PORT, function(){
// 	console.log("Server has started at PORT", process.env.PORT);
// });

//START SERVER on PORT 3000
app.listen(process.env.PORT || 3000, function() { 
  console.log('Server listening on port 3000'); 
});
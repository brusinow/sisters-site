var subdomain = require('express-subdomain');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
var stripe = require("stripe")(process.env.STRIPE_SECRET);


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'app')));

app.use(session({
  secret: "Murray is a dog buddy",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));







app.get('/instagram', function(req, res) {
  var instaURL = 'https://api.instagram.com/v1/users/'+process.env.INSTA_USER+'/media/recent/?access_token='+process.env.INSTA_TOKEN;
  request(instaURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});

app.get("/taxRate", function(req, res) {
  console.log("What is req? ",req.query);
  var url = 'https://taxrates.api.avalara.com:443/postal?country='+req.query.country+'&postal='+req.query.postal+'&apikey='+process.env.TAX_KEY;
  console.log("What is url? ",url);
   request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });

});

app.post("/submitOrder", function(req, res) {
  console.log("req.query: ",req.query);
  req.session.orderDetails = req.query.orderDetails;
  req.session.stripeToken = req.query.token;
  console.log("what is req.session? ",req.session);
  res.send(); 
});


app.get("/orderConfirm", function(req, res) {
  console.log("what is session? ",req.session);
  res.send(req.session); 
});

app.post("/createCharge", function(req, res) {
  var order = JSON.parse(req.session.orderDetails);
  var token = JSON.parse(req.session.stripeToken);
  var orderTotal = Math.floor(order.total * 100);
  var orderName = order.shippingAddress.name;
  var tokenId = token.id;
  console.log("WHAT IS ORDER TOTAL!?!?!?!?!?!?!?!? :",orderTotal);
  console.log("WHAT IS ORDER NAME!?!?!?!?!?!?!?!? :",orderName);
  console.log("WHAT IS TOKEN!?!?!?!?!?!?!?!? :",tokenId);
  stripe.charges.create({
  amount: orderTotal,
  currency: "usd",
  source: tokenId, // obtained with Stripe.js
  description: "Charge for "+orderName
  }, function(err, charge) {
    if(charge){
      res.send("CHARGE!!!!!! ",charge);
    } else {
      res.send("ERROR!!!!! ",err);
    } 
  });
   
});


app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'app/index.html'));
});






app.listen(process.env.PORT || 3000)
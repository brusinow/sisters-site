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

// app.get("/taxRate", function(req, res) {
//   console.log("What is req? ",req.query);
//   var url = 'https://taxrates.api.avalara.com:443/postal?country='+req.query.country+'&postal='+req.query.postal+'&apikey='+process.env.TAX_KEY;
//   console.log("What is url? ",url);
//    request(url, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       res.send(body);
//     }
//   });
// });

app.get("/stripe/allProducts", function(req, res){
  stripe.products.list(
  { limit: 10 },
  function(err, products) {
    res.send(products);
  }
  );
})

app.post("/stripe/createOrder", function(req, res){
  console.log("what is the order? ",req.query.order);
  var thisOrder = req.query.order;
  var parsedOrder = JSON.parse(thisOrder);
  req.session.stripeToken = req.query.token;
  console.log("what is req.session? ",req.session);
  stripe.orders.create(parsedOrder, function(err, order) {
    if (order){
      console.log("order succeeded!! ",order);
      var shipping = order.shipping.address;

      console.log("is this shipping country? ",shipping)
      res.send(order);
    }
    if (err){
      console.log("ERROR!! ",err);
    }
  });
})

app.post("/stripe/saveToken", function(req, res){
  req.session.stripeToken = req.query.token;
  res.send("success");
})

app.get('/stripe/testtest', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.post("/stripe/taxCallback", function(req, res){
  var order = req.body.order;
  console.log("what is order ",order);
  var shipping = order.shipping.address;
  var items = order.items;
  var totalPreTax = 0;
  for (var i = 0;i < items.length;i++){
    if (items[i].type === 'sku'){
      totalPreTax += items[i].amount;
    }
  }
  console.log("what is taxable amount after loop? ",totalPreTax);
  var url = 'https://taxrates.api.avalara.com:443/postal?country='+shipping.country+'&postal='+shipping.postal_code+'&apikey='+process.env.TAX_KEY;
  console.log("What is url? ",url);
   request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("what is body? ",body.totalRate);
      var taxRate = parseFloat(body.totalRate);
      var totalTax = (totalPreTax * taxRate);
      console.log("what is taxable amount? ",totalTax);


  var myJSON = {
        "order_update": {
         "items": [
         {
          "parent": null,
          "type": "tax",
          "description": "Sales taxes",
          "amount": totalTax,
          "currency": "usd"
        }
        ]
      }
    }
      res.json(myJSON);

    }
  });
})



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
      req.session.orderDetails = {};
      req.session.stripeToken = {};
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
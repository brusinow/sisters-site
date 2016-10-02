var subdomain = require('express-subdomain');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
var stripe = require("stripe")(process.env.STRIPE_SECRET);
// var shippo = require('shippo')('<PRIVATE_TOKEN>');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'app')));

app.use(session({
  secret: process.env.SESSION_SECRET,
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

app.get("/stripe/oneProduct", function(req, res){
  console.log("product id is: ",req.query.productId);
  stripe.products.retrieve(
  req.query.productId,
  function(err, product) {
    res.send(product);
  });
});

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
  stripe.orders.create(parsedOrder, function(err, order) {
    if (order){
      console.log("session storage at order create? ",req.session);
      console.log("order succeeded!! ",order);
      res.send(order);
    }
    if (err){
      console.log("ERROR!! ",err);
      res.send(err);
    }
  });
})

app.post("/stripe/updateShipping", function(req, res){
  stripe.orders.update(req.query.orderId, {
    selected_shipping_method: req.query.selectedShip
  }, function(err, order){
     if(order){
      res.status(200).send(order);
    }
    if(err){
      res.send(err);
    }

  });
})

app.get('/stripe/testtest', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});


app.post("/stripe/orderComplete", function(req, res){
  console.log("ENTERING ROUTE!!!!!")
  stripe.orders.pay(req.query.orderId, {
  source: req.query.token 
  }, function(err, order) {
    if (order){
      console.log("success!")
      res.send(order);
    }
    if (err){
      res.send(err);
    }
  });
})


app.post("/stripe/taxCallback", function(req, res){
  var order = req.body.order;
  var shipping = order.shipping.address;
  var taxRate = order.metadata.taxRate;
  if (taxRate !== 0){
    var items = order.items;
    var totalPreTax = 0;
      for (var i = 0;i < items.length;i++){
        if (items[i].type === 'sku'){
          totalPreTax += items[i].amount;
        }
      }
  }


  var myJSON = {
      "order_update": {
        "items": [
          {
          "parent": null,
          "type": "tax",
          "description": "Sales Tax ("+taxRate+"%)",
          "amount": (taxRate/100) * totalPreTax,
          "currency": "usd"
          }
        ]
      }
  }    
  res.json(myJSON); 
});





app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'app/index.html'));
});






app.listen(process.env.PORT || 3000)
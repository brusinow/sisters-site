var subdomain = require('express-subdomain');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
var stripe = require("stripe")(process.env.STRIPE_SECRET);
var Twitter = require('twitter');
var twitterText = require('twitter-text')
var Entities = require('html-entities').AllHtmlEntities;
var http = require('http');
var fs = require('fs');
// var firebase = require("firebase");


// var shippo = require('shippo')('<PRIVATE_TOKEN>');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'app')));


// firebase.initializeApp({
//   serviceAccount: "app/firebaseCredentials.json",
//   databaseURL: "https://sisters-site.firebaseio.com"
// });


entities = new Entities();


var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_TOKEN,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));





app.get('/twitter', function(req, res) {
  client.get('statuses/user_timeline',{include_rts: false}, function(error, tweets, response) {
  if(error) throw error;
    var thisTweetText = entities.decode(tweets[0].text);
    var retweetCount = tweets[0].retweet_count;
    var favoriteCount = tweets[0].favorite_count;
    var tweetHTML = twitterText.autoLink(twitterText.htmlEscape(thisTweetText),{"targetBlank": true});
    var fullData = {
      retweets: retweetCount,
      favorites: favoriteCount,
      tweetBody: tweetHTML,
      allTweetData: tweets[0]
    }
    res.send(fullData);
  });
});


app.get('/instagram', function(req, res) {
  var instaURL = 'https://api.instagram.com/v1/users/'+process.env.INSTA_USER+'/media/recent/?access_token='+process.env.INSTA_TOKEN;
  request(instaURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});

// app.get('/buckDownload', function(req, res){
//   console.log(req.body)

// //   var url = process.env.BUCK_URL;
// //   var download = function(url, cb) {
// //   var file = fs.createWriteStream("Buck.mp3");
// //   request(url, function(err, response, body) {
// //     response.pipe(file);
// //     file.on('finish', function() {
// //       file.close(cb);
// //     });
// //   });
// // }
// });

app.get("/taxRate", function(req, res) {
  var url = 'https://taxrates.api.avalara.com:443/postal?country='+req.query.country+'&postal='+req.query.postal+'&apikey='+process.env.TAX_KEY;
   request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});

app.get("/stripe/oneProduct", function(req, res){
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
  var thisOrder = req.query.order;
  var parsedOrder = JSON.parse(thisOrder);
  stripe.orders.create(parsedOrder, function(err, order) {
    if (order){
      res.send(order);
    }
    if (err){
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
  stripe.orders.pay(req.query.orderId, {
  source: req.query.token 
  }, function(err, order) {
    if (order){
      res.send(order);
    }
    if (err){
      res.send(err);
    }
  });
})


app.post("/stripe/taxCallback", function(req, res){
  console.log("ENTERING STRIPE CALLBACK!!!!!!!")
  var order = req.body.order;
  console.log(order.id);
  var orderId = order.id;
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
        "order_id": orderId,
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
  console.log(myJSON); 
  res.json(myJSON); 
});





app.get('/*', function(req, res) {
  console.log("GETTING SOMETHING FROM NODE SERVER!!!!!!!!!!!!!!");
  res.sendFile(path.join(__dirname, 'app/index.html'));
});






app.listen(process.env.PORT || 8080)
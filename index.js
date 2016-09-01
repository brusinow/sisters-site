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



app.post("/checkout", function(req, res) {
  req.session.currentOrder = req.body;
  console.log("what is currentOrder? ",req.session.currentOrder);
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

app.post("/cardToken", function(req, res) {
  console.log("req.query: ",req.query);
  req.session.token = req.query.token;
  req.session.priceTotal = req.query.total;
  res.send()  
});



 




app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'app/index.html'));
});






app.listen(process.env.PORT || 3000)
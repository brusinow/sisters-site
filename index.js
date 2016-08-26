var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
var stripe = require("stripe")(process.env.STRIPE_SECRET);


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'app')));




// Get the credit card details submitted by the form
 

// Create a charge: this will charge the user's card




app.get('/instagram', function(req, res) {
  var instaURL = 'https://api.instagram.com/v1/users/'+process.env.INSTA_USER+'/media/recent/?access_token='+process.env.INSTA_TOKEN;
  request(instaURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});


app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'app/index.html'));
});


// process.env.DBUSER
// '&callback=JSON_CALLBACK'




app.listen(process.env.PORT || 3000)
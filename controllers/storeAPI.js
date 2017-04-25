var express = require('express');
var firebase = require("firebase");
var shippo = require('shippo')(process.env.SHIPPO_TOKEN);
var stripe = require("stripe")(process.env.STRIPE_SECRET);
var admin = require("firebase-admin");
var path = require('path')
var EmailTemplate = require('email-templates').EmailTemplate
var nodemailer = require('nodemailer')
var wellknown = require('nodemailer-wellknown')
var async = require('async')
var session = require('express-session')


var serviceAccount = require("../sisters-site-test-creds.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://sisters-site-test.firebaseio.com"
// });

var db = admin.database();
// var lastOrderNumber;

// db.ref('orders').limitToLast(1).on("child_added", function(snapshot) {
//   lastOrderNumber = snapshot.key;
//   console.log("last order number? ",lastOrderNumber);
// });


var router = express.Router();



router.get("/order", function(req, res){
  if (req.session.order){
  var order = req.session.order;
  res.send(order);
  } else {
    res.send(null);
  }

});

router.get("/token", function(req, res){
  if (req.session.token){
  var token = req.session.token;
  console.log("token: ",token);
  res.send(token);
  } else {
    res.send(null);
  }

});



router.get("/shipment", function(req, res){
  if (req.session.shipment){
    var shipment = req.session.shipment;
    console.log("shipment data: ",shipment);
    res.send(shipment);
  } else {
    res.send(null);
  }
  
});








module.exports = router;
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



router.get("/ticket", function(req, res){
  console.log("running ticket route!!");
  var id = req.query.id
  db.ref('tickets/' + id).once("value", function(snapshot) {
  var ticket = snapshot.val();
  var ticketsLeft = parseInt(ticket.ticketCapacity) - parseInt(ticket.ticketsSold);
    var ticketData = {
      id: snapshot.key,
      description: ticket.description,
      images: ticket.images,
      tixAvailable: ticketsLeft > 0 ? true : false,
      title: ticket.title,
      subheader: ticket.subheader,
      skus: ticket.skus,
      unix: ticket.unix,
      product_type: ticket.product_type
    }
    if (ticketsLeft < 8){
      ticketData.tixAvailableCount = ticketsLeft;
    }
    res.send(ticketData);
  });
});


router.get("/shipment", function(req, res){
  if (req.session.shipment){
    var shipment = req.session.shipment;
    res.send(shipment);
  } else {
    res.send({});
  }
  
});








module.exports = router;
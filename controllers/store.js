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

var templatesDir = path.resolve(__dirname, '../app/templates')
var template = new EmailTemplate(path.join(templatesDir, 'receipt'))


// var serviceAccount = require("../sisters-site-creds.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://sisters-site.firebaseio.com"
// });

// var xoauth2 = require('xoauth2');
var router = express.Router();




var transport = nodemailer.createTransport({
     service: 'Gmail', // no need to set host or port etc.
     auth: {
       user: process.env.GMAIL_USER,
       pass: process.env.GMAIL_PASS
       }
});





router.post("/newOrder", function(req, res){
  var thisOrder = req.query.order;
  console.log("THIS ORDER!!!!!!! ",thisOrder);
  var parsedOrder = JSON.parse(thisOrder);

  var orderNumber = Math.random().toString(36).substr(2, 9);
  console.log("order number: ",orderNumber);
  console.log("req.query.shippable is ",req.query.shippable);
  


  
  if (req.query.shippable === true){
    
    var addressFrom = {
      "object_purpose": "PURCHASE",
      "name": "SISTERS",
      "street1": "7510 24th Ave NW",
      "city": "Seattle",
      "state": "WA",
      "zip": "98117",
      "country": "US",
      "email": "iheartsistersband@gmail.com"
    };

    var addressTo = {
      "object_purpose": "PURCHASE",
      "name": parsedOrder.shipping.name,
      'street1' : parsedOrder.shipping.address.line1,
      'street2' : parsedOrder.shipping.address.line2,
      'city' : parsedOrder.shipping.address.city,
      'state' : parsedOrder.shipping.address.country,
      'zip' : parsedOrder.shipping.address.postal_code,
      'country' : parsedOrder.shipping.address.country,
      'email' : parsedOrder.shipping.email
    }

    var parcel = {
      "length": "5",
      "width": "5",
      "height": "5",
      "distance_unit": "in",
      "weight": "32",
      "mass_unit": "oz"
    }

    shippo.shipment.create({
      'object_purpose' : 'PURCHASE',
      'address_from': addressFrom,
      'address_to': addressTo,
      'parcel': parcel,
      'async': false
    }, function(err, shipment){
    if (err){
      console.log("error: ",err);
    }
    if (shipment){
      res.send({
        shipment: shipment, 
        order: parsedOrder
      });
    }
    });

  } else {
    res.send({order: parsedOrder});
  }
  

  


  
        
})





router.post("/orderComplete", function(req, res){
  var data = req.query;
  console.log("what is order? ",data.order);
  var myOrder = JSON.parse(data.order);
  var myTax = JSON.parse(data.tax);
  console.log("what is willcall name? ",myOrder.willCallName);
  console.log("what is order number? ",myOrder.orderNumber);
  var cart = JSON.parse(data.cart);
  console.log(cart);
  // Initiate Stripe Charge Creation
  stripe.charges.create({
  amount: data.totalAmount,
  currency: "usd",
  source: data.token, // obtained with Stripe.js
  description: "Charge for " + data.name 
    }, function(err, charge) {
    if (err){
      // there is an error with Stripe charge
      console.log("we have an error: ",err);
      res.status(500).send(err);
    }
    if (charge){
      // Stripe charge was created successfully
    console.log(charge);
    res.send(charge); 

      var order = {
        email: myOrder.billing.email,
        subject: 'Thank you for your order! Order #' + myOrder.orderNumber,
        name: data.name,
        cart: cart,
        total: data.totalAmount,
        orderData: myOrder,
        charge: charge
      }

      generateEmailReceipt(order);



    }
  });
});


var generateEmailReceipt = function(order){
    template.render(order, function (err, results) {
  if (err) {
    return console.error(err)
  }

  transport.sendMail({
    from: 'SISTERS <iheartsistersband@gmail.com>',
    to: order.email,
    subject: order.subject,
    html: results.html,
    text: results.text,
    attachments: [{
        filename: 'logo.png',
        path: 'https://firebasestorage.googleapis.com/v0/b/sisters-site-test.appspot.com/o/images%2Fsisters-logo-header-bg.jpg?alt=media&token=3f43b8ee-37de-4dbf-9260-485e14ffc6c8',
        cid: 'unique@kreata.ee' //same cid value as in the html img src
    }]
  }, function (err, responseStatus) {
    if (err) {
      return console.error(err)
    }
    console.log(responseStatus.message)
  })
})
}



module.exports = router;
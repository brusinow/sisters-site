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


var templatesDir = path.resolve(__dirname, '../app/templates')
var template = new EmailTemplate(path.join(templatesDir, 'receipt'))


var serviceAccount = require("../sisters-site-test-creds.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sisters-site-test.firebaseio.com"
});

var db = admin.database();
var lastOrderNumber;

db.ref('orders').limitToLast(1).on("child_added", function(snapshot) {
  lastOrderNumber = snapshot.key;
  console.log("last order number? ",lastOrderNumber);
});


// var xoauth2 = require('xoauth2');
var router = express.Router();

var transport = nodemailer.createTransport({
     service: 'Gmail', // no need to set host or port etc.
     auth: {
       user: process.env.GMAIL_USER,
       pass: process.env.GMAIL_PASS
       }
});
// Generating the new order

router.post("/newOrder", function(req, res){
  console.log(req.query);
  var thisOrder = req.query.order;
  var parsedOrder = JSON.parse(thisOrder);
  var orderNumber = parseInt(lastOrderNumber) + 1;
  parsedOrder.orderNumber = orderNumber;
  req.session.order = parsedOrder;
  console.log("session data at new order: ",req.session);
  db.ref('orders/' + orderNumber).set(parsedOrder);

  
  if (req.query.shippable === true){
    var addressFrom  = {
    "object_purpose": "PURCHASE",
    "name": "SISTERS",
    "street1": "7510 24th Ave NW",
    "city": "Seattle",
    "state": "WA",
    "zip": "98117",
    "country": "US",
    "phone": "555 341 9393",
    "email": "iheartsistersband@gmail.com"
};

    var addressTo = {
      "object_purpose": "PURCHASE",
      "name": parsedOrder.shipping.name,
      'street1' : parsedOrder.shipping.address.line1,
      'street2' : parsedOrder.shipping.address.line2,
      'city' : parsedOrder.shipping.address.city,
      'state' : parsedOrder.shipping.address.state,
      'zip' : parsedOrder.shipping.address.postal_code,
      'country' : parsedOrder.shipping.address.country,
      'email' : parsedOrder.billing.email
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
      res.status(500).send({error: err});
    }
    if (shipment){
      req.session.shipment = shipment;
        req.session.save(function(err) {
          console.log("SESSION SAVED");
          res.status(200).send({shipBool: true});
        })
      
    }
    });

  } else {
      req.session.save(function(err) {
          res.status(200).send({shipBool: false});
      })
    
  }
  

  


  
        
})





router.post("/orderComplete", function(req, res){
  var data = req.query;
  var myOrder = JSON.parse(data.order);
  var myTax = JSON.parse(data.tax);
  var cart = JSON.parse(data.cart);
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
      var order = {
        email: myOrder.billing.email,
        subject: 'Thank you for your order! Order #' + myOrder.orderNumber,
        name: data.name,
        cart: cart,
        total: data.totalAmount,
        orderData: myOrder,
        charge: charge
      }
// Purchase the desired rate.
      if (data.shipChoice){
        var shippoInfo = JSON.parse(data.shipChoice)
        console.log("OBJECT ID????? ",shippoInfo.object_id);
        shippo.transaction.create({
        "rate": shippoInfo.object_id,
        "servicelevel_token": shippoInfo.servicelevel_token,
        "label_file_type": "PDF",
        "async": false
          }, function(err, transaction) {
          if (transaction){
            order.shipping = shippoInfo;
            order.shipping.res = transaction;
            var response = {
              "charge": charge,
              "transaction": transaction
            }
            res.status(200).send(response);
            generateEmailReceipt(order);
          }

          if (err){
            res.status(500).send(err);
          }
        });
      } else {
        var response = {
              "charge": charge
            }
        res.status(200).send(response);
        generateEmailReceipt(order);
      }
    }
  });
});


function generateEmailReceipt(order){
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
  })
})
}



function createOrderNumber(){
  var number = Math.floor(100000 + Math.random() * 1000000000); 
  var ref = db.ref('orders/order_' + number)
  ref.once("value", function(snap) {
  var thisVal = snap.val();
  if (thisVal.orderNumber){
    createOrderNumber();
  } else {
    return number;
  }
  });
}



module.exports = router;
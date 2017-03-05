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

var ticketTimeout;
var timerAmount = 60000;


function startTicketTO(val){
  ticketTimeout = setTimeout(function(){
    updateTicketCounts(val);
    val = {};
    console.log("tickets are now: ",val);
  }, timerAmount);
}

function stopTicketTO() {
    clearTimeout(ticketTimeout);
}

router.post("/newOrder", function(req, res){
  var thisOrder = req.query.order;
  var parsedOrder = JSON.parse(thisOrder);
  // parsedOrder.orderNumber = orderNumber;
  req.session.order = parsedOrder;
  // db.ref('orders/' + orderNumber).set(parsedOrder);

  
  if (req.query.shippable === 'true'){
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
      'street2' : parsedOrder.shipping.address.line2 || null,
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
      "weight": "7",
      "mass_unit": "oz"
    }

    shippo.shipment.create({
      'object_purpose' : 'PURCHASE',
      'address_from': addressFrom,
      'address_to': addressTo,
      'parcel': parcel,
      'async': false
    }, function(err, shipment){
      console.log("shippo response");
    if (err){
      console.log("error: ",err);
      res.status(500).send({error: "shit is fucking up"});
    }
    if (shipment){
      req.session.shipment = shipment;
      console.log("what is shipment object from Shippo? ",shipment);
        req.session.save(function(err) {
          res.status(200).send({shipBool: true});
        })
      
    } else {
      res.status(500).send({message: "There is no Shippo shipment object. Try again."})
    }
    });

  } else if (req.query.shippable === 'false') {
      req.session.save(function(err) {
          res.status(200).send({shipBool: false});
      })
    
  } else {
    res.status(500).send({message: "Didn't get into proper shippable status."})
  }
  
  
        
})


router.post("/saveToken", function(req, res){
  console.log("what is req query at saveToken? ",req.body);
  req.session.token = req.body.token;
  if (req.body.willCallName){
    req.session.order.willCallName = req.body.willCallName;
  }
  req.session.save(function(err) {
      console.log("error: ",err);
  })
  if (req.session.token){
    res.status(200).send("successful saving of token");
  } else {
    res.status(500).send("no token was saved to server");
  } 
})

router.post("/addSessionTicket", function(req, res){
  // process to remove quantity of tickets from inventory and set timer to restore them if not purchased in time
  console.log("what is req.body? ",req.body);
    db.ref('tickets/' + req.body.ticketId).once('value').then(function(snapshot) {
      var ticketObj = snapshot.val();
      console.log("ticket obj: ",ticketObj);
      var ticketsLeft = parseInt(ticketObj.ticketCapacity) - parseInt(ticketObj.ticketsSold)
      if (ticketsLeft >= req.body.ticketCount){
        //reserve the tickets and start timeout
        db.ref('tickets/' + req.body.ticketId + '/ticketsSold').set(parseInt(ticketObj.ticketsSold) + parseInt(req.body.ticketCount))
        if (!req.session.tickets){
        req.session.tickets = {};
        }
          req.session.tickets[req.body.ticketId] = req.body.ticketCount
          req.session.save(function(err) {
            console.log("error: ",err);
          })
          console.log("tickets in session: ",req.session.tickets);
          // set timeout here
          startTicketTO(req.session.tickets);
          res.status(200).send("success");;
      } else {
        // return error
        res.status(500).send("no tickets left");
      }
    });
})

router.post("/changeSessionTicket", function(req, res){
  // process to remove quantity of tickets from inventory and set timer to restore them if not purchased in time
    db.ref('tickets/' + req.body.ticketId).once('value').then(function(snapshot) {
      var ticketObj = snapshot.val();
      console.log("ticket obj: ",ticketObj);
      var ticketsLeft = parseInt(ticketObj.ticketCapacity) - parseInt(ticketObj.ticketsSold)
      if (ticketsLeft >= req.body.ticketCount){
        //reserve the tickets and start timeout
        db.ref('tickets/' + req.body.ticketId + '/ticketsSold').set(parseInt(ticketObj.ticketsSold) + parseInt(req.body.ticketCount))
          req.session.tickets[req.body.ticketId] += req.body.ticketCount;
          req.session.save(function(err) {
            console.log("error: ",err);
          })
          console.log("session tickets is now: ",req.session.tickets);
          stopTicketTO();
          startTicketTO(req.session.tickets);
          console.log("what are tickets? ",req.session.tickets);
          res.status(200).send("success");;
      } else {
        // return error
        res.status(500).send("can't make this change");
      }
    });
})




router.post("/orderComplete", function(req, res){
  var orderNumber;

  // get current order number
  db.ref('orders').limitToLast(1).on("child_added", function(snapshot) {
    orderNumber = parseInt(snapshot.key);
  });

  var data = req.query;
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
        email: req.session.billing.email,
        subject: 'Thank you for your order! Order #' + orderNumber,
        name: data.name,
        cart: cart,
        total: data.totalAmount,
        orderData: req.session.order,
        charge: charge
      }
// Purchase the desired rate.
      if (data.shipChoice){
        var shippoInfo = JSON.parse(data.shipChoice)
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
            // save order to db!
            var sessOrder = req.session.order;
            sessOrder.orderNumber = orderNumber;
            sessOrder.shipping.shippo = shippoInfo;
            sessOrder.shipping.res = transaction;
            sessOrder.totalItemsPrice = data.totalAmount;
            sessOrder.tax = myTax;
            var d = new Date();
            sessOrder.timeCompleted = d.getTime(),
            sessOrder.status = "COMPLETE"
            db.ref('orders/' + orderNumber).set(sessOrder);
            res.status(200).send(response);
            generateEmailReceipt(order);
            req.session.destroy();
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

function updateTicketCounts(obj){
  for (prop in obj){
    console.log(prop + ' is :',obj[prop]);
    var showCountRef = db.ref('tickets/' + prop + '/ticketsSold')
      showCountRef.once('value').then(function(snapshot) {
      showCountRef.set(snapshot.val() - obj[prop]);
    });
  }
}


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
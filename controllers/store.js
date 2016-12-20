var express = require('express');
var firebase = require("firebase");
var shippo = require('shippo')(process.env.SHIPPO_TOKEN);
var stripe = require("stripe")(process.env.STRIPE_SECRET);
var router = express.Router();

router.post("/newOrder", function(req, res){
  var thisOrder = req.query.order;
  console.log("THIS ORDER!!!!!!! ",thisOrder);
  var parsedOrder = JSON.parse(thisOrder);
  
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

  console.log(addressTo);

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
})


router.post("/orderComplete", function(req, res){
  var data = req.query;
  console.log("total amount: ",data.totalAmount);
  console.log("token id: ",data.token);
  stripe.charges.create({
  amount: data.totalAmount,
  currency: "usd",
  source: data.token, // obtained with Stripe.js
  description: "Charge for " + data.name 
}, function(err, charge) {
  if (err){
    console.log("we have an error: ",err);
  }
  if (charge){
   console.log(charge);
  res.send(charge); 
  }
});
})




module.exports = router;
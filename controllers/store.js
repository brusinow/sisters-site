var express = require('express');
var firebase = require("firebase");
var shippo = require('shippo')(process.env.SHIPPO_TOKEN);
var router = express.Router();

router.post("/newOrder", function(req, res){
  var thisOrder = req.query.order;
  var parsedOrder = JSON.parse(thisOrder);
  console.log("PARSED NAME!!!",parsedOrder.shipping.name);
  var db = firebase.database();
  var ref = db.ref("orders");
  ref.push(parsedOrder, function(error){
    if (error){
      res.send(error);
    } else {
        shippo.shipment.create({
          'object_purpose' : 'PURCHASE',
          'name' : parsedOrder.shipping.name,
          'street1' : parsedOrder.shipping.address.line1,
          'street2' : parsedOrder.shipping.address.line2,
          'city' : parsedOrder.shipping.address.city,
          'state' : parsedOrder.shipping.address.country,
          'zip' : parsedOrder.shipping.address.postal_code,
          'country' : parsedOrder.shipping.address.country,
          'email' : parsedOrder.email
    }).then(function(address){
      console.log("shipment : %s", JSON.stringify(address));
   
    });
         res.send(parsedOrder);
    }
  });
})

module.exports = router;
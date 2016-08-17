var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'app')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'app/index.html'));
});

app.listen(process.env.PORT || 3000)
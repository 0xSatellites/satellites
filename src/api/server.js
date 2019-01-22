
require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var hero = require('./routes/hero');  
var extension = require('./routes/extension');
var inventory = require('./routes/inventory');
var order = require('./routes/order');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', index);
app.use('/hero', hero);
app.use('/extension', extension);   
app.use('/inventory', inventory);
app.use('/order', order);  

var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
  });
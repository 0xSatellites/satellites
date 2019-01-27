require('dotenv').config()
const config = require('../config.json')

const express = require('express')
const bodyParser = require('body-parser')

const index = require('./routes/index')
const order = require('./routes/order')
const event = require('./routes/event')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use('/', index)
app.use('/order', order)
app.use('/event', event)

var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port)
})

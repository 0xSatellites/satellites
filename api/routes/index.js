var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.header('Content-Type', 'text/plain; charset=utf-8')
  res.send("This is api for mch market place");
});

module.exports = router;
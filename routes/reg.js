var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.post('/', function (req, res, next) {
    res.send(req.body);
});

module.exports = router;

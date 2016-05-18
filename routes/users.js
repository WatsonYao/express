var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

/* GET users listing. */
router.get('/', function (req, res, next) {

    var mongoose = require('../node_modules/mongoose');

    var db = mongoose.createConnection('localhost', 'test');

    var schema = mongoose.Schema({ name: 'string' });
    var User = db.model('User', schema);

    var kitty = new User({ name: 'watson' });
    kitty.save(function (err) {
        if (err) // ...
            res.end('meow');
    });


    User.find({'name':'watson'},function(err,docs){
        res.render('index', { title: docs});
    });

    res.send('respond with a resource');
});

module.exports = router;

var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

/* GET users listing. */
router.get('/', function (req, res, next) {

    var url = 'mongodb://localhost:27017/test';
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        //console.log("Connected correctly to server.");
        res.send('Connected correctly to server.');
        db.close();
    });

    res.send('respond with a resource');
});

module.exports = router;

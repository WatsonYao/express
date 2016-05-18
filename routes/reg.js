var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.post('/', function (req, res, next) {


    res.send(req);
    var name = req.body.name,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    //检验用户两次输入的密码是否一致

    if (req.body.name == null) {
        res.send('name == null');
    }

    if (req.body.password == null) {
        res.send('password == null');
    }

    if (req.body.email == null) {
        res.send('email == null');
    }

    if (password_re != password) {
        res.send('两次输入的密码不一致');
        //req.flash('error', '两次输入的密码不一致!');
        //return res.redirect('/reg');//返回注册页
    }
    //生成密码的 md5 值
    //var md5 = crypto.createHash('md5'),
    //    password = md5.update(req.body.password).digest('hex');

    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function (err, user) {
        if (err) {
            res.send('err');
            //req.flash('error', err);
            //return res.redirect('/');
        }
        if (user) {
            res.send('用户已存在');
            //req.flash('error', '用户已存在!');
            //return res.redirect('/reg');//返回注册页
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                res.send('注册失败返回主册页');
                //req.flash('error', err);
                //return res.redirect('/reg');//注册失败返回主册页
            }
            req.session.user = newUser;//用户信息存入 session

            res.send('注册成功后返回主页');
            //req.flash('success', '注册成功!');
            //res.redirect('/');//注册成功后返回主页
        });
    });
});

module.exports = router;

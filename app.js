var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var users = require('./routes/users');
var settings = require('./settings');
var flash = require('connect-flash');

var crypto = require('crypto')
var User = require('./models/user.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.post('/reg', function (req, res) {
    var name = req.body.name,
        password = req.body.password,
        email = req.body.email,
        password_re = req.body['password-repeat'];
    //检验用户两次输入的密码是否一致

    if (name == null) {
        res.send('name == null');
        return;
    }

    if (password == null) {
        res.send('password == null');
        return;
    }

    if (password_re == null) {
        res.send('password_re == null');
        return;
    }

    if (email == null) {
        res.send('email == null');
        return;
    }
    if (password_re != password) {
        //req.flash('error', '两次输入的密码不一致!');
        //return res.redirect('/reg');//返回注册页
        res.send('两次输入的密码不一致');
        return;
    }
    //生成密码的 md5 值
    var md5 = crypto.createHash('md5')
    var password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        password: password,
        email: req.body.email
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function (err, user) {
        if (err) {
            //req.flash('error', err);
            //return res.redirect('/');
            res.send('error' + err);
            return;
        }
        if (user) {
            //req.flash('error', '用户已存在!');
            //return res.redirect('/reg');//返回注册页
            res.send('用户已存在');
            return;
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                //req.flash('error', err);
                //return res.redirect('/reg');//注册失败返回主册页
                res.send('注册失败返回主册页');
                return;
            }
            //req.session.user = newUser;//用户信息存入 session
            //req.flash('success', '注册成功!');
            //res.redirect('/');//注册成功后返回主页
            res.send('注册成功后返回主页');
            return;
        });
    });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.use(session({
    secret: settings.cookieSecret,
    key: app,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port
    })
}));


module.exports = app;

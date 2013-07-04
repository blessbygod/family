#!/bin/env node

var Pusher = require( 'pusher' ),
    express = require('express'),
    main = require('./routes/main'),
    three = require('./routes/three'),
    http = require('http'),
    path = require('path'),
    child = require('child_process');

var app = express();
var config = require( __dirname + '/config.json' );

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "10.1.178.15";   //"127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'jade' );

//默认获取main.jade
app.get('/', main.info);
//ajax获取json
app.get('/config', main.config);
//获取自定义页面,three.info 里面有render的页面
app.get('/three', three.info);

app.listen(port, ipaddr, function() {
 console.log('listening on port ' + port);
});

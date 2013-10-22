#!/bin/env node

var express = require('express'),
    main = require('./routes/main'),
    three = require('./routes/three'),
    http = require('http'),
    path = require('path'),
    child = require('child_process');

var app = express();
var config = require( __dirname + '/config.json' );

//Get the environment variables we need.
var ipaddr  = '0.0.0.0';
var port    = 3000;

app.use(express.static(__dirname + '/public'));
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'jade' );

//默认获取main.jade
app.get('/', main.index);
app.get('/poker', main.info);
//ajax获取json
app.get('/config', main.config);
//获取自定义页面,three.info 里面有render的页面
app.get('/three', three.info);

app.listen(port, ipaddr, function() {
 console.log('listening on port ' + port);
});

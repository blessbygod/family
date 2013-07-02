#!/bin/env node

var Pusher = require( 'pusher' ),
    express = require('express'),
    main = require('./routes/main'),
    http = require('http'),
    path = require('path'),
    child = require('child_process');

var app = express();
var config = require( __dirname + '/config.json' );

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'jade' );

app.get('/', main.info);

app.listen( port, ipaddr, function() {
 console.log( 'listening on port ' + port );
} );

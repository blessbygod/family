
/*
 * GET home page.
 */
var _ = require('underscore');
var uuid = require('node-uuid');
var config = require('../config.js');

/*
 * table 
 * add timeline
 * */
exports.info = function(req, res){
  res.render('three', {
  });
};


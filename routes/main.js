
/*
 * GET home page.
 */
var _ = require('underscore');
var uuid = require('node-uuid');
var Table = require('../modules/Table.js').Table;
var filter = require('../modules/filter.js').filter;
var config = require('../config.js');

/*
 * table 
 * add timeline
 * */
exports.info = function(req, res){
  var pokers = new Table().pokers.splice(0,7);
  var _filter = new filter(pokers);
  res.render('main', {
        title: 'TexasPoker Online 2013',
        author:'senli',
        pokers : _filter.pokers,
        max_pokers : _filter.max_pokers
  });
};

exports.table = function(req, res){
  res.send( JSON.stringify(Table) );
};

exports.filter = function(req, res){
  var stime = new Date();
  //1000次测试的数据抛出
  var filters = [];
  var count = 1000;
  for(var i=0; i<count; i++){
    var pokers = new Table().pokers.splice(0,7);
    var _filter = new filter(pokers);
    filters.push(_filter);
  }
  //统计数据
  var pokertypes = _.countBy(filters,function(filter, index){
    return filter.max_pokers.type;
  });
  var etime = new Date();
  pokertypes.waste = ( etime - stime )/1000 + 's';
  console.log('扑克牌生成' + count + '所需时间:' + pokertypes.waste );
  res.send(pokertypes);

};

/*
 * log analysis chart and ajax data table;
 * */
exports.log = function(req, res){
  res.render('log', {
     title: 'log analysis tools',
     author: 'LiSen'
  });
};

exports.config = function(req ,res){
  var query = req.query;
  var name = query.name || 'logger';
  var type = query.type || 'json';
  res.send(config.get(name, type) );
};

/*
 * 从七张牌里面选择五张组成 最大的牌
 * 7*6*5*4*3 / 5*4*3*2   21种算法
 * 同花顺，4条，葫芦，同花，顺子，三张，两对，高牌
 * */

var Table = require('../modules/Table.js').Table;
var _ = require('underscore');
var compare = require('../modules/compare.js').compare;
var fast_select_max = require('../modules/fast_select_max.js').fast_select_max;

var recursion_combine = function(arr, num) {
  var r = [];
  (function(t, a, n) {
    if (n === 0) return r.push(t);
    for (var i = 0, l = a.length; i <= l - n; i++) {
      arguments.callee(t.concat(a[i]), a.slice(i + 1), n - 1);
    }
  })([], arr, num);
  return r;
};

//随即生成7张牌
var filter = function(pokers){
  //7选5的算法
 /* var suit_pokers = recursion_combine(pokers,5);
  suit_pokers.sort(function(a,b){
    return compare(a,b);
  });
  this.pokers = pokers;
  var max = suit_pokers.length - 1;
  this.max_pokers = suit_pokers[max];
*/
  //直接七选五的算法
  this.pokers = pokers;
  this.max_pokers = fast_select_max(pokers);

};

exports.filter = filter;





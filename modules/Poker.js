/*
 * Poker
 * */

var Class = require('../modules/core_Class.js').Class;
var config = require('../config.js');
var _ = require('underscore');

var poker_codes = config.get('poker.code','list');
var poker_pcodes = config.get('poker.pcode','list');//显示

//poker module
exports.Poker = Class.create({
  initialize:function(opts){
    var poker = this;
    if( typeof opts === 'number' && opts <= 13 ){
      opts = { code : opts };
      if(arguments.length === 2 && typeof arguments[1] === 'string'){
        opts.suit = arguments[1]; 
      }
    }else{
      opts || ( opts = {} );
    }
    this.code = opts.code || 1;//默认Ace
    this.suit = opts.suit || 'spade';//默认黑桃
    _.each( poker_codes,function(code, index){
      if( parseInt(code,10) === poker.code ){
          poker.pcode = poker_pcodes[index];
      }
    });
  }
});

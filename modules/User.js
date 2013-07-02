/*
 * 用户
 * */

var Class = require('../modules/core_Class.js').Class;

exports.User = Class.create({
  initialize:function(opts){
    opts || ( opts = {} );
    this.id = opts.id || 'user_' + uuid.v4();
    this.pokers = [];
  },
  showPoker:function(){
    return this.pokers;
  }
});

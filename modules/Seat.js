/*
 * 时间管理
 */
 var Class = require('../modules/core_Class.js').Class;
 var User = require('../modules/User.js').User;
 var _ = require('underscore');


var uuid = require('node-uuid');
 exports.Seat = Class.create({
   initialize:function(opts){
      opts || ( opts = {} );
      this.id = opts.id || 'seat_' + uuid.v1();
      this.user = null;
   },
   uniqUser:function(user){
     if( this.user !== null ){
      console.log('this seat in user:' + this.user.nickname);
     }else{
      this.user = new User();
     }
   }
 });

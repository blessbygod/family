/*
 * 时间管理
 */
 var Class = require('../modules/core_Class.js').Class;

 exports.Timeline = Class.create({
   initialize:function(opts){
      opts || ( opts = {} );
      this.start_date = new Date().toLocaleString();
      this.end_date = null;
   },
   getDate:function(){
      return new Date().toLocaleString();
   },
   getStartDate:function(){
      return this.start_date;
   },
   getEndDate:function(){
      return this.end_date;
   },
   setEndDate:function(date){
      if( this.end_date === null ){
        this.end_date = date;
      }
   }
 });

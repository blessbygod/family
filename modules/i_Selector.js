
var _ = require('underscore');

exports.getObjectByUUID = function(obj, uuid){
  return _.filter( objArr,function(obj){
      return obj.id === uuid;  
  }); 
}

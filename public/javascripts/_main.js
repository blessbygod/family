define(function(require){
  var Backbone = require('backbone'),
      bootstrap = require('bootstrap');
      //toggle_list query
  require('jquery.togglelist');  
  var from_list = [];
  for(var i=0;i<10000;i++){
    from_list.push({
        email: 'email_' + i + '@domain_' + i + '.com',
        id:'id_' + i
    });
  }
  $('#toggle_list_content').togglelist({
    from_list: from_list
  });
});

define(function(require){
  require('jquery.togglelist');  
  var from_list = [];
  var to_list = [];
  for(var i=0;i<800;i++){
    from_list.push({
        email: 'email_' + i + '@domain_' + i + '.com',
        id:'id_' + i,
        text: 'id_' + i + ' &lt;' + 'email_' + i + '@domain_' + i + '.com' + '&gt;'
    });
  }
  for(i=0;i<10;i++){
    to_list.push({
        email: 'email_' + i + '@domain_' + i + '.com',
        text: 'id_' + i + ' &lt;' + 'email_' + i + '@domain_' + i + '.com' + '&gt;',
        id:'id_' + i
    });
  }
  $('#toggle_list_content').togglelist({
    from_list: from_list,
    to_list : to_list
  });
});

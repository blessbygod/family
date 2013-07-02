seajs.config({
  plugins:["shim", "text"],
  alias:{
    "jquery": {
        src: "thirdparty/jquery-1.9.1.min.js", 
        exports: "$"
    },
    "jquery.pagination": {
        src: "plugins/jquery.pagination.js",
        deps: ["jquery","underscore"]
    },
    "jquery.togglelist": {
        src: "plugins/jquery.togglelist.js",
        deps: ["jquery","underscore","jquery.pagination"]
    },
    "underscore":{
        src: "thirdparty/underscore-min.js",
        exports: "_"
    },
    "backbone":{
        src: "thirdparty/backbone.js",
        deps: ["underscore"]
    },
    "bootstrap":{
        src: "thirdparty/bootstrap.min.js",
        deps: ["jquery"]
    },
    "highcharts":{
      src: "thirdparty/highcharts.js",
      deps: ["jquery"]
    }
  }
});

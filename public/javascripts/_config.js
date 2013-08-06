seajs.config({
  base: '.',
  plugins:["shim", "text"],
  alias:{
    "jquery": {
        src: "thirdparty/jquery-1.9.1.min.js", 
        exports: "$"
    },
    "underscore":{
        src: "thirdparty/underscore-1.5.1.js",
        exports: "_"
    },
    "backbone":{
        src: "thirdparty/backbone.js",
        deps: ["underscore"]
    },
    "jquery.pagination": {
        src: "plugins/jquery.pagination.js",
        deps: ["jquery","underscore"]
    },
    "jquery.togglelist": {
        src: "plugins/jquery.togglelist.js",
        deps: ["jquery","underscore","jquery.pagination"]
    }
  },
  preload: ["thirdparty/jquery-1.9.1.min.js", "thirdparty/underscore-1.5.1.js"]
});

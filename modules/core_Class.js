 
// refer : aralejs'  Class.js
 // date  : 2013-03-07 5:52
 // origin author : taobao 玉伯

 function Class(o){
  if( !(this instanceof Class) && isFunction(o))
    return classify(o)
 }
 
 exports.Class = Class;

 //create a new Class.
 
 Class.create = function(parent, properties){
  if( !isFunction(parent)){
    properties = parent
    parent = null
  }
  properties || ( properties = {} )
  parent || (parent = properties.Extends || Class )
  properties.Extends = parent;

  function SubClass(){
    parent.apply(this,arguments);
    
    if( this.constructor === SubClass && this.initialize ){
      this.initialize.apply(this, arguments)
    }
  }

  if( parent !== Class ){
    mix(SubClass, parent, parent.StaticsWhiteList)
  }

  implement.call(SubClass,properties)

  return classify( SubClass )

 }

 //Implement function
 
 function implement( properties ){
  var key,value
  
  for(key in properties ){
    value = properties[key]

    if(Class.Mutators.hasOwnProperty(key)){
      Class.Mutators[key].call(this, value)
    }else{
      this.prototype[key] = value;
    }
  }
 }

 Class.extend = function( properties ){
  properties || ( properties = {} )
  properties.Extends = this
  return Class.create(properties)
 } 

 function classify(cls){
  cls.extend = Class.extend
  cls.implement = implement
  return cls  
 }

 Class.Mutators = {
  
    "Extends":function(parent){
      var existed = this.prototype
      var proto = createProto( parent.prototype )

      //Keep existed properties
      mix( proto,existed )

      //enforce the constructor to be what we expect
      proto.constructor = this

      this.superclass = parent.prototype
      
      addMeta( proto )
    },
    "Implements":function(items){
      isArray(items) || ( items = [items] )
      var proto = this.prototype,item
      while( item = items.shift() ){
        mix(proto, item.prototype || item)
      }
    },
    "Statics":function(staticProperties){
      mix(this, staticProperties)
    }
 }

 //Shared empty constructor function to aid in prototype-chain creation
 function Ctor(){}

 //See:http://jsperf.com/object-create-VS-new-ctor
 var createProto = Object.__proto__?
    function(proto){
      return { __proto__ : proto }
    } :
    function(proto){
      Ctor.prototype = proto
      return new Ctor()
    }
 
 
 //Helpers
 //-------------------------------------
 function mix(r, s, wl){
  //Copy 'all' properties including inherited ones.
  for(var p in s){
    if(s.hasOwnProperty(p)){
      if(wl && indexOf(wl, p) === -1)continue
        //排除iPhone 1设备中的safari中的prototype属性
        if(p !== 'prototype'){
          r[p] = s[p]
        }
    }
  }  
}

var toString = Object.prototype.toString
var isArray = Array.isArray

if(!isArray){
  isArray = function(val){
    return toString.call(val) === '[object Array]'
  }
}
var isFunction = function(val){
  return toString.call(val) === '[object Function]'
}
var indexOf = Array.prototype.indexOf ?
  function(arr, item){
    arr.indexOf(item)
  } :
  function(arr, item){
    for(var i = 0, len = arr.length; i < len; i++){
      if(arr[i] === item){
        return i
      }
    }
    return -1
  }

  var getCompilingModule = module.constructor._getCompilingModule

  function addMeta(proto){
    if(!getCompilingModule){
     return
    }

    var compilingModule = getCompilingModule()
    if(!compilingModule){
      return
    }

    var filename = compilingModule.uri.split(/[\/\\]/).pop()

    if(Object.defineProperties){
      Object.defineProperties(proto,{
        __module:{
          value : compilingModule
        },
        __filename :{
          value : filename
        }
      })
    }else{
      proto.__module = compilingModule
      proto.__filename = filename
    }
  }

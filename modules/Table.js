/*
 * obj : table
 * implement : timeline
 * functional: init a new table 
 * attr : seats
 * contain_obj : user,poker
 * */

var Class = require('../modules/core_Class.js').Class;
var Timeline = require('../modules/Timeline.js').Timeline;
var Selector = require('../modules/i_Selector.js');
var Seat = require('../modules/Seat.js').Seat;
var Poker = require('../modules/Poker.js').Poker;

var uuid = require('node-uuid');
var _ = require('underscore');
var config = require('../config');
var poker_suit = config.get('poker.suit','list');

exports.Table = Class.create({
  Implements:Selector,
  initialize:function(opts){
    opts || ( opts = {} );
    this.id = opts.id || 'table_' + uuid.v1();
    this.width = opts.width || 800;
    this.height = opts.height || 600;
    this.MIN_WIDTH = 400;
    this.MIN_HEIGHT = 300;
    this.seat_count = opts.seat_count || 2;
    this.seats = this.initSeats(this.seat_count); 
    this.time_line = new Timeline();
    this.pokers =  this.disorderSuitPokers(this.initSuitPokers()) ;
  },
  resize:function(width,height){
  },
  min:function(){
    this.resize(this.MIN_WIDTH,this.MIN_HEIGHT);
  },
  close:function(){
    //设置时间线结束时间
    this.time_line.setEndDate( new Date().toLocaleString() );
  },
  initSuitPokers:function(){
    var pokers = [];
    for(i=1; i<=13; i++){
      for(var j=0; j<poker_suit.length; j++){
        pokers.push(new Poker(i,poker_suit[j]));
      }
    }
    return pokers;
  },
  initSeats:function(seat_count){
    var seats = [];
    for(var i=0; i<seat_count; i++){
     seats.push(new Seat());
    }
    return seats;
  },
  //洗牌
  disorderSuitPokers:function(pokers){
    //_.shuffle(pokers);
    //_.each(pokers,function(poker,index){
    for(var index = 0; index < 7; index++){
      var rd_index = Math.floor ( Math.random() * pokers.length );
      var cache = pokers[index];
      pokers[index] = pokers[rd_index];
      pokers[rd_index] = cache;
    }
    //});
    return pokers;
  },
  getSeatByUUID:function(uuid){
    var _seat = null;
    _.each( this.seats,function(seat){
      if(seat.id === uuid){
        _seat = seat;
      }
    });
    return _seat;
  },
  getUserByUUID:function(uuid){
    var _user = null;
    _.each( this.users,function(user){
      if(user.id === uuid){
        _user = user;
      }
    });
    return _user;
  }
});




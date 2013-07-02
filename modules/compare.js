
/*
 * 比较牌型大小
 * 同花顺，4条，葫芦，同花，顺子，三张，两对，对子，高牌
 */
var _ = require('underscore');
var config = require('../config.js');

var P_FLUSH_STRAIGHT = 8,
    P_QUAD = 7,
    P_FULL_HOUSE = 6,
    P_FLUSH = 5,
    P_STRAIGHT = 4,
    P_SET = 3,
    P_TWO_PAIR = 2,
    P_PAIR = 1,
    P_HIGH_CARD = 0;

var CN_POKER_TYPES = config.get('poker.cn_type','list');

var getPokersType = function(pokers){
  if(_.isArray(pokers) && pokers.length === 5){
    var temp_poker_type = 0;
    var same_suit_num = 1; 
    //相同花色的数目列表
    var suits = _.countBy(pokers,function(poker){
      return poker.suit;
    });
    //如果只有一种花色
    if(_.keys(suits).length === 1){
        temp_poker_type = P_FLUSH;
    }
    //计算扑克牌的数字
    var codes = _.countBy(pokers,function(poker){
       return poker.code;
    });
    //相同扑克牌数的数目列表
    var same_poker_max_count = 1;
    //求最大值
    same_poker_max_count = _.max(codes,function(code, key){
      return code;
    });
    var keys = _.map(codes,function(value,key){
      return parseInt(key, 10);
    }).sort(function(a,b){
      return a.length > b.length ? 1 : -1;
    });
    switch(_.keys(codes).length){
      case 2:
        //必然不同花的情况
        if( same_poker_max_count === 4){
          temp_poker_type = P_QUAD;//四条
        }else{
          temp_poker_type = P_FULL_HOUSE;//葫芦
        }
        break;
      case 3:
        if( same_poker_max_count === 3 ){
          temp_poker_type = P_SET;//三条
        }else{
          temp_poker_type = P_TWO_PAIR;//两对
        }
        break;
      case 4:
        temp_poker_type = P_PAIR;//对子
        break;
      case 5:
        //排序后相减为-4
        var reduce_number = keys[0] - keys[4];
        if(  reduce_number === -4 || reduce_number > 0 ){
          if( temp_poker_type === P_FLUSH ){
            temp_poker_type = P_FLUSH_STRAIGHT;
          }else{
            temp_poker_type = P_STRAIGHT;
          }
        }
    }
   pokers.type = CN_POKER_TYPES[temp_poker_type];
   return {
      ptype: temp_poker_type,
      keys : keys
    };
  }else{
    console.log('扑克张数不对!');
  }
  return null;
};

exports.compare = function(apokers, bpokers){
  var atype = getPokersType(apokers),
      btype = getPokersType(bpokers);
  var a_ptype = atype.ptype,
      b_ptype = btype.ptype;
  var a_keys = atype.keys,
      b_keys = btype.keys;
  if( a_ptype === b_ptype ){
    //最小值是否是A的情况
    //如果不是顺子的情况下，A替换成14,相加
    var new_a_keys = [],
        new_b_keys = [];
    var a_reduce = 1,
        b_reduce = 1;
    if( atype !== P_STRAIGHT || atype !== P_FLUSH_STRAIGHT ){
      _.each(a_keys,function(value, index){
         new_a_keys[index] = value == 1 ? 14 : value;
      });
      _.each(b_keys,function(value, index){
         new_b_keys[index] = value == 1 ? 14 : value;
      });
    }else{
     //如果排序后的第一张为A
     if(a_keys[0] == 1){
       //第二张为2
       if( a_keys[1] == 2){
          a_reduce = 0;
       }else{
         //第二张为10
          a_reduce = 999;
       }
     }
     if(b_keys[0] == 1){
       if( b_keys[1] == 2){
          b_reduce = 0;
       }else{
          b_reduce = 999;
       }
     }
    }
    //相邻两个元素两两相减，最后求和 
    if( a_reduce !== 0 || a_reduce != 999){
      a_reduce = _.reduce(new_a_keys,function(c,n){
        return c + n;
      });
    }
    if( b_reduce !== 0 || b_reduce != 999){
      b_reduce = _.reduce(new_b_keys,function(c,n){
        return c + n;
      });
    }
    return a_reduce > b_reduce ? 1 : -1;
  }else{
    return a_ptype > b_ptype ? 1 : -1;
  }
};


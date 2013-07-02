
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

//快排
exports.fast_select_max = function(pokers){
  //对七张牌排序
  var poker_type = 0;//默认高牌
  var max_pokers = [];//最大的牌型
  pokers.sort(function(a,b){
    return a.code > b.code;
  });
  //console.log(pokers);
  //花色的数目统计
  var suit_counts = _.countBy(pokers,function(poker){
    return poker.suit;
  });
  //console.log( '花色的数目统计' +  JSON.stringify(suit_counts));
  //最大的花色数目 
  var max_suit_count = _.max(suit_counts,function(count, suit){
    return count;
  });
  //console.log('最大的花色数：' +  max_suit_count);
  //code的数目统计
  var code_counts = _.countBy(pokers,function(poker){
    return poker.code;
  });
  //console.log('code的数目统计:' + JSON.stringify(code_counts));
  //最大的code数目
  var max_code_count = _.max(code_counts,function(count, code){
    return count;
  });
  //console.log('最大的code的数:' + max_code_count);
  //最小的code数目
  var min_code_count = _.min(code_counts,function(count, code){
    return count;
  });
  //console.log('最小的code的数:' + min_code_count);
  //算法开始
  if(max_suit_count >= 5){
    poker_type = P_FLUSH;//同花
  }
    //poker.keys
  var code_counts_keys = _.keys(code_counts);
  //console.log('code的keys：'+ code_counts_keys);
  var keys = code_counts_keys;
  var _one,_two,_three;
  switch(code_counts_keys.length){
    case 7:
      _one = keys[0] - keys[4],
      _two = keys[1] - keys[5],
      _three = keys[2] - keys[6];
      if(_one === -4  || _two === -4  || _three === -4  ){
        if(poker_type === P_FLUSH){
           poker_type = P_FLUSH_STRAIGHT;//同花顺
        }else{
           poker_type = P_STRAIGHT;//顺子
        }
      } 
      break;
    case 6:
      _one = keys[0] - keys[4],
      _two = keys[1] - keys[5];
      if( _one === -4 || _two === -4  ){
        if(poker_type === P_FLUSH){
           poker_type = P_FLUSH_STRAIGHT;//同花顺
        }else{
           poker_type = P_STRAIGHT;//顺子
        }
      }else{
        //2,1,1,1,1,1
        if(poker_type === 0){
          poker_type = P_PAIR;//对子
        }
      }
      break;
    case 5:
      _one = keys[0] - keys[4];
      if( _one === -4 || _one > 0 ){
        if(poker_type === P_FLUSH){
           poker_type = P_FLUSH_STRAIGHT;//同花顺
        }else{
           poker_type = P_STRAIGHT;//顺子
        }
      }else{
        if(poker_type === 0){
          if(max_code_count === 3){
            //3,1,1,1,1
            poker_type = P_SET;
          }else{
            //2,2,1,1,1
            poker_type = P_TWO_PAIR;//两对
          }
        }
      }
      break;
    case 4:
      //这里必然不用考虑同花和顺子的情况了
      //4,1,1,1
      if(max_code_count === 4){
        poker_type = P_QUAD;
      }else if(max_code_count === 3){
        //3,2,1,1
        poker_type = P_FULL_HOUSE;
      }else{
        //2,2,2,1
        poker_type = P_TWO_PAIR;//两对
      }
      break;
    case 3:
      //3,3,1   3,2,2
      poker_type = P_FULL_HOUSE;
      break;
    case 2:
      //4,3
      poker_type = P_QUAD;//四条
      break;
  }
  pokers.type = CN_POKER_TYPES[poker_type];
  //根据牌型取牌
  if(poker_type === P_FLUSH){

  }else if(poker_type === P_STRAIGHT) {
  
  }else{
  
  }
  //console.log('牌型:' + pokers.type );
  return pokers;
};



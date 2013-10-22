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

var selectFive = function(one, two, three, special, keys){
    var arr = [];
    var length = keys.length;
    if(special){
        arr.push(keys[0]);
        arr.push(keys[length-4]);
        arr.push(keys[length-3]);
        arr.push(keys[length-2]);
        arr.push(keys[length-1]);
    }else{
        if(three){
            arr.push(keys[length-5]);
            arr.push(keys[length-4]);
            arr.push(keys[length-3]);
            arr.push(keys[length-2]);
            arr.push(keys[length-1]);
        }else{
            if(two){
                arr.push(keys[length-6]);
                arr.push(keys[length-5]);
                arr.push(keys[length-4]);
                arr.push(keys[length-3]);
                arr.push(keys[length-2]);
            }else{
                if(one){
                    arr.push(keys[length-7]);
                    arr.push(keys[length-6]);
                    arr.push(keys[length-5]);
                    arr.push(keys[length-4]);
                    arr.push(keys[length-3]);
                }
            }
        }
    }
    return arr;
};

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
  console.log( '花色的数目统计' +  JSON.stringify(suit_counts));
  //最大的花色数目 
  var max_suit_count = _.max(suit_counts,function(count, suit){
    return count;
  });
  console.log('最大的花色数：' +  max_suit_count);
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
  //算法开始,这里算法有问题
  if(max_suit_count[0] >= 5){
     poker_type = P_FLUSH;//同花
     switch(max_suit_count){
     }
  }
  //poker.keys
  var code_counts_keys = _.keys(code_counts);
  //console.log('code的keys：'+ code_counts_keys);
  var keys = code_counts_keys;
  var _one = keys[0] - keys[4],
      _two = keys[1] - (keys[5] || 0),
      _three = keys[2] - (keys[6] || 0),
      _special; //考虑第一张牌为A，最后一张牌为K的情况，只用判断【7-4，6-3，5-2】为10的情况。
  var oneBoolean = _one === -4,
      twoBoolean = _two === -4,
      threeBoolean = _three === -4,
      specialBoolean = false;
      switch(code_counts_keys.length){
          case 7:
              _special = keys[0] - keys[3];
          specialBoolean = _special === -9;
          if(oneBoolean || twoBoolean || threeBoolean || specialBoolean){
              if(poker_type === P_FLUSH){
                 // poker_type = P_FLUSH_STRAIGHT;//这里应该什么都不做，还不能判定一定是同花顺，因为是七张牌
              }else{
                  poker_type = P_STRAIGHT;//顺子
              }
          } 
          break;
          case 6:
              _special = keys[0] - keys[2];
          specialBoolean = _special === -9;
          if(oneBoolean || twoBoolean || specialBoolean){
              if(poker_type === P_FLUSH){
                  //poker_type = P_FLUSH_STRAIGHT;//同花顺
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
              _special = keys[0] - keys[1];
          specialBoolean = _special === -9;
          if(oneBoolean || specialBoolean){
              if(poker_type === P_FLUSH){
                  //poker_type = P_FLUSH_STRAIGHT;//同花顺
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



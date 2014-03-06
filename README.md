Family
======
 包含作者个人的一些组件和项目，直观的可以看到待选-已选列表
 经过设置同样可以使用德州扑克online的一些可视化界面

toggleList
----------
待选-已选列表
  1、  每次面试都是一次学习的机会
  2、  14年3月2日， 对MVVM有了更多的认识！ 悲剧了，以后不清楚的绝对不说，尴尬!
    利用Object.defineProperty(object, key, {
            get: fn,
            set: fn
        });
    来实现数据改变或者获取的监控， 做到了M - V;
    propertychange DOM事件的监听，实现当DOM节点属性改变触发事件
    // FF 的HTMLElement.prototype.___definGetter__
    //MutationObserve
    完整的其实就是 M - V - M 的过程；
    V-M-V， 在搜索框输入数据，改变对应数据的值，触发view的rerender

    V-M， 界面上删除添加DOM结构，监听事件， 数据改变
    核心还是绑定这个字
    就是通过绑定事件监控和数据对象的get,set触发 事件

    可能有些概念或者场景模糊的地方
    后续使用多了添加例子

    IE, avalon用的VBScript来实现的MVVM
texaspoker online
-----------------
  1、目前 views/main.jade.backup 修改为main.jade，可以直接查看online目前的开发状况
  开发状况：
    1. 从七张牌中取五张牌中最大的组合，即皇家同花顺>同花顺>四条>葫芦>同花>顺子>两对>高对>高牌  的选择
    2. 有highlight图可以查看1000次各种成牌比例

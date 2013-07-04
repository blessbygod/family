/*
 * toggle list
 * 功能:
 * 1. 相互添加和移除
 * 2. 分页
 * 3. 分页保留状态
 * 4. 灵活配置，包括css和数据，后期做到UI分离.
 *
 * 依赖underscore和jquery
 * css 部分依赖bootstrap
 * */

(function($,_,undefined){
    $.fn.togglelist = function(options){
        //本插件容器组件
        var $container = $(this);
        var _container = this;
        this.timer = null;
        //默认参数
        var template = [
            '<div class="from_list_container">',
                '<div class="title">',
                    '<span><%= from_list_title %></span>',
                    '<i class="sort-query icon-download pull-right" data-sort="asc"></i>',
                '</div>',
                '<div class="search">',
                    '<input class="<%= search_input_class %>" placeholder="<%= search_text %>" />',
              //      '<button class="btn" type="submit"><%= search_text %></button>',
                '</div>',
                '<div class="list_container">',
                    '<ul class="from_list">',
                    '</ul>',
                '</div>',
                '<div class="pagination">',
                '</div>',
            '</div>',
            '<div class="action_area">',
                //'<i class="icon-chevron-left"></i>',
                //'<i class="icon-chevron-right"></i>',
            '</div>',
            '<div class="to_list_container">',
                '<div class="title">',
                    '<span><%= to_list_title %></span>',
                    '<i class="sort-query icon-download pull-right" data-sort="asc"></i>',
                '</div>',
                '<div class="search">',
                    '<input class="<%= search_input_class %>" placeholder="<%= search_text %>" />',
            //        '<button class="btn" type="submit"><%= search_text %></button>',
                '</div>',
                '<div class="list_container">',
                    '<ul class="to_list">',
                    '</ul>',
                '</div>',
                '<div class="pagination">',
                '</div>',
            '</div>'
        ].join('');
        //1.当前列表的分页
        var from_current_page = 1,
            to_current_page =1;
        //初始化插件
        this.initialize = function(){
            this.initConfig();
            this.initListStatusHash();
            this.render();
            this.bindEvents();
        };
        //配置初始化
        this.initConfig = function(){
            options = _.extend({
                from_list: [],
                to_list: [],
                itemId : 'id',
                itemText: 'email',
                status_text_1: '添加',
                status_text_2: '已添加',
                status_class_1: 'status_class_1',
                status_class_2: 'status_class_2',
                page_count : 8,       //每页的显示条数
                template: template,    //underscore-UI模板
                template_options:{
                    from_list_title: '待选列表',
                    to_list_title:'已选列表',
                    search_text: '搜索',
                    search_input_class: 'input-max search-query'
                },
                async: false,    //是否是ajax数据，是则是后端提供分页数据，否，前端自己维护 
                url:''           //请求后台数据的url
            },options);
        };
        //初始化列表item状态是否被添加,默认未添加状态
        this.initListStatusHash = function(){
            this.listStatusHash = {};
            this.toListStatusHash = {};
            _.each(options.from_list,function(list){
                list.statusText =  list.status === true ? options.status_text_2 : options.status_text_1;
                list.statusClass = list.status === true ? options.status_class_2 : options.status_class_1;
                var key = list[options.itemId];
                _container.listStatusHash[key] = list;
            });
            _.each(options.to_list,function(list){
                var key = list[options.itemId];
                _container.toListStatusHash[key] = list;
            });
        };
        //为分页做准备，可以用ajax代替该内容
        this.spliceListHashByCountAndPage = function(listHash, page){
            page = page || 1;
            var renderList = []; 
            if(_.isObject(listHash) === true){
                var start = (page-1) * options.page_count;
                var end = options.page_count * page;
                renderList = _.values(listHash).slice(start, end);
            } 
            return renderList;
        };
        //渲染容器
        this.render = function(){
            this.renderTemplate();
            var renderList = this.spliceListHashByCountAndPage(this.listStatusHash);
            this.renderList(this.$fromList, renderList);
            this.renderPagination(this.$fromPagination, this.listStatusHash);
            renderList = this.spliceListHashByCountAndPage(this.toListStatusHash);
            this.renderList(this.$toList, renderList, true);
            this.renderPagination(this.$toPagination, this.toListStatusHash, 1, true);
        };
        //渲染容器模板
        this.renderTemplate = function(){
            //定义分页状态hash,是否已经添加的
            if(options.template){
                var _html = _.template(options.template, options.template_options);
                $container.html(_html);
            }
            this.$fromContainer = $('.from_list_container');
            this.$toContainer = $('.to_list_container');
            this.$search = this.$fromContainer.find('.search-query');
            this.$toSearch = this.$toContainer.find('.search-query');
            this.$fromList = $('.from_list');
            this.$toList = $('.to_list');
            this.$fromPagination = this.$fromContainer.find('.pagination');
            this.$toPagination = this.$toContainer.find('.pagination');
        };
        //填充列表
        this.renderList = function($listContainer,list,isTo){
            $listContainer.children().remove();
            var _listTemplate = [
                '<% _.each(list,function(item){ %>',
                    '<li data-id="<%= item[itemId] %>">',
                        '<span><%= item[itemText] %></span>',
                        '<span class="status_action ', isTo ? 'icon-trash" style="margin-top:12px" >' : '<%= item.statusClass %>" >',
                            isTo ? '' : '<%= item.statusText %>',
                        '</span>',
                    '</li>',
                '<% }); %>'
            ].join('');
            var _html = _.template(_listTemplate,{
                list: list,
                itemText: options.itemText,
                itemId: options.itemId
            }); 
            $listContainer.html(_html);
        };
        //初始化分页
        this.renderPagination = function($pagination, list,current_page,isTo){
            var count = _.keys(list).length;
            $pagination.pagination({
                count: count,
                current: current_page || 1,
                page_count : options.page_count,
                callback: _.bind(this.selectChangeFunc,{
                    list: list,
                    isTo: isTo 
                })
            }); 
        };
        //绑定事件
        this.bindEvents = function(){
            this.$fromList.on('click','li span.status_action',_.bind(this.from2To,this));
            this.$toList.on('click','li span.status_action',_.bind(this.to2From,this));
            this.$fromPagination.on('change','select.pagination-select',this.selectChangeFunc);
            this.$toPagination.on('change','select.pagination-select',_.bind(this.selectChangeFunc,{
                isTo : true
            }));
            //绑定搜索的keyup事件
            this.$fromContainer.on('keyup','input.search-query',_.bind(this.filterListStatusHash,{
                list: this.listStatusHash,
                $list : this.$fromList
            }));
            this.$toContainer.on('keyup','input.search-query',_.bind(this.filterListStatusHash,{
                list: this.toListStatusHash,
                $list: this.$toList,
                isTo: true
            }));
            //绑定排序
            this.$fromContainer.on('click','i.sort-query',_.bind(this.sortListStatusHash,{
                $list : this.$fromList
            }));
            this.$toContainer.on('click','i.sort-query',_.bind(this.sortListStatusHash,{
                $list: this.$toList,
                isTo: true
            }));
        };
        this.selectChangeFunc = function(e){
            var $list = null;
            var current_page = 0,
                $select = null,
                list = {},
                $pagination = null;
            var keyword = this.isTo ? _container.$toSearch.val() : _container.$search.val();
            if(!this.isTo){
                $pagination = _container.$fromPagination;
                $select = $pagination.$select;
                current_page = parseInt($select.val(), 10);
                from_current_page = current_page;
                $list = _container.$fromList;
                list = _container.listStatusHash;
            }else{
                $pagination = _container.$toPagination;
                $select = $pagination.$select;
                current_page = parseInt($select.val(), 10);
                to_current_page = current_page;
                $list = _container.$toList;
                list = _container.toListStatusHash;
            }
            if(keyword !== ''){
               list = _container.searchListStatusHash;
            }
            var renderList = _container.spliceListHashByCountAndPage(list,current_page);
            _container.renderList($list, renderList,this.isTo);
            if(keyword !== ''){
                var _html = $list.html();
                _html = _container.highLightSearchKeyWord(_html, keyword);
                $list.html(_html);
            }
        };
        //同步item添加状态
        this.syncFromItemStatus = function(item, status){
            if(status !== true){
                item.status = false;
                item.statusClass = options.status_class_1;
                item.statusText = options.status_text_1;
            }else{
                item.status = true;
                item.statusClass = options.status_class_2;
                item.statusText = options.status_text_2;
            }
        };
        //事件集合
        this.from2To = function(e){
            var $action = $(e.currentTarget);
            var $li = $action.parent();
            var id  = $li.data('id');
            var item = this.listStatusHash[id];
            var status = item.status;
            //true为已添加，false为未添加
            if(status === true){
                this.syncFromItemStatus(item);
                $action.text(options.status_text_1);
                $action.removeClass('status_class_2').addClass('status_class_1');
                delete this.toListStatusHash[id]; 
            }else{
                this.syncFromItemStatus(item,true);
                $action.text(options.status_text_2);
                $action.removeClass('status_class_1').addClass('status_class_2');
                this.toListStatusHash[id] = item;
            }
            //渲染已选列表
            var renderList = this.spliceListHashByCountAndPage(this.toListStatusHash,to_current_page);
            this.renderList(this.$toList, renderList, true);
            this.renderPagination(this.$toPagination, this.toListStatusHash, to_current_page, true);
        };
        //删除已选到待选
        this.to2From = function(e){
            var $action = $(e.currentTarget);
            var $li = $action.parent();
            var id  = $li.data('id');
            var item = this.listStatusHash[id];
            delete this.toListStatusHash[id]; 
            $li.remove();
            //渲染待选已选列表
            var renderList = this.spliceListHashByCountAndPage(this.toListStatusHash,to_current_page);
            if(renderList.length === 0){
                to_current_page--;
                renderList = this.spliceListHashByCountAndPage(this.toListStatusHash,to_current_page);
            }
            this.renderList(this.$toList, renderList, true);
            this.renderPagination(this.$toPagination, this.toListStatusHash, to_current_page, true);
            //置待选列表状态为默认值
            this.syncFromItemStatus(item);
            renderList = this.spliceListHashByCountAndPage(this.listStatusHash,from_current_page);
            this.renderList(this.$fromList, renderList);
        };
        //高亮搜索匹配的字体
        this.highLightSearchKeyWord = function(source, keyword){
            var retVal = "";
            if(!keyword){
                return retVal;
            }
            //keyword = keyword.replace(/\s+/,' ');
            var keywordArr = keyword.split(' ');
            var regExps = '';
            _.each( keywordArr,function( key ){
                if( regExps ){
                    regExps += '|' + '(?!<[^>]*)(' + key + ')(?![^<]*>)';
                }else{
                    regExps += '(?!<[^>]*)(' + key + ')(?![^<]*>)';
                }
            });
            var reg = new RegExp( regExps,'ig' );
            retVal = source.replace(reg, function(key){
                return ('<strong class="keyword">' + key + '</strong>');
            });
            return retVal;
        };
        //搜索列表过滤的函数,keyup,并且是延迟执行
        this.filterListStatusHash = function(e){
            var $el = $(e.currentTarget);
            var self = this;
            var $pagination = null;
            if(this.isTo){
                $pagination = _container.$toPagination;
            }else{
                $pagination = _container.$fromPagination;
            }
            if(_container.timer){
                clearTimeout(_container.timer);
            }
            _container.timer = setTimeout(function(){
                var keyword = $el.val();
                if(keyword !== ""){
                    keyword = keyword.replace(/\s+/,' ');
                }else{
                    keyword = " ";
                }
                _container.searchListStatusHash = {};
                if(keyword != " "){
                    _.map(self.list,function(item, key){
                        var result = true;//包含多关键词,目前是交集，以后可以选择交并集
                        var text = item[options.itemText];
                        var keywordArr = keyword.split(' ');
                        _.each(keywordArr,function(keyword){
                            if(text.indexOf(keyword) === -1){
                                result = false;
                            } 
                        });
                        if(result){
                           _container. searchListStatusHash[key] = item;
                        }
                    });
                }else{
                    _container.searchListStatusHash = self.list;
                }
                $pagination.pagination({
                    count: _.keys(_container.searchListStatusHash).length,
                    page_count : options.page_count,
                    callback: _.bind(_container.selectChangeFunc,{
                        list: _container.searchListStatusHash,
                        isTo: self.isTo 
                    })
                }); 
                //渲染搜索列表
                var renderList = _container.spliceListHashByCountAndPage(_container.searchListStatusHash);
                _container.renderList(self.$list, renderList, self.isTo);
                //高亮列表
                if(keyword !== ' '){
                    var _html = self.$list.html();
                    _html = _container.highLightSearchKeyWord(_html, keyword);
                    self.$list.html(_html);
                }
            },800);
        };
        //排序列表方法
        this.sortListStatusHash = function(e){
            var $el = $(e.currentTarget);
            var self = this;
            var sort = $el.data('sort');
            var current_page = 1;
            var list = {};
            var keyword = this.isTo ? _container.$toSearch.val() : _container.$search.val();
            if(this.isTo){
                list = _container.toListStatusHash;
            }else{
                list = _container.listStatusHash;
            }
            if(keyword !== ''){
                list = _container.searchListStatusHash;
            }
            var sortListStatusHash = {},
                keys = [];
                keys = _.keys(list).sort(function(a,b){
                    var retcode = 1;
                    if(a.length > b.length){
                        retcode = 1;
                    }else if(a.length === b.length){
                        retcode = a >= b ? 1 : -1;
                    }else{
                        retcode = -1;
                    }
                    return retcode;
                });
            if(sort === 'asc'){
                $el.data('sort','desc');
                $el.addClass('icon-upload').removeClass('icon-download');
                keys = keys.reverse();
            }else{
                $el.data('sort','asc');
                $el.addClass('icon-download').removeClass('icon-upload');
            }
            _.each(keys,function(key){
                sortListStatusHash[key] = list[key];
            });
            if(keyword !== ''){
                _container.searchListStatusHash = sortListStatusHash;
            }else{
                if(this.isTo){
                    current_page = to_current_page;
                    _container.toListStatusHash = sortListStatusHash;
                }else{
                    current_page = from_current_page;
                    _container.listStatusHash = sortListStatusHash;
                }
            }
            var renderList = _container.spliceListHashByCountAndPage(sortListStatusHash, current_page);
            _container.renderList(this.$list, renderList, this.isTo);
            if(keyword !== ''){
                var _html = this.$list.html();
                _html = _container.highLightSearchKeyWord(_html, keyword);
                this.$list.html(_html);
            }
        };
        this.initialize();
        return this;
    };
}(window.jQuery,window._));

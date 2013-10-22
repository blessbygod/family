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
define("http://www.lichenfan.com:3000/javascripts/plugins/jquery.togglelist", [ "plugins/jquery.pagination" ], function(require) {
    require("plugins/jquery.pagination");
    $.fn.togglelist = function(options) {
        //本插件容器组件
        var $container = $(this);
        var _container = this;
        this.timer = null;
        //默认参数
        var template = [ '<div class="from_list_container">', '<div class="title">', "<span><%= from_list_title %></span>", "</div>", '<div class="search">', '<input class="<%= search_input_class %>" placeholder="<%= search_text %>" />', '<i class="sort-query icon-download pull-right" data-sort="asc"></i>', "</div>", '<div class="list_container">', '<ul class="from_list">', "</ul>", "</div>", '<div class="bottom">', '<div class="pagination">', "</div>", '<div class="toggle_all_page status_class_1">', "<%= add_all_page %>", "</div>", '<div class="toggle_current_page status_class_1">', "<%= add_current_page %>", "</div>", "</div>", "</div>", '<div class="action_area">', //'<i class="icon-chevron-left"></i>',
        //'<i class="icon-chevron-right"></i>',
        "</div>", '<div class="to_list_container">', '<div class="title">', "<span><%= to_list_title %></span>", "</div>", '<div class="search">', '<input class="<%= search_input_class %>" placeholder="<%= search_text %>" />', '<i class="sort-query icon-download pull-right" data-sort="asc"></i>', "</div>", '<div class="list_container">', '<ul class="to_list">', "</ul>", "</div>", '<div class="bottom">', '<div class="pagination">', "</div>", '<div class="delete_all_page status_class_1">', "<%= delete_all_page %>", "</div>", '<div class="delete_current_page status_class_1">', "<%= delete_current_page %>", "</div>", "</div>", "</div>" ].join("");
        //1.当前列表的分页
        var from_current_page = 1, to_current_page = 1;
        //初始化插件
        this.initialize = function() {
            this.initConfig();
            this.initListStatusHash();
            this.render();
            this.bindEvents();
        };
        //配置初始化
        this.initConfig = function() {
            this.options = options = _.extend({
                from_list: [],
                to_list: [],
                itemId: "id",
                itemText: "text",
                status_text_1: "添加",
                status_text_2: "已添加",
                status_class_1: "status_class_1",
                status_class_2: "status_class_2",
                page_count: 12,
                //每页的显示条数
                template: template,
                //underscore-UI模板
                delete_current_page: "删除本页",
                add_current_page: "添加本页",
                added_all_page: "已添加全部",
                added_current_page: "已添加本页",
                delete_all_page: "删除全部",
                add_all_page: "添加全部",
                from_list_title: "待选列表",
                to_list_title: "已选列表",
                search_text: "搜索",
                search_input_class: "search-query",
                //分页样式配置
                pagination: {
                    paginationULClass: "page_nav",
                    preAllClass: "pre-all",
                    preOneClass: "pre-one",
                    nextOneClass: "next-one",
                    nextAllClass: "next-all",
                    isSameDisabled: true,
                    disabledClassDashline: "_",
                    disabledClass: "disabled",
                    paginationTextArr: [ "<<", "<", ">", ">>" ],
                    paginationSelectContainerClass: "page_numa"
                }
            }, options);
        };
        //初始化列表item状态是否被添加,默认未添加状态
        this.initListStatusHash = function() {
            this.listStatusHash = {};
            this.toListStatusHash = {};
            this.searchListStatusHash = {};
            this.toSearchListStatusHash = {};
            _.each(options.from_list, function(list) {
                var key = list[options.itemId];
                _container.listStatusHash[key] = list;
            });
            _.each(options.to_list, function(list) {
                var key = list[options.itemId];
                _container.toListStatusHash[key] = list;
            });
            //更新待选列表的status状态，根据to_list
            _.each(_container.listStatusHash, function(list, key) {
                if (_container.toListStatusHash.hasOwnProperty(key)) {
                    list.status = true;
                }
                list.statusText = list.status === true ? options.status_text_2 : options.status_text_1;
                list.statusClass = list.status === true ? options.status_class_2 : options.status_class_1;
            });
        };
        //渲染容器
        this.render = function() {
            this.renderTemplate();
            this._renderList(false, true);
            //from组件初始化
            this._renderList(true, true);
        };
        //渲染容器模板
        this.renderTemplate = function() {
            //定义分页状态hash,是否已经添加的
            if (options.template) {
                var _html = _.template(options.template, options);
                $container.html(_html);
            }
            this.$fromContainer = $(".from_list_container");
            this.$toContainer = $(".to_list_container");
            this.$search = this.$fromContainer.find(".search-query");
            this.$toSearch = this.$toContainer.find(".search-query");
            this.$fromList = $(".from_list");
            this.$toList = $(".to_list");
            this.$fromPagination = this.$fromContainer.find(".pagination");
            this.$toPagination = this.$toContainer.find(".pagination");
            //添加全部，添加本页，删除全部，删除本页
            this.$toggleAll = this.$fromContainer.find(".toggle_all_page");
            this.$togglePage = this.$fromContainer.find(".toggle_current_page");
            this.$deleteAll = this.$toContainer.find(".delete_all_page");
            this.$deletePage = this.$toContainer.find(".delete_current_page");
        };
        //为分页做准备，可以用ajax代替该内容
        this.spliceListHashByCountAndPage = function(listHash, page) {
            page = page || 1;
            var renderList = [];
            if (_.isObject(listHash) === true) {
                var start = (page - 1) * options.page_count;
                var end = options.page_count * page;
                renderList = _.values(listHash).slice(start, end);
            }
            return renderList;
        };
        //填充列表
        this.renderList = function($listUL, list, isTo) {
            $listUL.children().remove();
            var _listTemplate = [ "<% _.each(list,function(item){ %>", '<li data-id="<%= item[itemId] %>">', isTo ? '<span title="<%= item[itemText] %>" class="word_break8"><%= context.highLightSearchKeyWord(item[itemText], context.dealWithKeyWord(isTo)) %></span>' : '<span title="<%= item[itemText] %>" class="word_break7"><%= context.highLightSearchKeyWord(item[itemText], context.dealWithKeyWord(isTo)) %></span>', '<span class="status_action ', isTo ? 'icon-trash" style="margin-top:12px" >' : '<%= item.statusClass %>" >', isTo ? "" : "<%= item.statusText %>", "</span>", "</li>", "<% }); %>" ].join("");
            var _html = _.template(_listTemplate, {
                isTo: isTo,
                context: this,
                list: list,
                itemText: options.itemText,
                itemId: options.itemId
            });
            $listUL.html(_html);
            if (options.callback) {
                options.callback(_container);
            }
        };
        //初始化分页
        this.renderPagination = function($pagination, list, current_page, isTo) {
            var count = _.keys(list).length;
            var paginationOptions = _.extend(options.pagination, {
                count: count,
                current: current_page || 1,
                page_count: options.page_count,
                callback: _.bind(this.selectChangeFunc, {
                    list: list,
                    isTo: isTo
                })
            });
            $pagination.pagination(paginationOptions);
        };
        this.dealWithKeyWord = function(isTo) {
            var keyword = isTo ? this.$toSearch.val() : this.$search.val();
            if (keyword) {
                keyword = $.trim(keyword);
                keyword = keyword.replace(/\s+/, " ");
            } else {
                keyword = " ";
            }
            return keyword;
        };
        //处理外域账号的问题
        this._specialRenderList = function($listContainer, list) {
            var $list = $listContainer.find(".out_list");
            var $pagination = $listContainer.$pagination;
            var $select = $pagination.$select;
            var cpage = $select ? parseInt($select.val(), 10) : 1;
            var renderList = _container.spliceListHashByCountAndPage(list, cpage);
            while (renderList.length === 0 && cpage > 0) {
                cpage--;
                renderList = _container.spliceListHashByCountAndPage(list, cpage);
            }
            $pagination.options.current = cpage;
            _container.renderList($list, renderList, true);
        };
        //处理渲染模板的类型[from,to(search,sort)],是否需要初始化分页
        this._renderList = function(isTo, initPagination, listStatusHash, isHighLight) {
            var $list = null, $pagination = null, list = {}, current_page = 1;
            if (isTo) {
                $list = this.$toList;
                $pagination = this.$toPagination;
                list = _container.toListStatusHash;
            } else {
                $list = this.$fromList;
                $pagination = this.$fromPagination;
                list = _container.listStatusHash;
            }
            $select = $pagination.$select;
            if ($select) {
                current_page = parseInt($select.val(), 10);
            }
            var keyword = this.dealWithKeyWord(isTo);
            if (keyword !== " ") {
                list = isTo ? this.toSearchListStatusHash : this.searchListStatusHash;
            }
            //如果listStatusHash有值,则使用该值
            if (_.isObject(listStatusHash) && _.keys(listStatusHash).length) {
                list = listStatusHash;
            }
            var renderList = this.spliceListHashByCountAndPage(list, current_page);
            while (renderList.length === 0 && current_page > 0) {
                current_page--;
                renderList = this.spliceListHashByCountAndPage(list, current_page);
            }
            this.renderList($list, renderList, isTo);
            //初始化特殊按钮状态【添加全部，添加本页等】
            if (isTo) {
                if (renderList.length) {
                    this.$deleteAll.removeClass("status_class_2").addClass("status_class_1");
                    this.$deletePage.removeClass("status_class_2").addClass("status_class_1");
                } else {
                    this.$deleteAll.removeClass("status_class_1").addClass("status_class_2");
                    this.$deletePage.removeClass("status_class_1").addClass("status_class_2");
                }
            } else {
                var initActionTextPage = false, initActionTextAll = false;
                _.each(renderList, function(item) {
                    if (item.status !== true) {
                        initActionTextPage = true;
                    }
                });
                //好浪费性能啊
                var _listStatusHash = keyword === " " ? _container.listStatusHash : _container.searchListStatusHash;
                for (var key in _listStatusHash) {
                    if (_listStatusHash.hasOwnProperty(key)) {
                        if (_listStatusHash[key].status !== true) {
                            initActionTextAll = true;
                            break;
                        }
                    }
                }
                if (initActionTextPage) {
                    this.$togglePage.text(options.add_current_page).removeClass("status_class_2").addClass("status_class_1");
                } else {
                    this.$togglePage.text(options.added_current_page).removeClass("status_class_1").addClass("status_class_2");
                }
                if (initActionTextAll) {
                    this.$toggleAll.text(options.add_all_page).removeClass("status_class_2").addClass("status_class_1");
                } else {
                    this.$toggleAll.text(options.added_all_page).removeClass("status_class_1").addClass("status_class_2");
                }
            }
            //是否初始化分页组件
            if ($select) {
                $pagination.options.current = current_page;
            }
            if (initPagination) {
                this.renderPagination($pagination, list, current_page, isTo);
            }
        };
        //绑定事件
        this.bindEvents = function() {
            this.$fromList.on("click", "li span.status_action", _.bind(this.from2To, this));
            this.$toList.on("click", "li span.status_action", _.bind(this.to2From, this));
            this.$fromPagination.on("change", "select.pagination-select", this.selectChangeFunc);
            this.$toPagination.on("change", "select.pagination-select", _.bind(this.selectChangeFunc, {
                isTo: true
            }));
            //绑定搜索的keyup事件
            this.$fromContainer.on("keyup", "input.search-query", _.bind(this.filterListStatusHash, {
                list: this.listStatusHash,
                $list: this.$fromList
            }));
            this.$toContainer.on("keyup", "input.search-query", _.bind(this.filterListStatusHash, {
                list: this.toListStatusHash,
                $list: this.$toList,
                isTo: true
            }));
            //绑定排序
            this.$fromContainer.on("click", "i.sort-query", _.bind(this.sortListStatusHash, {
                $list: this.$fromList
            }));
            this.$toContainer.on("click", "i.sort-query", _.bind(this.sortListStatusHash, {
                $list: this.$toList,
                isTo: true
            }));
            this.$toggleAll.click(_.bind(this.fromAll2To, _.extend({
                type: "all"
            }, this)));
            this.$togglePage.click(_.bind(this.fromAll2To, this));
            this.$deleteAll.click(_.bind(this.toAll2From, _.extend({
                type: "all"
            }, this)));
            this.$deletePage.click(_.bind(this.toAll2From, this));
        };
        this.selectChangeFunc = function(e) {
            _container._renderList(this.isTo, false, null, true);
        };
        //同步item添加状态
        this.syncFromItemStatus = function(item, status) {
            if (!item) {
                return;
            }
            if (status !== true) {
                item.status = false;
                item.statusClass = options.status_class_1;
                item.statusText = options.status_text_1;
            } else {
                item.status = true;
                item.statusClass = options.status_class_2;
                item.statusText = options.status_text_2;
            }
        };
        //单个from到to的动作
        this.fromItem2To = function(id, $item) {
            var item = this.listStatusHash[id];
            var status = item.status;
            //true为已添加，false为未添加
            if (status === true) {
                this.syncFromItemStatus(item);
                $item.text(options.status_text_1);
                $item.removeClass("status_class_2").addClass("status_class_1");
                delete this.toListStatusHash[id];
            } else {
                this.syncFromItemStatus(item, true);
                $item.text(options.status_text_2);
                $item.removeClass("status_class_1").addClass("status_class_2");
                this.toListStatusHash[id] = item;
            }
        };
        this.fromAll2To = function(e) {
            var $action = $(e.currentTarget);
            var text = $action.text();
            var add_page = "", added_page = "", list = null, toList = null;
            var current_page = parseInt(this.$fromPagination.$select.val(), 10);
            var keyword = this.dealWithKeyWord();
            list = keyword !== " " ? _container.searchListStatusHash : _container.listStatusHash;
            if (this.type === "all") {
                add_page = options.add_all_page;
                added_page = options.added_all_page;
            } else {
                add_page = options.add_current_page;
                added_page = options.added_current_page;
                list = this.spliceListHashByCountAndPage(list, current_page);
            }
            if (text === add_page) {
                _.each(list, function(item) {
                    _container.syncFromItemStatus(item, true);
                    _container.toListStatusHash[item[options.itemId]] = item;
                });
                $action.text(added_page);
                $action.removeClass("status_class_1").addClass("status_class_2");
            } else {
                _.each(list, function(item, key) {
                    _container.syncFromItemStatus(item);
                    delete _container.toListStatusHash[item[options.itemId]];
                });
                $action.text(add_page);
                $action.removeClass("status_class_2").addClass("status_class_1");
            }
            _container._renderList(true, true, null, true);
            _container._renderList(false, false, null, true);
        };
        //事件集合
        this.from2To = function(e) {
            var $action = $(e.currentTarget);
            var $li = $action.parent();
            var id = $li.data("id");
            this.fromItem2To(id, $action);
            //渲染已选列表
            _container._renderList(true, true, null, true);
            _container._renderList(false, false, null, true);
        };
        this.toAll2From = function(e) {
            var $action = $(e.currentTarget);
            if ($action.hasClass("status_class_2")) {
                return;
            }
            var current_page = parseInt(this.$toPagination.$select.val(), 10);
            if (this.type === "all") {
                _container.toListStatusHash = {};
                _container.toSearchListStatusHash = {};
                _.each(_container.listStatusHash, function(item, key) {
                    _container.syncFromItemStatus(item);
                });
                _.each(_container.searchStatusHash, function(item, key) {
                    _container.syncFromItemStatus(item);
                });
            } else {
                this.$toList.find("li").each(function() {
                    var $li = $(this);
                    var id = $li.data("id");
                    var item = _container.listStatusHash[id];
                    var sItem = _container.searchListStatusHash[id];
                    delete _container.toListStatusHash[id];
                    delete _container.toSearchListStatusHash[id];
                    //置待选列表状态为默认值
                    _container.syncFromItemStatus(item);
                    _container.syncFromItemStatus(sItem);
                });
            }
            _container._renderList(true, true, null, true);
            _container._renderList(false, false, null, true);
        };
        //删除已选到待选
        this.to2From = function(e) {
            var $action = $(e.currentTarget);
            var $li = $action.parent();
            var id = $li.data("id");
            var item = this.listStatusHash[id];
            var sItem = this.searchListStatusHash[id];
            delete this.toListStatusHash[id];
            delete this.toSearchListStatusHash[id];
            //置待选列表状态为默认值
            this.syncFromItemStatus(item);
            this.syncFromItemStatus(sItem);
            //渲染待选已选列表
            _container._renderList(true, true, null, true);
            _container._renderList(false, false, null, true);
        };
        //高亮搜索匹配的字体
        this.highLightSearchKeyWord = function(source, keyword) {
            var retVal = "";
            if (keyword === " ") {
                retVal = source;
                return retVal;
            }
            var keywordArr = keyword.split(" ");
            var regExps = "";
            _.each(keywordArr, function(key) {
                if (regExps) {
                    regExps += "|" + "(?!<[^>]*)(" + key + ")(?![^<]*>)";
                } else {
                    regExps += "(?!<[^>]*)(" + key + ")(?![^<]*>)";
                }
            });
            var reg = new RegExp(regExps, "ig");
            retVal = source.replace(reg, function(key) {
                return '<strong class="keyword">' + key + "</strong>";
            });
            return retVal;
        };
        //搜索列表过滤的函数,keyup,并且是延迟执行
        this.filterListStatusHash = function(e) {
            var $el = $(e.currentTarget);
            var self = this;
            var searchListStatusHash = {};
            if (_container.timer) {
                clearTimeout(_container.timer);
            }
            _container.timer = setTimeout(function() {
                var keyword = $el.val();
                if (keyword) {
                    keyword = keyword.replace(/\s+/, " ");
                } else {
                    keyword = " ";
                }
                if (keyword != " ") {
                    _.map(self.list, function(item, key) {
                        var result = true;
                        //包含多关键词,目前是交集，以后可以选择交并集
                        var text = item[options.itemText];
                        var keywordArr = keyword.split(" ");
                        _.each(keywordArr, function(keyword) {
                            if (text.indexOf(keyword) === -1) {
                                result = false;
                            }
                        });
                        if (result) {
                            searchListStatusHash[key] = item;
                        }
                    });
                    if (self.isTo) {
                        _container.toSearchListStatusHash = searchListStatusHash;
                    } else {
                        _container.searchListStatusHash = searchListStatusHash;
                    }
                } else {
                    if (self.isTo) {
                        _container.toSearchListStatusHash = self.list;
                    } else {
                        _container.searchListStatusHash = self.list;
                    }
                }
                _container._renderList(self.isTo, true, searchListStatusHash, true);
            }, 800);
        };
        //排序列表方法
        this.sortListStatusHash = function(e) {
            var $el = $(e.currentTarget);
            var self = this;
            var sort = $el.data("sort");
            var current_page = 1;
            var list = {};
            var keyword = _container.dealWithKeyWord();
            if (this.isTo) {
                if (keyword !== " ") {
                    list = _container.toSearchListStatusHash;
                } else {
                    list = _container.toListStatusHash;
                }
            } else {
                if (keyword !== " ") {
                    list = _container.searchListStatusHash;
                } else {
                    list = _container.listStatusHash;
                }
            }
            var sortListStatusHash = {}, keys = [];
            keys = _.keys(list).sort(function(a, b) {
                var retcode = 1;
                if (a.length > b.length) {
                    retcode = 1;
                } else if (a.length === b.length) {
                    retcode = a >= b ? 1 : -1;
                } else {
                    retcode = -1;
                }
                return retcode;
            });
            if (sort === "asc") {
                $el.data("sort", "desc");
                $el.addClass("icon-upload").removeClass("icon-download");
                keys = keys.reverse();
            } else {
                $el.data("sort", "asc");
                $el.addClass("icon-download").removeClass("icon-upload");
            }
            _.each(keys, function(key) {
                sortListStatusHash[key] = list[key];
            });
            if (this.isTo) {
                if (keyword === " ") {
                    _container.toListStatusHash = sortListStatusHash;
                } else {
                    _container.toSearchListStatusHash = sortListStatusHash;
                }
            } else {
                if (keyword === " ") {
                    _container.listStatusHash = sortListStatusHash;
                } else {
                    _container.searchListStatusHash = sortListStatusHash;
                }
            }
            _container._renderList(this.isTo, false, sortListStatusHash, true);
        };
        this.initialize();
        return this;
    };
});
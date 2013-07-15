/*
 * pagination plugins:
 * 
 * 1. 灵活定制分页，UI,CSS,ACTION 分离
 * 2. 目前支持给定容器填充
 * */

(function($,_,undefined){
    $.fn.pagination = function(options){
        var $container = $(this);
        var _container = this;
        //初始化参数
        var template = [
            '<ul class="<%= paginationULClass %>">',
                '<li class="<%= preAllClass %>">',
                    '<a href="javascript:;"><%= _.isArray(paginationTextArr) ? paginationTextArr[0] : "" %></a>',
                '</li>',
                '<li class="<%= preOneClass %>">',
                    '<a href="javascript:;"><%= _.isArray(paginationTextArr) ? paginationTextArr[1] : "" %></a>',
                '</li>',
                '<li class="<%= paginationSelectContainerClass %>">',
                    '<select class="pagination-select span1" value="<%= current %>">',
                        '<% for(var i=1; i <= pages; i++){ %>',
                                '<option value="<%= i %>"><%= i %></option>',
                        '<% } %>',
                    '</select>',
                '</li>',
                '<li class="<%= nextOneClass %>">',
                    '<a href="javascript:;"><%= _.isArray(paginationTextArr) ? paginationTextArr[2] : "" %></a>',
                '</li>',
                '<li class="<%= nextAllClass %>">',
                    '<a href="javascript:;"><%= _.isArray(paginationTextArr) ? paginationTextArr[3] : "" %></a>',
                '</li>',
            '</ul>'
        ].join('');
        //初始化配置
        this.initConfig = function(){
            options = _.extend({
                count: 0,
                current: 1,
                page_count: 8,
                layout: 'center',
                paginationTextArr: ["<<","<",">",">>"],
                paginationULClass: 'page_nav',
                preAllClass: 'pre-all',
                preOneClass: 'pre-one',
                nextOneClass: 'next-one',
                nextAllClass: 'next-all',
                isSameDisabled: true,
                disabledClassDashline: '_', 
                disabledClass: 'disabled',
                paginationSelectContainerClass: 'page_numa',
                template: template,
                callback: function(){}
            },options);
            this.options = options;
        };
        this.initialize = function(){
            this.initConfig();
            this.render();
        };
        this.render = function(){
            if(_.isNumber(options.count)){
                options.pages = Math.ceil(options.count / options.page_count) || 1;
                var _html = _.template(options.template,_.extend(options,{
                    pages: options.pages,
                    current: options.current
                }));
                $container.html(_html);
                this.$select = $container.find('.pagination-select');
                this.$select.val(options.current);
                this.renderActionStatus();
                this.bindEvents();
            }
        };
        this.renderActionStatus = function(){
            options.pages = Math.ceil(options.count / options.page_count);
            var current_page = parseInt(this.$select.val(), 10);
            var disabledClass = options.disabledClass;
            var preAllDisabledClass = options.isSameDisabled ? disabledClass : options.preAllClass + options.disabledClassDashline + disabledClass;
            var preOneDisabledClass = options.isSameDisabled ? disabledClass : options.preOneClass + options.disabledClassDashline + disabledClass;
            var nextOneDisabledClass = options.isSameDisabled ? disabledClass : options.nextOneClass + options.disabledClassDashline  + disabledClass;
            var nextAllDisabledClass = options.isSameDisabled ? disabledClass : options.nextAllClass + options.disabledClassDashline + disabledClass;
            if(current_page === 1){
                $container.find('.' + options.preAllClass).addClass(preAllDisabledClass);
                $container.find('.' + options.preOneClass).addClass(preOneDisabledClass);
            }else{
                $container.find('.' + options.preAllClass).removeClass(preAllDisabledClass);
                $container.find('.' + options.preOneClass).removeClass(preOneDisabledClass);
            }
            if(current_page >= options.pages){
                $container.find('.' + options.nextAllClass).addClass(nextAllDisabledClass);
                $container.find('.' + options.nextOneClass).addClass(nextOneDisabledClass);
            }else{
                $container.find('.' + options.nextAllClass).removeClass(nextAllDisabledClass);
                $container.find('.' + options.nextOneClass).removeClass(nextOneDisabledClass);
            }
        };
        this.bindEvents = function(){
            $container.off('click');
            this.$select.off('change');
            this.$select.on('change',function(){
                _container.renderActionStatus();
            });
            var clickClasses = [
                '.' + options.preOneClass,
                '.' + options.preAllClass,
                '.' + options.nextOneClass,
                '.' + options.nextAllClass
            ].join();
            $container.on('click', clickClasses, function(e){
                var $el = $(e.currentTarget);
                if($el.attr('class').indexOf(options.disabledClass) > -1){
                    return;
                }
                if($el.hasClass(options.preOneClass)){
                    if(options.current === 1){
                        return;
                    }else{
                        options.current = options.current - 1;
                    }
                }else if($el.hasClass(options.nextOneClass)){
                    if(options.current === options.pages){
                        return;
                    }else{
                        options.current = options.current + 1;
                    }
                }else if($el.hasClass(options.preAllClass)){
                    options.current = 1;
                }else if($el.hasClass(options.nextAllClass)){
                    options.current = options.pages;
                }
                _container.$select.val(options.current);
                _container.renderActionStatus();  
                if(options.callback){
                    options.callback();
                }
            });
        };
        this.initialize();
        return this;
    };
})(window.jQuery,window._);

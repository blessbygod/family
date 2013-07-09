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
            '<ul class="pull-right">',
                '<li class="pre-all">',
                    '<a href="javascript:;">«</a>',
                '</li>',
                '<li class="pre-one">',
                    '<a href="javascript:;">←</a>',
                '</li>',
                '<li>',
                    '<select class="pagination-select span1" value="<%= current %>">',
                        '<% for(var i=1; i <= pages; i++){ %>',
                                '<option value="<%= i %>"><%= i %></option>',
                        '<% } %>',
                    '</select>',
                '</li>',
                '<li class="next-one">',
                    '<a href="javascript:;">→</a>',
                '</li>',
                '<li class="next-all">',
                    '<a href="javascript:;">»</a>',
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
                var _html = _.template(options.template,{
                    pages: options.pages,
                    current: options.current
                });
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
            if(current_page === 1){
                $container.find('.pre-all,.pre-one').addClass('disabled');
            }else{
                $container.find('.pre-all,.pre-one').removeClass('disabled');
            }

            if(current_page === options.pages){
                $container.find('.next-all,.next-one').addClass('disabled'); 
            }else{
                $container.find('.next-all,.next-one').removeClass('disabled'); 
            }
        };
        this.bindEvents = function(){
            this.$select.change(function(){
                _container.renderActionStatus();
            });
            $container.off('click');
            $container.on('click','.pre-one,.pre-all,.next-one,.next-all',function(e){
                var $el = $(e.currentTarget);
                if($el.hasClass('disabled')){
                    return;
                }
                if($el.hasClass('pre-one')){
                    if(options.current === 1){
                        return;
                    }else{
                        options.current = options.current - 1;
                    }
                }else if($el.hasClass('next-one')){
                    if(options.current === options.pages){
                        return;
                    }else{
                        options.current = options.current + 1;
                    }
                }else if($el.hasClass('pre-all')){
                    options.current = 1;
                }else{
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

/**
 * 翻页组件
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-25 12:44:55
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		Clone = require('risk/unit/class').clone;

	var MOD = {
		_DEFAULT_CONFIG:{
			configKey:'___CONFIG___',	//存储配置的key
			setting:{	//默认配置
				currentClass:'active'
				//,container:'div'	//放置翻页HTML的容器
				//,total:10	//总共的页数
				//,current:1 //当前页
				//,request:function(){} //翻页时请求数据的函数，必须返回$.Deferred对象
			}
		},
		/** 初始化翻页组件
		 * @param  setting {Object}
		 * @return 返回当前pager对象
		 */
		init:function (setting) {
			var initKey = this._DEFAULT_CONFIG.configKey,
				obj=this;
			if(!this[initKey]) {
				obj = Clone(MOD);
				obj[initKey] = true;
				return obj.init.apply(obj,arguments);
			}

			var conf = this._initConfig(setting),
				container = this.container = $(conf.container),
				pager = this.pager = $(this._getHTML(conf.current,conf.total));

			container.html(pager);

			this._initEvent();

			return this;
		},
		_getHTML:function(current,total) {
			var conf = this._config(),
				html = [];
			var i=1, l = total;
			for(; i <= l; ++i) {
				html.push('<li '+(i==current?'class="'+conf.currentClass+'"':'')+'><a href="#" data-page="'+i+'">'+i+'</a></li>');
			}

			html = '<ul class="pagination j-pager">'+html.join('')+'</ul>';

			return html;
		},
		/** 初始化事件绑定
		 */
		_initEvent:function() {
			var conf = this._config(),
				pager = this.pager,
				that = this;

			pager.on('click','a[data-page]',function(ev) {
				ev.preventDefault();
				var elem = $(ev.currentTarget),
					sn = elem.data('page');
				that._turn(sn,elem);
			});
		},
		/** 翻到指定页数
		 * @param num {Number} 指定的页数
		 */
		_turn:function(num,elem) {
			var conf = this._config(),
				that = this;
			conf.request(num).done(function() {
				var currentClass = conf.currentClass;

				that.container.find('.'+currentClass).removeClass(currentClass);
				elem.parent().addClass(currentClass);
			}).fail(function() {

			});
		},
		/** 初始化配置 */
		_initConfig:function (setting) {
			var def = this._DEFAULT_CONFIG.setting,
				key = this._DEFAULT_CONFIG.configKey,
				conf;
			conf = this[key] = $.extend({},def,setting);

			return this[key];
		},
		/** 读、写配置
		 * @param
		 */
		_config:function (key,value) {
			var ckey = this._DEFAULT_CONFIG.configKey;
			var rs;
			var store = this[ckey],
				argLen = arguments.length;
			if(argLen>=2) {	//set
				store[key] = value;
				rs = store;
			}else if(argLen==1) {	//get
				rs = store[key];
			}else {	//不传参返回全部
				rs = store;
			}
			return rs;
		}
	};

	return MOD;
});
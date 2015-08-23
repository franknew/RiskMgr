/**
 * 事件型显示loading
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-01 21:35:17
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		clone = require('./class').clone;

	var MOD = {
		_DEFAULT_CONFIG:{
			configKey:'___CONFIG___',	//存储配置的key
			setting:{	//默认配置
			}
		},
		show:function() {
			var initKey = this._DEFAULT_CONFIG.configKey,
				obj=this;
			if(!this[initKey]) {
				obj = clone(MOD);
				obj[initKey] = true;
				return obj.show.apply(obj,arguments);
			}

			var ev = this._getEvent();	//还不能获取到真实的delegate元素。。。待改进

			if (!ev || $.inArray(ev.type, ['load'])!==-1) {//不支持的事件
				return this;
			}

			var elemOri = ev.currentTarget,
				elem = $(elemOri),
				elemTag = (elemOri.tagName||'').toLowerCase(),
				box,
				isGlobal = !!(!elemOri.nodeType || $.inArray(elemOri.nodeType, [1,9]) || $.inArray(elemTag, ['script','html','body']) !== -1);

			var offset,
				width,
				height,
				parent;

			if (isGlobal) {//需显示全局loading条
				offset = {bottom:1,left:6};
				width = 16;
				height = 11;
				parent = 'body';
			}else {
				offset = elem.position();
				width = elem.outerWidth(true);
				height = elem.outerHeight(true);
				parent = elem.parent();
			}

			box = $('<div class="loading-tip"></div>');
			box.css({
				width:width,
				height:height,
				position:'absolute',
				top:offset.top,
				left:offset.left,
				bottom:offset.bottom,
				zIndex:'1050'
			});
			if (!isGlobal) {
				box.css('backgroundColor','rgba(255,255,255,0.5)');
			}
			box.appendTo(parent);

			this.box = box;

			return this;
		},
		hide:function() {
			var elem = this.box;
			if (elem) {
				elem.remove();
			}

			return this;
		},
		_getEvent:function() {
			var ev = $.event.fix(window.event);

			return ev;
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
/**
 * 
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-08 22:12:16
 * @version $Id$
 */
define(function(require, exports, module) {
	var $ = require('jquery');

	var _CONFIG = {	//初始配置
			//loading:'<h3 class="text-center">Loading...</h3>',
			'404':'没有找到该页面'
		},
		_CURRENT = '';	//当前所在模块

	var MOD = {
		/** 初始化
		 * @param conf {Object} 配置项
		 *		filter: {Function} 通过url获取模块标识的函数，必须要return一个模块标识，示例：
		 				function(url){
							var rs = 'path/home';
							retrun rs;
		 				}
		 *		[container]: {String|DOM} 主容器
		 *		[index]: {String} 默认的模块,没有模块标识时加载该默认模块
		 *		[bind]: {String} jQuery选择器，如果配置，则会给对应元素绑定点击事件，触发页面加载（注：元素上必须有href，href需要和最终地址栏格式一致）
		 *		[loading]: {String|DOM} 加载时显示的内容，为空则不显示加载状态
		 *		[404]: {String|DOM} 加载不到模块时显示的内容
		 */
		init:function(conf) {
			//初始化配置项
			$.extend(_CONFIG,conf||{});

			conf = this._config();

			this.container = $(conf.container||'body');
			
			this._initIndex();
			this._initEvent();
		},
		/** 显示内容
		 * @param content {String|DOM} 需要显示的内容
		 */
		show:function(content){
			this.container.html(content);
			$(window).scrollTop(0);
		},
		/** 获取当前展示的模块url id
		 * @param 
		 */
		getCurrent:function() {
			return _CURRENT;
		},
		/** 加载页面js
		 * @param 
		 */
		_load:function(mod){
			var that = this;

			this._showLoading();
			
			mod && require.async(mod,function(m){
				_CURRENT = mod;
				var fn = m && m.initPage;
				
				if (fn) {
					fn();
				}else{
					that._show404();
				}
			});
		},
		_showLoading:function() {
			var conf = this._config(),
				loading = conf.loading;
			if (loading) {
				this.container.empty()
							.html(loading);
			}
		},
		_show404:function() {
			var conf = this._config();
			this.show(conf['404']);
		},
		/** 初始页显示
		 * @param 
		 */
		_initIndex:function() {
			var conf = this._config(),
				filter = conf.filter,
				idx;
			

			if (filter) {
				idx = filter(location.href);
			}else{
				throw "route: 没有配置filter";
			}

			idx = idx || conf.index;

			idx && this._load(idx);
		},
		/** 初始化默认的事件绑定
		 * @param 
		 */
		_initEvent:function (){
			var conf = this._config(),
				bind = conf.bind;
			if (bind) {
				$(document.documentElement).on('click',bind,function(ev) {
					var elem = $(ev.currentTarget),
						url = elem.attr('href'),
						mod = conf.filter(url,elem);
					MOD._load(mod);
				});
			}
		},
		/** 配置项的读、写
		 * @param 
		 */
		_config:function(key,val){
			var rs = _CONFIG,
				argLen = arguments.length;
			
			if(argLen>1) {	//set
				rs[key] = val;
			}else if(argLen==1) {	//get
				rs = rs[key];
			}

			return rs;
		}
	};
	
	return MOD;
});
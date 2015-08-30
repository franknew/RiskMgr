/**
 *
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-08 22:12:16
 * @version $Id$
 */
define(function(require, exports, module) {
	var $ = require('jquery'),
		URI = require('./uri');

	var _CONFIG = {	//初始配置
			//loading:'<h3 class="text-center">Loading...</h3>',
			'404':'没有找到该页面',
			defaultAction:'initPage'
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
			this.head = $(conf.header);

			this._initIndex();
			this._initEvent();
		},
		/** 显示内容
		 * @param cont {String|Object} 如果string，则当做内容直接插入页面。如果是object，则当做配置项：
		 	content: 需要插入页面的内容
		 	head: 该页面的标题，插入配置项的header里
		 */
		show:function(con){
			var content,
				head,
				headHtml;

			var newBody = $('<div></div>');	//用来事件委托的容器

			if (typeof con == 'string') {	//纯字符串，则单做content
				content = con;
			}else if($.isPlainObject(con)){	//object配置项解析
				content = con.content;
				head = con.head;
			}

			if (head) {
				if (head.indexOf('<')===0) {//如果是标签则直接输出
					headHtml = head;
				}else {//非标签单做单纯文本，包一层h2
					headHtml = '<h2>'+head+'</h2>';
				}
				this.head.html(headHtml).show().removeClass('hide');
			}else {
				this.head.hide();
			}

			this.container.html(newBody.html(content)).show();

			$(window).scrollTop(0);
		},
		//加载指定的模块
		load:function(modname) {
			var reg = new RegExp('\b'+modname+'\b','');
			if (!reg.test(location.hash)) {	//填上当前页的mod
				location.hash = modname;
			}

			var modinfo = this._getMod(modname);
			this._load(modinfo);
		},
		/** 获取当前展示的模块url id
		 * @param
		 */
		getCurrent:function() {
			return _CURRENT;
		},
		/** 绑定事件
		 * @param
		 */
		on:function(events,hook,func) {
			var selector = '[data-hook='+hook+']';
			this.container.children().on(events,selector,func);

			return this;
		},
		/**
		 * @param url 需要解析的完整url
		 */
		_getMod:function(url) {
			var conf = this._config(),
				filter = conf.filter,
				rs;

			var hashIdx = url.indexOf('#');
				hashIdx = hashIdx===-1?0:hashIdx+1; //没有hash时默认找全字符串

			var hash = url.substr(hashIdx),
				uri = URI('http://www.com/?'+hash),
				params = uri.params || {},
				page = params.page;

			if (filter && page) {
				params.page = page = filter(page);
			}

			if (page) {
				rs = uri.params || {};
			}

			return rs;
		},
		/** 加载页面js
		 * @param url 最终js的完整url
		 * @param [action=initPage] 加载完js执行的函数
		 */
		_load:function(modinfo){
			var that = this,
				conf = this._config(),
				url = modinfo.page,
				action = modinfo.action;

			action = action || conf.defaultAction;

			this._showLoading();

			if (url) {
				require.async(url,function(m){
					_CURRENT = url;
					var fn = m && m[action];

					if (fn) {
						fn.call(m,modinfo,that);
					}else{
						that._show404();
					}
				});
			}
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
				modinfo = this._getMod(location.href) || this._getMod(conf.index);

			this._load(modinfo);
		},
		/** 初始化事件绑定
		 * @param
		 */
		_initEvent:function (){
			var hasHashChangeEvent = 'onhashchange' in window,
				hasStateChange = 'pushState' in history,
				hasAddEventListener = 'addEventListener' in window,
				documentMode = document.documentMode,
				supportHashChange = hasHashChangeEvent && ( documentMode === void 0 || documentMode > 7 );

			var that = this,
				changeHandler = function(ev) {
					var url = ev.newURL,
						mod = that._getMod(url);
					that._load(mod);
				};

			if(!supportHashChange) {
				return false;
			} else if (hasAddEventListener) {
				window.addEventListener('hashchange', changeHandler, false);
			} else if (hasHashChangeEvent) {
				window.onhashchange = changeHandler;
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
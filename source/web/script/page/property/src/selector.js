/**
 * 房产选择器
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-29 20:19:12
 */

define(function(require, exports, module){
	var $ = require('jquery'),
    	Clone = require('risk/unit/class').clone,
		msg = require('risk/components/msg/index'),
		modal = require('risk/components/modal/index'),
		pager = require('risk/components/pager/index'),
		List = require('./list'),
		Tmpl = require('./tmpl');

	var MOD = {
		_DEFAULT_CONFIG:{
			configKey:'___CONFIG___',	//存储配置的key
			setting:{	//默认配置
				//success:funtion(){}	//选取后执行
			}
		},
		show:function(setting) {
			setting = setting ||{};
			var initKey = this._DEFAULT_CONFIG.configKey,
				obj=this;
			if(!this[initKey]) {
				obj = Clone(MOD);
				obj[initKey] = true;
				return obj.show.apply(obj,arguments);
			}

			this._initConfig(setting);

			var that = this;

			this.modal = modal.show({
				title:'选择房产',
				content:Tmpl.ListContainer(),
				form:false,
				onshow:function() {
					var content = this.content.find('#ListContainer');
					List.fill({
						container:content,
						success:function() {
							that._initEvent(content);
						},
						error:function(xhr,msg) {
							msg = '<div class="alert alert-danger">'+msg+'</div>';
							content.html(msg);
						}
					});
				},
				ok:false
			});

			return this;
		},
		close:function() {
			this.modal.close();
		},
		_initEvent:function(container) {
			var that = this;

			container.off('click','[data-hook="view"]');
			container.on('click','[data-hook="view"]',function(ev) {
				ev.preventDefault();
				var elem = $(ev.currentTarget),
					data = elem.data('data');

				that._exeCallback('success',data);
				that.close();
			});
		},
		/** 执行回调 */
		_exeCallback:function (name,data) {
			var conf = this._config(),
				fn = conf[name];
			if($.isFunction(fn)) {
				return fn.call(this,data);
			}
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
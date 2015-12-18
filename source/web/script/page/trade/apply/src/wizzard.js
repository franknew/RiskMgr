/**
 * 向导类表单
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-29 15:47:29
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		Clone = require('risk/unit/class').clone,
		parsley = require('risk/components/parsley/index');

	var MOD = {
		_DEFAULT_CONFIG:{
			configKey:'___CONFIG___',	//存储配置用的公共key
			setting:{	//默认配置
				highlight:'active'	//导航栏高亮className
				//,container:''	//主容器，如果需要校验表单，则需保证该容器为form
				,nav:'.wizard-steps'	//导航
				,navHook:'data-target'	//导航的data属性
				,setup:'.step-pane'	//每一个setup的选择器
				,btnNext:'.wizard-next'	//下一步按钮的选择器，如果没有下一步tab了，则会执行submit
				,btnSubmit:'.wizard-submit'	//提交按钮
				,btnPrev:'.wizard-previous'	//上一步按钮的选择器
				,validate:true	//进入下一步时，是否要校验表单
				//,success:function() {}	//最后一步完成时执行
			}
		},
		init:function (setting) {
			var initKey = this._DEFAULT_CONFIG.configKey,
				obj=this;
			if(!this[initKey]) {
				obj = Clone(MOD);
				obj[initKey] = true;
				return obj.init.apply(obj,arguments);
			}

			var conf = this._initConfig(setting);

			this.container = $(conf.container);
			this.nav = this.container.find(conf.nav);

			this._initBox();
			this._initButton();

			return this;
		},
		//提交表单
		_success:function() {
			var conf = this._config(),
				setups = (function(nav,hook) {
					var rs = [];
					nav.find('['+hook+']').each(function(i,elem) {
						rs.push($(elem).attr(hook));
					});
					return rs;
				})(this.nav,conf.navHook);
			var i=0, l = setups.length,
				notValidate,
				setupNotValid = null;
			for(; i < l; ++i) {
				if (!this.parsley.validateElements($('#'+setups[i]).find(':input'))) {
					notValidate = true;
					if (!setupNotValid) {
						setupNotValid = setups[i];
					}
				}
			}

			if (notValidate) {
				this._show(setupNotValid);
				return ;
			}

			conf.success && conf.success();
		},
		_initBox:function() {
			var conf = this._config(),
				highlight = conf.highlight,
				that = this;

			//初始时显示
			this.nav.find('li').each(function(i,ele) {
				ele = $(ele);
				var id = ele.data('target'),
					box = $('#'+id);

				//默认值显示激活的步骤
				if (ele.hasClass(highlight)) {
					box.show();
				}else {
					box.hide();
				}
			});

			//初始化校验
			this.parsley = this.container.parsley();
		},
		//初始化按钮事件
		_initButton:function() {
			var that = this;
			var conf = this._config(),
				btnNext = conf.btnNext,
				btnPrev = conf.btnPrev,
				btnSubmit = conf.btnSubmit;

			this.container.on('click',btnNext,function(ev) {
				ev.preventDefault();
				var btn = $(ev.currentTarget);
				that._showByButton(btn,'next');
			}).on('click',btnPrev,function(ev) {
				ev.preventDefault();
				var btn = $(ev.currentTarget);
				that._showByButton(btn,'prev');
			}).on('click',btnSubmit,function(ev) {
				ev.preventDefault();
				var btn = $(ev.currentTarget);
				that._success();
			});

			this.nav.on('click','['+conf.navHook+']',function(ev) {
				ev.preventDefault();
				var elem = $(ev.currentTarget),
					setup = elem.attr(conf.navHook);
				that._show(setup);
			});
		},
		/** 根据setup的ID来显示
		 * @param setupID {Selector} 需要显示的setup id
		 */
		_show:function(setupID) {
			var conf = this._config(),
				highlight = conf.highlight,
				nav = this.nav,
				boxs = this.container.find(conf.setup);

			nav.find('['+conf.navHook+']').removeClass(highlight);
			nav.find('['+conf.navHook+'="'+setupID+'"]').addClass(highlight);
			boxs.hide().filter('[id="'+setupID+'"]').show();

			$(window).scrollTop(0);	//滚动到顶部
		},
		/** 根据按钮来和类型来显示指定setup
		 * @param btn
		 * @param type {String} 可选值有：next、prev
		 */
		_showByButton:function(btn,type) {
			btn = $(btn);
			var conf = this._config(),
				highlight = conf.highlight,
				box = btn.parents(conf.setup+':first'),
				oldName = box.attr('id'),
				oldNav = this.nav.find('[data-target="'+oldName+'"]'),
				oldBox = this.container.find('#'+oldName),
				newNav = oldNav[type](),
				newName = newNav.data('target');

			//进入下一步之前校验当前表单
			if (type==='next' && !( !conf.validate || this.parsley.validateElements(box.find(':input')) ) ) {
				return false;
			}

			if (conf[oldName]) {//执行单步骤回调
				conf[oldName]();
			}

			if (newName) {
				this._show(newName);
			}else if (type==='next') {	//下一步按钮，没有newName了，标示为success
				this._success();
			}else {
				throw "找不到正确的步骤";
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
			}else {	//默认返回全部配置
				rs = store;
			}
			return rs;
		}
	};

	return MOD;
});
/**
* @fileOverview 模拟弹窗
*/
define(function (require, exports, module) {
	require('./component.css');
    var $ = require('jquery'),
    	parsley = require('risk/components/parsley/index'),
    	myclass = require('risk/unit/class'),
    	TMPL = require('./tmpl');


	var Clone = myclass.clone;

	var DIALOG_OBJ = [],
		 DIALOG_COUNT = 0;	//浮层计数，用来填默认的id
	var MOD ={
		_DEFAULT_CONFIG:{
			configKey:'___CONFIG___',	//存储配置的key
			setting:{	//默认配置
				title:'温馨提示'
				,content:''	//内容，支持html
				//,width:'630px'	//宽度，必须设定单位
				,padding:'20px'	//内容区域的padding
				,skin:''	//主容器的className
				,ok:function () {}	//确定按钮的回调
				,okValue:'确定'	//确定按钮文本
				,cancel:function(){}		//取消按钮的回调
				,cancelValue:'取消'	//取消按钮文本
				,onclose:function () {}	 //关闭浮层时的回调
				,onshow:function(){}	//打开浮层时的回调
				,id:''	//浮层主容器的ID
				,validate:true	//是否校验表单
				,form:true	//是否自动生成外包form
				//,button:[]	//增加按钮
			}
		},
		/** 显示浮层
		 * @param  setting {Object}
		 * @return 返回当前浮层对象
		 */
		show:function (setting) {
			var initKey = this._DEFAULT_CONFIG.configKey,
				 obj=this;
			if(!this[initKey]) {
				obj = Clone(MOD);
				obj[initKey] = true;
				return obj.show.apply(obj,arguments);
			}

			var conf = this._initConfig(setting);

			this._showMask();
			var html = TMPL.modal(conf),
				 elem = $(html);
			$('body').append(elem);

			this.dialog = elem;
			this.content = elem.find('div.modal-body');
			this.form = elem.find('>form').eq(0);
			this.parsley = this.form.parsley();

			//this._offset(elem);	 //剧中显示
			this._show();

			this._initEvent(elem);

			return this;
		},
		/** 关闭当前浮层对象
		 */
		close:function () {
			this._hideMask();
			$(this.dialog).remove();
			//$(this.dialog).removeClass('md-show').trigger('hide');
			this._exeCallback('onclose');
			return this;
		},
		/** 关闭所有打开的浮层
		 * @param
		 */
		closeAll:function () {
			return this;
		},
		_show:function() {
			var box = this.dialog;
			if (box) {
				box.addClass('md-show');
				this._exeCallback('onshow');
			}
		},
		/** 定位浮层位置
		 * @param
		 */
		_offset:function (box) {
			box = $(box);
			var winH = $(window).height(),
				 boxH = box.height(),
				 top = (winH-boxH)/2;	//垂直居中显示
			top = top<0?0:top;
			box.css('top',top);
		},
		/** 显示背景遮罩 */
		_showMask:function () {
			var classname = 'j-qzact-dialog-mask',
				 html = '<div class="'+classname+'" style="background:rgba(0,0,0,0.55);top:0;bottom:0;left:0;right:0;position:fixed;z-index: 1040"></div>';
			this._hideMask();
			$('body').append(html);
		},
		/** 隐藏背景遮罩 */
		_hideMask:function () {
			var classname = 'j-qzact-dialog-mask';
			$('div.'+classname).remove();
		},
		/** 事件绑定
		 * @param
		 */
		_initEvent:function (box) {
			var that = this,
				conf = this._config(),
				validate = conf.validate;

			box.find('button.j-op-close').bind('click',function (ev) {//关闭按钮
				ev.preventDefault();
				that.close();
			});
			box.find('button.j-op-cancel').bind('click',function (ev) {	 //取消按钮
				ev.preventDefault();
				if (!that._exeCallback('cancel')) {
					that.close();
				}
			});
			box.find('button.j-op-ok').bind('click',function (ev) {	 //确定按钮
				ev.preventDefault();
				if (!validate || that.parsley.validate()) {	//校验表单  在没有表单的时候默认成功，所以可以全部都校验
					if (!that._exeCallback('ok')) {	//执行『ok』回调，如果不返回true，则执行关闭浮层
						that.close();
					}
				}
			});

			//自定义按钮事件绑定
			var buttons = conf.button;
			if (buttons&&buttons.length>0) {
				box.on('click','button.j-op-btns',function(ev) {
					ev.preventDefault();
					var btn = $(ev.currentTarget),
						sn = btn.data('sn'),
						fn = buttons[sn].callback;

					fn.call(that);
				});
			}
		},
		/** 执行回调 */
		_exeCallback:function (name) {
			var conf = this._config(),
				fn = conf[name];
			if($.isFunction(fn)) {
				return fn.call(this);
			}
		},
		/** 初始化配置 */
		_initConfig:function (setting) {
			var def = this._DEFAULT_CONFIG.setting,
				key = this._DEFAULT_CONFIG.configKey,
				conf;
			conf = this[key] = $.extend({},def,setting);

			//填上popup的id
			DIALOG_COUNT = DIALOG_COUNT+1;
			if(!conf.id) {
				this._config('id','J_DIALOG_'+DIALOG_COUNT);
			}

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
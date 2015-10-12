//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/ajax","risk/unit/route","risk/components/msg/index","risk/components/modal/index","risk/components/former/index","risk/components/pager/index","risk/unit/class","risk/page/customer/index","risk/page/customer/src/tpl.view"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	    name = name.replace(/\.r[0-9]{15}/,"");
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//property/src/dialog.js
//property/src/index.js
//property/src/list.js
//property/src/selector.js
//property/src/tpl.view.js
//property/src/form.tmpl.html
//property/src/list.tmpl.html

//js file list:
//property/src/dialog.js
//property/src/index.js
//property/src/list.js
//property/src/selector.js
//property/src/tpl.view.js
/**
 * 房产通用dialog弹窗
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-18 12:22:58
 */

define.pack("./dialog",["jquery","risk/unit/ajax","risk/unit/route","risk/components/msg/index","risk/components/modal/index","risk/components/former/index","./tpl.view"],function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		msg = require('risk/components/msg/index'),
		modal = require('risk/components/modal/index'),
		former = require('risk/components/former/index'),
		BaseTpl = require('./tpl.view');

	var MOD = {
		view:function(id,oriBox) {
			var that = this;
			this._getData(id,function(data) {
				var html = that._getForm({
					data:data,
					disabled:true
				});
				modal.show({
					title:'查看房产信息',
					content:html,
					validate:false,
					okValue: '编辑',
					cancelValue: '关闭',
					ok: function() {
						MOD.edit(id);
					},
					button: [{
						value:'删除',
						style:'danger',
						callback:function() {
							if (!confirm('确认删除房产['+data.Code+']？')) {
								return ;
							}
							var dialog = this;
							ajax.post({
								url:'RiskMgr.Api.AssetApi/Delete',
								form:this.form,
								success:function(data, textStatus, jqXHR) {
									msg.success('删除成功.');
									dialog.close();

									$(oriBox).css('background-color','red').slideUp('fast',function() {
										$(this).remove();
									});
								}
							});
						}
					}]
				});
			});
		},
		edit:function(id) {
			var that = this;
			this._getData(id,function(data) {
				var html = that._getForm({
					data:data
				});
				modal.show({
					title:'编辑房产信息',
					content:html,
					ok: function() {
						var dialog = this;
						ajax.post({
							url:'RiskMgr.Api.AssetApi/Update',
							form:this.form,
							success:function(data, textStatus, jqXHR) {
								msg.success('编辑成功');
								dialog.close();
							}
						});
					}
				});
			});
		},
		add:function(success) {
			var html = this._getForm();
			modal.show({
				title:'新增房产',
				content:html,
				ok: function() {
					var dialog = this;
					ajax.post({
						url:'RiskMgr.Api.AssetApi/Add',
						form:this.form,
						success:function(data, textStatus, jqXHR) {
							msg.success('添加成功');
							dialog.close();
							//添加完毕，刷新客户列表页
							if (!success || !success()) {	//如果回调返回false则默认跳转
								route.load('page=property');
							}
						}
					});

					return true;
				}
			});
		},
		/** 获取房产表单
		 * @param opts former.make的配置项（有data、disabled）
		 */
		_getForm:function(opts) {
			var rs = former.make(BaseTpl,opts);

			return rs;
		},
		_getData:function(id,callback) {
			if (!id) {
				callback && callback();
			}else {	//查看指定id的客户
				ajax.post({
					url:'RiskMgr.Api.AssetApi/Query',
					data:{
						ID:id
					},
					success:function(da) {
						//console.log('qqq',da);
						var item = da&&da.Record&&da.Record[0];
						callback && callback(item);
					},
					error:function(xhr,msg) {
					}
				});
			}
		}
	};

	return MOD;
});/**
 * 房产信息- 页面路由初始化
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-23 16:53:06
 */

define.pack("./index",["jquery","risk/unit/route","./tmpl","./dialog","./selector"],function(require, exports, module){
	var $ = require('jquery'),
		route = require('risk/unit/route'),
		tmpl = require('./tmpl'),
		dialogCust = require('./dialog');

	var MOD = {
		initPage:function() {
			this.list();
		},
		list:function() {
			require.async('./list',function(m) {
				m.initPage();
			});
		},
		view:function() {
			dialogCust.show({
				type:'view'
			});
		},
		add:function() {
			dialogCust.show({
				type:'add'
			});
		},
		edit:function() {
			dialogCust.show({
				type:'edit'
			});
		},
		//选择器浮层
		selector:function(conf) {
			require('./selector').show(conf);
		}
	};

	return MOD;
});/**
 * 房产列表
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define.pack("./list",["jquery","risk/unit/ajax","risk/unit/route","risk/components/pager/index","./tmpl","./dialog"],function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		pager = require('risk/components/pager/index'),
		tmpl = require('./tmpl'),
		dialog = require('./dialog');

	var MOD = {
		initPage:function(params) {
			params = params || {};
			var currentPage = params.current || 1,
				that = this;

			var html = tmpl.list();
			route.show({
				head:'房产信息管理',
				content:html
			});

			this.fill({
				container:route.container.find('#ListContainer')
			});

			route.on('click','add',function(ev) {//按钮：新增
				ev.preventDefault();
				dialog.add();
			});
		},
		/** 填充列表主体html到指定容器
		 * @param setting {Obeject} 配置项：
		 *     container 需要填充的容器
		 *     [current] 第几页，默认第一页
		 *     [size]  每一页的数量
		 */
		fill:function(setting) {
			setting = setting||{};

			var container = $(setting.container),
				current = setting.current || 1,
				size = setting.size,
				success = setting.success;

			var that = this;

			this.query({	//query有默认的current、size
				current:current,
				size:size,
				success:function(da) {
					var html = tmpl.ListBox(da.Record);

					container.html(html);

					//初始化翻页
					pager.init({
						container:container.find('.j-pager'),
						current:current,
						total:da.PageCount,
						request:function(num) {
							return MOD.query({
								current:num,
								size:size,
								success:function(da) {
									that._fill(container,da.Record);
								}
							});
						}
					});

					that._initFillEvent(container);

					success && success();
				},
				error:setting.error || function(xhr,msg) {
					route.show({
						head:'客户管理',
						content:msg
					});
				}
			});
		},
		_fill:function(container,data) {
			var html = tmpl.ListItem(data);
			container.find('#J_ListBox').html(html);
		},
		_initFillEvent:function(container) {
			var that = this,
				key = '__initFillEvent__';
			if (container.data(key)) {
				return false;
			}

			container.data(key,'1');//标记已经进行事件绑定，防止重复绑定

			container.on('click','[data-hook="view"]',function(ev) {//查看详情
				ev.preventDefault();
				var elem = $(ev.currentTarget),
					id = elem.data('id');
				dialog.view(id,elem);
			});
			container.parent().on('click', '[data-hook="search"]', function(ev) {//搜索
				ev.preventDefault();
				that.fill({
					container:container
				});
			});
		},
		/** 查询列表接口
		 * @param conf {Obejct} 配置项：
		 *      size: 每页个数
		 *      current: 拉取第几页
		 *      form: 搜索的表单
		 */
		query:function(conf) {
			return ajax.post({
				url:'RiskMgr.Api.AssetApi/Query',
				data:{
					PageSize:conf.size||10,
					CurrentIndex:conf.current || 1
				},
				form:$('#J_SearchForm'),
				formDropEmpty:true,
				success:conf.success,
				error:conf.error
			});
		}
	};

	return MOD;
});/**
 * 房产选择器
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-29 20:19:12
 */

define.pack("./selector",["jquery","risk/unit/class","risk/components/msg/index","risk/components/modal/index","risk/components/pager/index","./list","./tmpl"],function(require, exports, module){
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
});/**
 * 员工信息的基本form表单
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define.pack("./tpl.view",["risk/page/customer/index","risk/page/customer/src/tpl.view"],function(require, exports, module){
	var Customer = require('risk/page/customer/index'),
		CustomerTpl = require('risk/page/customer/src/tpl.view');
	var MOD = [
		[{
			type:'hidden',
			name:'ID'
		},{
			type:'label',
			col:'2',
			required:true,
			html:'房产证号'
		},{
			col:'4',
			type:'text',
			required:true,
			name:'Code',
			placeholder:''
		},{
			type:'label',
			col:'2',
			required:true,
			html:'用途'
		},{
			col:4,
			type:'select',
			name:'Usage',
			required:true,
			options:'房产用途'
		}],

		[{
			col:2,
			type:'label',
			html:'房产地址',
			required:true
		},{
			col:3,
			type:'select',
			name:'Position',
			required:true,
			options:'地区'
		},{
			col:7,
			type:'text',
			name:'Address',
			required:true,
			placeholder:'详细地址，与房产证保持一致'
		}],

		[{
			type:'label',
			col:'2',
			required:true,
			html:'建筑面积'
		},{
			col:'4',
			type:'number',
			required:true,
			name:'Area',
			placeholder:'',
			suffix:'㎡'
		},{
			type:'label',
			col:'2',
			required:true,
			html:'登记价'
		},{
			col:'4',
			type:'number',
			required:true,
			name:'RegPrice',
			placeholder:'',
			suffix:'元'
		}]
	];

	return MOD;
});
//tmpl file list:
//property/src/form.tmpl.html
//property/src/list.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'Form': function(data){

var __p=[],_p=function(s){__p.push(s)};
_p(data.base);
__p.push('<h4>\n	业主信息\n	<button type="button" class="btn btn-default" data-hook="customer-import" data-parsley-group="setup1"><i class="fa fa-sign-in"></i> 导入现有客户</button>\n	<button type="button" class="btn btn-default" data-hook="customer-add">&nbsp;&nbsp;<i class="fa fa-plus"></i> 增加新业主&nbsp;&nbsp;</button>\n</h4>');
_p(data.customer);
__p.push('');

return __p.join("");
},

'list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="spacer spacer-bottom">\n	<button type="button" class="btn btn-primary" data-hook="add">新增房产</button>\n</div>\n\n<div class="block-flat">');
_p(this.ListContainer());
__p.push('</div>');

return __p.join("");
},

'ListContainer': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<form class="form-inline" id="J_SearchForm">\n		<div class="form-group">\n			<label>房产证号</label>\n			<input type="text" name="Code" class="form-control" placeholder="">\n		</div>\n		<button type="submit" class="btn btn-default btn-flat" data-hook="search">查找</button>\n	</form>\n	<hr/>\n	<div id="ListContainer">\n		<div class="loading">Loading...</div>\n	</div>');

return __p.join("");
},

'ListBox': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('\n	<table class="no-border">\n		<thead class="no-border">\n			<tr>\n				<th>房产证号</th>\n				<th colspan="2">房产地址</th>\n				<th>用途</th>\n				<th>面积(㎡)</th>\n				<th>登记价(元)</th>\n			</tr>\n		</thead>\n		<tbody class="no-border-x no-border-y" id="J_ListBox">');
_p(this.ListItem(data));
__p.push('		</tbody>\n	</table>\n\n	<div class="j-pager"></div>\n');

return __p.join("");
},

'ListItem': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var List = data||[];
	var ShowInfos = ['Code','Position','Address','Usage','Area','RegPrice'];

	var i=0,Cur;
	if (List.length>0) {

		for(;Cur=List[i++];) {
__p.push('	<tr data-hook="view" class="pointer-item" data-id="');
_p(Cur.ID);
__p.push('" data-data=\'');
_p(JSON.stringify(Cur));
__p.push('\'>');

			var ii=0,CurII;
			for(;CurII=ShowInfos[ii++];) {
		__p.push('			<td>');
_p(Cur[CurII]);
__p.push('</td>');

			}
		__p.push('	</tr>');

		}
	}else{
__p.push('	<tr>\n	<td colspan="');
_p(ShowInfos.length);
__p.push('">\n		<div class="alert alert-info" role="alert">没有房产信息</div>\n	</td>\n	</tr>');

	}
__p.push('\n');

return __p.join("");
},

'dd': function(data){

var __p=[],_p=function(s){__p.push(s)};


	var List = data;
	var i=0,Cur;
	if (List.length>0) {

		for(;Cur=List[i++];) {
__p.push('\n	<div data-hook="view" class="list-group-item pointer-item" data-id="');
_p(Cur.ID);
__p.push('" data-data=\'');
_p(JSON.stringify(Cur));
__p.push('\'>\n		<h4 class="name">[');
_p(Cur.Position);
__p.push('] <strong>');
_p(Cur.Address);
__p.push('</strong></h4>\n		<p>');
_p([Cur.Usage,Cur.Area+'㎡',Cur.Code].join(' , '));
__p.push('</p>\n	</div>');

		}
	}else{
__p.push('	<div class="alert alert-info" role="alert">\n		没有房产信息\n	</div>');

	}
__p.push('');

return __p.join("");
}
};
return tmpl;
});

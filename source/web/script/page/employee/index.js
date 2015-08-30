//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/ajax","risk/unit/route","risk/components/msg/index","risk/components/modal/index","risk/components/former/index","risk/components/pager/index","risk/unit/class"],function(require,exports,module){

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
//employee/src/dialog.js
//employee/src/index.js
//employee/src/list.js
//employee/src/selector.js
//employee/src/tpl.view.js
//employee/src/list.tmpl.html
//employee/src/selector.tmpl.html

//js file list:
//employee/src/dialog.js
//employee/src/index.js
//employee/src/list.js
//employee/src/selector.js
//employee/src/tpl.view.js
/**
 * 客户通用dialog弹窗
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
		viewTpl = require('./tpl.view');

	var MOD = {
		view:function(id,oriBox) {
			this._getData(id,function(data) {
				modal.show({
					title:'员工详情',
					content:former.make(viewTpl,{
						data:data,
						disabled:true
					}),
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
							if (!confirm('确认删除员工“'+data.CnName+'('+data.Name+')”？')) {
								return ;
							}
							var dialog = this;
							ajax.post({
								url:'RiskMgr.Api.UserApi/Delete',
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
			this._getData(id,function(data) {
				modal.show({
					title:'编辑员工',
					content:former.make(viewTpl,{
						data:data
					}),
					ok: function() {
						var dialog = this;
						ajax.post({
							url:'RiskMgr.Api.UserApi/Update',
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
			modal.show({
				title:'新增员工',
				content:former.make(viewTpl),
				ok: function() {
					var dialog = this;
					ajax.post({
						url:'RiskMgr.Api.UserApi/Add',
						form:this.form,
						success:function(data, textStatus, jqXHR) {
							msg.success('添加成功');
							dialog.close();
							//添加完毕，刷新客户列表页
							if (!success || !success()) {	//如果回调返回false则默认跳转
								route.load('page=customer');
							}
						}
					});

					return true;
				}
			});
		},
		_getData:function(id,callback) {
			if (!id) {
				callback && callback();
			}else {	//查看指定id的客户
				ajax.post({
					url:'RiskMgr.Api.UserApi/QueryUser',
					data:{
						ID:id
					},
					success:function(da) {
						//console.log('qqq',da);
						var item = da&&da.Record&&da.Record[0];
						item.Password = '***不可编辑***';
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
 * 客户管理- 页面路由初始化
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
 * 客户列表
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
				head:'员工管理',
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
				error:function(xhr,msg) {
					route.show({
						head:'员工管理',
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
				key = '__initFillCustomerEvent__';
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
				url:'RiskMgr.Api.UserApi/QueryUser',
				data:{
					PageSize:conf.size||10,
					CurrentIndex:conf.current || 1
				},
				form:$('#J_CustomerSearchForm'),
				formDropEmpty:true,
				success:conf.success,
				error:conf.error
			});
		}
	};

	return MOD;
});/**
 * 客户选择器
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
				title:'选择客户',
				content:Tmpl.ListContainer(),
				form:false,
				onshow:function() {
					var content = this.content.find('#ListContainer');
					List.fill({
						container:content,
						size:5,
						success:function() {
							that._initEvent(content);
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

define.pack("./tpl.view",[],function(require, exports, module){
	var MOD = [
		[{
			type:'hidden',
			name:'ID'
		},{
			type:'label',
			col:'3',
			required:true,
			html:'帐号'
		},{
			col:'7',
			type:'text',
			required:true,
			name:'Name',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'密码'
		},{
			col:'7',
			type:'text',
			required:true,
			name:'Password',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'职位'
		},{
			col:7,
			type:'select',
			name:'Role',
			required:true,
			options:[{
				name:'请选择',
				value:''
			},{
				name:'业务员',
				value:1
			},{
				name:'业务员组长',
				value:2
			},{
				name:'风控',
				value:3
			},{
				name:'总经理',
				value:4
			}]
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'姓名'
		},{
			col:'7',
			type:'text',
			name:'CnName',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'身份证号'
		},{
			col:'7',
			type:'text',
			name:'Identity',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'手机'
		},{
			col:'7',
			type:'tel',
			name:'Mobile',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'地址'
		},{
			col:'7',
			type:'text',
			name:'Address',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:' '
		},{
			col:'7',
			type:'checkbox',
			name:'Enabled',
			checked:true,
			value:1,
			placeholder:'启用该帐号'
		}]
	];

	return MOD;
});
//tmpl file list:
//employee/src/list.tmpl.html
//employee/src/selector.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="spacer spacer-bottom">\n	<button type="button" class="btn btn-primary" data-hook="add">新增员工</button>\n</div>\n\n<div class="block-flat">');
_p(this.ListContainer());
__p.push('</div>');

return __p.join("");
},

'ListContainer': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<form class="form-inline" id="J_CustomerSearchForm">\n		<div class="form-group">\n			<label>姓名</label>\n			<input type="text" name="CnName" class="form-control" placeholder="">\n		</div>\n		<div class="form-group">\n			<label>账号</label>\n			<input type="text" name="Name" class="form-control" placeholder="">\n		</div>\n		<div class="form-group">\n			<label>证件号</label>\n			<input type="text" name="Identity" class="form-control" placeholder="">\n		</div>\n		<button type="submit" class="btn btn-default btn-flat" data-hook="search">查找</button>\n	</form>\n	<hr/>\n	<div id="ListContainer">\n		<div class="loading">Loading...</div>\n	</div>');

return __p.join("");
},

'ListBox': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<table class="no-border">\n		<thead class="no-border">\n			<tr>\n				<th>姓名</th>\n				<th>账号</th>\n				<th>职位</th>\n				<th>电话</th>\n				<th>证件号</th>\n			</tr>\n		</thead>\n		<tbody class="no-border-x no-border-y" id="J_ListBox">');
_p(this.ListItem(data));
__p.push('		</tbody>\n	</table>\n\n	<div class="j-pager"></div>\n');

return __p.join("");
},

'ListItem': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var List = data||[];
	var ShowInfos = ['CnName','Name','Role','Mobile','Identity'];

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
_p(Cur[CurII]||'-');
__p.push('</td>');

			}
		__p.push('	</tr>');

		}
	}else{
__p.push('	<tr>\n	<td colspan="');
_p(ShowInfos.length);
__p.push('">\n		<div class="alert alert-info" role="alert">没有客户信息</div>\n	</td>\n	</tr>');

	}
__p.push('');

return __p.join("");
},

'bak': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('\n	<!--\n	<div class="list-group tickets" id="J_ListBox">');
_p(this.ListItem(data));
__p.push('	</div>\n	-->\n	<!--\n	<div data-hook="view" class="list-group-item pointer-item" data-id="');
_p(Cur.ID);
__p.push('" data-data=\'');
_p(JSON.stringify(Cur));
__p.push('\'>\n		<span class="label label-default pull-right">');
_p(Cur.Role);
__p.push('</span>\n		<h4 class="name"><strong>');
_p(Cur.Name);
__p.push('</strong></h4>\n		<p>');
_p(Cur.Phone||'&nbsp;');
__p.push('</p>\n		<p>');
_p(Cur.Address||'&nbsp;');
__p.push('</p>\n	</div>\n	-->');

return __p.join("");
},

'Selector': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('\n	<form class="form-inline">\n		<div class="form-group">\n			<label>姓名</label>\n			<input type="text" class="form-control" placeholder="">\n		</div>\n		<button type="submit" class="btn btn-default btn-flat">查找</button>\n	</form>\n	<hr style="margin:10px 0;border-top-style: dashed;"/>\n\n	<div id="J_SelectorBody">');
_p(this.SelectorList(data));
__p.push('	</div>\n\n	<div class="j-pager"></div>\n');

return __p.join("");
},

'SelectorList': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<table class="no-border hover">\n		<thead class="no-border">\n			<tr>\n				<th>姓名</th>\n				<th>证件号</th>\n				<th>电话</th>\n				<th>&nbsp;</th>\n			</tr>\n		</thead>\n		<tbody class="no-border-y">');
_p(this.SelectorItem(data));
__p.push('		</tbody>\n	</table>');

return __p.join("");
},

'SelectorItem': function(data){

var __p=[],_p=function(s){__p.push(s)};


	var List = data;
	var i=0,Cur;
	for(;Cur=List[i++];) {
__p.push('	<tr class="pointer-item" data-id="');
_p(Cur.ID);
__p.push('" data-data=\'');
_p(JSON.stringify(Cur));
__p.push('\' data-hook="choose">\n		<td>');
_p(Cur.Name);
__p.push('</td>\n		<td>');
_p(Cur.IdentityCode||'&nbsp;');
__p.push('</td>\n		<td>');
_p(Cur.Phone||'&nbsp;');
__p.push('</td>\n		<td><i class="fa fa-square-o"></i> 选择</td>\n	</tr>');

	}
__p.push('');

return __p.join("");
}
};
return tmpl;
});

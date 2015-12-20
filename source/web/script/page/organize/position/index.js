//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/ajax","risk/unit/route","risk/components/msg/index","risk/components/modal/index","risk/components/former/index","risk/data-dictionary","./selector","risk/components/pager/index"],function(require,exports,module){

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
//position/src/dialog.js
//position/src/index.js
//position/src/list.js
//position/src/tpl.view.js
//position/src/list.tmpl.html

//js file list:
//position/src/dialog.js
//position/src/index.js
//position/src/list.js
//position/src/tpl.view.js
/**
 * 职位通用弹窗
 */

define.pack("./dialog",["jquery","risk/unit/ajax","risk/unit/route","risk/components/msg/index","risk/components/modal/index","risk/components/former/index","./tpl.view","risk/data-dictionary"],function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		msg = require('risk/components/msg/index'),
		modal = require('risk/components/modal/index'),
		former = require('risk/components/former/index'),
		viewTpl = require('./tpl.view');

	var SelectData = require('risk/data-dictionary');

	var MOD = {
		view:function(id,oriBox) {
			var that = this;
			this._getData(id,function(data) {
				that._showDialog({
					title:'职位详情',
					former:{
						data:data,
						disabled:true
					},
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
							if (!confirm('确认删除职位“'+data.CnName+'('+data.Name+')”？')) {
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
				this._showDialog({
					title:'编辑职位',
					former:{
						data:data
					},
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
			this._showDialog({
				title:'新增职位',
				ok: function() {
					var dialog = this;
					ajax.post({
						url:'RiskMgr.Api.UserApi/Add',
						form:this.form,
						success:function(data, textStatus, jqXHR) {
							msg.success('添加成功');
							dialog.close();
							//添加完毕，刷新
							if (!success || !success()) {	//如果回调返回false则默认跳转
								route.load('page=organize/position');
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
		},
		//获取职位列表
		_getOptions:function() {
			var defer = $.Deferred();

			ajax.post({
				url:'RiskMgr.Api.UserApi/QueryUser',
				data:{
					PageSize:10,
					CurrentIndex:1
				},
				formDropEmpty:true,
				success:function(da) {
					var rs = da&&da.Record;

					if (rs) {
						rs = (function(obj) {
							var i=0, l = obj.length;
							var rs = [];
							for(; i < l; ++i) {
								rs.push({
									name:obj[i].CnName,
									value:obj[i].Name
								});
							}
							return rs;
						})(rs);

						defer.resolve(rs);
					}else{
						defer.reject(da);
					}
				},
				error:function() {
					defer.reject();
				}
			});

			return defer;
		},
		//在显示dialog之前，把职位list拉好并拼接进数据字典
		_showDialog:function(args) {
			args = args || {};

			this._getOptions().done(function(list) {

				SelectData['职位'] = list;	//重写数据字典

				if (!args.content) {
					args.content = former.make(viewTpl,args.former);
				}

				modal.show(args);
			}).fail(function() {
				msg.error('拉取职位列表出错，请重试。');
			});
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
 * 职位管理-列表
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
				head:'职位管理（开发中，勿使用）',
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
			html:'职位名称'
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
			html:'上级职位'
		},{
			col:'7',
			type:'select',
			required:true,
			name:'',
			options:'职位'
		}]
	];

	return MOD;
});
//tmpl file list:
//position/src/list.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="spacer spacer-bottom">\n	<button type="button" class="btn btn-primary" data-hook="add">新增职位</button>\n</div>\n\n<div class="block-flat">');
_p(this.ListContainer());
__p.push('</div>');

return __p.join("");
},

'ListContainer': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div id="ListContainer">\n		<div class="loading">Loading...</div>\n	</div>');

return __p.join("");
},

'ListBox': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<table class="no-border">\n		<thead class="no-border">\n			<tr>\n				<th>职位名称</th>\n				<th>上级职位</th>\n			</tr>\n		</thead>\n		<tbody class="no-border-x no-border-y" id="J_ListBox">');
_p(this.ListItem(data));
__p.push('		</tbody>\n	</table>\n\n	<div class="j-pager"></div>\n');

return __p.join("");
},

'ListItem': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var List = data||[];
	var ShowInfos = ['CnName','Name'];

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
__p.push('">\n		<div class="alert alert-info" role="alert">没有职位信息</div>\n	</td>\n	</tr>');

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
}
};
return tmpl;
});

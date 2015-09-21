//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["risk/unit/route","jquery","risk/unit/ajax","risk/components/pager/index"],function(require,exports,module){

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
//workflow/src/index.js
//workflow/src/list.js
//workflow/src/list.tmpl.html

//js file list:
//workflow/src/index.js
//workflow/src/list.js
/**
 * 审批流程主入口
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-30 14:17:40
 */

define.pack("./index",["risk/unit/route","./list","./tmpl"],function(require, exports, module){
	var Route = require('risk/unit/route');
	var List = require('./list'),
		Tmpl = require('./tmpl');

	var MOD = {
		//默认查询入口
		initPage:function(params) {
			params = params || {};

			var mode = params.action || 'mine',
				head = '审批单据',
				html = Tmpl.ListContainer();
			Route.show({
				head:head,
				content:html
			});

			List.init({
				mode:mode
			});
		}
	};

	return MOD;
});/**
 * 额度列表
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define.pack("./list",["jquery","risk/unit/ajax","risk/unit/route","risk/components/pager/index","./tmpl"],function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		pager = require('risk/components/pager/index'),
		tmpl = require('./tmpl');

	var MOD = {
		/** 初始化填充列表
		 * @param
		 */
		init:function(params) {
			this.fill({
				container:route.container.find('#ListContainer'),
				mode:params.mode
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
			var mode = setting.mode;

			var container = $(setting.container),
				current = setting.current || 1,
				size = setting.size,
				success = setting.success;

			var that = this;

			this.query({	//query有默认的current、size
				current:current,
				size:size,
				success:function(da) {
					var html = tmpl.List(da);

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
									that._fill(container,da);
								}
							});
						}
					});

					that._initFillEvent(container,setting);

					success && success();
				},
				error:setting.error
			});
		},
		_fill:function(container,data) {
			var html = tmpl.ListItem(data);
			container.find('#J_Lister').html(html);
		},
		_initFillEvent:function(container,setting) {
			var that = this,
				key = '__initFillCustomerEvent__',
				mode = setting.mode;
			if (container.data(key)) {
				return false;
			}

			container.data(key,'1');//标记已经进行事件绑定，防止重复绑定

			container.on('click','[data-hook="view"]',function(ev) {//查看详情
				ev.preventDefault();
				var elem = $(ev.currentTarget),
					id = elem.data('id');
				route.load('page=trade/apply&action=approval&id='+id);
			});
			container.parent().on('click', '[data-hook="search"]', function(ev) {//搜索
				ev.preventDefault();
				that.fill({
					container:container
				});
			});
		},
		/** 查询接口
		 * @param conf {Obejct} 配置项：
		 *      size: 每页个数
		 *      current: 拉取第几页
		 *      form: 搜索的表单
		 */
		query:function(conf) {
			return ajax.post({
				url:'RiskMgr.Api.WorkflowApi/QueryMyProcessing',
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
});
//tmpl file list:
//workflow/src/list.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'ListContainer': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="block-flat">\n	<form class="form-inline" id="J_SearchForm">\n		<div class="form-group">\n			<label>项目</label>\n			<select class="form-control">\n				<option>额度申请</option>\n			</select>\n		</div>\n		<div class="form-group">\n			<label>单据状态</label>\n			<select class="form-control">\n				<option>全部</option>\n				<option selected="selected">待审批</option>\n				<option>已审批</option>\n			</select>\n		</div>\n		<div class="form-group">\n			<label>申请人</label>\n			<input type="text" name="Name" class="form-control" placeholder="">\n		</div>\n		<button type="submit" class="btn btn-default btn-flat" data-hook="search">查找</button>\n	</form>\n	<hr/>\n	<div id="ListContainer">\n		<div class="loading">Loading...</div>\n	</div>\n</div>');

return __p.join("");
},

'List': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<table class="no-border">\n		<thead class="no-border">\n			<th>项目名</th>\n			<th>说明</th>\n			<th>申请人</th>\n			<th>申请时间</th>\n		</thead>\n		<tbody class="no-border-x no-border-y" id="J_Lister">');
_p(this.ListItem(data));
__p.push('		</tbody>\n	</table>\n\n	<div class="j-pager"></div>\n');

return __p.join("");
},

'ListItem': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var List = data||[];

	var i=0,Cur;
	if (List.length>0) {

		for(;Cur=List[i++];) {
__p.push('	<tr data-hook="view" class="pointer-item" data-id="');
_p(Cur.ID);
__p.push('" data-data=\'');
_p(JSON.stringify(Cur));
__p.push('\'>\n		<td>');
_p(Cur.Name);
__p.push('</td>\n		<td>');
_p(Cur.Remark);
__p.push('</td>\n		<td>');
_p(Cur.Creator);
__p.push('</td>\n		<td>');
_p(Cur.LastUpdateTime);
__p.push('</td>\n	</tr>');

		}
	}else{
__p.push('	<tr>\n	<td colspan="2">\n		<div class="alert alert-info" role="alert">没有审批信息</div>\n	</td>\n	</tr>');

	}
__p.push('');

return __p.join("");
}
};
return tmpl;
});
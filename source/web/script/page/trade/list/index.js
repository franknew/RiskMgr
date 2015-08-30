//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/ajax","risk/unit/route","risk/components/pager/index"],function(require,exports,module){

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
//list/src/index.js
//list/src/list.tmpl.html

//js file list:
//list/src/index.js
/**
 * 额度列表
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define.pack("./index",["jquery","risk/unit/ajax","risk/unit/route","risk/components/pager/index","./tmpl"],function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		pager = require('risk/components/pager/index'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function(params) {
			params = params || {};

			var html = tmpl.list();
			route.show({
				head:'额度列表',
				content:html
			});

			this.fill({
				container:route.container.find('#ListContainer')
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
				key = '__initFillCustomerEvent__';
			if (container.data(key)) {
				return false;
			}

			container.data(key,'1');//标记已经进行事件绑定，防止重复绑定

			container.on('click','[data-hook="view"]',function(ev) {//查看客户详情
				ev.preventDefault();
				var elem = $(ev.currentTarget),
					id = elem.data('id');
				route.load('page=trade/apply&action=view&id='+id);
			});
			container.parent().on('click', '[data-hook="search"]', function(ev) {//搜索
				ev.preventDefault();
				that.fill({
					container:container
				});
			});
		},
		/** 查询客户列表接口
		 * @param conf {Obejct} 配置项：
		 *      size: 每页个数
		 *      current: 拉取第几页
		 *      form: 搜索的表单
		 */
		query:function(conf) {
			return ajax.post({
				url:'RiskMgr.Api.CustomerApi/Query',
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
//list/src/list.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="spacer spacer-bottom">\n	<a href="#page=trade/apply" class="btn btn-primary">申请额度</a>\n</div>\n\n<div class="block-flat">');
_p(this.ListContainer());
__p.push('</div>');

return __p.join("");
},

'ListContainer': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<form class="form-inline" id="J_SearchForm">\n		<div class="form-group">\n			<label>客户姓名</label>\n			<input type="text" name="Name" class="form-control" placeholder="">\n		</div>\n		<div class="form-group">\n			<label>房产证号</label>\n			<input type="text" name="IdentityCode" class="form-control" placeholder="">\n		</div>\n		<button type="submit" class="btn btn-default btn-flat" data-hook="search">查找</button>\n	</form>\n	<hr/>\n	<div id="ListContainer">\n		<div class="loading">Loading...</div>\n	</div>');

return __p.join("");
},

'ListBox': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<table class="no-border">\n		<thead class="no-border">\n			<tr>\n				<th rowspan="2">编号</th>\n				<th rowspan="2">业务员</th>\n				<th colspan="2" class="text-center">客户信息</th>\n				<th rowspan="2">收费状态</th>\n				<th rowspan="2">返佣状态</th>\n				<th rowspan="2">尾款状态</th>\n				<th rowspan="2">当前进度</th>\n				<th colspan="2" class="text-center">房产信息</th>\n			</tr>\n			<tr>\n				<th>姓名</th>\n				<th>证件号</th>\n				<th>房产证号</th>\n				<th>地址</th>\n			</tr>\n		</thead>\n		<tbody class="no-border-x no-border-y" id="J_ListBox">');
_p(this.ListItem(data));
__p.push('		</tbody>\n	</table>\n\n	<div class="j-pager"></div>\n');

return __p.join("");
},

'ListItem': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var List = data||[];
	var ShowInfos = ['Name','Phone','IdentityCode','Address'];

	var i=0,Cur;
	if (List.length>0) {

		for(;Cur=List[i++];) {
__p.push('	<tr data-hook="view" class="pointer-item" data-id="');
_p(Cur.ID);
__p.push('" data-data=\'');
_p(JSON.stringify(Cur));
__p.push('\'>\n		<td>SN00001</td>\n		<td>ye wu yuan</td>\n		<td colspan="2">\n			<table class="no-strip"><tr>\n				<td>李振文</td>\n				<td>430611198765432123</td>\n			</tr><tr>\n				<td>赵兰琴</td>\n				<td>515151515141414141</td>\n			</tr></table>\n		</td>\n		<td>已收费</td>\n		<td>已返佣</td>\n		<td>已退尾款</td>\n		<td>总经理审核中</td>\n		<td>20001234</td>\n		<td>福田区深圳市景田西路赛格景苑A802</td>\n	</tr>');

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
}
};
return tmpl;
});

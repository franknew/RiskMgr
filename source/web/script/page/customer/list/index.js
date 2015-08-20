//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/route"],function(require,exports,module){

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
 * 客户列表
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define.pack("./index",["jquery","risk/unit/route","./tmpl"],function(require, exports, module){
	var $ = require('jquery'),
		route = require('risk/unit/route'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			var list = [
					{name:'李振文',sn:'430611198607226515',job:'客户经理'},
					{name:'水电费',sn:'430611234234234234',job:'客户经理'},
					{name:'赚了钱',sn:'543345634234234443',job:'风控'},
					{name:'美丽',sn:'7544342342342367878',job:'财务'},
					{name:'房东的是',sn:'252435345345345345',job:'管理员'}
				];
			var html = tmpl.list({
				list:list
			});
			route.show({
				head:'客户信息',
				content:html
			});

			MOD.initEvent();
		},
		initEvent:function() {
			$('#J_useradd').click(function(ev) {
				ev.preventDefault();
				require.async('risk/page/customer/add/index',function(m) {
					m.show();
				});
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

	var List = data.list,
		JobClass = {	//职位颜色
			'1':'label-default',//灰色
			'2':'label-primary',//蓝色
			'3':'label-success',//绿色
			'4':'label-info',//天蓝
			'5':'label-warning',//黄
			'6':'label-danger'	//红
		};
__p.push('\n<div class="spacer spacer-bottom text-right">\n	<button type="button" class="btn btn-primary" id="J_useradd">新增客户</button>\n</div>');

	if (List && List.length) {
__p.push('<div class="list-group tickets todo">');

		var i=0,Cur;
		for(;Cur=List[i++];) {
	__p.push('\n	<div class="list-group-item pinter-item">\n		<span class="label ');
_p(JobClass[Cur.job]||'label-default');
__p.push(' pull-right">');
_p(Cur.job);
__p.push('</span> <img class="avatar" src="images/avatar/10.png" width="50" height="50" /> \n		<h4 class="name">');
_p(Cur.name);
__p.push('</h4>\n		<p>');
_p(Cur.sn);
__p.push('</p>\n	</div>');

		}
	__p.push('	<ul class="pagination">\n		<li><a href="#">«</a></li>\n		<li><a href="#">1</a></li>\n		<li><a href="#">2</a></li>\n		<li><a href="#">3</a></li>\n		<li><a href="#">4</a></li>\n		<li><a href="#">5</a></li>\n		<li><a href="#">»</a></li>\n	</ul>\n</div>');

	}else{
__p.push('<div class="alert alert-info" role="alert">\n	没有员工信息\n</div>');

	}
__p.push('');

return __p.join("");
}
};
return tmpl;
});

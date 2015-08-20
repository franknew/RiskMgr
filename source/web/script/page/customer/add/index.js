//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/ajax","risk/unit/route","risk/components/modal/index"],function(require,exports,module){

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
//add/src/index.js
//add/src/add.tmpl.html

//js file list:
//add/src/index.js
/**
 * 新增客户
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-18 12:22:58
 */

define.pack("./index",["jquery","risk/unit/ajax","risk/unit/route","risk/components/modal/index","./tmpl"],function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		modal = require('risk/components/modal/index'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			MOD.show();
			route.show('');
		},
		show:function(success) {
			modal.show({
				title:'新增客户',
				content:tmpl.add(),
				ok:function() {
					ajax.post({
						url:'RiskMgr.Api.LogonApi/Logon',
						form:this.form,
						success:function(data, textStatus, jqXHR) {
							//添加完毕，刷新客户列表页
							if (!success || !success()) {	//如果回调返回false则跳转至客户列表页
								route.load('page=customer/list');
							}
						}
					});
				}
			});
		}
	};

	return MOD;
});
//tmpl file list:
//add/src/add.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'add': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<table class="no-border">\n	<tbody class="no-border-x no-border-y">\n		<tr>\n			<th style="width:10%;"><span class="text-danger">*</span> 姓名</td>\n			<td style="width:40%;"><input type="text" class="form-control" name="name" required></td>\n			<th style="width:10%;"><span class="text-danger">*</span> 性别</td>\n			<td style="width:40%;">\n				<select class="form-control" name="sex" required>\n					<option> </option>\n					<option value="1">男</option>\n					<option value="2">女</option>\n				</select>\n			</td>\n		</tr>\n	</tbody>\n</table>');

return __p.join("");
}
};
return tmpl;
});

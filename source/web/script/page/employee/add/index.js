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
 * 新增员工
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
				title:'新增员工',
				content:tmpl.add(),
				ok:function() {
					ajax.post({
						url:'RiskMgr.Api.LogonApi/Logon',
						form:this.form,
						success:function(data, textStatus, jqXHR) {
							//添加完毕，刷新员工列表页
							if (!success || !success()) {
								route.load('page=employee/list');
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
__p.push('<div class="form-horizontal">\n	<div class="form-group">\n		<label class="col-sm-3 control-label">姓名</label>\n		<div class="col-sm-6">\n			<input type="text" class="form-control" name="name" required>\n		</div>\n	</div>\n	<div class="form-group">\n		<label class="col-sm-3 control-label">身份证号</label>\n		<div class="col-sm-6">\n			<input type="text" class="form-control" name="sn" required>\n		</div>\n	</div>\n	<div class="form-group">\n		<label class="col-sm-3 control-label">职位</label>\n		<div class="col-sm-6">\n			<select class="form-control" name="job">\n				<option>职位1</option>\n				<option>职位12</option>\n				<option>职位13</option>\n			</select>\n		</div>\n	</div>\n</div>');

return __p.join("");
}
};
return tmpl;
});

//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/route","risk/components/parsley/index"],function(require,exports,module){

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
//info/src/index.js
//info/src/user.tmpl.html

//js file list:
//info/src/index.js
/**
 * 员工个人资料
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-16 17:13:46
 */

define.pack("./index",["jquery","risk/unit/route","risk/components/parsley/index","./tmpl"],function(require, exports, module){
	var $ = require('jquery'),
		route = require('risk/unit/route'),
    	parsley = require('risk/components/parsley/index'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			var html = tmpl.user();
			route.show({
				head:'个人资料',
				content:html
			});
		},
		initEvent:function(box) {
		}
	};

	return MOD;
});
//tmpl file list:
//info/src/user.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'user': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<form class="form-horizontal group-border-dashed" action="#" data-parsley-validate>\n	<div class="form-group">\n		<label class="col-sm-3 control-label">姓名</label>\n		<div class="col-sm-6">\n			<input type="text" class="form-control" name="name" required>\n		</div>\n	</div>\n	<div class="form-group">\n		<label class="col-sm-3 control-label">身份证号</label>\n		<div class="col-sm-6">\n			<input type="text" class="form-control" name="sn" required>\n		</div>\n	</div>\n	<div class="form-group">\n		<label class="col-sm-3 control-label">职位</label>\n		<div class="col-sm-6">\n			<input type="text" class="form-control" name="job" disabled value="职位aaaa">\n		</div>\n	</div>\n	<div class="form-group">\n		<div class="col-sm-offset-3 col-sm-6">\n			<button type="submit" class="btn btn-primary">提交</button>\n		</div>\n	</div>\n</form>');

return __p.join("");
}
};
return tmpl;
});

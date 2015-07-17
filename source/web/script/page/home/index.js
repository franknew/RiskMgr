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
//home/src/index.js
//home/src/home.tmpl.html

//js file list:
//home/src/index.js
/**
 * 首页
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-08 22:28:39
 * @version $Id$
 */

define.pack("./index",["jquery","risk/unit/route","./tmpl"],function(require, exports, module){
	var $ = require('jquery');
	var route = require('risk/unit/route'),
		tmpl = require('./tmpl');
 
	var MOD = {
		initPage:function() {
			var html = tmpl.home();
			route.show(html);

			$('#LOGIN').click(function(e) {
				e.preventDefault();
				seajs.use('risk/components/login/index',function(m) {
					m.show();
				});
			});
		}
	}; 
	return MOD;
});
//tmpl file list:
//home/src/home.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'home': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div>adsfadsf</div>\n<p><a href="###" id="LOGIN">登录</a>\n<p><a href="http://203.195.163.209/ServiceDiscovery/ServiceDiscovery/Index/Default" target="_blank">后台文档</a>');

return __p.join("");
}
};
return tmpl;
});

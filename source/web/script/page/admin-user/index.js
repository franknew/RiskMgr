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
//admin-user/src/index.js
//admin-user/src/list.tmpl.html

//js file list:
//admin-user/src/index.js
/**
 * 用户管理，增删改用户
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define.pack("./index",["jquery","risk/unit/route","./tmpl"],function(require, exports, module){
	var $ = require('jquery'),
		route = require('risk/unit/route'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			var html = tmpl.list();
			route.show(html);
		}
	};

	return MOD;
});
//tmpl file list:
//admin-user/src/list.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'list': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="list-group todo">\n	<li class="list-group-item" href="#">\n		<span class="label label-primary pull-right">Normal</span> <img class="avatar" src="images/avatar_50.jpg"> \n		<h4 class="name">Jeff Hanneman</h4>\n		<p>My vMaps plugin doesn\'t work</p> \n		<span class="date">17 Feb</span>\n	</li>\n	<li class="list-group-item" href="#">\n		<span class="label label-danger pull-right">Urgent</span> <img class="avatar" src="images/avatar4_50.jpg"> \n		<h4 class="name">Jhon Doe</h4>\n		<p>My vMaps plugin doesn\'t work</p> \n		<span class="date">15 Feb</span>\n	</li>\n	<li class="list-group-item" href="#">\n		<span class="label label-warning pull-right">Medium</span> <img class="avatar" src="images/avatar1_50.jpg"> \n		<h4 class="name">Victor Jara</h4>\n		<p>My vMaps plugin doesn\'t work</p> \n		<span class="date">15 Feb</span>\n	</li>\n</div>');

return __p.join("");
}
};
return tmpl;
});

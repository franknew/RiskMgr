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
__p.push('<div class="row dash-cols">\n	<div class="col-sm-6 col-md-6">\n\n		<div class="block-flat">\n			<div class="header">\n				<h3>待办事项</h3>\n			</div>\n			<div class="content">\n				<div class="list-group">\n					<a href="#" class="list-group-item">奥特曼 <span class="badge">审核中</span></a>\n					<a href="#" class="list-group-item">奥特曼 <span class="badge">审核中</span></a>\n					<a href="#" class="list-group-item">奥特曼 <span class="badge">审核中</span></a>\n					<a href="#" class="list-group-item">奥特曼 <span class="badge">审核中</span></a>\n					<a href="#" class="list-group-item">奥特曼 <span class="badge">审核中</span></a>\n				</div>						\n			</div>\n		</div>\n	</div>	\n	<div class="col-sm-6 col-md-6">\n		<ul class="nav nav-tabs">\n			<li class="active"><a href="#home" data-toggle="tab">待办事</a></li>\n			<li><a href="#profile" data-toggle="tab">进行中</a></li>\n			<li><a href="#messages" data-toggle="tab">最近完成</a></li>\n		</ul>\n		<div class="tab-content">\n			<div class="tab-pane active cont" id="home">\n			homeeeee\n			</div>\n			<div class="tab-pane cont" id="profile">\n			hahahahahah\n			</div>\n			<div class="tab-pane" id="messages">\n			第三个slk艾山街道非\n			</div>\n		</div>\n	</div>		\n</div>');

return __p.join("");
}
};
return tmpl;
});

//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery"],function(require,exports,module){

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
//msg/src/index.js
//msg/src/msg.tmpl.html

//js file list:
//msg/src/index.js
/**
 * 消息提示
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-16 16:40:15
 */

define.pack("./index",["jquery","./tmpl"],function(require, exports, module){
	var $ = require('jquery'),
		tmpl = require('./tmpl');

	var MOD = {
		show:function(type,message,delay) {
			delay = delay || '3000';

			var typeMap = {
				'error':'alert-danger',
				'success':'alert-success',
				'warn':'alert-warning',
				'info':'alert-info'
			};
			var html = $(tmpl.msg({
				type:typeMap[type] || typeMap['info'],
				message:message
			}));
			html.bind('click',function() {
				$(this).remove();
			});
			html.css({
				fontSize:'14px',
				lineHeight:'1.7',
				position:'fixed',
				zIndex:'2000',
				minWidth:'330px',
				maxWidth:'400px',
				top:'50%',
				left:'50%',
				transform:'translateX(-50%) translateY(-50%)'
			}).appendTo(document.body);

			//删除
			setTimeout(function() {
				html.fadeOut(function() {
					this.remove();
				});
				html = null;
			}, delay);
		},
		success:function(message,delay) {
			return this.show('success',message,delay);
		},
		error:function(message,delay) {
			return this.show('error',message,delay);
		},
		info:function(message,delay) {
			return this.show('info',message,delay);
		},
		warn:function(message,delay) {
			return this.show('warn',message,delay);
		}
	};

	return MOD;
});
//tmpl file list:
//msg/src/msg.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'msg': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="alert ');
_p(data.type);
__p.push('" role="alert">');
_p(data.message);
__p.push('</div>');

return __p.join("");
}
};
return tmpl;
});

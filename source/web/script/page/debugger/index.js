//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/ajax","risk/unit/route","risk/components/parsley/index","risk/components/modal/index"],function(require,exports,module){

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
//debugger/src/index.js
//debugger/src/debug.tmpl.html

//js file list:
//debugger/src/index.js
/**
 * 新增客户
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-18 12:22:58
 */

define.pack("./index",["jquery","risk/unit/ajax","risk/unit/route","risk/components/parsley/index","risk/components/modal/index","./tmpl"],function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
    	parsley = require('risk/components/parsley/index'),
		modal = require('risk/components/modal/index'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			var html = tmpl.debug({
				cgi:'RiskMgr.Api.UserApi/Add',
				postdata:{
					"ID":"aaa",
					"Password":"aaa",
					"job":"1",
					"Name":"aaa",
					"card_id":"",
					"tel":""
				}
			});

			route.show({
				head:'测试后台接口',
				content:html
			});

			$('#J_DebugSubmit').click(function(ev) {
				ev.preventDefault();
				var data = JSON.parse($('#POSTDATA').val()),
					auto = !!$('#AUTO_FORM').is(':checked');

				ajax.post({
					url:$('#CGI').val(),
					data:data,
					dataType:'json',
					riskForm:!auto,
					complete:function(xhr) {
						$('#RS').html(JSON.stringify(JSON.parse(xhr.responseText),null,2));
					}
				});
			});


			$('#LOGIN').click(function(e) {
				e.preventDefault();
				seajs.use('risk/components/user/index',function(m) {
					m.login();
				});
			});

		}
	};

	return MOD;
});
//tmpl file list:
//debugger/src/debug.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'debug': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="text-right">\n	<button type="button" class="btn btn-primary" id="LOGIN">调用登录浮层</button>\n	<a class="btn btn-primary" href="http://203.195.163.209/ServiceDiscovery/ServiceDiscovery/Index/Default" target="_blank">后台文档</a>\n</div>\n\n<form class="form-horizontal" action="#">\n	<div class="form-group">\n		<label>接口(简写或者完整url)</label> <input id="CGI" value="');
_p(data.cgi||'');
__p.push('" type="text" placeholder="" required class="form-control">\n	</div>\n	<div class="form-group">\n		<label>数据(不需要填token)</label> <textarea style="height:150px" id="POSTDATA" class="form-control" required>');
_p(JSON.stringify(data.postdata||'',null,2));
__p.push('</textarea>\n	</div>\n	<div class="form-group">\n		<div class="checkbox">\n			<label><input type="checkbox" id="AUTO_FORM" checked="true"> 给数据自动包上一层form</label>\n		</div>\n	</div>\n	<button class="btn btn-primary" id="J_DebugSubmit" type="submit">Submit</button>\n</form>\n<pre class="pre-scrollable" style="width:500px" id="RS"></pre>');

return __p.join("");
}
};
return tmpl;
});

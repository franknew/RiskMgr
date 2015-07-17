//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["risk/components/modal/index","risk/unit/ajax","jquery","risk/components/msg/index"],function(require,exports,module){

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
//login/src/index.js
//login/src/login.tmpl.html

//js file list:
//login/src/index.js
/**
 * 登录组件
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-14 19:34:09
 */

define.pack("./index",["risk/components/modal/index","risk/unit/ajax","jquery","./tmpl","risk/components/msg/index"],function(require, exports, module){
	var modal = require('risk/components/modal/index'),
		ajax = require('risk/unit/ajax'),
		$ = require('jquery'),
		tmpl = require('./tmpl'),
		msg = require('risk/components/msg/index');

	var MOD = {
		show:function(conf) {
			modal.show({
				width:'430px',
				'title':'登录',
				content:tmpl.login(),
				cancelValue:'注册',
				cancel:function() {
					msg.error('注册啊注册')
				},
				ok:function() {
					ajax.request({
						url:'RiskMgr.Api.LogonApi/Logon',
						type:'post',
						dataType:'json',
						contentType:'application/json',
						data:'{\"username\":\"admin\",\"password\":\"admin\"}',
						success:function(data, textStatus, jqXHR) {
							console.log(data);
							msg.success('请求成功，数据：'+JSON.stringify(data,null,1))
						},
						error:function(XMLHttpRequest, textStatus, errorThrown) {
							msg.error('请求出错：\n'+XMLHttpRequest.status+' , '+errorThrown)
						}
					});
					return true;
				}
			});
		}
	};

	return MOD;
});
//tmpl file list:
//login/src/login.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'login': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div class="content">\n			<div class="form-group">\n					<div class="input-group">\n						<span class="input-group-addon"><i class="fa fa-user"></i></span>\n						<input type="text" placeholder="Username" id="username" class="form-control">\n					</div>\n			</div>\n			<div class="form-group">\n					<div class="input-group">\n						<span class="input-group-addon"><i class="fa fa-lock"></i></span>\n						<input type="password" placeholder="Password" id="password" class="form-control">\n					</div>\n			</div>\n	</div>');

return __p.join("");
}
};
return tmpl;
});

}
};
return tmpl;
});

//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["risk/components/modal/index","risk/unit/ajax","jquery","risk/components/msg/index","risk/unit/cookie"],function(require,exports,module){

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
//user/src/index.js
//user/src/login.tmpl.html

//js file list:
//user/src/index.js
/**
 * 登录者信息组件
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-14 19:34:09
 */

define.pack("./index",["risk/components/modal/index","risk/unit/ajax","jquery","./tmpl","risk/components/msg/index","risk/unit/cookie"],function(require, exports, module){
	var modal = require('risk/components/modal/index'),
		ajax = require('risk/unit/ajax'),
		$ = require('jquery'),
		tmpl = require('./tmpl'),
		msg = require('risk/components/msg/index'),
		cookie = require('risk/unit/cookie');

	var SKEY_NAME = 'skey';

	var MOD = {
		showLogin:function(success,error) {
			modal.show({
				width:'430px',
				'title':'登录',
				content:tmpl.login(),
				cancel:false,
				ok:function() {
					ajax.post({
						url:'RiskMgr.Api.LogonApi/Logon',
						form:this.form,
						success:function(data, textStatus, jqXHR) {
							//坑爹的后台居然连cookie都不能写，弱鸡
							var skey = data.Data;
							if (skey) {
								cookie.set(SKEY_NAME,skey);
								msg.success('登录成功');
								success && success();
							}else {
								msg.error('未知后台错误，导致无法登录');
								error && error();
							}
						}
					});
					return true;
				}
			});
		},
		isLogin:function() {
			var skey = cookie.get(SKEY_NAME);
			if (!skey) {
				return false;
			}
			return true;
		},
		userinfo:function() {}
	};

	return MOD;
});
//tmpl file list:
//user/src/login.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'login': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div class="content">\n			<div class="form-group">\n				<label>用户名</label> <input type="text" name="username" parsley-trigger="change" required="" placeholder="请输入用户名" class="form-control">\n			</div>\n			<div class="form-group">\n				<label>密码</label> <input type="password" name="password" parsley-trigger="change" required="" placeholder="请输入密码" class="form-control">\n			</div>\n	</div>');

return __p.join("");
}
};
return tmpl;
});

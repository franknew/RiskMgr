/**
 * 登录者信息组件
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-14 19:34:09
 */

define(function(require, exports, module){
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
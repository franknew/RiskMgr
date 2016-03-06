/**
 * 登录微信
 */

define(function(require, exports, module){
	var modal = require('risk/components/modal/index'),
		Ajax = require('risk/unit/ajax'),
		$ = require('jquery'),
		tmpl = require('./tmpl'),
		msg = require('risk/components/msg/index'),
		uri = require('risk/unit/uri'),
		cookie = require('risk/unit/cookie'),
		browser = require('risk/unit/browser');

	var SKEY_NAME = 'skey',
		WX_STATE = 'wxst',
		WX_HAS_JUMP = '_wxjump';	//标记微信跳转过一次，防止重复302

	var MOD = {
		/*
		* 微信登录
		* param opts {Object} 与index.js里的login参数含义一致
		* return {Boolen} true则表示走了微信登录，false表示没走
		*/
		login:function(opts) {
			opts = opts || {};

			var success = opts.success,
				error = opts.error,
				message = opts.message;

			//微信登录
			var params,wxCode,wxState,hasJump;

			//非测试环境先不检测wx
			//if (!~location.host.indexOf(':8080')) {
			//	return false;
			//}

			if (browser.client == 'wx') {
				params = uri(location.href);
				params = params && params.params || {};
				wxCode = params.code;
				wxState = params.state;
				hasJump = params[WX_HAS_JUMP];

				if (wxCode) {
					if (wxState == cookie.get(WX_STATE)) {//校验微信state
						msg.info('正在登录微信中，请稍后...<br/>开发中复制下面的code来校验你的接口: <br/>'+wxCode+'<br/>cookie:<br/>'+document.cookie,false);
						//发起请求登录微信
					}else{
						alert('你从哪里来，要到哪里去？');
						return false;
					}
				}else{	//没有code
					if (hasJump) {	//跳转过了就不再跳转
						return false;
					}

					location.replace(MOD.getUrl());
				}

				return true;
			}

			return false;
		}
	};

	return MOD;
});
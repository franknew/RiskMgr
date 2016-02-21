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
		* return {Boolen} true则表示走了微信登录，false表示没走
		*/
		login:function() {
			//微信登录
			var params,wxCode,wxState,hasJump;

			//非测试环境先不检测wx
			if (!~location.host.indexOf(':8080')) {
				return false;
			}

			if (browser.client == 'wx') {
				params = uri(location.href);
				params = params && params.params || {};
				wxCode = params.code;
				wxState = params.state;
				hasJump = params[WX_HAS_JUMP];

				if (wxCode) {
					if (wxState == cookie.get(WX_STATE)) {//校验微信state
						msg.info('正在登录微信中，请稍后...<br/>开发中复制下面的code来校验你的接口: <br/>'+wxCode,false);
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
		},
		getUrl:function() {
			var corp_id = 'wx4fff07646e8c3d22',
				redirect_uri = location.protocol+'//'+location.host+location.pathname+(location.search+(location.search?'&':'?')+WX_HAS_JUMP+'=1')+location.hash;
			var state = Math.ceil(Math.random()*198600),
				url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+corp_id+'&redirect_uri='+encodeURIComponent(redirect_uri)+'&response_type=code&scope=snsapi_base&state='+state+'&connect_redirect=1#wechat_redirect';

			cookie.set(WX_STATE,state);	//把state写入cookie，回来时再校验
			return url;
		}
	};

	return MOD;
});
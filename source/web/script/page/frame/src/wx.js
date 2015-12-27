/**
 * 微信相关
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		browser = require('risk/unit/browser');

	var corp_id = 'wx4fff07646e8c3d22',
		redirect_uri = 'http://203.195.163.209/wx.html',
		state = '123123123aadsf',
		url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+corp_id+'&redirect_uri='+encodeURIComponent(redirect_uri)+'&response_type=code&scope=snsapi_base&state='+state+'&connect_redirect=1#wechat_redirect';

	//url = ('https://qy.weixin.qq.com/cgi-bin/loginpage?corp_id='+corp_id+'&redirect_uri='+redirect_uri+'&state=123123');

	if (browser.client == 'wx') {
		alert('jump wx:'+location.href);

		location.href = url;
	}
});
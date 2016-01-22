/**
* seajs-config
* @date    2015-07-08 21:54:42
*/

;(function  () {
	var CDN = location.protocol+'//'+location.host+location.pathname.replace(/\/.*\..*/,'/');

	var jq = '2.1.4',	//高版本jquery
		jqLower = '1.11.3';	//低版本jquery，兼容<=ie8

	var ua = {}, agent = navigator.userAgent;
	if (window.ActiveXObject || window.msIsStaticHTML){
		ua.ie = 6;
		(window.XMLHttpRequest || (agent.indexOf('MSIE 7.0') > -1)) && (ua.ie = 7);
		(window.XDomainRequest || (agent.indexOf('Trident/4.0') > -1)) && (ua.ie = 8);
		(agent.indexOf('Trident/5.0') > -1) && (ua.ie = 9);
		(agent.indexOf('Trident/6.0') > -1) && (ua.ie = 10);
		(agent.indexOf('Trident/7.0') > -1) && (ua.ie = 11);

		if(ua.ie == 6 || ua.ie == 7 || ua.ie == 8){
			jq=jqLower;
		}
	}

	seajs.config({
		alias:{
			'jquery':CDN+'script/lib/jquery-'+jq+'/jquery.js',
			'bootstrap':CDN+'script/lib/bootstrap.js'
		},
		paths:{
			'risk':CDN+'script',
			'cdn':CDN
		},
		map:[
			[/(.*)\.js$/,'$1.js?_='+Math.random()]	//强制不缓存
		]
	});

	if (!(/\bchrome\b/i.test(agent) || /\bsafari\b/i.test(agent))) {	//仅支持chrome、safari看
		document.body.innerHTML = '<div style="width:550px;margin:100px auto;padding:40px;font-size:16px;text-align:center;background:#f2dede;border:1px solid #ECBBBB;"><p>(>﹏<)&nbsp;&nbsp;呃，您的浏览器有兼容性问题，请使用桌面版</p><p><a class="btn btn-warning" target="_blank" href="http://203.195.163.209/download/setup_risk.exe">点此下载桌面版</a></p></div>';
	}else {
		seajs.use(['jquery','bootstrap','risk/unit/route','risk/components/user/index','risk/page/frame/index'],function() {});
	}

})();
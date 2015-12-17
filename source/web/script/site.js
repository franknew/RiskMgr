/**
* seajs-config
* @date    2015-07-08 21:54:42
*/

;(function  () {
	var CDN = '//'+location.host+location.pathname.replace(/\/.*\..*/,'/');

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
		}
	});

	seajs.use(['jquery','bootstrap','risk/unit/route','risk/components/user/index','risk/page/frame/index'],function() {

	});

})();
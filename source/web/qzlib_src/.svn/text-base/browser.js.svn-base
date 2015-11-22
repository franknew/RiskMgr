/**
 * Tencent.All Rights Reserved.
 * User: lenzhang lenzhang@tencent.com
 * Date: 13-10-8
 * Time: 下午11:02
 * Project Qzone
 * @fileOverview browser模块
 */
define(function (require, exports, module) {

	var matched, browser;
	var mod = {};
	// Use of jQuery.browser is frowned upon.
	// More details: http://api.jquery.com/jQuery.browser
	// jQuery.uaMatch maintained for back-compat
	mod.uaMatch = function( ua ) {
		ua = ua.toLowerCase();

		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];

		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	};

	matched = mod.uaMatch( navigator.userAgent );

    /**
     * @exports browser
     * @type {{}}
     */
	browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}
	
	(function () {	//检测处于兼容模式下的真实ie版本
		var ua = {},
			agent = navigator.userAgent;
		if (browser.msie && (window.ActiveXObject || window.msIsStaticHTML)) {
			ua.ie = 6; 
			(window.XMLHttpRequest || (agent.indexOf('MSIE 7.0') > -1)) && (ua.ie = 7); 
			(window.XDomainRequest || (agent.indexOf('Trident/4.0') > -1)) && (ua.ie = 8); 
			(agent.indexOf('Trident/5.0') > -1) && (ua.ie = 9); 
			(agent.indexOf('Trident/6.0') > -1) && (ua.ie = 10); 
			(agent.indexOf('Trident/7.0') > -1) && (ua.ie = 11);
			browser.version = ua.ie+'';	//需要保持一致为字符串
		}
	})();

	//加入是否手机端的判断
	var ua = navigator.userAgent;
	var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
		//isAndroid = ua.match(/(Android)\s+([\d.]+)/),
        isAndroid = ua.match(/Android/),
		isMobile = isIphone || isAndroid || ipad,
		isWX = ua.match(/MicroMessenger\/([\d\.]+)/), //微信
		isQQ = ua.match(/QQ\/([\d\.]+)/), // 手机QQ
		isQzone = ua.indexOf('Qzone/') !== -1, // 手机Qzone
		isYYB = ua.match(/\/qqdownloader\/(\d+)(?:\/(appdetail|external|sdk))?/); // 应用宝
	browser.isMobile = !!isMobile;
	browser.platform = (function () {
		var rs = '';
		if(isIphone || ipad) {
			rs = 'ios';
		}else if(isAndroid) {
			rs = 'android';
		}else {
			rs = 'pc';
		}
		return rs;
	})();
	browser.client = (function(){
		var rs = '';
		if (isWX) {
			rs = 'wx';
		} else if (isQQ) {
			rs = 'qq';
		} else if (isQzone) {
			rs = 'qzone';
		} else if (isYYB) {
			rs = 'yyb';
		}
		return rs;
	})();

	return browser;
});
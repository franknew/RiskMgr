/**
 * URI解析
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-29 13:45:50
 */

define(function(require, exports, module){
	var Str = require('./string');

	var MOD = function(url) {
		var a = document.createElement('a'),
			rs;
		a.href = url;
		rs = {
			href: url,
			origin: undefined,
			protocol: a.protocol.replace(':', ''),
			hostname: a.hostname,
			host: a.hostname,
			port: a.port,
			search: a.search,
			hash: a.hash,
			pathname: a.pathname.replace(/^([^\/])/, '/$1'),
			params: (function () {
				var ret = {},
				seg = a.search.replace(/^\?/, '').split('&'),
				len = seg.length, i = 0;
				for (; i < len; i++) {
					if (!seg[i]) {
						continue;
					}
					var pos = seg[i].indexOf('=');
					ret[seg[i].substr(0, pos)] = Str.encodeHtml(decodeURIComponent(seg[i].substr(pos + 1)));	 //过滤xss
				}
				return ret;
			})()
		};
		return rs;
	};

	return MOD;
});

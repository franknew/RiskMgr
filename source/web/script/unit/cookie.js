/**
* cookie读写
* @authors viktorli (i@lizhenwen.com)
* @date    2015-07-16 19:38:09
*/

define(function(require, exports, module){

	var MOD = {
		get:function(key) {
			var r = new RegExp('\b' + name + '=([^;]*)'),
			m = document.cookie.match(r);
			return m && m[1] || '';
		},
		set:function(key,val,opts) {
			opts = opts || {};
			val = encodeURIComponent(val);

			var expire = opts.expire,	//过期时间，单位ms
				path = opts.path,	//生效的路径,/path
				domain = opts.domain;	//设置的域名，qq.com

			if(expire) {
				expire = new Date(expire).toGMTString();
			}
			document.cookie = (key + '=' + val + '; ') + 
							(expire ? ('expires=' + expire + '; ') : '') + 
							('path=' + (path || '/') + '; ') + 
							(domain?'domain=' + domain + ';' : '');

		}
	};

	return MOD;
});
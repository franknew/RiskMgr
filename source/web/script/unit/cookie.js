/**
* cookie读写
* @authors viktorli (i@lizhenwen.com)
* @date    2015-07-16 19:38:09
*/

define(function(require, exports, module){

	var MOD = {
		get:function(key) {
			var r = new RegExp('\\bskey=([^\\;]*)\\b'),
				m = document.cookie.match(r);
			return m && m[1] || '';
		},
		set:function(key,val,opts) {
			opts = opts || {};
			val = encodeURIComponent(val);

			var expire = opts.expire,	//过期时间，单位ms
				path = opts.path,	//生效的路径,/path
				domain = opts.domain;	//设置的域名，qq.com

			if (expire*1<=0) {//设置过期
				expire = 'Mon, 26 Jul 1997 05:00:00 GMT';
			} else{
				expire = expire?new Date(expire).toGMTString():undefined;
			}

			var cookie = (key + '=' + val + '; ') +
							(expire ? ('expires=' + expire + '; ') : '') +
							('path=' + (path || '/') + '; ') +
							(domain?'domain=' + domain + ';' : '');

			alert('cookie::::\n'+cookie)
			document.cookie = cookie;

			alert('document.cookie::::\n'+cookie)


		},
		del: function(key, opts) {
			this.set(key,'',{
				expire:-1
			});
		},
	};

	return MOD;
});
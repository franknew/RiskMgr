/**
 * @fileOverview cookie接口通用组件
 * @requires jQuery
 */
define(function(require,exports,module) {
    var _domainArr = document.domain.split('.'), _doArrLen = _domainArr.length,
        _domain = _domainArr.slice(_doArrLen - 2, _doArrLen).join('.');
        
	return {
        name: 'cookie',
        isSupported: typeof document.cookie == 'string',
        init: function(){},
        /**
         * set
         * @param name 必须
         * @param value 必须
         * @param domain  可选
         * @param path  可选
         * @param hour  可选
         */
        set: function(name, value, domain, path, hour) {
            var expire;
            if(hour) {
                expire = new Date();
                expire.setTime(expire.getTime() + 3600000 * hour);
            }
            document.cookie = (name + '=' + value + '; ') + (expire ? ('expires=' + expire.toGMTString() + '; ') : '') + ('path=' + (path || '/') + '; ') + ('domain=' + (domain || _domain) + ';');
        },

        get: function(name) {
            var r = new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'), m = document.cookie.match(r);
            return m && m[1] || '';
        },

        del: function(name, domain, path) {
            document.cookie = name + '=; expires=Mon, 26 Jul 1997 05:00:00 GMT; ' + ('path=' + (path || '/') + '; ') + ('domain=' + (domain || _domain) + ';');
        },

        clear: function() {
            var m = document.cookie.match(/\w+=[^;]*/g);
            if(m) {
                for(var i = 0, l = m.length; i < l; i++) {
                    this.del(m[i].split('=')[0]);
                }
            }
        }
    };
});
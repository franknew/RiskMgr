/**
 * @fileOverview util工具模块
 */
define(function (require, exports, module) {
    var $ = require('jquery');
    var cookie = require('./storage').cookie;
    /**
     * 工具类
     * @require jquery
     * @require ./storage
     * @exports util
     * @type {{parseUrl: parseUrl, formatLeftTime: formatLeftTime, toUrlParam: toUrlParam, appendUrlParam: appendUrlParam, encodeHtml: encodeHtml, decodeHtml: decodeHtml, cut: cut, _getRealLen: _getRealLen, insertStyleSheet: insertStyleSheet, imgdpr: imgdpr, formatDate: formatDate, jumpto: jumpto, getUrlParam: getUrlParam, getAntiCsrfToken: getAntiCsrfToken}}
     */
    var mod = {
        /**
         * 解析url
         * @method
         * @param {String} url 统一资源定位符，例如：http://www.pengyou.com
         * @return {Object} location对象
         * @example parseUrl('http://www.pengyou.com')
         */
        parseUrl: function (url) {
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
                        len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        var pos = seg[i].indexOf('=');
                        ret[seg[i].substr(0, pos)] = mod.encodeHtml(decodeURIComponent(seg[i].substr(pos + 1)));	 //过滤xss
                    }
                    return ret;
                })()
            };
            return rs;
        },

         /**
         * 格式化剩余时间
         * @param {Number} ms 剩余时间（毫秒）
         * @returns {String} 格式化后的剩余时间
         */
        formatLeftTime : function(ms) {
            var s = m = h = 0;
            s = parseInt(ms / 1000);
            s = s || 1;
            if(s >= 60) {
                m = parseInt(s / 60);
                s = s % 60;
            }
            if(m >= 60) {
                h = parseInt(m / 60);
                m = m % 60;
            }
            return [h ? h + '小时' : '', m ? m + '分' : '', s ? s + '秒' : ''].join('');
        },

         /**
         * 将对象转换为URL参数串，对象中的字段值不应该被Url转义，该方法会自动调用encodeURIComponent方法编码
         * @param {Object} obj 待转换对象
         * @returns {String} 转换后的URL参数串
         */
        toUrlParam : function(obj) {
            var res = [];
            if(!obj) {
                return '';
            }
            for(var p in obj) {
                if(obj.hasOwnProperty(p)) {
                    if(typeof obj[p] == 'string' && obj[p] || typeof obj[p] == 'number') {
                        res.push(p + '=' + encodeURIComponent(obj[p]));
                    }
                }
            }
            return res.join('&');
        },

        /**
         * 在URL后追加参数
         * @param {String} url 待追加的URL
         * @param {String|Object} param 追加的参数
         * @param {Boolean} isHashMode 参数是否追加在HASH里面
         * @returns {String} 追加后的URL
         */
        appendUrlParam : function(url, param, isHashMode) {
            if(typeof param == 'string') {
                param = param.replace(/^&/, '');
            } else {
                param = mod.toUrlParam(param);
            }
            if(!param) {
                return url;
            }
            if(isHashMode) {
                if(url.indexOf('#') == -1) {
                    url += '#' + param;
                } else {
                    url += '&' + param;
                }
            } else {
                if(url.indexOf('#') == -1) {
                    if(url.indexOf('?') == -1) {
                        url += '?' + param;
                    } else {
                        url += '&' + param;
                    }
                } else {
                    var tmp = url.split('#');
                    if(tmp[0].indexOf('?') == -1) {
                        url = tmp[0] + '?' + param + '#' + (tmp[1] || '');
                    } else {
                        url = tmp[0] + '&' + param + '#' + (tmp[1] || '');
                    }
                }
            }
            return url;
        },

         /**
         * 将字符串中的特殊字符转换为实体
         * @param {String} str 待转换字符串
         */
        encodeHtml : function(str) {
            return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\x60/g, '&#96;').replace(/\x27/g, '&#39;').replace(/\x22/g, '&quot;');
        },

        /**
         * 将字符串中的实体转换为原字符
         * @param {String} str 待转换字符串
         */
        decodeHtml : function(str) {
            return (str + '').replace(/&quot;/g, '\x22').replace(/&#0*39;/g, '\x27').replace(/&#0*96;/g, '\x60').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
        },

        /** 截断文本
		 * @param
		 */
		cut:function (str, bitLen, tails) {
			str = String(str);
			bitLen -= 0;
			tails = tails || "...";
			if (isNaN(bitLen)) return str;
			var len = str.length,
			i = Math.min(Math.floor(bitLen / 2), len),
			cnt = this._getRealLen(str.slice(0, i));
			for (; i < len && cnt < bitLen; i++) cnt += 1 + (str.charCodeAt(i) > 255);
			return str.slice(0, cnt > bitLen ? i - 1: i) + (i < len ? tails: "")
		},
		_getRealLen: function(s, isUTF8) {
			if (typeof s != "string") return 0;
			if (!isUTF8) return s.replace(/[^\x00-\xFF]/g, "**").length;
			else {
				var cc = s.replace(/[\x00-\xFF]/g, "");
				return s.length - cc.length + encodeURI(cc).length / 3;
			}
		},

        /**
         * 插入页面inline样式块
         * @param {string} sheetId 样式表style Element的ID
         * @param {string} [rules=""] 样式表规则内容
         * @returns {object} 返回样式表style Element对象

         * @example QZFL.css.insertStyleSheet("cssid", "body {font-size: 75%;}");
         */
        insertStyleSheet: function (sheetId, rules) {
            var node = document.createElement("style");
            node.type = 'text/css';
            sheetId && (node.id = sheetId);
            document.getElementsByTagName("head")[0].appendChild(node);
            if (rules) {
                if (node.styleSheet) {
                    node.styleSheet.cssText = rules;
                } else {
                    node.appendChild(document.createTextNode(rules));
                }
            }
            return node.sheet || node;
        },
        insertStyleLink: function (linkId, url) {
            var node = document.createElement("link");
            node.rel = 'stylesheet';
            linkId && (node.id = linkId);
            document.getElementsByTagName("head")[0].appendChild(node);
            if (url) {
                node.href = url;
            }
            return node;
        },        
        /**
         * 使用视网膜屏幕图片的时候，从该函数获取图片的点后缀
         * 例：imgurl = "logo"+mod.imgdpr()+"png";
         *
         * @return {*}
         */
        imgdpr: function () {
            if (window.devicePixelRatio > 1.3) {
                return imgdpr = "@2x.";
            } else {
                return ".";
            }
        },
        /**
         * 日期格式化方法
         * @param {Date} date 待格式化Date对象
         * @param {String} format 格式化的格式，例如：'yyyy-MM-dd HH:mm:ss'
         * @returns {String} 格式化后字符串
         */
        formatDate: function(date, format){
            var res = format, tt = '';
            res = res.replace(/yyyy|yy/, function($0) {
                if($0.length === 4) {
                    return date.getFullYear();
                } else {
                    return (date.getFullYear() + '').slice(2, 4);
                }
            }).replace(/MM|M/, function($0) {
                if($0.length === 2 && date.getMonth() < 9) {
                    return '0' + (date.getMonth() + 1);
                } else {
                    return date.getMonth() + 1;
                }
            }).replace(/dd|d/, function($0) {
                if($0.length === 2 && date.getDate() < 10) {
                    return '0' + date.getDate();
                } else {
                    return date.getDate();
                }
            }).replace(/HH|H/, function($0) {
                if($0.length === 2 && date.getHours() < 10) {
                    return '0' + date.getHours();
                } else {
                    return date.getHours();
                }
            }).replace(/hh|h/, function($0) {
                var hours = date.getHours();
                if(hours > 11) {
                    tt = 'PM';
                } else {
                    tt = 'AM';
                }
                hours = hours > 12 ? hours - 12 : hours;
                if($0.length === 2 && hours < 10) {
                    return '0' + hours;
                } else {
                    return hours;
                }
            }).replace(/mm/, function($0) {
                if(date.getMinutes() < 10) {
                    return '0' + date.getMinutes();
                } else {
                    return date.getMinutes();
                }
            }).replace(/ss/, function($0) {
                if(date.getSeconds() < 10) {
                    return '0' + date.getSeconds();
                } else {
                    return date.getSeconds();
                }
            }).replace('tt', tt);
            return res;
        },

        /**
         * 主要的使用场景是手机，用来在跳转的时候自动加上登录态
         */
        jumpto:function(url){

            require.async('./user', function (user) {
                var loginStatus = {
                    sid: user.getSid(),
                    B_UID: user.getUin()
                };
                window.location.href = mod.appendUrlParam(url,loginStatus);
            });
        },

        /**
         * URL参数提取方法
         * @param {String} name 参数名称
         * @param {Object} loc location对象，默认用window.location
         */
        getUrlParam : function(name, loc) {
            loc = loc || window.location;
            var r = new RegExp('(\\?|#|&)' + name + '=(.*?)(&|#|$)');
            var m = (loc.href || '').match(r);
            return mod.encodeHtml(decodeURIComponent(m ? m[2] : ''));
        },
        /**
         * 获取反CSRF Token
         * @returns {String} Token
         */
        getAntiCsrfToken: function () {
            var hash = 5381, str = cookie.get('skey');
            for (var i = 0, len = str.length; i < len; ++i) {
                hash += (hash << 5) + str.charAt(i).charCodeAt();
            }
            return hash & 0x7fffffff;
        },
        /*
        *将数字25555变成25,555的形式
        */
        formatNumber: function(score) {
            //将分数变成字符型
            var score = score + '';

            if (score.length > 3) {
                return score.substr(0, score.length % 3) + (score.length % 3 ? ',' : '') + score.substring(score.length % 3, score.length).match(/\d{3}/g).join(',');
            } else {
                return score;
            }

        }
    };
    return mod;
});
/**
 * @fileOverview user
 * @author lenzhang@tencent.com
 * @version 1.0
 * @requires jQuery, cookie
 * @update
 */
define(function (require, exports, module) {
    var $ = require('jquery'),
        cookie = require('./storage').cookie,
        util = require('./util'),
		browser = require('./browser');

	var isMobile = browser.isMobile;
	
	 function getparams(str) {
		 str = str || location.search;
		 var ret = {},
				 seg = str.replace(/[\?\#]/g, '&').split('&'),
				 len = seg.length, i = 0, s;
		 for (; i < len; i++) {
			 if (!seg[i]) {
				 continue;
			 }
			 s = seg[i].split('=');
             //fix sid=xxxx==
			 ret[s.shift()] = util.encodeHtml(decodeURIComponent(s.join('=')));
		 }
		 if(ret.sid){
			 ret.sid = encodeURIComponent(ret.sid);
		 }
		 return ret;
	 }

	var CACHE,
		DEFER;
    /**
     * user模块
     * @require jquery
     * @require ./storage
     * @require ./util
     * @require ./browser
     * @exports user
     * @type {{_getGParams, isLogin: isLogin, logout: logout, current, getUin: getUin, getSid: getSid, getToken: getToken, showLogin, userinfo: userinfo, avatar: avatar}}
     */
    var mod = {
		_getGParams:(function () {
			var _store = null;
			return function () {
				var rs = _store;
				if(!rs) {
					rs = _store = getparams((location.hash||'') + (location.search||''));
				}
				return rs;
			};
		})(),
        /**
         * 判断登录态
         */
        isLogin: function () {
            if(isMobile){
                //如果cookie里面有skey就用skey作为判断条件
				return cookie.get('skey')||(!!mod.getSid());
            }else{
				return mod.getUin();
            }

        },

        /**
         * 退出登录
         */
        logout: function () {
            var newUrl;

            //现将cookie中的登录信息清除
            $(['zzpaneluin', 'zzpanelkey', 'uin', 'skey']).each(function () {
                cookie.del(this);
            });
			
			cookie.del('keystr');	 //清理掉玩吧的cookie登录态
			localStorage.removeItem('sid');//清掉localstorage里的sid

            if (isMobile) {
                newUrl = location.href.replace(/([\?\&])sid=[^&]+(\?|\&|$)/, '$1')	//清理sid
                    .replace(/([\?\&])B_UID=[^&]+(\?|\&|$)/, '$1');	 //清理uin
                if(location.href === newUrl) {
                    location.reload();
                } else {
                    location.replace(newUrl);
                }

            } else {//PC                
                location.reload();
            }
        },
        /**
         * @method
         */
        current: (function () {
            var STORE = {};
            var GET = {
                uin: function () {
					var g_params = mod._getGParams();
					var uin = g_params.B_UID ? g_params.B_UID : g_params.uin ? g_params.uin : window.g_uin ? window.g_uin : "";
                    //没有sid为未登录
                    //需要有sid且有uin
                    if (!mod.getSid()) {
                        //mod.showLogin();
                        return "";
                    }
                    return decodeURIComponent(uin);
                },
                sid: function () {
					var g_params = mod._getGParams();
                    var sid = g_params.sid || cookie.get('keystr') || (localStorage || {})["sid"] || cookie.get('sid');	 //keystr是手机空间独立版种的
                    return decodeURIComponent(sid||'');
                }
            };
            return function (key) {
                var rs = STORE[key];

                if (!rs) {
                    rs = GET[key]();
                    STORE[key] = rs;
                }
                return rs;
            };
        })(),
        /**
         * 获取当前登录者QQ号
         */
        getUin: function () {
            if (isMobile&&!cookie.get('skey')) {
                return mod.current('uin');
            } else {
                var g = cookie.get, u, uin, r = /\D/g;
                uin = !!window.g_iLoginUin && g_iLoginUin > 10000 ? g_iLoginUin : ((u = g('uin').replace(r, '') - 0) && g('skey') && u > 10000 && u || 0);
                return uin;
            }
        },
        /**
         *
         * @returns {*}
         */
        getSid: function () {
            var sid = mod.current('sid');
            return sid;
        },
        /**
         * 获取反CSRF Token
         * @returns {String} Token
         */
        getToken: function () {
            var hash = 5381, str = cookie.get('skey');
            for (var i = 0, len = str.length; i < len; ++i) {
                hash += (hash << 5) + str.charAt(i).charCodeAt();
            }
            return hash & 0x7fffffff;
        },
        showLogin: (function () {
            var HAS_SHOW = false;	//标记只展示一次
            return function (key, callbackFn, exappid, pOpt, sOpt) {
                if (isMobile) {
                    // 登录返回地址
                    var returnUrl = location.href;
                    returnUrl = (returnUrl + '')
                        .replace(/(\?|&)sid=(.*?)(&|#|$)/, '$1$3')
                        .replace(/(\?|&)B_UID=(.*?)(&|#|$)/, '$1$3').replace('\?&', '?')
                        .replace(/&{2}/, '&')
                        .replace(/[&?]$/, ''); //移除uin、sid登录态
                       // .replace(/#.*$/,''); //移除uin、sid登录态，移除井号后面的（ptlogin会把参数错误的加在井号后面）

                    // 是否隐藏一键登录按钮
                    var hideOneKeyLogin = 0;
                    if (browser.client == 'yyb') { // 应用宝
                        hideOneKeyLogin = 1;
                    }

                    location.href = util.appendUrlParam('http://ui.ptlogin2.qq.com/cgi-bin/login', {
                        style: 9,
                        appid: 549000929,
                        pt_ttype: 1,
                        s_url: returnUrl,
                        pt_no_onekey: hideOneKeyLogin
                    });
                } else {
                    if (HAS_SHOW) {return false;}
                    HAS_SHOW = true;

                    /**
                     * ptlogin登录参数
                     * http://platform.server.com/ptlogin/no-lower-domain.html
                     */
                    var ptLoginParam = {
                        appid: 15000103,
                        s_url: location.href, // 成功跳转链接，该方式相当于刷新当前页面
                        style: 20
                    };
                    // 如果有自定义回调，则需要通过代理页面实现
                    if (callbackFn) {
                        ptLoginParam.s_url = 'http://qzs.qzone.qq.com/qzone/qzact/common/proxy/login_jump.html';
                        ptLoginParam.target = 'self';
                    }
                    var ptLoginUrl = util.appendUrlParam('http://xui.ptlogin2.qq.com/cgi-bin/xlogin', ptLoginParam);

                    require.async('v8/engine/popup/popup', function (Popup) {
                        var popup = new Popup();
                        popup.html('<iframe src="' + ptLoginUrl + '" frameborder="0" scrolling="no" allowTransparency="true"></iframe>');

                        var $frame = $(popup.node).find('iframe');
                        // 预先设置大小，防止首次大小抖动
                        $frame.attr({
                            width: 622,
                            height: 368
                        });
                        var ptlogin2_onClose = function() {
                            popup.close().remove();
                            HAS_SHOW = false;
                        };
                        var ptlogin2_onResize = function(width, height) {
                            $frame.attr({
                                height: height,
                                width: width
                            });
                            popup.reset();
                        };
                        var ptlogin2_doAction = function(data) {
                            if (typeof data === 'string') {
                                data = window.JSON ? JSON.parse(data) : (function(str) {eval('var __pt_json=' + str);return __pt_json;})(data);
                            }
                            switch (data.action) {
                                case 'close':
                                    ptlogin2_onClose();
                                    break;
                                case 'resize':
                                    ptlogin2_onResize(data.width, data.height);
                                    break;
                                default: // 什么也不做，便于扩展接口
                                    break;
                            }
                        };
                        // 登录框回调事件（关闭、大小改变）
                        if (typeof window.postMessage !== 'undefined') {
                            window.onmessage = function(event) {
                                event = event || window.event; // 兼容IE8
                                ptlogin2_doAction(event.data);
                            }
                        } else { //不支持postMessage的IE6，7 hack方法
                            navigator.ptlogin_callback = function(msg) {
                                ptlogin2_doAction(msg);
                            }
                        }
                        // 代理页面上挂载成功回调
                        if (callbackFn) {
                            $frame[0]._login_success = function() {
                                ptlogin2_onClose();
                                callbackFn();
                            }
                        }
                        // 模态框展示
                        popup.showModal();
                    });
                }
            };
        })(),
        /** 获取当前登录态用户的信息
         * @return defer对象
         */
        userinfo: function (opt) {
			var nocache, setting;
			if(typeof opt == 'object'){
				setting = opt;
			}else{
				nocache = opt;
			}
            if (CACHE && DEFER && !nocache) {//已经拉取到时，取缓存
                DEFER.resolve(CACHE);
            } else if (!DEFER) {	//没有defer时 才初始化
                DEFER = $.Deferred();
                var userinfoCgi;
                if(setting && setting.taotao) {    //使用taotao域名，默认不使用
                    userinfoCgi = 'http://taotao.qzone.qq.com/cgi-bin/fcg_get_user_info';
                }else {
                    userinfoCgi = 'http://activity.qzone.qq.com/fcg-bin/v2/fcg_get_user_info';
                }
                var cgiData = {uin: mod.getUin(),expire:1};
                //异步拉取
                require.async('./ajax',function(ajax){
                    ajax.request($.extend({
                        dataType: 'jsonp',
                        url: userinfoCgi,
                        //filterXSS:true,
                        qzoneCoolCbName: true,
                        data: cgiData,
                        success: function (da) {
                            var data = da && da.data;
							var vipIcon='';
                            if (data) {
                                if(isMobile){
                                    window.g_uin = data.uin;
                                }
								
								//生成黄钻icon的HTML
								if(data.vip) {
									vipIcon = '<i class="qz_vip_icon'+(data.deluxe?'_fla':'')+'_m_'+data.level+'"></i>';
									if(data.year) {
										vipIcon += '<img width="16" height="16" style="vertical-align:-4px;margin-left:1px;" src="http://qzonestyle.gtimg.cn/ac/qzone_v5/client/year_vip_icon.png">';
									}
								}

                                CACHE = {
                                    nick: util.encodeHtml(data.nick),
                                    nickThumb: util.encodeHtml(util.cut(data.nick, 8, '...')),
                                    uin: data.uin,
                                    vip: {
                                        'super': data.deluxe,	 //是否超级黄钻，super是关键字，不推荐使用，请使用deluxe
                                        deluxe: data.deluxe?data.deluxe:data.luxuryvip,	 //是否超级黄钻
                                        'year': data.year?data.year:data.nfvip,	//是否年费
                                        type: data.vip,	//是否黄钻，0非黄钻，1黄钻
                                        level: data.level,	//黄钻等级
                                        vipexpire: data.vip_expire,
                                        supervipexpire: data.supervip_expire
                                    },
									vipIcon:vipIcon,
                                    nowtime:data.now
                                };
                                DEFER.resolve(CACHE);

                            } else {
                                DEFER.reject();
                            }
                        },
                        error: function () {
                            DEFER.reject();
                        }
                    }, setting));
                });
            }
            return DEFER;
        },
		/** 用户头像
		 * @param uin 用户的qq号码
		 * @param size 尺寸，可选有：50/100
		 */
		avatar:function (uin,size) {
			size = size || '50';
			var rs = 'http://qlogo.store.qq.com/qzone/'+uin+'/'+uin+'/'+size;
			return rs;
		}
    };

    return mod;
});
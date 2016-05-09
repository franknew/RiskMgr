/**
 * @fileOverview ajax
 * @author woodsrong@tencent.com
 * @version 1.0
 * @requires jQuery
 * @requires jquery
 * @requires ./stat
 * @requires ./storage
 * @requires ./browser
 * @requires ./util
 * @requires ./user
 */
 alert(22)
define(function(require, exports, module){
	var $ = require('jquery'),

		stat = require('./stat'),
		//msgMod = require('./msg'),
		cookie = require('./storage').cookie,
		browser = require('./browser');

    var util = require('./util');
    var user = require('./user');

	var isMobile = browser.isMobile;
	/**
     * Ajax操作类
	 * @exports ajax
     * @requires jquery
     * @requires ./stat
     * @requires ./storage
     * @requires ./browser
     * @requires ./util
     * @requires ./user
	 */
	var Mod = {
		jsonpNum : 0,
		/** 发送一个ajax请求，封装了原生的jquery的ajax方法，区别为增加了如下配置参数
         /**
         * 发送一个ajax请求，封装了原生的jquery的ajax方法，区别为增加了如下配置参数
         * @param {Object} userConf 组件配置(下面的参数为配置项, 配置会写入属性, 详细的配置说明请看属性部分)
         * @param {Boolean} [userConf.autoVerify] 自动判断是否需要验证码，必须是json格式数据
         * @param {Boolean} [userConf.autoLogin] 自动判断是否需要登录
         * @param {Boolean} [userConf.checkLive] 是否需要检测登录态
         * @param {Boolean} [userConf.formsender] 是否使用FormSender模式发送数据，可选值true(utf-8编码), false, 'gbk', 'utf-8'
         * @param {Boolean} [userConf.filterXSS] 是否需要进行防xss处理（目前是通过遍历json object来转义字符串)
         * @param {String} [userConf.jsonpQzone] 是否启用qzone的callbackFun(旧版使用qzoneCoolCbName参数)
         * @param {Boolean} [userConf.forceLogin] 是否返回3000不跳登录
         */
		request: function(userConf){
			userConf = Mod._fixMobile(userConf);
			var conf = Mod._autoXSS($.extend({}, userConf));	//自动过滤qzone cgi的xss
			var uri = util.parseUrl(conf.url),
				locationHost = location.host,
				cross = (!/http:\/\//i.test(conf.url) || !uri || uri.host === locationHost) ? false : true,	//是否跨域
				cuin,
				xhr;
			conf.needLogin = typeof(conf.needLogin) == 'boolean' ? conf.needLogin : true;
			//默认数据类型为json
			if (!conf.dataType) {
				conf.dataType = 'json';
			}
			//填充g_tk
			if(conf.url.indexOf('g_tk=')===-1) {
				conf.url = conf.url+((conf.url.indexOf('?')===-1)?'?':'&')+'g_tk='+user.getToken();
			}
			//填充uin参数（常用参数）
			if(conf.url.indexOf('uin=')===-1 && !(conf.data&&conf.data.uin)) {
				conf.data = conf.data || {};	//防止空data
				conf.data.uin = user.getUin();
			}

			var tmpFlag	= false,	//超时标记
				tmpTimeoutDelay = 10000,		//超时时间
				tmpTimeout 	= null;		//超时定时器
			var tmpSuccess = conf.success,
				tmpError = conf.error;
			var tmpStart = +new Date();
			//入侵config的success，做一些网站公用的返回码判断
			if(conf.dataType==='jsonp' || conf.dataType==='json') {
				//jQuery目前对jsonp类型数据的超时机制会把callback函数清掉
				//如果响应在超时后返回，会报callback不存在
				if((conf.dataType == 'jsonp' || conf.dataType == 'json') && (conf.timeout > 0||tmpTimeoutDelay > 0)){
					if(conf.timeout){
						tmpTimeoutDelay = conf.timeout;
					}
					tmpTimeout = setTimeout(function(){
						tmpFlag = true;
						if(conf.error){
							conf.error(xhr, 'timeout');
						}
						//返回码上报 移到 conf.error里面了，之前会重复上报
					}, tmpTimeoutDelay);
					//去除jQuery的timeout处理
					conf.timeout = 0;
				}

				conf.success = function (da) {
					clearTimeout(tmpTimeout);
					//超时返回的结果不再处理
					if(tmpFlag){
						return;
					}
					var err = da && da.code,
						subcode = da && da.subcode,
						args = arguments,
						tmpEnd = +new Date(),
						tmpDelay = tmpEnd - tmpStart;

					//V4返回码
					stat.returnCodeV4({
						cgi: conf.url,
						type: err === 0 ? 1 : 3,//1:成功，3:逻辑错误
						code: subcode,
						delay: tmpDelay
					});

					//自动登录
					//不存在这个字段默认就登录吧
					if(err===-3000 && (!conf.hasOwnProperty('forceLogin') || conf.forceLogin)) {
						user.showLogin();
						return false;
					}

					//验证码校验，只要autoVerify!==false，就进行自动校验

					var verifyMode = ('autoVerify' in conf) ? conf.autoVerify : true;

					if (verifyMode !== false) {
						var needVerify;
                        if ($.inArray(err,[-2000002, -2000003, -3001, -3002]) !== -1) {
                            needVerify = true;
                        }

						if (needVerify) {
                            Mod.showCAPTCHA(userConf, err, tmpSuccess, tmpError, args);
							return false;
						}
					}
					tmpSuccess && tmpSuccess.apply(null,args);
				};
			}

			//入侵config的error
			conf.error = function (xhr, type) {
				/**
				 * bug fixed
				 * 防止出错后还执行超时处理
				 */
				clearTimeout(tmpTimeout);
				var tmpEnd 	= new Date().getTime(),
					tmpDelay 	= tmpEnd - tmpStart,
					sampling,
					code,status,
					err;

				//V4返回码
				stat.returnCodeV4({
					cgi: conf.url,
					type: 2,//2:网络错误 工
					//jsonp超时code=-400, 格式错误 code=511, 其他网络错误code=status || 502
					//IE jsonp 404 500会返回 type='parsererror'
					code: (type && {'timeout': -400, 'parsererror': 511}[type]) || (xhr && xhr.status) || 999,
					delay: tmpDelay
				});
				tmpError && tmpError.apply(null,arguments);
			};
			if (conf.formsender) { //formsender模式，gbkframe是兼容旧参数
				Mod._fsRequest(conf, uri.host);
			} else {
				if (!cross || conf.dataType == 'jsonp' || isMobile) {	//移动端都用跨域header
					/**
					 * qzone callback用法
					 */
					if(!!conf['jsonpQzone']||!!conf['qzoneCoolCbName']){

						if(!conf.data)conf.data={};

						conf.data['callbackFun'] = 'mallv8'+Mod.jsonpNum;
						Mod.jsonpNum++;
						conf.jsonpCallback = conf.data['callbackFun'] + "_Callback";
					}

					//跨域post传cookie
					if(cross && isMobile){
						conf.xhrFields = {
							withCredentials : true
						}
					}

					//如果后台不支持自定义callback，需要走队列
					if (!(conf['qzoneCoolCbName']||conf['jsonpQzone'])&&conf.jsonpCallback) {
						xhr = Mod._jsonpQueue.excute(conf);
					} else {
						xhr = $.ajax(conf);
					}
					return xhr;
				} else {
					return Mod._fsRequest(conf, uri.host);
				}
			}
		},
        /**
         * 兼容手机端的touch页
         * @param {Object} config 配置信息
         * @param {String} config.dataType json
         * @param {Object} config.data
         * @param {formsender} config.formsender
         */
		_fixMobile:function (config) {
            if (isMobile) {
                var sid = user.getSid(),
                    dataType = config.dataType,
                    skey = cookie.get('skey'),
                    uin = cookie.get('uin');
                config.data = config.data || {};
                // 没有skey，并且有sid，使用sid校验
                if (!(skey && uin) && sid) {
                    config.data.login_type = 2;
                    config.data.login_key = sid;
                    // 参数里面加上sid，兼容非活动的cgi
                    config.data.sid = sid;
                }
                if (!dataType || dataType == 'json' || config.formsender) {
                    config.data.format = config.data.format || 'json'; // 手机端默认用json格式
                }
                if (config.formsender) { // fs的跨域，都换成后台加跨域header
                    config.formsender = undefined;
                    config.type = 'post';
                    config.dataType = 'json';
                }
			}
			return config;
		},
        /**
         * @method
         * @desc 显示验证码
         * @param {Object} userConf
         * @param {Object} err
         * @param {Function} tmpSuccess
         * @param {Function} tmpError
         * @param {Arguments} args
         */
        showCAPTCHA: (function(){
            var _userConf = {};
            var _alreadyShow = false;
            var getCaptchaUrl = function(){
                return 'http://captcha.qq.com/getimage?aid=549000918&' + Math.random();
            };
            return function (userConf, err, tmpSuccess, tmpError, args) {
                _userConf = userConf;
                var validMark = '_isValidRequest';
                if(isMobile){

                }else{
                    var dia = require.async('mall.v8/common/popupDialog/index', function (popupDialog) {
                        var tmpl = require('./tmpl');
                         popupDialog.popupDialog('验证码', tmpl.captchaDialog(getCaptchaUrl()), 372, 181, null, {
                            noscroll: true
                        }, {
                            onLoad: function (dia) {
                                //QZ dialog 有bug，临时修复一下
                                dia.onUnload = dia.opts.onUnload;
                                $(dia.dialogContent).delegate('.j_changeimg','click',function(){
                                    $(dia.dialogContent).find('.j_imgVerify').attr("src",getCaptchaUrl());
                                });
                            },
                            onUnload: function (dia) {
                                //tmpSuccess.apply(null,args);
                                //Mod.request(_userConf);
                            },
                            buttonConfig: [
                                {
                                    type: QZFL.dialog.BUTTON_TYPE.Confirm,
                                    text: '确定',
                                    preventDefault: false,//定义true 则不关闭dialog
                                    tips: '确定',
                                    clickFn: function(dia){
                                        var key = $('#captchaDialog input').val();
                                        _userConf.data = _userConf.data || {};
                                        var vkey;
                                        if (_userConf.autoVerifyKey) {
                                            vkey = _userConf.autoVerifyKey;
                                        }
                                        else {
                                            //规范的返回码，用规范的参数key
                                            if ($.inArray(err, [-2000002, -2000003, -3001, -3002]) !== -1) {
                                                vkey = 'verifyCode';
                                            }
                                        }
                                        _userConf.data[vkey] = key; //填上验证码
                                        //验证码id
                                        _userConf.data.verifysession = cookie.get('verifysession');

                                        //还原被改写的回调，避免重复改写
                                        _userConf.success = tmpSuccess;
                                        _userConf.error = tmpError;
                                        //标记是验证码的请求
                                        _userConf[validMark] = true;
                                        Mod.request(_userConf);
                                    }
                                },
                                {
                                    type: QZFL.dialog.BUTTON_TYPE.Cancel,
                                    text: '取消',
                                    tips: '取消',
                                    clickFn: function () {
                                        tmpSuccess.apply(null,args);
                                    }
                                }
                            ]
                        });
                    });
                }

            };
        })(),
        /**
         * jsonp请求
         * @param {object} conf 请求配置对象，对象属性同jquery
         */
		jsonp : function(conf){
			conf.dataType = 'jsonp';
			return Mod.request(conf);
		},

		_jsonpQueue : {
			queuesMap : {},
			proxyCallback : function(queueObj , name , callback , params){
				if(callback) {
					callback.apply(window, params);
				}
				var queues = queueObj.queuesMap[name];
				if(queues.ajaxQueues.length > 0) {
					var q = queues.ajaxQueues.shift();
					$.ajax(q);
				 } else {
					queues.onsending = false;
					queueObj.timehandller = null;
				 }
			},
			excute : function(conf){
				var queues = this.queuesMap[conf.jsonpCallback],
					self = this,
					succCallback = conf.success,
					errorCallback = conf.error;
				conf.success = function(callback){
					self.proxyCallback(self, conf.jsonpCallback, succCallback, arguments);
				};
				conf.error = function(callback){
					self.proxyCallback(self, conf.jsonpCallback, errorCallback, arguments);
				};

				if (!queues) {
					queues = this.queuesMap[conf.jsonpCallback] = {
						ajaxQueues: [],
						onsending: false
					};
				}
				if (queues.onsending) {
					queues.ajaxQueues.push(conf);
					//过一定时间后解除ajax发送限制，否则后面的请求一直堆在队列里
					/*setTimeout(function(){
						var conft = conf;
						console.log('timeout',conft);
						queues.onsending = false;
					},conf.timeout||2000);*/
				}
				else {
					queues.onsending = true;
					return $.ajax(conf);
				}
			}
		},

		//跨域formSender模式
		_fsRequest: (function () {
			var createFrame = function(conf, domain){
				var dm = 'qzs.qq.com',
					url, f = document.createElement('iframe'),
					host = location.host,
					root,fileName;
				if(host.indexOf('pengyou.com')!==-1) {
					dm = 'imgcache.pengyou.com';
				}else if(host.indexOf('qzone.com')!==-1) {
					dm = 'imgcache.qzone.com';
				}
				root  = 'http://'+dm+'/qzone/mall/v8/lib/mall/misc/';
				if (conf.formsender === 'gbk') {//gbk方式传输,gbkframe是兼容旧参数
					fileName = 'formsender_gbk.htm';
				}else {//utf8的临时用代理页解决，可考虑换成js create iframe
					fileName = 'formsender.htm';
				}
				url = root+fileName+'?max_age=2592000'
				f.src = url;
				f.style.position = 'absolute';
				f.style.top = '-9999px';
				f.style.left = '-9999px';
				f.setAttribute('tabindex', '-1'); //可用性，照顾盲人gg
				f.callback = function(data){
					conf.success(data);
					$(this).remove();
				};
                conf.data['g_tk'] = user.getToken();
				f.postData = {
					uri: conf.url,
					method: conf.type || 'post',
					data: conf.data
				};
				$('body').append(f);
			};
			return function(conf, domain){
				createFrame(conf, domain);
			};
		})(),

		/**
         * 自动过滤qzone cgi的xss
		 */
		_autoXSS:(function () {
			//使用
			//http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
			var _toString = Object.prototype.toString;	//节省开销
			var _XSS = {
				go:function (item) {
					var rs = item;
					if(!item) {return rs;}

					var itemType = typeof(item),
						 itemObjType;
					if(itemType==='string') {
						rs = this.filter(item);
					}else if(itemType==='object') {
						itemObjType = _toString.call(item);
						if(itemObjType === '[object Array]') {
							rs = this.parseArray(item);
						}else if(itemObjType === '[object Object]') {
							rs = this.parseObject(item);
						}
					}
					return rs;
				},
				parseArray:function(obj) {
					var i=0, l = obj.length,
						item;
					for(; i < l; ++i) {
						obj[i] = this.go(obj[i]);
					}
					return obj;
				},
				parseObject:function (obj) {
					for(var key in obj) {
						if(obj.hasOwnProperty(key)) {
							obj[key] = this.go(obj[key]);
						}
					}
					return obj;
				},
				filter:function (str) {
					str = str.replace(/\u0026/g,'&amp;')	//与号 &
								.replace(/\u0022/g,'&quot;')	//双引号 "
								.replace(/\u003C/g,'&lt;')	 // <
								.replace(/\u003E/g,'&gt;')	 // >
								.replace(/\u0027/g,'&#39;');	// 单引号'
					return str;
				}
			};
			return function (conf) {
				var isQzcgi = conf.qzone,	//代表是qzone cgi，默认需要xss，如不需要请设为"noxss"（qzone cgi规范不会对<>'"&进行转义）
					 dataType = conf.dataType,
					 needXSS = !!( (!dataType || dataType==='json' || dataType==='jsonp' || conf.formsender || conf.gbkframe) &&	//仅支持是json数据格式的
										  (conf.filterXSS || (isQzcgi && isQzcgi!=='noxss'))	 //需要手动配置filterXSS 或者是 空间的cgi
										);
				var tmpSuccess = conf.success;
				if(needXSS) {
					conf.success = function (data, textStatus) {
						data = _XSS.go(data);
						tmpSuccess(data, textStatus);
					};
				}
				return conf;
			};
		})()
	};

	return Mod;
});
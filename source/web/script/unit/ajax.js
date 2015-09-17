/**
 * ajax请求
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-14 21:27:12
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		msg = require('risk/components/msg/index'),
		cookie = require('risk/unit/cookie'),
		loading = require('risk/unit/loading'),
		Serialize = require('./serialize');

	var HOST_TEST = '127.0.0.1',	//测试环境
		HOST_REAL = location.host,	//线上域名
		DEBUG = HOST_REAL==HOST_TEST,	//标记测试环境
		SKEY_NAME = 'skey';

	var MOD = {
		/** 请求ajax，基本参数和ajax一致，扩展的参数有：
		 * @param form {DOM} form表单，传递进来后会自动读取form表单内的数据
		 * @param [formDropEmpty=false] {Boolen} 传了form参数时，如果formDropEmpty=true，则扔掉空白value的值
		 * @param [riskForm=true] {Boolen} data会被包一层form，适用于risk后台
		 */
		request:function(conf) {
			var oriConfig = $.extend({},conf);

			var url = conf.url,
				form = conf.form;

			var loadingObj = loading.show();//显示通用的loading

			//统一处理回调
			conf.success = this._formatSuccess(conf.success,url,conf,oriConfig);
			conf.error = this._formatError(conf.error,url,conf,oriConfig);
			conf.complete = this._formatComplete(conf.complete,url,conf,oriConfig,loadingObj);

			//如果传递进来form表单，则自动解析表单字段为data
			if (form) {
				conf.data = conf.data || {};
				conf.data = $.extend(conf.data,Serialize(form,conf.formDropEmpty));
				delete conf.form;
			}

			conf = this._fixRisk(conf);	//兼容risk项目专用

			return $.ajax(conf);
		},
		get:function(conf) {
			conf = $.extend({
				type:'get',
			},conf);
			return this.request(conf);
		},
		post:function(conf) {
			conf = $.extend({
				type:'post',
			},conf);
			return this.request(conf);
		},
		//从form表单里获取data数据
		_formData:function(elem,drop) {

			var data = $(elem).serializeArray(),
				rs = {};
			var i=0,cur;
			for(;cur=data[i++];) {
				if (!(drop && !cur.value)) {
					rs[cur.name] = cur.value;
				}
			}

			return rs;
		},
		//统一兼容risk项目的一些通用传参
		_fixRisk:function(conf) {
			conf.url = this._formatRiskUrl(conf.url);
			conf = $.extend({
				type:'post',
				dataType:'json',
				contentType:'application/json',
			},conf);

			var data = conf.data;

			if (!conf.riskForm) {	//risk需要包一层form
				data = {
					form:conf.data||{}
				};
				conf.data = data;
			}

			conf.type = 'post';	//后台强制都走post了

			conf.data = conf.data || {};
			conf.data.token = cookie.get(SKEY_NAME);
			conf.data = JSON.stringify(conf.data);

			return conf;
		},
		_formatRiskUrl:function(url) {
			var rs = url,
				host = '//'+HOST_REAL;

			if (!/^(http:\/\/|\/\/)/.test(url)) {	//没有加http，走risk模块名的方式
				if (DEBUG && navigator.userAgent.indexOf(' Mac OS X ')!==-1) {//mac下的测试环境才用反向代理
					host = '//'+HOST_TEST+'/cgi';	//测试环境用反向代理，解决跨域问题
				}
				rs = host+'/Service/Execute/'+url;
			}

			return rs;
		},
		_formatSuccess:function(success,url,config,oriConfig) {
			var tmp = success,
				rs = function(data, textStatus, jqXHR) {
					var code = data.Code,
						error = data.IsError,
						message = data.ErrorMessage;
					if (error) {
						switch (code){
							//case 1: //要权限
							//break;
							case 2:
							case 3: //登录
								seajs.use('risk/components/user/index',function(m) {
									m.login({
										message:message || '请登录后操作。',
										success:function() {//success
											MOD.request(oriConfig);//重新请求
										}
									});
								});
							break;
							default: //错误默认提示
								//message = MOD._errorMessage(code,message,url);
								//msg.error(message);
								config.error(jqXHR,message);
						}
					}else {
						success && success(data.Data, data, jqXHR);
					}
				};
			return rs;
		},
		_formatError:function(error,url) {
			if (!error) {
				return function(XMLHttpRequest, textStatus, errorThrown) {
					msg.error(MOD._errorMessage('http '+XMLHttpRequest.status,textStatus,errorThrown,url));
				};
			}

			return error;

			//XMLHttpRequest, textStatus, errorThrown
		},
		_formatComplete:function(complete,url,config,oriConfig,loadingObj) {
			loadingObj = loadingObj;
			var tmp = complete,
				sysComplete = function() {
					loadingObj.hide();
					loadingObj = null;
				},
				rs;
			if (!tmp) {
				rs = sysComplete;
			}else {
				rs = function(XMLHttpRequest, textStatus) {
					sysComplete.call(this,XMLHttpRequest, textStatus);
					tmp.call(this,XMLHttpRequest, textStatus);
				};
			}

			return rs;
		},
		//获取统一的错误提示文案
		_errorMessage:function(code,message,errorThrown,url) {
			return '('+code+') '+message+(errorThrown?'<br/><span style="color:#C78583;font-size:12px;">'+errorThrown+'</span>':'')+(url?'<br/><span style="color:#C78583;font-size:12px;">'+url+'</span>':'');
		}
	};
	return MOD;
});
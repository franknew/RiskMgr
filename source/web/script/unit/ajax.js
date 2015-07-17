/**
 * ajax请求
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-14 21:27:12
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		msg = require('risk/components/msg/index'),
		cookie = require('risk/unit/cookie');

	var DEBUG = location.host=='127.0.0.1';	//标记测试环境

	var MOD = {
		/** 请求ajax，基本参数和ajax一致，扩展的参数有：
		 * @param form {DOM} form表单，传递进来后会自动读取form表单内的数据
		 */
		request:function(conf) {
			var url = conf.url,
				form = conf.form;
			
			//如果传递进来form表单，则自动解析表单字段为data
			if (form) {
				conf.data = this._formData(form);
				delete conf.form;
			}

			//统一处理回调
			conf.success = this._formatSuccess(conf.success,url);
			conf.error = this._formatError(conf.error,url);

			conf = this._fixRisk(conf);	//兼容risk项目专用

			$.ajax(conf);
		},
		get:function(conf) {
			conf = $.extend({
				type:'get',
			},conf);
			this.request(conf);
		},
		post:function(conf) {
			conf = $.extend({
				type:'post',
			},conf);
			this.request(conf);
		},
		//从form表单里获取data数据
		_formData:function(elem) {
			var data = $(elem).serializeArray(),
				rs = {};
			var i=0,cur;
			for(;cur=data[i++];) {
				rs[cur.name] = cur.value;
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

			conf.type = 'post';	//后台强制都走post了，shit
			
			conf.data = conf.data || {};
			conf.data.token = cookie.get('skey');
			conf.data = JSON.stringify(JSON.stringify(conf.data));	//后台要传这种奇葩格式，shit

			return conf;
		},
		_formatRiskUrl:function(url) {
			var rs = url,
				host = '//203.195.163.209';

			if (!/^(http:\/\/|\/\/)/.test(url)) {	//risk模块名的方式
				if (DEBUG) {
					host = '//127.0.0.1/cgi';	//测试环境用反向代理，解决跨域问题
				}
				rs = host+'/RiskMgr/SOAServiceHost.svc/Execute/'+url;
			}

			return rs;
		},
		_formatSuccess:function(success,url) {
			if (!success) {
				return success;
			}

			var tmp = success,
				rs = function(data, textStatus, jqXHR) {
					var code = data.Code,
						error = data.IsError,
						message = data.ErrorMessage;
					if (error) {
						switch (code){
							//case 1: //要权限
							//break;
							case 2: //登录
								seajs.use('risk/components/login/index',function(m) {
									m.show();
								});
							break;
							default: //错误默认提示
								msg.error(MOD._errorMessage(code,message,url));
						}
					}else {
						success(data, textStatus, jqXHR);
					}
				};
			return rs;
		},
		_formatError:function(error,url) {
			if (!error) {
				return function(XMLHttpRequest, textStatus, errorThrown) {
					msg.error(MOD._errorMessage('http '+XMLHttpRequest.status,textStatus+','+errorThrown,url));
				};
			}

			return error;

			//XMLHttpRequest, textStatus, errorThrown
		},
		//获取统一的错误提示文案
		_errorMessage:function(code,message,url) {
			return '('+code+') '+message+(url?'<br/><span style="color:#C78583;font-size:12px;">'+url+'</span>':'');
		}
	};
	return MOD;
});
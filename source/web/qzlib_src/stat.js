/**
 * @fileOverview 上报系统独立封装版
 * @auther dollydeng
 * @require jquery
 * @require ./user
 * @exports stat
 */
define(function (require, exports, module) {
	var $ = require('jquery'),
		user = require('./user');
	var _imgId = 1;
    /**
     * @require jquery
     * @require ./user
     * @exports stat
     * @type {{}}
     */
	var stat = {};

    /**
     * 上报函数
     * @param url
     * @param rate 默认100，全上报
     * @param timeout  默认0，立即上报
     * @private
     */
	stat._send = function(url, rate,timeout,opt){
		rate = rate || 100;
		timeout = timeout || 0;
        if(opt && typeof opt.callback == "function"){
            timeout = timeout || 500;
        }
		if(rate< 100 && Math.random()*100 > rate){
			return;
		}
		var img = new Image();
		//避免函数执行后img马上被销毁，需要保存在window下，但需要手动销毁
		img.g_stat_reportId = _imgId;
		window.g_stat_report = window.g_stat_report || {};
		window.g_stat_report[_imgId] = img;
		_imgId++;
		img.onload = img.onerror = img.ontimeout = function(){
            if(opt && typeof opt.callback == "function"){
                opt.callback();
            }
			delete window.g_stat_report[this.g_stat_reportId];
		};
		if(timeout){
			setTimeout(function(){
				img.src = url;
			},timeout);
		}else{
			img.src = url;
		}
	};

    /**
     *
     * @returns {string}
     * @private
     */
	stat._pgvGetUserInfo=function(){
		var m=document.cookie.match(/(^|;|\s)*pvid=([^;]*)(;|$)/);
		if(m && m.length>2){
			pvid = m[2];
		}else{
			var pvid = (Math.round(Math.random()* 2147483647)*(new Date().getUTCMilliseconds()))%10000000000;
			document.cookie="pvid="+pvid+"; path=/; domain=qq.com; expires=Sun, 18 Jan 2038 00:00:00 GMT;";
		}
		return "&pvid="+pvid;
	};
    /**
     *
     * @param {string} [sDomain = location.hostname] 请求pv统计主虚域名
     * @param {string} [path = location.pathname] 请求pv统计虚路径
     * @param {object} [opts = {
					referURL: "http://xxxxxxxx", //你需要统计的来源URL，可以随便写，合法的URL即可，这里多说一句，有与qzone这样的域名是 号码.qzone.qq.com的情况，来源会非常多，为了不压垮PGV的存储，这里最好能归类来源域名，虚拟化，下同
					referDomain: "xxxx.xxx.com", //如果你想分开写，那么可以直接写个来源URL的虚域名
					referPath: "/xxxxx", //如果你想分开写，那么可以直接写个来源URL的虚路径
					timeout: 500, 统计请求发出时延，默认500ms
				}] 可选参数
     *
     */
	stat.reportPV= function(domain, pathname, opt) {
		domain = domain || 'mall.qzone.qq.com';
		pathname = pathname || (window.location && window.location.pathname) || '/';
		opt = $.extend({
			timeout: 500,
			referURL: document.referrer,
			referDomain: domain
		},opt);
		try{
			Url = ["http://pingfore.qq.com/pingd?dm=",domain,"&url=",pathname,"&tt=-&rdm=",opt.referDomain,"&rurl=",escape(opt.referURL),this._pgvGetUserInfo(),
				"&scr=-&scl=-&lang=-&java=1&cc=-&pf=-&tz=-8&ct=-&vs=3.3"].join('');
			stat._send(Url+"&emu="+Math.random(),100,opt.timeout,opt);
		}catch(e){
			var v=ScriptEngine()+ScriptEngineMajorVersion()+"."+ScriptEngineMinorVersion();
			stat._send("http://219.133.51.97/pingd?err="+escape(e.message)+"&jsv="+v+"&url="+escape(location.href)+"&stone="+Math.random());
		}
	};
    /**
     * 热点点击上报
     * @param {String} tag 热点统计Tag
     * @param {String} [domain] 统计域名
     * @param {String} [pathname] 统计的url
     * @param {Object} [opt]
     * {
	 * 	x:10, //元素坐标
	 *  y:10, //元素坐标
	 *  reportRate: 5 5%
	 * }
     */
	stat.reportHotClick= function(tag, domain, pathname, opt) {
		opt = $.extend({
			x: 9999,
			y: 9999,
			reportRate: 100 //暂时改成100 ，正常线上应该是5
		},opt);
		domain = domain || 'mall.qzone.qq.com';
		pathname = pathname || (window.location && window.location.pathname) || '/';
		var url = ["http://pinghot.qq.com/pingd","?dm=", domain + ".hot", "&url=", escape(pathname), "&tt=-", "&hottag=", tag, "&hotx=", opt.x, "&hoty=", opt.y, "&rand=", Math.random()].join("");
		stat._send(url,opt.reportRate,500,opt);
	};

	/**
	 *  V4返回码上报
	 * 采用合并上报方式，合并一秒内的请求上报
	 * @param opt 配置项：
	 * @param [opt.domain] 域名，cgi所属域名，没有则以CGI domain来上报
	 * @param opt.cgi: CGI名称
	 * @param opt.type: 成功/失败 1: 成功， 2: 网络错误， 3: 逻辑错误
	 * @param opt.code: 需要上报的返回码
	 * @param opt.delay: 接口延迟
	 * @param [opt.rate]: 采样率（100意为1/100的采样率）
	 */
	stat.returnCodeV4 = (function(){
		var defaultConf = {
				domain: '',
				cgi: '',
				type: 1,
				code: 1,
				delay: 0,
				rate: 1//采样率，默认1即全量上报
			},
			commurl = 'http://c.isdspeed.qq.com/code.cgi',//上报CGI
			collector = [],//缓存数组，合并1秒内的上报
			timeout = 1000,//合并上报间隔
			timer;//合并上报timer
		/**
		 * 拼接URL并发送上报请求
		 */
		function report(){
			var param = [];
			param.push(
				'uin=' + (user.getUin() || 0),
				'key=' + 'domain,cgi,type,code,time,rate',
				'r=' + Math.random()
			);
			//遍历合并上报的数组
			if (collector && collector.length) {
				var i = 0;
				while (collector.length) {
					if (param.join('&').length > 1000) {break;}//太长就下次上报
					var c = collector.shift();
					//domain, cgi, type, code, time, rate
					param.push([i + 1, 1].join('_') + '=' + c[0]);
					param.push([i + 1, 2].join('_') + '=' + c[1] + '?qzfl');//添加qzmall标识
					param.push([i + 1, 3].join('_') + '=' + c[2]);
					param.push([i + 1, 4].join('_') + '=' + c[3]);
					param.push([i + 1, 5].join('_') + '=' + c[4]);
					param.push([i + 1, 6].join('_') + '=' + c[5]);
					i++;
				}
			}
			if(i > 0){
				stat._send(commurl + '?' + param.join('&'));
				collector.length && setTimeout(report, 1000);//队列太长未上报完的1秒后再上报
			}
		}
		/**
		 * @param opt 配置项：
		 * @param [opt.domain] 域名，cgi所属域名
		 * @param opt.cgi: CGI名称
		 * @param opt.type: 成功/失败 1: 成功 2: 网络错误 3: 逻辑错误
		 * @param opt.code: 需要上报的返回码
		 * @param opt.delay: 延迟
		 * @param [opt.rate]: 采样率（100意为1/100的采样率）
		 */
		return function(opt) {
			var uri = require('./util'),
				conf = $.extend({}, defaultConf, opt),
				uin = user.getUin();
			//计算采样是否命中
			conf.rate = 1;//100%采样率 
			if((conf.rate == 1 || (Math.random() < 1 / conf.rate)) && opt.cgi){
				var u = uri.parseUrl(opt.cgi),
					path = u.pathname,
					domain = u.hostname;
				//添加到上报数组，参数：domain, cgi, type, code, time, rate
				collector.push([opt.domain || domain, path, conf.type, conf.code, conf.delay, conf.rate]);
				//重置上报timer
				timer && clearTimeout(timer);
				timer = setTimeout(report, timeout);
			}
		}
	})();




	stat.speed= {
		_configId : 1,
		_config: {},
		/**
		 * 创建新测速点，可重复调用，但不会检测重复flag组
		 * @param flag1
		 * @param flag2
		 * @param flag3
		 * @param basetime
		 * @return 测试点组id
		 */
		init: function(flag1, flag2,flag3,basetime){
			var conf = {};
			conf.flag = [flag1,flag2,flag3];
			conf.base = basetime || 0;
			conf.value =  {};
			this._config[this._configId] = conf;
			return this._configId++;
		},
		/**
		 * 添加测速点
		 * @param id  可选，默认为最新创建的测速组
		 * @param point
		 * @param value
		 */
		add: function(id, point, value){
			if(arguments.length < 3){
				if(arguments[0] instanceof Array)return this.addByArr(arguments[0]);
				value = point;
				point = id;
				id = this._configId -1;
			}
			if(!this._config[id]){
				return;
			}
			value = (value || 0) - this._config[id].base;
			this._config[id].value[point] = value;
		},
		/**
		 * 数组的方式添加，按顺序自动生成ID
		 * @param {Array} arr
		 */
		addByArr: function(arr){
			if(arr && arr.length){
				var id = this._configId -1,
					configId = this._config[id];
				if(configId){
					for(var i = 0, len = arr.length; i < len; i++){
						configId.value[i + 1] = (arr[i] || 0) - this._config[id].base;
					}
				}
			}
		},
		/**
		 * 上报，完成后清空所有测速点
		 * @param reportRate
		 */
		send: function (configId,reportRate){
			reportRate = reportRate || 100;
			var sampling = Math.ceil(100 / reportRate);
			var timeout = 500, url, conf;
			if(!!configId){
				conf = this._config[configId];
				var arr = [] , vals = conf.value;
				for(var point in vals){
					arr.push(point+'='+vals[point]);
				}
				url = ["http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=",conf.flag[0],"&flag2=",conf.flag[1],"&flag3=",conf.flag[2],"&flag5=",sampling,"&",arr.join('&'),"&_=",Math.random()].join('');
				stat._send(url,reportRate,timeout);
				delete this._config[configId];
			}else{
				for(var key in this._config){
					conf = this._config[key];
					var arr = [] , vals = conf.value;
					for(var point in vals){
						arr.push(point+'='+vals[point]);
					}
					url = ["http://isdspeed.qq.com/cgi-bin/r.cgi?flag1=",conf.flag[0],"&flag2=",conf.flag[1],"&flag3=",conf.flag[2],"&flag5=",sampling,"&",arr.join('&'),"&_=",Math.random()].join('');
					stat._send(url,reportRate,timeout);
					timeout += 10;
				}
				this._config = {};
			}
		}
	};
	return stat;
});
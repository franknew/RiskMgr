/**
 * Created with JetBrains WebStorm.
 * User: jinjingcao
 * Date: 13-3-22
 * Time: 下午3:39
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
	var Util = require("./mm.util");
	var object = Util.object;

	var _info = {

	};

	//performance
	var timing = function(){
		var t = window.performance && performance.timing;

		var ret = {
			dnstime:t ? t.domainLookupEnd - t.domainLookupStart : -1,
			httptime:t ? t.responseEnd - t.requestStart : -1,
			tcptime:t ? t.connectEnd - t.connectStart : -1
		};

		return ret;
	}();

	//os
	var os = function(){
		var ua = navigator.userAgent;
		var reg = new RegExp([
			"(?:i(?:Phone|Pad|Touch)?\\s?OS\\s?(\\d+(?:[._/]\\d+)*)+)",
			"(?:Android\\s?/?(\\d+(?:[._/]\\d+)*)+)",
			"(?:Windows\\s?(?:NT)?\\s?(\\d+(?:[._/]\\d+)*)+)",
			"(?:Mac\\s?OS\\s?(?:X)?\\s?(\\d+(?:[._/]\\d+)*)+)",
			"(?:CrOS\\s?(?:[^\\w]+)\\s?(\\d+(?:[._/]\\d+)*)+)"
		].join("|"), "i");
//		console.log(reg)
		var mat = ua.match(reg);

		return {

			get:function(){
				return mat&&mat[0]||"UNKNOWN";
			}
		}
	}();

	//sdkversion
	var sdkversion = function(){
		var ua = navigator.userAgent;
		var reg = new RegExp([
			"((?:Trident/6\\.)|(?:MSIE 10))",
			"((?:Trident/5\\.)|(?:MSIE 9))",
//			"(Firefox/(?:\\d+(?:[._/]\\d+)*)+)",
//			"(Chrome/(?:\\d+(?:[._/]\\d+)*)+)",
//			"(Opera/(?:\\d+(?:[._/]\\d+)*)+)",
			"(WebKit/?(?:\\d+(?:[._/]\\d+)*)+)"
		].join("|"), "i");
		var mat = ua.match(reg);

		return {
			get:function(){
				return mat&&mat[0]||"UNKNOWN";
			}
		}
	}();


	var sdkid = function(){
		var ua = navigator.userAgent;
		var reg = new RegExp([
//				baidu
//				apc
//				maxthon
//				go
//				3g
//			"(Chrome/(?:\\d+(?:[._/]\\d+)*)+)",
//			"(Opera/(?:\\d+(?:[._/]\\d+)*)+)",
//			"(Firefox/(?:\\d+(?:[._/]\\d+)*)+)",
//			"(MQQBrowser/(?:\\d+(?:[._/]\\d+)*)+)",
//			"(UCWEB/?(?:\\d+(?:[._/]\\d+)*)+)",
//			"(UCBrowser/?(?:\\d+(?:[._/]\\d+)*)+)",
//			"(Mobile\\s+Safari/(?:\\d+(?:[._/]\\d+)*)+)"

			"(Chrome|Opera|Firefox|MQQBrowser|UCWEB|UCBrowser|MicroMessenger|Safari)/?(\\d+(?:[._/]\\d+)*)+"
		].join("|"), "i");
		var mat = ua.match(reg);

		return {
			get:function(){
				return mat&&mat[0]||"UNKNOWN";
			}
		}
	}();

    var device = function(){
        var width = 0;
        var height = 0;
        if(window.screen){
            width = screen.availWidth || 0;
            height = screen.availHeight || 0;
        }
        var ua = navigator.userAgent;
        var android = ua.match(/(Android)[\s\/]+([\d.]+)/);
        if(!android && window.devicePixelRatio){
            width = Math.floor(width * window.devicePixelRatio);
            height = Math.floor(height * window.devicePixelRatio);
        }
        return {
            get:function(){
                return width+'x'+height;
            }
        }
    }();

	function fetch(){
//		fetch=function(){};
		//1024 Bytes 内，当前页面URL
		//正则replace 5位以上数字为“UIN”收敛差异
		//并除去query 和 hash
//		_info.commandid=location.href.replace(/[?#].*/,"");//转到stat里面调用

		//"用户接入方式
		//WiFi|3G|2G|LAN
		//尽可能区分，完全无法区分的可以LAN，如PC有线接入"
		//todo 	确定如何通过apn兑换到网络环境
//		_info.apn=[window.g_App.apn, window.g_App.isWifi , navigator.connection&&connection.type];

		//当前登录的用户号码
		_info.locuin = -1;
		//当前查看用户号码
		_info.touin = -1;

		//UA信息全文
		_info.deviceinfo = navigator.userAgent;

		//如有PerformanceTiming API支持
		//这里给出当前页面的Nslookup耗时
		_info.dnstime = timing.dnstime;

		//如有PerformanceTiming API支持
		//这里给出当前页面的HTTPresponseEnd与requestStart之差
		_info.httptime = timing.httptime;

		//如有PerformanceTiming API支持
		//这里给出当前页面的TCPconn耗时
		_info.tcptime = timing.tcptime;

		//当前操作系统以及版本，命名规范（不断修订）：
		//操作系统名标识 Windows|Linux|MacOS|iOS|Android|ChromeOS
		//连接版本号 主板本.子版本.reversion
		//实例：Windows6.1
		//Android4.1.2
		//MacOS10.8.2
		_info.os = os.get();

		//浏览器品牌以及版本，规范举例：
		//PC: IE6 IE7 IE8 IE9 IE10
		//FireFox19.0
		//Chrome25.0.1364
		//Opera11.62
		//
		//Mobile: WebKit456.22
		_info.sdkversion = sdkversion.get();

		//浏览器品牌和版本，规范举例：
		//Maxthon3
		//UC
		//QQ
		_info.sdkid = sdkid.get();

        //分辨率
        //格式 320x480
        _info.device = device.get();
	}

	return {
		getDefaultCommonId : function(){
			return location.href.replace(/[?#].*/,""); 
		},
		/**
		 * for override base value
		 * @returns {{}}
		 */
		getEnvironment : function(){
			return {};
		},
		getInfo : function(){
			fetch();
			var _env = this.getEnvironment();
			return object.extend(_info, _env);
		}
	}
});

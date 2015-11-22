/**
 * @fileOverview 入口模块
 * @requires jquery
 * @requires ./stat
 * @requires ./ajax
 * @requires ./user
 * @requires ./module
 * @requires ./storage
 * @requires ./browser
 * @requires ./util
 * @requires ./qboss
 * @requires ./data
 * @requires ./ui
 * @requires ./classes
 */
define(function (require, exports, module) {
	var $ = require('jquery');
    /**
     * index模块
     * @exports index
     * @requires jquery
     * @requires ./stat
     * @requires ./ajax
     * @requires ./user
     * @requires ./module
     * @requires ./storage
     * @requires ./browser
     * @requires ./util
     * @requires ./qboss
     * @requires ./data
     * @requires ./ui
     * @requires ./classes
     */
    var MOD = {
        /** stat模块, 统计上报*/
        stat : require('./stat'),
        /** ajax模块*/
        ajax : require('./ajax'),
        /** user模块, 用户信息*/
        user : require('./user'),
        /** module模块, 全局defer管理*/
        module : require('./module'),
        /** util模块, 工具函数*/
        util : require('./util'),
        /** msg模块, 显示提示浮层*/
        msg : require('./msg'),
        /** browser模块, 浏览器版本判断*/
        browser : require('./browser'),
        /** cookie模块, cookie相关接口*/
        cookie: require('./cookie'),
        /** storage模块, 本地存储相关：localstorage、cookie*/
        storage: require('./storage'),
        /** qboss模块, gboss相关*/
        qboss: require('./qboss'),
        /** data模块, 活动取数据封装接口*/
        data: require('./data'),
        /** ui模块, 界面操作相关*/
        ui: require('./ui'),
        /** pay模块, 支付相关接口*/
        pay: require('./pay'),
        /** classes模块, 类接口*/
        classes: require('./classes'),
        /** router模块，单页面应用路由*/
        router: require('./router'),
        /** share模块，分享接口*/
        share: require('./share'),        
        /** revenue模块，营收数据*/
        revenue: require('./revenue')
    };
	
	//登录态处理
	(function () {
		var sid = MOD.util.getUrlParam("sid"),
			 newUrl;
		//如果url里面有sid，则放到localstorage里面
		if(sid) {
			try {	//safari有可能写入localstorage出错，try进行保护
				localStorage["sid"] = sid;

				//去掉地址栏上的sid，防止用户分享url，导致泄漏登录态
				if(window.history && history.replaceState && localStorage.sid==sid) {	
					//去掉url上带的参数
					newUrl = location.href.replace(/(\?|&)sid=(.*?)(&|#|$)/, '$1$3').replace("\?&", "?").replace(/&{2}/, "&").replace(/[&?]$/, "");
					//微信不使用replaceState，replaceState不会重新去微信后台获取权限，导致之后的url没有权限，不能分享
					if(MOD.browser.client !== 'wx'){
						history.replaceState({}, "", newUrl);
					}
				}
			}catch(e) {
			}
		}else if(MOD.browser.client === 'wx'){
		//如果在微信里，且url上不带sid（手机号登录的情况），干掉localStorage里的sid避免串号
			try {
				if(localStorage["sid"]){
					localStorage["sid"] = '';
				}
			}catch(e){}
		}
	})();


	//初始化绑定全局的按钮上报
	$('body').delegate('[data-hottag],[hottag]','click',function (ev) {
		var elem = $(ev.currentTarget), 
			 tag = $.trim(elem.attr('data-hottag'))|| $.trim(elem.attr('hottag'));
		if(tag) {
			MOD.stat.reportHotClick(tag);
		}
	});

	//初始化全局的pv、uv上报
	var pageUrl = location.pathname,
		 plat = MOD.browser.isMobile?'mobile':'pc',
		 uri = MOD.util.parseUrl(location.href),
		 rurl = uri&&uri.params&&(uri.params.adtag || uri.params.ADTAG);	//兼容adtag大小写
	pageUrl = pageUrl.replace('/qzone/qzact/act/','/qzact/'+plat+'/');	//替换掉长路劲，加上平台
	MOD.stat.reportPV('mall.qzone.qq.com', pageUrl,{
		referURL:rurl || undefined
	});

	//上报网络类型 0:unknow 1:ethernet 2:wifi 3:2G 4:3G 5:4G 6:none
	var code = 0;
	if(navigator.connection && navigator.connection.type){
		code = navigator.connection.type;
	}
	MOD.stat.returnCodeV4({
		domain : 'activity.qzone.qq.com',
		cgi: '/mall/network/connection?qzact',
		type: 1,//成功
		code: code,
		delay: 300 //延时0上报拿不到数据
	});

	var dpi = window.devicePixelRatio, type = 1;
	if(dpi >= 2 && (code === 3 || code === 4)){ //需要用2x图以上却又是2g、3g的用户
		type = 3; //上报为逻辑错误
	}
	MOD.stat.returnCodeV4({
		domain : 'activity.qzone.qq.com',
		cgi: '/mall/network/devicePixelRatio?qzact',
		type: type,
		code: code,
		delay: 300
	});

	//上报qzone登录
	if(MOD.user.isLogin()) {
		if(MOD.browser.isMobile) {	//手机登录统计
			new Image().src = 'http://mobile.qzone.qq.com/get_framework_info?sid='+MOD.user.getSid()+'&g_f=22&action=1&g_tk='+MOD.user.getToken();
		}else {	//pc登录统计
			MOD.ajax.request({
				url:'http://statistic.qzone.qq.com/cgi-bin/login_statistic.cgi',
				type:'post',
				forceLogin:false,
				data:{
					host_uin:MOD.user.getUin(),
					pagetype:9,
					reserve_one:0,
					reserve_two:0
				}
			});
		}
	}

	//iframe内直接调用mqq接口会有被禁用，此时尝试直接使用top的mqq
	try{
		//只对iframe页面进行处理
		if(window != window.top && window.top.mqq) {
			window.mqq = window.top.mqq;
			//对seajs做一下hack
			define("qqapi", function(require, exports, module){
				module.exports = window.mqq;
			});
		}
	}catch(e){
		//报错则还是恢复用seajs引入的qqapi，不影响
	}

	return MOD;
});
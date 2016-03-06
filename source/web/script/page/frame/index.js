//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["bootstrap","jquery","risk/unit/route","risk/components/modal/index","risk/components/user/index","risk/unit/string","risk/unit/ajax","risk/unit/browser"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	    name = name.replace(/\.r[0-9]{15}/,"");
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//frame/src/index.js
//frame/src/userinfo.js
//frame/src/wx.js
//frame/src/frame.tmpl.html

//js file list:
//frame/src/index.js
//frame/src/userinfo.js
//frame/src/wx.js
/**
 * 主框架初始化
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-10 21:05:28
 */

define.pack("./index",["bootstrap","jquery","risk/unit/route","risk/components/modal/index","risk/components/user/index","./tmpl","./userinfo","risk/unit/string"],function(require, exports, module){
	require('bootstrap');
	var $ = require('jquery'),
		route = require('risk/unit/route'),
		Modal = require('risk/components/modal/index'),
		User = require('risk/components/user/index'),
		Tmpl = require('./tmpl'),
		Userinfo = require('./userinfo');

	//登录态处理
	if (!User.isLogin()) {
		$('body>div').remove(); //隐藏所有界面

		User.login({
			success:function() {
				User.info().done(function(info) {
					var phone = info.Mobile;
					//if (!phone || phone.length!=11) {	//判断没有填手机号，就强制要求
					//	location.href = '/?'+Math.random()+'#page=user&message=填上您的手机号，以便绑定您的微信。（务必填写真实在用的手机号码，否则无法绑定微信）';
					//	return ;
					//}
					location.reload();
				});
			}
		});
		return ;
	}else {
		User.info().done(function(info) {
			var html = Tmpl.Frame({
				name:info.CnName,
				avatar:User.avatar(info.Identity)
			});
			$('body').prepend(html);

			MOD.initEvent();
		}).fail(function(msg) {
			Modal.show({
				title:'错误',
				content:'<p>拉取用户信息出错</p><p>'+msg+'</p>',
				okValue:'刷新页面',
				ok:function() {
					location.reload();
				},
				cancel:false
			});
		});
	}

	var MOD = {
		initEvent:function() {
			//登出按钮
			$('#J_Logout').bind('click',function(ev) {
				ev.preventDefault();
				User.logout();
			});

			//手机下菜单事件
			var menuButton = $("#J_MenuToggle");
			if (menuButton.is(':visible')) {
				//打开菜单
				menuButton.click(function(e){
					e.preventDefault();
					var elem = $(e.currentTarget),
					ul = $(elem.attr('data-target'));
					ul.slideToggle(300, 'swing', function () {});
				});
				//点击菜单时关闭
				$('#J_Vnavigation').on('click','a[href^="#page="]',function(e) {
					var ul = $(e.delegateTarget),
						link = $(e.currentTarget);
					//没有下级菜单才自动收起
					if (link.parent('.parent').size()<=0) {
						ul.slideToggle(300, 'swing', function () {});
					}
				});
			}

			//左侧导航
			$(".cl-vnavigation li ul").each(function(){
				$(this).parent().addClass("parent");
			});
			$(".cl-vnavigation li ul li.active").each(function(){
				$(this).parent().show().parent().addClass("open");
			});
			$(".cl-vnavigation").delegate(".parent > a","click",function(e){
				e.stopPropagation();
				e.preventDefault();
				/** 收起其他的
				$(".cl-vnavigation .parent.open > ul").not($(this).parent().find("ul")).slideUp(300, 'swing',function(){
					$(this).parent().removeClass("open");
				});
				**/

				var ul = $(this).parent().find("ul");
				ul.slideToggle(300, 'swing', function () {
					var p = $(this).parent();
					if(p.hasClass("open")){
						p.removeClass("open");
					}else{
						p.addClass("open");
					}
				});
			}).delegate('[data-hook="debug-fillform"]', 'click', function(ev) {//填写测试数据到表单内
				ev.preventDefault();
				debugForm.fill();
			});

			//初始化路由
			route.init({
				header:'#J_Header',
				container:'#J_Body',
				index:'page=home',
				loading:'<div class="loading">Loading...</div>',
				filter:function(mod){ //规则  page=xxxx
					mod='risk/page/'+mod+'/index';

					return mod || '';
				}
			});
		}
	};

	//填写测试数据进表单
	var Str = require('risk/unit/string');
	var debugForm = {
		fill:function() {
			$('input, textarea, select').each(function(i) {
				var $elem = $(this),
					elem = this,
					tag = this.tagName.toLowerCase(),
					inputType = $elem.attr('type');

				switch(tag) {
					case 'input':
					case 'textarea':
						var val = debugForm.getVal(inputType);
						if (val) {
							$elem.val(val);
						}
						break;
					case 'select':
						var seles = $elem.find('option');
						seles.get(seles.length-1).selected = true;
						break;
				}
			});
			alert('懒神，填完了~');
		},
		getVal:function(type) {
			var rs = '';
			switch(type){
				case 'checkbox':
				case 'raido':
					break;
				case 'number':
					rs = Math.ceil(Math.random()*1000);
					break;
				case 'decimal':
					rs = (Math.random()*1000).toFixed(2);
					break;
				case 'date':
					rs = Str.date(new Date(),'yyyy-MM-dd');
					break;
				case 'hidden':
					rs = undefined;
					break;
				default:
					rs = '我梦想有一天，这个国家会站立起来，真正实现其信条的真谛：“我们认为真理是不言而喻，人人生而平等。”我梦想有一天，在佐治亚的红山上，昔日奴隶的儿子将能够和昔日奴隶主的儿子坐在一起，共叙兄弟情谊。我梦想有一天，甚至连密西西比州这个正义匿迹，压迫成风，如同沙漠般的地方，也将变成自由和正义的绿洲。我梦想有一天，我的四个孩子将在一个不是以他们的肤色，而是以他们的品格优劣来评价他们的国度里生活。';
					rs = rs.substr(Math.floor(Math.random()*(rs.length-5)) ,Math.ceil(Math.random()*4));
			}

			return rs;
		}
	};

});/**
 * 用户相关信息初始化
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-10 18:36:44
 */

define.pack("./userinfo",["jquery","risk/components/user/index","risk/unit/ajax"],function(require, exports, module){
	var $ = require('jquery'),
		User = require('risk/components/user/index'),
		Ajax = require('risk/unit/ajax');

	var MOD = {
		get:function(callback) {
			Ajax.post({
				url:'RiskMgr.Api.IndexApi/InitPage',
				success:function(da) {
					var userinfo = da&&da.User;
					userinfo = userinfo && userinfo.UserInfo;
					if (userinfo) {
						callback && callback(userinfo);
					}
				}
			});
		}
	};

	return MOD;
});/**
 * 微信相关
 */

define.pack("./wx",["jquery","risk/unit/browser"],function(require, exports, module){
	var $ = require('jquery'),
		browser = require('risk/unit/browser');

	var corp_id = 'wx4fff07646e8c3d22',
		redirect_uri = 'http://203.195.163.209/wx.html',
		state = '123123123aadsf',
		url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+corp_id+'&redirect_uri='+encodeURIComponent(redirect_uri)+'&response_type=code&scope=snsapi_base&state='+state+'&connect_redirect=1#wechat_redirect';

	//url = ('https://qy.weixin.qq.com/cgi-bin/loginpage?corp_id='+corp_id+'&redirect_uri='+redirect_uri+'&state=123123');

	if (browser.client == 'wx') {
		alert('jump wx:'+location.href);

		location.href = url;
	}
});
//tmpl file list:
//frame/src/frame.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'Frame': function(data){

var __p=[],_p=function(s){__p.push(s)};

	data.avatar = data.avatar || 'about:blank'; //防止空src
__p.push('<div id="head-nav" class="navbar navbar-default navbar-fixed-top">\n	<div class="container-fluid">\n		<div class="navbar-header">\n			<a class="navbar-brand" href="/"><span>风险管理系统</span></a>\n		</div>\n		<div class="navbar-collapse collapse">\n			<!--\n			<ul class="nav navbar-nav">\n			<li><a href="#page=apply-amount">申请额度</a></li>\n			<li><a href="#about">快捷连接22</a></li>\n			</ul>\n			-->\n			<ul class="nav navbar-nav navbar-right user-nav" id="J_UserNav">\n				<li class="dropdown profile_menu">\n					<a href="#" class="dropdown-toggle" data-toggle="dropdown"><img alt="Avatar" src="');
_p(data.avatar);
__p.push('" width="30" height="30" />');
_p(data.name);
__p.push(' <b class="caret"></b></a>\n					<ul class="dropdown-menu">\n						<li><a href="#page=user">个人资料</a></li>\n						<li><a href="#page=user&action=password">修改密码</a></li>\n						<li class="divider"></li>\n						<li><a href="#" id="J_Logout">退出登录</a></li>\n					</ul>\n				</li>\n			</ul>\n\n		</div>\n	</div>\n</div>\n\n<div id="cl-wrapper" class="fixed-menu">\n	<div class="cl-sidebar" data-position="right" data-step="1" data-intro="<strong>Fixed Sidebar</strong> <br/> It adjust to your needs." >\n		<div class="cl-toggle" id="J_MenuToggle" data-target="#J_Vnavigation"><i class="fa fa-bars"></i> 菜单</div>\n		<div class="cl-navblock">\n\n			<div class="menu-space">\n				<div class="content">\n					<div class="side-user" id="J_SideUser">\n						<div class="avatar"><img src="');
_p(data.avatar);
__p.push('" width="50" height="50" alt="Avatar" /></div>\n						<div class="info">\n							<a href="#page=user">');
_p(data.name);
__p.push('</a>\n						</div>\n					</div>\n					<ul class="cl-vnavigation" id="J_Vnavigation">\n						<li><a href="#page=home"><i class="fa fa-home"></i><span>首页</span></a></li>\n						<li class="open"><a href="#"><i class="fa fa-file"></i><span>担保业务</span></a>\n							<ul class="sub-menu">\n								<li><a href="#page=trade/apply">申请额度</a></li>\n								<li><a href="#page=trade/list">查询</a></li>\n							</ul>\n						</li>\n						<li><a href="#page=workflow"><i class="fa fa-stack-overflow"></i><span>审批</span></a></li>\n						<li><a href="#page=customer"><i class="fa fa-users"></i><span>客户信息管理</span></a></li>\n						<li><a href="#page=property"><i class="fa fa-building-o"></i><span>房产信息管理</span></a></li>\n						<li><a href="#"><i class="fa fa-sitemap"></i><span>组织架构</span></a>\n							<ul class="sub-menu">\n								<li><a href="#page=organize/employee"><span>员工管理</span></a></li>\n								<li><a href="#page=organize/position"><span>职位管理</span></a></li>\n							</ul>\n						</li>\n						<li><a href="#"><i class="fa fa-bug"></i><span>开发用的</span></a>\n							<ul class="sub-menu">\n								<li><a href="https://shimo.im/spreadsheet/M3Ca9xhoXxcaTjTY" target="_blank"><span>待办开发工作</span></a></li>\n								<li><a href="#page=debugger"><span>测试后台接口</span></a></li>\n								<li><a href="###" data-hook="debug-fillform"><span>填表单</span></a></li>\n							</ul>\n						</li>\n					</ul>\n				</div>\n			</div>\n\n			<div class="text-right collapse-button" style="padding:7px 9px;">\n				<a class="link-download" href="/download/setup_risk.exe" target="_blank"><i class="fa fa-download"></i><span> 下载桌面版</span></a>\n			</div>\n\n		</div>\n	</div>\n\n	<div class="container-fluid" id="pcont">\n		<div class="page-head hide" id="J_Header"></div>\n		<div class="cl-mcont" id="J_Body">\n			<div class="loading">Loading...</div>\n		</div>\n	</div>\n</div>');

return __p.join("");
}
};
return tmpl;
});

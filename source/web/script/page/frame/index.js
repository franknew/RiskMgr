//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["bootstrap","jquery","risk/unit/route","risk/components/modal/index","risk/components/user/index","risk/unit/ajax"],function(require,exports,module){

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
//frame/src/frame.tmpl.html

//js file list:
//frame/src/index.js
//frame/src/userinfo.js
/**
 * 主框架初始化
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-10 21:05:28
 */

define.pack("./index",["bootstrap","jquery","risk/unit/route","risk/components/modal/index","risk/components/user/index","./tmpl","./userinfo"],function(require, exports, module){
	require('bootstrap');
	var $ = require('jquery'),
		route = require('risk/unit/route'),
		Modal = require('risk/components/modal/index'),
		User = require('risk/components/user/index'),
		Tmpl = require('./tmpl'),
		Userinfo = require('./userinfo');

	//登录态处理
	if (!User.isLogin()) {
		console.log('not login');
		$('body>div').remove(); //隐藏所有界面
		User.login({
			success:function() {
				location.reload();
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
					var ul = $(e.delegateTarget);
					ul.slideToggle(300, 'swing', function () {});
				});
			}

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
});
//tmpl file list:
//frame/src/frame.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'Frame': function(data){

var __p=[],_p=function(s){__p.push(s)};

	data.avatar = data.avatar || 'about:blank'; //防止空src
__p.push('<div id="head-nav" class="navbar navbar-default navbar-fixed-top">\n	<div class="container-fluid">\n		<div class="navbar-header">\n			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">\n				<span class="fa fa-gear"></span>\n			</button>\n			<a class="navbar-brand" href="/"><span>manager</span></a>\n		</div>\n		<div class="navbar-collapse collapse">\n			<!--\n			<ul class="nav navbar-nav">\n			<li><a href="#page=apply-amount">申请额度</a></li>\n			<li><a href="#about">快捷连接22</a></li>\n			</ul>\n			-->\n			<ul class="nav navbar-nav navbar-right user-nav" id="J_UserNav">\n				<li class="dropdown profile_menu">\n					<a href="#" class="dropdown-toggle" data-toggle="dropdown"><img alt="Avatar" src="');
_p(data.avatar);
__p.push('" width="30" height="30" />');
_p(data.name);
__p.push(' <b class="caret"></b></a>\n					<ul class="dropdown-menu">\n						<li><a href="#page=user/info">个人资料</a></li>\n						<li><a href="#page=user/info">修改密码</a></li>\n						<li class="divider"></li>\n						<li><a href="#" id="J_Logout">退出登录</a></li>\n					</ul>\n				</li>\n			</ul>\n\n		</div>\n	</div>\n</div>\n\n<div id="cl-wrapper" class="fixed-menu">\n	<div class="cl-sidebar" data-position="right" data-step="1" data-intro="<strong>Fixed Sidebar</strong> <br/> It adjust to your needs." >\n		<div class="cl-toggle" id="J_MenuToggle" data-target="#J_Vnavigation"><i class="fa fa-bars"></i></div>\n		<div class="cl-navblock">\n			<div class="menu-space">\n				<div class="content">\n					<div class="side-user" id="J_SideUser">\n						<div class="avatar"><img src="');
_p(data.avatar);
__p.push('" width="50" height="50" alt="Avatar" /></div>\n						<div class="info">\n							<a href="#page=user/info">');
_p(data.name);
__p.push('</a>\n						</div>\n					</div>\n					<ul class="cl-vnavigation" id="J_Vnavigation">\n						<li><a href="#page=home"><i class="fa fa-home"></i><span>首页</span></a></li>\n						<li><a href="#page=customer"><i class="fa fa-users"></i><span>客户信息管理</span></a></li>\n						<li><a href="#page=property"><i class="fa fa-building-o"></i><span>房产信息管理</span></a></li>\n						<li><a href="#page=apply-amount"><i class="fa fa-yen"></i><span>申请额度</span></a></li>\n						<li><a href="#page=employee"><i class="fa fa-user-md"></i><span>员工管理</span></a></li>\n						<li><a href="#page=debugger"><i class="fa fa-bug"></i><span>测试后台接口</span></a></li>\n						<!--\n						<li><a href="#"><i class="fa fa-file"></i><span>Pages</span></a>\n							<ul class="sub-menu">\n								<li><a href="pages-blank.html">Blank Page</a></li>\n								<li><a href="pages-blank-header.html">Blank Page Header</a></li>\n								<li><a href="pages-blank-aside.html">Blank Page Aside</a></li>\n							</ul>\n						</li>\n						-->\n					</ul>\n				</div>\n			</div>\n		</div>\n	</div>\n\n	<div class="container-fluid" id="pcont">\n		<div class="page-head hide" id="J_Header"></div>\n		<div class="cl-mcont" id="J_Body">\n			<div class="loading">Loading...</div>\n		</div>\n	</div>\n</div>');

return __p.join("");
}
};
return tmpl;
});

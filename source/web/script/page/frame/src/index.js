/**
 * 主框架初始化
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-10 21:05:28
 */

define(function(require, exports, module){
	require('bootstrap');
	require('risk/config');

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
					if (!phone || phone.length!=11) {	//判断没有填手机号，就强制要求
						location.href = '/?'+Math.random()+'#page=user&message=填上您的手机号，以便绑定您的微信。（务必填写真实在用的手机号码，否则无法绑定微信）';
						return ;
					}
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

});
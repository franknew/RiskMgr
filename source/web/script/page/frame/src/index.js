/**
 * 主框架初始化
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-10 21:05:28
 */

define(function(require, exports, module){
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

			//左侧导航
			$(".cl-vnavigation li ul").each(function(){
				$(this).parent().addClass("parent");
			});
			$(".cl-vnavigation li ul li.active").each(function(){
				$(this).parent().show().parent().addClass("open");
			});
			$(".cl-vnavigation").delegate(".parent > a","click",function(e){
				$(".cl-vnavigation .parent.open > ul").not($(this).parent().find("ul")).slideUp(300, 'swing',function(){
					$(this).parent().removeClass("open");
				});

				var ul = $(this).parent().find("ul");
				ul.slideToggle(300, 'swing', function () {
					var p = $(this).parent();
					if(p.hasClass("open")){
						p.removeClass("open");
					}else{
						p.addClass("open");
					}
				});
				e.preventDefault();
			}).delegate('[data-hook="debug-fillform"]', 'click', function(ev) {//填写测试数据到表单内
				ev.preventDefault();
				debugForm.fill();
			});;

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
						$elem.val(debugForm.getVal(inputType));
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
				default:
					rs = 'abcdefghijklmnopqrstuvwxyz';
					rs = rs.slice(Math.floor(Math.random()*rs.length));
			}

			return rs;
		}
	};

});
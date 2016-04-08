/**
 * 员工个人资料
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-16 17:13:46
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		Route = require('risk/unit/route'),
		Ajax = require('risk/unit/ajax'),
		Msg = require('risk/components/msg/index'),
		Former = require('risk/components/former/index'),
		User = require('risk/components/user/index'),
		TplInfo = require('./tpl.info'),
		TplPW = require('./tpl.password'),
		Tmpl = require('./tmpl');


	var MOD = {
		initPage:function(arg) {
			User.info().done(function(data) {
				data = $.extend({},data);
				data.Role = data.Role.Name.join(', ');

				var html = Tmpl.Info({
					tpl:Former.make(TplInfo,{
						data:data
					}),
					message:arg&&arg.message
				});
				Route.show({
					head:'个人资料',
					content:html
				});

				Route.on('click','info-modify',function(ev) {
					ev.preventDefault();
					var elem = $(ev.currentTarget),
						form = elem.parents('form:first');
					Ajax.post({
						url:'RiskMgr.Api.IndexApi/UpdateUser',
						form:form,
						success:function() {
							Msg.success('修改成功');
						}
					});
				});
			});
		},
		password:function(params) {
			User.info().done(function(data) {
				var html = Tmpl.Info({
					tpl:Former.make(TplPW,{
						data:{
							UserID:data.ID,
							Name:data.Name
						}
					})
				});
				Route.show({
					head:'修改密码',
					content:html
				});

				Route.on('click','info-modify',function(ev) {
					ev.preventDefault();
					var elem = $(ev.currentTarget),
						form = elem.parents('form:first');
					Ajax.post({
						url:'RiskMgr.Api.UserApi/ChangeSelfPassword',
						form:form,
						success:function() {
							Msg.success('修改成功');
						}
					});
				});
			});
		},
	};

	return MOD;
});
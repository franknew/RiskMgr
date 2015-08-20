/**
 * 用户管理，增删改用户
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		route = require('risk/unit/route'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			var list = [
					{name:'李振文',sn:'430611198607226515',job:'客户经理'},
					{name:'水电费',sn:'430611234234234234',job:'客户经理'},
					{name:'赚了钱',sn:'543345634234234443',job:'风控'},
					{name:'美丽',sn:'7544342342342367878',job:'财务'},
					{name:'房东的是',sn:'252435345345345345',job:'管理员'}
				];
			var html = tmpl.list({
				list:list
			});
			route.show({
				head:'员工管理',
				content:html
			});

			MOD.initEvent();
		},
		initEvent:function() {
			$('#J_useradd').click(function(ev) {
				ev.preventDefault();
				require.async('risk/page/employee/add/index',function(m) {
					m.show();
				});
			});
		}
	};

	return MOD;
});
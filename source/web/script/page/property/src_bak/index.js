/**
 * 房产信息- 页面路由初始化
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-23 16:53:06
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		route = require('risk/unit/route'),
		tmpl = require('./tmpl'),
		dialogCust = require('./dialog');

	var MOD = {
		initPage:function() {
			this.list();
		},
		list:function() {
			require.async('./list',function(m) {
				m.initPage();
			});
		},
		view:function() {
			dialogCust.show({
				type:'view'
			});
		},
		add:function() {
			dialogCust.show({
				type:'add'
			});
		},
		edit:function() {
			dialogCust.show({
				type:'edit'
			});
		}
	};

	return MOD;
});
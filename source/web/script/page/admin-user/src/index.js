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
			var html = tmpl.list();
			route.show(html);
		}
	};

	return MOD;
});
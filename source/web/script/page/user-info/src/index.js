/**
 * 员工个人资料
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-16 17:13:46
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		route = require('risk/unit/route')
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			var html = tmpl.user();
		}
	};

	return MOD;
});
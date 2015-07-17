/**
 * 客户信息列表
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		route = require('risk/unit/route'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() { 
			var html = '客户列表';
			route.show(html);
		}
	};

	return MOD;
});
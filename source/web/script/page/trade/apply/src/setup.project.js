/**
 * 项目信息
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 14:54:00
 */

define(function(require, exports, module){
	require.get = require;

	var Serialize = require('risk/unit/serialize'),
		former = require('risk/components/former/index');


	var MOD = {
		getData:function() {
			var data = Serialize($('#Project'))

			return data;
		},
		init:function() {}
	};

	return MOD;
});
/**
 * 额度列表主入口
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-30 14:17:40
 */

define(function(require, exports, module){
	var Route = require('risk/unit/route');
	var List = require('./list'),
		Tmpl = require('./tmpl');

	var Configs = require('risk/page/trade/config');//模板用到

	var MOD = {
		//默认查询入口
		initPage:function(params) {
			params = params || {};

			var html = Tmpl.ListContainer();
			Route.show({
				head:'查询 <small>额度申请</small>',
				content:html
			});

			List.init();
		}
	};

	return MOD;
});
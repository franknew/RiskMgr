/**
 * 审批流程主入口
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-30 14:17:40
 */

define(function(require, exports, module){
	var Route = require('risk/unit/route');
	var List = require('./list'),
		Tmpl = require('./tmpl');

	var MOD = {
		//默认查询入口
		initPage:function(params) {
			params = params || {};

			var mode = params.action || 'mine',
				head = '审批单据',
				html = Tmpl.ListContainer();
			Route.show({
				head:head,
				content:html
			});

			List.init({
				mode:mode
			});
		}
	};

	return MOD;
});
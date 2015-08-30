/**
 * 额度列表主入口
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
				head = {
					'mine':'我的申请单据',
					'approval':'审批单据'
				}[mode],
				html = Tmpl.ListContainer({
					mode:mode
				});
			Route.show({
				head:head,
				content:html
			});

			List.init({
				mode:mode
			});
		},
		//审批入口
		approval:function(params,obj) {
			this.initPage(params,obj);
		}
	};

	return MOD;
});
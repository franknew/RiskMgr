/**
 * 回款确认
 * @authors viktorli (i@lizhenwen.com)
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		Ajax = require('risk/unit/ajax'),
		Route = require('risk/unit/route'),
		Msg = require('risk/components/msg/index');

	var Data = require('./data');

	var MOD = {
		init:function() {
			Route.on('click','finance-submit',function(ev) {//提交回款确认
				ev.preventDefault();

				if (!confirm('回款成功后单据将不可再修改，是否确认？')) {
					return ;
				}

				Data.get().done(function(da) {
					Ajax.post({
						url:'RiskMgr.Api.ProjectApi/FinanceConfirm',
						data:{
							ID:da.Project.ID,
							WorkflowID:da.WorkflowID,
							ActivityID:da.CurrentActivity.ID,
							TaskID:da.TaskID
						},
						success:function(da) {
							Msg.success('已成功确认回款.');
							Route.reload();
						}
					});
				});
			});
		}
	};

	return MOD;
});
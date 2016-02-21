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

				var Params = Data.params();
				Ajax.post({
					url:'RiskMgr.Api.ProjectApi/FinanceConfirm',
					data:{
						ID:Params.ID,
						WorkflowID:Params.WorkflowID,
						ActivityID:Params.ActivityID,
						TaskID:Params.TaskID
					},
					form:$('#FinanceConfirm'),
					success:function(da) {
						Msg.success('已成功确认回款.');
						Route.reload('tab=FinanceConfirm');
					}
				});
			}).on('click','finance-save',function(ev) {//保存回款
				ev.preventDefault();

				var Params = Data.params();
				Ajax.post({
					url:'RiskMgr.Api.ProjectApi/FinanceConfirmSave',
					data:{
						ID:Params.ID,
						WorkflowID:Params.WorkflowID,
						ActivityID:Params.ActivityID,
						TaskID:Params.TaskID
					},
					form:$('#FinanceConfirm'),
					success:function(da) {
						Msg.success('保存成功.');
						Route.reload('tab=FinanceConfirm');
					}
				});

			});
		}
	};

	return MOD;
});
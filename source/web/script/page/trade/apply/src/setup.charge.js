/**
 * 财务相关
 * @authors viktorli (i@lizhenwen.com)
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		Serialize = require('risk/unit/serialize'),
		Ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		Msg = require('risk/components/msg/index');

	var Data = require('./data');

	var MOD = {
		init:function() {
			route.on('click','charge-submit',function(ev) {//提交财务信息
				ev.preventDefault();

				Data.get().done(function(da) {
					var action = da&&da.Action,
						edit = da&&da.ChargeCanEdit,
						url = action==2?'RiskMgr.Api.ProjectApi/UpdateCharge' : 'RiskMgr.Api.ProjectApi/UpdateFinance';

					Ajax.post({
						url: url,
						data:{
							ID:da.Project.ID,
							WorkflowID:da.WorkflowID,
							ActivityID:da.CurrentActivity.ID,
							TaskID:da.TaskID,
							Project:Serialize($('#Charge'))
						},
						success:function(da) {
							Msg.success('提交成功.');
						}
					});
				});
			});
		}
	};

	return MOD;
});
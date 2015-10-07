/**
 * 保后跟踪
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
			Route.on('click','followup-submit',function(ev) {//提交保后跟踪信息
				ev.preventDefault();

				Data.get().done(function(da) {
					Ajax.post({
						url:'RiskMgr.Api.ProjectApi/UpdateTracking',
						data:{
							ID:da.Project.ID,
							WorkflowID:da.WorkflowID,
							ActivityID:da.CurrentActivity.ID,
							TaskID:da.TaskID
						},
						form:$('#Followup'),
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
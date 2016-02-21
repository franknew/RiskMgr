/**
 * 保后跟踪
 * @authors viktorli (i@lizhenwen.com)
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		Ajax = require('risk/unit/ajax'),
		Route = require('risk/unit/route'),
		Msg = require('risk/components/msg/index');

	var Serialize = require('risk/unit/serialize');

	var Data = require('./data');

	var MOD = {
		init:function() {
			Route.on('click','followup-submit',function(ev) {//提交保后跟踪信息
				ev.preventDefault();

				var Params = Data.params();
				Ajax.post({
					url:'RiskMgr.Api.ProjectApi/UpdateTracking',
					data:{
						ID:Params.ID,
						WorkflowID:Params.WorkflowID,
						ActivityID:Params.ActivityID,
						TaskID:Params.TaskID,
					},
					form:$('#Followup'),
					success:function(da) {
						Msg.success('提交成功.');
						Route.reload('tab=Followup');
					}
				});
			});
		}
	};

	return MOD;
});
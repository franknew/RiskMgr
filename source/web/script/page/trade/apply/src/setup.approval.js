/**
 * 审批相关
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
			Route.on('click','approval-pass',function(ev) {//审批通过
				ev.preventDefault();
				MOD._submit(true);
			}).on('click','approval-fail',function(ev) {//审批不通过
				ev.preventDefault();
				MOD._submit(false);
			});
		},
		/** 提交审批
		 * @param result {Boolen} 是否通过
		 */
		_submit:function(result,success) {
			var ipt = $('#Approval textarea[name="Remark"]'),
				remark = $.trim(ipt.val());
			if (!remark) {
				Msg.error('请输入审批意见');
				ipt.focus();
				return false;
			}
			var Params = Data.params();

			Ajax.post({
				url:'RiskMgr.Api.ProjectApi/Approval',
				data:{
					//审批不用  ID:Params.ID,
					WorkflowID:Params.WorkflowID,
					ActivityID:Params.ActivityID,
					TaskID:Params.TaskID || Params.ID,
					Approval:{
						Remark:remark,
						Status:result?1:2
					}
				},
				success:function(da) {
					Msg.success('处理成功.');
					Route.load('page=trade/apply&action=view&tab=Approval&ID='+Params.ID);
					success && success(da);
				}
			});
		}
	};

	return MOD;
});
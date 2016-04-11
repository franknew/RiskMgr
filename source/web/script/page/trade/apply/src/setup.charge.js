/**
 * 财务相关
 * @authors viktorli (i@lizhenwen.com)
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		Serialize = require('risk/unit/serialize'),
		Ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		string = require('risk/unit/string'),
		Msg = require('risk/components/msg/index');

	var Data = require('./data');

	var MOD = {
		init:function() {
			route.on('click','charge-submit',function(ev) {//提交财务信息
				ev.preventDefault();

				var Params = Data.params();

				Ajax.post({
					url: 'RiskMgr.Api.ProjectApi/UpdateCharge',
					data:{
						ID:Params.ID,
						WorkflowID:Params.WorkflowID,
						ActivityID:Params.ActivityID,
						TaskID:Params.TaskID,
						Project:Serialize($('#Charge'))
					},
					success:function(da) {
						route.reload('tab=Charge');
						Msg.success('提交成功.');
					}
				});
			});

			//自动计算回款时间
			var chargeBox = route.container.find('#Charge'),
				ExportTime = 'ExportTime',	//放款时间
				GuaranteePeriod = 'GuaranteePeriod',	//担保期限
				PaymentDate = 'PaymentDate';	//回款时间
			chargeBox.find('input[name="'+ExportTime+'"],input[name="'+GuaranteePeriod+'"]').bind('keyup change',function(ev) {
				var time = chargeBox.find('input[name="'+ExportTime+'"]').val(),
					limit = chargeBox.find('input[name="'+GuaranteePeriod+'"]').val() *1 + 1,	//需要把放款当天也算进来
					rs;
				if (time && limit && !isNaN(limit)) {
					time = new Date(time);
					rs = time.setDate(time.getDate()+limit);	//得到时间戳
					rs = string.date(rs,'yyyy-MM-dd');
				}else{
					rs = ''
				}

				chargeBox.find('input[name="'+PaymentDate+'"]').val(rs);
			});
		}
	};

	return MOD;
});
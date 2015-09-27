/**
 * 获取数据
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-29 16:07:24
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		msg = require('risk/components/msg/index'),
		Modal = require('risk/components/modal/index'),
		Ajax = require('risk/unit/ajax');

	var MOD = {
		get:function(id,callback) {
			Ajax.post({
				url:'RiskMgr.Api.ProjectApi/InitApproval',
				data:{ID:id},
				success:function(da) {
					callback(da);
				}
			});
		}
	};

	return MOD;
});
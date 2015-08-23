/**
 * 用户相关信息初始化
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-10 18:36:44
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		User = require('risk/components/user/index'),
		Ajax = require('risk/unit/ajax');

	var MOD = {
		get:function(callback) {
			Ajax.post({
				url:'RiskMgr.Api.IndexApi/InitPage',
				success:function(da) {
					var userinfo = da&&da.User;
					userinfo = userinfo && userinfo.UserInfo;
					if (userinfo) {
						callback && callback(userinfo);
					}
				}
			});
		}
	};

	return MOD;
});
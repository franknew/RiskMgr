/**
 * 首页
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-08 22:28:39
 * @version $Id$
 */

define(function(require, exports, module){
	var $ = require('jquery');
	var route = require('risk/unit/route'),
		Ajax = require('risk/unit/ajax'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			Ajax.post({
				url:'RiskMgr.Api.IndexApi/InitPage',
				success:function(da) {
					var task = da.ProcessingTask;
					var html = tmpl.home(task);
					route.show(html);
				},
				error:function(jqXHR,message) {
					DEFER.reject(message);
				}
			});

		}
	};
	return MOD;
});
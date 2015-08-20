/**
 * 新增员工
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-18 12:22:58
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		modal = require('risk/components/modal/index'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			MOD.show();
			route.show('');
		},
		show:function(success) {
			modal.show({
				title:'新增员工',
				content:tmpl.add(),
				ok:function() {
					ajax.post({
						url:'RiskMgr.Api.LogonApi/Logon',
						form:this.form,
						success:function(data, textStatus, jqXHR) {
							//添加完毕，刷新员工列表页
							if (!success || !success()) {
								route.load('page=employee/list');
							}
						}
					});
				}
			});
		}
	};

	return MOD;
});
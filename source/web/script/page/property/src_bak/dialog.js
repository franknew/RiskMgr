/**
 * 房产信息通用dialog弹窗
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-18 12:22:58
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		modal = require('risk/components/modal/index'),
		former = require('risk/components/former/index'),
		viewTpl = require('./tpl.view'),
		tmpl = require('./tmpl');

	var MOD = {
		show:function(opt) {
			opt = opt||{};
			var type = opt.type,
				id = opt.id,
				success = opt.success;

			this._getData(id,function(data) {
				var title = {
						'view':'查看房产信息',
						'edit':'编辑房产',
						'add':'新增房产'
					}[type],
					disabled = type=='view'?true:false,
					config = {
						title:title,
						content:former.make(viewTpl,{data:data,disabled:disabled}),
						validate:!disabled
					};
				
				switch (type) {
					case 'add':
						config.ok = function() {
							ajax.post({
								url:'RiskMgr.Api.LogonApi/Logon',
								form:this.form,
								success:function(data, textStatus, jqXHR) {
									//添加完毕，刷新房产列表页
									if (!success || !success()) {	//如果回调返回false则默认跳转
										route.load('page=property');
									}
								}
							});
						};
						break;
					case 'edit':
						config.ok = function() {
							ajax.post({
								url:'RiskMgr.Api.LogonApi/Logon',
								form:this.form,
								success:function(data, textStatus, jqXHR) {
									//添加完毕，刷新房产列表页
									if (!success || !success()) {	//如果回调返回false则默认跳转
										route.load('page=property');
									}
								}
							});
						};
						break;
					case 'view':
						config.okValue = '编辑';
						config.cancelValue = '关闭';
						config.ok = function() {
							opt.type = 'edit';
							MOD.show(opt);
						};
						break;
				}

				modal.show(config);
			});
		},
		_getData:function(id,callback) {
			if (!id) {
				callback && callback();
			}else {
				ajax.post({
					url:'RiskMgr.Api.LogonApi/Logon',
					data:{"username": "admin","password": "admin"},
					success:function(d) {
						callback && callback(d);
					}
				});
			}
		}
	};

	return MOD;
});
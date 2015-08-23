/**
 * 房产通用dialog弹窗
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-18 12:22:58
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		msg = require('risk/components/msg/index'),
		modal = require('risk/components/modal/index'),
		former = require('risk/components/former/index'),
		BaseTpl = require('./tpl.view');

	var MOD = {
		view:function(id,oriBox) {
			var that = this;
			this._getData(id,function(data) {
				var html = that._getForm({
					data:data,
					disabled:true
				});
				modal.show({
					title:'查看房产信息',
					content:html,
					validate:false,
					okValue: '编辑',
					cancelValue: '关闭',
					ok: function() {
						MOD.edit(id);
					},
					button: [{
						value:'删除',
						style:'danger',
						callback:function() {
							if (!confirm('确认删除房产['+data.Code+']？')) {
								return ;
							}
							var dialog = this;
							ajax.post({
								url:'RiskMgr.Api.AssetApi/Delete',
								form:this.form,
								success:function(data, textStatus, jqXHR) {
									msg.success('删除成功.');
									dialog.close();

									$(oriBox).css('background-color','red').slideUp('fast',function() {
										$(this).remove();
									});
								}
							});
						}
					}]
				});
			});
		},
		edit:function(id) {
			var that = this;
			this._getData(id,function(data) {
				var html = that._getForm({
					data:data
				});
				modal.show({
					title:'编辑房产信息',
					content:html,
					ok: function() {
						var dialog = this;
						ajax.post({
							url:'RiskMgr.Api.AssetApi/Update',
							form:this.form,
							success:function(data, textStatus, jqXHR) {
								msg.success('编辑成功');
								dialog.close();
							}
						});
					}
				});
			});
		},
		add:function(success) {
			var html = this._getForm();
			modal.show({
				title:'新增房产',
				content:html,
				ok: function() {
					var dialog = this;
					ajax.post({
						url:'RiskMgr.Api.AssetApi/Add',
						form:this.form,
						success:function(data, textStatus, jqXHR) {
							msg.success('添加成功');
							dialog.close();
							//添加完毕，刷新客户列表页
							if (!success || !success()) {	//如果回调返回false则默认跳转
								route.load('page=property');
							}
						}
					});

					return true;
				}
			});
		},
		/** 获取房产表单
		 * @param opts former.make的配置项（有data、disabled）
		 */
		_getForm:function(opts) {
			var rs = former.make(BaseTpl,opts);

			return rs;
		},
		_getData:function(id,callback) {
			if (!id) {
				callback && callback();
			}else {	//查看指定id的客户
				ajax.post({
					url:'RiskMgr.Api.AssetApi/Query',
					data:{
						ID:id
					},
					success:function(da) {
						//console.log('qqq',da);
						var item = da&&da.Record&&da.Record[0];
						callback && callback(item);
					},
					error:function(xhr,msg) {
					}
				});
			}
		}
	};

	return MOD;
});
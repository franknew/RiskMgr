/**
 * 职位通用弹窗
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		msg = require('risk/components/msg/index'),
		modal = require('risk/components/modal/index'),
		former = require('risk/components/former/index'),
		viewTpl = require('./tpl.view');

	var SelectData = require('risk/data-dictionary');

	var MOD = {
		view:function(id,oriBox) {
			var that = this;
			this._getData(id,function(data) {
				that._showDialog({
					title:'职位详情',
					former:{
						data:data,
						disabled:true
					},
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
							if (!confirm('确认删除职位“'+data.CnName+'('+data.Name+')”？')) {
								return ;
							}
							var dialog = this;
							ajax.post({
								url:'RiskMgr.Api.UserApi/Delete',
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
			this._getData(id,function(data) {
				this._showDialog({
					title:'编辑职位',
					former:{
						data:data
					},
					ok: function() {
						var dialog = this;
						ajax.post({
							url:'RiskMgr.Api.UserApi/Update',
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
			this._showDialog({
				title:'新增职位',
				ok: function() {
					var dialog = this;
					ajax.post({
						url:'RiskMgr.Api.UserApi/Add',
						form:this.form,
						success:function(data, textStatus, jqXHR) {
							msg.success('添加成功');
							dialog.close();
							//添加完毕，刷新
							if (!success || !success()) {	//如果回调返回false则默认跳转
								route.load('page=organize/position');
							}
						}
					});

					return true;
				}
			});
		},
		_getData:function(id,callback) {
			if (!id) {
				callback && callback();
			}else {	//查看指定id的客户
				ajax.post({
					url:'RiskMgr.Api.UserApi/QueryUser',
					data:{
						ID:id
					},
					success:function(da) {
						//console.log('qqq',da);
						var item = da&&da.Record&&da.Record[0];
						item.Password = '***不可编辑***';
						callback && callback(item);
					},
					error:function(xhr,msg) {
					}
				});
			}
		},
		//获取职位列表
		_getOptions:function() {
			var defer = $.Deferred();

			ajax.post({
				url:'RiskMgr.Api.UserApi/QueryUser',
				data:{
					PageSize:10,
					CurrentIndex:1
				},
				formDropEmpty:true,
				success:function(da) {
					var rs = da&&da.Record;

					if (rs) {
						rs = (function(obj) {
							var i=0, l = obj.length;
							var rs = [];
							for(; i < l; ++i) {
								rs.push({
									name:obj[i].CnName,
									value:obj[i].Name
								});
							}
							return rs;
						})(rs);

						defer.resolve(rs);
					}else{
						defer.reject(da);
					}
				},
				error:function() {
					defer.reject();
				}
			});

			return defer;
		},
		//在显示dialog之前，把职位list拉好并拼接进数据字典
		_showDialog:function(args) {
			args = args || {};

			this._getOptions().done(function(list) {

				SelectData['职位'] = list;	//重写数据字典

				if (!args.content) {
					args.content = former.make(viewTpl,args.former);
				}

				modal.show(args);
			}).fail(function() {
				msg.error('拉取职位列表出错，请重试。');
			});
		}
	};

	return MOD;
});
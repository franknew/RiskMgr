/**
 * 客户通用dialog弹窗
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
		viewTpl = require('./tpl.view');

	var MOD = {
		view:function(id,oriBox) {
			this._getData(id,function(data) {

				var buttonAbort;
				if (data.Enabled) { //当前是启用状态
					buttonAbort = {
						value:'禁用',
						style:'danger',
						callback:function() {
							if (!confirm('确认禁用员工“'+data.CnName+'('+data.Name+')”？')) {
								return ;
							}
							var dialog = this;
							ajax.post({
								url:'RiskMgr.Api.UserApi/Update',
								form:this.form,
								data:{
									Enabled:0
								},
								success:function(data, textStatus, jqXHR) {
									msg.success('禁用成功');
									$(oriBox).addClass('text-delete');
									dialog.close();
								}
							});
						}
					};
				}else {	//当前账户已经被注销
					buttonAbort = {
						value:'启用',
						style:'success',
						callback:function() {
							var dialog = this;
							ajax.post({
								url:'RiskMgr.Api.UserApi/Update',
								form:this.form,
								data:{
									Enabled:1
								},
								success:function(data, textStatus, jqXHR) {
									msg.success('启用成功');
									dialog.close();

									$(oriBox).removeClass('text-delete');
								}
							});
						}
					};
				}

				var buttonDelete = null;
				if (false) {	//测试用的
					buttonDelete = {
						value:'删除',
						style:'danger',
						callback:function() {
							var dialog = this;
							ajax.post({
								url:'RiskMgr.Api.UserApi/Delete',
								form:this.form,
								success:function(data, textStatus, jqXHR) {
									msg.success('删除成功');
									dialog.close();

									$(oriBox).css('background-color','red').slideUp('fast',function() {
										$(this).remove();
									});
								}
							});
						}
					};
				}

				var buttons = [buttonAbort];

				if (buttonDelete) {
					buttons.push(buttonDelete);
				}


				modal.show({
					title:'员工详情'+(data.Enabled?'':' <small style="color:#F9FF00"><已禁用></small>'),
					content:former.make(viewTpl,{
						data:data,
						disabled:true
					}),
					validate:false,
					okValue: '编辑',
					cancelValue: '关闭',
					ok: function() {
						MOD.edit(id);
					},
					button: buttons
				});
			});
		},
		edit:function(id) {
			this._getData(id,function(data) {
				if (data.RoleList) {
					//重写RoleList为写入的数据
					data.RoleIDList = (function(list) {
						var rs = [];
						var i=0,cur;
						for(;cur=list[i++];) {
							rs.push(cur.ID);
						}
						rs = JSON.stringify(rs);
						return rs;
					})(data.RoleList);
				}
				modal.show({
					title:'编辑员工',
					content:former.make(viewTpl,{
						data:data
					}),
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
					},
					onshow:function() {
						MOD._initEvent(this);
					}
				});
			});
		},
		add:function(success) {
			modal.show({
				title:'新增员工',
				content:former.make(viewTpl),
				ok: function() {
					var dialog = this;
					ajax.post({
						url:'RiskMgr.Api.UserApi/Add',
						form:this.form,
						data:{
							Enabled:1
						},
						success:function(data, textStatus, jqXHR) {
							msg.success('添加成功');
							dialog.close();
							//添加完毕，刷新客户列表页
							if (!success || !success()) {	//如果回调返回false则默认跳转
								route.load('page=organize/employee');
							}
						}
					});

					return true;
				},
				onshow:function() {
					MOD._initEvent(this);
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
						var item = da&&da.Record&&da.Record[0];
						item.Password = '***不可编辑***';
						callback && callback(item);
					},
					error:function(xhr,msg) {
					}
				});
			}
		},
		_initEvent:function(dialog) {
			var container = $(dialog.content);
			container.on('click','[data-hook="employee-role-choose"]',function(ev) {
				ev.preventDefault();
				//读取已选中的
				var selected = (function() {
					var list = container.find('[name="RoleIDList"]').val() || '';
					list = JSON.parse(list||'[]');
					return list;
				})();

				require.async('risk/page/organize/position/index',function(m) {
					m.selector({
						selected:selected,
						success:function(da) {
							var ids = [],
								names = [];
							var i=0,cur;
							for(;cur=da[i++];) {
								ids.push(cur.id);
								names.push(cur.name);
							}

							ids = JSON.stringify(ids);
							names = names.join(',');

							container.find('[name="RoleIDList"]').val(ids);
							container.find('[name="Role"]').val(names);
						}
					});
				});
			});
		}
	};

	return MOD;
});
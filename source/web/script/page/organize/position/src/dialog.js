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

	var PRE_AUTHOR = 'AuthorityRadio_';	//权限input的Name前缀

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
							if (!confirm('确认删除职位“'+data.Name+(data.Remark?'('+data.Remark+')':'')+'”？')) {
								return ;
							}
							var dialog = this;
							ajax.post({
								url:'RiskMgr.Api.RoleApi/DeleteRole',
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
			that._getData(id,function(data) {
				that._showDialog({
					title:'编辑职位',
					former:{
						data:data
					},
					ok: function() {
						var dialog = this;
						ajax.post({
							url:'RiskMgr.Api.RoleApi/UpdateRole',
							form:this.form,
							formFilter:that._filterFormData,
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
			var that = this;
			that._getAuthority().done(function(list) {
				that._showDialog({
					title:'新增职位',
					former:{
						data:{
							Authority:list
						}
					},
					ok: function() {
						var dialog = this;
						ajax.post({
							url:'RiskMgr.Api.RoleApi/AddRole',
							form:this.form,
							formFilter:that._filterFormData,
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
			});
		},
		_getData:function(id,callback) {
			if (!id) {
				callback && callback();
			}else {	//查看指定id的客户
				ajax.post({
					url:'RiskMgr.Api.RoleApi/QueryRole',
					data:{
						ID:id
					},
					success:function(da) {
						var item = da&&da.Roles&&da.Roles[0];
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
				url:'RiskMgr.Api.RoleApi/QueryRole',
				data:{
					PageSize:1000,
					CurrentIndex:1
				},
				formDropEmpty:true,
				success:function(da) {
					var roles = da&&da.Roles,
						rs;

					if (roles) {
						rs = (function(obj) {
							var i=0, l = obj.length;
							var rs = [{name:'无',value:''}];
							for(; i < l; ++i) {
								rs.push({
									name:obj[i].Name,
									value:obj[i].ID
								});
							}
							return rs;
						})(roles);

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
		//获取权限列表
		_getAuthority:function() {
			var defer = $.Deferred();

			ajax.post({
				url:'RiskMgr.Api.RoleApi/QueryAuthority',
				data:{
					PageSize:1000,
					CurrentIndex:1
				},
				formDropEmpty:true,
				success:function(da) {
					var list = da;

					if (list) {
						defer.resolve(list);
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
				var newTpl,
					formData = args.former&&args.former.data || {};

				SelectData['职位'] = list;	//重写数据字典

				if (!args.content) {
					newTpl = (function(tpl,auths) {
						var rs = tpl.slice(0);

						var i=0,Cur;
						for(;Cur=auths[i++];) {
							rs.push([{
								type:'label',
								col:'3',
								required:true,
								html:Cur.Name
							},{
								col:'7',
								type:'radio',
								required:true,
								name:PRE_AUTHOR+Cur.ID,
								"data-id":Cur.ID,
								options:[{
									value:'1',
									name:"有权限",
									selected:Cur.Checked?true:false
								},{
									value:'',
									name:"无权限",
									selected:Cur.Checked?false:true
								}]
							}]);
						}

						return rs;
					})(viewTpl,formData.Authority);

					args.content = former.make(newTpl,args.former);
				}

				modal.show(args);
			}).fail(function() {
				msg.error('拉取职位列表出错，请重试。');
			});
		},
		//格式化Form表单
		_filterFormData:function(data) {
			var rs = data,
				auths = [];

			for(var key in rs) {
				if(rs.hasOwnProperty(key) && key.indexOf(PRE_AUTHOR)==0) {
					auths.push({
						Checked:!!rs[key],
						ID:key.substr(PRE_AUTHOR.length)
					});
					rs[key] = undefined;
					delete rs[key];
				}
			}

			rs.Authority = auths;

			return rs;
		}
	};

	return MOD;
});
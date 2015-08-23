/**
 * 员工列表
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		pager = require('risk/components/pager/index'),
		tmpl = require('./tmpl'),
		dialog = require('./dialog');

	var MOD = {
		initPage:function(params) {
			params = params || {};
			var currentPage = params.current || 1,
				that = this;

			this.query({
				current:currentPage,
				success:function(da) {
					that._fill(da.Record);

					MOD.initEvent();

					//初始化翻页
					pager.init({
						container:route.container.find('.j-pager'),
						current:currentPage,
						total:da.PageCount,
						request:function(num) {
							return MOD.query({
								current:num,
								success:function(da) {
									var html = tmpl.ListItem(da.Record);
									route.container.find('#J_ListBox').html(html);
								}
							});
						}
					});
				},
				error:function(xhr,msg) {
					route.show({
						head:'员工管理',
						content:msg
					});
				}
			});
		},
		_fill:function(data) {
			var html = tmpl.list({
				list:data
			});
			route.show({
				head:'员工管理',
				content:html
			});

		},
		initEvent:function(container) {
			//按钮：新增客户
			route.on('click','add',function(ev) {
				ev.preventDefault();
				dialog.add();
			}).on('click','view',function(ev) {
				ev.preventDefault();
				var elem = $(ev.currentTarget),
					id = elem.data('id');
				dialog.view(id);
			});

		},
		query:function(conf) {
			return ajax.post({
				url:'RiskMgr.Api.UserApi/QueryUser',
				data:{
					PageSize:conf.size||10,
					CurrentIndex:conf.current || 1
				},
				success:conf.success,
				error:conf.error
			});
		}
	};

	return MOD;
});
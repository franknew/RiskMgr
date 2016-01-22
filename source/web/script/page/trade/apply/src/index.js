/**
 * 申请额度主入口
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */
define(function(require, exports, module){

	var $ = require('jquery'),
		Route = require('risk/unit/route'),
		Tmpl = require('./tmpl'),
		Setup = require('./setup'),
		Types = require('./config.type');

	var MOD = {
		initPage:function(params) {
			this.add(params);
		},
		add:function(params) {
			var html = Tmpl.choose();
			Route.show({
				head:'申请额度',
				content:html
			});

			Route.on('click','choose-type',function(ev) {
				var elem = $(ev.currentTarget),
					type = elem.data('type'),
					subHead = Types.get(type),
					head = '申请额度 <small>'+subHead+'</small>';
				Setup.init({
					mode:'add',
					head:head,
					data:{
						Project:{
							Type:type
						}
					}
				});
			});
		},
		edit:function(params) {
			this._shown(params);
		},
		view:function(params) {
			this._shown(params);
		},
		approval:function(params) {
			this._shown(params);
		},
		_shown:function(params) {

			//显示页面的主入口，先清理缓存
			require('./data').clearCache();

			var mode = params.action;
			var html = '<div class="loading">Loading...</div>',
				head = {
					'edit':'额度编辑',
					'view':'额度查看',
					'approval':'审批单据'
				}[mode];
			Route.show({
				head:head,
				content:html
			});

			require('./data').get().done(function(data) {
				data = data || {};
				var id = data.Project&&data.Project.Name,
					type = data.Project&&data.Project.Type,
					typeName = Types.get(type);

				var extraText;

				if (data&&data.WorkflowComplete) {
					extraText = '<span class="label label-success"><i class="fa fa-check-circle"></i> 已确认回款</span>';
				}else {
					extraText = '<button type="button" class="btn btn-primary" data-hook="trade-print">打印申请单</button>';
				}

				Setup.init({
					mode:params.action,
					head:head+' <small>'+typeName+'('+id+') '+extraText+'</small>',
					data:data
				});

				$('#J_Header').on('click','[data-hook="trade-print"]',function(ev) {
					window.open(location.href.replace(/\b[\&]?action=([^\&]*)\b/,'').replace(/\bpage=([^\&]*)\b/,'page=trade/print'));
				});
			});
		}
	};

	return MOD;
});
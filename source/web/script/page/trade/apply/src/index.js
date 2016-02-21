/**
 * 申请额度主入口
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */
define(function(require, exports, module){

	var $ = require('jquery'),
		Ajax = require('risk/unit/ajax'),
		Route = require('risk/unit/route'),
		Msg = require('risk/components/msg/index'),
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
					typeName = Types.get(type),
					canDiscard = data.DisplayDiscard;	//可以作废

				var extraText = [];

				if (!(data&&data.WorkflowComplete)) {
					extraText.push('<button type="button" class="btn btn-primary" data-hook="trade-print">打印申请单</button>');
				}

				if (canDiscard) {
					extraText.push('<button type="button" class="btn btn-danger" data-workflowID="'+data.WorkflowID+'" data-tip="'+typeName+'('+id+')'+'" data-hook="trade-discard">作废该单</button>');
				}

				extraText = extraText.join(' ');

				Setup.init({
					mode:params.action,
					head:head+' <small>'+typeName+'('+id+') '+extraText+'</small>',
					data:data,
					showed:params.tab || ''
				});

				MOD._initEvent();
			});
		},
		_initEvent:function() {
			//必须用bind，防止重复绑定
			var header = $('#J_Header');

			header.find('[data-hook="trade-print"]').bind('click',function(ev) {
				//打印单据
				window.open(location.href.replace(/\b[\&]?action=([^\&]*)\b/,'').replace(/\bpage=([^\&]*)\b/,'page=trade/print'));
			});

			header.find('[data-hook="trade-discard"]').bind('click',function(ev) {
				//作废单据
				ev.preventDefault();
				var $elem = $(ev.currentTarget),
					txt = $elem.attr('data-tip'),
					id = $elem.attr('data-workflowID');
				if (!confirm('确认废弃单据“'+txt+'”？')) {
					return ;
				}

				Ajax.post({
					url:'RiskMgr.Api.ProjectApi/StopWorkflow',
					data:{
						WorkflowID:id
					},
					success:function(data, textStatus, jqXHR) {
						Msg.success('废弃成功.');
						Route.load('page=trade/list');
					}
				});
			});
		}
	};

	return MOD;
});
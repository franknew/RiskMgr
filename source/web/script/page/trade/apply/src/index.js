/**
 * 申请额度主入口
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define(function(require, exports, module){

	var $ = require('jquery'),
		Route = require('risk/unit/route'),
		Tmpl = require('./tmpl'),
		Views = require('./view');

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
					subHead = {
						'1':'二手楼买卖交易',
						'2':'首期款垫付',
						'3':'现金赎楼',
						'4':'红本抵押'
					}[type],
					head = '申请额度 <small>'+subHead+'</small>';

				Views.init({
					mode:'add',
					head:head
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

			require('./data').get(params.id,function(data) {
				Views.init({
					mode:params.action,
					head:head+'<small>('+data.id+')</small>',
					data:data
				})
			});
		}
	};

	return MOD;
});
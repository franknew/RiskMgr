/**
 * 房产列表
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		route = require('risk/unit/route'),
		tmpl = require('./tmpl'),
		dialog = require('./dialog');

	var MOD = {
		initPage:function() {
			var list = [
					{name:'房产列表',sn:'242343423423432433',job:'标签'},
					{name:'反反复复发',sn:'430611234234234234',job:'标签标签'},
					{name:'房子',sn:'543345634234234443',job:'标标签'},
					{name:'福田香蜜湖',sn:'7544342342342367878',job:'财务'},
					{name:'南山科技园',sn:'252435345345345345',job:'管理员'}
				];
			var html = tmpl.list({
				list:list
			});
			route.show({
				head:'房产信息管理',
				content:html
			});

			MOD.initEvent();
		},
		initEvent:function(container) {
			//按钮：新增
			route.on('click','add',function(ev) {
				ev.preventDefault();
				dialog.show({
					type:'add'
				});
			}).on('click','view',function(ev) {
				ev.preventDefault();
				dialog.show({
					id:123,
					type:'view'
				})
			});

		}
	};

	return MOD;
});
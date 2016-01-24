/**
 * 消息提示
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-16 16:40:15
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		tmpl = require('./tmpl');

	var MOD = {
		show:function(type,message,delay) {
			delay = delay===false?false:(delay || '3000');

			var typeMap = {
					'error':'danger',
					'success':'success',
					'warn':'warning',
					'info':'info'
				},
				button = !!~$.inArray(type, ['error','warn']);

			var html = $(tmpl.msg({
				type:typeMap[type] || typeMap['info'],
				message:message,
				button:button
			}));

			html.css({
				fontSize:'14px',
				lineHeight:'1.7',
				position:'fixed',
				zIndex:'3000',
				minWidth:'330px',
				maxWidth:'400px',
				top:'50%',
				left:'50%',
				transform:'translateX(-50%) translateY(-50%)'
			}).appendTo(document.body);

			var removeBinder = button?html.find('button'):html;

			removeBinder.bind('click',function() {
				html.remove();
			});

			//删除
			if (delay!==false && !button) {
				setTimeout(function() {
					html.fadeOut(function() {
						$(this).remove();
					});
					html = null;
				}, delay);
			}
		},
		success:function(message,delay) {
			return this.show('success',message,delay);
		},
		error:function(message,delay) {
			return this.show('error',message,delay);
		},
		info:function(message,delay) {
			return this.show('info',message,delay);
		},
		warn:function(message,delay) {
			return this.show('warn',message,delay);
		}
	};

	return MOD;
});
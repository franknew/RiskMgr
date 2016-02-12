/**
 * 打印交易申请单
 */

define(function(require, exports, module){
	require('risk/page/trade/print/print.css');
	var $ = require('jquery'),
		Str = require('risk/unit/string');

	var Tmpl = require('./tmpl'),
		Trade = require('risk/page/trade/apply/index');

	var MOD = {
		//默认查询入口
		initPage:function(params) {
			params = params || {};

			document.title = '审批表';

			var container = $('body');
			container.empty().html('<div class="loading">Loading...</div>');

			require.async('risk/page/trade/apply/data',function(Data) {
				Data.get().done(function(d) {
					var html = Tmpl.Printer(d);
					container.html(html);

					$('#TradePrinter').click(function(ev) {
						window.print();
					});
				});
			});

		}
	};

	return MOD;
});
/**
 * 员工个人资料
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-16 17:13:46
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		route = require('risk/unit/route'),
    	parsley = require('risk/components/parsley/index'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			var html = tmpl.user();
			route.show({
				head:'个人资料',
				content:html
			});

			MOD.initEvent(this.container);
		},
		initEvent:function(box) {
			box.find('form').parsley();
		}
	};

	return MOD;
});
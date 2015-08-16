/**
 * 首页
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-08 22:28:39
 * @version $Id$
 */

define(function(require, exports, module){
	var $ = require('jquery');
	var route = require('risk/unit/route'),
		tmpl = require('./tmpl');
 
	var MOD = {
		initPage:function() {
			var html = tmpl.home();
			route.show(html);

		}
	}; 
	return MOD;
});
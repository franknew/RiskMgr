/**
 * 首页
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-08 22:28:39
 * @version $Id$
 */

define(function(require, exports, module){
	var route = require('risk/unit/route');
 
	var MOD = {
		initPage:function() {
			route.show('<p>这是首页</p>');
		}
	}; 
	return MOD;
});
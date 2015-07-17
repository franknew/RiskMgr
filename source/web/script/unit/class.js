/**
 * class相关方法
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-14 13:08:35
 */
define(function(require, exports, module){

	var MOD = {
		clone:function(obj) {
			var F = function(){},
				rs;
			F.prototype = obj;
			rs = new F();
			return rs;
		}
	};

	return MOD;
});
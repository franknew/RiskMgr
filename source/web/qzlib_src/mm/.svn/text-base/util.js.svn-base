/**
 * Created with JetBrains WebStorm.
 * User: jinjingcao
 * Date: 13-3-22
 * Time: 下午2:59
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
	var util={};
	util.object = {
		/**
		 * 抄写
		 * @param to
		 * @param from
		 * @returns {*}
		 */
		extend: function(to, from) {
			for (var i in from) {
				to[i] = from[i];
			}
			return to;
		}
	};

	util.helper = {
		/**
		 * 继承
		 * @param _Cld
		 * @param _Prt
		 * @returns {*}
		 */
		extend : function(_Cld, _Prt) {
			var fn = this.EMPTY_FUN;
			fn.prototype = _Prt.prototype;

			_Cld.prototype = new fn();
			_Cld.constructor = _Cld;

			return _Cld;
		},
		EMPTY_FUN:function(){}
	};


	return util;
});


/**
* @fileOverview 常用的类操作
*/
define(function(require, exports, module){
    /** 常用的类操作
     * @exports classes
     */
	var MOD = {
        /**
         * 克隆对象，使用原型链克隆
         * @method
         * @param {object} obj 源对象
         * @return {object} rs 克隆后的对象
         */
		clone: function(obj){
			var F = function(){
			}, rs;
			F.prototype = obj;
			rs = new F();

			return rs;
		}
	};
	return MOD;
});
/**
 * 字符串相关
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-29 13:49:58
 */

define(function(require, exports, module){
	var MOD = {
		/**
		* 将字符串中的特殊字符转换为实体
		* @param {String} str 待转换字符串
		*/
		encodeHtml : function(str) {
			return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\x60/g, '&#96;').replace(/\x27/g, '&#39;').replace(/\x22/g, '&quot;');
		},
		/**
		* 将字符串中的实体转换为原字符
		* @param {String} str 待转换字符串
		*/
		decodeHtml : function(str) {
			return (str + '').replace(/&quot;/g, '\x22').replace(/&#0*39;/g, '\x27').replace(/&#0*96;/g, '\x60').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
		}
	};

	return MOD;
});
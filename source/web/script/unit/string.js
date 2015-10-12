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
		},
		/**
		* 日期格式化方法
		* @param {Date} date 待格式化Date对象或者是时间戳(毫秒级)
		* @param {String} format 格式化的格式，例如：'yyyy-MM-dd HH:mm:ss'
		* @returns {String} 格式化后字符串
		*/
		date:function(date, format){
			if (!date) {
				return ;
			}
			var res = format,
				tt = '',
				dateType = typeof(date);

			//兼容时间戳
			if (dateType=='number' || dateType=='string') {
				date = new Date(date*1);
			}

			res = res.replace(/yyyy|yy/, function($0) {
				var fullyear = date.getFullYear() + '',
					len = fullyear.length;
				return fullyear.slice(len - $0.length, len);
			}).replace(/MM|M/, function($0) {
				if($0.length === 2 && date.getMonth() < 9) {
					return '0' + (date.getMonth() + 1);
				} else {
					return date.getMonth() + 1;
				}
			}).replace(/dd|d/, function($0) {
				if($0.length === 2 && date.getDate() < 10) {
					return '0' + date.getDate();
				} else {
					return date.getDate();
				}
			}).replace(/HH|H/, function($0) {
				if($0.length === 2 && date.getHours() < 10) {
					return '0' + date.getHours();
				} else {
					return date.getHours();
				}
			}).replace(/hh|h/, function($0) {
				var hours = date.getHours();
				if(hours > 11) {
					tt = 'PM';
				} else {
					tt = 'AM';
				}
				hours = hours > 12 ? hours - 12 : hours;
				if($0.length === 2 && hours < 10) {
					return '0' + hours;
				} else {
					return hours;
				}
			}).replace(/mm/, function($0) {
				if(date.getMinutes() < 10) {
					return '0' + date.getMinutes();
				} else {
					return date.getMinutes();
				}
			}).replace(/ss/, function($0) {
				if(date.getSeconds() < 10) {
					return '0' + date.getSeconds();
				} else {
					return date.getSeconds();
				}
			}).replace('tt', tt);
			return res;
		}
	};

	return MOD;
});
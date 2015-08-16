/**
 * 序列化表单元素为json格式
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 16:41:55
 */

define(function(require, exports, module){
	var $ = require('jquery');

	var rCRLF = /\r?\n/g;

	var MOD = function(container,dropEmpty) {
		var list = {};

		$(container).find(':input[name][name!=""]').map(function(i,elem) {
			var val = $(this).val();

			if ( !(dropEmpty && !val) ) {
				if (val==null) {
				}else if($.isArray( val )){//多选
					/*--
					rs = $.map( val, function( val ) {
						var rs = {};
						rs[elem.name] = val.replace( rCRLF, "\r\n" );
						return rs;
					});
					 --*/
				}else {
					list[elem.name] = val.replace( rCRLF, "\r\n" );
				}
			}
		});

		return list;
	};

	return MOD;
});
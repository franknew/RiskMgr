/**
 * 序列化表单元素为json格式
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 16:41:55
 */

define(function(require, exports, module){
	var $ = require('jquery');

	var rCRLF = /\r?\n/g;

	function gainValue (elem) {
		var val = $(elem).val();

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
			val = val.replace( rCRLF, "\r\n" );
		}
		return val;
	}

	var MOD = function(container,dropEmpty) {
		container = $(container);
		var list = {},
			groups = {},
			allElem = container.find(':input[name][name!=""]'),
			groupBoxs = container.find('[data-group-box]'),
			otherElems = allElem.not('[data-group]');

		//解group的数据
		groupBoxs.map(function() {
			var box = $(this),
				name = box.attr('data-group-box'),
				items = box.find(':input[data-group='+name+']'),
				rs,
				data;	//不预设值，因为dropEmpty参数要实现
			items.map(function() {
				var elem = $(this),
					val = gainValue(elem),
					eleName = elem.attr('name');

				if ((dropEmpty && !val) || !name) {
					return ;
				}
				data = data || {};
				data[eleName] = val;
			});

			if (!data) {
				return ;
			}

			rs = list[name] = list[name] || [];
			rs.push(data);
		});

		otherElems.map(function(i,elem) {
			var val = gainValue(elem);

			if ( !(dropEmpty && !val) ) {
				list[elem.name] = val;
			}
		});

		return list;
	};
/**


			var elem = $(this),
				val = gainValue(elem),
				name = elem.attr('name'),
				item;
			if (dropEmpty && !val) {
				return ;
			}

			if (!list[name]) {
				item = list[name] = [];
			}
			item

 */
	return MOD;
});
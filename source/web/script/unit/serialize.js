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

	function setValue(elem,storeObject,dropEmpty) {
			var $elem = $(elem);
			var val = gainValue(elem),
				eleName = $elem.attr('name'),
				tag = elem.tagName.toLowerCase(),
				type = tag=='input'?elem.type:tag;

			if ((dropEmpty && !val) || !eleName) {
				return storeObject;
			}

			switch(type) {
				case 'checkbox':
				case 'raido':
					if ($elem.is(":checked")) {
						var mul = storeObject[eleName]?storeObject[eleName].split(','):[];
						mul.push(val);

						storeObject = storeObject || {};
						storeObject[eleName] = mul.join(',');
					}
					break;
				default:
					storeObject[eleName] = val;
			}

			return storeObject;
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
				data = setValue(this,data,dropEmpty);
			});

			if (!data) {
				return ;
			}

			rs = list[name] = list[name] || [];
			rs.push(data);
		});

		otherElems.map(function(i,elem) {
			list = setValue(elem,list,dropEmpty);
		});

		return list;
	};
	return MOD;
});
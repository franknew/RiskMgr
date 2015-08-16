/**
 * 用户输入关键字段时，查找已知数据，自动补齐
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 21:13:29
 */

define(function(require, exports, module){

	var $ = require('jquery'),
		Ajax = require('risk/unit/ajax');
	/**
	 * @param opts {Object} 配置项
	 *     container 绑定blur事件的容器
	 *     checkList 需要check的Name列表
	 *     cgi:拉取数据的接口
	 *     dataFilter: 拉取到数据后，通过该函数取最终结果，需要返回取到的结果
	 *     formSelector 查找表单的选择器
	 */
	function autoComplete(opts) {
		opts = $.extend({
			formSelector:'div.form-horizontal:first'
		},opts);

		var container = opts.container,
			checkList = opts.checkList;


		var selector = [];
		var i=0,cur;
		for(;cur=checkList[i++];) {
			selector.push('[name="'+cur+'"]');
		}
		selector = selector.join(',');

		container.on('blur',selector,opts,auto);
	}


	function auto(ev) {
		var opts = ev.data;

		var elem = $(ev.currentTarget),
			checkList = opts.checkList;
		var thisForm = elem.parents(opts.formSelector),
			valList = [],
			data = {};

		var i=0,cur,curVal;
		for(;cur=checkList[i++];) {
			curVal = thisForm.find('[name="'+cur+'"]').val();
			valList.push(curVal);

			data[cur] = curVal;
		}

		if ($.inArray('', valList)==-1) {
			Ajax.post({
				url:opts.cgi,
				data:data,
				success:function(da) {
					var info = opts.dataFilter(da);

					if (info) {
						var ele;
						for(var key in info) {
							if(info.hasOwnProperty(key)) {
								ele = thisForm.find('[name="'+key+'"]');
								if ($.inArray(key, checkList)!==-1) {
									ele.attr('disabled','disabled');
								}
								ele.val(info[key]);
							}
						}
					}
				}
			});
		}
	}

	return autoComplete;
});
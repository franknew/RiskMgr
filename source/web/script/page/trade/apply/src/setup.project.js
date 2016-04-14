/**
 * 项目信息
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 14:54:00
 */

define(function(require, exports, module){
	require.get = require;

	var Serialize = require('risk/unit/serialize'),
		former = require('risk/components/former/index');


	var MOD = {
		getData:function() {
			var data = Serialize($('#Project'))

			return data;
		},
		init:function() {
			//红本的时候隐藏部分资料
			var box = $('#Project'),
				redElem = box.find('select[name="HouseRedState"]'),
				ransomBox = redElem.parents('.form-horizontal:first');

			redElem.bind('change',function(ev) {
				var elem = $(ev.currentTarget),
					val = elem.val(),
					isRed = !!(val==1);

				var showed = ['HouseRedState','AssetRansomCustomerManager','AssetRansomContactPhone'];

				ransomBox.find('[name]').each(function(i,ele) {
					var $ele = $(ele),
						name = $ele.attr('name'),
						parentBox = $ele.parents('div.form-group:first'),
						inRedList = !!(showed.indexOf(name)!=-1);

					if (isRed) {
						if (!inRedList) {
							parentBox.hide();
						}
					}else {
						parentBox.show();
					}
				});
			});
		}
	};

	return MOD;
});
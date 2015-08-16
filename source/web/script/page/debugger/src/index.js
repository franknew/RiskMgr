/**
 * 新增客户
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-18 12:22:58
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
    	parsley = require('risk/components/parsley/index'),
		modal = require('risk/components/modal/index'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			var html = tmpl.debug({
				cgi:'RiskMgr.Api.UserApi/Add',
				postdata:{
					"ID":"aaa",
					"Password":"aaa",
					"job":"1",
					"Name":"aaa",
					"card_id":"",
					"tel":""
				}
			});

			route.show({
				head:'测试后台接口',
				content:html
			});

			$('#J_DebugSubmit').click(function(ev) {
				ev.preventDefault();
				var data = JSON.parse($('#POSTDATA').val()),
					auto = !!$('#AUTO_FORM').is(':checked');

				ajax.post({
					url:$('#CGI').val(),
					data:data,
					dataType:'json',
					riskForm:!auto,
					complete:function(xhr) {
						$('#RS').html(JSON.stringify(JSON.parse(xhr.responseText),null,2));
					}
				});
			});


			$('#LOGIN').click(function(e) {
				e.preventDefault();
				seajs.use('risk/components/user/index',function(m) {
					m.login();
				});
			});

		}
	};

	return MOD;
});
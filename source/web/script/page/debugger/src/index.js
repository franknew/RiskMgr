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
				cgi:'RiskMgr.Api.LogonApi/Logon',
				postdata:{
					username:'admin',
					password:'admin'
				}
			});
			
			route.show({
				head:'测试后台接口',
				content:html
			});

			$('#J_DebugSubmit').click(function(ev) {
				ev.preventDefault();
				ajax.post({
					url:$('#CGI').val(),
					data:JSON.parse($('#POSTDATA').val()),
					dataType:'text',
					complete:function(xhr) {
						console.log(arguments);
						$('#RS').html(JSON.stringify(JSON.parse(xhr.responseText),null,2));
					}
				});
			});


			$('#LOGIN').click(function(e) {
				e.preventDefault();
				seajs.use('risk/components/user/index',function(m) {
					m.showLogin();
				});
			});

		}
	};

	return MOD;
});
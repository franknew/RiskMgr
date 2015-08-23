/**
 * 项目信息
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 14:54:00
 */

define(function(require, exports, module){
	require.get = require;

	var Serialize = require('risk/unit/serialize'),
		former = require('risk/components/former/index');

	var FormList = [{	//项目信息的list
			name:'基本情况',
			tpl:require('./tpl.project.base')
		},{
			name:'赎楼行',
			tpl:require('./tpl.project.ransombank')
		},{
			name:'新贷款资料',
			tpl:require('./tpl.project.newloan')
		},{
			name:'赎楼方式',
			tpl:require('./tpl.project.ransomway')
		}];

	var MOD = {
		getTpl:function(data) {
			var list = FormList,
				html = [];
			var i=0,cur,curHtml;
			for(;cur=list[i++];) {
				curHtml = '<div class="well"><div class="header"><h4>'+cur.name+'</h4></div>'+former.make(cur.tpl,{data:data})+'</div>';
				html.push(curHtml);
			}

			html = html.join('');
			return html;
		},
		getData:function() {
			var data = Serialize($('#Project'))

			return data;
		},
		init:function() {}
	};

	return MOD;
});
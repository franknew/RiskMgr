//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/route","risk/unit/ajax"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	    name = name.replace(/\.r[0-9]{15}/,"");
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//home/src/index.js
//home/src/home.tmpl.html

//js file list:
//home/src/index.js
/**
 * 首页
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-08 22:28:39
 * @version $Id$
 */

define.pack("./index",["jquery","risk/unit/route","risk/unit/ajax","./tmpl"],function(require, exports, module){
	var $ = require('jquery');
	var route = require('risk/unit/route'),
		Ajax = require('risk/unit/ajax'),
		tmpl = require('./tmpl');

	var MOD = {
		initPage:function() {
			Ajax.post({
				url:'RiskMgr.Api.IndexApi/InitPage',
				success:function(da) {
					var task = da.ProcessingTask;
					var html = tmpl.home(task);
					route.show(html);
				},
				error:function(jqXHR,message) {
					DEFER.reject(message);
				}
			});

		}
	};
	return MOD;
});
//tmpl file list:
//home/src/home.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'home': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var RString = require('risk/unit/string'),
		Browser = require('risk/unit/browser');
	var Task = data || [],
		StatusText = {
			'1':'审批中',
			'3':'审批完成'
		};
__p.push('<div class="row dash-cols">\n	<div class="col-sm-6 col-md-6">\n\n		<div class="block-flat">\n			<div class="header">\n				<h3>待办事项</h3>\n			</div>\n			<div class="content">\n				<div class="list-group home-gtasks">');
if (Task && Task.length>0) {__p.push('						');

						var i=0,Cur;
						for(;Cur=Task[i++];) {
						__p.push('						<a href="#page=trade/apply&action=approval&ID=');
_p(Cur.ProcessID);
__p.push('&WorkflowID=');
_p(Cur.WorkflowID);
__p.push('&ActivityID=');
_p(Cur.ActivityID);
__p.push('&TaskID=');
_p(Cur.TaskID);
__p.push('" class="list-group-item">[');
_p(Cur.Name);
__p.push('] ');
_p(Cur.Applier);
__p.push('<small>申请，客户：</small>');
_p(Cur.Title);
__p.push('&nbsp;&nbsp;<small>');
_p(RString.date(Cur.LastUpdateTime,'MM-dd HH:mm'));
__p.push('</small> <!--<span class="badge">');
_p((StatusText[Cur.Status] || Cur.Status));
__p.push('</span>--></a>');

						}
						__p.push('					');
}else{__p.push('					暂无');
}__p.push('				</div>\n			</div>\n		</div>\n	</div>');
if(Browser.client!='wx'){__p.push('	<div class="col-sm-6 col-md-6">\n		<div class="block-flat">\n			<div class="header">\n				<h3>关注微信企业号</h3>\n			</div>\n			<div class="content">\n				<p>按以下步骤操作：</p>\n				<ol>\n					<li>在<a href="/#page=user" target="_blank">个人资料</a>里填写自己的手机号码，<a href="/#page=user" target="_blank">点此进入填写</a></li>\n					<li>用微信扫描二维码：<br/><img src="/images/wx_qrcode.jpg" width="120" height="120" /></li>\n					<li>关注成功后，就能在微信企业号里面直接进入系统，查看、审批等</li>\n				</ol>\n			</div>\n		</div>\n	</div>');
} /*
	<div class="col-sm-6 col-md-6">
		<ul class="nav nav-tabs">
			<li class="active"><a href="#home" data-toggle="tab">待办事</a></li>
			<li><a href="#profile" data-toggle="tab">进行中</a></li>
			<li><a href="#messages" data-toggle="tab">最近完成</a></li>
		</ul>
		<div class="tab-content">
			<div class="tab-pane active cont" id="home">
			homeeeee
			</div>
			<div class="tab-pane cont" id="profile">
			hahahahahah
			</div>
			<div class="tab-pane" id="messages">
			第三个slk艾山街道非
			</div>
		</div>
	</div>
	*/ __p.push('</div>');

return __p.join("");
}
};
return tmpl;
});

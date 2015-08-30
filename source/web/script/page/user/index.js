//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/route","risk/unit/ajax","risk/components/msg/index","risk/components/former/index","risk/components/user/index"],function(require,exports,module){

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
//user/src/index.js
//user/src/tpl.info.js
//user/src/tpl.password.js
//user/src/info.tmpl.html

//js file list:
//user/src/index.js
//user/src/tpl.info.js
//user/src/tpl.password.js
/**
 * 员工个人资料
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-16 17:13:46
 */

define.pack("./index",["jquery","risk/unit/route","risk/unit/ajax","risk/components/msg/index","risk/components/former/index","risk/components/user/index","./tpl.info","./tpl.password","./tmpl"],function(require, exports, module){
	var $ = require('jquery'),
		Route = require('risk/unit/route'),
		Ajax = require('risk/unit/ajax'),
		Msg = require('risk/components/msg/index'),
		Former = require('risk/components/former/index'),
		User = require('risk/components/user/index'),
		TplInfo = require('./tpl.info'),
		TplPW = require('./tpl.password'),
		Tmpl = require('./tmpl');


	var MOD = {
		initPage:function() {
			User.info().done(function(data) {
				var html = Tmpl.Info({
					tpl:Former.make(TplInfo,{
						data:data
					})
				});
				Route.show({
					head:'个人资料',
					content:html
				});

				Route.on('click','info-modify',function(ev) {
					ev.preventDefault();
					var elem = $(ev.currentTarget),
						form = elem.parents('form:first');
					Ajax.post({
						url:'RiskMgr.Api.UserApi/Update',
						form:form,
						success:function() {
							Msg.success('修改成功');
						}
					});
				});
			});
		},
		password:function(params) {
			User.info().done(function(data) {
				var html = Tmpl.Info({
					tpl:Former.make(TplPW,{
						data:{
							UserID:data.ID,
							Name:data.Name
						}
					})
				});
				Route.show({
					head:'修改密码',
					content:html
				});

				Route.on('click','info-modify',function(ev) {
					ev.preventDefault();
					var elem = $(ev.currentTarget),
						form = elem.parents('form:first');
					Ajax.post({
						url:'RiskMgr.Api.UserApi/ChangeSelfPassword',
						form:form,
						success:function() {
							Msg.success('修改成功');
						}
					});
				});
			});
		},
	};

	return MOD;
});/**
 * 用户表单
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-30 16:20:40
 */

define.pack("./tpl.info",[],function(require, exports, module){
	var MOD = [
		[{
			type:'hidden',
			name:'ID'
		},{
			type:'label',
			col:'3',
			html:'帐号'
		},{
			col:'7',
			type:'text',
			required:true,
			disabled:true,
			name:'Name',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'职位'
		},{
			col:7,
			type:'select',
			name:'Role',
			required:true,
			disabled:true,
			options:[{
				name:'请选择',
				value:''
			},{
				name:'业务员',
				value:1
			},{
				name:'业务员组长',
				value:2
			},{
				name:'风控',
				value:3
			},{
				name:'总经理',
				value:4
			}]
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'姓名'
		},{
			col:'7',
			type:'text',
			name:'CnName',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'身份证号'
		},{
			col:'7',
			type:'text',
			name:'Identity',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'手机'
		},{
			col:'7',
			type:'tel',
			name:'Mobile',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'地址'
		},{
			col:'7',
			type:'text',
			name:'Address',
			placeholder:''
		}]
	];

	return MOD;
});/**
 * 用户表单
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-30 16:20:40
 */

define.pack("./tpl.password",[],function(require, exports, module){
	var MOD = [
		[{
			type:'hidden',
			name:'UserID'
		},{
			type:'label',
			col:'3',
			html:'帐号'
		},{
			col:'7',
			type:'text',
			required:true,
			disabled:true,
			name:'Name',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'原始密码'
		},{
			col:'7',
			type:'password',
			name:'OldPassword',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'新密码'
		},{
			col:'7',
			type:'password',
			name:'NewPassword',
			placeholder:''
		}]
	];

	return MOD;
});
//tmpl file list:
//user/src/info.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'Info': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="block-flat">\n	<form class="form-horizontal">');
_p(data.tpl);
__p.push('	<div class="row">\n		<div class="col-sm-3">&nbsp;</div>\n		<div class="col-sm-7"><button class="btn btn-primary" data-hook="info-modify">提交</button></div>\n	</div>\n	</form>\n</div>');

return __p.join("");
}
};
return tmpl;
});

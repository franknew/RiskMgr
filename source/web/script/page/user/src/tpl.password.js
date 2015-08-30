/**
 * 用户表单
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-30 16:20:40
 */

define(function(require, exports, module){
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
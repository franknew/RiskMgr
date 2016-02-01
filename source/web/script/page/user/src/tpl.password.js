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
			required:true,
			html:'原始密码'
		},{
			col:'7',
			type:'password',
			required:true,
			name:'OldPassword',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'新密码'
		},{
			col:'7',
			required:true,
			type:'password',
			name:'NewPassword',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'确认新密码'
		},{
			col:'7',
			required:true,
			type:'password',
			name:'NewPasswordCheck',
			placeholder:'',
			"data-parsley-equalto":"[name='NewPassword']"
		}]
	];

	return MOD;
});
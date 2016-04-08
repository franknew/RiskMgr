/**
 * 员工信息的基本form表单
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define(function(require, exports, module){
	var MOD = [
		[{
			type:'hidden',
			name:'ID'
		},{
			type:'label',
			col:'3',
			required:true,
			html:'帐号'
		},{
			col:'7',
			type:'text',
			required:true,
			name:'Name',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'密码'
		},{
			col:'7',
			type:'text',
			required:true,
			name:'Password',
			placeholder:''
		}],

		[{
			type:'hidden',
			required:true,
			name:'RoleIDList',
			"data-form":"JSON"	//在Serialize里解析数据时会执行JSON.parse
		},{
			type:'label',
			col:'3',
			required:true,
			html:'职位'
		},{
			col:'7',
			type:'text',
			required:true,
			name:'Role',
			disabled:true
		},{
			col:'2',
			type:'button',
			class:'btn-primary',
			html:"选择",
			"data-hook":'employee-role-choose'
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'姓名'
		},{
			col:'7',
			type:'text',
			required:true,
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
			required:true,
			html:'手机'
		},{
			col:'7',
			type:'tel',
			required:true,
			name:'Mobile',
			placeholder:'绑定微信时必须'
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
});
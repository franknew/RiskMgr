/**
 * 用户表单
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-30 16:20:40
 */

define(function(require, exports, module){
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
});
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
			type:'text',
			name:'Role',
			disabled:true
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
			required:true,
			html:'手机'
		},{
			col:'7',
			type:'tel',
			name:'Mobile',
			required:true,
			placeholder:'请填写真实手机号，绑定微信需要验证'
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
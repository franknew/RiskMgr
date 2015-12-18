/**
 * 客户信息的基本form表单
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
			col:'2',
			required:true,
			html:'姓名'
		},{
			col:'4',
			type:'text',
			required:true,
			name:'Name',
			placeholder:''
		},{
			col:2,
			type:'select',
			name:'CardType',
			required:true,
			options:"证件类型",
			remark:'证件类型'
		},{
			col:4,
			type:'text',
			name:'IdentityCode',
			required:true,
			placeholder:'证件号码'
		}],

		[{
			col:2,
			type:'label',
			required:true,
			html:'电话'
		},{
			col:4,
			type:'tel',
			name:'Phone',
			required:true,
			placeholder:''
		},{
			col:3,
			type:'select',
			name:'Gender',
			required:true,
			options:"性别",
			remark:'性别'
		},{
			col:3,
			type:'select',
			name:'Marrage',
			required:true,
			options:"婚姻",
			remark:'婚姻'
		}],

		[{
			col:2,
			type:'label',
			html:'联系地址',
			required:true
		},{
			col:10,
			type:'text',
			name:'Address',
			required:true,
			placeholder:'详细地址'
		}],

		[{
			col:2,
			type:'label',
			html:'曾用名'
		},{
			col:4,
			type:'text',
			name:'OrignalName',
			placeholder:'如有变更过, 则填写'
		},{
			col:2,
			type:'label',
			html:'曾用证件'
		},{
			col:4,
			type:'text',
			name:'OrignalIdentityCode',
			placeholder:'如有变更过, 则填写'
		}],

		[{
			col:2,
			type:'label',
			html:'供楼帐号'
		},{
			col:4,
			type:'number',
			name:'BankCode',
			placeholder:''
		},{
			col:2,
			type:'label',
			html:'开户行'
		},{
			col:4,
			type:'select',
			name:'BankType',
			options:"银行"
		}],

		[{
			col:2,
			type:'label',
			html:'工作单位'
		},{
			col:10,
			type:'text',
			name:'WorkUnit',
			placeholder:''
		}]
	];

	return MOD;
});
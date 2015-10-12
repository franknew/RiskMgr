/**
 * 项目信息form表单：赎楼行
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define(function(require, exports, module){
	var MOD = [//赎楼行
		[{
			type:'label',
			col:3,
			required:true,
			html:'原按揭银行'
		},{
			col:"3",
			type:'select',
			name:'OrignalMortgageBank',
			required:true,
			options:'银行'
		},{
			type:'label',
			col:3,
			required:true,
			html:'原按揭银行支行'
		},{
			col:"3",
			type:'text',
			name:'OrignalMortgageBranch',
			required:true
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'原贷款公积金中心'
		},{
			col:"3",
			type:'select',
			name:'OrignalFundCenter',
			required:true,
			options:'公积金中心'
		},{
			type:'label',
			col:3,
			html:'公积金银行支行'
		},{
			col:"3",
			type:'text',
			name:'OrignalFundBranch',
		}],

		[{
			type:'label',
			col:3,
			html:'是否提供供楼卡复印件'
		},{
			col:"3",
			type:'select',
			name:'SupplyCardCopy',
			options:'是否'
		},{
			type:'label',
			col:'3',
			required:true,
			html:'原贷款本息'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'OrignalCreditPI',
			placeholder:'',
			suffix:'万元'
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'原贷款金额'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'OrignalCreditCommerceMoney',
			placeholder:'',
			prefix:'商业',
			suffix:'万元'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'OrignalCreditFundMoney',
			placeholder:'',
			prefix:'公积金',
			suffix:'万元'
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'赎楼银行客户经理'
		},{
			col:"3",
			type:'text',
			name:'AssetRansomCustomerManager',
			required:true
		},{
			type:'label',
			col:3,
			required:true,
			html:'联系电话'
		},{
			col:"3",
			type:'tel',
			name:'AssetRansomContactPhone',
			required:true
		}]
	];

	return MOD;
});
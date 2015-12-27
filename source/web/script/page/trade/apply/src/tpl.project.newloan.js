/**
 * 项目信息form表单：新贷款资料
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define(function(require, exports, module){
	var MOD = [
		[{
			type:'label',
			col:3,
			required:true,
			html:'新贷款银行'
		},{
			col:"3",
			type:'text',
			name:'NewCreditBank',
			required:true,
		},{
			type:'label',
			col:3,
			required:true,
			html:'新贷款银行支行'
		},{
			col:"3",
			type:'text',
			name:'NewCreditBranch',
			required:true
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'买方贷款金额'
		},{
			col:'3',
			type:'decimal',
			required:true,
			name:'BuyerCreditCommerceMoney',
			placeholder:'',
			prefix:'商业',
			suffix:'万元'
		},{
			col:'3',
			type:'decimal',
			name:'BuyerCreditFundMoney',
			placeholder:'',
			prefix:'公积金',
			suffix:'万元'
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'成交金额'
		},{
			col:"3",
			type:'decimal',
			name:'DealMoney',
			required:true,
			suffix:'万元'
		},{
			type:'label',
			col:3,
			required:true,
			html:'交易定金'
		},{
			col:"3",
			type:'decimal',
			name:'EarnestMoney',
			required:true,
			suffix:'万元'
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'资金监管'
		},{
			col:"3",
			type:'decimal',
			name:'SupervisionMoney',
			required:true,
			suffix:'万元'
		},{
			type:'label',
			col:3,
			required:true,
			html:'资金监管银行'
		},{
			col:"3",
			type:'text',
			name:'SupervisionBank',
			required:true
		}],

		[{
			type:'label',
			col:3,
			html:'客户出资款'
		},{
			col:"3",
			type:'decimal',
			name:'CustomerPredepositMoney',
			suffix:'万元'
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'贷款接收账户'
		},{
			col:"3",
			type:'text',
			name:'CreditReceiverName',
			placeholder:'姓名',
			required:true
		},{
			col:"3",
			type:'text',
			name:'CreditReceiverBank',
			placeholder:'开户行',
			required:true
		},{
			col:"3",
			type:'text',
			name:'CreditReceiverAccount',
			placeholder:'账号',
			required:true
		}]
	];

	return MOD;
});
/**
 * 项目信息form表单：收费情况
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
			col:3,
			html:'收取担保费'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'InsuranceFee',
			placeholder:'',
			suffix:'元'
		},{
			type:'label',
			col:3,
			html:'担保费时间'
		},{
			col:'3',
			type:'date',
			required:true,
			name:'InsuranceTime',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'放款金额'
		},{
			col:'3',
			type:'decimal',
			required:true,
			name:'ExportMoney',
			placeholder:'',
			suffix:'元'
		},{
			type:'label',
			col:3,
			html:'放款时间'
		},{
			col:'3',
			type:'date',
			required:true,
			name:'ExportTime',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'担保期限'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'GuaranteePeriod',
			placeholder:'',
			suffix:'天'
		},{
			type:'label',
			col:3,
			html:'回款时间'
		},{
			col:'3',
			type:'date',
			required:true,
			name:'PaymentDate',
			placeholder:''
		}],


		[{
			col:'12',
			type:'label',
			html:'<hr/>'
		}],

		[{
			type:'label',
			col:3,
			html:'实际出款金额'
		},{
			col:'3',
			type:'number',
			name:'PaymentMoney',
			placeholder:'',
			suffix:'元'
		}],

		[{
			type:'label',
			col:3,
			html:'出款账户'
		},{
			col:'3',
			type:'text',
			name:'PaymentName',
			placeholder:'户名'
		},{
			col:'3',
			type:'text',
			name:'PaymentAccount',
			placeholder:'账号'
		},{
			col:'3',
			type:'text',
			name:'PaymentBankName',
			placeholder:'开户行'
		}],

		[{
			col:'12',
			type:'label',
			html:'<hr/>'
		}],

		[{
			type:'label',
			col:3,
			html:'备注'
		},{
			col:'9',
			type:'textarea',
			name:'ChargeFinanceRemark',
			placeholder:''
		}]
	];

	return MOD;
});
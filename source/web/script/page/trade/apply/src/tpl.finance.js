/**
 * 回款确认表单
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define(function(require, exports, module){
	var MOD = [
		[{
			type:'label',
			col:3,
			required:true,
			html:'回款金额'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'ReturnBackMoney',
			placeholder:'',
			suffix:'万元'
		},{
			type:'label',
			col:3,
			required:true,
			html:'回款时间'
		},{
			col:'3',
			type:'date',
			required:true,
			name:'ReturnBackTime',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'回款金额2'
		},{
			col:'3',
			type:'number',
			name:'ReturnBackMoney2',
			placeholder:'',
			suffix:'万元'
		},{
			type:'label',
			col:3,
			html:'回款时间2'
		},{
			col:'3',
			type:'date',
			required:true,
			name:'ReturnBackTime2',
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
			html:'退款信息'
		},{
			col:'3',
			type:'text',
			name:'RefundName',
			placeholder:'户名'
		},{
			col:'3',
			type:'text',
			name:'RefundAccount',
			placeholder:'账号'
		},{
			col:'3',
			type:'text',
			name:'RefundBankName',
			placeholder:'开户行'
		}],

		[{
			type:'label',
			col:3,
			html:'退款金额'
		},{
			col:'3',
			type:'number',
			name:'RefundMoney',
			placeholder:'',
			suffix:'元'
		},{
			type:'label',
			col:3,
			html:'退款日期'
		},{
			col:'3',
			type:'date',
			name:'RefundDate'
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
			name:'ReturnBackRemark',
			placeholder:''
		}]
	];

	return MOD;
});
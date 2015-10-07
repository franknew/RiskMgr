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
			type:'number',
			required:true,
			name:'ExportMoney',
			placeholder:'',
			suffix:'万元'
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
			html:'滞纳金'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'DelayFee',
			placeholder:'',
			suffix:'元'
		},{
			type:'label',
			col:3,
			html:'滞纳金时间'
		},{
			col:'3',
			type:'date',
			required:true,
			name:'DelayTime',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'展期费用'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'HasExpired',
			placeholder:'',
			suffix:'元'
		}]
	];

	return MOD;
});
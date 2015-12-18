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
		}],

		[{
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
		}]
	];

	return MOD;
});
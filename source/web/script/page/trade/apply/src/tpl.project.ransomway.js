/**
 * 项目信息form表单：赎楼方式
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define(function(require, exports, module){
	var MOD = [
		[{
			type:'label',
			col:3,
			required:true,
			html:'预计总赎楼金额'
		},{
			col:'3',
			type:'decimal',
			required:true,
			name:'AssetRansomPredictMoney',
			placeholder:'',
			suffix:'万元'
		},{
			type:'label',
			col:3,
			required:true,
			html:'赎楼方式'
		},{
			col:"3",
			type:'select',
			name:'AssetRansomType',
			required:true,
			options:'赎楼方式'
		}],

		[{
			type:'label',
			col:3,
			html:'预存时间'
		},{
			col:"3",
			type:'number',
			name:'PredictDays',
			suffix:'天'
		},{
			type:'label',
			col:3,
			html:'收费方式'
		},{
			col:"3",
			type:'select',
			name:'ChargeType',
			options:'收费方式'
		}]
	];

	return MOD;
});
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
			type:'number',
			required:true,
			name:'AssetRansomPredictMoney',
			placeholder:'',
			suffix:'万元'
		},{
			type:'label',
			col:3,
			required:true,
			html:'赎楼员'
		},{
			col:"3",
			type:'text',
			name:'AssetRansomer',
			required:true
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'赎楼方式'
		},{
			col:"3",
			type:'select',
			name:'AssetRansomType',
			required:true,
			options:[{
				name:'请选择',
				value:''
			},{
				name:'预存',
				value:1
			},{
				name:'神马村',
				value:2
			}]
		},{
			type:'label',
			col:3,
			required:true,
			html:'预存时间'
		},{
			col:"3",
			type:'number',
			name:'PredictDays',
			required:true,
			suffix:'天'
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'收费方式'
		},{
			col:"3",
			type:'select',
			required:true,
			name:'ChargeType',
			options:[{
				name:'请选择',
				value:''
			},{
				name:'赎楼前收取',
				value:1
			},{
				name:'赎楼后收取',
				value:2
			}]
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'申请支票数量及限额'
		},{
			col:'3',
			type:'text',
			required:true,
			name:'CheckNumbersAndLimit',
			placeholder:''
		},{
			type:'label',
			col:'3',
			required:true,
			html:'驻点人员'
		},{
			col:'3',
			type:'text',
			name:'Stagnationer',
			placeholder:''
		}]
	];

	return MOD;
});
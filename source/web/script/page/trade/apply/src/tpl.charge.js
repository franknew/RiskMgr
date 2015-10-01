/**
 * 项目信息form表单：收费情况
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define(function(require, exports, module){
	var MOD = [
		[{
			type:'label',
			col:3,
			html:'收取担保费'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'Danbaofei',
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
			name:'DanbaoDate',
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
			name:'Fangkuanjine',
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
			name:'FangkuanTime',
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
			name:'Fangkuanjine',
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
			name:'FangkuanTime',
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
			name:'Fangkuanjine',
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
			name:'FangkuanTime',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'是否有展期费用'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'Fangkuanjine',
			placeholder:'',
			suffix:'元'
		}]
	];

	return MOD;
});
/**
 * 员工信息的基本form表单
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define(function(require, exports, module){
	var Customer = require('risk/page/customer/index'),
		CustomerTpl = require('risk/page/customer/src/tpl.view');
	var MOD = [
		[{
			type:'hidden',
			name:'ID'
		},{
			type:'label',
			col:'2',
			required:true,
			html:'房产证号'
		},{
			col:'4',
			type:'text',
			required:true,
			name:'Code',
			placeholder:''
		},{
			type:'label',
			col:'2',
			required:true,
			html:'用途'
		},{
			col:4,
			type:'select',
			name:'Usage',
			required:true,
			options:'房产用途'
		}],

		[{
			col:2,
			type:'label',
			html:'房产地址',
			required:true
		},{
			col:3,
			type:'select',
			name:'Position',
			required:true,
			options:'地区'
		},{
			col:7,
			type:'text',
			name:'Address',
			required:true,
			placeholder:'详细地址，与房产证保持一致'
		}],

		[{
			type:'label',
			col:'2',
			required:true,
			html:'建筑面积'
		},{
			col:'4',
			type:'decimal',
			required:true,
			name:'Area',
			placeholder:'',
			suffix:'㎡'
		},{
			type:'label',
			col:'2',
			required:true,
			html:'登记价'
		},{
			col:'4',
			type:'decimal',
			required:true,
			name:'RegPrice',
			placeholder:'',
			suffix:'元'
		}]
	];

	return MOD;
});
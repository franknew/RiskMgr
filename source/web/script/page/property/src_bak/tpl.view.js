/**
 * 员工信息的基本form表单
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define(function(require, exports, module){
	var MOD = [
		[{
			type:'label',
			col:'2',
			required:true,
			html:'房产证号'
		},{
			col:'4',
			type:'text',
			required:true,
			name:'id',
			placeholder:''
		},{
			type:'label',
			col:'2',
			required:true,
			html:'用途'
		},{
			col:4,
			type:'select',
			name:'use',
			required:true,
			options:[{
				name:'请选择',
				value:''
			},{
				name:'职位111',
				value:1
			},{
				name:'职位222',
				value:2
			}]
		}],

		[{
			col:2,
			type:'label',
			html:'房产地址',
			required:true
		},{
			col:3,
			type:'select',
			name:'card_id_type',
			required:true,
			options:[{
				name:'* 请选择',
				value:''
			},{
				name:'南山区',
				value:'1'
			},{
				name:'罗湖区',
				value:'2'
			}]
		},{
			col:7,
			type:'text',
			name:'',
			required:true,
			placeholder:'房地产名称，与房产证保持一致'
		}],

		[{
			type:'label',
			col:'2',
			required:true,
			html:'建筑面积'
		},{
			col:'4',
			type:'number',
			required:true,
			name:'area',
			placeholder:'',
			suffix:'㎡'
		},{
			type:'label',
			col:'2',
			required:true,
			html:'登记价'
		},{
			col:'4',
			type:'number',
			required:true,
			name:'area',
			placeholder:'',
			suffix:'元',
			prefix:'人民币'
		}],

		[{
			type:'label',
			col:'6',
			required:true,
			html:'业主    请选择...(这里可以从客户库里选择多个，再额外输入份额)'
		}],
	];

	return MOD;
});
/**
 * 员工信息的基本form表单
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
			col:'3',
			required:true,
			html:'职位名称'
		},{
			col:'7',
			type:'text',
			required:true,
			name:'Name',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'上级职位'
		},{
			col:'7',
			type:'select',
			required:true,
			name:'SJZW',
			options:'职位'
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'权限'
		},{
			col:'7',
			type:'checkbox',
			required:true,
			name:'quanxxx',
			options:[{
				value:"1",
				name:"申请额度"
			},{
				value:"2",
				name:"审批（额度）"
			},{
				value:"3",
				name:"客户管理"
			},{
				value:"4",
				name:"房产管理"
			},{
				value:"5",
				name:"员工管理"
			}]
		}]
	];

	return MOD;
});
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
			html:'说明'
		},{
			col:'7',
			type:'text',
			name:'Remark',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'上级职位'
		},{
			col:'7',
			type:'select',
			name:'ParentID',
			options:'职位'
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'数据访问权限'
		},{
			col:'7',
			type:'select',
			required:true,
			name:'DataAccessType',
			options:[{
				value:"1",
				name:"自己和下属部门数据",
				selected:true
			},{
				value:"2",
				name:"所有数据"
			}]
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'录单权限'
		},{
			col:'7',
			type:'radio',
			required:true,
			name:'CanApply',
			options:[{
				value:"true",
				name:"有",
				selected:true
			},{
				value:"false",
				name:"无"
			}]
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'审批权限'
		},{
			col:'7',
			type:'radio',
			required:true,
			name:'CanApproval',
			options:[{
				value:"true",
				name:"有"
			},{
				value:"false",
				name:"无",
				selected:true
			}]
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'管理客户权限'
		},{
			col:'7',
			type:'radio',
			required:true,
			name:'CanManageCustomer',
			options:[{
				value:"true",
				name:"有"
			},{
				value:"false",
				name:"无",
				selected:true
			}]
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'管理房产权限'
		},{
			col:'7',
			type:'radio',
			required:true,
			name:'CanManageAsset',
			options:[{
				value:"true",
				name:"有"
			},{
				value:"false",
				name:"无",
				selected:true
			}]
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'管理员工权限'
		},{
			col:'7',
			type:'radio',
			required:true,
			name:'CanManageEmployeeAndAuth',
			options:[{
				value:"true",
				name:"有"
			},{
				value:"false",
				name:"无",
				selected:true
			}]
		}]
	];

	return MOD;
});
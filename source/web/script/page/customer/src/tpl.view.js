/**
 * 客户信息的基本form表单
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
			col:'2',
			required:true,
			html:'姓名'
		},{
			col:'4',
			type:'text',
			required:true,
			name:'Name',
			placeholder:'张三'
		},{
			col:2,
			type:'select',
			name:'CardType',
			required:true,
			options:[{
				name:'证件类型',
				value:''
			},{
				name:'身份证',
				value:'1'
			}]
		},{
			col:4,
			type:'text',
			name:'IdentityCode',
			required:true,
			placeholder:'证件号码'
		}],

		[{
			col:2,
			type:'label',
			required:true,
			html:'电话'
		},{
			col:4,
			type:'tel',
			name:'Phone',
			required:true,
			placeholder:'13888888888'
		},{
			col:3,
			type:'select',
			name:'Gender',
			required:true,
			options:[{
				name:'* 性别',
				value:''
			},{
				name:'男',
				value:1
			},{
				name:'女',
				value:2
			}]
		},{
			col:3,
			type:'select',
			name:'Marrage',
			required:true,
			options:[{
				name:'* 婚姻',
				value:''
			},{
				name:'未婚',
				value:1
			},{
				name:'已婚',
				value:2
			}]
		}],

		[{
			col:2,
			type:'label',
			html:'联系地址',
			required:true
		},{
			col:10,
			type:'text',
			name:'Address',
			required:true,
			placeholder:'详细地址'
		}],

		[{
			col:2,
			type:'label',
			html:'曾用名'
		},{
			col:4,
			type:'text',
			name:'OrignalName',
			placeholder:'如有变更过, 则填写'
		},{
			col:2,
			type:'label',
			html:'曾用证件'
		},{
			col:4,
			type:'text',
			name:'OrignalIdentityCode',
			placeholder:'如有变更过, 则填写'
		}],

		[{
			col:2,
			type:'label',
			html:'供楼帐号'
		},{
			col:4,
			type:'number',
			name:'BankCode',
			placeholder:''
		},{
			col:2,
			type:'label',
			html:'开户行'
		},{
			col:4,
			type:'select',
			name:'BankType',
			options:[{
				name:'请选择',
				value:''
			},{
				name:'招商银行',
				value:'1'
			},{
				name:'中国银行',
				value:'2'
			}]
		}],

		[{
			col:2,
			type:'label',
			html:'工作单位'
		},{
			col:10,
			type:'text',
			name:'WorkUnit',
			placeholder:''
		}]
	];

	return MOD;
});
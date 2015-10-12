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
			html:'帐号'
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
			html:'密码'
		},{
			col:'7',
			type:'text',
			required:true,
			name:'Password',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'职位'
		},{
			col:7,
			type:'select',
			name:'Role',
			required:true,
			options:"职位"
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'姓名'
		},{
			col:'7',
			type:'text',
			name:'CnName',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'身份证号'
		},{
			col:'7',
			type:'text',
			name:'Identity',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'手机'
		},{
			col:'7',
			type:'tel',
			name:'Mobile',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:'地址'
		},{
			col:'7',
			type:'text',
			name:'Address',
			placeholder:''
		}],

		[{
			type:'label',
			col:'3',
			html:' '
		},{
			col:'7',
			type:'checkbox',
			name:'Enabled',
			checked:true,
			value:1,
			placeholder:'启用该帐号'
		}]
	];

	return MOD;
});
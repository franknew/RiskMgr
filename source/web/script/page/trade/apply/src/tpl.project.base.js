/**
 * 项目信息form表单：基本信息
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define(function(require, exports, module){
	var MOD = [
		[{
			type:'label',
			col:3,
			required:true,
			html:'项目来源'
		},{
			col:"3",
			type:'select',
			name:'Source',
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
			html:'中介名称'
		},{
			col:"3",
			type:'text',
			name:'AgentName',
			required:true
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'公证书日期'
		},{
			col:"3",
			type:'date',
			name:'CertificateData',
			required:true
		},{
			type:'label',
			col:3,
			html:'中介联系人'
		},{
			col:"3",
			type:'text',
			name:'AgentContact'
		}],

		[{
			type:'label',
			col:3,
			html:'返佣人'
		},{
			col:"3",
			type:'text',
			name:'Rebater'
		},{
			type:'label',
			col:3,
			html:'返佣账号'
		},{
			col:"3",
			type:'text',
			name:'RebateAccount'
		}],

		[{
			type:'label',
			col:3,
			html:'其他返佣信息'
		},{
			col:9,
			type:'text',
			name:'OtherRebateInfo'
		}]
	];

	return MOD;
});
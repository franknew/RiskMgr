/**
 * 项目信息form表单：收费情况
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define(function(require, exports, module){
	var MOD = [
		[{
			type:'group',
			name:'TransferInfo',
			addText:'增加过户信息',
			groups:[
				[{
					type:'label',
					col:3,
					html:'新房产证号'
				},{
					col:'3',
					type:'text',
					name:'NewAssetCode',
					placeholder:''
				},{
					type:'label',
					col:3,
					html:'取证日期'
				},{
					col:'3',
					type:'date',
					name:'NewAssetDate',
					placeholder:''
				}],

				[{
					type:'label',
					col:3,
					html:'过户办文编号'
				},{
					col:'3',
					type:'text',
					name:'ChangeOwnerProfileCode',
					placeholder:''
				},{
					type:'label',
					col:3,
					html:'过户收文日期'
				},{
					col:'3',
					type:'date',
					name:'ChangeOwnerProfileTime',
					placeholder:''
				}]
			]
		}],

		[{
			type:'label',
			col:3,
			html:'过户说明'
		},{
			col:'9',
			type:'textarea',
			name:'ChangeOwnerRemark',
			placeholder:''
		}],


		[{
			type:'group',
			name:'Mortgage',
			addText:'增加抵押信息',
			groups:[
				[{
					type:'label',
					col:3,
					html:'抵押回执编号'
				},{
					col:'9',
					type:'text',
					group:'Mortgage',
					name:'MortgageFeedbackCode',
					placeholder:''
				}],

				[{
					type:'label',
					col:3,
					html:'抵押收文日期'
				},{
					col:'3',
					type:'date',
					group:'Mortgage',
					name:'MortgageOverTime',
					placeholder:''
				},{
					type:'label',
					col:3,
					html:'预计完成日'
				},{
					col:'3',
					type:'date',
					group:'Mortgage',
					name:'MortgagePredictTime',
					placeholder:''
				}]
			]
		}],

		[{
			type:'label',
			col:3,
			html:'抵押备注说明'
		},{
			col:'9',
			type:'textarea',
			name:'MortgageRemark',
			placeholder:''
		}],
		[{
			col:'12',
			type:'label',
			html:'<hr/>'
		}],

		[{
			type:'label',
			col:3,
			html:'回款日期'
		},{
			col:'3',
			type:'date',
			name:'InsuranceFreeTime',
			placeholder:''
		}],

	];

	return MOD;
});
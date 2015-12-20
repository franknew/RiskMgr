/**
 * 项目信息form表单：收费情况
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define(function(require, exports, module){

	//取证日期、注销日期、过户收文日期、过户办文编号、取新政日期、过户说明、新房产证号(不动产权号)、抵押日期、抵押回执编号、预计完成日、抵押备注说明
	var MOD = [
		[{
			type:'label',
			col:3,
			html:'取证日期'
		},{
			col:'3',
			type:'date',
			name:'NewAssetDate',
			placeholder:''
		},{
			type:'label',
			col:3,
			html:'注销日期'
		},{
			col:'3',
			type:'date',
			name:'LogoutAssetTime',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'过户收文日期'
		},{
			col:'3',
			type:'date',
			name:'ChangeOwnerProfileTime',
			placeholder:''
		},{
			type:'label',
			col:3,
			html:'过户办文编号'
		},{
			col:'3',
			type:'text',
			name:'ChangeOwnerProfileCode',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'取新证日期'
		},{
			col:'3',
			type:'date',
			name:'PickNewAssetCodeTime',
			placeholder:''
		},{
			type:'label',
			col:3,
			html:'新房产证号(不动产权号)'
		},{
			col:'3',
			type:'text',
			name:'NewAssetCode',
			placeholder:''
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
			type:'label',
			col:3,
			html:'抵押日期'
		},{
			col:'3',
			type:'date',
			name:'MortgageOverTime',
			placeholder:''
		},{
			type:'label',
			col:3,
			html:'抵押回执编号'
		},{
			col:'3',
			type:'text',
			name:'MortgageFeedbackCode',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'预计完成日'
		},{
			col:'3',
			type:'date',
			name:'MortgagePredictTime',
			placeholder:''
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
		}]

		/*
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
			type:'label',
			col:3,
			html:'取证日期'
		},{
			col:'3',
			type:'date',
			name:'PickNumberTime ',
			placeholder:''
		},{
			type:'label',
			col:3,
			html:'注销日期'
		},{
			col:'3',
			type:'date',
			name:'LogoutAssetTime ',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'过户收文日期'
		},{
			col:'3',
			type:'date',
			name:'ChangeOwnerReceiptTime  ',
			placeholder:''
		},{
			type:'label',
			col:3,
			html:'过户办文编号'
		},{
			col:'3',
			type:'date',
			name:'ChangeOwnerHandleTime  ',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'取新证日期'
		},{
			col:'3',
			type:'date',
			name:'PickNewAssetCodeTime   ',
			placeholder:''
		},{
			type:'label',
			col:3,
			html:'新房产证号'
		},{
			col:'3',
			type:'date',
			name:'NewAssetCode  ',
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
		}]
		*/

	];

	return MOD;
});
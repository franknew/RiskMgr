/**
	修改的一级字段：Approvals
	新增的一级字段：ChargeCanEdit、Charge、FollowupCanEdit、Followup
**/
{
	"IsError": false,
	"Data": {
		"BusinessStatus": 3,
		"FinaceStatus": 1,
		"WorkflowID": "cac274c34475426c9ada64cc1134c9fe",
		"ActivityID": "0f1b5f76ccf24f398d95f81dc1c88735",
		"TaskID": "2b54af8bedc543ae8c4ad65290501d43",
		"Approvals": {
			"CurrentWorkflow":{	//当前流程到哪里了
				"handler":"李振文"	//当前流程所在人的姓名
			}
			,"Done":[{	//已经审批ok的流程信息
				"title":"之前的审批123",	//标题
				"key":"ApprovalTest123",	//字段，提交给后台的
				"content":"我同意啊哈哈",	//审批人意见
				"handler":"李振文",	//审批人姓名
				"time":1443670754853	//审批时间
			}]
			,"CurrentApproval":[{	//当前登陆者可以审批的信息
				"title":"审批标题啊",
				"key":"ApprovalTest222"
			},{
				"title":"可以多个审批标题不",
				"key":"ApprovalTest333"
			}]
		},

		"ChargeCanEdit":true,	//当前登录者是否有权限编辑“收费情况”
		"Charge":{"key":"value"},	//收费情况的各种字段

		"FollowupCanEdit":true,	//当前登录者是否有权限编辑“保后跟踪”
		"Followup":{"key":"value"},	//保后跟踪的各种字段


		"Project": {
			"Source": 1,
			"AgentName": "神奇的中介",
			"CertificateData": 1440259200000,
			"AgentContact": "",
			"Rebater": "",
			"RebateAccount": "",
			"OtherRebateInfo": "",
			"OrignalMortgageBank": "1",
			"OrignalMortgageBranch": "很吊的支行",
			"OrignalFundCenter": "2",
			"OrignalFundBranch": "",
			"SupplyCardCopy": 1,
			"OrignalCreditPI": 1244.00,
			"OrignalCreditCommerceMoney": 12213.00,
			"OrignalCreditFundMoney": 42121.00,
			"AssetRansomCustomerManager": "王八蛋",
			"AssetRansomContactPhone": "13434343434",
			"NewCreditBank": "1",
			"NewCreditBranch": "啊啊啊",
			"ShortTermAssetRansomBank": "1",
			"ShortTermAssetRansomBranch": "",
			"GuaranteeMoney": 32434.00,
			"GuaranteeMonth": 234234,
			"BuyerCreditCommerceMoney": 234234.00,
			"LoanMoney": 23423.00,
			"DealMoney": 232.00,
			"EarnestMoney": 2323.00,
			"SupervisionMoney": 2323.00,
			"SupervisionBank": "3223",
			"AssetRansomMoney": 343.00,
			"CustomerPredepositMoney": 443.00,
			"CreditReceiverName": "设立",
			"CreditReceiverBank": "可怜的",
			"CreditReceiverAccount": "发动机",
			"TrusteeshipAccount": "",
			"AssetRansomPredictMoney": 23.00,
			"AssetRansomer": "阿萨德飞",
			"AssetRansomType": 2,
			"PredictDays": 324,
			"ChargeType": 2,
			"CheckNumbersAndLimit": "32423",
			"Stagnationer": "",
			"Name": "1510011",
			"CreateTime": 1443668435000,
			"LastUpdateTime": 1443668435000,
			"ID": "ea9750e2a995443e8608a62d411e5d82"
		},
		"Buyers": [{
			"Gender": 1,
			"Marrage": 1,
			"CardType": 1,
			"IdentityCode": "234234234234",
			"Phone": "34234234",
			"OrignalName": "old name",
			"OrignalIdentityCode": "111",
			"BankType": 1,
			"BankCode": "22222",
			"Address": "然后统一集团研究与",
			"WorkUnit": "",
			"Name": "灌灌灌灌",
			"CreateTime": 1443508490000,
			"LastUpdateTime": 1443668435000,
			"ID": "03a64ab0039345a0ac6d35b692ec6b24"
		}, {
			"Gender": 1,
			"Marrage": 1,
			"CardType": 1,
			"IdentityCode": "986799283948723984",
			"Phone": "123123",
			"OrignalName": "old name",
			"OrignalIdentityCode": "111",
			"BankType": 1,
			"BankCode": "22222",
			"Address": "三个地方集团研究研究",
			"WorkUnit": "",
			"Name": "阿萨法 ",
			"CreateTime": 1443508490000,
			"LastUpdateTime": 1443668435000,
			"ID": "2a5f02f79ecb4782a2c041c995067948"
		}],
		"Sellers": [{
			"Gender": 1,
			"Marrage": 1,
			"CardType": 1,
			"IdentityCode": "234234234234234",
			"Phone": "13222222222",
			"OrignalName": "old name",
			"OrignalIdentityCode": "111",
			"BankType": 1,
			"BankCode": "22222",
			"Address": "水电费水电费阿达撒饭",
			"WorkUnit": "阿达撒饭额外服务而威尔",
			"Name": "张克强",
			"CreateTime": 1443508490000,
			"LastUpdateTime": 1443668435000,
			"ID": "9c919ce940b84f7ca6e87674592e5be0"
		}],
		"Assets": [{
			"Usage": 1,
			"Position": "1",
			"Address": "地址地址",
			"Code": "123456",
			"Area": 123123.00,
			"RegPrice": 12312.00,
			"Eanbled": 1,
			"Joint": [{
				"Gender": 1,
				"Marrage": 1,
				"CardType": 1,
				"IdentityCode": "234234234234",
				"Phone": "34234234",
				"OrignalName": "old name",
				"OrignalIdentityCode": "111",
				"BankType": 1,
				"BankCode": "22222",
				"Address": "然后统一集团研究与",
				"WorkUnit": "",
				"Name": "灌灌灌灌",
				"CreateTime": 1443508490000,
				"LastUpdateTime": 1443668435000,
				"ID": "03a64ab0039345a0ac6d35b692ec6b24"
			}, {
				"Gender": 1,
				"Marrage": 1,
				"CardType": 1,
				"IdentityCode": "986799283948723984",
				"Phone": "123123",
				"OrignalName": "old name",
				"OrignalIdentityCode": "111",
				"BankType": 1,
				"BankCode": "22222",
				"Address": "三个地方集团研究研究",
				"WorkUnit": "",
				"Name": "阿萨法 ",
				"CreateTime": 1443508490000,
				"LastUpdateTime": 1443668435000,
				"ID": "2a5f02f79ecb4782a2c041c995067948"
			}, {
				"IdentityCode": "234234234234",
				"Phone": "23424234",
				"Name": "灌灌灌灌",
				"CreateTime": 1443508490000,
				"LastUpdateTime": 1443508490000,
				"ID": "7c3bb28caf654679abc1bd6dcb9db4ca"
			}, {
				"Gender": 1,
				"Marrage": 1,
				"CardType": 1,
				"IdentityCode": "234234234234234",
				"Phone": "13222222222",
				"OrignalName": "old name",
				"OrignalIdentityCode": "111",
				"BankType": 1,
				"BankCode": "22222",
				"Address": "水电费水电费阿达撒饭",
				"WorkUnit": "阿达撒饭额外服务而威尔",
				"Name": "张克强",
				"CreateTime": 1443508490000,
				"LastUpdateTime": 1443668435000,
				"ID": "9c919ce940b84f7ca6e87674592e5be0"
			}],
			"CreateTime": 1443508490000,
			"LastUpdateTime": 1443668435000,
			"ID": "26814b9521da43b4a34a86bf02408b32"
		}, {
			"Usage": 1,
			"Position": "2",
			"Address": "景田西路八个道路",
			"Code": "44444444",
			"Area": 123.00,
			"RegPrice": 44232.00,
			"Eanbled": 1,
			"Joint": [{
				"Gender": 1,
				"Marrage": 1,
				"CardType": 1,
				"IdentityCode": "234234234234",
				"Phone": "34234234",
				"OrignalName": "old name",
				"OrignalIdentityCode": "111",
				"BankType": 1,
				"BankCode": "22222",
				"Address": "然后统一集团研究与",
				"WorkUnit": "",
				"Name": "灌灌灌灌",
				"CreateTime": 1443508490000,
				"LastUpdateTime": 1443668435000,
				"ID": "03a64ab0039345a0ac6d35b692ec6b24"
			}],
			"CreateTime": 1443508490000,
			"LastUpdateTime": 1443668435000,
			"ID": "820698834e034930908038c0f8468b2b"
		}, {
			"Usage": 1,
			"Position": "1",
			"Address": "深南路北环西路698",
			"Code": "5698238787",
			"Area": 234234.00,
			"RegPrice": 53425435.00,
			"Eanbled": 1,
			"Joint": [{
				"Gender": 1,
				"Marrage": 1,
				"CardType": 1,
				"IdentityCode": "234234234234",
				"Phone": "34234234",
				"OrignalName": "old name",
				"OrignalIdentityCode": "111",
				"BankType": 1,
				"BankCode": "22222",
				"Address": "然后统一集团研究与",
				"WorkUnit": "",
				"Name": "灌灌灌灌",
				"CreateTime": 1443508490000,
				"LastUpdateTime": 1443668435000,
				"ID": "03a64ab0039345a0ac6d35b692ec6b24"
			}],
			"CreateTime": 1443508490000,
			"LastUpdateTime": 1443668435000,
			"ID": "d6565114e23d4f51863878c44412261a"
		}]
	},
	"Code": 0
}
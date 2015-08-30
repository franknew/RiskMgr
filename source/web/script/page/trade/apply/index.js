//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/ajax","risk/components/msg/index","risk/components/modal/index","risk/unit/route","risk/components/former/index","risk/unit/serialize","risk/page/customer/index","risk/page/Property/index","risk/unit/class","risk/components/parsley/index"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	    name = name.replace(/\.r[0-9]{15}/,"");
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//all file list:
//apply/src/autoComplete.js
//apply/src/data.js
//apply/src/index.js
//apply/src/setup.customer.js
//apply/src/setup.project.js
//apply/src/setup.property.js
//apply/src/test-data.js
//apply/src/tpl.project.base.js
//apply/src/tpl.project.newloan.js
//apply/src/tpl.project.ransombank.js
//apply/src/tpl.project.ransomway.js
//apply/src/view.js
//apply/src/wizzard.js
//apply/src/choose.tmpl.html
//apply/src/setup.customer.tmpl.html
//apply/src/setup.project.tmpl.html
//apply/src/setup.property.tmpl.html
//apply/src/setup.tmpl.html

//js file list:
//apply/src/autoComplete.js
//apply/src/data.js
//apply/src/index.js
//apply/src/setup.customer.js
//apply/src/setup.project.js
//apply/src/setup.property.js
//apply/src/test-data.js
//apply/src/tpl.project.base.js
//apply/src/tpl.project.newloan.js
//apply/src/tpl.project.ransombank.js
//apply/src/tpl.project.ransomway.js
//apply/src/view.js
//apply/src/wizzard.js
/**
 * 用户输入关键字段时，查找已知数据，自动补齐
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 21:13:29
 */

define.pack("./autoComplete",["jquery","risk/unit/ajax"],function(require, exports, module){

	var $ = require('jquery'),
		Ajax = require('risk/unit/ajax');
	/**
	 * @param opts {Object} 配置项
	 *     container 绑定blur事件的容器
	 *     checkList 需要check的Name列表
	 *     cgi:拉取数据的接口
	 *     dataFilter: 拉取到数据后，通过该函数取最终结果，需要返回取到的结果
	 *     formSelector 查找表单的选择器
	 */
	function autoComplete(opts) {
		opts = $.extend({
			formSelector:'div.form-horizontal:first'
		},opts);

		var container = opts.container,
			checkList = opts.checkList;


		var selector = [];
		var i=0,cur;
		for(;cur=checkList[i++];) {
			selector.push('[name="'+cur+'"]');
		}
		selector = selector.join(',');

		container.on('blur',selector,opts,auto);
	}


	function auto(ev) {
		var opts = ev.data;

		var elem = $(ev.currentTarget),
			checkList = opts.checkList;
		var thisForm = elem.parents(opts.formSelector),
			valList = [],
			data = {};

		var i=0,cur,curVal;
		for(;cur=checkList[i++];) {
			curVal = thisForm.find('[name="'+cur+'"]').val();
			valList.push(curVal);

			data[cur] = curVal;
		}

		if ($.inArray('', valList)==-1) {
			Ajax.post({
				url:opts.cgi,
				data:data,
				success:function(da) {
					var info = opts.dataFilter(da);

					if (info) {
						var ele;
						for(var key in info) {
							if(info.hasOwnProperty(key)) {
								ele = thisForm.find('[name="'+key+'"]');
								if ($.inArray(key, checkList)!==-1) {
									ele.attr('disabled','disabled');
								}
								ele.val(info[key]);
							}
						}
					}
				}
			});
		}
	}

	return autoComplete;
});/**
 * 获取数据
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-29 16:07:24
 */

define.pack("./data",["jquery","risk/components/msg/index","risk/components/modal/index","risk/unit/ajax"],function(require, exports, module){
	var $ = require('jquery'),
		msg = require('risk/components/msg/index'),
		Modal = require('risk/components/modal/index'),
		Ajax = require('risk/unit/ajax');

	var MOD = {
		get:function(id,callback) {
			require.async('./test-data',function(d) {
				callback(d);
			});
		}
	};

	return MOD;
});/**
 * 申请额度主入口
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define.pack("./index",["jquery","risk/unit/route","./tmpl","./view","./data"],function(require, exports, module){

	var $ = require('jquery'),
		Route = require('risk/unit/route'),
		Tmpl = require('./tmpl'),
		Views = require('./view');

	var MOD = {
		initPage:function(params) {
			this.add(params);
		},
		add:function(params) {
			var html = Tmpl.choose();
			Route.show({
				head:'申请额度',
				content:html
			});

			Route.on('click','choose-type',function(ev) {
				var elem = $(ev.currentTarget),
					type = elem.data('type'),
					subHead = {
						'1':'二手楼买卖交易',
						'2':'首期款垫付',
						'3':'现金赎楼',
						'4':'红本抵押'
					}[type],
					head = '申请额度 <small>'+subHead+'</small>';

				Views.init({
					mode:'add',
					head:head
				});
			});
		},
		edit:function(params) {
			this._shown(params);
		},
		view:function(params) {
			this._shown(params);
		},
		approval:function(params) {
			this._shown(params);
		},
		_shown:function(params) {
			var mode = params.action;
			var html = '<div class="loading">Loading...</div>',
				head = {
					'edit':'额度编辑',
					'view':'额度查看',
					'approval':'审批单据'
				}[mode];
			Route.show({
				head:head,
				content:html
			});

			require('./data').get(params.id,function(data) {
				Views.init({
					mode:params.action,
					head:head+'<small>('+data.id+')</small>',
					data:data
				})
			});
		}
	};

	return MOD;
});/**
 * 客户信息
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 14:53:02
 */

define.pack("./setup.customer",["jquery","risk/unit/route","risk/components/former/index","risk/components/msg/index","risk/unit/serialize","risk/page/customer/index","./tmpl","./autoComplete"],function(require, exports, module){
	require.get = require;

	var $ = require('jquery'),
		route = require('risk/unit/route'),
		former = require('risk/components/former/index'),
		msg = require('risk/components/msg/index'),
		Serialize = require('risk/unit/serialize'),
		Customer = require('risk/page/customer/index'),
		CustomerFormTpl = require.get('risk/page/customer/tpl.view');

	var Tmpl = require('./tmpl'),
		AutoComplete = require('./autoComplete');

	var CORE_NAME = ['Name','IdentityCode','CardType'];

	var MOD = {
		getTpl:function(data,canEdit) {
			var tpl = former.make(CustomerFormTpl,{
				data:data,
				disabled:!canEdit
			});

			return tpl;
		},
		getData:function() {
			var buyerList = $('#BuyerList div.list-group-item'),
				sellerList = $('#SellerList div.list-group-item'),
				data = {
					buyer:[],
					seller:[]
				};

			buyerList.each(function(i,ele) {
				data.buyer.push(Serialize(ele));
			});
			sellerList.each(function(i,ele) {
				data.seller.push(Serialize(ele));
			});

			return data;
		},
		init:function() {
			route.on('click','customer-import',function(ev) {	//导入现有客户数据，包含买家、卖家
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					box = btn.parents('div.block-transparent:first').find('div.list-group:first');

				Customer.selector({
					success:function(data) {
						MOD.add(box,data);
					}
				});

			}).on('click','customer-remove',function(ev) {//移除客户
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					itemClass = 'div.list-group-item',
					box = btn.parents(itemClass),
					boxSize = box.siblings(itemClass).size();

				if (boxSize<=0) {
					msg.error('至少保留有一个客户.');
					return ;
				}else {
					box.slideUp('fase',function() {
						box.remove();
					});
				}
			}).on('click','customer-add',function(ev) {//新增空白客户
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					box = btn.siblings('div.list-group');

				MOD.add(box);
			});

			//通过输入的关键字段，自动补齐
			AutoComplete({
				container:$('#Customer'),
				checkList:CORE_NAME,
				cgi:'RiskMgr.Api.CustomerApi/Query',
				dataFilter:function(da) {
					var rs = da&&da.Record;
					rs = rs&&rs[0];

					return rs;
				}
			});

		},
		add:function(box,data) {
			box = $(box);
			var html = Tmpl.CustomerItem({
					tpl:this.getTpl,
					data:data,
					canEdit:true
				});

			html = $(html);
			if (data) {//导入的关键数据不可编辑
				html.find('[name="Name"],[name="CardType"],[name="IdentityCode"]').attr('disabled','disabled');
			}
			html.hide();
			html.appendTo(box).slideDown('fast', function() {});

		}
	};

	return MOD;
});/**
 * 项目信息
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 14:54:00
 */

define.pack("./setup.project",["risk/unit/serialize","risk/components/former/index","./tpl.project.base","./tpl.project.ransombank","./tpl.project.newloan","./tpl.project.ransomway"],function(require, exports, module){
	require.get = require;

	var Serialize = require('risk/unit/serialize'),
		former = require('risk/components/former/index');

	var FormList = [{	//项目信息的list
			name:'基本情况',
			tpl:require('./tpl.project.base')
		},{
			name:'赎楼行',
			tpl:require('./tpl.project.ransombank')
		},{
			name:'新贷款资料',
			tpl:require('./tpl.project.newloan')
		},{
			name:'赎楼方式',
			tpl:require('./tpl.project.ransomway')
		}];

	var MOD = {
		getTpl:function(data,canEdit) {
			var list = FormList,
				html = [];
			var i=0,cur,curHtml;
			for(;cur=list[i++];) {
				curHtml = '<div class="well"><div class="header"><h4>'+cur.name+'</h4></div>'+former.make(cur.tpl,{data:data,disabled:!canEdit})+'</div>';
				html.push(curHtml);
			}

			html = html.join('');
			return html;
		},
		getData:function() {
			var data = Serialize($('#Project'))

			return data;
		},
		init:function() {}
	};

	return MOD;
});/**
 * 房产
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 14:53:41
 */

define.pack("./setup.property",["jquery","risk/unit/route","risk/components/former/index","risk/components/msg/index","risk/unit/serialize","risk/page/Property/index","./tmpl","./autoComplete"],function(require, exports, module){
	require.get = require;

	var $ = require('jquery'),
		route = require('risk/unit/route'),
		former = require('risk/components/former/index'),
		msg = require('risk/components/msg/index'),
		Serialize = require('risk/unit/serialize'),
		Property = require('risk/page/Property/index'),
		PropertyTpl = require.get('risk/page/Property/tpl.view');

	var Tmpl = require('./tmpl'),
		AutoComplete = require('./autoComplete');

	var CORE_NAME = ['Code'];

	var MOD = {
		getTpl:function(data,canEdit) {
			var tpl = former.make(PropertyTpl,{
				data:data,
				disabled:!canEdit
			});
			return tpl;
		},
		getData:function() {
			var list = $('#PropertyBase div.j-property-form'),
				data = [];

			var joint = [];//共权人

			list.each(function(i,ele) {
				var curData = Serialize(ele);
				curData.Joint = [];//共权人
				$(ele).parent('.list-group-item').find('.j-property-joint tbody tr').each(function(ii,tr) {
					curData.Joint.push(Serialize(tr));
				});
				data.push(curData);
			});

			return data;
		},
		init:function() {
			route.on('click','property-add',function(ev) {//新增空白房产
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					box = btn.siblings('div.list-group');

				MOD.add(box);
			}).on('click','property-import',function(ev) {//导入房产
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					box = btn.parents('div.block-transparent:first').find('div.list-group:first');

				Property.selector({
					success:function(data) {
						delete data.ID;	//移除id，后台要根据姓名、身份证号来更新已存在客户信息
						MOD.add(box,data);
					}
				});
			}).on('click','property-remove',function(ev) {//移除房产
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					itemClass = 'div.list-group-item',
					box = btn.parents(itemClass),
					boxSize = box.siblings(itemClass).size();

				if (boxSize<=0) {
					msg.error('至少保留有一个房产.');
					return ;
				}else {
					box.slideUp('fase',function() {
						box.remove();
					});
				}
			}).on('click','joint-add',function(ev) {//增加共权人
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					container = btn.parents('.form-group:first').find('.j-property-joint');

				MOD.addJoint(container);
			}).on('click','joint-remove',function(ev) {//移除共权人
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					item = btn.parents('tr:first');
				if (item.siblings().size()<=0) {
					item.parents('table:first').hide();
				}
				item.remove();
			});


			//通过输入的关键字段，自动补齐
			AutoComplete({
				container:$('#PropertyBase'),
				checkList:CORE_NAME,
				cgi:'RiskMgr.Api.AssetApi/Query',
				dataFilter:function(da) {
					var rs = da&&da.Record;
					rs = rs&&rs[0];

					return rs;
				}
			});
		},
		add:function(box,data) {
			box = $(box);

			var html = Tmpl.PropertyItem({
					tpl:this.getTpl,
					data:data,
					canEdit:true
				});

			html = $(html);
			if (data) {//导入的关键数据不可编辑
				html.find('[name="Code"]').attr('disabled','disabled');
			}
			html.hide();
			html.appendTo(box).slideDown('fast', function() {

			});
		},
		addJoint:function(table) {
			table = $(table);
			var html = Tmpl.PropertyJointItem({
					canEdit:true
				}),
				item = $(html).appendTo(table.find('tbody:first'));

			table.show();
			item.find('input').eq(0).focus();
		}
	};

	return MOD;
});/**
 * test-data
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 17:43:41
 */

define.pack("./test-data",[],function(require, exports, module){
  var rs = {
      "Buyers": [{
          "ID": "03a64ab0039345a0ac6d35b692ec6b24",
          "Name": "阿萨德飞44",
          "CardType": "1",
          "IdentityCode": "237856234",
          "Phone": "34234234",
          "Gender": "1",
          "Marrage": "1",
          "Address": "然后统一集团研究与",
          "OrignalName": "old name",
          "OrignalIdentityCode": "111",
          "BankCode": "22222",
          "BankType": "1",
          "WorkUnit": ""
      }, {
          "ID": "2a5f02f79ecb4782a2c041c995067948",
          "Name": "阿萨法 ",
          "CardType": "1",
          "IdentityCode": "986799283948723984",
          "Phone": "123123",
          "Gender": "1",
          "Marrage": "1",
          "Address": "三个地方集团研究研究",
          "OrignalName": "old name",
          "OrignalIdentityCode": "111",
          "BankCode": "22222",
          "BankType": "1",
          "WorkUnit": ""
      }],
      "Sellers": [{
          "ID": "9c919ce940b84f7ca6e87674592e5be0",
          "Name": "张克强",
          "CardType": "1",
          "IdentityCode": "234234234234234",
          "Phone": "13222222222",
          "Gender": "1",
          "Marrage": "1",
          "Address": "水电费水电费阿达撒饭",
          "OrignalName": "old name",
          "OrignalIdentityCode": "111",
          "BankCode": "22222",
          "BankType": "1",
          "WorkUnit": "阿达撒饭额外服务而威尔"
      }],
      "Assets": [{
          "ID": "",
          "Code": "44444444",
          "Usage": "1",
          "Position": "2",
          "Address": "景田西路八个道路",
          "Area": "123",
          "RegPrice": "44232",
          "Joint": [{
              "Name": "共权人111",
              "Phone": "13333333333",
              "IdentityCode": "442233323232345"
          }, {
              "Name": "共权人22222",
              "Phone": "12312314244",
              "IdentityCode": "123454235345345"
          }]
      }, {
          "ID": "",
          "Code": "5698238787",
          "Usage": "1",
          "Position": "1",
          "Address": "深南路北环西路698",
          "Area": "234234",
          "RegPrice": "53425435",
          "Joint": [{
              "Name": "灌灌灌灌",
              "Phone": "23424234",
              "IdentityCode": "234234234234"
          }]
      }, {
          "ID": "",
          "Code": "123456",
          "Usage": "1",
          "Position": "1",
          "Address": "地址地址",
          "Area": "123123",
          "RegPrice": "12312",
          "Joint": []
      }],
      "Project": {
          "Source": "1",
          "AgentName": "神奇的中介",
          "CertificateData": "2015-08-23",
          "AgentContact": "",
          "Rebater": "",
          "RebateAccount": "",
          "OtherRebateInfo": "",
          "OrignalMortgageBank": "1",
          "OrignalMortgageBranch": "很吊的支行",
          "OrignalFundCenter": "2",
          "OrignalFundBranch": "",
          "SupplyCardCopy": "1",
          "OrignalCreditPI": "1244",
          "OrignalCreditCommerceMoney": "12213",
          "OrignalCreditFundMoney": "42121",
          "AssetRansomCustomerManager": "王八蛋",
          "AssetRansomContactPhone": "13434343434",
          "NewCreditBank": "1",
          "NewCreditBranch": "啊啊啊",
          "ShortTermAssetRansomBank": "1",
          "ShortTermAssetRansomBranch": "",
          "GuaranteeMoney": "32434",
          "GuaranteeMonth": "234234",
          "BuyerCreditCommerceMoney": "234234",
          "BuyerCreditFundMoney": "",
          "LoanMoney": "23423",
          "DealMoney": "232",
          "EarnestMoney": "2323",
          "SupervisionMoney": "2323",
          "SupervisionBank": "3223",
          "AssetRansomMoney": "343",
          "CustomerPredepositMoney": "443",
          "CreditReceiverName": "设立",
          "CreditReceiverBank": "可怜的",
          "CreditReceiverAccount": "发动机",
          "TrusteeshipAccount": "",
          "AssetRansomPredictMoney": "23",
          "AssetRansomer": "阿萨德飞",
          "AssetRansomType": "2",
          "PredictDays": "324",
          "ChargeType": "2",
          "CheckNumbersAndLimit": "32423",
          "Stagnationer": ""
      }
  };
return rs;
});/**
 * 项目信息form表单：基本信息
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define.pack("./tpl.project.base",[],function(require, exports, module){
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
});/**
 * 项目信息form表单：新贷款资料
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define.pack("./tpl.project.newloan",[],function(require, exports, module){
	var MOD = [
		[{
			type:'label',
			col:3,
			required:true,
			html:'新贷款银行'
		},{
			col:"3",
			type:'select',
			name:'NewCreditBank',
			required:true,
			options:[{
				name:'请选择',
				value:''
			},{
				name:'招商银行',
				value:1
			},{
				name:'中国银行',
				value:2
			}]
		},{
			type:'label',
			col:3,
			required:true,
			html:'新贷款银行支行'
		},{
			col:"3",
			type:'text',
			name:'NewCreditBranch',
			required:true
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'短期赎楼贷款银行'
		},{
			col:"3",
			type:'select',
			name:'ShortTermAssetRansomBank',
			required:true,
			options:[{
				name:'无',
				value:''
			},{
				name:'AAA',
				value:1
			},{
				name:'BBB',
				value:2
			}]
		},{
			type:'label',
			col:3,
			html:'支行'
		},{
			col:"3",
			type:'text',
			name:'ShortTermAssetRansomBranch',
		}],

		[{
			type:'label',
			col:3,
			html:'担保金额'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'GuaranteeMoney',
			placeholder:'',
			suffix:'万元'
		},{
			type:'label',
			col:'3',
			required:true,
			html:'担保期限'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'GuaranteeMonth',
			placeholder:'',
			suffix:'月'
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'买方贷款金额'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'BuyerCreditCommerceMoney',
			placeholder:'',
			prefix:'商业',
			suffix:'万元'
		},{
			col:'3',
			type:'number',
			name:'BuyerCreditFundMoney',
			placeholder:'',
			prefix:'公积金',
			suffix:'万元'
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'贷款放款金额'
		},{
			col:"3",
			type:'number',
			name:'LoanMoney',
			required:true,
			suffix:'万元'
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'成交金额'
		},{
			col:"3",
			type:'number',
			name:'DealMoney',
			required:true,
			suffix:'万元'
		},{
			type:'label',
			col:3,
			required:true,
			html:'交易定金'
		},{
			col:"3",
			type:'number',
			name:'EarnestMoney',
			required:true,
			suffix:'万元'
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'资金监管'
		},{
			col:"3",
			type:'number',
			name:'SupervisionMoney',
			required:true,
			suffix:'万元'
		},{
			type:'label',
			col:3,
			required:true,
			html:'资金监管银行'
		},{
			col:"3",
			type:'text',
			name:'SupervisionBank',
			required:true
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'用于赎楼的金额'
		},{
			col:"3",
			type:'number',
			name:'AssetRansomMoney',
			required:true,
			suffix:'万元'
		},{
			type:'label',
			col:3,
			required:true,
			html:'客户预存款'
		},{
			col:"3",
			type:'number',
			name:'CustomerPredepositMoney',
			required:true,
			suffix:'万元'
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'贷款接收账户'
		},{
			col:"3",
			type:'text',
			name:'CreditReceiverName',
			placeholder:'姓名',
			required:true
		},{
			col:"3",
			type:'text',
			name:'CreditReceiverBank',
			placeholder:'银行 - 支行',
			required:true
		},{
			col:"3",
			type:'text',
			name:'CreditReceiverAccount',
			placeholder:'账号',
			required:true
		}],

		[{
			type:'label',
			col:3,
			html:'工行安心托管账户'
		},{
			col:9,
			type:'text',
			name:'TrusteeshipAccount',
			placeholder:''
		}]
	];

	return MOD;
});/**
 * 项目信息form表单：赎楼行
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define.pack("./tpl.project.ransombank",[],function(require, exports, module){
	var MOD = [//赎楼行
		[{
			type:'label',
			col:3,
			required:true,
			html:'原按揭银行'
		},{
			col:"3",
			type:'select',
			name:'OrignalMortgageBank',
			required:true,
			options:[{
				name:'请选择',
				value:''
			},{
				name:'招商银行',
				value:1
			},{
				name:'中国银行',
				value:2
			}]
		},{
			type:'label',
			col:3,
			required:true,
			html:'原按揭银行支行'
		},{
			col:"3",
			type:'text',
			name:'OrignalMortgageBranch',
			required:true
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'原贷款公积金中心'
		},{
			col:"3",
			type:'select',
			name:'OrignalFundCenter',
			required:true,
			options:[{
				name:'无',
				value:''
			},{
				name:'AAA',
				value:1
			},{
				name:'BBB',
				value:2
			}]
		},{
			type:'label',
			col:3,
			html:'公积金银行支行'
		},{
			col:"3",
			type:'text',
			name:'OrignalFundBranch',
		}],

		[{
			type:'label',
			col:3,
			html:'是否提供供楼卡复印件'
		},{
			col:"3",
			type:'select',
			name:'SupplyCardCopy',
			options:[{
				name:'请选择',
				value:''
			},{
				name:'否',
				value:1
			},{
				name:'是',
				value:2
			}]
		},{
			type:'label',
			col:'3',
			required:true,
			html:'原贷款本息'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'OrignalCreditPI',
			placeholder:'',
			suffix:'万元'
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'原贷款金额'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'OrignalCreditCommerceMoney',
			placeholder:'',
			prefix:'商业',
			suffix:'万元'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'OrignalCreditFundMoney',
			placeholder:'',
			prefix:'公积金',
			suffix:'万元'
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'赎楼银行客户经理'
		},{
			col:"3",
			type:'text',
			name:'AssetRansomCustomerManager',
			required:true
		},{
			type:'label',
			col:3,
			required:true,
			html:'联系电话'
		},{
			col:"3",
			type:'tel',
			name:'AssetRansomContactPhone',
			required:true
		}]
	];

	return MOD;
});/**
 * 项目信息form表单：赎楼方式
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define.pack("./tpl.project.ransomway",[],function(require, exports, module){
	var MOD = [
		[{
			type:'label',
			col:3,
			required:true,
			html:'预计总赎楼金额'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'AssetRansomPredictMoney',
			placeholder:'',
			suffix:'万元'
		},{
			type:'label',
			col:3,
			required:true,
			html:'赎楼员'
		},{
			col:"3",
			type:'text',
			name:'AssetRansomer',
			required:true
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'赎楼方式'
		},{
			col:"3",
			type:'select',
			name:'AssetRansomType',
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
			html:'预存时间'
		},{
			col:"3",
			type:'number',
			name:'PredictDays',
			required:true,
			suffix:'天'
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'收费方式'
		},{
			col:"3",
			type:'select',
			required:true,
			name:'ChargeType',
			options:[{
				name:'请选择',
				value:''
			},{
				name:'赎楼前收取',
				value:1
			},{
				name:'赎楼后收取',
				value:2
			}]
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'申请支票数量及限额'
		},{
			col:'3',
			type:'text',
			required:true,
			name:'CheckNumbersAndLimit',
			placeholder:''
		},{
			type:'label',
			col:'3',
			required:true,
			html:'驻点人员'
		},{
			col:'3',
			type:'text',
			name:'Stagnationer',
			placeholder:''
		}]
	];

	return MOD;
});/**
 * 申请额度表单视图
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define.pack("./view",["jquery","risk/unit/route","risk/components/msg/index","risk/components/modal/index","risk/unit/ajax","./tmpl","./wizzard","./setup.customer","./setup.property","./setup.project","./test-data"],function(require, exports, module){

	var $ = require('jquery'),
		route = require('risk/unit/route'),
		msg = require('risk/components/msg/index'),
		Modal = require('risk/components/modal/index'),
		Ajax = require('risk/unit/ajax'),
		Tmpl = require('./tmpl'),
		Wizzard = require('./wizzard');

	var Customer = require('./setup.customer'),
		Property = require('./setup.property'),
		Project = require('./setup.project');

	var MOD = {
		/**
		 * @param opts {Object} 配置项：
			mode:模式，可选有add、edit、view
			head:标题文本
			data:表单数据
		 */
		init:function(opts) {
			var mode = opts.mode,
				data = opts.data,
				head = opts.head;

			var that = this;
			var html = Tmpl.Setup({
				customerTpl:Customer.getTpl,	//获取公共客户模板的函数
				propertyTpl:Property.getTpl,
				projectTpl:Project.getTpl,
				data:data,
				mode:mode,
				canEdit:!!~$.inArray(mode, ['add','edit'])
			});
			route.show({
				head:head,
				content:html
			});

			Wizzard.init({
				container:'#J_Wizzard',
				success:function() {
					if (mode=='approval') {
						that.approval(mode);
					}else {
						that.submit(mode);
					}
				}
			});

			this._initEvent();


			$('#TEST').click(function(ev) {
				ev.preventDefault();
				var data = require('./test-data');
				console.log('ttt',data);
				MOD.submit(mode,data);
			});
		},
		_initEvent:function() {
			Customer.init();
			Property.init();
			Project.init();

			route.on('click','cancel',function(ev) {//取消按钮
				ev.preventDefault();
				Modal.show({
					content:'您填写的表单将不会被保存，是否要取消？',
					okValue:'确认取消',
					ok:function() {
						route.load('page=apply-amount');
					},
					cancelValue:'不取消'
				});
			});
		},
		//提交表单
		submit:function(mode,data) {
			var dataCustomer = Customer.getData();
			var data = {
				Buyers:dataCustomer.buyer,
				Sellers:dataCustomer.seller,
				Assets:Property.getData(),
				Project:Project.getData()
			};

			if (data) {//使用测试数据
				data = data;
			}

			Ajax.post({
				url:'RiskMgr.Api.ProjectApi/Add',
				data:data,
				success:function(data, textStatus, jqXHR) {
					msg.success('申请成功');
				}
			});
		},
		//提交审批
		approval:function() {
			alert('审批拉')
		}
	};

	return MOD;
});/**
 * 向导类表单
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-29 15:47:29
 */

define.pack("./wizzard",["jquery","risk/unit/class","risk/components/parsley/index"],function(require, exports, module){
	var $ = require('jquery'),
		Clone = require('risk/unit/class').clone,
		parsley = require('risk/components/parsley/index');

	var MOD = {
		_DEFAULT_CONFIG:{
			configKey:'___CONFIG___',	//存储配置用的公共key
			setting:{	//默认配置
				highlight:'active'	//导航栏高亮className
				//,container:''	//主容器，如果需要校验表单，则需保证该容器为form
				,nav:'.wizard-steps'	//导航
				,navHook:'data-target'	//导航的data属性
				,setup:'.step-pane'	//每一个setup的选择器
				,btnNext:'.wizard-next'	//下一步按钮的选择器
				,btnPrev:'.wizard-previous'	//上一步按钮的选择器
				,validate:true	//进入下一步时，是否要校验表单
				//,success:function() {}	//最后一步完成时执行
			}
		},
		init:function (setting) {
			var initKey = this._DEFAULT_CONFIG.configKey,
				obj=this;
			if(!this[initKey]) {
				obj = Clone(MOD);
				obj[initKey] = true;
				return obj.init.apply(obj,arguments);
			}

			var conf = this._initConfig(setting);

			this.container = $(conf.container);
			this.nav = this.container.find(conf.nav);

			this._initBox();
			this._initButton();

			return this;
		},
		_success:function() {
			var conf = this._config(),
				setups = (function(nav,hook) {
					var rs = [];
					nav.find('['+hook+']').each(function(i,elem) {
						rs.push($(elem).attr(hook));
					});
					return rs;
				})(this.nav,conf.navHook);
			var i=0, l = setups.length,
				notValidate,
				setupNotValid = null;
			for(; i < l; ++i) {
				if (!this.parsley.validateElements($('#'+setups[i]).find(':input'))) {
					notValidate = true;
					if (!setupNotValid) {
						setupNotValid = setups[i];
					}
				}
			}

			if (notValidate) {
				this._show(setupNotValid);
				return ;
			}

			conf.success && conf.success();
		},
		_initBox:function() {
			var conf = this._config(),
				highlight = conf.highlight,
				that = this;

			//初始时显示
			this.nav.find('li').each(function(i,ele) {
				ele = $(ele);
				var id = ele.data('target'),
					box = $('#'+id);

				//默认值显示激活的步骤
				if (ele.hasClass(highlight)) {
					box.show();
				}else {
					box.hide();
				}
			});

			//初始化校验
			this.parsley = this.container.parsley();
		},
		//初始化按钮事件
		_initButton:function() {
			var that = this;
			var conf = this._config(),
				btnNext = conf.btnNext,
				btnPrev = conf.btnPrev;

			this.container.on('click',btnNext,function(ev) {
				ev.preventDefault();
				var btn = $(ev.currentTarget);
				that._showByButton(btn,'next');
			});
			this.container.on('click',btnPrev,function(ev) {
				ev.preventDefault();
				var btn = $(ev.currentTarget);
				that._showByButton(btn,'prev');
			});

			this.nav.on('click','['+conf.navHook+']',function(ev) {
				ev.preventDefault();
				var elem = $(ev.currentTarget),
					setup = elem.attr(conf.navHook);
				that._show(setup);
			});
		},
		/** 根据setup的ID来显示
		 * @param setupID {Selector} 需要显示的setup id
		 */
		_show:function(setupID) {
			var conf = this._config(),
				highlight = conf.highlight,
				nav = this.nav,
				boxs = this.container.find(conf.setup);

			nav.find('['+conf.navHook+']').removeClass(highlight);
			nav.find('['+conf.navHook+'="'+setupID+'"]').addClass(highlight);
			boxs.hide().filter('[id="'+setupID+'"]').show();

			$(window).scrollTop(0);	//滚动到顶部
		},
		/** 根据按钮来和类型来显示指定setup
		 * @param btn
		 * @param type {String} 可选值有：next、prev
		 */
		_showByButton:function(btn,type) {
			btn = $(btn);
			var conf = this._config(),
				highlight = conf.highlight,
				box = btn.parents(conf.setup+':first'),
				oldName = box.attr('id'),
				oldNav = this.nav.find('[data-target="'+oldName+'"]'),
				oldBox = this.container.find('#'+oldName),
				newNav = oldNav[type](),
				newName = newNav.data('target');

			//进入下一步之前校验当前表单
			if (type==='next' && !( !conf.validate || this.parsley.validateElements(box.find(':input')) ) ) {
				return false;
			}

			if (conf[oldName]) {//执行单步骤回调
				conf[oldName]();
			}

			if (newName) {
				this._show(newName);
			}else if (type==='next') {	//下一步按钮，没有newName了，标示为success
				this._success();
			}else {
				throw "找不到正确的步骤";
			}
		},
		/** 初始化配置 */
		_initConfig:function (setting) {
			var def = this._DEFAULT_CONFIG.setting,
				key = this._DEFAULT_CONFIG.configKey,
				conf;
			conf = this[key] = $.extend({},def,setting);

			return this[key];
		},
		/** 读、写配置
		 * @param
		 */
		_config:function (key,value) {
			var ckey = this._DEFAULT_CONFIG.configKey;
			var rs;
			var store = this[ckey],
				argLen = arguments.length;
			if(argLen>=2) {	//set
				store[key] = value;
				rs = store;
			}else if(argLen==1) {	//get
				rs = store[key];
			}else {	//默认返回全部配置
				rs = store;
			}
			return rs;
		}
	};

	return MOD;
});
//tmpl file list:
//apply/src/choose.tmpl.html
//apply/src/setup.customer.tmpl.html
//apply/src/setup.project.tmpl.html
//apply/src/setup.property.tmpl.html
//apply/src/setup.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'choose': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="block-flat">\n	<h3 class="hthin">请选择业务类型</h3>\n	<div class="spacer spacer-bottom">\n		<button type="button" data-hook="choose-type" data-type="1" class="btn btn-success btn-lg">二手楼买卖交易</button>\n		<!--\n		<button type="button" data-hook="choose-type" data-type="2" class="btn btn-primary btn-lg">首期款垫付</button>\n		<button type="button" data-hook="choose-type" data-type="3" class="btn btn-info btn-lg">现金赎楼</button>\n		<button type="button" data-hook="choose-type" data-type="4" class="btn btn-danger btn-lg">红本抵押</button>\n		</div>\n		-->\n</div>');

return __p.join("");
},

'SetupCustomer': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

		var FormData = data.data || {};
	__p.push('	<div class="step-pane" id="Customer">\n		<div class="block-transparent">\n			<div class="header">\n				<h3>买家 ');
if (data.canEdit) {__p.push('<button type="button" class="btn btn-default" data-hook="customer-import"><i class="fa fa-sign-in"></i> 导入现有客户</button>');
}__p.push('</h3>\n			</div>\n			<div class="content">\n				<div class="list-group tickets" id="BuyerList">');

						var Buyer = FormData.Buyers||[];
						var i=0, l = Buyer.length||1;
						for(; i < l; ++i) {
					__p.push('						');
_p(this.CustomerItem({
							data:Buyer[i],
							tpl:data.customerTpl,
							canEdit:data.canEdit
						}));
__p.push('					');

						}
					__p.push('				</div>');
if (data.canEdit) {__p.push('					<button type="button" class="btn btn-success" data-hook="customer-add">&nbsp;&nbsp;<i class="fa fa-plus"></i> 增加买家&nbsp;&nbsp;</button>');
}__p.push('			</div>\n		</div>\n\n		<div class="block-transparent">\n			<div class="header">\n				<h3>卖家 ');
if (data.canEdit) {__p.push('<button type="button" class="btn btn-default" data-hook="customer-import"><i class="fa fa-sign-in"></i> 导入现有客户</button>');
}__p.push('</h3>\n			</div>\n			<div class="content">\n				<div class="list-group tickets" id="SellerList">');

						var Sellers = FormData.Sellers||[];
						var i=0, l = Sellers.length||1;
						for(; i < l; ++i) {
					__p.push('						');
_p(this.CustomerItem({
							data:Sellers[i],
							tpl:data.customerTpl,
							canEdit:data.canEdit
						}));
__p.push('					');

						}
					__p.push('				</div>');
if (data.canEdit) {__p.push('				<button type="button" class="btn btn-success" data-hook="customer-add">&nbsp;&nbsp;<i class="fa fa-plus"></i> 增加卖家&nbsp;&nbsp;</button>');
}__p.push('			</div>\n		</div>\n		<div class="form-group">\n			<div class="text-center col-sm-12">');
if (data.canEdit) {__p.push('				<button class="btn btn-default wizard-cancel" data-hook="cancel">取消</button>\n				&nbsp;&nbsp;');
}__p.push('				<button class="btn btn-primary wizard-next">下一步 <i class="fa fa-caret-right"></i></button>\n			</div>\n		</div>\n	</div>');

return __p.join("");
},

'CustomerItem': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div class="list-group-item">');
_p(data.tpl(data.data,data.canEdit));
__p.push('		');

			if (data.canEdit) {
		__p.push('			<hr style="border-bottom:1px dashed #dadada"/>\n			<div class="col-sm-offset-2">\n				<button type="button" class="btn btn-danger" data-hook="customer-remove">移除</button>\n			</div>');

			}
		__p.push('	</div>');

return __p.join("");
},

'SetupProject': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var FormData = data.data||{};
__p.push('<div class="step-pane" id="Project">\n	<div class="block-transparent">\n		<div class="header">\n			<h3>项目信息</h3>\n		</div>\n		<div class="content">');
_p(data.projectTpl(FormData.Project,data.canEdit));
__p.push('		</div>\n	</div>\n	<div class="form-group">\n		<div class="text-center col-sm-12">\n			<button class="btn btn-default wizard-previous"><i class="fa fa-caret-left"></i> 上一步</button>\n			&nbsp;&nbsp;');
if (data.canEdit) {__p.push('			<button class="btn btn btn-success wizard-next">提交 <i class="fa fa-caret-right"></i></button>');
}__p.push('			');
if (data.mode == 'approval') {__p.push('			<button class="btn btn btn-success wizard-next">提交审批 <i class="fa fa-caret-right"></i></button>');
}__p.push('		</div>\n	</div>\n</div>');

return __p.join("");
},

'SetupProperty': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var FormData = data.data || {};
__p.push('<div class="step-pane" id="Assets">\n	<div class="block-transparent">\n		<div class="header">\n			<h3>房产 ');
if (data.canEdit) {__p.push('<button type="button" class="btn btn-default" data-hook="property-import"><i class="fa fa-sign-in"></i> 导入现有房产</button>');
}__p.push('</h3>\n		</div>\n		<div class="content">\n			<div class="list-group tickets" id="PropertyBase">');

					var Property = FormData.Assets||[];
					var i=0, l = Property.length||1;
					for(; i < l; ++i) {
				__p.push('					');
_p(this.PropertyItem({
						data:Property[i],
						tpl:data.propertyTpl,
						canEdit:data.canEdit
					}));
__p.push('				');

					}
				__p.push('			</div>');
if (data.canEdit) {__p.push('			<button type="button" class="btn btn-success" data-hook="property-add">&nbsp;&nbsp;<i class="fa fa-plus"></i> 增加房产&nbsp;&nbsp;</button>');
}__p.push('		</div>\n	</div>\n\n	<div class="form-group">\n		<div class="text-center col-sm-12">\n			<button class="btn btn-default wizard-previous"><i class="fa fa-caret-left"></i> 上一步</button>\n			&nbsp;&nbsp;\n			<button class="btn btn-primary wizard-next">下一步 <i class="fa fa-caret-right"></i></button>\n		</div>\n	</div>\n</div>');

return __p.join("");
},

'PropertyItem': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	<div class="list-group-item">\n		<div class="j-property-form">');
_p(data.tpl(data.data,data.canEdit));
__p.push('		</div>\n		<div class="form-group">');

				var Joint = data.data&&data.data.Joint || [],
					JointLen = Joint.length;
			__p.push('			<div class="col-sm-2">&nbsp;</div>\n			<div class="col-sm-10">');
if (data.canEdit) {__p.push('<button type="button" data-hook="joint-add" class="btn btn-default btn-xs"><i class="fa fa-plus"></i> 增加共权人</button>');
}__p.push('				&nbsp;&nbsp;');
_p((JointLen||data.canEdit)?'(房产共权人、保证人、配偶、辅助联系人、第三方借款人)':'');
__p.push('			</div>\n			<div class="col-sm-2">&nbsp;</div>\n			<div class="col-sm-10">\n				<table class="no-border no-strip j-property-joint" style="background-color:#fff;margin-top:10px; ');
_p(JointLen?'':'display:none;');
__p.push('">\n					<thead class="no-border">\n						<tr>\n							<th>姓名</th>\n							<th>电话</th>\n							<th>证件号</th>\n							<th>&nbsp;</th>\n						</tr>\n					</thead>\n					<tbody class="no-border-x no-border-y">');

							var i=0, l = JointLen;
							for(; i < l; ++i) {
						__p.push('							');
_p(this.PropertyJointItem({
								data:Joint[i],
								canEdit:data.canEdit
							}));
__p.push('						');

							}
						__p.push('					</tbody>\n				</table>\n			</div>\n		</div>');
if (data.canEdit) {__p.push('		<hr style="border-bottom:1px dashed #dadada"/>\n		<div class="col-sm-offset-2">\n			<button type="button" class="btn btn-danger" data-hook="property-remove">移除</button>\n		</div>');
}__p.push('	</div>');

return __p.join("");
},

'PropertyJointItem': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

		var FormData = data.data || {};
	__p.push('	<tr>\n		<td><input type="text" name="Name" value="');
_p(FormData.Name||'');
__p.push('" placeholder="输入姓名" ');
_p(data.canEdit?'':'disabled');
__p.push(' /></td>\n		<td><input type="text" name="Phone" value="');
_p(FormData.Phone||'');
__p.push('" placeholder="输入电话" ');
_p(data.canEdit?'':'disabled');
__p.push(' /></td>\n		<td><input type="text" name="IdentityCode" value="');
_p(FormData.IdentityCode||'');
__p.push('" placeholder="输入证件号" ');
_p(data.canEdit?'':'disabled');
__p.push(' /></td>\n		<td>');
if (data.canEdit) {__p.push('<i class="pointer-item fa fa-times" data-hook="joint-remove"></i>');
}__p.push('</td>\n	</tr>');

return __p.join("");
},

'Setup': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="col-md-12">\n<button class="btn btn btn-danger" id="TEST">直接提交测试数据</button>\n	<form class="form-horizontal block-wizard" id="J_Wizzard" action="#">\n		<ul class="wizard-steps">');
if (data.mode=='add') {__p.push('			<li>选择类型<span class="chevron"></span></li>');
}__p.push('			<li data-target="Customer" class="active">客户信息<span class="chevron"></span></li>\n			<li data-target="Assets">房产信息<span class="chevron"></span></li>\n			<li data-target="Project">项目信息<span class="chevron"></span></li>\n		</ul>\n		<div class="step-content">');
_p(this.SetupCustomer(data));
__p.push('			');
_p(this.SetupProperty(data));
__p.push('			');
_p(this.SetupProject(data));
__p.push('		</div>\n	</form>\n</div>');

return __p.join("");
}
};
return tmpl;
});

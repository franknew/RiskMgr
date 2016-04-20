//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["jquery","risk/unit/ajax","risk/components/msg/index","risk/components/modal/index","risk/unit/uri","risk/page/trade/config","risk/unit/route","risk/unit/serialize","risk/unit/string","risk/components/former/index","risk/page/customer/index","risk/page/Property/index","risk/unit/class","risk/components/parsley/index"],function(require,exports,module){

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
//apply/src/setup.approval.js
//apply/src/setup.charge.js
//apply/src/setup.customer.js
//apply/src/setup.finance.js
//apply/src/setup.followup.js
//apply/src/setup.guarantor.js
//apply/src/setup.js
//apply/src/setup.project.js
//apply/src/setup.property.js
//apply/src/test-data.js
//apply/src/tpl.charge.js
//apply/src/tpl.finance.js
//apply/src/tpl.followup.js
//apply/src/tpl.project.base.js
//apply/src/tpl.project.newloan.js
//apply/src/tpl.project.ransombank.js
//apply/src/tpl.project.ransomway.js
//apply/src/wizzard.js
//apply/src/choose.tmpl.html
//apply/src/setup.approval.tmpl.html
//apply/src/setup.charge.tmpl.html
//apply/src/setup.customer.tmpl.html
//apply/src/setup.finance.tmpl.html
//apply/src/setup.followup.tmpl.html
//apply/src/setup.guarantor.tmpl.html
//apply/src/setup.project.tmpl.html
//apply/src/setup.property.tmpl.html
//apply/src/setup.report.tmpl.html
//apply/src/setup.tmpl.html

//js file list:
//apply/src/autoComplete.js
//apply/src/data.js
//apply/src/index.js
//apply/src/setup.approval.js
//apply/src/setup.charge.js
//apply/src/setup.customer.js
//apply/src/setup.finance.js
//apply/src/setup.followup.js
//apply/src/setup.guarantor.js
//apply/src/setup.js
//apply/src/setup.project.js
//apply/src/setup.property.js
//apply/src/test-data.js
//apply/src/tpl.charge.js
//apply/src/tpl.finance.js
//apply/src/tpl.followup.js
//apply/src/tpl.project.base.js
//apply/src/tpl.project.newloan.js
//apply/src/tpl.project.ransombank.js
//apply/src/tpl.project.ransomway.js
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

define.pack("./data",["jquery","risk/components/msg/index","risk/components/modal/index","risk/unit/ajax","risk/unit/uri"],function(require, exports, module){
	var $ = require('jquery'),
		msg = require('risk/components/msg/index'),
		Modal = require('risk/components/modal/index'),
		Ajax = require('risk/unit/ajax'),
		Uri = require('risk/unit/uri');

	var _CACHE,_DEFER;
	var MOD = {
		/** 拉取数据
		 * @param [cache=true] 是否读缓存，默认为true
		 */
		get:(function() {
			var _getNew = function(callback) {
				var data = Uri('http://www.qq.com/?'+location.hash.substr(1)).params;
				delete data.action;
				delete data.page;
				Ajax.post({
					url:'RiskMgr.Api.ProjectApi/InitApproval',
					data:data,
					success:function(da) {
						callback(da);
					}
				});
			};
			return function(cache) {
				if (arguments.length<=0) {
					cache = true;
				}
				cache = false;	//暂时永不cache，需要做根据id来cache
				if (_CACHE && _DEFER && cache) {
					_DEFER.resolve(_CACHE);
				}else if ( !cache || !_DEFER) {
					_DEFER = $.Deferred();
					_getNew(function(da) {
						_CACHE = da;
						_DEFER.resolve(_CACHE);
					});
				}

				return _DEFER;
			};
		})(),
		clearCache:function() {
			_CACHE = null;
			_DEFER = null;
		},
		//获取url上面的参数
		params:function() {
			var data = Uri('http://www.qq.com/?'+location.hash.substr(1)).params;
			var rs = {
				ID:data.ID,
				WorkflowID:data.WorkflowID,
				ActivityID:data.ActivityID,
				TaskID:data.TaskID
			};

			return rs;
		}
	};

	return MOD;
});/**
 * 申请额度主入口
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */
define.pack("./index",["risk/page/trade/config","jquery","risk/unit/ajax","risk/unit/route","risk/components/msg/index","./tmpl","./setup","./data"],function(require, exports, module){

	var Configs = require('risk/page/trade/config');//模板用到
	var $ = require('jquery'),
		Ajax = require('risk/unit/ajax'),
		Route = require('risk/unit/route'),
		Msg = require('risk/components/msg/index'),
		Tmpl = require('./tmpl'),
		Setup = require('./setup'),
		Types = Configs.type,
		Data = require('./data');

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
					subHead = Types.get(type),
					head = '申请额度 <small>'+subHead+'</small>';
				Setup.init({
					mode:'add',
					head:head,
					data:{
						Project:{
							Type:type
						}
					}
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
			//显示页面的主入口，先清理缓存
			require('./data').clearCache();

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

			require('./data').get().done(function(data) {
				data = data || {};
				var id = data.Project&&data.Project.Name,
					type = data.Project&&data.Project.Type,
					typeName = Types.get(type),
					canDiscard = data.DisplayDiscard;	//可以作废

				var extraText = [];

				if (!(data&&data.WorkflowComplete)) {
					extraText.push('<button type="button" class="btn btn-primary" data-hook="trade-print">打印申请单</button>');
				}

				if (canDiscard) {
					extraText.push('<button type="button" class="btn btn-danger" data-workflowID="'+data.WorkflowID+'" data-tip="'+typeName+'('+id+')'+'" data-hook="trade-discard">作废该单</button>');
				}

				extraText = extraText.join(' ');

				Setup.init({
					mode:params.action,
					head:head+' <small>'+typeName+'('+id+') '+extraText+'</small>',
					data:data,
					showed:params.tab || ''
				});

				MOD._initEvent();
			});
		},
		_initEvent:function() {
			//必须用bind，防止重复绑定
			var header = $('#J_Header');

			header.find('[data-hook="trade-print"]').bind('click',function(ev) {
				//打印单据
				//window.open(location.href.replace(/\b[\&]?action=([^\&]*)\b/,'').replace(/\bpage=([^\&]*)\b/,'page=trade/print'));
				var params = Data.params();
				window.open(location.protocol+'//'+location.host+'#page=trade/print&ID='+params.ID);
			});

			header.find('[data-hook="trade-discard"]').bind('click',function(ev) {
				//作废单据
				ev.preventDefault();
				var $elem = $(ev.currentTarget),
					txt = $elem.attr('data-tip'),
					id = $elem.attr('data-workflowID');
				if (!confirm('确认废弃单据“'+txt+'”？')) {
					return ;
				}

				Ajax.post({
					url:'RiskMgr.Api.ProjectApi/StopWorkflow',
					data:{
						WorkflowID:id
					},
					success:function(data, textStatus, jqXHR) {
						Msg.success('废弃成功.');
						Route.load('page=trade/list');
					}
				});
			});
		}
	};

	return MOD;
});/**
 * 审批相关
 * @authors viktorli (i@lizhenwen.com)
 */

define.pack("./setup.approval",["jquery","risk/unit/ajax","risk/unit/route","risk/components/msg/index","./data"],function(require, exports, module){
	var $ = require('jquery'),
		Ajax = require('risk/unit/ajax'),
		Route = require('risk/unit/route'),
		Msg = require('risk/components/msg/index');

	var Data = require('./data');

	var MOD = {
		init:function() {
			Route.on('click','approval-pass',function(ev) {//审批通过
				ev.preventDefault();
				MOD._submit(true);
			}).on('click','approval-fail',function(ev) {//审批不通过
				ev.preventDefault();
				MOD._submit(false);
			});
		},
		/** 提交审批
		 * @param result {Boolen} 是否通过
		 */
		_submit:function(result,success) {
			var ipt = $('#Approval textarea[name="Remark"]'),
				remark = $.trim(ipt.val());
			if (!remark) {
				Msg.error('请输入审批意见');
				ipt.focus();
				return false;
			}
			var Params = Data.params();

			Ajax.post({
				url:'RiskMgr.Api.ProjectApi/Approval',
				data:{
					//审批不用  ID:Params.ID,
					WorkflowID:Params.WorkflowID,
					ActivityID:Params.ActivityID,
					TaskID:Params.TaskID || Params.ID,
					Approval:{
						Remark:remark,
						Status:result?1:2
					}
				},
				success:function(da) {
					Msg.success('处理成功.');
					Route.load('page=trade/apply&action=view&tab=Approval&ID='+Params.ID);
					success && success(da);
				}
			});
		}
	};

	return MOD;
});/**
 * 财务相关
 * @authors viktorli (i@lizhenwen.com)
 */

define.pack("./setup.charge",["jquery","risk/unit/serialize","risk/unit/ajax","risk/unit/route","risk/unit/string","risk/components/msg/index","./data"],function(require, exports, module){
	var $ = require('jquery'),
		Serialize = require('risk/unit/serialize'),
		Ajax = require('risk/unit/ajax'),
		route = require('risk/unit/route'),
		string = require('risk/unit/string'),
		Msg = require('risk/components/msg/index');

	var Data = require('./data');

	var MOD = {
		init:function() {
			route.on('click','charge-submit',function(ev) {//提交财务信息
				ev.preventDefault();

				var Params = Data.params();

				Ajax.post({
					url: 'RiskMgr.Api.ProjectApi/UpdateCharge',
					data:{
						ID:Params.ID,
						WorkflowID:Params.WorkflowID,
						ActivityID:Params.ActivityID,
						TaskID:Params.TaskID,
						Project:Serialize($('#Charge'))
					},
					success:function(da) {
						route.reload('tab=Charge');
						Msg.success('提交成功.');
					}
				});
			});

			//自动计算回款时间
			var chargeBox = route.container.find('#Charge'),
				ExportTime = 'ExportTime',	//放款时间
				GuaranteePeriod = 'GuaranteePeriod',	//担保期限
				PaymentDate = 'PaymentDate';	//回款时间
			chargeBox.find('input[name="'+ExportTime+'"],input[name="'+GuaranteePeriod+'"]').bind('keyup change',function(ev) {
				var time = chargeBox.find('input[name="'+ExportTime+'"]').val(),
					limit = chargeBox.find('input[name="'+GuaranteePeriod+'"]').val() *1 + 1,	//需要把放款当天也算进来
					rs;
				if (time && limit && !isNaN(limit)) {
					time = new Date(time);
					rs = time.setDate(time.getDate()+limit);	//得到时间戳
					rs = string.date(rs,'yyyy-MM-dd');
				}else{
					rs = ''
				}

				chargeBox.find('input[name="'+PaymentDate+'"]').val(rs);
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
				thirdpartyList = $('#ThirdpartyList div.list-group-item'),
				data = {
					buyer:[],
					seller:[],
					thirdparty:[]
				};

			buyerList.each(function(i,ele) {
				data.buyer.push(Serialize(ele));
			});
			sellerList.each(function(i,ele) {
				data.seller.push(Serialize(ele));
			});
			thirdpartyList.each(function(i,ele) {
				data.thirdparty.push(Serialize(ele));
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
						MOD.add(box,data,true);
					}
				});

			}).on('click','customer-remove',function(ev) {//移除客户
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					itemClass = 'div.list-group-item',
					box = btn.parents(itemClass),
					boxSize = box.siblings(itemClass).size(),
					partyID = box.parent('.list-group').attr('id');

				var notRequire = !!~$.inArray(partyID, ['ThirdpartyList']);

				if (boxSize<=0 && !notRequire) {
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
			/*//先禁用，现在匹配到后会禁止修改，体验上不好，待优化
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
			*/

		},
		add:function(box,data,removeEmpty) {
			box = $(box);
			//移除空白的
			if (removeEmpty) {
				box.find('.list-group-item').each(function(i,ele) {
					var $ele = $(ele);
					if (!$ele.find('[name="Name"]').val()) {	//姓名没填就标识要删掉
						$ele.slideUp('fase',function() {
							$ele.remove();
						});
					}
				});
			}

			//移除id，不要复用id，后台的逻辑多个单会串
			if (data && data.ID) {
				data.ID = undefined;
				delete data.ID;
			}

			var html = Tmpl.CustomerItem({
					tpl:this.getTpl,
					data:data,
					canEdit:true
				});

			html = $(html);
			if (data) {//导入的关键数据不可编辑
				//html.find('[name="Name"],[name="CardType"],[name="IdentityCode"]').attr('disabled','disabled');
			}
			html.hide();
			html.appendTo(box).slideDown('fast', function() {});

		}
	};

	return MOD;
});/**
 * 回款确认
 * @authors viktorli (i@lizhenwen.com)
 */

define.pack("./setup.finance",["jquery","risk/unit/ajax","risk/unit/route","risk/components/msg/index","./data"],function(require, exports, module){
	var $ = require('jquery'),
		Ajax = require('risk/unit/ajax'),
		Route = require('risk/unit/route'),
		Msg = require('risk/components/msg/index');


	var Data = require('./data');
	var MOD = {
		init:function() {
			Route.on('click','finance-submit',function(ev) {//提交回款确认
				ev.preventDefault();

				if (!confirm('回款成功后单据将不可再修改，是否确认？')) {
					return ;
				}

				var Params = Data.params();
				Ajax.post({
					url:'RiskMgr.Api.ProjectApi/FinanceConfirm',
					data:{
						ID:Params.ID,
						WorkflowID:Params.WorkflowID,
						ActivityID:Params.ActivityID,
						TaskID:Params.TaskID
					},
					form:$('#FinanceConfirm'),
					success:function(da) {
						Msg.success('已成功确认回款.');
						Route.reload('tab=FinanceConfirm');
					}
				});
			}).on('click','finance-save',function(ev) {//保存回款
				ev.preventDefault();

				var Params = Data.params();
				Ajax.post({
					url:'RiskMgr.Api.ProjectApi/FinanceConfirmSave',
					data:{
						ID:Params.ID,
						WorkflowID:Params.WorkflowID,
						ActivityID:Params.ActivityID,
						TaskID:Params.TaskID
					},
					form:$('#FinanceConfirm'),
					success:function(da) {
						Msg.success('保存成功.');
						Route.reload('tab=FinanceConfirm');
					}
				});

			});
		}
	};

	return MOD;
});/**
 * 保后跟踪
 * @authors viktorli (i@lizhenwen.com)
 */

define.pack("./setup.followup",["jquery","risk/unit/ajax","risk/unit/route","risk/components/msg/index","risk/unit/serialize","./data"],function(require, exports, module){
	var $ = require('jquery'),
		Ajax = require('risk/unit/ajax'),
		Route = require('risk/unit/route'),
		Msg = require('risk/components/msg/index');

	var Serialize = require('risk/unit/serialize');

	var Data = require('./data');

	var MOD = {
		init:function() {
			Route.on('click','followup-submit',function(ev) {//提交保后跟踪信息
				ev.preventDefault();

				var Params = Data.params();
				Ajax.post({
					url:'RiskMgr.Api.ProjectApi/UpdateTracking',
					data:{
						ID:Params.ID,
						WorkflowID:Params.WorkflowID,
						ActivityID:Params.ActivityID,
						TaskID:Params.TaskID,
					},
					form:$('#Followup'),
					success:function(da) {
						Msg.success('提交成功.');
						Route.reload('tab=Followup');
					}
				});
			});
		}
	};

	return MOD;
});/**
 * 担保人信息
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 14:53:02
 */

define.pack("./setup.guarantor",["jquery","risk/unit/route","risk/components/former/index","risk/components/msg/index","risk/unit/serialize","risk/page/Property/index","risk/page/customer/index","./tmpl"],function(require, exports, module){
	require.get = require;

	var $ = require('jquery'),
		route = require('risk/unit/route'),
		former = require('risk/components/former/index'),
		msg = require('risk/components/msg/index'),
		Serialize = require('risk/unit/serialize'),
		Property = require('risk/page/Property/index'),
		Customer = require('risk/page/customer/index'),
		CustomerFormTpl = require.get('risk/page/customer/tpl.view');

	var Tmpl = require('./tmpl');

	var CORE_NAME = ['Name','IdentityCode','CardType'];

	var MOD = {
		getData:function() {
			var list = $('#GuarantorBase div.j-guarantor-form'),
				data = [];

			var assets = [];//房产

			list.each(function(i,ele) {
				var curData = Serialize(ele);
				assets = curData.Assets = [];//房产
				$(ele).parent('.list-group-item').find('.j-houseitem').each(function(ii,tr) {
					assets.push(Serialize(tr));
				});
				data.push(curData);
			});

			return data;
		},
		init:function() {
			route.on('click','guarantor-import',function(ev) {	//导入现有数据
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					box = btn.parents('div.block-transparent:first').find('div.list-group:first');

				Customer.selector({
					success:function(data) {
						MOD.add(box,data,true);
					}
				});

			}).on('click','guarantor-import-house',function(ev) {	//导入现有房产
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					box = btn.parent().siblings('div.j-guarantor-house');

				Property.selector({
					success:function(data) {
						delete data.ID;	//移除id，后台要根据姓名、身份证号来更新已存在客户信息
						MOD.addHouse(box,data);
					}
				});

			}).on('click','guarantor-remove',function(ev) {//移除
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					itemClass = 'div.list-group-item',
					box = btn.parents(itemClass),
					boxSize = box.siblings(itemClass).size();
				box.slideUp('fase',function() {
					box.remove();
				});
			}).on('click','guarantor-add',function(ev) {//新增
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					box = btn.siblings('div.list-group');
				MOD.add(box);
			}).on('click','guarantor-addhouse',function(ev) {
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					box = btn.parent().siblings('div.j-guarantor-house');

				MOD.addHouse(box,1);
			}).on('click','guarantor-removehouse',function(ev) {
				ev.preventDefault();
				var btn = $(ev.currentTarget),
					itemClass = 'div.j-houseitem',
					box = btn.parents(itemClass),
					boxSize = box.siblings(itemClass).size();
				//if (boxSize<=0) {
					//msg.error('至少保留有一个房产.');
					//return ;
				//}else {
					box.slideUp('fase',function() {
						box.remove();
					});
				//}
			})

		},
		add:function(box,data,removeEmpty) {
			box = $(box);
			//移除空白的
			if (removeEmpty) {
				box.find('.list-group-item').each(function(i,ele) {
					var $ele = $(ele);
					if (!$ele.find('[name="Name"]').val()) {	//姓名没填就标识要删掉
						$ele.slideUp('fase',function() {
							$ele.remove();
						});
					}
				});
			}

			//移除id，不要复用id，后台的逻辑会串
			if (data && data.ID) {
				data.ID = undefined;
				delete data.ID;
			}

			var html = Tmpl.GuarantorItem({
					data:data,
					canEdit:true
				});

			html = $(html);
			if (data) {//导入的关键数据不可编辑
				//html.find('[name="Name"],[name="CardType"],[name="IdentityCode"]').attr('disabled','disabled');
			}
			html.hide();
			html.appendTo(box).slideDown('fast', function() {});

		},
		addHouse:function(box,data) {
			box = $(box);
			var html = Tmpl.GuarantorPropertyItem({
					data:[data],
					canEdit:true
				});
			html = $(html);
			html.hide();
			html.appendTo(box).slideDown('fast', function() {});
		}
	};

	return MOD;
});
/**
 * 申请额度表单视图
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define.pack("./setup",["jquery","risk/unit/route","risk/components/msg/index","risk/components/modal/index","risk/unit/ajax","./tmpl","./wizzard","./setup.customer","./setup.property","./setup.guarantor","./setup.project","./setup.approval","./setup.charge","./setup.followup","./setup.finance"],function(require, exports, module){

	var $ = require('jquery'),
		route = require('risk/unit/route'),
		msg = require('risk/components/msg/index'),
		Modal = require('risk/components/modal/index'),
		Ajax = require('risk/unit/ajax'),
		Tmpl = require('./tmpl'),
		Wizzard = require('./wizzard');

	var Customer = require('./setup.customer'),
		Property = require('./setup.property'),
		Guarantor = require('./setup.guarantor'),
		Project = require('./setup.project'),
		Approval = require('./setup.approval'),
		Charge = require('./setup.charge'),
		Followup = require('./setup.followup'),
		Finance = require('./setup.finance');

	var MOD = {
		/**
		 * @param opts {Object} 配置项：
			mode:模式，可选有add、edit、view
			head:标题文本
			data:表单数据
			showed: 默认显示的tab ID
		 */
		init:function(opts) {
			var mode = opts.mode,
				data = opts.data,
				head = opts.head;

			var that = this,
				canEdit = !! (~$.inArray(mode, ['add','edit']) || data&&data.Action==2);
			var html = Tmpl.Setup({
				customerTpl:Customer.getTpl,	//获取公共客户模板的函数
				data:data,
				mode:mode,
				canEdit:canEdit
			});
			route.show({
				head:head,
				content:html
			});

			Wizzard.init({
				container:'#J_Wizzard',
				success:function() {
					that.submit(mode);
				},
				showed:opts.showed
			});

			this._initEvent();

			/*
			<button class="btn btn btn-danger" id="TEST" style="position:absolute;top:-80px;right:80px;">直接提交测试数据</button>
			$('#TEST').click(function(ev) {
				ev.preventDefault();
				var data = require('./test-data');
				MOD.submit(mode,data);
			});
			*/
		},
		_initEvent:function() {
			Customer.init();
			Property.init();
			Guarantor.init();
			Project.init();
			Approval.init();
			Charge.init();
			Followup.init();
			Finance.init();

			route.on('click','cancel',function(ev) {//取消按钮
				ev.preventDefault();
				Modal.show({
					content:'您填写的表单将不会被保存，是否要取消？',
					okValue:'确认取消',
					ok:function() {
						route.reload();
					},
					cancelValue:'不取消'
				});
			});
		},
		//提交表单
		submit:function(mode,data) {
			if (!data) {
				var dataCustomer = Customer.getData();
				data = {
					Buyers:dataCustomer.buyer,
					Sellers:dataCustomer.seller,
					ThirdParty:dataCustomer.thirdparty,
					Assets:Property.getData(),
					Project:Project.getData(),
					Guarantor:Guarantor.getData(),
					Report:$('#Report textarea[name=Report]').val()
				};
			}

			//console.log('submit::',data);
			//return ;

			Ajax.post({
				url:'RiskMgr.Api.ProjectApi/Add',
				data:data,
				success:function(data, textStatus, jqXHR) {
					msg.success('申请成功');

					route.load('page=trade/apply&action=view&ID='+data);
				}
			});
		}
	};

	return MOD;
});/**
 * 项目信息
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 14:54:00
 */

define.pack("./setup.project",["risk/unit/serialize","risk/components/former/index"],function(require, exports, module){
	require.get = require;

	var Serialize = require('risk/unit/serialize'),
		former = require('risk/components/former/index');


	var MOD = {
		getData:function() {
			var data = Serialize($('#Project'))

			return data;
		},
		init:function() {
			//红本的时候隐藏部分资料
			var box = $('#Project'),
				redElem = box.find('select[name="HouseRedState"]'),
				ransomBox = redElem.parents('.form-horizontal:first');

			redElem.bind('change',function(ev) {
				var elem = $(ev.currentTarget),
					val = elem.val(),
					isRed = !!(val==1);

				var showed = ['HouseRedState','AssetRansomCustomerManager','AssetRansomContactPhone'];

				ransomBox.find('[name]').each(function(i,ele) {
					var $ele = $(ele),
						name = $ele.attr('name'),
						parentBox = $ele.parents('div.form-group:first'),
						inRedList = !!(showed.indexOf(name)!=-1);

					if (isRed) {
						if (!inRedList) {
							parentBox.hide();
						}
					}else {
						parentBox.show();
					}
				});
			});
		}
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
						data.ID = '';
						delete data.ID;	//移除id，后台要根据姓名、身份证号来更新已存在客户信息
						MOD.add(box,data,true);
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
			/*//先禁用，现在匹配到后会禁止修改，体验上不好，待优化
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
			*/
		},
		add:function(box,data,removeEmpty) {
			box = $(box);
			//移除空白的
			if (removeEmpty) {
				box.find('.list-group-item').each(function(i,ele) {
					var $ele = $(ele);
					if (!$ele.find('[name="Code"]').val() && !$ele.find('[name="Address"]').val()) {	//没填就标识要删掉
						$ele.slideUp('fase',function() {
							$ele.remove();
						});
					}
				});
			}

			var html = Tmpl.PropertyItem({
					type:$('input[name="Type"]').val()*1,
					property:data,
					canEdit:true
				});

			html = $(html);
			if (data) {//导入的关键数据不可编辑
				//html.find('[name="Code"]').attr('disabled','disabled');
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
        "Name": "灌灌灌灌",
        "CardType": "1",
        "IdentityCode": "234234234234",
        "Phone": "34234234",
        "Gender": "1",
        "Marrage": "1",
        "Address": "然后统一集团研究与",
        "OrignalName": "old name",
        "OrignalIdentityCode": "111",
        "BankCode": "22222",
        "BankType": "1",
        "WorkUnit": ""
    },
    {
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
    "Assets": [{
        "ID": "",
        "Code": "23432",
        "Usage": "2",
        "Position": "2",
        "Address": "234234",
        "Area": "12312",
        "RegPrice": "21323",
        "Remark": "sdfgsdfg",
        "Joint": [{
            "JointType": "2",
            "Name": "123123",
            "Phone": "14124",
            "IdentityCode": "324234234"
        },
        {
            "JointType": "3",
            "Name": "4534534",
            "Phone": "5435",
            "IdentityCode": "36436"
        }]
    },
    {
        "ID": "",
        "Code": "dfg",
        "Usage": "1",
        "Position": "1",
        "Address": "234234",
        "Area": "32434",
        "RegPrice": "3434",
        "Remark": "dgdfgdfg",
        "Joint": [{
            "JointType": "3",
            "Name": "4234",
            "Phone": "2342",
            "IdentityCode": "34234234"
        }]
    }],
    "Project": {
        "Source": "1",
        "AgentName": "24234",
        "CertificateData": "2015-11-02",
        "AgentContact": "fghdfg",
        "Rebater": "dfhf",
        "RebateAccount": "g546456",
        "OtherRebateInfo": "sdfgsdfg",
        "OrignalMortgageBank": "3",
        "OrignalMortgageBranch": "sad",
        "OrignalFundCenter": "1",
        "OrignalFundBranch": "234234234",
        "SupplyCardCopy": "a1214234",
        "SupplyCardCopy2": "22352",
        "OrignalCreditPI": "532323",
        "OrignalCreditCommerceMoney": "12222",
        "OrignalCreditFundMoney": "3444",
        "AssetRansomCustomerManager": "234234243",
        "AssetRansomContactPhone": "234234234",
        "NewCreditBank": "15",
        "NewCreditBranch": "234234",
        "GuaranteeMoney": "232323",
        "GuaranteeMonth": "2323",
        "BuyerCreditCommerceMoney": "2223",
        "BuyerCreditFundMoney": "44",
        "DealMoney": "6564",
        "EarnestMoney": "7878",
        "SupervisionMoney": "234",
        "SupervisionBank": "14",
        "CustomerPredepositMoney": "6656",
        "CreditReceiverName": "dfgsdfg",
        "CreditReceiverBank": "14",
        "CreditReceiverAccount": "123123",
        "AssetRansomPredictMoney": "34234",
        "AssetRansomer": "sdfsd",
        "AssetRansomType": "1",
        "PredictDays": "434234",
        "ChargeType": "1"
    },
    "Guarantor": [{
        "Name": "sdfsdfg",
        "CardType": "2",
        "IdentityCode": "324234",
        "Phone": "234234",
        "Gender": "2",
        "Marrage": "1",
        "Address": "234234",
        "GuarantorRemark": "234234",
        "Assets": [{
            "Code": "235423",
            "Usage": "1",
            "Position": "3",
            "Address": "4535",
            "Area": "435345",
            "RegPrice": "343434"
        },
        {
            "Code": "435345",
            "Usage": "2",
            "Position": "2",
            "Address": "435435",
            "Area": "43",
            "RegPrice": "543543"
        }]
    },
    {
        "Name": "345345",
        "CardType": "2",
        "IdentityCode": "34534",
        "Phone": "234234",
        "Gender": "1",
        "Marrage": "1",
        "Address": "234234",
        "GuarantorRemark": "2342345555",
        "Assets": [{
            "Code": "554543",
            "Usage": "1",
            "Position": "3",
            "Address": "gfhdh",
            "Area": "545",
            "RegPrice": "545"
        }]
    }]
};
return rs;
});/**
 * 项目信息form表单：收费情况
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define.pack("./tpl.charge",[],function(require, exports, module){
	var MOD = [
		[{
			type:'hidden',
			name:'ID'
		},{
			type:'label',
			col:3,
			html:'收取担保费'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'InsuranceFee',
			placeholder:'',
			suffix:'元'
		},{
			type:'label',
			col:3,
			html:'担保费时间'
		},{
			col:'3',
			type:'date',
			required:true,
			name:'InsuranceTime',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'放款金额'
		},{
			col:'3',
			type:'decimal',
			required:true,
			name:'ExportMoney',
			placeholder:'',
			suffix:'元'
		},{
			type:'label',
			col:3,
			html:'放款时间'
		},{
			col:'3',
			type:'date',
			required:true,
			name:'ExportTime',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'担保期限'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'GuaranteePeriod',
			placeholder:'',
			suffix:'天'
		},{
			type:'label',
			col:3,
			html:'回款时间'
		},{
			col:'3',
			type:'date',
			required:true,
			name:'PaymentDate',
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
			html:'实际出款金额'
		},{
			col:'3',
			type:'number',
			name:'PaymentMoney',
			placeholder:'',
			suffix:'元'
		}],

		[{
			type:'label',
			col:3,
			html:'出款账户'
		},{
			col:'3',
			type:'text',
			name:'PaymentName',
			placeholder:'户名'
		},{
			col:'3',
			type:'text',
			name:'PaymentAccount',
			placeholder:'账号'
		},{
			col:'3',
			type:'text',
			name:'PaymentBankName',
			placeholder:'开户行'
		}],

		[{
			col:'12',
			type:'label',
			html:'<hr/>'
		}],

		[{
			type:'label',
			col:3,
			html:'备注'
		},{
			col:'9',
			type:'textarea',
			name:'ChargeFinanceRemark',
			placeholder:''
		}]
	];

	return MOD;
});/**
 * 回款确认表单
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define.pack("./tpl.finance",[],function(require, exports, module){
	var MOD = [
		[{
			type:'group',
			name:'ReturnBackMoneyInfo',
			addText:'回款信息',
			groups:[
				[{
					type:'label',
					col:3,
					required:true,
					html:'回款金额'
				},{
					col:'3',
					type:'number',
					required:true,
					name:'ReturnBackMoney',
					placeholder:'',
					suffix:'元'
				},{
					type:'label',
					col:3,
					required:true,
					html:'回款时间'
				},{
					col:'3',
					type:'date',
					required:true,
					name:'ReturnBackTime',
					placeholder:''
				}]
			]
		}],
		/*
		[{
			type:'label',
			col:3,
			required:true,
			html:'回款金额'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'ReturnBackMoney',
			placeholder:'',
			suffix:'元'
		},{
			type:'label',
			col:3,
			required:true,
			html:'回款时间'
		},{
			col:'3',
			type:'date',
			required:true,
			name:'ReturnBackTime',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'回款金额2'
		},{
			col:'3',
			type:'number',
			name:'ReturnBackMoney2',
			placeholder:'',
			suffix:'元'
		},{
			type:'label',
			col:3,
			html:'回款时间2'
		},{
			col:'3',
			type:'date',
			name:'ReturnBackTime2',
			placeholder:''
		}],
		*/

		[{
			col:'12',
			type:'html',
			html:'<hr/>'
		}],

		[{
			type:'label',
			col:3,
			html:'展期费用'
		},{
			col:'3',
			type:'number',
			name:'RollFee',
			placeholder:'',
			suffix:'元'
		}],

		[{
			type:'label',
			col:3,
			html:'展期备注'
		},{
			col:'9',
			type:'text',
			name:'RollRemark',
			placeholder:''
		}],

		[{
			type:'label',
			col:3,
			html:'滞纳金'
		},{
			col:'3',
			type:'number',
			name:'DelayFee',
			placeholder:'',
			suffix:'元'
		}],

		[{
			type:'label',
			col:3,
			html:'滞纳金时间'
		},{
			col:'3',
			type:'date',
			name:'DelayTime',
			placeholder:'',
			prefix:'开始'
		},{
			col:'3',
			type:'date',
			name:'DelayTimeEnd',
			placeholder:'',
			prefix:'结束'
		}],

		[{
			col:'12',
			type:'label',
			html:'<hr/>'
		}],

		[{
			type:'label',
			col:3,
			html:'退款金额'
		},{
			col:'3',
			type:'number',
			name:'RefundMoney',
			placeholder:'',
			suffix:'元'
		},{
			type:'label',
			col:3,
			html:'退款日期'
		},{
			col:'3',
			type:'date',
			name:'RefundDate'
		}],

		[{
			type:'label',
			col:3,
			html:'退款信息'
		},{
			col:'3',
			type:'text',
			name:'RefundName',
			placeholder:'户名'
		},{
			col:'3',
			type:'text',
			name:'RefundAccount',
			placeholder:'账号'
		},{
			col:'3',
			type:'text',
			name:'RefundBankName',
			placeholder:'开户行'
		}],

		[{
			col:'12',
			type:'label',
			html:'<hr/>'
		}],

		[{
			type:'label',
			col:3,
			html:'备注'
		},{
			col:'9',
			type:'textarea',
			name:'ReturnBackRemark',
			placeholder:''
		}]
	];

	return MOD;
});/**
 * 项目信息form表单：收费情况
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define.pack("./tpl.followup",[],function(require, exports, module){

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
});/**
 * 项目信息form表单：基本信息
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-21 21:00:52
 */

define.pack("./tpl.project.base",[],function(require, exports, module){
	var MOD = [
		[{
			type:'hidden',
			name:'Type'
		},{
			type:'hidden',
			name:'ID'
		}],

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
			options:'项目来源'
		},{
			type:'label',
			col:3,
			html:'中介名称'
		},{
			col:"3",
			type:'text',
			name:'AgentName'
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
			type:'text',
			name:'NewCreditBank',
			required:true,
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
			col:'3',
			required:true,
			html:'贷款金额'
		},{
			col:'3',
			type:'decimal',
			required:true,
			name:'BuyerCreditCommerceMoney',
			placeholder:'',
			prefix:'商业',
			suffix:'万元'
		},{
			col:'3',
			type:'decimal',
			name:'BuyerCreditFundMoney',
			placeholder:'',
			prefix:'公积金',
			suffix:'万元'
		}],

		[{
			type:'label',
			col:3,
			required:true,
			html:'成交金额'
		},{
			col:"3",
			type:'decimal',
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
			type:'decimal',
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
			type:'decimal',
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
			html:'客户出资款'
		},{
			col:"3",
			type:'decimal',
			name:'CustomerPredepositMoney',
			suffix:'万元'
		},{
			type:'label',
			col:3,
			html:'垫资金额'
		},{
			col:"3",
			type:'decimal',
			name:'CompanyPredepositMoney',
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
			placeholder:'开户行',
			required:true
		},{
			col:"3",
			type:'text',
			name:'CreditReceiverAccount',
			placeholder:'账号',
			required:true
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
			html:'是否红本房产'
		},{
			col:"3",
			type:'select',
			name:'HouseRedState',
			options:[{
				value:'0',
				name:'否'
			},{
				value:'1',
				name:'是'
			}]
		}],
		[{
			type:'label',
			col:3,
			required:true,
			html:'原按揭银行'
		},{
			col:"3",
			type:'text',
			name:'OrignalMortgageBank',
			required:true
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
			html:'原贷款公积金中心'
		},{
			col:"3",
			type:'text',
			name:'OrignalFundCenter'
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
			col:'3',
			required:true,
			html:'赎楼金额'
		},{
			col:'3',
			type:'decimal',
			required:true,
			name:'AssetRansomMoney',
			placeholder:'',
			suffix:'万元'
		},{
			type:'label',
			col:'3',
			required:true,
			html:'用款期限'
		},{
			col:'3',
			type:'number',
			required:true,
			name:'GuaranteeMonth',
			placeholder:'',
			suffix:'天'
		}],

		[{
			type:'label',
			col:'3',
			required:true,
			html:'原贷款金额'
		},{
			col:'3',
			type:'decimal',
			required:true,
			name:'OrignalCreditCommerceMoney',
			placeholder:'',
			prefix:'商业',
			suffix:'万元'
		},{
			col:'3',
			type:'decimal',
			name:'OrignalCreditFundMoney',
			placeholder:'',
			prefix:'公积金',
			suffix:'万元'
		}],

		[{
			type:'label',
			col:3,
			html:'赎楼银行客户经理'
		},{
			col:"3",
			type:'text',
			name:'AssetRansomCustomerManager',
		},{
			type:'label',
			col:3,
			html:'联系电话'
		},{
			col:"3",
			type:'tel',
			name:'AssetRansomContactPhone',
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
			html:'赎楼方式'
		},{
			col:"3",
			type:'select',
			name:'AssetRansomType',
			required:true,
			options:'赎楼方式'
		}],

		[{
			type:'label',
			col:3,
			html:'预存时间'
		},{
			col:"3",
			type:'number',
			name:'PredictDays',
			suffix:'天'
		},{
			type:'label',
			col:3,
			html:'收费方式'
		},{
			col:"3",
			type:'select',
			name:'ChargeType',
			options:'收费方式'
		}]
	];

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
				,btnNext:'.wizard-next'	//下一步按钮的选择器，如果没有下一步tab了，则会执行submit
				,btnSubmit:'.wizard-submit'	//提交按钮
				,btnPrev:'.wizard-previous'	//上一步按钮的选择器
				,validate:true	//进入下一步时，是否要校验表单
				//,success:function() {}	//最后一步完成时执行
				//,showed:''	//默认显示的tab ID
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

			//显示默认tab
			var showID = conf.showed;
			if (showID) {
				this._show(showID);
			}

			return this;
		},
		//提交表单
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
				btnPrev = conf.btnPrev,
				btnSubmit = conf.btnSubmit;

			this.container.on('click',btnNext,function(ev) {
				ev.preventDefault();
				var btn = $(ev.currentTarget);
				that._showByButton(btn,'next');
			}).on('click',btnPrev,function(ev) {
				ev.preventDefault();
				var btn = $(ev.currentTarget);
				that._showByButton(btn,'prev');
			}).on('click',btnSubmit,function(ev) {
				ev.preventDefault();
				var btn = $(ev.currentTarget);
				that._success();
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
//apply/src/setup.approval.tmpl.html
//apply/src/setup.charge.tmpl.html
//apply/src/setup.customer.tmpl.html
//apply/src/setup.finance.tmpl.html
//apply/src/setup.followup.tmpl.html
//apply/src/setup.guarantor.tmpl.html
//apply/src/setup.project.tmpl.html
//apply/src/setup.property.tmpl.html
//apply/src/setup.report.tmpl.html
//apply/src/setup.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'choose': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var Configs = require('risk/page/trade/config'),
		List = Configs.type.data,
		Colors = ['primary','success','info','warning','danger'];
__p.push('<div class="block-flat">\n	<h3 class="hthin">请选择业务类型</h3>\n	<div class="body-handle">');

		for(var key in List) {
			if(List.hasOwnProperty(key)) {
		__p.push('			<button type="button" data-hook="choose-type" data-type="');
_p(key);
__p.push('" class="btn btn-');
_p(Colors.shift()||'default');
__p.push(' btn-lg">');
_p(List[key]);
__p.push('</button>');

			}
		}
		__p.push('	</div>\n</div>');

return __p.join("");
},

'SetupApproval': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var RString = require('risk/unit/string');
	var DataView = data.data || {},
		Approvals = DataView.Approvals || {},	//审批信息
		CurrentActivity = DataView.CurrentActivity || [];
__p.push('\n<div class="step-pane" id="Approval">');

	if (DataView.Action==3 && CurrentActivity.ActivityDefinitionID<5) {	//action==3代表是可以审批
	 __p.push('		<div class="block-transparent trade-approval-box">\n			<div class="header">\n				<h3>审批意见</h3>\n			</div>\n			<div class="content" style="margin:0 auto;max-width:500px;width:100%;">\n				<div class="form-group">\n					<label class="col-sm-12">');
_p(CurrentActivity.Name);
__p.push('</label>\n					<div class="col-sm-12">\n						<textarea class="form-control" name="Remark" rows="5"></textarea>\n					</div>\n				</div>\n				<div class="form-group">\n					<div class="text-center col-sm-12">\n						<button class="btn btn-danger" type="button" data-hook="approval-fail"><i class="fa fa-remove"></i> 不通过</button>\n						&nbsp;&nbsp;\n						<button class="btn btn btn-success" type="button" data-hook="approval-pass"><i class="fa fa-check"></i> 批准</button>\n					</div>\n				</div>\n			</div>\n		</div>');
}if (Approvals.length>0) {__p.push('		<div class="block-transparent trade-approval-box">\n			<div class="content">\n				<ul class="list-group tickets">');

					var i=0,cur;
					for(;cur=Approvals[i++];) {
				__p.push('					<li class="list-group-item" href="#">\n						<h4 class="name">');
_p(cur.ActivityName);
__p.push(' <small class="label ');
_p(cur.Status==1?'label-success':'label-danger');
__p.push('">');
_p(cur.Status==1?'通过':'不通过');
__p.push('</small></h4>\n						<p><strong>[');
_p(cur.Processor);
__p.push(']</strong>：');
_p(cur.Remark);
__p.push('</p>\n						<span class="date">');
_p(RString.date(cur.LastUpdateTime,"yyyy-MM-dd HH:mm:ss"));
__p.push('</span>\n					</li>');
}__p.push('				</ul>\n			</div>\n		</div>');
}__p.push('\n</div>');

return __p.join("");
},

'SetupCharge': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var DataView = data.data || {},
		ChargeData = DataView.Project,	//财务信息
		ChargeCanEdit = DataView.ChargeCanEdit || (DataView.DisplayCharge && DataView.Action==2);

	var Former = require('risk/components/former/index'),
		TplCharge = require('./tpl.charge');
__p.push('<div class="step-pane" id="Charge">\n		<div class="block-transparent">\n			<div class="header">\n				<h3>收费情况</h3>\n			</div>\n			<div class="content">');
_p(Former.make(TplCharge,{data:ChargeData,disabled:!ChargeCanEdit}));
__p.push('			</div>\n		</div>');
if (ChargeCanEdit) {__p.push('		<div class="form-group">\n			<div class="text-center col-sm-12">\n				<button class="btn btn btn-success" type="button" data-hook="charge-submit"><i class="fa fa-check"></i> 提交</button>\n			</div>\n		</div>');
}__p.push('</div>');

return __p.join("");
},

'SetupCustomer': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('	');

		var FormData = data.data || {},
			TradeType = FormData.Type;
		var showSeller = false,	//显示卖家
			showThirdparty = false,	//显示第三方借贷人
			BuyerText = '客户';

		switch (TradeType){
			case 1: //二手楼交易
				BuyerText = '买家';
				showSeller = true;
				showThirdparty = true;
				break;
			case 2: //首期款垫付
				BuyerText = '买家';
				showSeller = true;
				break;
			case 3: //同名转按
				BuyerText = '产权人';
				showThirdparty = true;
				break;
			case 4: //贷前垫资
				BuyerText = '客户';
				break;
		}
	__p.push('	<div class="step-pane" id="Customer">\n		<div class="block-transparent">\n			<div class="header">\n				<h3>');
_p(BuyerText);
__p.push(' ');
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
if (data.canEdit) {__p.push('					<button type="button" class="btn btn-success" data-hook="customer-add">&nbsp;&nbsp;<i class="fa fa-plus"></i> 增加');
_p(BuyerText);
__p.push('&nbsp;&nbsp;</button>');
}__p.push('			</div>\n		</div>');

		if (showSeller) {
		__p.push('		<div class="block-transparent">\n			<div class="header">\n				<h3>卖家 ');
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
}__p.push('			</div>\n		</div>');
}
		if (showThirdparty) {
		__p.push('		<div class="block-transparent">\n			<div class="header">\n				<h3>第三方借贷人 ');
if (data.canEdit) {__p.push('<button type="button" class="btn btn-default" data-hook="customer-import"><i class="fa fa-sign-in"></i> 导入现有客户</button>');
}__p.push('</h3>\n			</div>\n			<div class="content">\n				<div class="list-group tickets" id="ThirdpartyList">');

						var Thirdparty = FormData.ThirdParty||[];
						var i=0, l = Thirdparty.length||0;

						if (l<=0 && !data.canEdit) {
					__p.push('						<div class="alert alert-info">\n							无第三方借贷人信息\n						</div>');


						}
					__p.push('					');

						for(; i < l; ++i) {
					__p.push('						');
_p(this.CustomerItem({
							data:Thirdparty[i],
							tpl:data.customerTpl,
							canEdit:data.canEdit
						}));
__p.push('					');

						}
					__p.push('				</div>');
if (data.canEdit) {__p.push('				<button type="button" class="btn btn-success" data-hook="customer-add">&nbsp;&nbsp;<i class="fa fa-plus"></i> 增加第三方借贷人&nbsp;&nbsp;</button>');
}__p.push('			</div>\n		</div>');
}if (data.canEdit) {__p.push('		<div class="form-group">\n			<div class="text-center col-sm-12">\n				<button class="btn btn-default wizard-cancel" data-hook="cancel">取消</button>\n				&nbsp;&nbsp;\n				<button class="btn btn-primary wizard-next">下一步 <i class="fa fa-caret-right"></i></button>\n			</div>\n		</div>');
}__p.push('	</div>');

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

'SetupFinanceConfirm': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var Former = require('risk/components/former/index'),
		TplFinance = require('./tpl.finance');
	var FormData = data.data||{},
		FinanceData = FormData.Project;

	var ConfirmCanEdit = FormData.ConfirmCanEdit;
__p.push('<div class="step-pane" id="FinanceConfirm">\n	<div class="block-transparent">\n		<div class="header">\n			<h3>回款确认</h3>\n		</div>\n		<div class="content">');
_p(Former.make(TplFinance,{data:FinanceData,disabled:!ConfirmCanEdit}));
__p.push('		</div>\n	</div>');
if (ConfirmCanEdit) {__p.push('	<div class="form-group">\n		<div class="text-center col-sm-12">\n			<button type="button" class="btn btn-success btn-lg" data-hook="finance-save">保存</button>\n			&nbsp;\n			<button type="button" class="btn btn-primary btn-lg" data-hook="finance-submit">确认已回款</button>\n		</div>\n	</div>');
}__p.push('</div>');

return __p.join("");
},

'SetupFollowup': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var DataView = data.data || {},
		FollowupCanEdit = DataView.FollowupCanEdit || (DataView.DisplayTracking && DataView.Action==2),
		FollowupData = DataView.Project;	//保后跟踪

	var Former = require('risk/components/former/index'),
		TplFollowup = require('./tpl.followup');
__p.push('<div class="step-pane" id="Followup">\n	<div class="block-transparent">\n		<div class="header"><h3>保后跟踪</h3></div>\n		<div class="content">');
_p(Former.make(TplFollowup,{
			data:FollowupData,
			disabled:!FollowupCanEdit,
			groupCanAdd:FollowupCanEdit,
			tplFilter:function(tpl) {
				var rs = $.extend({},tpl);
					name = tpl.name || (tpl.type=='label' && tpl.html),
					type = DataView.Type*1;

				switch(type) {
					case 3: //同名转贷
						//同名转贷没有这些字段
						if ($.inArray(name, ['过户收文日期','ChangeOwnerProfileTime','过户办文编号','ChangeOwnerProfileCode','取新证日期','PickNewAssetCodeTime','新房产证号(不动产权号)','NewAssetCode','过户说明','ChangeOwnerRemark']) != -1) {
							rs = false;
						}
					break;
				}

				return rs;
			}
		}));
__p.push('		</div>\n	</div>');
if (FollowupCanEdit) {__p.push('	<div class="form-group">\n		<div class="text-center col-sm-12">\n			<button class="btn btn btn-success" type="button" data-hook="followup-submit"><i class="fa fa-check"></i> 提交</button>\n		</div>\n	</div>');
}__p.push('</div>');

return __p.join("");
},

'SetupGuarantor': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var FormData = data.data || {};
__p.push('<div class="step-pane" id="Guarantor">\n	<div class="block-transparent">\n		<div class="header">\n			<h3>担保人 ');
if (data.canEdit) {__p.push('<button type="button" class="btn btn-default" data-hook="guarantor-import"><i class="fa fa-sign-in"></i> 导入现有客户</button>');
}__p.push('</h3>\n		</div>\n		<div class="content">\n			<div class="list-group tickets" id="GuarantorBase">');
_p(this.GuarantorItemsBox(data));
__p.push('			</div>');
if (data.canEdit) {__p.push('			<button type="button" class="btn btn-success" data-hook="guarantor-add">&nbsp;&nbsp;<i class="fa fa-plus"></i> 增加担保人&nbsp;&nbsp;</button>');
}__p.push('		</div>\n	</div>');
if (data.canEdit) {__p.push('	<div class="form-group">\n		<div class="text-center col-sm-12">\n			<button class="btn btn-default wizard-previous"><i class="fa fa-caret-left"></i> 上一步</button>\n			&nbsp;&nbsp;\n			<button class="btn btn-primary wizard-next">下一步 <i class="fa fa-caret-right"></i></button>\n		</div>\n	</div>');
}__p.push('</div>');

return __p.join("");
},

'GuarantorItemsBox': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var FormData = data.data || {},
		Guarantors = FormData.Guarantor,
		CanEdit = data.canEdit;

if (Guarantors&&Guarantors.length>0) {
	var i=0,cur;
	for(;cur=Guarantors[i++];) {
__p.push('	');
_p(this.GuarantorItem({
		canEdit:data.canEdit,
		data:cur
	}));

	}
}else if(!CanEdit) {
__p.push('	<div class="alert alert-info">\n		无担保人信息\n	</div>');

}
__p.push('');

return __p.join("");
},

'GuarantorItem': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var Former = require('risk/components/former/index'),
		TplCustomer = require('risk/page/customer/tpl.view');
	var CanEdit = data.canEdit,
		GuarantorData = data&&data.data;
__p.push('\n	<div class="list-group-item">\n		<div class="j-guarantor-form">');
_p(Former.make(TplCustomer,{
				data:GuarantorData,
				disabled:!CanEdit,
				onlyRequired:true
			}));
/**手动增加一个备注表单**/__p.push('			');
_p(Former.make([[{
				type:'label',
				col:2,
				html:'备注'
			},{
				col:'10',
				type:'textarea',
				name:'Remark',
				placeholder:''
			}]],{
				data:GuarantorData,
				disabled:!CanEdit
			}));
__p.push('\n		</div>\n		<hr style="border-bottom:1px dashed #dadada"/>\n		<div class="col-sm-offset-2 j-guarantor-house">');
_p(this.GuarantorPropertyItem({
				canEdit:CanEdit,
				data:(GuarantorData&&GuarantorData.Assets)
			}));
__p.push('\n		</div>');
if (data.canEdit) {__p.push('		<div class="col-sm-offset-2">\n			<button class="btn btn-default" data-hook="guarantor-addhouse"><i class="fa fa-plus"></i>增加房产</button>\n			<button type="button" class="btn btn-default" data-hook="guarantor-import-house"><i class="fa fa-sign-in"></i> 导入现有房产</button>\n		</div>');
}if (data.canEdit) {__p.push('		<hr style="border-bottom:1px dashed #dadada"/>\n		<div class="col-sm-offset-1">\n			<button type="button" class="btn btn-danger" data-hook="guarantor-remove">移除该担保人</button>\n		</div>');
}__p.push('	</div>');

return __p.join("");
},

'GuarantorPropertyItem': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var Former = require('risk/components/former/index'),
		TplProperty = require('risk/page/Property/tpl.view');
	var CanEdit = data.canEdit,
		PropertyList = data&&data.data || (CanEdit?[1]:[]);//可编辑状态，默认空白一个item

	var i=0,cur;
	for(;cur=PropertyList[i++];) {
__p.push('	<div class="well well-sm j-houseitem">');
_p(Former.make(TplProperty,{
			data:cur,
			disabled:!CanEdit,
			onlyRequired:true
		}));
__p.push('		');
if (CanEdit) {__p.push('		<div class="col-sm-offset-1">\n			<button type="button" class="btn btn-danger btn-xs" data-hook="guarantor-removehouse">移除该房产</button>\n		</div>');
}__p.push('	</div>');

	}
__p.push('');

return __p.join("");
},

'SetupProject': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var Former = require('risk/components/former/index'),
		FormData = data.data||{},
		FormType = FormData.Type*1,
		CanEdit = data.canEdit;
__p.push('<div class="step-pane" id="Project">\n	<div class="block-transparent">\n		<div class="header">\n			<h3>项目信息</h3>\n		</div>\n		<div class="content">\n			<div class="well">\n				<div class="header">\n				<h4>基本情况</h4>\n				</div>');
_p(Former.make(require('./tpl.project.base'),{
					data:FormData.Project,
					disabled:!CanEdit
				}));
__p.push('			</div>\n			<div class="well">\n				<div class="header">\n				<h4>赎楼行</h4>\n				</div>');
_p(Former.make(require('./tpl.project.ransombank'),{
					data:FormData.Project,
					disabled:!CanEdit,
					tplFilter:function(tpl) {
						var rs = $.extend({},tpl);
							name = tpl.name || (tpl.type=='label' && tpl.html),
							type = FormData.Type*1;

						switch(type) {
							case 2: //首期款垫付
								//首期款垫付没有这些字段
								if ($.inArray(name, ['赎楼金额','AssetRansomMoney']) != -1) {
									rs = false;
								}
								break;
							case 4: //贷前垫资,全部都非必填
								rs.required = false;
								break;
						}

						return rs;
					}
				}));
__p.push('			</div>\n			<div class="well">\n				<div class="header">\n				<h4>新贷款资料</h4>\n				</div>');
_p(Former.make(require('./tpl.project.newloan'),{
					data:FormData.Project,
					disabled:!CanEdit,
					tplFilter:function(tpl) {
						var rs = $.extend({},tpl);
							name = tpl.name || (tpl.type=='label' && tpl.html),
							type = FormData.Type*1;

							switch(type) {
								case 3: //同名转按
									//隐藏这些
									if ($.inArray(name, ['成交金额','DealMoney','交易定金','EarnestMoney','资金监管','SupervisionMoney','资金监管银行','SupervisionBank']) != -1) {
										rs = false;
									}
									break;
								case 4: //贷前垫资
									//非必填
									if ($.inArray(name, ['贷款金额','BuyerCreditCommerceMoney','BuyerCreditFundMoney','成交金额','DealMoney','交易定金','EarnestMoney','资金监管','SupervisionMoney','资金监管银行','SupervisionBank']) != -1) {
										rs.required = false;
									}
									break;
							}

						//只有贷前垫资才显示“垫资金额”
						if (type!=4 && !!~$.inArray(name,['垫资金额','CompanyPredepositMoney'])) {
							rs = false;
						}

						return rs;
					}
				}));
__p.push('			</div>');

			if (FormType!=2) {	//首期款垫付没有赎楼方式
			__p.push('			<div class="well">\n				<div class="header">\n				<h4>赎楼方式</h4>\n				</div>');
_p(Former.make(require('./tpl.project.ransomway'),{
					data:FormData.Project,
					disabled:!CanEdit
				}));
__p.push('			</div>');
}__p.push('		</div>\n	</div>');
if (data.canEdit) {__p.push('	<div class="form-group">\n		<div class="text-center col-sm-12">\n			<button class="btn btn-default wizard-previous"><i class="fa fa-caret-left"></i> 上一步</button>\n			&nbsp;&nbsp;\n			<button class="btn btn-primary wizard-next">下一步 <i class="fa fa-caret-right"></i></button>\n		</div>\n	</div>');
}__p.push('</div>');

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
						type:FormData.Type,
						property:Property[i],
						canEdit:data.canEdit
					}));
__p.push('				');

					}
				__p.push('			</div>');
if (data.canEdit) {__p.push('			<button type="button" class="btn btn-success" data-hook="property-add">&nbsp;&nbsp;<i class="fa fa-plus"></i> 增加房产&nbsp;&nbsp;</button>');
}__p.push('		</div>\n	</div>');
if (data.canEdit) {__p.push('	<div class="form-group">\n		<div class="text-center col-sm-12">\n			<button class="btn btn-default wizard-previous"><i class="fa fa-caret-left"></i> 上一步</button>\n			&nbsp;&nbsp;\n			<button class="btn btn-primary wizard-next">下一步 <i class="fa fa-caret-right"></i></button>\n		</div>\n	</div>');
}__p.push('</div>');

return __p.join("");
},

'PropertyItem': function(data){

var __p=[],_p=function(s){__p.push(s)};

	//这个模板在setup.property.js里面也有用到，不好直接传FormData，改的时候注意
	var Former = require('risk/components/former/index');

	var PropertyData = data.property,
		FormType = data.type*1;
__p.push('	<div class="list-group-item">\n		<div class="j-property-form">');
_p(Former.make(require('risk/page/Property/tpl.view'),{
				data:PropertyData,
				disabled:!data.canEdit,
				tplFilter:function(tpl) {
					var rs = $.extend({},tpl);
						name = tpl.name || (tpl.type=='label' && tpl.html),
						type = FormType;

					//贷前垫资/首期款垫资，有一手楼，没有房产证号等信息（房产地址必须填）
					switch(type) {
						case 2: //首期款垫付
						case 4: //贷前垫资
							if ($.inArray(name, ['Address','房产地址','Position']) == -1) {
								rs.required = false;
							}
							break;
					}
					//console.log('tplFilter:::',name,type,rs);

					return rs;
				}
			}));
/**手动增加一个备注表单**/__p.push('			');
_p(Former.make([[{
				type:'label',
				col:2,
				html:'备注'
			},{
				col:'10',
				type:'textarea',
				name:'Remark',
				placeholder:''
			}]],{
				data:PropertyData,
				disabled:!data.canEdit
			}));
__p.push('\n		</div>\n		<div class="form-group">');

				var Joint = PropertyData&&PropertyData.Joint || [],
					JointLen = Joint.length;
			__p.push('			<div class="col-sm-2">&nbsp;</div>\n			<div class="col-sm-10">');
if (data.canEdit) {__p.push('<button type="button" data-hook="joint-add" class="btn btn-default btn-xs"><i class="fa fa-plus"></i> 增加共权人</button>');
}__p.push('				&nbsp;&nbsp;');
_p((JointLen||data.canEdit)?'(房产共权人、保证人、配偶、辅助联系人、第三方借款人)':'');
__p.push('			</div>\n			<div class="col-sm-2">&nbsp;</div>\n			<div class="col-sm-10">\n				<table class="no-border no-strip j-property-joint" style="background-color:#E8E8E8;margin-top:10px; ');
_p(JointLen?'':'display:none;');
__p.push('">\n					<thead class="no-border">\n						<tr>\n							<th>&nbsp;</th>\n							<th>类型</th>\n							<th>姓名</th>\n							<th>电话</th>\n							<th>证件号</th>\n						</tr>\n					</thead>\n					<tbody class="no-border-x no-border-y">');

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
		var CreateOptions = function(opts) {
				var dataName = opts.options,
					value = opts.value;

				var rs = [],
					dictionary = require('risk/data-dictionary'),
					da = (dictionary[dataName] || []).concat([]);//concat防止原始数据被修改

				da.unshift({
					name:(opts.required?'* ':'')+(opts.remark||'请选择'),
					value:''
				});

				var i=0,cur;
				for(;cur=da[i++];) {
					rs.push('<option value="'+cur.value+'" '+((cur.value==value)?'selected':'')+'>'+cur.name+'</option>');
				}
				rs = rs.join('');
				return rs;
			};
	__p.push('	<tr>\n		<td>');
if (data.canEdit) {__p.push('<i class="pointer-item fa fa-times" data-hook="joint-remove"></i>');
}__p.push('</td>\n		<td>\n			<select name="JointType" ');
_p(data.canEdit?'':'disabled');
__p.push('>');
_p(CreateOptions({
					options:'共权人类型',
					value:FormData.JointType,
					remark:'请选择类型'
				}));
__p.push('			</select>\n		</td>\n		<td><input type="text" name="Name" value="');
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
__p.push(' /></td>\n	</tr>');

return __p.join("");
},

'SetupReport': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var Former = require('risk/components/former/index');
	var FormData = data.data||{};
__p.push('<div class="step-pane" id="Report">\n	<div class="block-transparent">\n		<div class="header">\n			<h3>调查报告</h3>\n		</div>\n		<div class="content">');
/**手动增加一个textarea表单**/__p.push('			');
_p(Former.make([[{
				col:'10',
				type:'textarea',
				name:'Report',
				placeholder:'',
				required:true,
				rows:5
			}]],{
				data:data.data,
				disabled:!data.canEdit
			}));
__p.push('		</div>\n	</div>');
if (data.canEdit) {__p.push('	<div class="form-group">\n		<div class="text-center col-sm-12">\n			<button class="btn btn-default wizard-previous"><i class="fa fa-caret-left"></i> 上一步</button>\n			&nbsp;&nbsp;\n			<button class="btn btn-success wizard-submit">提交 <i class="fa fa-caret-right"></i></button>\n		</div>\n	</div>');
}__p.push('</div>');

return __p.join("");
},

'Setup': function(data){

var __p=[],_p=function(s){__p.push(s)};

	//测试数据
	if (location.href.indexOf('testdata')!=-1) {
		data.mode = data.mode || 'view';
		data.data = data.data || {};
		if (data.data) {
		data.data["Approvals"]  = {
				"CurrentWorkflow":{
					"handler":"李振文"
				}
				,"Done":[{
					"title":"之前的审批123",
					"key":"ApprovalTest123",
					"content":"我同意啊哈哈",
					"handler":"李振文",
					"time":1443670754853
				}]
				,"CurrentApproval":[{
					"title":"审批标题啊",
					"key":"ApprovalTest222"
				},{
					"title":"可以多个审批标题不",
					"key":"ApprovalTest333"
				}]
			};

			data.data["DisplayCharge"]  = true;
			data.data["Charge"]  = {"key":"value"};

			data.data["DisplayTracking"]  = true;
			data.data["Followup"]  = {"key":"value"};
			data.data['FollowupCanEdit'] = true;

			data.data["ChargeCanEdit"] = true;

			data.data["DisplayConfirm"]  = true;
			data.data["ConfirmCanEdit"]  = true;
		}
	}

	var RString = require('risk/unit/string');
	var DataView = data.data || {},
		Approvals = DataView.Approvals || {},	//审批信息
		Charge = DataView.Charge,	//财务信息
		Followup = DataView.Followup,	//保后跟踪
		CurrentActivity = DataView.CurrentActivity || [];

	//把业务类型放到一级，方便判断
	DataView.Type = DataView.Type || DataView.Project&&DataView.Project.Type || 1;

	var ShowApproval = !!(data.mode!=='add' && data.mode!=='edit'),	//审批
		ShowCharge = ShowApproval && DataView.DisplayCharge,	//收费情况
		ShowFollow = ShowApproval && DataView.DisplayTracking,	//保后
		ShowFinanceConfirm = DataView.DisplayConfirm;	//显示回款确认
		//  !!(ShowCharge && ShowFollow && (DataView.ChargeCanEdit || (DataView.DisplayCharge && DataView.Action==2)) );	//回款确认，“收费情况+保后”可见，且有编辑收费情况的权限时，才显示
__p.push('\n<div class="col-md-12 trade-detail">');
if (ShowApproval) {__p.push('		');
if (DataView.WorkflowComplete) { __p.push('			<div class="alert alert-success" role="alert"><i class="fa fa-check-circle"></i> 已确认回款，流程已结束</div>');
}else {__p.push('			<div class="alert alert-info" role="alert">当前流程到了<strong>');
_p(CurrentActivity.Name);
__p.push('</strong>，审批人：<strong>');
_p(DataView.Operator||'?');
__p.push('</strong>，到达时间：<strong>');
_p(RString.date(CurrentActivity.LastUpdateTime,"yyyy-MM-dd HH:mm:ss"));
__p.push('</strong></div>');
}__p.push('	');
}__p.push('\n	<form class="form-horizontal block-wizard" id="J_Wizzard" action="#">\n		<ul class="wizard-steps">');
if (data.mode=='add') {__p.push('			<li data-hook="cancel" class="pointer-item">选择类型<span class="chevron"></span></li>');
}__p.push('			<li data-target="Customer" class="active">客户信息<span class="chevron"></span></li>\n			<li data-target="Assets">房产信息<span class="chevron"></span></li>\n			<li data-target="Guarantor">担保人<span class="chevron"></span></li>\n			<li data-target="Project">项目信息<span class="chevron"></span></li>\n			<li data-target="Report">调查报告<span class="chevron"></span></li>');
if (ShowApproval) {__p.push('				<li data-target="Approval">审批信息<span class="chevron"></span></li>');
}if (ShowCharge) {__p.push('			<li data-target="Charge">收费情况<span class="chevron"></span></li>');
}if (ShowFollow) {__p.push('			<li data-target="Followup">保后跟踪<span class="chevron"></span></li>');
}if (ShowFinanceConfirm) {__p.push('			<li data-target="FinanceConfirm">回款确认<span class="chevron"></span></li>');
}__p.push('\n		</ul>\n		<div class="step-content">');
_p(this.SetupCustomer(data));
__p.push('			');
_p(this.SetupProperty(data));
__p.push('			');
_p(this.SetupGuarantor(data));
__p.push('			');
_p(this.SetupProject(data));
__p.push('			');
_p(this.SetupReport(data));
if (ShowApproval) {__p.push('			');
_p(this.SetupApproval(data));
__p.push('			');
}if (ShowCharge) {__p.push('			');
_p(this.SetupCharge(data));
__p.push('			');
}if (ShowFollow) {__p.push('			');
_p(this.SetupFollowup(data));
__p.push('			');
}if (ShowFinanceConfirm) {__p.push('			');
_p(this.SetupFinanceConfirm(data));
__p.push('			');
}__p.push('		</div>\n	</form>\n</div>');

return __p.join("");
}
};
return tmpl;
});

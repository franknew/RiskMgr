
/**
 * 申请额度表单视图
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-07-15 21:41:52
 */

define(function(require, exports, module){

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
				}
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
					route.load('page=trade/list');
				}
			});
		}
	};

	return MOD;
});
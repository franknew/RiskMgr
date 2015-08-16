/**
 * 申请额度
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

	var Customer = require('./customer'),
		Property = require('./property'),
		Project = require('./project');

	var MOD = {
		initPage:function() {
			var html = Tmpl.choose();
			route.show({
				head:'申请额度',
				content:html
			});

			route.on('click','choose-type',function(ev) {
				var elem = $(ev.currentTarget),
					type = elem.data('type');
				MOD._setup(type);
			});
			this._setup(1);


			$('#TEST').click(function(ev) {
				ev.preventDefault();
				var data = require('./test-data');
				MOD.submit(data);
			});
		},
		/** 开始进入填单流程
		 * @param
		 */
		_setup:function(type) {
			var typeName = {
				'1':'二手楼买卖交易',
				'2':'首期款垫付',
				'3':'现金赎楼',
				'4':'红本抵押'
			}[type];

			var that = this;
			var html = Tmpl.Setup({
				customerTpl:Customer.getTpl(),
				propertyTpl:Property.getTpl(),
				projectTpl:Project.getTpl()
			});
			route.show({
				head:'申请额度 <small>'+typeName+'</small>',
				content:html
			});

			Wizzard.init({
				container:'#J_Wizzard',
				success:function() {
					that.submit();
				}
			});

			this._initEvent();
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
		submit:function(data_test) {
			var dataCustomer = Customer.getData();
			var data = {
				Buyers:dataCustomer.buyer,
				Sellers:dataCustomer.seller,
				Assets:Property.getData(),
				Project:Project.getData()
			};

			if (data_test) {//使用测试数据
				data = data_test;
			}

			Ajax.post({
				url:'RiskMgr.Api.ProjectApi/Add',
				data:data,
				success:function(data, textStatus, jqXHR) {
					msg.success('申请成功');
				}
			});
		}
	};

	return MOD;
});
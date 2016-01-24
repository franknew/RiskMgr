/**
 * 担保人信息
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 14:53:02
 */

define(function(require, exports, module){
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

				MOD.addHouse(box);
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

			var html = Tmpl.GuarantorItem({
					data:data,
					canEdit:true
				});

			html = $(html);
			if (data) {//导入的关键数据不可编辑
				html.find('[name="Name"],[name="CardType"],[name="IdentityCode"]').attr('disabled','disabled');
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
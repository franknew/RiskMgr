/**
 * 客户信息
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
});
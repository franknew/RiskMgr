/**
 * 房产
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-09 14:53:41
 */

define(function(require, exports, module){
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
		getTpl:function(data) {
			var tpl = former.make(PropertyTpl,{data:data});
			return tpl;
		},
		getData:function() {
			var list = $('#PropertyBase div.list-group-item'),
				data = [];

			list.each(function(i,ele) {
				data.push(Serialize(ele));
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
						console.log('succ',data);
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
				MOD.addJoint();
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
					propertyTpl:this.getTpl(data)
				});

			html = $(html);
			if (data) {//导入的关键数据不可编辑
				html.find('[name="Code"]').attr('disabled','disabled');
			}
			html.hide();
			html.appendTo(box).slideDown('fast', function() {

			});
		},
		addJoint:function() {
			var list = $('#J_PropertyJointBox'),
				html = Tmpl.PropertyJointItem();
			var item = $(html).appendTo(list.find('tbody:first'));

			list.show();
			item.find('input').eq(0).focus();
		}
	};

	return MOD;
});
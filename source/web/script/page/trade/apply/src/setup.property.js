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
});
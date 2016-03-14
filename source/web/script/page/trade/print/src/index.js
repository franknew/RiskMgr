/**
 * 打印交易申请单
 */

define(function(require, exports, module){
	require('risk/page/trade/print/print.css');
	var $ = require('jquery'),
		Str = require('risk/unit/string');

	var Tmpl = require('./tmpl'),
		Trade = require('risk/page/trade/apply/index');

	var MOD = {
		//默认查询入口
		initPage:function(params) {
			params = params || {};

			document.title = '审批表';

			var container = $('body');
			container.empty().html('<div class="loading">Loading...</div>');

			require.async('risk/page/trade/apply/data',function(Data) {
				Data.get().done(function(d) {
					var html = Tmpl.Printer(MOD.filterData(d));
					container.html(html);

					$('#TradePrinter').click(function(ev) {
						window.print();
					});
				});
			});

		},
		//格式化一下数据，方便填进打印表格
		filterData:function(data) {
			var rs = $.extend({},data);
			rs.BuyersList = this._joinString(data.Buyers,['IdentityCode','Name','Phone']);
			rs.SellersList = this._joinString(data.Sellers,['IdentityCode','Name','Phone']);
			rs.ThirdPartyList = this._joinString(data.ThirdParty,['IdentityCode','Name','Phone']);
			rs.AssetsList = this._joinString(data.Assets,['Address','Code']);

			rs.ApprovalsInfo = (function(da) {
				var rs = {};

				var i=0,cur;
				for(;cur=da[i++];) {
					//只记录一次，因为最新审批的在数组前面，所以直接判断“逻辑非”
					if (cur.ActivityName=='风控审批' && cur.Status==1 && !rs.fengkong) {
						rs.fengkong = cur.Remark;
					}
					if (cur.ActivityName=='经理审批' && cur.Status==1 && !rs.jingli) {
						rs.jingli = cur.Remark;
					}
				}

				return rs;
			})(rs.Approvals);

			return rs;
		},
		_joinString:function(data,keys,separator) {
			separator = separator || '、';
			var rs = {};
			var i=0,cur;
			for(;cur=data[i++];) {
				for(var key in cur) {
					if(cur.hasOwnProperty(key) && !!~$.inArray(key,keys)) {
						rs[key] = rs[key] || [];
						rs[key].push(cur[key]);
					}
				}
			}

			for(var key2 in rs) {
				if(rs.hasOwnProperty(key2)) {
					rs[key2] = rs[key2].join(separator);
				}
			}

			return rs;
		}
	};

	return MOD;
});
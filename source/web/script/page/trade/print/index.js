//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["risk/page/trade/print/print.css","jquery","risk/unit/string","risk/page/trade/apply/index"],function(require,exports,module){

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
//print/src/index.js
//print/src/print.tmpl.html
//print/src/type1.tmpl.html
//print/src/type2.tmpl.html
//print/src/type3.tmpl.html
//print/src/type4.tmpl.html

//js file list:
//print/src/index.js
/**
 * 打印交易申请单
 */

define.pack("./index",["risk/page/trade/print/print.css","jquery","risk/unit/string","./tmpl","risk/page/trade/apply/index"],function(require, exports, module){
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
//tmpl file list:
//print/src/print.tmpl.html
//print/src/type1.tmpl.html
//print/src/type2.tmpl.html
//print/src/type3.tmpl.html
//print/src/type4.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'Printer': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var Type = data&&data.Project.Type;
	var TypeTpl = 'PrintType'+Type,
		TplFn = this[TypeTpl],
		TplTitle = {
			'1':'交易类现金赎楼',
			'2':'首期款垫资',
			'3':'转贷类现金赎楼',
			'4':'贷前垫资'
		}[Type+''];
__p.push('<div class="trade-printer">\n	<div class="operate"><button type="button" class="btn btn-primary btn-lg" id="TradePrinter">打印审批表</button><br/>提示：表格空白的地方都可以点进去填写</div>\n	<div class="info">');
_p(TplTitle);
__p.push('业务审批表&nbsp;&nbsp;&nbsp;<small class="sn">业务员：');
_p(data.Creator);
__p.push('&nbsp;&nbsp;&nbsp;&nbsp;编号：');
_p(data.Project.Name);
__p.push('</small></div>');
if (TplFn) {__p.push('		');
_p(TplFn(data));
__p.push('	');
}else{__p.push('		没有找到type=');
_p(Type);
__p.push('的打印模板，请联系开发。');
}__p.push('</div>');

return __p.join("");
},

'PrintType1': function(data){

var __p=[],_p=function(s){__p.push(s)};

//二手楼买卖交易  IMG_6125
var ProjectData = data.Project;
__p.push('<table class="table table-bordered table-hover">\n	<tr>\n		<th width="80">借款人</th>\n		<td><input type="text" class="td_input" value="');
_p(data.SellersList.Name);
__p.push('" /></td>\n		<th width="80">借款金额</th>\n		<td width="80" class="text-right"><input value="');
_p(ProjectData.AssetRansomMoney);
__p.push('" type="text" size="5" />万</td>\n		<th width="80">使用期限</th>\n		<td width="80" class="text-right"><input value="');
_p(ProjectData.GuaranteeMonth);
__p.push('" type="text" size="5" />天</td>\n	</tr>\n	<tr>\n		<th>联系电话</th>\n		<td><textarea rows="');
_p((data.SellersList.IdentityCode.split('、').length));
__p.push('"  class="td_input">');
_p(data.SellersList.Phone);
__p.push('</textarea></td>\n		<th>身份证号</th>\n		<td colspan="3"><textarea rows="');
_p((data.SellersList.IdentityCode.split('、').length));
__p.push('"  class="td_input">');
_p(data.SellersList.IdentityCode);
__p.push('</textarea></td>\n	</tr>\n	<tr>\n		<th>物业名称</th>\n		<td colspan="2"><textarea rows="');
_p((data.AssetsList.Address.split('、').length));
__p.push('"  class="td_input">');
_p(data.AssetsList.Address);
__p.push('</textarea></td>\n		<th>房产证号</th>\n		<td colspan="2"><textarea rows="');
_p((data.AssetsList.Code.split('、').length));
__p.push('"  class="td_input">');
_p(data.AssetsList.Code);
__p.push('</textarea></td>\n	</tr>\n	<tr>\n		<th>产权现状</th>\n		<td colspan="5">该物业现抵押在<input value="');
_p(ProjectData.OrignalMortgageBank);
__p.push('" type="text" size="10" />支行，尚欠银行本息约<input type="text" value="');
_p(ProjectData.AssetRansomMoney);
__p.push('" size="5" />元，经手人及联系电话<input value="');
_p([ProjectData.AssetRansomCustomerManager,ProjectData.AssetRansomContactPhone].join(' '));
__p.push('" type="text" size="23" />。</td>\n	</tr>\n	<tr>\n		<th>交易情况</th>\n		<td colspan="5">该物业成交价为<input value="');
_p(ProjectData.DealMoney);
__p.push('" type="text" size="5" />元，买方姓名<input type="text" size="');
_p((data.BuyersList.Name.split('、').length*8));
__p.push('" value="');
_p(data.BuyersList.Name);
__p.push('" />身份证号码：<input type="text" size="');
_p((data.BuyersList.IdentityCode.split('、').length*23));
__p.push('" value="');
_p(data.BuyersList.IdentityCode);
__p.push('" />，通过<input type="text" size="15" value="');
_p(ProjectData.AgentName);
__p.push('" />地产公司成交，（或自助成交），经手人及联系电话<input type="text" size="20" value="');
_p(ProjectData.AgentContact);
__p.push('" />。</td>\n	</tr>\n	<tr>\n		<th>贷款审批</th>\n		<td colspan="5">买方已交定金<input type="text" value="');
_p(ProjectData.EarnestMoney);
__p.push('" size="5" />万，监管首期<input value="');
_p(ProjectData.SupervisionMoney);
__p.push('" type="text" size="5" />元，并获得<input value="');
_p(ProjectData.NewCreditBank);
__p.push('" type="text" size="10" />银行贷款承诺<input value="');
_p(((ProjectData.BuyerCreditCommerceMoney||0)*1+(ProjectData.BuyerCreditFundMoney||0)*1));
__p.push('" type="text" size="5" />万元，经手人及联系电话<input  type="text" size="20" />。</td>\n	</tr>\n	<tr>\n		<th>收费标准</th>\n		<td colspan="5">收费比例<input type="text" size="3" />%，收费金额<input type="text" size="5" />元；采用<label><input type="checkbox">前端</label> <label><input type="checkbox">后端收费方式，营销费用<input type="text" size="5" />。</td>\n	</tr>\n</table>\n\n<table class="table table-bordered table-hover">\n	<tr>\n		<th width="100">资料接收人</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">接收日期</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">资料保管人</th>\n		<td><input type="text" class="td_input" /></td>\n	</tr>\n	<tr>\n		<th width="100">业务发起日期</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">预计办结日期</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">密码修改人</th>\n		<td><input type="text" class="td_input" /></td>\n	</tr>\n	<tr>\n		<th width="100">贷款收取户名</th>\n		<td><input type="text" value="');
_p(ProjectData.CreditReceiverName);
__p.push('" class="td_input" /></td>\n		<th width="100">贷款收取账号</th>\n		<td><input type="text" value="');
_p(ProjectData.CreditReceiverAccount);
__p.push('" class="td_input" /></td>\n		<th width="100">回款金额</th>\n		<td><input type="text" size="10" />万</td>\n	</tr>\n</table>\n<table class="table table-bordered table-hover">\n	<tr>\n		<th rowspan="3" width="100">经办人意见</th>\n		<td>该笔业务已提交如下资料：</td>\n	</tr>\n	<tr>\n		<td class="trade-checklist">\n			<table class="table table-bordered table-hover">\n				<tr>\n					<th rowspan="8" width="20">必选</th>\n					<td><label><input type="checkbox">借款人身份证</label> <label><input type="checkbox">户口本复印件</label> <label><input type="checkbox">结婚证复印件</label> <label><input type="checkbox">征信报告</label></td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">借款人配偶身份证复印件</label> <label><input type="checkbox">户口本复印件</label> <label><input type="checkbox">征信报告</label></td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">借款人供楼存折(卡)</label> <label><input type="checkbox">原件</label> <label><input type="checkbox">复印件</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="checkbox">原借款合同</label> <label><input type="checkbox">还款清单</label> <label><input type="checkbox">房地产证复印件</label> <label><input type="checkbox">查档</label> <br/><label><input type="checkbox">还款卡</label> <label><input type="checkbox">密码</label> <label><input type="checkbox">网银；</label> </td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">买卖合同</label> <label><input type="checkbox">定金收据</label> <label><input type="checkbox">转账凭证</label> <label><input type="checkbox">买方身份证复印件</label> </td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">银行资金监管协议</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="checkbox">监管资金收款卡</label> <label><input type="checkbox">密码</label> <label><input type="checkbox">网银；</label> </td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">银行按揭贷款承诺书</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="checkbox">贷款资金收款卡</label> <label><input type="checkbox">密码</label> <label><input type="checkbox">网银</label> </td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">服务申请表、服务协议、确认函、借款合同、借据、划款委托书、承诺书</label> <br/><label><input type="checkbox">借款人配偶签字</label></td>\n				</tr>\n				<tr>\n					<td width="160"><label><input type="checkbox">买方公证书原件</label> <input type="text" size="1" />本</label></td>\n				</tr>\n				<tr>\n					<th>备选</th>\n					<td><label><input type="checkbox">担保保证书</label> <label><input type="checkbox">担保人身份证复印件</label> <label><input type="checkbox">户口本复印件</label> <label><input type="checkbox">证信报告</label> <label><input type="checkbox">资产清单</label> <label><input type="checkbox">评估报告或询价单</label> <br/>其他资料：<input type="text" size="65" />；</td>\n				</tr>\n			</table>\n		</td>\n	</tr>\n	<tr>\n		<td>\n			<p contenteditable="true" class="text-write"><strong class="not-write" onclick="return false;" tabindex="-1" contenteditable="false">经办人意见：</strong>');
_p(data.Report);
__p.push('</p>\n			<p><strong>经办人声明：申请人资料完整、真实，所有签字均在本人面签，有关复印件与原件相符，本人已在职责范围内做尽职调查。</strong></p>\n			<p class="text-right">签名：<input disabled type="text" size="15" />日期：<input disabled type="text" size="15" /></p>\n		</td>\n	</tr>\n	<tr>\n		<th>风控审批意见</th>');

			var Approvals1 = data.Approvals && data.Approvals[1];
			//防止流程改了，这里校验ActivityName
			Approvals1 = (Approvals1&&Approvals1.ActivityName=='风控审批')?Approvals1.Remark:'';
		__p.push('		<td><p contenteditable="true" class="text-write">');
_p(Approvals1);
__p.push('</p><p class="text-right">签名：<input disabled type="text" size="15" />日期：<input disabled type="text" size="15" /></p></td>\n	</tr>\n	<tr>\n		<th>总经理审批意见</th>');

			var Approvals0 = data.Approvals && data.Approvals[0];
			//防止流程改了，这里校验ActivityName
			Approvals0 = (Approvals0&&Approvals0.ActivityName=='经理审批')?Approvals0.Remark:'';
		__p.push('		<td><p contenteditable="true" class="text-write">');
_p(Approvals0);
__p.push('</p><p class="text-right">签名：<input disabled type="text" size="15" />日期：<input disabled type="text" size="15" /></p></td>\n	</tr>\n</table>');

return __p.join("");
},

'PrintType2': function(data){

var __p=[],_p=function(s){__p.push(s)};

//首期款垫资(表IMG<input type="text" size="15" />6126.JPG)
var ProjectData = data.Project;
console.log('dd.',data);
__p.push('<table class="table table-bordered table-hover">\n	<tr>\n		<th width="80">借款人</th>\n		<td><input type="text" class="td_input" value="');
_p(data.BuyersList.Name);
__p.push('" /></td>\n		<th width="80">借款金额</th>\n		<td width="80" class="text-right"><input value="');
_p(ProjectData.SupervisionMoney);
__p.push('" type="text" size="5" />万</td>\n		<th width="80">使用期限</th>\n		<td width="80" class="text-right"><input value="" type="text" size="5" />天</td>\n	</tr>\n	<tr>\n		<th>联系电话</th>\n		<td><textarea rows="');
_p((data.SellersList.IdentityCode.split('、').length));
__p.push('"  class="td_input">');
_p(data.SellersList.Phone);
__p.push('</textarea></td>\n		<th>身份证号</th>\n		<td colspan="3"><textarea rows="');
_p((data.SellersList.IdentityCode.split('、').length));
__p.push('"  class="td_input">');
_p(data.SellersList.IdentityCode);
__p.push('</textarea></td>\n	</tr>\n	<tr>\n		<th>物业名称</th>\n		<td colspan="2"><textarea rows="');
_p((data.AssetsList.Address.split('、').length));
__p.push('"  class="td_input">');
_p(data.AssetsList.Address);
__p.push('</textarea></td>\n		<th>房产证号</th>\n		<td colspan="2"><textarea rows="');
_p((data.AssetsList.Code.split('、').length));
__p.push('"  class="td_input">');
_p(data.AssetsList.Code);
__p.push('</textarea></td>\n	</tr>\n	<tr>\n		<th>产权现状</th>\n		<td colspan="5">该物业无抵押或抵押在<input type="text" size="7" value="');
_p(ProjectData.OrignalMortgageBank);
__p.push('" />支行，尚欠银行本息约<input type="text" size="5" value="');
_p(((ProjectData.OrignalCreditCommerceMoney||0)*1+(ProjectData.OrignalCreditFundMoney||0)*1));
__p.push('" />万元（经手人及联系电话<input type="text" size="15" value="');
_p([ProjectData.AssetRansomCustomerManager,ProjectData.AssetRansomContactPhone].join(' '));
__p.push('" />），已委托<input type="text" size="15" />担保公司赎楼（经手人及联系电话<input type="text" size="15" />）</td>\n	</tr>\n	<tr>\n		<th>交易情况</th>\n		<td colspan="5">该物业成交价为<input value="');
_p(ProjectData.DealMoney);
__p.push('" type="text" size="5" />万元，买方姓名<input type="text" size="');
_p((data.BuyersList.Name.split('、').length*8));
__p.push('" value="');
_p(data.BuyersList.Name);
__p.push('" />身份证号码：<input type="text" size="');
_p((data.BuyersList.IdentityCode.split('、').length*23));
__p.push('" value="');
_p(data.BuyersList.IdentityCode);
__p.push('" />，通过<input type="text" size="15" value="');
_p(ProjectData.AgentName);
__p.push('" />地产公司成交，（或自助成交），经手人及联系电话<input type="text" size="20" value="');
_p(ProjectData.AgentContact);
__p.push('" />。</td>\n	</tr>\n	<tr>\n		<th>贷款审批</th>\n		<td colspan="5">借款人已交定金<input type="text" size="5" value="');
_p(ProjectData.EarnestMoney);
__p.push('" />万，为获得<input value="');
_p(ProjectData.NewCreditBank);
__p.push('" type="text" size="7" />银行按揭贷款<input type="text" size="5" value="');
_p((parseFloat(ProjectData.BuyerCreditCommerceMoney||0)+parseFloat(ProjectData.BuyerCreditFundMoney||0)));
__p.push('" />万元，需要监管首期款<input value="');
_p(ProjectData.SupervisionMoney);
__p.push('" type="text" size="5" />元</td>\n	</tr>\n	<tr>\n		<th>收费标准</th>\n		<td colspan="5">收费比例<input type="text" size="3" />%，收费金额<input type="text" size="5" />元；采用<label><input type="checkbox">前端</label> <label><input type="checkbox">后端收费方式，营销费用<input type="text" size="5" />。</td>\n	</tr>\n</table>\n\n<table class="table table-bordered table-hover">\n	<tr>\n		<th width="100">资料接收人</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">接收日期</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">资料保管人</th>\n		<td><input type="text" class="td_input" /></td>\n	</tr>\n	<tr>\n		<th width="100">业务发起日期</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">预计办结日期</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">密码修改人</th>\n		<td><input type="text" class="td_input" /></td>\n	</tr>\n	<tr>\n		<th width="100">卖方收款户名</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">卖方收款账号</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100" rowspan="2">出款方式</th>\n		<td rowspan="2"><textarea row="2"  class="td_input"></textarea></td>\n	</tr>\n	<tr>\n		<th width="100">买方退款户名</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">买方退款账号</th>\n		<td><input type="text" class="td_input" /></td>\n	</tr>\n</table>\n<table class="table table-bordered table-hover">\n	<tr>\n		<th rowspan="3" width="100">经办人意见</th>\n		<td>该笔业务已提交如下资料：</td>\n	</tr>\n	<tr>\n		<td class="trade-checklist">\n			<table class="table table-bordered table-hover">\n				<tr>\n					<th rowspan="7">必选</th>\n					<td colspan="2"><label><input type="checkbox">借款人身份证</label> <label><input type="checkbox">户口本复印件</label> <label><input type="checkbox">结婚证复印件</label> <label><input type="checkbox">征信报告</label></td>\n				</tr>\n				<tr>\n					<td colspan="2"><label><input type="checkbox">借款人配偶身份证复印件</label> <label><input type="checkbox">户口本复印件</label> <label><input type="checkbox">征信报告</label></td>\n				</tr>\n				<tr>\n					<td colspan="2"><label><input type="checkbox">买卖合同</label> <label><input type="checkbox">定金收据</label> <label><input type="checkbox">转账凭证</label> <label><input type="checkbox">房地产证复印件</label> <label><input type="checkbox">查档</label><br/><label><input type="checkbox">原借款合同</label> <label><input type="checkbox">还款清单</label> <label><input type="checkbox">交易房产市值</label></td>\n				</tr>\n				<tr>\n					<td colspan="2"><label><input type="checkbox">卖方身份证原件</label> <label><input type="checkbox">复印件</label> <label><input type="checkbox">户口本复印件</label> <label><input type="checkbox">征信报告</label></td>\n				</tr>\n				<tr>\n					<td colspan="2"><label><input type="checkbox">买方收款卡</label> <label><input type="checkbox">原件</label> <label><input type="checkbox">密码</label> <label><input type="checkbox">网银</label> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="checkbox">卖方收款卡</label> <label><input type="checkbox">原件</label> <label><input type="checkbox">密码</label> <label><input type="checkbox">网银</label></td>\n				</tr>\n				<tr>\n					<td colspan="2"><label><input type="checkbox">服务申请表、服务协议、确认函、借款合同、借据、划款委托书、声明书</label> <br/><label><input type="checkbox">借款人配偶签字</label> <label><input type="checkbox">卖方划款委托书</label> <label><input type="checkbox">业主担保</label></td>\n				</tr>\n				<tr>\n					<td width="160"><label><input type="checkbox">买方公证书原件<input type="text" size="1" />本</label></td>\n					<td>后补资料：<label><input type="checkbox">资金监管协议</label> <label><input type="checkbox">资金监管进账单</label> <label><input type="checkbox">贷款承诺书</label> <label><input type="checkbox">账户确认书</label></td>\n				</tr>\n				<tr>\n					<th rowspan="3">备选</th>\n					<td colspan="2"><label><input type="checkbox">卖方委托公证书（受托人中必须有我司指定人员）</label><label><input type="checkbox">中介资金监管协议</label><label><input type="checkbox">转账凭证</label></td>\n				</tr>\n				<tr>\n					<td colspan="2">其他资料：<input type="text" size="65" />；<br/><strong>备注：真实交易高贷需提供真假两份合同以及多余首期款退回的补充协议;假交易则需买卖双方共同签署资料</strong></td>\n				</tr>\n			</table>\n		</td>\n	</tr>\n	<tr>\n		<td>\n			<p contenteditable="true" class="text-write"><strong class="not-write" onclick="return false;" tabindex="-1" contenteditable="false">经办人意见：</strong>');
_p(data.Report);
__p.push('</p>\n			<p><strong>经办人声明：申请人资料完整、真实，所有签字均在本人面签，有关复印件与原件相符，本人已在职责范围内做尽职调查。</strong></p>\n			<p class="text-right">签名：<input disabled type="text" size="15" />日期：<input disabled type="text" size="15" /></p>\n		</td>\n	</tr>\n	<tr>\n		<th>风控审批意见</th>');

			var Approvals1 = data.Approvals && data.Approvals[1];
			//防止流程改了，这里校验ActivityName
			Approvals1 = (Approvals1&&Approvals1.ActivityName=='风控审批')?Approvals1.Remark:'';
		__p.push('		<td><p contenteditable="true" class="text-write">');
_p(Approvals1);
__p.push('</p><p class="text-right">签名：<input disabled type="text" size="15" />日期：<input disabled type="text" size="15" /></p></td>\n	</tr>\n	<tr>\n		<th>总经理审批意见</th>');

			var Approvals0 = data.Approvals && data.Approvals[0];
			//防止流程改了，这里校验ActivityName
			Approvals0 = (Approvals0&&Approvals0.ActivityName=='经理审批')?Approvals0.Remark:'';
		__p.push('		<td><p contenteditable="true" class="text-write">');
_p(Approvals0);
__p.push('</p><p class="text-right">签名：<input disabled type="text" size="15" />日期：<input disabled type="text" size="15" /></p></td>\n	</tr>\n</table>');

return __p.join("");
},

'PrintType3': function(data){

var __p=[],_p=function(s){__p.push(s)};

//转贷类现金赎楼  IMG_6124
var ProjectData = data.Project;

var Borrowers = data.ThirdParty.length>0?data.ThirdPartyList:data.BuyersList;
__p.push('<table class="table table-bordered table-hover">\n	<tr>\n		<th width="80">借款人</th>\n		<td><input type="text" class="td_input" value="');
_p(data.BuyersList.Name);
__p.push('" /></td>\n		<th width="80">借款金额</th>\n		<td width="80" class="text-right"><input type="text" size="5" value="');
_p(ProjectData.AssetRansomMoney);
__p.push('" />万</td>\n		<th width="80">使用期限</th>\n		<td width="80" class="text-right"><input type="text" size="5" value="');
_p(ProjectData.GuaranteeMonth);
__p.push('" />天</td>\n	</tr>\n	<tr>\n		<th>联系电话</th>\n		<td><textarea rows="');
_p((data.BuyersList.IdentityCode.split('、').length));
__p.push('"  class="td_input">');
_p(data.BuyersList.Phone);
__p.push('</textarea></td>\n		<th>身份证号</th>\n		<td colspan="3"><textarea rows="');
_p((data.BuyersList.IdentityCode.split('、').length));
__p.push('"  class="td_input">');
_p(data.BuyersList.IdentityCode);
__p.push('</textarea></td>\n	</tr>\n	<tr>\n		<th>物业名称</th>\n		<td colspan="2"><textarea rows="');
_p((data.AssetsList.Address.split('、').length));
__p.push('"  class="td_input">');
_p(data.AssetsList.Address);
__p.push('</textarea></td>\n		<th>房产证号</th>\n		<td colspan="2"><textarea rows="');
_p((data.AssetsList.Code.split('、').length));
__p.push('"  class="td_input">');
_p(data.AssetsList.Code);
__p.push('</textarea></td>\n	</tr>\n	<tr>\n		<th>产权现状</th>\n		<td colspan="5">该物业现抵押在<input type="text" size="23" value="');
_p(ProjectData.OrignalMortgageBank);
__p.push(' ');
_p(ProjectData.OrignalMortgageBranch);
__p.push('" />支行，尚欠银行本息约<input type="text" size="5" value="');
_p(ProjectData.AssetRansomMoney);
__p.push('" />元，经手人及联系电话<input type="text" size="20" value="');
_p([ProjectData.AssetRansomCustomerManager,ProjectData.AssetRansomContactPhone].join(' '));
__p.push('" />。</td>\n	</tr>\n	<tr>\n		<th>贷款审批</th>\n		<td colspan="5">借款人以<label><input type="checkbox" ');
_p((data.ThirdParty.length>0?'':'checked="checked"'));
__p.push('>自身</label> <label><input type="checkbox" ');
_p((data.ThirdParty.length>0?'checked="checked"':''));
__p.push('>第三人</label><input type="text" size="');
_p(Borrowers.Name.split('、').length*8);
__p.push('" value="');
_p(Borrowers.Name);
__p.push('" />的名义，在<input type="text" size="15" value="');
_p(ProjectData.NewCreditBank);
__p.push('" />银行获得<input type="text" size="5" />万元的贷款承诺，银行承诺将贷款发放至<label><input type="checkbox">自身</label> <label><input type="checkbox">第三人</label> <label><input type="checkbox">我方</label> <label><input type="checkbox">贷款用途收款方</label> （经手人及联系电话<input type="text" size="15" />）。</td>\n	</tr>\n	<tr>\n		<th>收费标准</th>\n		<td colspan="5">收费比例<input type="text" size="3" />%，收费金额<input type="text" size="5" />元；采用<label><input type="checkbox">前端</label> <label><input type="checkbox">后端收费方式，营销费用<input type="text" size="5" />。</td>\n	</tr>\n</table>\n\n<table class="table table-bordered table-hover">\n	<tr>\n		<th width="100">资料接收人</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">接收日期</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">资料保管人</th>\n		<td><input type="text" class="td_input" /></td>\n	</tr>\n	<tr>\n		<th width="100">业务发起日期</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">预计办结日期</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">密码修改人</th>\n		<td><input type="text" class="td_input" /></td>\n	</tr>\n	<tr>\n		<th width="100">贷款收取户名</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">贷款收取账号</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">回款金额</th>\n		<td><input type="text" size="10" />万</td>\n	</tr>\n</table>\n<table class="table table-bordered table-hover">\n	<tr>\n		<th rowspan="3" width="100">经办人意见</th>\n		<td>该笔业务已提交如下资料：</td>\n	</tr>\n	<tr>\n		<td class="trade-checklist">\n			<table class="table table-bordered table-hover">\n				<tr>\n					<th rowspan="4" width="20">可选</th>\n					<td><label><input type="checkbox">借款人身份证</label> <label><input type="checkbox">户口本复印件</label> <label><input type="checkbox">结婚证复印件</label> <label><input type="checkbox">征信报告</label></td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">借款人配偶身份证复印件</label> <label><input type="checkbox">户口本复印件</label> <label><input type="checkbox">征信报告</label></td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">借款人供楼存折(卡)</label> <label><input type="checkbox">原件</label> <label><input type="checkbox">复印件</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="checkbox">原借款合同</label> <label><input type="checkbox">还款清单</label> <label><input type="checkbox">房地产证复印件</label> <label><input type="checkbox">查档</label> <br/><label><input type="checkbox">还款卡</label> <label><input type="checkbox">密码</label> <label><input type="checkbox">网银；</label> </td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">新贷款银行审批意见或承诺书</label> <label><input type="checkbox">放款用购销合同</label> <label><input type="checkbox">银行贷款收款账(卡)号</label> <label><input type="checkbox">密码</label> <label><input type="checkbox">网银；</label> </td>\n				</tr>\n				<tr>\n					<th>备选</th>\n					<td>\n					<label><input type="checkbox">抵押贷款申请人身份证</label> <label><input type="checkbox">原件</label> <label><input type="checkbox">复印件</label> <br/>\n					<label><input type="checkbox">贷款用途收款方身份证</label> <label><input type="checkbox">原件</label> <label><input type="checkbox">复印件</label> <br/>\n					<label><input type="checkbox">房产市值：<input type="text" size="15" /></label> <br/>\n					<label><input type="checkbox">余款收取账号确认书</label> <br/>\n					其他资料：<input type="text" size="65" />\n					</td>\n				</tr>\n			</table>\n		</td>\n	</tr>\n	<tr>\n		<td>\n			<p contenteditable="true" class="text-write"><strong class="not-write" onclick="return false;" tabindex="-1" contenteditable="false">经办人意见：</strong>');
_p(data.Report);
__p.push('</p>\n			<p><strong>经办人声明：申请人资料完整、真实，所有签字均在本人面签，有关复印件与原件相符，本人已在职责范围内做尽职调查。</strong></p>\n			<p class="text-right">签名：<input disabled type="text" size="15" />日期：<input disabled type="text" size="15" /></p>\n		</td>\n	</tr>\n	<tr>\n		<th>风控审批意见</th>');

			var Approvals1 = data.Approvals && data.Approvals[1];
			//防止流程改了，这里校验ActivityName
			Approvals1 = (Approvals1&&Approvals1.ActivityName=='风控审批')?Approvals1.Remark:'';
		__p.push('		<td><p contenteditable="true" class="text-write">');
_p(Approvals1);
__p.push('</p><p class="text-right">签名：<input disabled type="text" size="15" />日期：<input disabled type="text" size="15" /></p></td>\n	</tr>\n	<tr>\n		<th>总经理审批意见</th>');

			var Approvals0 = data.Approvals && data.Approvals[0];
			//防止流程改了，这里校验ActivityName
			Approvals0 = (Approvals0&&Approvals0.ActivityName=='经理审批')?Approvals0.Remark:'';
		__p.push('		<td><p contenteditable="true" class="text-write">');
_p(Approvals0);
__p.push('</p><p class="text-right">签名：<input disabled type="text" size="15" />日期：<input disabled type="text" size="15" /></p></td>\n	</tr>\n</table>');

return __p.join("");
},

'PrintType4': function(data){

var __p=[],_p=function(s){__p.push(s)};

//贷前垫资
var ProjectData = data.Project;
__p.push('<table class="table table-bordered table-hover">\n	<tr>\n		<th width="80">借款人</th>\n		<td><input type="text" class="td_input" value="');
_p(data.BuyersList.Name);
__p.push('" /></td>\n		<th width="80">垫资金额</th>\n		<td width="80" class="text-right"><input value="');
_p(ProjectData.CompanyPredepositMoney);
__p.push('" type="text" size="5" />万</td>\n		<th width="80">使用期限</th>\n		<td width="80" class="text-right"><input value="" type="text" size="5" />天</td>\n	</tr>\n	<tr>\n		<th>联系电话</th>\n		<td><textarea rows="');
_p((data.BuyersList.IdentityCode.split('、').length));
__p.push('"  class="td_input">');
_p(data.BuyersList.Phone);
__p.push('</textarea></td>\n		<th>身份证号</th>\n		<td colspan="3"><textarea rows="');
_p((data.BuyersList.IdentityCode.split('、').length));
__p.push('"  class="td_input">');
_p(data.BuyersList.IdentityCode);
__p.push('</textarea></td>\n	</tr>\n	<tr>\n		<th>物业名称</th>\n		<td colspan="2"><textarea rows="');
_p((data.AssetsList.Address.split('、').length));
__p.push('"  class="td_input">');
_p(data.AssetsList.Address);
__p.push('</textarea></td>\n		<th>房产证号</th>\n		<td colspan="2"><textarea rows="');
_p((data.AssetsList.Code.split('、').length));
__p.push('"  class="td_input">');
_p(data.AssetsList.Code);
__p.push('</textarea></td>\n	</tr>\n	<tr>\n		<th>产权现状</th>\n		<td colspan="5"><input type="checkbox">未赎楼&nbsp;&nbsp;&nbsp;&nbsp;抵押在<input type="text" size="10" value="');
_p(ProjectData.OrignalMortgageBank);
__p.push('" />支行，尚欠银行本息约<input type="text" size="5" value="');
_p(((ProjectData.OrignalCreditCommerceMoney||0)*1+(ProjectData.OrignalCreditFundMoney||0)*1));
__p.push('" />元; &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox">已赎楼&nbsp;&nbsp;&nbsp;&nbsp;赎楼金额：<input type="text" size="5" value="');
_p(ProjectData.AssetRansomMoney);
__p.push('"  />元<br/><input type="checkbox">已过户&nbsp;&nbsp;&nbsp;&nbsp;过户日期: <input type="text" size="10" />; &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox">已办理抵押&nbsp;&nbsp;&nbsp;&nbsp;抵押日期: <input type="text" size="10" /></td>\n	</tr>\n	<tr>\n		<th>交易情况</th>\n		<td colspan="5">该物业成交价为<input type="text" size="5" value="');
_p(ProjectData.DealMoney);
__p.push('" />元，买方姓名<input type="text" size="10" />身份证号码：<input type="text" size="15" /></td>\n	</tr>\n	<tr>\n		<th>贷款审批</th>\n		<td colspan="5">已获得<input type="text" size="10"  value="');
_p(ProjectData.NewCreditBank);
__p.push('" />银行贷款承诺<input type="text" size="5"  value="');
_p(((ProjectData.BuyerCreditCommerceMoney||0)*1+(ProjectData.BuyerCreditFundMoney||0)*1));
__p.push('" />万元</td>\n	</tr>\n	<tr>\n		<th>收费标准</th>\n		<td colspan="5">收费比例<input type="text" size="3" />%，收费金额<input type="text" size="5" />元；采用<label><input type="checkbox">前端</label> <label><input type="checkbox">后端收费方式，营销费用<input type="text" size="5" />。</td>\n	</tr>\n</table>\n\n<table class="table table-bordered table-hover">\n	<tr>\n		<th width="100">资料接收人</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">接收日期</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">保管人签字</th>\n		<td><input type="text" class="td_input" /></td>\n	</tr>\n	<tr>\n		<th width="100">业务发起日期</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">预计办结日期</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">密码修改签字</th>\n		<td><input type="text" class="td_input" /></td>\n	</tr>\n	<tr>\n		<th width="100">贷款收取户名</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">贷款收取账号</th>\n		<td><input type="text" class="td_input" /></td>\n		<th width="100">回款金额</th>\n		<td><input type="text" size="10" />万</td>\n	</tr>\n</table>\n<table class="table table-bordered table-hover">\n	<tr>\n		<th rowspan="3" width="100">经办人意见</th>\n		<td>该笔业务已提交如下资料：</td>\n	</tr>\n	<tr>\n		<td class="trade-checklist">\n			<table class="table table-bordered table-hover">\n				<tr>\n					<th rowspan="8" width="20">必选</th>\n					<td><label><input type="checkbox">借款人身份证</label> <label><input type="checkbox">户口本复印件</label> <label><input type="checkbox">结婚证复印件</label> <label><input type="checkbox">征信报告</label></td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">借款人配偶身份证复印件</label> <label><input type="checkbox">户口本复印件</label> <label><input type="checkbox">征信报告</label></td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">借款人供楼存折(卡)</label> <label><input type="checkbox">原件</label> <label><input type="checkbox">复印件</label>&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="checkbox">原借款合同</label> <label><input type="checkbox">还款清单</label> <label><input type="checkbox">房地产证复印件</label> <label><input type="checkbox">查档</label> <br/><label><input type="checkbox">还款卡</label> <label><input type="checkbox">密码</label> <label><input type="checkbox">网银；</label> </td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">买卖合同</label> <label><input type="checkbox">定金收据</label> <label><input type="checkbox">转账凭证</label> <label><input type="checkbox">买方身份证复印件</label> </td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">银行资金监管协议</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="checkbox">监管资金收款卡</label> <label><input type="checkbox">密码</label> <label><input type="checkbox">网银；</label> </td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">银行按揭贷款承诺书</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label><input type="checkbox">贷款资金收款卡</label> <label><input type="checkbox">密码</label> <label><input type="checkbox">网银</label> </td>\n				</tr>\n				<tr>\n					<td><label><input type="checkbox">服务申请表、服务协议、确认函、借款合同、借据、划款委托书、承诺书</label> <br/><label><input type="checkbox">借款人配偶签字</label></td>\n				</tr>\n				<tr>\n					<td width="160"><label><input type="checkbox">公证书原件</label> <input type="text" size="1" />本</label></td>\n				</tr>\n				<tr>\n					<th>备选</th>\n					<td><label><input type="checkbox">担保保证书</label> <label><input type="checkbox">担保人身份证复印件</label> <label><input type="checkbox">户口本复印件</label> <label><input type="checkbox">证信报告</label> <label><input type="checkbox">资产清单</label> <label><input type="checkbox">评估报告或询价单</label> <br/>其他资料：<input type="text" size="65" />；</td>\n				</tr>\n			</table>\n		</td>\n	</tr>\n	<tr>\n		<td>\n			<p contenteditable="true" class="text-write"><strong class="not-write" onclick="return false;" tabindex="-1" contenteditable="false">经办人意见：</strong>');
_p(data.Report);
__p.push('</p>\n			<p><strong>经办人声明：申请人资料完整、真实，所有签字均在本人面签，有关复印件与原件相符，本人已在职责范围内做尽职调查。</strong></p>\n			<p class="text-right">签名：<input disabled type="text" size="15" />日期：<input disabled type="text" size="15" /></p>\n		</td>\n	</tr>\n	<tr>\n		<th>风控审批意见</th>');

			var Approvals1 = data.Approvals && data.Approvals[1];
			//防止流程改了，这里校验ActivityName
			Approvals1 = (Approvals1&&Approvals1.ActivityName=='风控审批')?Approvals1.Remark:'';
		__p.push('		<td><p contenteditable="true" class="text-write">');
_p(Approvals1);
__p.push('</p><p class="text-right">签名：<input disabled type="text" size="15" />日期：<input disabled type="text" size="15" /></p></td>\n	</tr>\n	<tr>\n		<th>总经理审批意见</th>');

			var Approvals0 = data.Approvals && data.Approvals[0];
			//防止流程改了，这里校验ActivityName
			Approvals0 = (Approvals0&&Approvals0.ActivityName=='经理审批')?Approvals0.Remark:'';
		__p.push('		<td><p contenteditable="true" class="text-write">');
_p(Approvals0);
__p.push('</p><p class="text-right">签名：<input disabled type="text" size="15" />日期：<input disabled type="text" size="15" /></p></td>\n	</tr>\n</table>');

return __p.join("");
}
};
return tmpl;
});

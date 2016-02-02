//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["risk/page/trade/print/print.css","jquery","risk/page/trade/apply/index"],function(require,exports,module){

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

//js file list:
//print/src/index.js
/**
 * 打印交易申请单
 */

define.pack("./index",["risk/page/trade/print/print.css","jquery","./tmpl","risk/page/trade/apply/index"],function(require, exports, module){
	require('risk/page/trade/print/print.css');
	var $ = require('jquery');

	var Tmpl = require('./tmpl'),
		Trade = require('risk/page/trade/apply/index');

	var MOD = {
		//默认查询入口
		initPage:function(params) {
			params = params || {};

			document.title = '申请单据';

			var container = $('body');
			container.empty().html('<div class="loading">Loading...</div>');

			require.async('risk/page/trade/apply/data',function(Data) {
				Data.get().done(function(d) {
					var html = Tmpl.Printer(d);
					container.html(html);

					$('#TradePrinter').click(function(ev) {
						window.print();
					});
				});
			});

		}
	};

	return MOD;
});
//tmpl file list:
//print/src/print.tmpl.html
//print/src/type1.tmpl.html
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'Printer': function(data){

var __p=[],_p=function(s){__p.push(s)};

	var Type = data&&data.Project.Type,
		TypeTpl = 'PrintType'+Type;
__p.push('<div class="trade-printer">\n	<div class="operate"><button type="button" class="btn btn-primary" id="TradePrinter">打印</button></div>\n	<div class="info">编号：');
_p(data.Project.Name);
__p.push('</div>');
_p(this[TypeTpl](data));
__p.push('</div>');

return __p.join("");
},

'PrintType1': function(data){

var __p=[],_p=function(s){__p.push(s)};

//首期款垫资业务审批表
__p.push('<table class="table table-bordered table-hover">\n	<tr>\n		<th width="80">借款人</th>\n		<td>&nbsp;</td>\n		<th width="80">借款金额</th>\n		<td width="80" class="text-right">万</td>\n		<th width="80">使用期限</th>\n		<td width="80" class="text-right">天</td>\n	</tr>\n	<tr>\n		<th>联系电话</th>\n		<td>&nbsp;</td>\n		<th>身份证号</th>\n		<td colspan="3">&nbsp;</td>\n	</tr>\n	<tr>\n		<th height="60">物业名称</th>\n		<td colspan="2">&nbsp;</td>\n		<th>房产证号</th>\n		<td colspan="2">&nbsp;</td>\n	</tr>\n	<tr>\n		<th>产权现状</th>\n		<td colspan="5">该物业无抵押或抵押在_____________支行，尚欠银行本息约_______元（经手人及联系电话________________），已委托____________________担保公司赎楼（经手人及联系电话________________）</td>\n	</tr>\n	<tr>\n		<th>交易情况</th>\n		<td colspan="5">该物业成交价为_______元，卖方姓名______身份证号码：__________________，通过______地产公司（经手人及联系电话___________________）成交，（或自助成交）。</td>\n	</tr>\n	<tr>\n		<th>贷款审批</th>\n		<td colspan="5">借款人已交定金_____万，为获得________银行按揭贷款______元，需要监管首期款______元（经手人及联系电话________________）</td>\n	</tr>\n	<tr>\n		<th>收费标准</th>\n		<td colspan="5">收费比例____%，收费金额_____元；采用<input type="checkbox">前端 <input type="checkbox">后端收费方式，营销费用______。</td>\n	</tr>\n</table>');

return __p.join("");
}
};
return tmpl;
});

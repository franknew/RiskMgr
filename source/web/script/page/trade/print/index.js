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
define.pack("./tmpl",[],function(require, exports, module){
var tmpl = { 
'Printer': function(data){

var __p=[],_p=function(s){__p.push(s)};
__p.push('<div class="trade-printer">\n	<div class="operate"><button type="button" class="btn btn-primary" id="TradePrinter">打印</button></div>\n	<div class="info">编号：');
_p(data.Project.Name);
__p.push('</div>\n	<table>\n		<tr>\n			<th>申请人</th>\n			<td>阿斯顿发</td>\n			<th>日期</th>\n			<td>2015-01-01</td>\n		</tr>\n	</table>\n</div>');

return __p.join("");
}
};
return tmpl;
});

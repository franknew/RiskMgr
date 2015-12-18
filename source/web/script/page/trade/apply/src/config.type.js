/**
 * 交易类型对应关系
 * @authors viktorli (i@lizhenwen.com)
 */

define(function(require, exports, module){

	var MOD = {
		data:{
			'1':'二手楼买卖交易',
			'2':'首期款垫付',
			'3':'同名转按',
			'4':'贷前垫资'
		},
		get:function(typeID) {
			typeID = typeID+'';
			var types = MOD.data;

			var rs = types[typeID] || types['1'];

			return rs;
		}
	};

	return MOD;
});
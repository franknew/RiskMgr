/**
 * Created with JetBrains WebStorm.
 * User: jinjingcao
 * Date: 13-3-22
 * Time: 下午2:59
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
	alert(111)
	var Util = require("./mm.util");
	var pingSender = require("./mm.pingsender");
	var commonInfo = require("./mm.commonInfo");
	var object = Util.object;
	var helper = Util.helper;

	var Base = function(){
		this.points = [];
	};
	object.extend(Base.prototype, {
		report:function(){this._report.apply(this, arguments)}
	});

	object.extend(Base.prototype, {
		_report:function(){}
	});
	Base.commonInfo = commonInfo;

	Base.pingSender = pingSender;

	return Base;
});

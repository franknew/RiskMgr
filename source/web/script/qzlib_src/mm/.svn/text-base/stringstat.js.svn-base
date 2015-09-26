/**
 * Created with JetBrains WebStorm.
 * User: jinjingcao
 * Date: 13-3-22
 * Time: 下午3:27
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
	var Util = require("./mm.util");
	var object = Util.object;
	var helper = Util.helper;
	var Base = require("./mm.base");
	var PingSender = Base.pingSender;

	var CGI = "";
	var _g_appid = "";
	/**
	 * 返回码类
	 */
	var StringStat = helper.extend(function(type, appid) {
		Base.apply(this, arguments);
		this.type = type;
		this.appid = appid||_g_appid;
		this.frequency = 1;
	}, Base);
	StringStat.setAppId = function(appid) {
		_g_appid = appid;
	};

	object.extend(StringStat.prototype, {
		setString:function(string, frequency){
			this.frequency = frequency||this.frequency;
			this.string = string;
			return this;
		},
		_report:function(){
			var tmp = [];
			this.type && tmp.push(this.type);
			tmp.push( this.string );

			var param = {
				odetails : tmp.join("::")
			};

			var parasObj = object.extend({}, param);
			parasObj.dtype=3;
			parasObj.frequency=this.frequency;

			parasObj.appid=this.appid;

			PingSender.queue(parasObj, "mm_stringstat");
		},
		toString:function(){}
	});

	return {
		getClass : function(){return StringStat},
		setString:function(string, type, frequency, appid){var ins = new StringStat(type, appid);ins.setString(string, frequency).report();return ins;}
	}
});

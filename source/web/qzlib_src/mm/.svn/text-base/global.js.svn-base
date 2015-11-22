/**
 * Created with JetBrains WebStorm.
 * User: jinjingcao
 * Date: 13-3-22
 * Time: 下午2:59
 * To change this template use File | Settings | File Templates.
 */
define(function (require, exports, module) {
	var commonInfo = require("./mm.commonInfo");
	var stringstat = require("./mm.stringstat");

	/**
	 * 复写基本环境变量
	 * @returns {{releaseversion: *, locuin: (*|number), touin: (*|number)}}
	 */
	commonInfo.getEnvironment = function(){
		var g_f_m = location.href.match(/qzact\/([^?&#]+)/);
		return {
			releaseversion : g_f_m?g_f_m[1]:"default",
			locuin : window.g_Guest && g_Guest.userid || 0,
			touin : window.g_Host && g_Host.userid || 0
		}
	};

	/**
	 * 设置appid
	 */
	var appid = 1000140;
	stringstat.getClass().setAppId(appid);

	return {
		stringstat:stringstat
	}
});


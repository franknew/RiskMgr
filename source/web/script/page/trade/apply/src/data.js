/**
 * 获取数据
 * @authors viktorli (i@lizhenwen.com)
 * @date    2015-08-29 16:07:24
 */

define(function(require, exports, module){
	var $ = require('jquery'),
		msg = require('risk/components/msg/index'),
		Modal = require('risk/components/modal/index'),
		Ajax = require('risk/unit/ajax'),
		Uri = require('risk/unit/uri');

	var _CACHE,_DEFER;
	var MOD = {
		/** 拉取数据
		 * @param [cache=true] 是否读缓存，默认为true
		 */
		get:(function() {
			var _getNew = function(callback) {
				var data = Uri('http://www.qq.com/?'+location.hash.substr(1)).params;
				delete data.action;
				delete data.page;
				Ajax.post({
					url:'RiskMgr.Api.ProjectApi/InitApproval',
					data:data,
					success:function(da) {
						callback(da);
					}
				});
			};
			return function(cache) {
				if (arguments.length<=0) {
					cache = true;
				}
				if (_CACHE && _DEFER && cache) {
					_DEFER.resolve(_CACHE);
				}else if ( !cache || !_DEFER) {
					_DEFER = $.Deferred();
					_getNew(function(da) {
						_CACHE = da;
						_DEFER.resolve(_CACHE);
					});
				}

				return _DEFER;
			};
		})(),
		clearCache:function() {
			_CACHE = null;
			_DEFER = null;
		}
	};

	return MOD;
});
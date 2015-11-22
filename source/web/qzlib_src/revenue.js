/**
 * @fileOverview 营收统一接口
 * @rights Tencent.All Rights Reserved.
 * @author larvachen larvachen@tencent.com
 * @since 2014/09/24 create
 * @project Qzone
 */
define(function(require, exports, module) {
	var $ = require("jquery"),
		ajax = require('./ajax'),
		browser = require('./browser'),
		user = require('./user');

	var mod = {
		/**
		 * jsonp请求
		 * @param {String} url
		 * @param {Object} data
		 * @param {Object} opt
		 * @return {Deferred} defer
		 */
		jsonp: function(url, data, opt) {
			var defer = $.Deferred();
			ajax.request($.extend({
				dataType: "jsonp",
				url: url,
				qzoneCoolCbName: true,
				data: $.extend(data, {
					r: Math.random()
				}),
				success: function (o) {
					if (o.code == 0) {
						defer.resolve(o);
					} else {
						defer.reject(o);
					}
				},
				error: function() {
					defer.reject({});
				}
			}, opt || {}));
			return defer;
		},
		/**
		 * post请求
		 * @param {String} url
		 * @param {Object} data
		 * @param {Object} opt
		 * @return {Deferred} defer
		 */
		post: function(url, data, opt) {
			var defer = $.Deferred();
			var dataType = browser.isMobile ? "json": "formsender";
			ajax.request($.extend({
				dataType: "json",
				url: url,
				type: "POST",
				data: $.extend(data, {"format": dataType}),
				success: function (o) {
					if (o.code == 0) {
						defer.resolve(o);
					} else {
						defer.reject(o);
					}
				},
				error: function() {
					defer.reject({});
				}
			}, opt || {}));
			return defer;
		},
		// --------------------------------------------------------------
		/**
		 * 抽奖
		 * @param {int} actId 活动id
		 * @param {int} ruleId 规则dd
		 * @return {Deferred} defer
		 */
		draw: function(actId, ruleId) {
			var defer = $.Deferred();
			mod.post('http://activity.qzone.qq.com/fcg-bin/fcg_qzact_lottery', {actid: actId, ruleid: ruleId}).done(function(o) {
                defer.resolve(o.data || []);
            }).fail(function(o) {
                defer.reject(o);
            });

            return defer;
		},
		/**
		 * 领奖
		 * @param {int} actId 活动id
		 * @param {int} ruleId 规则id
		 * @return {Deferred} defer
		 */
		award: function(actId, ruleId) {
			var defer = $.Deferred();
			mod.post("http://activity.qzone.qq.com/fcg-bin/fcg_qzact_present", {actid: actId, ruleid: ruleId}).done(function(o) {
				defer.resolve(o.data || []);
			}).fail(function(o) {
				defer.reject(o);
			});

			return defer;
		},
		/**
		 * 获取资格计数
         * 调用方式：
         *      budget(actId) 只传actId，则批量拉取所有rule
         *      budget(actId, ruleId) 拉取指定ruleId资格
         *      budget(actId, null, countId) 拉取指定countId资格
         *      budget(actId, ruleId, countId) 拉取指定ruleId资格和指定countId资格
         * @param {int} actId 活动id
         * @param {int} ruleId 规则id，按规则id拉取规则下资格
         * @param {int} countId 计数id，按计数id拉取资格
		 * @return {Deferred} defer
		 */
		budget: function(actId, ruleId, countId) {
			var defer = $.Deferred();
			mod.jsonp("http://activity.qzone.qq.com/fcg-bin/fcg_qzact_count", {actid: actId, ruleid: ruleId, countid: countId}).done(function(o) {
				defer.resolve(o.data || {});
			}).fail(function(o) {
				defer.reject(o);
			});

			return defer;
		},
		/**
		 * 获取活动配置信息
		 * @param {int} actId 活动id
		 * @return {Deferred} defer
		 */
		actInfo: function(actId) {
			var defer = $.Deferred();
			
			mod.jsonp("http://activity.qzone.qq.com/fcg-bin/fcg_qzact_act", {actid: actId}).done(function(o) {
				defer.resolve(o.data || {});
			}).fail(function(o) {
				defer.reject(o);
			});
			
			return defer;
		},
        /**
         * 获取幸运用户
         * @param {int} actId 活动id
         * @return {Deferred} defer
         */
        luckyList: function(actId) {
            var defer = $.Deferred();
            mod.jsonp('http://activity.qzone.qq.com/fcg-bin/fcg_qzact_lucky', {actid: actId}).done(function(data) {
                defer.resolve(data.data && data.data.list || []);
            }).fail(function(data) {
                defer.reject(data);
            });

            return defer;
        },
        /**
         * 获取我的中奖记录
         * @param {int} actId 活动id
         * @return {Deferred} defer
         */
        prizeRecord: function(actId) {
            var defer = $.Deferred();
            mod.jsonp('http://activity.qzone.qq.com/fcg-bin/fcg_qzact_record', {actid: actId}).done(function(data) {
                defer.resolve(data.data && data.data.list || []);
            }).fail(function(data) {
                defer.reject(data);
            });

            return defer;
        }
	};
	return mod;
});
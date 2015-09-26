/**
 * Tencent.All Rights Reserved.
 * User: lenzhang lenzhang@tencent.com
 * Date: 13-6-6
 * Time: 下午10:32
 * Project Qzone
 *
 * @fileOverview qboss接口, 每个广告都需要独立初始化一个
 * @require jquery
 * @require ./ajax
 * @require ./user
 */
define(function(require, exports, module){
    var $ = require('jquery');
	var ajax = require('./ajax'),
		user = require('./user');

    /**
     * 每个广告都需要独立初始化一个
     * @require jquery
     * @require ./ajax
     * @require ./user
     * @exports qboss
     * @type {{init: init, get: get, ping: ping, getWapUrl: getWapUrl}}
     */
    var Mod = {
        /**
         * 初始化一个QBOSS 对象
         * @param {Object} opt
         * @param {Number} opt.advId 广告ID
         * @param {Number} opt.uin uin
         */
		init: function(opt){
			var self = this;
			self.id = opt.id || opt.advId;
			self.postrace = null;
			self.pingTypeMap = {'click': 1, 'close': 2};
			return self;
		},
        /**
         * 获取广告数据
         * @param opt 配置
         * @param {String} opt.type 可选有single（单个）、multi（多个）
         * @param opt.count  当选择multi类型的时候，可以设置count最大几个
         * @return {Object} defer
         */
		get: function(opt) {
			opt = opt||{};
			var self = this,
				defer = $.Deferred(),
				id = self.id,
				url = {
					'single':'http://boss.qzone.qq.com/fcg-bin/fcg_get_strategy',
					'multi':'http://boss.qzone.qq.com/fcg-bin/fcg_get_multiple_strategy'
				};
			url = url[opt.type] || url['single'];

			ajax.request({
				url: url,
				type: 'get',
				dataType: 'jsonp',
				data:{
					board_id:id,
					need_cnt:opt.count
				},
				jsonpQzone: true,
				success: function(rst) {
					var code = rst&&rst.code,
						 data;
					if(code==0) {
						data = rst.data&&rst.data[id]&&rst.data[id].items;
						if(data) {
							self.postrace = data && data[0] && data[0].postrace;
							defer.resolve(data);
						}else {
							defer.reject('没有数据');
						}
					}else {
						defer.reject(rst&&rst.message || '看起来出了点问题，请稍后再试');
					}
				},
				error: function(){
					defer.resolve('服务器出了点问题，我们正在紧急修复。');
				}
			});
			return defer;
		},
        /**
         * 上报
         * @param {String} type "click" || "close" 对应点击和关闭
         * @param {String} advPostrace 广告对应的postrace
         */
		ping: function(type, advPostrace) {
			var self = this,
				pingType = type && self.pingTypeMap[type];
			var uin = user.getUin() || 10000;

			advPostrace = advPostrace || self.postrace;
			if(pingType && advPostrace){
				setTimeout(function(){
					((new Image()).src = 'http://boss.qzone.qq.com/fcg-bin/fcg_rep_strategy?from=1&uin=' + uin + '&postype=' + pingType + '&postrace=' + advPostrace + '&_=' + (+new Date()));
				}, 0);
			}
		},
        /**
         * 获取Wap地址
         * @param {String} link
         * @param {String} uin
         * @param {String} posttrace
         */
		getWapUrl: function(link,uin,posttrace){
            return  'http://boss.qzone.qq.com/fcg-bin/fcg_rep_strategy_for_wap?from=1&uin='+uin+'&oper_type=2&traceinfo='+posttrace+'&link='+link;
		}

	};

	return Mod;
});
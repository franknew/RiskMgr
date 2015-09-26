/**
 * @fileOverview 通用数据接口
 * @requires jquery
 * @requires ./ajax
 * @requires ./user
 * @requires ./msg
 * @requires ./browser
 */
define(function (require, exports, module) {
    var $ = require('jquery');
    var user = require('./user');
    var ajax = require('./ajax');
    var msg = require("./msg"),
         browser = require('./browser');

    /**
     * data模块, 通用数据接口
     * @exports data
     */
    var mod = {
        /**
         * jsonp请求
         * @param {String} url
         * @param {Object} data
         * @param {Object} opt
         * @return {Deferred} defer
         */
        jsonp:function(url,data,opt){
            var defer = $.Deferred();
            ajax.request($.extend({
                dataType: 'jsonp',
                url: url,
                qzoneCoolCbName: true,
                data: $.extend(data,{
                    r: Math.random()
                }),
                success: function (o) {
                    if(!o.code){
                        defer.resolve(o);
                    }else{
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
        post:function(url,data,opt){
            var defer = $.Deferred();
            var dataType = browser.isMobile?'json':'formsender';

            ajax.request($.extend({
                dataType: 'json',
                url: url,
                type: 'POST',
                data: $.extend(data,{'format': dataType}),
                success: function (o) {
                    if(!o.code){
                        defer.resolve(o);
                    }else{
                        defer.reject(o);
                    }
                },
                error: function() {
                    defer.reject({});
                }
            }, opt || {}));

            return defer;
        },

        //=================================  这里是功能分割线  ======================================
        /**
         * 抽奖
         * @param {String} actId 活动ID
         * @return {Deferred} defer
         */
        draw: function (actId) {
            var defer = $.Deferred();
            mod.post(
                'http://activity.qzone.qq.com/cgi-bin/v2/fcg_lottery_act_for_prize',
                {act_id: actId, uin: user.getUin()}
            ).done(function (o) {
                if(o.code==0){
                    defer.resolve({name: o.data.awardName, data: o.data });
                }else{
                    defer.reject(o);
                }
            }).fail(function (o) {
                defer.reject(o);
            });
            return defer;
        },
        /**
         * 领奖
         * @param {String} actId 活动id
         * @param {String} lv 等级
         * @return {Deferred} defer
         */
        getAward: function(actId,lv){
            var defer = $.Deferred();
            mod.post(
                'http://activity.qzone.qq.com/cgi-bin/v2/fcg_accept_act_prize',
                {
                    act_id: actId,
                    lv: lv,
                    uin: user.getUin()
                }
            ).done(function(o){
                if (o.code == 0) {
                    defer.resolve({});
                } else {
                    defer.reject(o);
                }
            }).fail(function (o) {
                defer.reject(o);
            });
            return defer;
        },
        /**
         * 获取资格计数
         * @param key {String} 资格key
         * @return {Deferred} defer
         */
        getBudget: function(key){
            var defer = $.Deferred();
            this._getUin(function (uin) {    //手机版不能直接取qq号，这里先拉一次uin信息。后台去掉uin传参比较麻烦，一般活动会缓存userinfo，这里性能不会成瓶颈
                mod.jsonp('http://activity.qzone.qq.com/cgi-bin/v2/fcg_act_query_qualify_counter', {
                    counter_info: key + '-' + uin
                }).done(function (o) {
                    if(o.code==0){
                        defer.resolve(o.data[key+'-'+ uin]);
                    }else{
                        defer.reject(o);
                    }
                }).fail(function (o) {
                    defer.reject(o);
                });
            });
            return defer;
        },
        /**
         * 中奖用户列表
         * @param actid {String} 活动id
         * @return {Deferred} defer
         */
        getWinnerData: function(actid){
            var defer = $.Deferred();

            mod.jsonp('http://activity.qzone.qq.com/cgi-bin/v2/fcg_query_act_lucky_list',{
                act_id: actid
            }).done(function (o) {
                if(o.code==0){
                    defer.resolve(o);
                }else{
                    defer.reject(o);
                }
            }).fail(function (o) {
                defer.reject(o);
            });
            return defer;
        },
        /**
         * 中奖记录
         * @param {String} actId
         * @returns {Deferred} defer
         */
        getRecord: function(actId){
            var defer = $.Deferred();
            mod.jsonp('http://activity.qzone.qq.com/cgi-bin/v2/fcg_query_user_act_prize_list',{
                act_id: actId,
                r: Math.random()
            }).done(function(o){
                if (o.code == 0) {
                    defer.resolve(o);
                } else {
                    defer.reject(o);
                }
            }).fail(function (o) {
                defer.reject(o);
            });
            return defer;
        },
        /**
         * 用户信息
         * @param {Function} callback
         *
         */
        _getUin:function (callback) {
            var uin = user.getUin();
            if(!uin && browser.isMobile) {
                user.userinfo().done(function (userinfo) {    //手机版不能直接取qq号，这里先拉一次uin信息。后台去掉uin传参比较麻烦，一般活动会缓存userinfo，这里性能不会成瓶颈
                    callback&&callback(userinfo.uin);
                });
            }else {
                callback && callback(uin);
            }
        },
        /**
         * 传播活动信息cgi
         * 支持多种功能，包括分享、送礼、关注认证空间、qq提醒、预约计数
         * @param {string} rekey 唯一标识符，只起区分作用，没有实际用途，可为活动id
         * @param {string} cmd_list 要进行的操作，用 | 分隔，可选的有'tixing','qz_share','joinin_counter','prize_qualify','send_giftcard','follow_famousqq','qzact_prize_qualify' 如果cmd_list里填了相应的操作，则须有相应的参数，参数名同命令名
         *
         * @param {string} tixing 'appid','midid','tik','tktime'，前三项为产品向qq提醒申请后所得的配置项，tktime为触发时间，可自定义，各项以&连接
         *
         * @param {string} qz_share 'title'标题,'srcurl'地址,'picurl'图片地址,'content'网页摘要,'showpt'指定可见 0为全平台 1为pc 2为手机，'pttype'指定来源，100为pc 300为手机，'no_reason'为1没有分享内容，'no_summary'为1没有网页摘要，各项以&连接
         *
         * @param {string} send_giftcard 'cardid'为礼物卡id，'uins'为赠送者uin，可批量赠送，用'-'连接，如uins=123456-654321，各项以&连接
         *
         * @param {string} follow_famousqq 'famous_qq'认证空间uin，关注认证空间
         *
         * @param {string} qzact_prize 'actid'活动ID,'ruleid'规则ID， 新活动平台上获得奖品
         *
         * @return {object} 返回code===0 不一定代表成功，要自己解析da.data里每个cmd对应的结果
         *
         * @example {rekey : '21948', cmd_list : 'send_giftcard|follow_famousqq', send_giftcard : cardid=12345&uins=900000478&900000473, follow_famousqq : 'famous_qq=1461513157'}
         */
         spreadAct : function(opts){

            var defer = $.Deferred();
            var data = $.extend({
                uin : user.getUin()
            },opts);
            mod.post(
                'http://activity.qzone.qq.com/cgi-bin/v2/fcg_spread_act_components_delegate',
                data
            ).done(function (o) {
                if(o.code === 0){
                    defer.resolve(o);
                }else{
                    defer.reject(o);
                }
            }).fail(function (o) {
                defer.reject(o);
            });

            return defer;
         }
    };

    return mod;
});
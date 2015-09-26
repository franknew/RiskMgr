/**
 * @fileOverview 支付组件手机接口
 * @requires jquery
 * @requires ./util
 * @requires ./user
 * @requires ./ajax
 * @requires ./msg
 * @requires ./browser
 * @requires ./cookie
 */
define(function (require, exports, module) {
    var $ = require('jquery'),
        util = require('./util'),
        user = require('./user'),
        ajax = require('./ajax'),
        msg = require('./msg'),
        browser = require('./browser'),
        cookie = require('./cookie'),
        data = require('./data');

    //参数统一映射
    var MAP = {
        qzone:{
            'success':'successUrl',
            'error':'errorUrl',
            'count':'defaultMonth',
            'countFixed':'changeMonth',
            'countMax':'maxPayCount',
            'info':'displayInfo',
            'id':'act_id'
        },
        mini:{
            'count':'n',
            'countFixed':'da',
            'countMax':'',
            'toPayway':'as',
            'success':'ru',
            'channelOff':'dc'
        }
    };

    /**
     * @requires jquery
     * @requires ./util
     * @requires ./user
     * @requires ./browser
     * @exports pay-mobile
     * @type {{init: init, open: open, _getUrl: _getUrl, _getMiniUrl: _getMiniUrl, _getQzoneUrl: _getQzoneUrl}}
     */
    var MOD = {
        /**
         *
         * @param options
         * @returns {MOD}
         */
        init:function (options) {
            var currentUrl = location.href;
            //手机版默认使用当前活动页
            if(!('success' in options) || typeof(options.success)!='string') {	 //success配置非字符串时也要拼上默认值，防止给pc端的是函数回调
                options.success = currentUrl;
            }

            this.options = options;

            return this;
        },
        /**
         *
         * @returns {MOD}
         */
        open:function () {
            var opts = this.options;

            if(opts.ui === 'mini' && opts.type === 'item'){
                opts.ui = 'midas';
            }

            this._getUrl(opts.ui).done(function (url) {
                location.href = url;
            });

            return this;
        },
        _getUrl: function (type) {
            var that = this;
            var url = this.url;

            var defer = $.Deferred(),
                fn = {
                    'mini': '_getMiniUrl',
                    'qzone': '_getQzoneUrl',
                    'midas': '_getMidasUrl'
                }[type];

            if (url) {
                defer.resolve(url);
            } else {
                this[fn]().done(function (url) {
                    that.url = url;
                    defer.resolve(url);
                });
            }

            return defer;
        },
        /**
         * 参数文档链接 http://tapd.oa.com/pay/wikis/view/%2525E7%2525A7%2525BB%2525E5%25258A%2525A8%2525E7%2525AB%2525AF%2525E5%25258C%252585%2525E6%25259C%252588%2525E3%252580%252581%2525E7%252582%2525B9%2525E5%252588%2525B8%2525E3%252580%252581Q%2525E5%2525B8%252581%2525E5%252585%252585%2525E5%252580%2525BC%2525E5%252589%25258D%2525E7%2525AB%2525AF%2525E6%25258E%2525A5%2525E5%252585%2525A5%2525E6%25258C%252587%2525E5%2525BC%252595/
         * @param {Object} options 这里标记下内部this.options配置参数
         * @param {Number} [options.apf] 1-新活动平台，不传为老活动平台
         * @param {String|Number} [options.u] 当前用户uin，sid登录态下必传
         * @param {String|Number} [options.u2] 开通目标uin，赠送好友时使用
         * @returns {*}
         * @private
         */
        _getMiniUrl: function () {
            var defer = $.Deferred();

            var url = 'http://pay.qq.com/h5/index.shtml';
            var opts = this.options;

            // 参数名映射处理，及参数的适配
            var map = MAP.mini;
            for (var key in map) {
                if (map.hasOwnProperty(key) && opts.hasOwnProperty(key)) {
                    // 不存在原名参数才用映射参数
                    if (map[key] && !opts.hasOwnProperty(map[key])) {
                        opts[map[key]] = opts[key];
                    }
                    // 删除无用映射前参数
                    try {delete opts[key];} catch(e) {opts[key] = undefined;}
                }
            }
            opts.m = 'buy';	//minipay的固定参数

            // 修复sid登录态参数，返回最终url
            var fixLoginTicket = function() {
                if (!(cookie.get('uin') && cookie.get('skey')) && user.getSid()) { // 没有skey登录态才使用sid登录态
                    user.userinfo().done(function (userinfo) {
                        opts.u = userinfo.uin;
                        opts.sid = user.getSid();
                        url = util.appendUrlParam(url, opts);
                        defer.resolve(url);
                    });
                } else { // skey登录态或没有登录态
                    url = util.appendUrlParam(url, opts);
                    defer.resolve(url);
                }
            };

            var vipType = opts.type; // 开通类型
            try {delete opts.type;} catch(e) {opts.type = undefined;}

            // 新老平台区分分支处理，老平台将废弃
            if (opts.apf == 1) { // 新活动平台，先走下单逻辑
                this._orderMini(vipType, opts).done(function(orderData) {
                    // MP，业务码由后台指定
                    opts.c = orderData.code || '';
                    opts.mpid = orderData.vip_ma || '';
                    opts.aid = JSON.stringify({
                        'apf': '1',
                        'preorder_bill': orderData.billno
                    });
                    // 删除已处理的不必要属性
                    $(['id', 'ruleid', 'adv_ref', 'apf']).each(function(i, key) {
                        try {delete opts[key];} catch (e) {opts[key] = undefined;}
                    });
                    fixLoginTicket();
                });
            } else { // 老活动平台，保持原样，将逐渐废弃
                //拼装业务代码（c）、mp单号（mpid）
                switch (vipType) {
                    case 'vip':
                        opts.mpid = 'MA20140317151449613'; // 这里已经确认是老平台
                        opts.c = 'xxjzgw';
                        break;
                    case 'deluxe':
                        opts.mpid = 'MA20140318212604945';
                        opts.c = 'xxjzghh';	//只有开通豪华版，不能续费豪华版
                        break;
                    case 'deluxe.update':
                        opts.mpid = 'MA20140318212604945';
                        opts.c = 'xxjzsj';
                        break;
                    case 'item':
                        opts.mpid = '';
                        opts.c = '';
                        break;
                }
                // 拼接aid参数
                var aid = {},
                    aidMap = {
                        'id': 'aid',
                        'ruleid': 'ruleid',
                        'name': 'name',
                        'adv_ref': 'adv_ref',
                        'orderOpts': 'orderOpts',
                        'upre': 'upre',
                        'apf': 'apf'
                    };
                for (var key in aidMap) {
                    if (aidMap.hasOwnProperty(key) && opts.hasOwnProperty(key)) {
                        aid[aidMap[key]] = opts[key];
                        // 除了upre，其它需要转换为字符串类型
                        if (key !== 'upre') {
                            aid[aidMap[key]] += '';
                        }
                        // 删除无用映射前参数
                        try {delete opts[key];} catch (e) {opts[key] = undefined;}
                    }
                }
                opts.aid = JSON.stringify(aid);
                fixLoginTicket();
            }


            return defer;
        },
        /**
         * minipay下单，先将需要的参数传给后台，获取单号
         * @param opts
         * @returns {*}
         * @private
         */
        _orderMini: function(vipType, opts) {
            var defer = $.Deferred();
            // 开通类型映射
            var type = {
                'vip': 1,
                'deluxe': 2
            }[vipType];
            data.post('http://activity.qzone.qq.com/fcg-bin/fcg_qzact_minipay_preorder', {
                actid: opts.id,
                ruleid: opts.ruleid,
                extend_field: util.toUrlParam({
                    platform: 2, // pc-1 手机-2
                    adv_ref: opts.adv_ref || ''
                }),
                vip_type: type
            }).done(function(o) {
                defer.resolve(o.data);
            }).fail(function(o) {
                defer.reject(o);
                msg.show('fail', o.message || '下单失败');
            });
            return defer;
        },
        _getQzoneUrl:function () {
            var defer = $.Deferred();
            var opts = this.options,
                 map = MAP.qzone;
            if(opts.type=='deluxe') {
                alert('手机版Qzone内支付不支持豪华版');
                return defer;
            }

            var url = 'http://qzs.qq.com/qzone/mall/mobile/common/pay/index.html',
                 urlParams;

            for(var key in opts) {
                if(opts.hasOwnProperty(key)) {
                    if(map[key]) {	//存在映射
                        opts[map[key]] = opts[key];
                        opts[key] = undefined;
                        try {
                            delete opts[key];
                        }catch(e) {}
                    }
                }
            }

            //根据业务类型来修正参数
            switch(opts.type) {
                case 'vip':
                    break;
                case 'deluxe':
                    break;
                case 'item':
                    opts.cgi = 'pic';
                    break;
            }
            delete opts.type;

            user.userinfo().done(function (userinfo) {
                opts.B_UID = userinfo.uin;
                opts.sid = user.getSid();
                urlParams = util.toUrlParam(opts);	//因为$.param会执行函数，所以这里使用自己写的urlParam
                url = url+'?'+urlParams;
                defer.resolve(url);
            });

            return defer;
        },
        _getMidasUrl : function(){
            var that = this;
            var defer = $.Deferred();
            var opts = this.options,
                params = {};
            var url = 'http://pay.qq.com/h5/index.shtml';

            params['m'] = 'buy';
            params['c'] = 'goods';
            params['appid'] = '1450001014';
            params['ru'] = opts.success ? opts.success : location.href;
            params['hu'] = params['pu'] = opts.error ? opts.error : location.href;
            params['pf'] = 'qzone_m_qq-1000-cp-1000-act';
            if(opts.sandbox){
                params['sandbox'] = 1;
            }
            //登录态判断
            if(user.getSid()) {	//使用sid登录态
                user.userinfo().done(function (userinfo) {
                  /*  //如果有skey，就不要sid，现在这个版本先不动，因为ios端独立版种cookie不规范，后期再加上
                    var skey = cookie.get('skey'),
                        uin = cookie.get('uin');
                    if (!skey || !uin) {
                        params['u'] = userinfo.uin;
                        params['sid'] = user.getSid();
                    }*/
                    params['u'] = userinfo.uin;
                    params['sid'] = user.getSid();

                    that._orderMidas(userinfo,function(res){
                        params['params'] = res.url_params;
                        urlParams = util.toUrlParam(params);	//因为$.param会执行函数，所以这里使用自己写的urlParam
                        url = url+'?'+urlParams;
                        defer.resolve(url);
                    });
                });
            }else {	//没有登录态、或者使用skey登录态（下单cgi不支持skey登录态），跳往登录
                user.showLogin();
            }

            return defer;
        },
        _orderMidas : function(userinfo,cb){
            var that = this;
            var iteminfo,iteminfoArr = [];

            if($.isArray(that.options.id) || $.isArray(that.options.count)){
                for(var i = 0; i < that.options.id.length; i++){
                    iteminfoArr.push(that.options.id[i] + '*' + that.options.count[i]);
                }
                iteminfo = iteminfoArr.join('|');
            }else{
                iteminfo = that.options.id + '*' + that.options.count;
            }

            var data = {
                callback : 'order_Callback',
                userid : userinfo.uin,
                userkey : user.getSid(),
                appid : 1450001014, //appid
                zoneid : '1',//暂不支持分区，统一传1
                pic_act_name : that.options.info,
                pic_act_dsc : that.options.info,
                iteminfo : iteminfo,
                adv_ref : that.options.adv_ref,
                pfkey : 'pfkey' //传'pfkey'
            };

            /*if(user.getSid()){
                data.login_type = 2;
                data.login_key = user.getSid();
            }*/
            //活动需要的额外配置
            for (var key in this.options.orderOpts){
                data[key] = this.options.orderOpts[key];
            }

            ajax.request({
                url : 'http://playzone2.qzone.qq.com/fcg-bin/fcg_get_orders_midas',
                dataType : 'jsonp',
                jsonpCallback : 'order_Callback',
                jsonp : true,
                data : data,
                success : function(res){
                    if(res.code === 0){
                        cb && typeof(cb) === 'function' && cb(res.data);
                    }else{
                        msg.show('fail',res.message || '下单失败');
                    }
                },
                error :function(){
                    msg.show('fail','系统繁忙');
                }
            });
        }
    };

    return MOD;
});
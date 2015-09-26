/**
 * @fileOverview 支付组件PC接口
 * @requires jquery
 * @requires ./util
 * @requires ./msg
 * @requires ./data
 */
define(function (require, exports, module) {
    var $ = require('jquery'),
        util = require('./util'),
        msg = require('./msg'),
        data = require('./data'),
        browser = require('./browser');

    //参数统一映射
    var MAP = {
        qzone: {
            'id': 'actId',
            'countOptions': 'options',
            'countMax': 'maxPayMonth',
            'count': 'defaultMonth',
            'info': 'displayInfo'
        },
        mini: {
            'count': 'amount',
            'countOptions': 'presetAmount',
            'channelOff': 'channels',
            'info': 'actinfo',
            'success': 'onSuccess',
            'error': 'onError'
        }
    };

    //给Qzone内支付弹窗用的关闭回调函数名
    var CLOSE_KEY = '_QZPAYCLOSE',
        SUCCESS_KEY = '_QZPAYSUCCESS',
        SUCCESS_BANK_KEY = '_QZPAYSUCCESSBANK',
        CLOSE_FNS = window[CLOSE_KEY] = window[CLOSE_KEY] || {},
        SUCCESS_FNS = window[SUCCESS_KEY] = window[SUCCESS_KEY] || {},
        SUCCESS_BANK_FNS = window[SUCCESS_BANK_KEY] = window[SUCCESS_BANK_KEY] || {};

    var MOD = {
        /**
         *
         * @param options
         * @returns {this}
         */
        init: function (options) {
            this.options = options;

            return this;
        },
        /**
         *
         * @returns {this}
         */
        open: function () {
            var opts = this.options,
                fn = {
                    'mini': '_openMini',
                    'qzone': '_openQzone'
                }[opts.ui];

            this[fn]();

            return this;
        },
        /**
         * 打开qzone的内支付
         * @param
         */
        _openQzone: function () {
            var opts = this.options;
            var url = this._getQzoneUrl();
            var title = opts.name || {
                    'vip': '开通黄钻',	//默认标题
                    'deluxe': '开通豪华版黄钻'
                }[opts.type] || '  ';

            require.async('qzact/common.pc/popup/dialog', function (Dialog) {
                Dialog({
                    title: title,
                    skin: 'dialog-s',
                    width: '460px',
                    height: opts.type == 'deluxe' ? '479px' : '300px',
                    padding: '',
                    fixed: true,
                    content: '<div></div>',
                    ok: false,
                    onclose: function () {
                        var id = this.id;
                        //关闭后要把成功、关闭回调都删掉
                        try {delete CLOSE_FNS[id];} catch (e) {CLOSE_FNS[id] = undefined;}
                        try {delete SUCCESS_FNS[id];} catch (e) {SUCCESS_FNS[id] = undefined;}
                        try {delete SUCCESS_BANK_FNS[id];} catch (e) {SUCCESS_BANK_FNS[id] = undefined;}
                        //还原resize方法
                        if (window.M && M.util && M.util.dialog) {
                            M.util.dialog.resize = M.util.dialog._temp_resize;
                        }
                    },
                    onshow: function () {
                        var that = this;
                        var id = this.id,
                            success = typeof(opts.success) == 'function' ? opts.success : false,
                            successBank = typeof(opts.successBank) == 'function' ? opts.successBank : false;

                        url = [url,
                            'closeDialogFn=' + [CLOSE_KEY, id].join('.'),
                            (success ? ('succCallback=' + [SUCCESS_KEY, id].join('.')) : ''),
                            (successBank ? ('bankPayConfirm=' + [SUCCESS_BANK_KEY, id].join('.')) : '')
                        ].join('&');

                        var ifr = '<iframe height="100%" src="' + url + '" frameborder="0" scrolling="no" allowTransparency="true"></iframe>';
                        this.contentNode.innerHTML = ifr;

                        //给支付iframe的关闭回调
                        CLOSE_FNS[id] = function () {
                            Dialog.get(id).close();
                        };

                        //加入成功回调
                        if (success) {
                            SUCCESS_FNS[id] = function () {
                                success && success.call(that);
                                return false;
                            };
                        }
                        //加入银行支付成功回调
                        if (successBank) {
                            SUCCESS_BANK_FNS[id] = function () {
                                successBank && successBank.call(that);
                                return false;
                            };
                        }

                        //加入resize函数
                        window.M = window.M || {};
                        M.util = M.util || {};
                        M.util.dialog = M.util.dialog || {};
                        M.util.dialog._temp_resize = M.util.dialog.resize;	//保存备份，onclose的时候还原
                        M.util.dialog.resize = function (w, h) {
                            that.height(h);
                            that.width(w);
                        };
                    }
                }).showModal();
            });
        },
        _getQzoneUrl: function () {
            var url = this.url;
            if (!url) {
                url = this.url = this._getQzoneUrlAnew();
            }
            return url;
        },
        _getQzoneUrlAnew: function () {
            var opts = $.extend({}, this.options),	//防止重写
                map = MAP.qzone;
            var urlMap = {
                    'vip': 'http://qzs.qq.com/qzone/mall/app/pay_for_vip/v4/index.html',
                    'deluxe': 'http://qzs.qq.com/qzone/mall/app/pay_for_deluxe_vip/index.html'
                },
                url = urlMap[opts.type] || urlMap['vip'],
                urlParams;

            for (var key in opts) {
                if (opts.hasOwnProperty(key)) {
                    if (map[key]) {	//存在映射
                        opts[map[key]] = opts[key];
                        try {delete opts[key];} catch (e) {opts[key] = undefined;}
                    }
                }
            }

            if (opts.countFixed) {	//参数纠正：不可修改月份
                opts.selection = opts.defaultMonth;
                delete opts.defaultMonth;
            }

            //根据业务类型来
            switch (opts.type) {
                case 'vip':
                    break;
                case 'deluxe':
                    break;
                case 'item':
                    opts.mode = 'single'
                    break;
            }
            delete opts.type;

            urlParams = util.toUrlParam(opts);
            url = url + '#' + urlParams;

            return url;
        },
        /**
         * 打开mini支付浮层
         * @private
         */
        _openMini: function () {
            this._getMiniOption().done(function(opts) {
                require.async('http://imgcache.qq.com/bossweb/ipay/js/api/cashier.js', function () {
                    cashier.dialog.buy(opts);
                });
            });
        },
        /**
         * 获取minipay支付参数，含适配逻辑
         * 参数文档链接 http://tapd.oa.com/pay/wikis/view/%2525E6%252596%2525B0%2525E7%252589%252588minipay%2525E6%25258E%2525A5%2525E5%252585%2525A5%2525E8%2525AF%2525B4%2525E6%252598%25258E?fromedit=1/
         * @private
         */
        _getMiniOption: function () {
            var defer = $.Deferred();
            var opts = $.extend({}, this.options);	//防止重写

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
            // 供选择月份，将1_2_3换成1,2,3格式
            if (opts.presetAmount) {
                opts.presetAmount = opts.presetAmount.replace(/[_]+/g, ',')
            }
            // 不允许用户输入
            if (opts.input == 0 && opts.presetAmount) {
                opts.presetAmount = ('!' + opts.presetAmount).replace('!!', '!');
            }
            // 不允许修改开通月份/年份
            if (opts.countFixed == 0 && opts.amount) {
                opts.amount = ('!' + opts.amount).replace('!!', '!');
            }
            // 注入错误回调，预处理错误码
            var errorCallback = opts.onError;
            opts.onError = function (res) {
                var errList = res.error_code_list;
                var errCode = errList.split('-').pop() + '';    // 字符串方式处理
                var subCode = errCode.substr(-3, 3);            // 营收后台错误码
                // 错误分为3级，这里是最后一级对应错误提示映射表
                var errCodeMap = {
                    '65570': '您的黄钻开通时长已达上限'
                };
                // 这里是最后一级错误码的最后3位错误提示映射表，营收特有
                var subCodeMap = {
                    '701': '活动规则不存在',
                    '706': '活动规则不匹配',
                    '707': '活动支付类别不匹配',
                    '708': '活动还没有开始，请耐心等待',
                    '709': '活动已经结束',
                    '715': '物品余量不足',
                    '717': '个人资格不足',
                    '727': '活动支付月份不匹配',
                    '729': '已经购买过了',
                    '732': '活动已经下线',
                    '737': '今日物品余量不足'
                };
                if (errCodeMap[errCode]) {
                    msg.show('fail', errCodeMap[errCode]);
                } else if (subCodeMap[subCode]) {
                    msg.show('fail', subCodeMap[subCode]);
                }
                errorCallback && errorCallback.call(null, res);
            };
            // 参数type有冲突，这里修正
            var vipType = opts.type; // 开通类型
            opts.type = 'service';

            // 新老平台区分分支处理，老平台将废弃
            if (opts.apf == 1) { // 新活动平台，先走下单逻辑
                this._orderMini(vipType, opts).done(function(orderData) {
                    // MP，业务码由后台指定
                    opts.codes = orderData.code || '';
                    opts.actid = orderData.vip_ma || '';
                    // 后台要求必须先对aid进行URL编码
                    opts.aid = encodeURIComponent(JSON.stringify({
                        'apf': '1',
                        'preorder_bill': orderData.billno
                    }));
                    // 删除已处理的不必要属性
                    $(['id', 'ruleid', 'adv_ref', 'apf']).each(function(i, key) {
                        try {delete opts[key];} catch (e) {opts[key] = undefined;}
                    });
                    defer.resolve(opts);
                });
            } else { // 老活动平台，保持原样，将逐渐废弃
                // 拼装业务代码（codes），mp单号
                switch (vipType) {
                    case 'vip':
                        opts.codes = 'xxjzgw';
                        opts.actid = 'MA20140317151449613'; // 这里已经确认是老平台
                        break;
                    case 'deluxe':
                        opts.codes = 'xxjzghh';	//只有开通豪华版，不能续费豪华版
                        opts.actid = 'MA20140318212604945';
                        break;
                    case 'deluxe.update':
                        opts.codes = 'xxjzsj';
                        break;
                    case 'item':
                        opts.codes = '';
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
                // 后台要求必须先对aid进行URL编码
                opts.aid = encodeURIComponent(JSON.stringify(aid));
                defer.resolve(opts)
            }

            return defer;
        },
        /**
         * minipay下单，先将需要的参数传给后台，获取单号
         * @param vipType 开通类型 vip|deluxe
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
                    platform: 1, // pc-1 手机-2
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
        }
    };

    return MOD;
});

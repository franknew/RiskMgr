/**
 * @fileOverview 支付主接口
 * @requires jquery
 * @requires ./util
 * @requires ./browser
 * @requires ./classes
 * @requires ./pay.mobile
 * @requires ./pay.pc
 */
define(function (require, exports, module) {
    var $ = require('jquery'),
        util = require('./util'),
        isMobile = require('./browser').isMobile,
        clone = require('./classes').clone;

    var payMobile = require('./pay.mobile'),
        payPC = require('./pay.pc');

    /**
     * @requires jquery
     * @requires ./util
     * @requires ./browser
     * @requires ./classes
     * @requires ./pay.mobile
     * @requires ./pay.pc
     * @exports pay
     * @type {{_DefaultConfig: {type: string, ui: string}, _initKey: string, init: init, bind: bind, open: open, _initOptions: _initOptions, _initPay: _initPay}}
     * @example for 手机按条 pay.open({ui:'mini',type: "item",id:'872159',count: '1',info : '10点魔法值',success : '',orderOpts : {rekey:'five',rank_id : 11011}});
     *           //手机按条（midas）同时有多个id合并支付时（如梦想秀），id和count可传数字，如id:['872159','872158'],count:[1,2],id和count的下标需一一对应
     * @example for  手机包月 pay.open({ui: "mini",type: 'vip',id: 21811,count: "1",success: encodeURIComponent(location.href),error: encodeURIComponent(location.href)});
     */
    var MOD = {
        /**
         * 默认配置
         */
        _DefaultConfig: {
            type: 'vip'	//支付类型：[vip: 普通包月]  [deluxe: 豪华版包月] [deluxe.update:豪华版升级（5元）] [item: 按条支付]
            , ui: 'mini'	//使用哪种界面，可选有：qzone（黄钻自己的内支付），mini（支付平台的minipay）
            //,id:''	 //支付的actId
            //,name:''	//活动名称，PC版(非minipay)会把这个参数做为浮层标题，
            //,count:1	 //默认选择的月份、数量
            //,countMax:0	//最大可以选的月份、数量，0为不限制，仅PC支持
            //,countFixed:0	 //不可让用户更改月份、数量
            //,countOptions:'1_2_3'	//配置options选项，下划线分隔多个选项，仅PC支持
            //,info:''	//显示在组件上方的提示信息，仅PC支持  || 手机按条(midas)支付界面显示的物品名称，非必填，仅midas支持
            //,toPayway:0	//是否直接进入支付方式选择界面，仅minipay手机版支持
            //,adv_ref:''	//后台统计支付来源
            //,success:null	//手机版：配制为成功支付后跳转url；  PC版：配置为成功支付后需要执行的函数名
            //,successBank:null	//银行、财付通支付成功后的回调，仅PC版qzone支持，pc版Minipay统一到success函数，但不可信
            //,error:null
            //,sandbox:0	 //是否使用测试环境，仅minipay&midas手机版支持（也可以通过给页面url带sandbox=1参数来进入测试环境）
            //,channelOff:	'qdqb,cft,bank' //仅手机minipay支持，强制屏蔽的渠道的渠道代码的列表，多个用","隔开。bank:银行卡快捷支付，qdqb:Q点Q币，qbqd:Q币Q点，cft:财付通，qqcard:QQ卡，mcard:手机充值卡，wechat:微信支付，hfpay:手机话费，yb:元宝。
            //,orderOpts : {Object}//有一些活动有特殊逻辑，下单时需要额外的参数，统一放在这个对象里
            //,upre: 赠送好友通用，对象数组方式传递，例：[{"uin": 900000280}, {"uin": 900000929}],注意uin要整型
        },
        _initKey: '___HASINIT___',
        /**
         * 初始化
         * @param options {Object} 配置参数
         * @param callback {String} 初始化完成之后执行的回调
         */
        init: function (options, callback) {
            var initkey = this._initKey,
                obj;

            if (this[initkey]) {	 //已经初始化
                obj = this;
            } else {	//需要进行初始化
                obj = clone(MOD);
                obj[initkey] = true;
                obj._initOptions(options);
                obj._initPay();	//初始化支付接口
            }

            callback && callback.call(obj);

            return obj;
        },
        /**
         * 给指定按钮绑定点击事件，打开支付组件
         * @param button {DOMElement} 需要绑定的按钮
         * @param options {Object} 配置，见_DefaultConfig
         */
        bind: function (button, options) {
            //必须经过初始化
            this.init(options, function () {
                var that = this,
                    opts = this.options;
                $(button).bind('click', function (ev) {
                    ev.preventDefault();
                    that.open();
                });
            });

            return this;
        },
        /**
         *
         * @param options
         */
        open: function (options) {
            this.init(options, function () {	//必须经过初始化
                this.pay.open();	//直接用支付接口的open
            });
        },
        /**
         * 初始化配置项
         */
        _initOptions: function (options) {
            options = this.options = $.extend({}, this._DefaultConfig, options);	 //默认配置

            var params = util.parseUrl(location.href).params || {};
            if (!('adv_ref' in options) && params.adv_ref) {	//获取当前页面的adv_ref，透传给组件
                options.adv_ref = params.adv_ref;
            }

            if (params.sandbox) {	//根据页面的参数来启用沙箱
                options.sandbox = 1;
            }

            return options;
        },
        /**
         * 初始化支付对象
         */
        _initPay: function () {
            var opt = this.options,
                obj,
                payObj;

            //根据UA来选择使用什么支付组件
            if (isMobile) {
                payObj = payMobile;
            } else {
                payObj = payPC;
            }

            //统一进行克隆
            obj = clone(payObj);
            obj.init(opt);

            this.pay = obj;
        }
    };

    return MOD;
});
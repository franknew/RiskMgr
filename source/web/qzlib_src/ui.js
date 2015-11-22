/**
 * @fileOverview 一些公用的UI组件
 * @require jquery
 */
define(function (require, exports, module) {
    var $ = require('jquery'),
        util = require('./util'),
        browser = require('./browser');

    /** 显示支付浮层
     * @param title {String} 浮层标题，只有PC有
     * @param args {Object} 浮层参数，会带给iframe页
     */
    exports.showPay = (function () {
        var _closeKey = '__QZACT_PAY_POP';	 //给PC弹窗用的关闭回调函数名
        window[_closeKey] = window[_closeKey] || {};

        return function (title, args) {
            require.async('v8/engine/popup/dialog', function (dialog) {
                var payArgs = $.param(args);
                var d = dialog({
                    title: title || '  ',
                    skin: 'dialog-s',
                    width: '460px',
                    height: '300px',
                    padding: '',
                    fixed: true,
                    content: '<div></div>',
                    ok: false,
                    onshow: function () {
                        var id = this.id;
                        var url = 'http://qzs.qq.com/qzone/mall/app/pay_for_vip/v4/index.html';
                        var ifr = '<iframe height="100%" src="' + url + '#closeDialogFn=' + _closeKey + '.closeDialog_' + id + '&' + payArgs + '" frameborder="0" scrolling="no" allowTransparency="true"></iframe>';
                        this.contentNode.innerHTML = ifr;

                        //给支付iframe的关闭回调
                        window[_closeKey]['closeDialog_' + id] = function () {
                            seajs.use('v8/engine/popup/dialog', function (dialog) {
                                dialog.get(id).close();
                                window[_closeKey]['closeDialog_' + id] = null;
                                delete window[_closeKey]['closeDialog_' + id];
                            });
                        };
                    }
                });
                d.showModal();
            });
        };
    })();

    /**
     * 显示中奖记录，只适用语新活动平台
     * @param actId
     */
    exports.showRecord = function(actId) {
        var targetUrl = 'http://qzs.qzone.qq.com/qzone/qzact/common.m/record/v2/index.html?act_id=' + actId;
        if (browser.platform === 'pc') {
            require.async('qzact/common.pc/record/index', function(Record) {
                Record.show(actId);
            });
        } else if (browser.client === 'qq') {
            require.async('qqapi', function() {
                mqq.ui.openUrl({
                    url: targetUrl,
                    target: 1,
                    style: 3
                });
            });
        } else if (browser.client === 'qzone') {
            require.async('qzoneapi', function() {
                mqq.invoke('ui', 'openUrl', {
                    url: targetUrl,
                    target: 1,
                    style: 3
                });
            });
        } else {
            util.jumpto(targetUrl);
        }
    };

    /**
     * 显示填写地址
     * @param actId
     */
    exports.showAddress = function(actId) {
        var targetUrl = 'http://qzs.qzone.qq.com/qzone/qzact/common.m/address/index.html?act_id=' + actId;
        if (browser.platform === 'pc') {
            require.async('qzact/common.pc/address/index', function(Address) {
                Address.show(actId);
            });
        } else if (browser.client === 'qq') {
            require.async('qqapi', function() {
                mqq.ui.openUrl({
                    url: targetUrl,
                    target: 1,
                    style: 3
                });
            });
        } else if (browser.client === 'qzone') {
            require.async('qzoneapi', function() {
                mqq.invoke('ui', 'openUrl', {
                    url: targetUrl,
                    target: 1,
                    style: 3
                });
            });
        } else {
            util.jumpto(targetUrl);
        }
    };
});
/**
 * @fileOverview msg组件适用于pc和mobile
 * @requires jquery
 * @requires ./browser
 * @requires ./util
 * @requires ./tmpl
 */
define(function (require, exports, module) {
    var browser = require('./browser');
    var util = require('./util');
    var tmpl = require('./tmpl');
    var $ = require('jquery');
    var pcIcon = {
        succ: 'succeed',    //成功提示
        fail: 'fail',       //失败提示
        info: 'info',       //信息提示，默认
        warn: 'warning',    //警告提示
        loading: 'loading'  //加载中
    };

    var isMobile = require('./browser').isMobile;

    var mIcon = {
        succ: 'hook',
        fail: 'cancel',
        info: 'info',
        loading: 'loading'
    };

    var timeId, tips_css;

    /**
     * msg组件适用于pc和mobile
     * @exports msg
     * @type {{show: show}}
     * @requires jquery
     * @requires ./browser
     * @requires ./util
     * @requires ./tmpl
     */
    var mod = {
        /**
         * 信息展示
         * @param type  提示类型 默认info类型
         * @param content   提示内容
         * @param delay 延迟时间，默认2000ms
         */
        show: function (type, content, delay) {
            var self = this;

            //提示前，如果有另外一个提示框存在，清除定时器，立即销毁
            timeId && clearTimeout(timeId);
            self._hide();

            if (arguments.length == 1) { //只有一个参数时，默认为内容，info提示
                content = type;
                type = undefined;
            }
            delay = delay || 2000;
            if (isMobile) {
                var params = {
                    icon: mIcon[type] || mIcon['info'],
                    content: content || ''
                }
                tips_css || (tips_css = util.insertStyleSheet('tips_css', tmpl.mtips_css()));
                var $tips = $(tmpl.mtips(params)).appendTo(document.body);
                var currentHeight = $tips.css('top');
                $tips.css('top', -50);
                $tips.animate({top: currentHeight}, 300)
            } else {
                var params = {
                    type: pcIcon[type] || pcIcon['info'],
                    content: content || ''
                }
                //如果样式存在，则不再插入样式
                tips_css || (tips_css = util.insertStyleSheet('tips_css', tmpl.tips_css()));
                var $tips = $(tmpl.tips(params));
                self._fixedPosition($tips);
                $tips.appendTo(document.body);
            }

            timeId = setTimeout(self._hide, delay);

        },
        showm: function (type, content, delay) {

        },
        _hide: function () {
            $('#q_Msgbox').remove();
        },
        /**
         * 修复不支持position:fixed定位的情况
         */
        _fixedPosition: function ($tips) {
            // 判断是否IE6 ,取document.compatMode == "BackCompat" || version < 7
            if (document.compatMode == "BackCompat" || browser.msie && browser.version < 7) {
                var top = document.documentElement.scrollTop || document.body.scrollTop,
                    ch = document.documentElement.clientHeight || document.body.clientHeight;
                $tips.css({
                    position: 'absolute',
                    top: top + ch / 2
                });
            }
        }
    };

    return mod;
});
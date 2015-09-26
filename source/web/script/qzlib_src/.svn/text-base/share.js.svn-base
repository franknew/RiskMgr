/**
 * @fileOverview 分享组件适用于mobile
 * @requires jquery
 * @requires ./browser
 * @requires ./msg
 * @requires ./user
 * @requires ./util
 * @requires ./tmpl
 */
define(function (require, exports, module) {
    var $ = require('jquery');
    var browser = require('./browser'),
        msg = require('./msg'),
        user = require('./user'),
        util = require('./util'),
        ajax = require('./ajax'),
        stat = require('./stat'),
        cookie = require('./cookie'),
        tmpl = require('./tmpl');

    var showShareDialog = (function () {
        var dialogCss, shareDialog;

        function createHiddenIframe(url) {
            var f = document.createElement('iframe');
            f.id = 'payIframe';
            f.src = url;
            f.frameBorder = '0';
            f.style.left = '-1000px';
            f.style.position = 'absolute';
            f.style.zIndex = 999;
            document.getElementsByTagName('body')[0].appendChild(f);
            return f;
        }

        function sendShareReq(info) {
            var url = 'http://qzs.qq.com/qzone/qzact/common/share/share_xhr.html';
            if (browser.msie && browser.version <= 9) {
                url = 'http://qzs.qq.com/qzone/qzact/common/share/share_formsender.html';
            }
            var f = createHiddenIframe(url);
            var tmpFlag = false,	//超时标记
                tmpTimeoutDelay = 10000,		//超时时间
                tmpTimeout = null;		//超时定时器`

            var sid = user.getSid(),
                skey = cookie.get('skey'),
                uin = cookie.get('uin'),
                needFixMobile = false;

            // 没有skey，并且有sid，使用sid校验
            if (!(skey && uin) && sid) {
                needFixMobile = true;
                info.login_type = 2;
                info.login_key = sid;
                // 参数里面加上sid，兼容非活动的cgi
                info.sid = sid;
            }

            f.postData = {
                data: info,
                uri: 'http://activity.qzone.qq.com/fcg-bin/fcg_act_spread_share_v2?g_tk=' + user.getToken(),
                needFixMobile: needFixMobile
            };
            f.callback = function (res) {
                if (res.code === 0) {
                    clearTimeout(tmpTimeout);
                    msg.show('succ', '恭喜您，分享成功！');
                } else {
                    msg.show('fail', res.message || '系统繁忙，请稍后再试！');
                }
            }

            tmpTimeout = setTimeout(function () {
                tmpFlag = true;
                msg.show('fail', '分享超时');
            }, tmpTimeoutDelay);
        }

        return function (info) {
            var height, dialogTmpl;
            if (browser.isMobile) {
                dialogCss || (dialogCss = util.insertStyleLink('dialog_css', 'http://qzonestyle.gtimg.cn/qz-act/public/mobile/dialog-share-m.css'));
                height = $(window).scrollTop() + 200;
                dialogTmpl = 'shareDialogMobile';
            } else {
                dialogCss || (dialogCss = util.insertStyleLink('dialog_css', 'http://qzonestyle.gtimg.cn/qz-act/public/pc/dialog-share.css'));
                height = $(window).scrollTop() + 200;
                dialogTmpl = 'shareDialogPc';
            }

            shareDialog || (shareDialog = $(tmpl[dialogTmpl]({
                info: info,
                height: height + 'px',
                util: util
            })).appendTo(document.body));
            shareDialog.on('click', '#J_share_cancel', function () {
                shareDialog.remove();
                shareDialog = null;
            }).on('click', '#J_share_ok', function () {
                sendShareReq(info);
                shareDialog.remove();
                shareDialog = null;
            });
        };
    })();

    // 自定义微信分享内容
    function initWXShare(data) {
        require.async('wx_jssdk', function (wx) {
            ajax.request({
                url: 'http://activity.qzone.qq.com/fcg-bin/fcg_act_weixin_jssdk_sig',
                dataType: 'jsonp',
                qzoneCoolCbName: true,
                data : {
                    url : location.href.replace(location.hash,'')
                },
                success : function(res){
                    if (res.code === 0) {
                        var da = res.data;
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: da.appId, // 必填，公众号的唯一标识
                            timestamp: da.timestamp, // 必填，生成签名的时间戳
                            nonceStr: da.nonceStr, // 必填，生成签名的随机串
                            signature: da.signature,// 必填，签名，见附录1
                            jsApiList: [
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'onMenuShareQZone'
                            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                        wx.error(function(res){
                            if(res.errMsg === 'config:invalid signature'){
                                stat.returnCodeV4({
                                    domain : 'activity.qzone.qq.com',
                                    cgi: '/activity/wxjssdk/invalid_signature',
                                    type: 3,
                                    code: 1,
                                    delay: 300
                                });
                            }
                        });
                        wx.ready(function(){
                            var config = {
                                title: data.title, // 分享标题
                                desc: data.desc, // 分享描述
                                link: data.link, // 分享链接
                                imgUrl: data.img_url, // 分享图标
                                type: '', // 分享类型,music、video或link，不填默认为link
                                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                success: function(){

                                },
                                cancel: function(){

                                }
                            };
                            wx.onMenuShareAppMessage(config);
                            wx.onMenuShareQQ(config);
                            wx.onMenuShareQZone(config);
                            //朋友圈分享走特殊逻辑，只显示标题，所以这里判断是否要交换标题和内容

                            if(data.swapTitleInWX){
                                wx.onMenuShareTimeline({
                                    title: data.desc, // 分享标题
                                    desc: data.title, // 分享描述
                                    link: data.link, // 分享链接
                                    imgUrl: data.img_url, // 分享图标
                                    type: '', // 分享类型,music、video或link，不填默认为link
                                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                    success: function () {

                                    },
                                    cancel: function () {

                                    }
                                });
                            }else{

                                wx.onMenuShareTimeline(config);
                            }
                        });
                    }
                },
                error : function(){

                }
            });
        });
    }

    // 自定义手Q分享内容
    function initSQShare(data) {
        require.async('qqapi', function () {
            try {
                window.mqq.data.setShareInfo(data);
            } catch (e) {
            }
        });
    }

    // 自定义手空分享内容
    function initQZShare(data) {
        //qzone独立版
        require.async('qzoneapi', function () {
            if (QZAppExternal && QZAppExternal.setShare) {
                var imageArr = [],
                    titleArr = [],
                    summaryArr = [],
                    shareURLArr = [];
                for (var i = 0; i < 5; i++) {
                    imageArr.push(data.image_url);
                    titleArr.push(data.title);
                    summaryArr.push(data.desc);
                    shareURLArr.push(data.share_url);
                }
                QZAppExternal.setShare(function (data) {
                }, {
                    'type': 'share',
                    'image': imageArr,
                    'title': titleArr,
                    'summary': summaryArr,
                    'shareURL': shareURLArr
                });
            }
        });
    }

    // 初始化设置分享信息
    function initShareInfo(info){
        //如果是手机QQ平台，并且分享的是端链接，则使用中转地址分享
        var url = info.url;
        (function() {
            if (browser.client !== 'qq') {return;}
            // 需要代理手Q分享url的域名
            var hostList = [
                'm.qzone.com',
                'mobile.qzone.qq.com'
            ];
            var rs = util.parseUrl(url);
            if (-1 === $.inArray(rs.host, hostList)) {return;}
            var urlParams = rs.params;
            for (var key in urlParams) {
                if (urlParams.hasOwnProperty(key)) {
                    urlParams[key] = util.decodeHtml(urlParams[key]);
                }
            }
            urlParams.gourl = url;
            var curHost = location.host;
            if (curHost == 'act.qzone.qq.com') {
                url = 'http://act.qzone.qq.com/proxy/share.html';
            } else {
                url = 'http://'+ curHost  +'/qzone/qzact/act/proxy/share.html';
            }
            url = util.appendUrlParam(url, urlParams, false);
        })();

        switch (browser.client) {
            case 'wx':
                initWXShare({
                    img_url: info.pic,
                    link: info.url,
                    desc: info.summary,
                    title: info.title,
                    swapTitleInWX : info.swapTitleInWX
                });
                break;
            case 'qq':
                initSQShare({
                    share_url: url,
                    title: info.title,
                    desc: info.summary,
                    image_url: info.pic
                });
                break;
            case 'qzone':
                initQZShare({
                    share_url: info.url,
                    title: info.title,
                    desc: info.summary,
                    image_url: info.pic
                });
                break;
        }
    }

    //分享按钮点击自动上报
    function report(){
        var pathname = location.pathname,
            actpath = pathname.substring(0,pathname.lastIndexOf('/') + 1);
        stat.reportPV('mall.qzone.qq.com',actpath + 'share');
    }

    var shareInfo; // 初始化的分享信息缓存
    var mod = {
        /**
         * 初始化分享信息，在页面加载后调用
         * @param info
         * @param {string} [info.title] 分享标题
         * @param {string} [info.summary] 分享摘要
         * @param {string} [info.pic] 分享图片（最好正方形，尺寸小于200*200，）
         * @param {string} [info.url] 分享链接
         * @param {boolean} [info.swapTitleInWX] 微信里面交换标题摘要
         * @param {function} [info.onSuccess] 分享成功，仅分享到微信好友和朋友圈有效，分享到QQ和Qzone全都回调success
         * @param {function} [info.onCancel] 取消分享，仅分享到微信好友和朋友圈有效，分享到QQ和Qzone全都回调success
         * @param {string} [info.viewPlatformInQzone] 空间里面分享显示平台，phone为仅手机显示，不填默认pc和手机都显示
         */
        initShare: function (info) {
            if (!info) {
                return;
            }
            shareInfo = $.extend({}, info);
            initShareInfo(shareInfo);
        },

        /**
         * 右上角箭头引导设置APP分享
         */
        showArrow: function () {
            $(tmpl.shareArrow()).on('touchend', function (e) {
                e.preventDefault();
                $(this).remove();
            }).appendTo(document.body);
            report();
        },

        /**
         * 分享弹窗，CGI方式分享到QQ空间
         * @param info 不填则使用initShare方法提供的分享数据
         */
        share2Qzone: function (info) {
            var info = info || shareInfo || {
                    title: document.title,
                    summary: '',
                    pic: '',
                    url: location.href
                };
            showShareDialog(info);
            report();
        },

        /**
         * 引导分享，用户点击分享按钮后调用
         * @param info 不填则使用initShare方法提供的分享数据
         * @param [info.title] 分享标题
         * @param [info.summary] 分享摘要
         * @param [info.pic] 分享图片（最好正方形，尺寸小于200*200，）
         * @param [info.url] 分享链接
         * @param [info.swapTitleInWX] 微信里面交换标题摘要
         */
        showShare: function(info) {
            if (-1 !== $.inArray(browser.client, ['wx', 'qq', 'qzone'])) {
                info && initShareInfo(info);
                mod.showArrow();
            } else {
                mod.share2Qzone(info);
            }
        }
    };

    return mod;
});
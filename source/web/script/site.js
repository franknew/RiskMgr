/**
 * seajs-config
 * @date    2015-07-08 21:54:42
 * @version $Id$
 */

(function  () {
    
    var CDN = location.origin+location.pathname;
    seajs.config({
      alias:{
        'jquery':CDN+'script/lib/jquery-2.1.4/jquery.js',
        'bootstrap':CDN+'script/lib/bootstrap.js'
      },
      paths:{
        'risk':CDN+'script',
        'cdn':CDN
      }
    });

    seajs.use(['jquery','bootstrap','risk/page/frame/index'],function($) {
      
      //手机下菜单事件
      var menuButton = $("#J_MenuToggle");
      if (menuButton.is(':visible')) {
        //打开菜单
        menuButton.click(function(e){
          e.preventDefault();
          var elem = $(e.currentTarget),
          ul = $(elem.attr('data-target'));
          ul.slideToggle(300, 'swing', function () {});
        });
        //点击菜单时关闭
        $('#J_Vnavigation').on('click','a[href^="#page="]',function(e) {
          var ul = $(e.delegateTarget);
          ul.slideToggle(300, 'swing', function () {});
        });
      }

    });

    //初始化路由
    seajs.use(['jquery','risk/unit/route'],function($,route){
      route.init({
        header:'#J_Header',
        container:'#J_Body',
        index:'page=home',
        filter:function(url){ //规则  page=xxxx
          var hashIdx = url.indexOf('#');
          hashIdx = hashIdx===-1?0:hashIdx; //没有hash时默认找全字符串

          var mod= url.substr(hashIdx).match(/\bpage=([^=]+)\b/);
          mod = mod && mod[1];

          if (mod) {
            mod='risk/page/'+mod+'/index';
          }

          return mod || '';
        }
      });
    });

    //登录框
    seajs.use('risk/components/user/index',function(m) {
      if (!m.isLogin()) {
        //m.showLogin();
      }
    });

})();
/**
 * seajs-config
 * @date    2015-07-08 21:54:42
 * @version $Id$
 */

(function  () {
    
    var CDN = '/';
    seajs.config({
      alias:{
        'jquery':CDN+'script/lib/jquery-2.1.4/jquery.js'
      },
      paths:{
        'risk':CDN+'script/',
        'cdn':CDN
      }
    });

    //初始化框架页
    seajs.use('risk/page/frame/index');

    //初始化路由
    seajs.use(['jquery','risk/unit/route'],function($,route){
      route.init({
        container:'#J_Body',
        index:'risk/page/home/index',
        bind:'a[href^="#page="]',
        filter:function(url){
          var mod= url.substr(url.indexOf('#')).match(/\bpage=([^=]+)\b/);
          mod = mod && mod[1];

          if (mod) {
            mod='risk/page/'+mod+'/index';
          }

          return mod || '';
        }
      });
    });

})();
//create by jsc 
(function(){
var mods = [],version = parseFloat(seajs.version);
define(["lib","common","$","./tmpl","main","./file_list.file_list","./file_path.file_path","./toolbar.tbar","./view_switch.view_switch","./file_list.ui"],function(require,exports,module){

	var uri		= module.uri || module.id,
		m		= uri.split('?')[0].match(/^(.+\/)([^\/]*?)(?:\.js)?$/i),
		root	= m && m[1],
		name	= m && ('./' + m[2]),
		i		= 0,
		len		= mods.length,
		curr,args,
		undefined;
	    name = name.replace(/\.r[0-9]{15}/,"");
	//unpack
	for(;i<len;i++){
		args = mods[i];
		if(typeof args[0] === 'string'){
			name === args[0] && ( curr = args[2] );
			args[0] = root + args[0].replace('./','');
			(version > 1.0) &&	define.apply(this,args);
		}
	}
	mods = [];
	require.get = require;
	return typeof curr === 'function' ? curr.apply(this,arguments) : require;
});
define.pack = function(){
	mods.push(arguments);
	(version > 1.0) || define.apply(null,arguments);
};
})();
//js file list:
//mod_1/src/disk.js
//mod_1/src/ui.js
/**
 *
 * @author jameszuo
 * @date 13-2-28
 */
define.pack("./disk",["lib","common","$","./tmpl","main","./ui","./file_list.file_list","./file_path.file_path","./toolbar.tbar","./view_switch.view_switch"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        events = lib.get('./events'),

        Module = common.get('./module'),
        user_log = common.get('./user_log'),
        global_event = common.get('./global.global_event'),
        constants = common.get('./constants'),
        add_wy_appbox_event = common.get('./global.global_event').namespace('add_wy_appbox'),
        tmpl = require('./tmpl'),

        slice = [].slice,

        main_mod = require('main'),
        main_ui = main_mod.get('./ui'),

        undefined;

    var disk = new Module('disk', {

        ui: require('./ui'),

        params_invoke_map: {
            path: 'set_path'
        },

        set_path: function (path) {
            require('./file_list.file_list').set_path(path);
        },

        set_init_data: function (usr, rsp_body) {
            require('./file_list.file_list').set_init_data(usr, rsp_body);
        },

        /**
         * 渲染子模块
         * @param {Module} sub_module
         * @param {*} arg1
         * @param {*} arg2
         */
        render_sub: function (sub_module, arg1, arg2 /*...*/) {
            try {
                var args = slice.call(arguments, 1);
                sub_module.render.apply(sub_module, args);

                this.add_sub_module(sub_module);
            }
            catch (e) {
                console.error('disk.js:初始化 ' + sub_module.module_name + ' 模块失败:\n', e.message, '\n', e.stack);
            }
            return this;
        }
    });

    disk.on('render', function () {
        var
            ui = this.ui,
            file_list = require('./file_list.file_list'),
            file_list_ui = file_list.ui,
            file_path = require('./file_path.file_path'),
            tbar = require('./toolbar.tbar'),
            view_switch = require('./view_switch.view_switch');


        this.render_sub(tbar, main_ui.get_$bar1());
        this.render_sub(file_path, main_ui.get_$bar2());
        this.render_sub(view_switch, tbar.get_$el());
        this.render_sub(file_list, ui.get_$body());
        // 视图切换按钮嵌入在工具条上

        //APPBOX添加微云到主面板引导页面启动
        if (constants.IS_APPBOX) {
                require.async('add_wy_appbox', function (add_wy_appbox){
                    try {
                        add_wy_appbox.get("./add_wy_appbox");
                        add_wy_appbox_event.trigger('is_wy_in_appbox');
                    }catch (e) {

                    }
                });
        }
        
        // 当ui大小变动时，发出resize事件，使得main能动态调整主容器的大小
        this.listenTo(file_list_ui, 'frame_height_changed', function(){
            this.trigger('resize');
        });
    });
    return disk;
});/**
 * 网盘主体UI逻辑
 * @author jameszuo
 * @date 13-3-6
 */
define.pack("./ui",["lib","common","$","./tmpl","./toolbar.tbar","main","./disk","./view_switch.view_switch","./file_list.file_list","./file_list.ui","./file_path.file_path"],function (require, exports, module) {

    var lib = require('lib'),
        common = require('common'),

        $ = require('$'),
        collections = lib.get('./collections'),
        console = lib.get('./console'),
        text = lib.get('./text'),
        events = lib.get('./events'),
        routers = lib.get('./routers'),

        Module = common.get('./module'),
        query_user = common.get('./query_user'),
        user_log = common.get('./user_log'),
        global_event = common.get('./global.global_event'),
        global_function = common.get('./global.global_function'),
        upload_event = common.get('./global.global_event').namespace('upload2'),
        page_event = common.get('./global.global_event').namespace('page'),
//        disk_event = common.get('./global.global_event').namespace('disk'),
        constants = common.get('./constants'),
        mini_tip = common.get('./ui.mini_tip'),

        tmpl = require('./tmpl'),
        tbar = require('./toolbar.tbar'),

        main_mod = require('main'),
        main_main = require('main').get('./main'),
        main_ui = main_mod.get('./ui'),


        disk,
        view_switch,
        file_list,
        file_list_ui,
        file_path,

        undefined;


    var ui = new Module('disk_ui', {

        render: function () {
            disk = require('./disk');

            // 切换视图
            view_switch = require('./view_switch.view_switch');
            file_list = require('./file_list.file_list');
            file_list_ui = require('./file_list.ui');
            file_path = require('./file_path.file_path');

            this
                // 切换视图时更新UI
                .listenTo(view_switch, 'switch sidebar_view_change', function () {
                    this._update_view();
                })

                .listenTo(query_user, 'error', function (msg) {
                    mini_tip.error(msg);
                });
//
//                .listenTo(query_user, 'done', function (msg) {
//                    main_ui.sync_size();
//                });


            this
                .on('activate', function () {
                    this._update_view();
                    this.get_$body().show();

                    //目录上一次访问是从菜单离线文件入口进入，则跳转到根目录
                    var history = main_main.get_history(), len = history.length;
                    while(len){
                        len -= 1;
                        if( history[len] === 'disk' ){
                            break;
                        }
                        if( history[len] === 'offline' ){
                            file_list.load_root();
                            return;
                        }
                    }
                    //document.title = '微云';
                    file_path.activate();
                })

                .on('deactivate', function () {
                    this.get_$body().hide();
                    this.toggle_toolbar(constants.DISK_TOOLBAR.HIDE);
                    file_path.deactivate();
                });

        },

        _update_view: function () {
            var $body = this.get_$body();

            $body.toggleClass('ui-thumbview', view_switch.is_grid_view())
                .toggleClass('ui-listview', view_switch.is_list_view());

            // 修复 bug #48664938 webkit没有重绘 // james与11.25取消这段代码的注释：切换树的显示、隐藏状态后，appbox里没有重绘
//            this._fix_wk_layout();
        },

        // --- 获取一些DOM元素 ---------

        get_$body: function () {
            this.init_$doms();
            return this._$body;
        },

        init_$doms: function () {
            if (!this._$body) {
                this._$body = $('#_disk_body');
                if (!this._$body[0]) {
                    this._$body = $(tmpl['body']({ module: this })).appendTo(main_ui.get_$body_box());
                }
            }
        },

        get_$toolbar: function () {
            this.init_$doms();
            return $('#_disk_toolbar_container');
        },

        /**
         * 控制网盘toolbar的如果显示逻辑
         * @param type
         */
        last_tbar_type: null,
        toggle_toolbar: function (type) {
            if (type === this.last_tbar_type) {
                return;
            }
            this.last_tbar_type = type;
            var normal, offline;
            switch (type) {
                case(constants.DISK_TOOLBAR.NORMAL):
                    normal = true;
                    offline = false;
                    break;
                case(constants.DISK_TOOLBAR.HIDE):
                    normal = false;
                    offline = false;
                    break;
                case(constants.DISK_TOOLBAR.VIRTUAL_SHOW):
                    normal = false;
                    offline = true;
                    break;
            }
            if (normal) {
                tbar.toggle_toolbar('normal');
            } else if(offline) {
                tbar.toggle_toolbar('offline');
            } else {
                tbar.toggle_toolbar(null);
            }

            if (disk) {
                disk.trigger('resize');
            }
        },

        set_is_empty: function (empty) {
            this.get_$body().toggleClass('ui-view-empty', empty);
        },

        get_$sidebar: function (no_construct) {
            var $bar = $('#_disk_sidebar');
            if (!no_construct && !$bar[0]) {
                $bar = $('<div id="_disk_sidebar" class="dbview-nav"></div>');
                main_ui.get_$body_box().after($bar);
            }
            return $bar;
        },

        toggle_sidebar: function (visible) {
            this.get_$sidebar().css('display', visible ? '' : 'none'); // 避免覆盖css中的设置- james
            main_ui.get_$main_content().toggleClass('dbview-module', visible);
            this._fix_wk_layout();
        },

        // 强制webkit重绘
        _fix_wk_layout: $.browser.webkit && $.browser.version < '30' ? function () {
            this.get_$body().toggle().toggle();
        } : $.noop
    });


    ui.once('render', function () {

        var hack_uploaded_2_wy = false;

        // 客户端上传接口(拖拽上传、上传到微云)
        var inter_upload_files = function (file_num, file_path, source) {

            var files = file_num > 1 ? file_path.split('*') : file_path.split('\r\n');

            if (!files || files.length === 0) {
                return false;
            }


            var is_upload_2_wy = source === 'AIO' || routers.get_param('action') === 'qq_receive';

            // 上传到微云
            if (is_upload_2_wy) {

                hack_uploaded_2_wy = true;

                setTimeout(function () {
                    // 进入QQ收到的文件目录后，开始上传
                    file_list.enter_qq_receive(false, function () {
                        main_ui.get_$bar2().css('opacity',1);
                        main_ui.get_$main_content().css('opacity',1);
                        upload_event.trigger('start_upload_from_client', files, true);
                    });

                    user_log('upload_from_QQClient', undefined, undefined, {
                        os_type: constants.OS_TYPES.QQ
                    }); //code by bondli 修正qq传文件统计ID
                }, 100);
            }
            // 直接上传
            else if (source === 'DragDrop') {   //拖拽上传
                user_log('DISK_DRAG_UPLOAD');
                return upload_event.trigger('start_upload_from_client', files);
            }
        };

        // 进入 QQ收到的文件 目录
        var inter_enter_qq_receive = function (some_id) {

            if (!disk.is_activated()) {
                routers.go({ m: 'disk' });
            }

            // 进入根目录
            if (some_id === '/') {
                main_ui.get_$bar2().css('opacity',1);
                main_ui.get_$main_content().css('opacity',1);
                file_list.load_root(true, 0, true);
            }
            // 进入QQ目录
            else {

                //code by bondli 先把网盘列表和面包屑隐藏,解决视觉上多次跳转
                main_ui.get_$bar2().css('opacity',0);
                main_ui.get_$main_content().css('opacity',0);

                file_list.enter_qq_receive(true, function(){
                    main_ui.get_$bar2().css('opacity',1);
                    main_ui.get_$main_content().css('opacity',1);
                });
                user_log('view_from_QQClient', undefined, undefined, {
                    os_type: constants.OS_TYPES.QQ
                });
            }
        };


        // 等用户加载完成后，注册并启动这些事件
        var start_listening = function () {

            // 注册接口（如果客户端已调用过对应的接口，则会自动执行调用历史）
            global_function.register('WYCLIENT_EnterOfflineDir', inter_enter_qq_receive);
            global_function.register('WYCLIENT_UploadFiles', inter_upload_files);


            // 客户端有个问题，调用「上传到微云」和「到微云中查看」的参数是一样的，
            // 所以这里做了个hack，在客户端执行上传到微云的接口后，设置hack_uploaded_2_wy为true来防止重复进入「QQ收到的文件」
            // @james


            // 进入QQ收文件目录
            if (routers.get_param('action') === 'qq_receive' && !hack_uploaded_2_wy) {
                inter_enter_qq_receive();
            }
            else {
                main_ui.get_$bar2().css('opacity',1); //直出的时候隐藏了导航，这里给展示出来
                main_ui.get_$main_content().css('opacity',1);
            }
        };

        if (query_user.get_cached_user()) {
            start_listening();
        } else {
            query_user.once('load', start_listening);
        }
    });


    // 网盘激活时，才可拖拽上传
    page_event.on('check_file_upload_draggable', function () {
        if (!ui.get_$body().is(':visible')) {
            return false;
        }
    });

    return ui;
});
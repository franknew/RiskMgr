/**
 *
 * @author jameszuo
 * @date 13-2-28
 */
define(function (require, exports, module) {

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
});
/**
 * FileNode UI
 * @author jameszuo
 * @date 13-8-1
 */
define(function (require, exports, module) {
    var lib = require('lib'),
        common = require('common'),
        $ = require('$'),

        console = lib.get('./console'),
        events = lib.get('./events'),

        file_list_event = common.get('./global.global_event').namespace('disk/file_list'),

        undef;


    var FileNodeUI = function (file) {
        // is_selectable 是否可选中
        // is_selected 是否已选中
        // is_rendered 是否已渲染
        this._file = file;
    };

    FileNodeUI.prototype = {

        /**
         * 选中、取消选中文件
         * @param {Boolean} sel
         */
        set_selected: function (sel) {
            if (this.is_selectable() === false || this._is_selected === sel) {
                return false;
            }

            this._is_selected = sel;

            file_list_event.trigger('file_select_change', this._file, sel);

            return true;
        },

        /**
         * 判断文件是否已选中
         * @return {Boolean}
         */
        is_selected: function () {
            return !!this._is_selected;
        },

        /**
         * 标记文件是否已渲染
         * @param {Boolean} rend
         */
        set_rendered: function (rend) {
            this._is_rendered = rend;
        },

        /**
         * 判断文件是否已渲染
         * @return {Boolean}
         */
        is_rendered: function () {
            return this._is_rendered;
        },

        is_selectable: function () {
            var file = this._file;
            return file.is_selectable();
        },

        get_file: function () {
            return this._file;
        }
    };

    $.extend(FileNodeUI.prototype, events);

    return FileNodeUI;
});
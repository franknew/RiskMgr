/**
 * 文件全局映射
 * @author jameszuo
 * @date 13-6-26
 */
define(function (require, exports, module) {

    var map = {};

    module.exports = {

        /**
         * 通过文件ID获取文件实例
         * @param {String} id
         * @returns {FileObject|FileNode} FileObject的子类
         */
        get: function (id) {
            return map[id];
        },

        /**
         * 通过文件ID数组批量获取文件实例
         * @param {Array<String>} ids
         */
        get_all: function (ids) {
            var arr = [];
            if (ids && ids.length) {
                for (var i = 0, l = ids.length; i < l; i++) {
                    var f = this.get(ids[i]);
                    if (f) {
                        arr.push(f);
                    }
                }
            }
            return arr;
        },

        /**
         * 写入map
         * @param {String} id
         * @param {FileObject|FileNode} f
         */
        set: function (id, f) {
            map[id] = f;
            return f;
        },

        /**
         * 从map中删除
         * @param {String} id
         */
        remove: function (id) {
            var f = map[id];
            delete map[id];
            return f;
        }

    };

});
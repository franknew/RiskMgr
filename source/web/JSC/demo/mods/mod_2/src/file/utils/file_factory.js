/**
 * 文件工厂，用于生成各种类型的文件实例，并维持一个全局的缓存
 * @author jameszuo
 * @date 13-6-26
 */
define(function (require, exports, module) {
    var $ = require('$'),

        all_file_map = require('./file.utils.all_file_map'),

        FileNode = require('./file.file_node'),

        classes = {
            FileNode: FileNode
        },

        undef;

    module.exports = {

        /**
         * 生成指定类型的文件实例
         * @param {String} Class
         * @param {OBject} options
         * @returns {Class}
         */
        create: function (Class, options) {
            return new classes[Class](options);
        },

        /**
         * 通过CGI响应结果生成文件实例
         * @param {String|Function} type
         * @param {Object} data
         */
        create_from_cgi: function (type, data) {
            var Class = typeof type === 'string' ? classes[type] : type;
            return Class.from_cgi(data);
        }

    };

});